"use client";

const EXAMPLE_CHIPS = [
  {
    label: "duplicate charge",
    ticket: "I was charged twice this month, please refund the extra payment.",
  },
  {
    label: "can't log in",
    ticket: "I can't log in, it says my password is incorrect even after resetting it.",
  },
  {
    label: "platform down",
    ticket: "The whole platform has been down for everyone in our office since 9am.",
  },
  {
    label: "multi-issue",
    ticket:
      "I was double charged this month, my login keeps failing, and could you add a dark mode toggle?",
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
  const wordCount = isEmpty ? 0 : value.trim().split(/\s+/).length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isEmpty && !loading) {
      onSubmit();
    }
  };

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2.5 text-[10px] tracking-[0.14em] text-ink-faint uppercase">
        try an example
        <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: "var(--color-rule)" }} />
      </div>
      <div className="mb-1 flex flex-wrap">
        {EXAMPLE_CHIPS.map((chip) => {
          const active = value === chip.ticket;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onChange(chip.ticket)}
              aria-pressed={active}
              className="mr-2 mb-2 border px-3.5 py-2 font-mono text-[11.5px] transition-colors"
              style={{
                borderColor: "var(--color-ink)",
                backgroundColor: active ? "var(--color-ink)" : "transparent",
                color: active ? "var(--color-paper)" : "var(--color-ink-soft)",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <div className="mt-7 mb-2.5 flex items-center gap-2.5 text-[10px] tracking-[0.14em] text-ink-faint uppercase">
        the ticket
        <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: "var(--color-rule)" }} />
      </div>

      <div
        className="relative border p-4 pt-4 pb-3 transition-colors focus-within:border-[var(--color-stamp)]"
        style={{
          borderColor: "var(--color-ink)",
          backgroundColor: "color-mix(in srgb, var(--color-paper) 55%, white)",
          boxShadow: "3px 3px 0 var(--color-rule)",
        }}
      >
        <span
          className="absolute -top-[9px] left-3 px-1.5 text-[9.5px] tracking-[0.14em] uppercase"
          style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-faint)" }}
        >
          input
        </span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a support ticket to see where it goes."
          aria-label="Support ticket text"
          spellCheck={false}
          rows={4}
          className="block w-full resize-none border-none bg-transparent p-0 font-serif text-base leading-relaxed text-ink outline-none placeholder:text-ink-faint"
        />
        <div
          className="mt-2.5 flex justify-between border-t border-dotted pt-2 text-[10.5px] tracking-wide text-ink-faint"
          style={{ borderColor: "var(--color-rule)" }}
        >
          <span>⌘ enter to route</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isEmpty || loading}
        className="mt-5 flex w-full items-center justify-center gap-2.5 border-2 py-3.5 font-mono text-[13px] font-bold tracking-[0.1em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: "var(--color-ink)",
          backgroundColor: "var(--color-ink)",
          color: "var(--color-paper)",
        }}
        onMouseEnter={(e) => {
          if (isEmpty || loading) return;
          e.currentTarget.style.backgroundColor = "var(--color-stamp)";
          e.currentTarget.style.borderColor = "var(--color-stamp)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-ink)";
          e.currentTarget.style.borderColor = "var(--color-ink)";
        }}
      >
        {loading ? (
          <>
            <span
              className="spinner h-3 w-3 rounded-full border-2 border-t-transparent"
              style={{ borderColor: "var(--color-paper)", borderTopColor: "transparent" }}
              aria-hidden="true"
            />
            Deliberating…
          </>
        ) : (
          <>Stamp &amp; route →</>
        )}
      </button>
      {isEmpty && (
        <p className="mt-2 text-[11px] text-ink-faint">Enter a ticket to route.</p>
      )}
    </div>
  );
}
