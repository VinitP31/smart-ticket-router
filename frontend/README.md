# Smart Ticket Router — Frontend

Paste a support ticket, get an instant routing decision — category, priority, assigned
team, and reasoning — rendered as one card per issue. Next.js + TypeScript + Tailwind CSS.
Backend lives in [`../backend`](../backend) in this same repo.

Full design/architecture reference: [`../docs/Master_doc.md`](../docs/Master_doc.md).

## Prerequisites

- Node.js 20+
- The backend running locally — see [`../backend/README.md`](../backend/README.md)

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Open `.env.local` and set `NEXT_PUBLIC_API_URL` to wherever the backend is running
(default: `http://localhost:8000`).

## Run

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Try it

1. Click one of the example chips (e.g. "Multi-issue") to fill the textarea, or paste your
   own ticket text.
2. Click **Route ticket** (or ⌘/Ctrl+Enter). A 4-stage progress checklist plays while the
   request is in flight.
3. Read the issue card(s) — one per detected issue, color-coded by category, with a
   separate priority badge.
4. Click **View Structured JSON** to see the exact backend response, verbatim.
5. Toggle light/dark mode with the sun/moon button (top right) — persists across reloads.

To see the "service unavailable" state: stop the backend (or point `NEXT_PUBLIC_API_URL` at
a dead URL) and submit a ticket.

## Lint / typecheck / build

```bash
npm run lint
npx tsc --noEmit
npm run build
```
All three should report clean with no errors.

## What it renders

- One card per issue in the backend's response — `category`, `priority`, `assigned_team`,
  `reasoning` — keyed by `issue.id` (never array index).
- A "N issues detected" pill when a ticket splits into multiple issues.
- Processing time (`✓ Analysis Complete · Processed in X.XXs`).
- The backend never returns a 5xx — a routing failure still comes back as a normal
  Human-Triage card. The only true error state is the frontend being unable to reach the
  backend at all.

Full API contract: [`Master_doc.md`](../docs/Master_doc.md).
