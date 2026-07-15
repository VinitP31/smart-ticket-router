"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const STATE_LABEL: Record<Status, string> = {
  idle: "DRAFT",
  loading: "ROUTING",
  success: "ROUTED",
  error: "DRAFT",
};

export default function TicketComposer({
  value,
  onChange,
  onSubmit,
  status,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  status: Status;
}) {
  const loading = status === "loading";
  const isEmpty = value.trim().length === 0;
  const [ticketId, setTicketId] = useState("4821");

  useEffect(() => {
    // Random per session, client-only (would mismatch SSR if computed during render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTicketId(String(1000 + Math.floor(Math.random() * 8999)).slice(0, 4));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isEmpty && !loading) {
      onSubmit();
    }
  };

  return (
    <div
      className="rounded-2xl border p-4.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)]"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}
    >
      <div className="mb-2.5 font-mono text-xs text-ink-soft">
        <b className="text-ink" suppressHydrationWarning>
          TKT-{ticketId}
        </b>{" "}
        · {STATE_LABEL[status]}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste a support ticket to see where it goes."
        aria-label="Support ticket text"
        spellCheck={false}
        rows={5}
        className="w-full resize-y rounded-lg border p-3 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-[var(--color-accent-1)]"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card-2)" }}
      />
      <div className="mt-3.5 flex items-center justify-between">
        <span className="font-mono text-[11.5px] text-ink-faint">PII auto-redacted</span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isEmpty || loading}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-bold text-white transition-transform disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:-translate-y-px"
          style={{ backgroundImage: "linear-gradient(100deg, var(--color-accent-1), var(--color-accent-2))" }}
        >
          {loading ? (
            <>
              <span
                className="spinner h-3 w-3 rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              Routing…
            </>
          ) : (
            <>Route ticket →</>
          )}
        </button>
      </div>
      {isEmpty && <p className="mt-2 text-[11px] text-ink-faint">Enter a ticket to route.</p>}
    </div>
  );
}
