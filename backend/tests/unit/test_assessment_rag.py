from agents.assessment.rag import retrieve_naic_clause, retrieve_policy_clauses
from scripts.ingest_rag import search_chunks


def test_search_policy_chunks():
    docs = search_chunks("novacover_policy", "collision coverage", n_results=2)
    assert isinstance(docs, list)


def test_retrieve_tools_return_strings():
    policy = retrieve_policy_clauses.invoke(
        {"coverage_type": "collision", "description": "rear-ended at red light"}
    )
    assert isinstance(policy, str)

    naic = retrieve_naic_clause.invoke({"topic": "claim denial notice"})
    assert isinstance(naic, str)
