import json
from pathlib import Path

from langchain_core.tools import tool

from scripts.ingest_rag import search_chunks

_CHUNKS_PATH = Path(__file__).resolve().parents[2] / "data" / "rag_chunks.json"


def _ensure_chunks() -> None:
    if not _CHUNKS_PATH.exists():
        from scripts.ingest_rag import main

        main()


@tool
def retrieve_policy_clauses(coverage_type: str, description: str) -> str:
    """Retrieve the 3 most relevant NovaCover policy clauses for this claim."""
    _ensure_chunks()
    query = f"{coverage_type}: {description}"
    docs = search_chunks("novacover_policy", query, n_results=3)
    return "\n\n---\n\n".join(docs) if docs else "No relevant clauses found."


@tool
def retrieve_naic_clause(topic: str) -> str:
    """Retrieve the most relevant NAIC regulatory clause for citations."""
    _ensure_chunks()
    docs = search_chunks("naic_regulations", topic, n_results=1)
    return docs[0] if docs else "No relevant NAIC clause found."
