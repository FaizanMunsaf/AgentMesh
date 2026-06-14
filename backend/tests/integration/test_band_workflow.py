from decision_log.logger import clear_decision_log, get_decision_log, log_decision


def test_decision_log_roundtrip():
    clear_decision_log()
    log_decision("Intake Agent", "Received claim", claim_id="abc-123")
    log_decision("Firewall Agent", "Redacted SSN", claim_id="abc-123")

    entries = get_decision_log()
    assert len(entries) == 2
    assert entries[0]["agent"] == "Intake Agent"
    assert entries[1]["action"] == "Redacted SSN"
