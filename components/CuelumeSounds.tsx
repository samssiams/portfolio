"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bind, play } from "cuelume";

export default function CuelumeSounds() {
  const [showUnlock, setShowUnlock] = useState(false);
  const unlockedRef = useRef(false);

  const unlock = useCallback(() => {
    if (unlockedRef.current) return;

    unlockedRef.current = true;
    // This must run synchronously inside the trusted click. Browsers do not
    // consider hover a user gesture, so Web Audio cannot be resumed earlier.
    play("tick");
    bind();
    setShowUnlock(false);
  }, []);

  useEffect(() => {
    const hasHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    // Touch devices do not rely on hover sounds. Their click handlers already
    // run inside an autoplay-approved gesture, so they can bind immediately.
    if (!hasHover) {
      unlockedRef.current = true;
      bind();
      return;
    }

    setShowUnlock(true);
    document.addEventListener("click", unlock, { capture: true, once: true });

    return () => {
      document.removeEventListener("click", unlock, true);
    };
  }, [unlock]);

  if (!showUnlock) return null;

  return (
    <button
      type="button"
      onClick={unlock}
      className="fixed bottom-5 left-4 z-[60] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#161a23]/90 px-3.5 py-2 text-[12px] font-semibold tracking-[0.3px] text-white/80 shadow-lg backdrop-blur-md transition hover:border-[#81E6D9]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#81E6D9]/70"
      aria-label="Enable interface sounds"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 text-[#81E6D9]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18 6a8.5 8.5 0 0 1 0 12" />
      </svg>
      Enable sound
    </button>
  );
}
