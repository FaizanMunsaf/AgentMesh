import json
from datetime import UTC, datetime
from pathlib import Path

AUDIT_LOG_PATH = Path(__file__).parent / "audit_log.json"
FIREWALL_LOG_PATH = Path("logs/decisions.jsonl")


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
        "source": "pipeline",
    }

    entries = json.loads(AUDIT_LOG_PATH.read_text(encoding="utf-8"))
    entries.append(entry)
    AUDIT_LOG_PATH.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    return entry


def log_firewall_decisions(
    claim_id: str, target_agent: str, decisions: list[dict]
) -> None:
    """Mirror firewall field decisions into the unified audit log."""
    for d in decisions:
        sensitivity = d.get("sensitivity", "LOW")
        log_decision(
            agent="Firewall Agent",
            action=f"{d['action']} {d['field']}",
            claim_id=claim_id,
            details=f"[{target_agent}] {d.get('reason', '')} (sensitivity: {sensitivity})",
        )


def _read_firewall_log() -> list[dict]:
    if not FIREWALL_LOG_PATH.exists():
        return []
    entries = []
    for line in FIREWALL_LOG_PATH.read_text(encoding="utf-8").strip().split("\n"):
        if not line.strip():
            continue
        raw = json.loads(line)
        entries.append(
            {
                "timestamp": raw.get("timestamp", ""),
                "agent": "Firewall Agent",
                "action": f"{raw.get('action', '')} {raw.get('field', '')}".strip(),
                "claim_id": raw.get("claim_id"),
                "details": (
                    f"[{raw.get('target_agent', '')}] {raw.get('reason', '')} "
                    f"(sensitivity: {raw.get('sensitivity', 'LOW')})"
                ),
                "source": "firewall",
            }
        )
    return entries


def get_decision_log() -> list[dict]:
    """Return merged pipeline and firewall decision entries."""
    _ensure_log_file()
    pipeline_entries = json.loads(AUDIT_LOG_PATH.read_text(encoding="utf-8"))
    firewall_entries = _read_firewall_log()

    seen = set()
    merged: list[dict] = []
    for entry in pipeline_entries + firewall_entries:
        key = (
            entry.get("timestamp"),
            entry.get("agent"),
            entry.get("action"),
            entry.get("claim_id"),
            entry.get("details"),
        )
        if key in seen:
            continue
        seen.add(key)
        merged.append(entry)

    return merged


def clear_decision_log() -> None:
    """Reset both audit logs."""
    AUDIT_LOG_PATH.write_text("[]", encoding="utf-8")
    FIREWALL_LOG_PATH.parent.mkdir(exist_ok=True)
    FIREWALL_LOG_PATH.write_text("", encoding="utf-8")
