export default function AnimatedTealEdge({ animated = true, transparentInterior = false }: { animated?: boolean; transparentInterior?: boolean }) {
  if (!animated) {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-px -z-10 rounded-[11px] border border-[rgba(129,230,217,0.65)] bg-[rgba(22,26,35,0.96)] shadow-[0_0_8px_rgba(129,230,217,0.35)] backdrop-blur-2xl"
      />
    );
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -inset-[150%] -z-20 hidden bg-[conic-gradient(from_0deg,transparent_0deg,transparent_224deg,rgba(45,212,191,0.26)_264deg,#5eead4_312deg,#14f1d9_342deg,transparent_360deg)] opacity-70 transition-opacity duration-300 group-hover:opacity-100 sm:block sm:animate-[spin_3s_linear_infinite] motion-reduce:animate-none"
      />
      <span
        aria-hidden="true"
        className="absolute -inset-[135%] -z-20 hidden bg-[conic-gradient(from_0deg,transparent_0deg,transparent_232deg,rgba(20,241,217,0.88)_286deg,#5eead4_316deg,#2dd4bf_348deg,transparent_360deg)] opacity-0 blur-[7px] saturate-200 transition-opacity duration-300 group-hover:opacity-100 sm:block sm:animate-[spin_3s_linear_infinite] motion-reduce:animate-none"
      />
      <span
        aria-hidden="true"
        className="absolute -inset-[112%] -z-20 hidden bg-[conic-gradient(from_0deg,transparent_0deg,transparent_252deg,rgba(94,234,212,0.75)_310deg,#14f1d9_336deg,transparent_360deg)] opacity-0 blur-[2px] saturate-150 transition-opacity duration-300 group-hover:opacity-100 sm:block sm:animate-[spin_3s_linear_infinite] motion-reduce:animate-none"
      />
      <span
        aria-hidden="true"
        className={`absolute inset-px -z-10 rounded-[11px] border border-[rgba(129,230,217,0.65)] sm:border-[rgba(129,230,217,0.45)] ${transparentInterior ? "bg-[#161a23] shadow-none" : "bg-[rgba(22,26,35,0.96)] shadow-[0_0_8px_rgba(129,230,217,0.35)] backdrop-blur-2xl sm:shadow-none"}`}
      />
    </>
  );
}
