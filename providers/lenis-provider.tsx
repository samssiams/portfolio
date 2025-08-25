"use client";
import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

type LenisScrollProviderProps = {
  children: ReactNode;
};

const LenisScrollProvider = ({ children }: LenisScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1,
      easing: (t) => 1 - Math.pow(1 - t, 5),
      infinite: false,
      lerp: 1,
    });

    // Animation frame loop with proper cleanup
    const animate = (time: number) => {
      lenisRef.current?.raf(time);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      // Cancel the animation frame on unmount!
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy?.();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};

export default LenisScrollProvider;