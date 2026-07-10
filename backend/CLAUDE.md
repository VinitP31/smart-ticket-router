# Smart Ticket Router — Backend · CLAUDE.md

Context for Claude Code. Read this before writing or editing any backend code.
Full reference lives in `../docs/Master_doc.md` — consult a specific section when you need depth.

## What this is
Support-ticket router backend. Input: one free-text ticket. Output: a fixed JSON object.
Python + FastAPI. Stateless. No database. English-only routing. This is an MVP — build the
required things end to end with no malfunctions; do not add out-of-scope features.

## FIVE GOLDEN RULES (never break)
1. The API ALWAYS returns the same shape: `{ "issues": [ ... ], "processing_time_ms": int }`. Only the array length changes.
2. The LLM classifies; the BACKEND owns everything deterministic (issue id, assigned_team, timing, validation).
3. Category is a CLOSED set of 9 (below). The model never invents a category.
4. Priority = business impact. NOT tone. NOT category.
5. PII is redacted (regex) BEFORE the ticket ever reaches the LLM.

## API contract
- `POST /route`  body: `{ "ticket": "<text>" }`
- `200 OK`: `{ "issues": [ {id, category, priority, assigned_team, reasoning} ], "processing_time_ms": int }`
- `GET /health`: `{ "status": "ok" }`
- NEVER return 5xx. On any internal failure return `200` with the fallback (below).
- Every issue object always has all five fields: `id`(int), `category`(str), `priority`(str), `assigned_team`(str), `reasoning`(str).
- There is NO `confidence` field (roadmap).
- `processing_time_ms` is a top-level sibling of `issues`; the issues array schema itself never changes.

## The 9 categories → teams (backend maps the team, NOT the LLM)
1. Authentication & Login     → Identity Team
2. Billing & Payments         → Finance Team
3. Technical Bug              → Engineering Team
4. Performance & Availability → Platform Team
5. Feature Request           → Product Team
6. Account Management        → Customer Success Team
7. Security & Access         → Security Team
8. Orders & Operations       → Operations Team
9. General / Uncategorized   → Human Triage   (fallback: vague, insufficient info, spam, unsupported)

## Priority (business impact; independent of category; tone never changes it)
- **High**: financial loss, incorrect payment, security/privacy risk, outage, many users affected, critical workflow blocked, revenue impact, long-pending critical issue.
- **Medium**: one user's important workflow affected, workaround available, moderate impact.
- **Low**: questions, feature requests, documentation, suggestions, routine account changes.
- The SAME category can be different priorities (billing question = Low; double charge = High).

## Responsibility split
- LLM: detect independent issues; classify category; decide priority; write one-line reasoning.
- Backend: PII redaction; word count; summarization trigger; JSON validation; issue id generation (1..N); category→team mapping; timing; response assembly.

## Multi-issue handling
Detect every INDEPENDENT problem → one issue object each. Never merge unrelated issues into one
category. Never over-split a single problem (a crash WITH a 500 error is ONE issue).

## Long-ticket handling
`<= ~300 words` → route directly. `> ~300 words` → ONE summarization LLM call first (preserve
every distinct problem, request, and urgency signal), then route the summary. Never truncate,
never chunk.

## PII redaction (regex, before any LLM call → placeholders)
Email→`[EMAIL]`, Phone→`[PHONE]`, Card→`[CARD]`, Aadhaar→`[AADHAAR]`, PAN→`[PAN]`, Account→`[ACCOUNT]`.
Regex is sufficient for the MVP (enterprise would use a DLP/NER service — out of scope).

## Prompting
Few-shot with ~6–8 hand-written examples covering all 9 categories + the edge cases (angry tone,
vague, ambiguous) + a multi-issue example. There is NO dataset and no fine-tuning. English-only.
Enforce structure via the provider's structured-output/tool-use mode AND Pydantic validation.

## Validation & reliability
- Pydantic enums for `category` and `priority` (closed sets) — invalid values FAIL validation.
- Repair loop: MAXIMUM ONE retry on invalid JSON, then fallback. Never loop more than once.
- `temperature = 0` for consistency.
- Fallback (auth fail / service error / invalid-after-repair) — return this exact shape:
  `{ "issues": [ { "id": 1, "category": "General / Uncategorized", "priority": "Medium", "assigned_team": "Human Triage", "reasoning": "Automatic routing unavailable. Requires manual review." } ], "processing_time_ms": <elapsed> }`
  (Priority Medium on fallback so a possibly-urgent ticket still gets prompt human attention.)

## Timing
Measure TOTAL end-to-end time at the API boundary (in `main.py`, not inside `route_ticket`) using
`time.perf_counter()`. It includes the summarization step when it runs, so long tickets are
expected to be slower — that is correct. Return it as `processing_time_ms`.

## Secrets
API key in `.env` (git-ignored). Commit `.env.example` with key NAMES only. Never hardcode keys.
`.gitignore` MUST include `.env`.

## Stack & file layout
Python 3.11+, FastAPI, Pydantic v2, python-dotenv, LLM SDK (anthropic or openai), ruff (PEP8).
- `src/config.py` — load env (API key, LLM_MODEL, ALLOWED_ORIGINS)
- `src/taxonomy.py` — the 9 categories, TEAM_BY_CATEGORY, priority rubric text
- `src/schema.py` — Pydantic models (IssueClassification, RoutingModelOutput, Issue)
- `src/prompts.py` — routing system prompt + 6–8 few-shot + summarization prompt
- `src/redact.py` — regex PII redaction
- `src/llm_client.py` — provider SDK wrapper + transient-error retries + typed errors (e.g. LLMAuthError)
- `src/router.py` — orchestrates the pipeline
- `main.py` — FastAPI app + timing at the boundary + CORS
- `cli.py` — terminal tester (prints issues + total time)
- `data/sample_tickets.json` — demo tickets incl. multi-issue cases
- `tests/test_router.py` — contract / batch tests

## Pipeline (router.py)
redact PII → (if > 300 words, summarize) → route via LLM with few-shot → validate with Pydantic →
repair ONCE if invalid → assemble (assign id 1..N + look up team) → otherwise return fallback.

## Build order (backend FIRST, verify in CLI before FastAPI/frontend)
taxonomy → schema → redact → prompts → config → llm_client → router → cli. Then main.py.
Commit after each small slice with a real message.

## Do NOT (out of MVP scope)
No database, no user auth/login, no logging framework, no rate limiting. Do not invent categories,
teams, or fields. Do not change the response contract. Keep functions small; use type hints; PEP8 via ruff.