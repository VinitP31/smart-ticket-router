"use client";

import { useEffect, useState } from "react";
import { PRIORITY_COLOR } from "@/components/IssueCard";
import type { Issue } from "@/lib/types";

const STAGES = ["redact", "classify", "validate"];
const STAGE_INTERVAL_MS = 480;
const Y_TOP = 110;
const Y_BOTTOM = 450;
const Y_MID = 280;
const DEFAULT_LINES = [
  { y: Y_TOP, color: "var(--color-high)", duration: "1.1s" },
  { y: Y_MID, color: "var(--color-medium)", duration: "1.5s" },
  { y: Y_BOTTOM, color: "var(--color-low)", duration: "1.9s" },
];
const DURATIONS = ["1.1s", "1.5s", "1.9s", "1.3s", "1.7s"];

export default function RoutingProgress({
  active,
  issues,
}: {
  active: boolean;
  issues?: Issue[] | null;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, STAGES.length));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active]);

  const hasResult = !!issues && issues.length > 0;
  const flowing = active || hasResult;

  // One line per resulting issue, evenly spread and colored by that issue's
  // priority — a single issue gets one straight line, not a fixed fan of 3.
  const lines = hasResult
    ? issues!.map((issue, i) => ({
        y: issues!.length === 1 ? Y_MID : Y_TOP + (i * (Y_BOTTOM - Y_TOP)) / (issues!.length - 1),
        color: PRIORITY_COLOR[issue.priority],
        duration: DURATIONS[i % DURATIONS.length],
      }))
    : DEFAULT_LINES;

  return (
    <div className="relative flex h-full min-h-[220px] flex-col items-center justify-center gap-3.5">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500"
        viewBox="0 0 560 560"
        preserveAspectRatio="none"
        style={{ opacity: flowing ? 1 : 0.25 }}
        aria-hidden="true"
      >
        {lines.map((line, i) => (
          <path
            key={i}
            className="flow-path"
            d={`M0,${Y_MID} C90,${Y_MID} 90,${line.y} 200,${line.y} L560,${line.y}`}
            style={{ stroke: line.color, animationDuration: line.duration }}
          />
        ))}
      </svg>

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
