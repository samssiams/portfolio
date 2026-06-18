
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { SAM_CONTEXT } from "@/lib/sam-context";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Basic in-memory rate limiting (per server instance — fine for low-traffic
// portfolios on serverless; resets on cold start). For stricter limits across
// instances, swap this for a service like Upstash Redis.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestLog = new Map<string, number[]>();
const RESUME_REPLIES = [
  "Absolutely. Sam's resume is ready here: [RESUME_LINK]",
  "Of course. You can download Sam's resume here: [RESUME_LINK]",
  "Sure thing. I've attached Sam's resume for you here: [RESUME_LINK]",
];
const MEETING_REPLIES = [
  "Absolutely. You can book a meeting with Sam here: [MEETING_LINK]",
  "Of course. You can choose a time to meet with Sam here: [MEETING_LINK]",
  "Sure thing. You can schedule a meeting with Sam through this link: [MEETING_LINK]",
];
const ISABEL_SECRET_TRIGGER = "who is isabel to sam";
const ISABEL_SECRET_REPLIES = [
  "Isabel is the most precious and sweet girl Sam has met, and he's deeply thankful for her existence.",
  "To Sam, Isabel is someone incredibly precious and sweet, and he's truly grateful she exists.",
  "Isabel is very special to Sam. She's one of the sweetest people he's met, and he's thankful for her every day.",
  "For Sam, Isabel is precious, sweet, and unforgettable. He's genuinely grateful that she's part of his life.",
];
const ISABEL_DEFAULT_REPLIES = [
  "It's me, Isabel. I'm the AI Sam created to be his personal assistant on this portfolio.",
  "I'm Isabel, Sam's personal AI assistant here on his portfolio.",
  "That's me. I'm Isabel, the AI assistant Sam built to help visitors learn more about him.",
  "I'm Isabel. Sam created me to help answer questions about his work, projects, and availability.",
];
const INAPPROPRIATE_BOUNDARY_REPLIES = [
  "I can't help with bad language, sexual, or 18+ topics here. Please keep the chat respectful and related to Sam, his work, or the portfolio. If this continues, I won't reply to those messages until the topic changes.",
  "Let's keep this space respectful. I can't respond to profanity, perverted requests, or 18+ topics here. Ask me about Sam's work, projects, skills, or availability instead.",
  "I can't continue with that kind of message here. Please switch to a respectful topic about Sam or the portfolio; repeated inappropriate messages won't receive a reply.",
];
const PAGE_LABELS = ["Home", "Portfolio", "Photography"] as const;
type PageLabel = (typeof PAGE_LABELS)[number];

function getRandomReply(replies: string[]) {
  return replies[Math.floor(Math.random() * replies.length)] ?? replies[0];
}

function isPageLabel(value: unknown): value is PageLabel {
  return PAGE_LABELS.includes(value as PageLabel);
}

function getPageAwarenessInstruction(currentPage: PageLabel): string {
  return `
=== CURRENT VISITOR CONTEXT ===
The visitor is currently viewing the ${currentPage} page. Use this only to make answers and
suggestions more relevant when helpful. Do not announce that you are tracking their page, do not
mention routes or URLs, and do not force page-specific references into unrelated answers.
`;
}

function isResumeRequest(message: string): boolean {
  return /\b(resume|résumé|cv|curriculum vitae)\b/i.test(message);
}

function isMeetingRequest(message: string): boolean {
  return /\b(meet|meeting|appointment|schedule|book|call|interview|consultation|calendar)\b/i.test(message);
}

function isInappropriateMessage(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    /\b(?:fuck|fucking|shit|bitch|asshole|bastard|damn|dick|pussy|cunt|slut|whore|motherfucker)\b/i.test(
      normalized
    ) ||
    /\b(?:sex|sexy|nude|nudes|porn|porno|hentai|horny|erotic|fetish|masturbat\w*|orgasm|blowjob|handjob|anal|boobs?|breasts?|vagina|penis|pervert|perverted|18\+|nsfw)\b/i.test(
      normalized
    )
  );
}

function normalizeSecretPhrase(message: string): string {
  return message.toLowerCase().trim().replace(/\s+/g, " ");
}

function isIsabelIdentityQuestion(message: string): boolean {
  return /\b(?:who|what)\s+(?:is|are)\s+isabel\b/i.test(message);
}

