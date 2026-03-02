import React from "react";

export default function Banner() {
  return (
    <div className="w-full mt-20">
      <div className="max-w-[1050px] w-full mx-auto px-60">
        <div
          className="rounded-xl py-3 text-center"
          style={{
            background: "rgba(34, 39, 50, 0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <p className="text-white text-lg font-medium tracking-[0.3px]">
            Hello, I&apos;m Sam. Nice to meet you!
          </p>
        </div>
      </div>
    </div>
  );
}