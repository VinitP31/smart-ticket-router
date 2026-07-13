"use client";

import { useState } from "react";
import type { RouteResponse } from "@/lib/types";

export default function JsonToggle({ data }: { data: RouteResponse }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-signal transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        View Structured JSON
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 2.5 8 6l-4 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="card-settle relative overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_16px_40px_-16px_rgba(76,111,255,0.35)]"
          style={{ backgroundColor: "var(--color-code-bg)" }}
        >
          <span
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundImage: "linear-gradient(90deg,#7c3aed,#4c6fff,#e11d48)" }}
            aria-hidden="true"
          />
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
            <span className="font-mono text-[11px] tracking-wide text-white/40 uppercase">
              response.json
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/[0.15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" aria-hidden="true">
                    <rect
                      x="4.5"
                      y="4.5"
                      width="8"
                      height="8"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M2.5 9.5v-6a1 1 0 0 1 1-1h6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-white/90">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}
