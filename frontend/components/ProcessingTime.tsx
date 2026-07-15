export default function ProcessingTime({ processingTimeMs }: { processingTimeMs: number }) {
  return (
    <span className="font-mono text-[11px] font-normal tracking-wide normal-case text-low">
      routed in {(processingTimeMs / 1000).toFixed(2)}s
    </span>
  );
}
