"use client";

import { useEffect, useState } from "react";

const STAGES = ["reading ticket", "classifying issues", "assessing priority", "assigning teams"];

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

  if (!active) return null;

  return (
    <div aria-hidden="true" className="card-settle mt-6 flex flex-col">
      {STAGES.map((stage, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <div
            key={stage}
            className="flex items-center gap-3 border-b border-dotted py-2.5 text-[12.5px]"
            style={{
              borderColor: "var(--color-rule)",
              color: done || current ? "var(--color-ink)" : "var(--color-ink-faint)",
            }}
          >
            <span
              className="w-5 font-mono text-[10px]"
              style={{ color: current ? "var(--color-stamp)" : undefined }}
            >
              {String(i + 1).padStart(2, "0")}
              {done && <span style={{ color: "var(--color-low)" }}> ✓</span>}
            </span>
            <span style={{ color: current ? "var(--color-stamp)" : undefined }}>{stage}</span>
          </div>
        );
      })}
    </div>
  );
}
