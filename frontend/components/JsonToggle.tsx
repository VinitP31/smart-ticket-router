"use client";

import { useState } from "react";
import type { RouteResponse } from "@/lib/types";

export default function JsonToggle({ data }: { data: RouteResponse | null }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const json = data ? JSON.stringify(data, null, 2) : "";

  const handleCopy = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="mt-7 overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
    >
      <button
        type="button"
        onClick={() => data && setOpen((v) => !v)}
        disabled={!data}
        className="flex w-full items-center justify-between px-4.5 py-3 font-mono text-xs tracking-wide text-ink-soft uppercase disabled:cursor-default"
      >
        <span className="flex items-center gap-2">
          <span
            className="inline-block transition-transform duration-150"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            aria-hidden="true"
          >
            ▶
          </span>
          Raw JSON response
        </span>
        <span className="font-mono text-[11.5px] normal-case text-ink-faint">
          {data ? `200 OK · ${(data.processing_time_ms / 1000).toFixed(2)}s` : "no response yet"}
        </span>
      </button>

      {open && data && (
        <div className="border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-end px-4.5 py-2">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:text-ink"
            >
              {copied ? "copied!" : "copy json"}
            </button>
          </div>
          <pre className="overflow-x-auto px-4.5 pb-4 font-mono text-xs leading-relaxed text-ink-soft">
            {json}
          </pre>
        </div>
      )}
    </div>
  );
}
