// components/AskSamWidget.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/routers/router";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type PageLabel = "Home" | "Portfolio" | "Photography";

const PAGE_CONTENT: Record<
  PageLabel,
  { greeting: string; suggestions: string[] }
> = {
  Home: {
    greeting:
      "Hi! I'm Isabel. Ask me anything about Sam's experience, projects, skills, or availability.",
    suggestions: [
      "What projects has he worked on?",
      "Is he available for freelance work?",
      "May I schedule a meeting with him?",
    ],
  },
  Portfolio: {
    greeting:
      "Hi! I'm Isabel. I can tell you more about the projects you're exploring or Sam's role in building them.",
    suggestions: [
      "Which project best shows Sam's skills?",
      "What technologies does Sam work with?",
      "What was Sam's role in these projects?",
    ],
  },
  Photography: {
    greeting:
      "Hi! I'm Isabel. I can tell you more about Sam's photography and the work you're viewing.",
    suggestions: [
      "What kind of photography does Sam shoot?",
      "Tell me about Sam's creative background.",
      "How can I contact Sam for photography?",
    ],
  },
};

function getPageLabel(pathname: string): PageLabel {
  if (pathname === routes.projectsPortfolio) return "Portfolio";
  if (pathname === routes.photoPhotography) return "Photography";
  return "Home";
}

const RESUME_TOKEN = "[RESUME_LINK]";
const RESUME_URL = "/Cruz_CV.pdf";
const MEETING_TOKEN = "[MEETING_LINK]";
const MEETING_URL = "https://calendar.app.google/Jem61HmcE8Mn2iUX9";
const GREETING_SPOKEN_STORAGE_KEY = "isabel-greeting-spoken";
const FEMALE_VOICE_NAMES =
  /female|samantha|zira|aria|jenny|serena|susan|victoria|karen|moira|tessa|fiona|veena|joana|salli|kimberly|ivy|kendra|emma|amy|olivia|sonia|libby|natasha|clara|neerja|heera|ava|allison|google us english/i;

