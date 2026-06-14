import json
from datetime import UTC, datetime
from pathlib import Path

AUDIT_LOG_PATH = Path(__file__).parent / "audit_log.json"


def _ensure_log_file() -> None:
    AUDIT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not AUDIT_LOG_PATH.exists():
        AUDIT_LOG_PATH.write_text("[]", encoding="utf-8")


def log_decision(
    agent: str,
    action: str,
    claim_id: str | None = None,
    details: str | None = None,
) -> dict:
    """Append a decision entry to the audit log."""
    _ensure_log_file()

    entry = {
        "timestamp": datetime.now(UTC).strftime("%H:%M"),
        "agent": agent,
        "action": action,
        "claim_id": claim_id,
        "details": details,
    }

    entries = json.loads(AUDIT_LOG_PATH.read_text(encoding="utf-8"))
    entries.append(entry)
    AUDIT_LOG_PATH.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    return entry


def get_decision_log() -> list[dict]:
    """Return all decision log entries."""
    _ensure_log_file()
    return json.loads(AUDIT_LOG_PATH.read_text(encoding="utf-8"))


def clear_decision_log() -> None:
    """Reset the audit log (useful for demos)."""
    AUDIT_LOG_PATH.write_text("[]", encoding="utf-8")
