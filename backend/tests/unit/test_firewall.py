from agents.firewall.agent import contains_pii, redact_ssn


def test_redact_ssn_masks_digits():
    assert redact_ssn("123-45-6789") == "XXX-XX-XXXX"


def test_redact_ssn_none_returns_none():
    assert redact_ssn(None) is None


def test_contains_pii_detects_ssn():
    assert contains_pii("My SSN is 123-45-6789") is True
    assert contains_pii("No sensitive data here") is False
