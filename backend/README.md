# Smart Ticket Router — Backend

Reads a free-text support ticket and returns a structured routing decision
(category, priority, assigned team, reasoning) for every independent issue it
contains. Python + FastAPI, stateless, no database. Frontend lives in
[`../frontend`](../frontend) in this same repo.

Full design/architecture reference: [`../docs/Master_doc.md`](../docs/Master_doc.md).

## Prerequisites

- Python 3.11+
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and fill in `OPENAI_API_KEY`. Leave `LLM_MODEL` and `ALLOWED_ORIGINS`
at their defaults unless you have a reason to change them.

## Run

**Terminal (fastest way to try it, no server needed):**
```bash
python cli.py "I was charged twice this month, please refund the extra payment."
```
Prints word count, per-issue breakdown, and total response time. For a ticket
over ~300 words, it also prints the summarized text sent to the router before
routing — useful for seeing the long-ticket path work.

**API server:**
```bash
uvicorn main:app --reload
```
Runs at `http://127.0.0.1:8000`.

## Try it

```bash
curl -X POST http://127.0.0.1:8000/route \
  -H "Content-Type: application/json" \
  -d '{"ticket": "I was charged twice this month, please refund."}'
```

Expected response:
```json
{
  "issues": [
    {
      "id": 1,
      "category": "Billing & Payments",
      "priority": "High",
      "assigned_team": "Finance Team",
      "is_ticket": true,
      "reasoning": "Duplicate charge is a direct financial loss to the customer."
    }
  ],
  "processing_time_ms": 1180
}
```

Health check: `curl http://127.0.0.1:8000/health` → `{"status": "ok"}`

## Lint / format

```bash
ruff check .
ruff format --check .
```
Both should report clean with no changes needed.

## Tests

```bash
pytest tests/test_router.py -v
```
Runs 27 sample tickets (`data/sample_tickets.json`) through the real pipeline —
needs a working `OPENAI_API_KEY` in `.env`, makes real API calls.

## Contract

- `POST /route` — body `{"ticket": "<text>"}` → `200 OK` always (never a 5xx;
  internal failures return a valid Human-Triage fallback instead of erroring)
- `GET /health` → `{"status": "ok"}`
- 9 fixed categories, 3 priority levels, PII redacted before any LLM call —
  full contract details in [`Master_doc.md`](../docs/Master_doc.md).
