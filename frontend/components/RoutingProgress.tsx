"use client";

import { useEffect, useState } from "react";

const STAGES = ["redact", "classify", "validate"];
const STAGE_INTERVAL_MS = 480;

export default function RoutingProgress({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, STAGES.length));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3.5">
      {STAGES.map((stage, i) => {
        const done = i < index;
        const isActive = i === index && active;
        return (
          <div
            key={stage}
            className="w-full max-w-[150px] rounded-xl border p-3.5 text-center transition-shadow"
            style={{
              borderColor: isActive ? "var(--color-accent-1)" : "var(--color-border)",
              backgroundColor: "var(--color-card)",
              boxShadow: isActive ? "0 0 0 3px rgba(124,134,240,0.18)" : "none",
            }}
          >
            <div className="text-[14.5px] font-bold text-ink">{stage}</div>
            <div
              className="mt-0.5 font-mono text-[11px]"
              style={{
                color: done ? "var(--color-low)" : isActive ? "var(--color-accent-1)" : "var(--color-ink-faint)",
              }}
            >
              {done ? "done" : isActive ? "running" : "idle"}
            </div>
          </div>
        );
      })}
      <div
        className="mt-2.5 rounded-full border px-4 py-2 font-mono text-[11.5px] whitespace-nowrap text-ink-soft"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
      >
        pipeline: redact → classify → validate
      </div>
    </div>
  );
}
