import type { Issue } from "@/lib/types";

export const PRIORITY_COLOR: Record<Issue["priority"], string> = {
  High: "var(--color-high)",
  Medium: "var(--color-medium)",
  Low: "var(--color-low)",
};

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const priorityColor = PRIORITY_COLOR[issue.priority];

  return (
    <li
      className="card-settle rounded-xl border-l-[3px] border-y border-r p-4"
      style={{
        animationDelay: `${index * 90}ms`,
        borderLeftColor: priorityColor,
        borderTopColor: "var(--color-border)",
        borderRightColor: "var(--color-border)",
        borderBottomColor: "var(--color-border)",
        backgroundColor: "var(--color-card)",
      }}
    >
      <div className="flex items-baseline justify-between gap-2.5">
        <div>
          <div className="font-mono text-[10.5px] tracking-wide text-ink-faint uppercase">
            {issue.assigned_team}
          </div>
          <h3 className="mt-0.5 text-[15.5px] font-bold text-ink">{issue.category}</h3>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide whitespace-nowrap text-white uppercase"
          style={{ backgroundColor: priorityColor }}
        >
          {issue.priority}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{issue.reasoning}</p>
    </li>
  );
}
