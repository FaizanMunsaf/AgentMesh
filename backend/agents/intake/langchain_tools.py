from langchain_core.tools import tool

from agents.intake.tools import lookup_policy_for_agent


@tool
def lookup_policy(policy_number: str) -> str:
    """Look up a policy by number. Returns status, holder, and coverage types."""
    return lookup_policy_for_agent(policy_number)
