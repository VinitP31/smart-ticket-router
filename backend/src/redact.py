"""Regex PII redaction — runs before any LLM call, per the five golden rules."""

import re

# Order matters: longer/more specific digit patterns must run before shorter
# ones, else e.g. a 16-digit card gets chopped into an AADHAAR match first.
_PATTERNS = [
    ("[EMAIL]", re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")),
    ("[PAN]", re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]\b")),
    ("[CARD]", re.compile(r"\b(?:\d[ -]?){13,19}\b")),
    ("[AADHAAR]", re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")),
    ("[PHONE]", re.compile(r"\b(?:\+?\d[\d ()-]{7,}\d)\b")),
    ("[ACCOUNT]", re.compile(r"\b\d{9,18}\b")),
]


def redact_pii(text: str) -> str:
    for tag, pattern in _PATTERNS:
        text = pattern.sub(tag, text)
    return text
