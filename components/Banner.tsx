import React from "react";

export default function Banner() {
  return (
    <div className="mt-20 w-full">
      <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31">
        <div
          className="rounded-xl py-3 text-center"
          style={{
            background: "rgba(26, 30, 40, 0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <p className="text-white text-[14px] sm:text-lg font-medium tracking-[0.3px]">
            Hello, I&apos;m Sam. Nice to meet you!
          </p>
        </div>
      </div>
    </div>
  );
}
