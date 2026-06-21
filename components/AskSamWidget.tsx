// components/AskSamWidget.tsx
"use client";

import { usePathname } from "next/navigation";
import { routes } from "@/routers/router";
import { Dot, CloseIcon, MutedIcon, SendIcon, SparkleIcon, VolumeIcon } from "./ask-sam/icons";
import { MessageContent } from "./ask-sam/MessageContent";
import { glassInset, glassPanel, tealButtonStyle } from "./ask-sam/styles";
import type { PageLabel } from "./ask-sam/types";
import { useAskSamChat } from "./ask-sam/useAskSamChat";

function getPageLabel(pathname: string): PageLabel {
  if (pathname === routes.portfolio) return "Portfolio";
  if (pathname === routes.photography) return "Photography";
  return "Home";
}

export default function AskSamWidget() {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);
  const {
    pageContent,
    isOpen,
    messages,
    input,
    setInput,
    isLoading,
    spamWarning,
    portfolioTip,
    isVoiceEnabled,
    isSpeaking,
    isSpeechActive,
    hasFemaleVoice,
    isShiftPressed,
    scrollRef,
    inputRef,
    inputPlaceholder,
    isSpamCoolingDown,
    handleSubmit,
    sendMessage,
    toggleChat,
    toggleVoice,
  } = useAskSamChat(pageLabel);
  const assistantStatus = isSpeechActive ? "Speaking" : isLoading ? "Thinking" : "Online";

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat with Isabel"}
        aria-expanded={isOpen}
        className="group fixed bottom-4 right-4 z-50 isolate flex h-12 w-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border-0 font-chakra font-semibold tracking-[0.3px] text-[#81E6D9] sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-[150%] -z-20 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_224deg,rgba(45,212,191,0.26)_264deg,#5eead4_312deg,#14f1d9_342deg,transparent_360deg)] opacity-70 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:animate-none"
        />
        {/* glow1 */}
        <span
          aria-hidden="true"
          className="absolute -inset-[135%] -z-20 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_232deg,rgba(20,241,217,0.88)_286deg,#5eead4_316deg,#2dd4bf_348deg,transparent_360deg)] opacity-0 blur-[7px] saturate-200 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:animate-none"
        />
        <span
          aria-hidden="true"
          className="absolute -inset-[112%] -z-20 animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_252deg,rgba(94,234,212,0.75)_310deg,#14f1d9_336deg,transparent_360deg)] opacity-0 blur-[2px] saturate-150 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:animate-none"
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
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-300 sm:h-9 sm:w-9 ${
                isSpeaking
                  ? "shadow-[0_0_18px_rgba(129,230,217,0.42)]"
                  : isLoading
                    ? "shadow-[0_0_14px_rgba(255,217,120,0.22)]"
                    : ""
              }`}
              style={{
                background: isSpeaking
                  ? "rgba(129,230,217,0.14)"
                  : isLoading
                    ? "rgba(255,217,120,0.08)"
                    : "rgba(129,230,217,0.08)",
                border: isSpeaking
                  ? "1px solid rgba(129,230,217,0.58)"
                  : isLoading
                    ? "1px solid rgba(255,217,120,0.28)"
                    : "1px solid rgba(129,230,217,0.3)",
                color: isLoading && !isSpeaking ? "#FFD978" : "#81E6D9",
              }}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 rounded-full ${
                  isSpeaking
                    ? "animate-[pulse_420ms_ease-in-out_infinite] bg-[#81E6D9]/18"
                    : isLoading
                      ? "animate-pulse bg-[#FFD978]/10"
                      : ""
                }`}
              />
              <span
                className={`relative z-10 transition-transform duration-100 ${
                  isSpeaking
                    ? "scale-110"
                    : isLoading
                      ? "animate-[spin_1.4s_linear_infinite] scale-95 motion-reduce:animate-pulse"
                      : ""
                }`}
              >
                <SparkleIcon />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white tracking-[0.3px]">Isabel</p>
              <p className="hidden text-xs sm:block" style={{ color: "rgba(255,255,255,0.6)" }}>
                Personal AI assistant -{" "}
                <span
                  className={`transition-colors duration-200 ${
                    isSpeechActive
                      ? "animate-pulse text-[#81E6D9]"
                      : isLoading
                        ? "animate-pulse text-[#FFD978]"
                        : "text-[#81E6D9]"
                  }`}
                >
                  {assistantStatus}
                </span>
              </p>
              <p className="text-[11px] sm:hidden" style={{ color: "rgba(255,255,255,0.6)" }}>
                Personal AI assistant -{" "}
                <span
                  className={`transition-colors duration-200 ${
                    isSpeechActive
                      ? "animate-pulse text-[#81E6D9]"
                      : isLoading
                        ? "animate-pulse text-[#FFD978]"
                        : "text-[#81E6D9]"
                  }`}
                >
                  {assistantStatus}
                </span>
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
              {isVoiceEnabled ? <VolumeIcon /> : <MutedIcon />}
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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              disabled={isSpamCoolingDown}
              className="min-w-0 flex-1 rounded-full px-3.5 py-2 text-[16px] text-white outline-none transition-all duration-200 placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:text-white/45 disabled:placeholder:text-[#FFD978]/75 sm:px-4 sm:text-sm"
              style={{
                background: isSpamCoolingDown
                  ? "rgba(255,217,120,0.055)"
                  : isShiftPressed
                    ? "rgba(129,230,217,0.08)"
                    : "rgba(255,255,255,0.04)",
                border: isSpamCoolingDown
                  ? "1px solid rgba(255,217,120,0.28)"
                  : isShiftPressed
                  ? "1px solid rgba(129,230,217,0.55)"
                  : "1px solid rgba(255,255,255,0.12)",
                boxShadow: isSpamCoolingDown
                  ? "none"
                  : isShiftPressed
                    ? "0 0 18px rgba(129,230,217,0.28)"
                    : "none",
              }}
            />
            <button
              type="submit"
              disabled={isSpamCoolingDown || !input.trim()}
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
