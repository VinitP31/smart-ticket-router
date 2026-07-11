"""Contract / batch tests (Master_doc Part 24). Runs the real pipeline against
every sample ticket — needs a working OPENAI_API_KEY in .env."""

import json
from pathlib import Path

import pytest

from src.router import route_ticket

REQUIRED_FIELDS = {"id", "category", "priority", "assigned_team", "reasoning"}
SAMPLE_TICKETS_PATH = Path(__file__).parent.parent / "data" / "sample_tickets.json"
TICKETS = json.loads(SAMPLE_TICKETS_PATH.read_text())


@pytest.mark.parametrize("ticket", TICKETS, ids=[t["id"] for t in TICKETS])
def test_ticket_matches_contract(ticket):
    resp = route_ticket(ticket["ticket"])
    assert resp["issues"], f"{ticket['id']}: empty issues array"
    for issue in resp["issues"]:
        assert REQUIRED_FIELDS <= set(issue), f"{ticket['id']}: missing fields in {issue}"

    expected = ticket.get("expected_issue_count")
    if expected:
        assert len(resp["issues"]) == expected, (
            f"{ticket['id']}: expected {expected} issues, got {len(resp['issues'])}"
        )


if __name__ == "__main__":
    ok = 0
    for t in TICKETS:
        resp = route_ticket(t["ticket"])
        assert resp["issues"] and all(REQUIRED_FIELDS <= set(i) for i in resp["issues"]), t["id"]
        ok += 1
    print(f"{ok}/{len(TICKETS)} tickets valid")
