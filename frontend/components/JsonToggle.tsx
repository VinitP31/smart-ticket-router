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
        className="border-b font-mono text-[11.5px] tracking-[0.08em] text-ink-soft uppercase transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stamp)]"
        style={{ borderColor: "var(--color-ink-faint)" }}
      >
        view raw response.json
      </button>

      {open && (
        <div className="card-settle relative mt-3.5 overflow-hidden" style={{ backgroundColor: "var(--color-code-bg)" }}>
          <div
            className="flex items-center justify-between border-b px-4 py-2.5"
            style={{ borderColor: "rgba(241,235,220,0.1)" }}
          >
            <span className="font-mono text-[11px] tracking-wide text-paper/40 uppercase">
              response.json
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-sm px-2.5 py-1 font-mono text-[11px] text-paper/80 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-stamp)]"
            >
              {copied ? "copied!" : "copy json"}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-paper/85">{json}</pre>
        </div>
      )}
    </div>
  );
}
