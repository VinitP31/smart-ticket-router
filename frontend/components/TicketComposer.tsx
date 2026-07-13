"use client";

const EXAMPLE_CHIPS = [
  {
    label: "Duplicate charge",
    ticket: "I was charged twice this month, please refund the extra payment.",
    color: "#d97706",
  },
  {
    label: "Can't log in",
    ticket: "I can't log in, it says my password is incorrect even after resetting it.",
    color: "#7c3aed",
  },
  {
    label: "Platform down",
    ticket: "The whole platform has been down for everyone in our office since 9am.",
    color: "#ea580c",
  },
  {
    label: "Multi-issue",
    ticket:
      "I was double charged this month, my login keeps failing, and could you add a dark mode toggle?",
    color: "#e11d48",
  },
];

export default function TicketComposer({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const isEmpty = value.trim().length === 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isEmpty && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-wide text-slate/60 uppercase">Try</span>
        {EXAMPLE_CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChange(chip.ticket)}
            style={{ ["--chip-color" as string]: chip.color }}
            className="rounded-full border border-black/[0.06] bg-white/90 px-3 py-1 text-xs font-semibold text-slate shadow-[0_1px_1px_rgba(20,22,26,0.04)] backdrop-blur-sm transition-all hover:-translate-y-px hover:border-[var(--chip-color)]/50 hover:text-[var(--chip-color)] hover:shadow-[0_4px_12px_-2px_var(--chip-color)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal active:translate-y-0"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="glass-panel group rounded-2xl border border-white/70 p-1.5 shadow-[0_1px_2px_rgba(20,22,26,0.04),0_20px_48px_-16px_rgba(76,111,255,0.25)] transition-shadow focus-within:shadow-[0_1px_2px_rgba(20,22,26,0.04),0_0_0_4px_rgba(76,111,255,0.18),0_20px_48px_-16px_rgba(124,58,237,0.3)]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a support ticket to see where it goes."
          aria-label="Support ticket text"
          rows={5}
          className="w-full resize-none rounded-xl bg-transparent p-3.5 text-sm leading-relaxed text-ink placeholder:text-slate/45 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3 px-3.5 pb-2">
          <p className="text-xs text-slate/50">
            {isEmpty ? "Enter a ticket to route." : "⌘ Enter to route"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isEmpty || loading}
        className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.6)] transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:from-slate/25 disabled:to-slate/25 disabled:text-slate/50 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        style={{
          backgroundImage: isEmpty
            ? undefined
            : "linear-gradient(100deg,#7c3aed,#4c6fff 55%,#e11d48)",
          backgroundColor: isEmpty ? "rgba(42,47,58,0.15)" : undefined,
          backgroundSize: "200% 100%",
        }}
        onMouseEnter={(e) => {
          if (!isEmpty) e.currentTarget.style.backgroundPosition = "100% 0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundPosition = "0% 0";
        }}
      >
        {loading ? (
          <>
            <span
              className="spinner h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
            Deliberating…
          </>
        ) : (
          <>
            Route ticket
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </>
        )}
      </button>
    </div>
  );
}
