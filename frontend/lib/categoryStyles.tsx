import type { ReactNode } from "react";

export interface CategoryStyle {
  color: string;
  gradient: string;
  icon: ReactNode;
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Authentication & Login": {
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    icon: (
      <svg {...iconProps}>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  "Billing & Payments": {
    color: "#d97706",
    gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    ),
  },
  "Technical Bug": {
    color: "#e11d48",
    gradient: "linear-gradient(135deg,#e11d48,#fb7185)",
    icon: (
      <svg {...iconProps}>
        <rect x="8" y="9" width="8" height="10" rx="4" />
        <path d="M12 9V6M9 6l-2-2M15 6l2-2M4 12h4M16 12h4M6 18l2-1.5M18 18l-2-1.5" />
      </svg>
    ),
  },
  "Performance & Availability": {
    color: "#ea580c",
    gradient: "linear-gradient(135deg,#ea580c,#fb923c)",
    icon: (
      <svg {...iconProps}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
  },
  "Feature Request": {
    color: "#059669",
    gradient: "linear-gradient(135deg,#059669,#34d399)",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      </svg>
    ),
  },
  "Account Management": {
    color: "#2563eb",
    gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      </svg>
    ),
  },
  "Security & Access": {
    color: "#9333ea",
    gradient: "linear-gradient(135deg,#9333ea,#c084fc)",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      </svg>
    ),
  },
  "Orders & Operations": {
    color: "#0891b2",
    gradient: "linear-gradient(135deg,#0891b2,#22d3ee)",
    icon: (
      <svg {...iconProps}>
        <path d="M21 8 12 3 3 8l9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  "General / Uncategorized": {
    color: "#64748b",
    gradient: "linear-gradient(135deg,#64748b,#94a3b8)",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 3" />
        <path d="M12 16.5h.01" />
      </svg>
    ),
  },
};

const FALLBACK: CategoryStyle = CATEGORY_STYLES["General / Uncategorized"];

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? FALLBACK;
}
