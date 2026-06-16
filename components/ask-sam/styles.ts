// Shared glass style - matches Banner.tsx / ProjectModal.tsx exactly
export const glassPanel = {
  background: "rgba(26, 30, 40, 0.82)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

// Slightly denser variant for inset elements (assistant bubbles, input bar)
export const glassInset = {
  background: "rgba(22, 26, 35, 0.95)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
} as const;

export const tealButtonStyle = {
  background: "rgba(129,230,217,0.08)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(129,230,217,0.3)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  color: "#81E6D9",
} as const;
