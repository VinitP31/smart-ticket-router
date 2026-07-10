# Smart Ticket Router — Frontend · CLAUDE.md

Context for Claude Code. Read this before writing or editing any frontend code.
Full reference lives in `../docs/Master_doc.md` — consult a specific section when you need depth.

## What this is
The UI for the Smart Ticket Router. Next.js (App Router) + TypeScript + Tailwind CSS. It calls the
backend, then renders the routing result as cards. English-only. MVP. Make it genuinely good-looking —
something people at Calfus would enjoy using.

## The API it consumes (do NOT change this shape)
- `POST ${NEXT_PUBLIC_API_URL}/route`  body: `{ "ticket": "<text>" }`
- Response: `{ "issues": Issue[], "processing_time_ms": number }`
- `Issue = { id: number, category: string, priority: "High" | "Medium" | "Low", assigned_team: string, reasoning: string }`
- There is NO `confidence` field.
- The backend NEVER returns 5xx. A routing failure comes back as a normal single Human-Triage issue
  card, so you do not special-case it. (The only true error state is when the frontend cannot reach the backend at all.)

## SIX GOLDEN FRONTEND RULES (never break)
1. Issue CARDS are the primary UI — render ONE card per issue in `data.issues`.
2. `key={issue.id}` on every card — ALWAYS. Never use the array index as the key.
3. A collapsible **"View Structured JSON"** panel shows the exact backend response, verbatim and
   pretty-printed: `JSON.stringify(data, null, 2)`.
4. Empty input is handled ON THE FRONTEND: Submit is disabled whenever the trimmed input is empty,
   and a clear notice appears ("Enter a ticket to route."). Nothing empty ever reaches the backend.
5. After a successful route, show the processing time:
   `✓ Analysis Complete · Processed in {(processing_time_ms/1000).toFixed(2)}s`.
6. The API base URL comes from `NEXT_PUBLIC_API_URL` (env var). NEVER hardcode localhost.

## Four UI states (build all four)
- **Empty (initial):** placeholder prompt, Submit greyed/disabled, example chips.
- **Loading:** button reads "Deliberating…" and is disabled (prevents double-submit).
- **Results:** processing time; an "N issues detected" line when more than one; one colour-spined
  card per issue; the "View Structured JSON" toggle.
- **Error (cannot reach backend):** a plain, actionable message — "AI service temporarily
  unavailable. Please try again in a moment." Never a raw stack trace.

## Design direction — "The Verdict Desk"
Calm dispatch desk that returns a verdict per issue; multiple issues → a stack of cards.
- **Palette (scarce, purposeful):** Ink `#14161A` text, Slate `#2A2F3A` panels, Mist `#EEF1F6` canvas;
  impact colours used ONLY on the priority spine/badge — High `#E5484D`, Medium `#F5A524`, Low `#30A46C`;
  Signal `#4C6FFF` for interactive states.
- **Type (2 roles):** a characterful display face (e.g. Space Grotesk) for the category + a clean UI
  face (e.g. Inter). The category is the hero of each card.
- **Layout:** centered composer (large textarea + one "Route ticket" button) that slides up to reveal
  the cards below; each card has a slim vertical priority spine in its impact colour + a colour-coded
  priority badge.
- **Delight, cheaply:** example-ticket chips (include one multi-issue example) that fill the box on
  click; a copy-JSON button; a "Deliberating…" loading state; a ~400ms card "settle" animation,
  staggered ~80ms when there are multiple cards.
- **Quality floor:** responsive/mobile, visible keyboard focus rings, respect `prefers-reduced-motion`.
- **Copy voice:** active and plain. Button: "Route ticket." Empty state: "Paste a support ticket to see where it goes."

## File layout
- `app/page.tsx` — composer + results
- `components/` — `TicketComposer`, `IssueCard`, `JsonToggle`, `ProcessingTime`
- `lib/api.ts` — fetch wrapper that reads `NEXT_PUBLIC_API_URL`
- `lib/types.ts` — the shared types (below)
- `.env.local` (git-ignored) holds `NEXT_PUBLIC_API_URL`; commit `.env.local.example`.
- `.gitignore` includes `node_modules/`, `.next/`, `.env*.local`.

## Types (lib/types.ts)
```ts
export type Priority = "High" | "Medium" | "Low";
export interface Issue {
  id: number; category: string; priority: Priority;
  assigned_team: string; reasoning: string;
}
export interface RouteResponse { issues: Issue[]; processing_time_ms: number; }
```

## Do NOT (out of scope)
No auth/login. No state library beyond React state. No browser localStorage/sessionStorage. No
database calls. Do not reshape or re-derive the API contract — render exactly what the backend returns.