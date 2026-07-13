"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading ticket…",
  "Classifying issue…",
  "Assessing priority…",
  "Assigning team…",
];

const STAGE_INTERVAL_MS = 750;

export default function RoutingProgress({ active }: { active: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="card-settle flex w-full max-w-xl flex-col gap-2 px-1">
      {STAGES.map((stage, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <div
            key={stage}
            className="flex items-center gap-2.5 text-sm transition-opacity duration-300"
            style={{ opacity: done ? 0.45 : current ? 1 : 0.25 }}
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: done ? "var(--color-low)" : "transparent",
                border: done ? "none" : "1.5px solid var(--color-signal)",
              }}
            >
              {done && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                  <path
                    d="M2.5 6.2 5 8.7l5-5.4"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {current && (
                <span
                  className="spinner h-2 w-2 rounded-full border-[1.5px] border-signal/30 border-t-signal"
                  style={{ borderTopColor: "var(--color-signal)" }}
                />
              )}
            </span>
            <span className={current ? "font-semibold text-ink" : "text-slate"}>{stage}</span>
          </div>
        );
      })}
    </div>
  );
}
