"""Payout agent — processes approved claim disbursements."""


def calculate_payout(amount: float, fee_rate: float = 0.0) -> float:
    """Calculate net payout after optional processing fee."""
    return round(amount * (1 - fee_rate), 2)


def format_payout_message(claimant: str, amount: float) -> str:
    return f"${amount:.2f} disbursed to {claimant}"
