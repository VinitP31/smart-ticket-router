"""OpenAI SDK wrapper: builds few-shot messages, retries transient errors,
raises typed errors so the router can decide fallback vs retry."""

import json
import time

from openai import (
    APIConnectionError,
    APITimeoutError,
    AuthenticationError,
    OpenAI,
    RateLimitError,
)

from src.config import LLM_MODEL, OPENAI_API_KEY
from src.prompts import FEW_SHOT_EXAMPLES, ROUTING_SYSTEM_PROMPT, SUMMARIZATION_PROMPT

_MAX_TRANSIENT_RETRIES = 2
_RETRY_BACKOFF_SECONDS = 1.5

_client = OpenAI(api_key=OPENAI_API_KEY or "not-set")


class LLMAuthError(Exception):
    """Raised on an authentication failure. Never retried."""


class LLMServiceError(Exception):
    """Raised when transient retries are exhausted or a non-auth error occurs."""


def _few_shot_messages() -> list[dict]:
    messages = []
    for example in FEW_SHOT_EXAMPLES:
        messages.append({"role": "user", "content": example["ticket"]})
        messages.append(
            {
                "role": "assistant",
                "content": _issues_to_json(example["issues"]),
            }
        )
    return messages


def _issues_to_json(issues: list[dict]) -> str:
    return json.dumps({"issues": issues})


def _call_with_retries(messages: list[dict], json_mode: bool = False) -> str:
    kwargs = {"model": LLM_MODEL, "messages": messages, "temperature": 0}
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
    last_error: Exception | None = None
    for attempt in range(_MAX_TRANSIENT_RETRIES + 1):
        try:
            response = _client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except AuthenticationError as e:
            raise LLMAuthError(str(e)) from e
        except (RateLimitError, APIConnectionError, APITimeoutError) as e:
            last_error = e
            if attempt < _MAX_TRANSIENT_RETRIES:
                time.sleep(_RETRY_BACKOFF_SECONDS * (attempt + 1))
        except Exception as e:
            # Any other provider error (bad request, model not found, provider's
            # own 500, or anything unforeseen) is not worth retrying — a
            # malformed request won't fix itself. Fail fast to the fallback
            # instead of leaking an unhandled exception up to the API layer.
            last_error = e
            break
    raise LLMServiceError(str(last_error))


def classify_ticket(redacted_text: str, repair_note: str | None = None) -> str:
    """Returns raw JSON text from the routing call. repair_note appends the
    validation error on the one allowed repair attempt."""
    messages = [{"role": "system", "content": ROUTING_SYSTEM_PROMPT}]
    messages += _few_shot_messages()
    user_content = redacted_text
    if repair_note:
        user_content = f"{redacted_text}\n\n(Your previous output failed validation: {repair_note}; return ONLY valid JSON with an \"issues\" array.)"
    messages.append({"role": "user", "content": user_content})
    return _call_with_retries(messages, json_mode=True)


def summarize_ticket(redacted_text: str) -> str:
    """Returns condensed plain-text ticket for long (>~300 word) tickets."""
    messages = [
        {"role": "system", "content": SUMMARIZATION_PROMPT},
        {"role": "user", "content": redacted_text},
    ]
    return _call_with_retries(messages)
