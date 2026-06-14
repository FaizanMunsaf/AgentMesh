import pytest
from claimguard.agents.assessment.rag import retrieve_policy_clauses, retrieve_naic_clause


def test_retrieve_policy_clauses_returns_strings():
    results = retrieve_policy_clauses.invoke({
        "coverage_type": "collision",
        "description": "Rear-ended at a red light, vehicle damage and whiplash"
    })
    assert isinstance(results, str)
    assert len(results) > 50  # non-empty content


def test_retrieve_naic_clause_returns_string():
    result = retrieve_naic_clause.invoke({"topic": "claim denial procedures"})
    assert isinstance(result, str)
    assert len(result) > 20
