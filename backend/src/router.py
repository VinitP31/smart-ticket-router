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


def route_ticket(raw_ticket: str, debug: dict | None = None) -> dict:
    """Public entry point. Wraps _route in a final safety net so a bug
    anywhere in the pipeline can never surface as a 5xx to the caller.

    `debug`, if passed a dict, gets populated with pipeline internals
    (e.g. the summarized text) for CLI/demo inspection. The API layer
    (main.py) never passes this — the response contract is unaffected."""
    try:
        return _route(raw_ticket, debug)
    except Exception as e:
        return fallback_route(f"unexpected internal error: {type(e).__name__}")


def _route(raw_ticket: str, debug: dict | None = None) -> dict:
    text = redact_pii((raw_ticket or "").strip())
    if not text:
        return fallback_route("empty ticket")

    was_long = _word_count(text) > _LONG_TICKET_WORD_THRESHOLD
    if debug is not None:
        debug["word_count"] = _word_count(text)
        debug["was_summarized"] = was_long

    if was_long:
        try:
            text = summarize_ticket(text)
            if debug is not None:
                debug["summary"] = text
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
            if debug is not None:
                # Internal-only, never part of the API response — see schema.py.
                debug["confidences"] = [issue.confidence for issue in validated.issues]
            return _assemble(validated)
        except (json.JSONDecodeError, ValidationError) as e:
            repair_note = str(e)

    return fallback_route("invalid model output after repair attempt")
