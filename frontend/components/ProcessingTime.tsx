export default function ProcessingTime({ processingTimeMs }: { processingTimeMs: number }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
      style={{ backgroundImage: "linear-gradient(100deg,#059669,#34d399)" }}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
        <path
          d="M13.5 4.5 6.5 11.5 2.5 7.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Analysis complete · {(processingTimeMs / 1000).toFixed(2)}s
    </span>
  );
}
