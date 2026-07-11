"""Orchestrates the full pipeline: redact -> (summarize if long) -> classify ->
validate -> repair once -> assemble, or fallback on any failure. Never raises."""

import json

from pydantic import ValidationError

from src.llm_client import (
    LLMAuthError,
    LLMServiceError,
    classify_ticket,
    summarize_ticket,
)
from src.redact import redact_pii
from src.schema import RoutingModelOutput
from src.taxonomy import Category, Priority, TEAM_BY_CATEGORY

_LONG_TICKET_WORD_THRESHOLD = 300
_MAX_REPAIR_ATTEMPTS = 1


def _word_count(text: str) -> int:
    return len(text.split())


def fallback_route(reason: str) -> dict:
    return {
        "issues": [
            {
                "id": 1,
                "category": Category.GENERAL.value,
                "priority": Priority.MEDIUM.value,
                "assigned_team": TEAM_BY_CATEGORY[Category.GENERAL],
                "reasoning": f"Automatic routing unavailable ({reason}); requires manual review.",
            }
        ]
    }


def _assemble(model_output: RoutingModelOutput) -> dict:
    issues = [
        {
            "id": idx,
            "category": issue.category.value,
            "priority": issue.priority.value,
            "assigned_team": TEAM_BY_CATEGORY[issue.category],
            "reasoning": issue.reasoning,
        }
        for idx, issue in enumerate(model_output.issues, start=1)
    ]
    return {"issues": issues}


def route_ticket(raw_ticket: str) -> dict:
    text = redact_pii((raw_ticket or "").strip())
    if not text:
        return fallback_route("empty ticket")

    if _word_count(text) > _LONG_TICKET_WORD_THRESHOLD:
        try:
            text = summarize_ticket(text)
        except LLMAuthError:
            return fallback_route("authentication failed during summarization")
        except LLMServiceError:
            return fallback_route("service unavailable during summarization")

    repair_note = None
    for attempt in range(_MAX_REPAIR_ATTEMPTS + 1):
        try:
            raw_output = classify_ticket(text, repair_note=repair_note)
        except LLMAuthError:
            return fallback_route("authentication failed")
        except LLMServiceError:
            return fallback_route("LLM service unavailable")

        try:
            parsed = json.loads(raw_output)
            validated = RoutingModelOutput.model_validate(parsed)
            return _assemble(validated)
        except (json.JSONDecodeError, ValidationError) as e:
            repair_note = str(e)

    return fallback_route("invalid model output after repair attempt")
