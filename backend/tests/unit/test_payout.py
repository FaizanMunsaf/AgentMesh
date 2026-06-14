from agents.payout.agent import calculate_payout, format_payout_message


def test_calculate_payout_no_fee():
    assert calculate_payout(1000.0) == 1000.0


def test_calculate_payout_with_fee():
    assert calculate_payout(1000.0, fee_rate=0.05) == 950.0


def test_format_payout_message():
    msg = format_payout_message("Jane Doe", 2500.0)
    assert msg == "$2500.00 disbursed to Jane Doe"
