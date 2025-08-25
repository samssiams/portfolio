"use client";

import { useEffect } from "react";

export default function ClickSoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const playClickSound = () => {
      const audio = new Audio("/clickbox.wav"); // file in /public
        audio.volume = 1.0;
        audio.playbackRate = 2.0;
      audio.play().catch(() => {});
    };

    document.addEventListener("click", playClickSound);

    return () => {
      document.removeEventListener("click", playClickSound);
    };
  }, []);

  return <>{children}</>;
}
