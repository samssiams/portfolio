
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

    if (isResumeRequest(latestMessage.content)) {
      return NextResponse.json({ reply: getRandomReply(RESUME_REPLIES) });
    }

    if (isMeetingRequest(latestMessage.content)) {
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
      message: latestMessage.content,
    });

    const reply = polishReply(response.text ?? "");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "I'm having trouble reaching my response service right now. Please try again in a moment." },
      { status: 503 }
    );
  }
}
