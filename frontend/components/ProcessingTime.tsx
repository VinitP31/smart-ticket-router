export default function ProcessingTime({ processingTimeMs }: { processingTimeMs: number }) {
  return (
    <span className="font-mono text-[11px] tracking-wide" style={{ color: "var(--color-low)" }}>
      {(processingTimeMs / 1000).toFixed(2)}s
    </span>
  );
}
