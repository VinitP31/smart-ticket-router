"use client";

const SAMPLES = [
  {
    id: "TKT-S01",
    ticket: "I was charged twice this month, please refund the extra payment.",
  },
  {
    id: "TKT-S02",
    ticket: "I can't log in, it says my password is incorrect even after resetting it.",
  },
  {
    id: "TKT-S03",
    ticket: "The whole platform has been down for everyone in our office since 9am.",
  },
  {
    id: "TKT-S04",
    ticket:
      "I was double charged this month, my login keeps failing, and could you add a dark mode toggle?",
  },
];

export default function SampleTickets({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-label uppercase">
        Samples — click to load
      </div>
      <div className="flex flex-col gap-2.5">
        {SAMPLES.map((sample) => {
          const active = value === sample.ticket;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => onChange(sample.ticket)}
              className="rounded-xl border p-3.5 text-left transition-colors"
              style={{
                borderColor: active ? "var(--color-accent-1)" : "var(--color-border)",
                backgroundColor: "var(--color-card)",
              }}
            >
              <div className="mb-1 font-mono text-[11px] text-ink-faint">{sample.id} · QUEUED</div>
              <div className="text-[13.5px] leading-snug text-ink-soft">{sample.ticket}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