// Shared glass style — matches Banner.tsx / ProjectModal.tsx exactly
const glassPanel = {
  background: "rgba(26, 30, 40, 0.82)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

// Slightly denser variant for inset elements (assistant bubbles, input bar)
const glassInset = {
  background: "rgba(22, 26, 35, 0.95)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

const tealButtonStyle = {
  background: "rgba(129,230,217,0.08)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(129,230,217,0.3)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  color: "#81E6D9",
} as const;

export default function AskSamWidget() {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);
  const pageContent = PAGE_CONTENT[pageLabel];
  const initialMessage: Message = {
    role: "assistant",
    content: pageContent.greeting,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [spamWarning, setSpamWarning] = useState<string | null>(null);
  const [portfolioTip, setPortfolioTip] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasFemaleVoice, setHasFemaleVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<Message[]>([initialMessage]);
  const messageQueueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);
  const pendingCountRef = useRef(0);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVoiceEnabledRef = useRef(true);
  const femaleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const greetingSpokenRef = useRef(false);
  const portfolioTipShownRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (greetingTimeoutRef.current) {
          clearTimeout(greetingTimeoutRef.current);
          greetingTimeoutRef.current = null;
        }
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        greetingSpokenRef.current = true;
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (pageLabel !== "Portfolio" || !isOpen || portfolioTipShownRef.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    portfolioTipShownRef.current = true;
    setPortfolioTip("Tip: Hold Shift and click a project to ask Isabel about it.");
  }, [isOpen, pageLabel]);

  useEffect(() => {
    if (isOpen && hasFemaleVoice && isVoiceEnabled && !greetingSpokenRef.current) {
      if (localStorage.getItem(GREETING_SPOKEN_STORAGE_KEY) === "true") {
        greetingSpokenRef.current = true;
        return;
      }

      greetingSpokenRef.current = true;
      greetingTimeoutRef.current = setTimeout(() => {
        greetingTimeoutRef.current = null;
        localStorage.setItem(GREETING_SPOKEN_STORAGE_KEY, "true");
        speakReply(pageContent.greeting);
      }, 1500);
    }

    return () => {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
    };
  }, [hasFemaleVoice, isOpen, isVoiceEnabled, pageContent.greeting]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    function loadFemaleVoice() {
      const femaleVoice =
        window.speechSynthesis
          .getVoices()
          .find(
            (voice) =>
              voice.lang.toLowerCase().startsWith("en") && FEMALE_VOICE_NAMES.test(voice.name)
          ) ?? null;

      femaleVoiceRef.current = femaleVoice;
      setHasFemaleVoice(Boolean(femaleVoice));
    }

    loadFemaleVoice();
    window.speechSynthesis.addEventListener("voiceschanged", loadFemaleVoice);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadFemaleVoice);
  }, []);

  useEffect(() => {
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  function pauseSpeaking() {
    window.speechSynthesis?.pause();
    setIsSpeaking(false);
  }

  function resumeSpeaking() {
    window.speechSynthesis?.resume();
    setIsSpeaking(window.speechSynthesis?.speaking ?? false);
  }

  function speakReply(content: string) {
    if (!isVoiceEnabledRef.current || !("speechSynthesis" in window)) return;

    const spokenText = content
      .replace(RESUME_TOKEN, "")
      .replace(MEETING_TOKEN, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!spokenText) return;

    const preferredVoice = femaleVoiceRef.current;
    if (!preferredVoice) return;

    const sentences = spokenText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [spokenText];
    const isMobile = window.matchMedia("(max-width: 639px)").matches;

    sentences.forEach((sentence, index) => {
      const isLastSentence = index === sentences.length - 1;
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.voice = preferredVoice;
      utterance.rate = isMobile ? 0.9 : isLastSentence ? 1.35 : 1.5;
      utterance.pitch = isLastSentence ? 1 : 1.02;
      utterance.volume = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onerror = () => setIsSpeaking(false);

      if (isLastSentence) {
        utterance.onend = () => setIsSpeaking(false);
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  function toggleVoice() {
    if (!hasFemaleVoice) {
      showVoiceWarning();
      return;
    }

    const nextValue = !isVoiceEnabledRef.current;
    isVoiceEnabledRef.current = nextValue;
    setIsVoiceEnabled(nextValue);

    if (nextValue) {
      resumeSpeaking();
    } else {
      if (greetingTimeoutRef.current) {
        clearTimeout(greetingTimeoutRef.current);
        greetingTimeoutRef.current = null;
      }
      pauseSpeaking();
    }
  }

  function showVoiceWarning() {
    setSpamWarning("A female English voice is not available on this device.");

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setSpamWarning(null);
    }, 3500);
  }

  function showSpamWarning() {
    setSpamWarning("Please wait for Isabel to answer before sending another message.");

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    warningTimeoutRef.current = setTimeout(() => {
      setSpamWarning(null);
    }, 3500);
  }

  async function processMessageQueue() {
    if (isProcessingRef.current) return;

    const nextMessage = messageQueueRef.current.shift();
    if (!nextMessage) return;

    isProcessingRef.current = true;
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: nextMessage };
    const requestMessages = [...conversationRef.current, userMessage];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages, currentPage: pageLabel }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Hmm, I didn't get a response. Try again?",
      };
      conversationRef.current = [...requestMessages, assistantMessage];
      setMessages((prev) => [...prev, assistantMessage]);
      speakReply(assistantMessage.content);
    } catch (err) {
      const assistantMessage: Message = {
        role: "assistant",
        content: "Isabel is busy, please try again shortly.",
      };
      conversationRef.current = [...requestMessages, assistantMessage];
      setMessages((prev) => [...prev, assistantMessage]);
      speakReply(assistantMessage.content);
    } finally {
      pendingCountRef.current -= 1;
      isProcessingRef.current = false;

      if (messageQueueRef.current.length > 0) {
        void processMessageQueue();
      } else {
        setIsLoading(false);
      }
    }
  }

  function sendMessage(text: string) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    if (pendingCountRef.current >= 2) {
      showSpamWarning();
      return;
    }

    greetingSpokenRef.current = true;
    if (greetingTimeoutRef.current) {
      clearTimeout(greetingTimeoutRef.current);
      greetingTimeoutRef.current = null;
    }
    pendingCountRef.current += 1;
    messageQueueRef.current.push(trimmedText);
    setMessages((prev) => [...prev, { role: "user", content: trimmedText }]);
    setInput("");
    void processMessageQueue();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  useEffect(() => {
    function handleProjectQuestion(event: Event) {
      const question = (event as CustomEvent<{ question?: string }>).detail?.question;
      if (!question) return;

      setPortfolioTip(null);
      setIsOpen(true);
      sendMessage(question);
    }

    window.addEventListener("ask-isabel-about-project", handleProjectQuestion);
    return () => window.removeEventListener("ask-isabel-about-project", handleProjectQuestion);
  });

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() =>
          setIsOpen((prev) => {
            if (prev) {
              if (greetingTimeoutRef.current) {
                clearTimeout(greetingTimeoutRef.current);
                greetingTimeoutRef.current = null;
              }
              greetingSpokenRef.current = true;
              stopSpeaking();
            }
            return !prev;
          })
        }
        aria-label={isOpen ? "Close chat" : "Open chat with Isabel"}
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-50 isolate flex h-12 w-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border-0 font-chakra font-semibold tracking-[0.3px] text-[#81E6D9] transition-transform duration-300 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-[150%] -z-20 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_245deg,rgba(129,230,217,0.25)_285deg,#81E6D9_330deg,transparent_360deg)] motion-reduce:animate-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-[1px] -z-10 rounded-full border border-[rgba(129,230,217,0.45)] bg-[rgba(22,26,35,0.96)] backdrop-blur-2xl"
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isOpen ? (
            <>
              <CloseIcon />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <SparkleIcon />
              <span className="hidden sm:inline">Ask Isabel</span>
            </>
          )}
        </span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Isabel"
          className="fixed bottom-20 right-3 z-50 flex h-[min(24rem,calc(100dvh-6.5rem))] w-[min(21rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl font-chakra shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:bottom-24 sm:right-6 sm:h-[min(32rem,calc(100dvh-7rem))] sm:w-[min(22rem,calc(100vw-2rem))]"
          style={glassPanel}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "180px 180px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(129,230,217,0.1) 0.8px, transparent 0.8px)",
              backgroundSize: "20px 20px",
              maskImage:
                "radial-gradient(ellipse 92% 86% at 50% 42%, black 34%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 92% 86% at 50% 42%, black 34%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `
                radial-gradient(ellipse 85% 42% at 50% 0%, rgba(129,230,217,0.055) 0%, transparent 72%),
                radial-gradient(ellipse 65% 55% at 12% 92%, rgba(100,120,200,0.035) 0%, transparent 75%),
                radial-gradient(ellipse 115% 100% at 50% 45%, transparent 42%, rgba(8,11,17,0.48) 100%)
              `,
            }}
          />

          {/* Header */}
          <div
            className="relative z-10 flex items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
              style={{
                background: "rgba(129,230,217,0.08)",
                border: "1px solid rgba(129,230,217,0.3)",
                color: "#81E6D9",
              }}
            >
              <SparkleIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white tracking-[0.3px]">Isabel</p>
              <p className="hidden text-xs sm:block" style={{ color: "rgba(255,255,255,0.6)" }}>
                Personal AI assistant for Sam
              </p>
              <p className="text-[11px] sm:hidden" style={{ color: "rgba(255,255,255,0.6)" }}>
                Personal AI assistant for Sam
              </p>
            </div>
            <button
              type="button"
              onClick={toggleVoice}
              aria-label={isVoiceEnabled ? "Mute Isabel" : "Enable Isabel's voice"}
              aria-pressed={isVoiceEnabled}
              title={
                hasFemaleVoice
                  ? isVoiceEnabled
                    ? "Mute Isabel"
                    : "Enable Isabel's voice"
                  : "Female voice unavailable"
              }
              className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${
                isVoiceEnabled ? "text-[#81E6D9]" : "text-white/50"
              } md:hover:bg-white/5 md:hover:text-[#81E6D9]`}
              style={{
                border: isVoiceEnabled
                  ? "1px solid rgba(129,230,217,0.35)"
                  : "1px solid rgba(255,255,255,0.12)",
                background: isVoiceEnabled ? "rgba(129,230,217,0.08)" : "rgba(255,255,255,0.03)",
              }}
            >
              {isVoiceEnabled ? <VolumeIcon speaking={isSpeaking} /> : <MutedIcon />}
            </button>
          </div>

          {spamWarning && (
            <div
              role="status"
              aria-live="polite"
              className="absolute left-3 right-3 top-[3.75rem] z-20 rounded-xl px-3 py-2 text-[11px] leading-relaxed sm:left-4 sm:right-4 sm:top-[4.25rem] sm:text-xs"
              style={{
                background: "rgba(52, 42, 20, 0.96)",
                border: "1px solid rgba(255,200,80,0.45)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                color: "#FFD978",
              }}
            >
              {spamWarning}
            </div>
          )}

          {/* Messages */}
          <div
            ref={scrollRef}
            className="relative z-10 flex-1 space-y-2.5 overflow-y-auto px-3 py-3 [scrollbar-color:rgba(129,230,217,0.35)_transparent] [scrollbar-width:thin] sm:space-y-3 sm:px-4 sm:py-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#81E6D9]/30 [&::-webkit-scrollbar-thumb:hover]:bg-[#81E6D9]/50"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed sm:max-w-[85%] sm:px-4 sm:py-2.5 sm:text-sm"
                  style={
                    m.role === "user"
                      ? {
                          background: "rgba(129,230,217,0.08)",
                          border: "1px solid rgba(129,230,217,0.3)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                          color: "#e7fffb",
                        }
                      : {
                          ...glassInset,
                          color: "rgb(209,213,219)",
                        }
                  }
                >
                  <MessageContent message={m} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1 rounded-2xl px-3.5 py-2.5"
                  style={glassInset}
                >
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </div>
              </div>
            )}

            {/* Suggested questions — only show before any user message */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 pt-1 sm:gap-2 sm:pt-2">
                {pageContent.suggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="cursor-pointer rounded-full px-3 py-1.5 text-left text-[11px] tracking-[0.3px] transition-all duration-200 sm:text-xs"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgb(209,213,219)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(129,230,217,0.4)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.color = "rgb(209,213,219)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {portfolioTip && (
            <div
              role="status"
              aria-live="polite"
              className="relative z-20 mx-3 mb-4 hidden animate-[bounce_1.8s_ease-in-out_infinite] rounded-xl px-3 py-2 text-xs leading-relaxed motion-reduce:animate-none md:block"
              style={{
                background: "rgba(18, 49, 48, 0.96)",
                border: "1px solid rgba(129,230,217,0.4)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                color: "#B8FFF6",
              }}
            >
              {portfolioTip}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 flex items-center gap-2 px-2.5 py-2.5 sm:px-3 sm:py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="min-w-0 flex-1 rounded-full px-3.5 py-2 text-xs text-white outline-none placeholder:text-neutral-500 sm:px-4 sm:text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 md:hover:border-[#81E6D9] md:hover:bg-[rgba(129,230,217,0.18)] md:hover:text-[#b8fff6] md:hover:shadow-[0_0_14px_rgba(129,230,217,0.32)]"
              style={tealButtonStyle}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function MessageContent({ message }: { message: Message }) {
  if (message.role !== "assistant") {
    return <>{message.content}</>;
  }

  const hasResumeLink = message.content.includes(RESUME_TOKEN);
  const hasMeetingLink = message.content.includes(MEETING_TOKEN);

  if (!hasResumeLink && !hasMeetingLink) {
    return <>{message.content}</>;
  }

  const text = message.content
    .replace(RESUME_TOKEN, "")
    .replace(MEETING_TOKEN, "")
    .trim();

  return (
    <div className="space-y-3">
      {text && <p>{text}</p>}
      <div className="flex flex-wrap gap-2">
        {hasResumeLink && (
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.3px] transition-all duration-200"
            style={tealButtonStyle}
          >
            <DownloadIcon />
            Download resume
          </a>
        )}
        {hasMeetingLink && (
          <a
            href={MEETING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.3px] transition-all duration-200"
            style={tealButtonStyle}
          >
            <CalendarIcon />
            Book a meeting
          </a>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full"
      style={{ background: "#81E6D9", animationDelay: delay }}
    />
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VolumeIcon({ speaking }: { speaking: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6.5 9H3V15H6.5L11 19V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9C16.3 10.5 16.3 13.5 15 15M18 6C21.5 9.5 21.5 14.5 18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={speaking ? "animate-pulse" : ""}
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5L6.5 9H3V15H6.5L11 19V5ZM16 9L21 14M21 9L16 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3V15M12 15L7 10M12 15L17 10M5 21H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2V6M16 2V6M4 10H20M6 4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
