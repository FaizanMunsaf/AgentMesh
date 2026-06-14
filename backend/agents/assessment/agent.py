"""Assessment agent — evaluates claim validity."""

MAX_AUTO_APPROVE_AMOUNT = 10_000.0


def assess_claim(amount: float, policy_number: str) -> tuple[bool, str]:
    """
    Assess a claim and return (approved, reason).
    Demo rule: auto-approve claims under $10,000 with valid policy prefix.
    """
    if not policy_number.startswith("POL-"):
        return False, "Invalid policy number format"

    if amount <= 0:
        return False, "Claim amount must be positive"

    if amount > MAX_AUTO_APPROVE_AMOUNT:
        return (
            False,
            f"Amount ${amount:.2f} exceeds ${MAX_AUTO_APPROVE_AMOUNT:,.0f} limit",
        )

    return True, f"Amount ${amount:.2f} within policy limits"