function isContinuationRequest(message: string): boolean {
  const normalized = message.toLowerCase().trim().replace(/\s+/g, " ");

  return (
    normalized === "?" ||
    /^(continue|go on|keep going|what next|what's next|and then|then what|finish|finish it|complete it|more|tell me more|can you continue|please continue)\??$/i.test(
      normalized
    )
  );
}

function getPreviousAssistantMessage(
  messages: { role: "user" | "assistant"; content: string }[]
) {
  return [...messages].reverse().find((message) => message.role === "assistant")?.content ?? "";
}

function looksCutOff(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  if (/[.!?]"?$/.test(trimmed)) return false;

  return /\b(?:and|or|but|because|while|that|which|who|he|she|it|they|the|a|an|to|for|with|in|on|of|his|her)$/i.test(
    trimmed
  );
}

function polishReply(reply: string): string {
  return reply
    .replace(/^according to (the )?(information|context|details)( here| provided| available)?[:,]?\s*/i, "")
    .replace(/^based on (the )?(information|context|details)( here| provided| available)?[:,]?\s*/i, "")
    .replace(/^as an ai[:,]?\s*/i, "")
    .replace(
      /(?:https?:\/\/samssiams\.vercel\.app)?\/photo\/photography\/?/gi,
      'the "Photography" option in the site navigation'
    )
    .replace(
      /(?:https?:\/\/samssiams\.vercel\.app)?\/projects\/portfolio\/?/gi,
      'the "Portfolio" option in the site navigation'
    )
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(
      /[\u{1F000}-\u{1FAFF}\u{1FC00}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
      ""
    )
    .trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { messages, currentPage } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      currentPage?: unknown;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'messages' array." },
        { status: 400 }
      );
    }

    // Cap conversation length sent to the model to control quota usage
    const trimmedMessages = messages.slice(-12);

    // Gemini uses "user" / "model" roles, and history is separate from the
    // latest message.
    const history = trimmedMessages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const latestMessage = trimmedMessages[trimmedMessages.length - 1];
    const safeCurrentPage: PageLabel = isPageLabel(currentPage) ? currentPage : "Home";
    const latestContent = latestMessage.content;
    const previousAssistantMessage = getPreviousAssistantMessage(trimmedMessages.slice(0, -1));
    const shouldContinueCutOffReply =
      isContinuationRequest(latestContent) && looksCutOff(previousAssistantMessage);
    const previousInappropriateUserMessages = trimmedMessages
      .slice(0, -1)
      .filter((message) => message.role === "user" && isInappropriateMessage(message.content));

    if (isInappropriateMessage(latestContent)) {
      if (previousInappropriateUserMessages.length > 0) {
        return NextResponse.json({ reply: "", silent: true });
      }

      return NextResponse.json({ reply: getRandomReply(INAPPROPRIATE_BOUNDARY_REPLIES) });
    }

    if (normalizeSecretPhrase(latestContent) === ISABEL_SECRET_TRIGGER) {
      return NextResponse.json({ reply: getRandomReply(ISABEL_SECRET_REPLIES) });
    }

    if (isIsabelIdentityQuestion(latestContent)) {
      return NextResponse.json({ reply: getRandomReply(ISABEL_DEFAULT_REPLIES) });
    }

    if (isResumeRequest(latestContent)) {
      return NextResponse.json({ reply: getRandomReply(RESUME_REPLIES) });
    }

    if (isMeetingRequest(latestContent)) {
      return NextResponse.json({ reply: getRandomReply(MEETING_REPLIES) });
    }

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history,
      config: {
        systemInstruction: `${SAM_CONTEXT}\n${getPageAwarenessInstruction(safeCurrentPage)}`,
        maxOutputTokens: 500,
      },
    });

    const response = await chat.sendMessage({
      message: shouldContinueCutOffReply
        ? `The previous answer was cut off here: "${previousAssistantMessage}". Start with a brief apology like "Sorry about that," then continue the same answer naturally from where it stopped. Do not restart from the beginning.`
        : latestContent,
    });

    const reply = polishReply(response.text ?? "");
    const finalReply =
      shouldContinueCutOffReply && !/^sorry\b/i.test(reply) ? `Sorry about that, ${reply}` : reply;

    return NextResponse.json({ reply: finalReply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "I'm having trouble reaching my response service right now. Please try again in a moment." },
      { status: 503 }
    );
  }
}
