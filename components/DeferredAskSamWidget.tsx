"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AskSamWidget = dynamic(() => import("./AskSamWidget"), { ssr: false });

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export default function DeferredAskSamWidget() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setShouldLoad(true), { timeout: 3000 });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const timeout = window.setTimeout(() => setShouldLoad(true), 1500);
    return () => window.clearTimeout(timeout);
  }, []);

  return shouldLoad ? <AskSamWidget /> : null;
}
