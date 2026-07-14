import type { Issue } from "@/lib/types";

const PRIORITY_COLOR: Record<Issue["priority"], string> = {
  High: "var(--color-high)",
  Medium: "var(--color-medium)",
  Low: "var(--color-low)",
};

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const priorityColor = PRIORITY_COLOR[issue.priority];

  return (
    <li
      className="card-settle border-t-2 py-5"
      style={{ animationDelay: `${index * 90}ms`, borderColor: "var(--color-ink)" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-serif text-[13px] text-ink-faint italic">
            issue no. {String(issue.id).padStart(2, "0")}
          </p>
          <h3 className="mt-0.5 font-serif text-xl font-bold text-ink">{issue.category}</h3>
        </div>
        <span
          className="shrink-0 rotate-[-3deg] border-2 px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] whitespace-nowrap uppercase"
          style={{ color: priorityColor, borderColor: priorityColor }}
        >
          {issue.priority}
        </span>
      </div>

      <p className="mt-2.5 mb-1.5 text-[11.5px] tracking-wide text-ink-soft">
        routed to → <b className="text-ink">{issue.assigned_team}</b>
      </p>
      <p className="max-w-[58ch] font-serif text-[15px] leading-relaxed text-ink">
        {issue.reasoning}
      </p>
    </li>
  );
}
