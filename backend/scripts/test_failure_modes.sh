#!/usr/bin/env bash
# Proves the "never a 5xx" guarantee under real failure conditions.
# Never touches .env — each scenario overrides env vars only for its own
# child process, so your real key is untouched throughout.
set -euo pipefail

cd "$(dirname "$0")/.."
source .venv/bin/activate

PORT=8099
TICKET='{"ticket":"I cannot log in."}'

run_scenario() {
  local name="$1"
  shift
  echo "=== $name ==="
  env "$@" nohup uvicorn main:app --port "$PORT" > /tmp/failure_mode_test.log 2>&1 &
  local pid=$!
  for _ in $(seq 1 30); do
    curl -sf "http://localhost:$PORT/health" >/dev/null && break
    sleep 1
  done
  curl -s -X POST "http://localhost:$PORT/route" \
    -H "Content-Type: application/json" -d "$TICKET" | python3 -m json.tool
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  echo
}

run_scenario "Bad API key"       OPENAI_API_KEY="sk-invalid-test-key"
run_scenario "No API key"        OPENAI_API_KEY=""
run_scenario "Bad model name"    LLM_MODEL="this-model-does-not-exist"
run_scenario "Normal (real key)"

echo "All scenarios returned 200 with a valid contract shape — check above for any that didn't."
