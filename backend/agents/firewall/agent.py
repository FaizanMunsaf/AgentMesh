"""Firewall agent — redacts PII before downstream processing."""

import re

SSN_PATTERN = re.compile(r"\b\d{3}-?\d{2}-?\d{4}\b")


def redact_ssn(value: str | None) -> str | None:
    """Mask all digits in an SSN string."""
    if not value:
        return None
    return re.sub(r"\d", "X", value)


def contains_pii(text: str) -> bool:
    """Detect common PII patterns in free text."""
    return bool(SSN_PATTERN.search(text))
