import type { Issue } from "@/lib/types";
import { getCategoryStyle } from "@/lib/categoryStyles";

const PRIORITY_COLOR: Record<Issue["priority"], string> = {
  High: "var(--color-high)",
  Medium: "var(--color-medium)",
  Low: "var(--color-low)",
};

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const priorityColor = PRIORITY_COLOR[issue.priority];
  const category = getCategoryStyle(issue.category);

  return (
    <li
      className="card-settle group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_1px_2px_rgba(20,22,26,0.04),0_16px_36px_-16px_rgba(20,22,26,0.22)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(20,22,26,0.06),0_24px_48px_-16px_rgba(20,22,26,0.3)]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <span
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: category.gradient }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
            style={{ background: category.gradient, boxShadow: `0 6px 16px -6px ${category.color}80` }}
          >
            <span className="h-5 w-5">{category.icon}</span>
          </span>
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-slate/50 uppercase">
              Issue {index + 1}
            </p>
            <h3 className="font-display -mt-0.5 text-lg leading-tight font-bold text-ink">
              {issue.category}
            </h3>
          </div>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ backgroundColor: `${priorityColor}1a`, color: priorityColor }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: priorityColor }}
            aria-hidden="true"
          />
          {issue.priority}
        </span>
      </div>

      <div className="mx-5 border-t border-black/[0.06]" />

      <div className="p-5 pt-3">
        <p className="text-sm font-semibold" style={{ color: category.color }}>
          {issue.assigned_team}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{issue.reasoning}</p>
      </div>
    </li>
  );
}
