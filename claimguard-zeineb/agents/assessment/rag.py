import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from langchain_core.tools import tool

_CHROMA_PATH = "data/chroma_db"
_EF = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
_CLIENT = chromadb.PersistentClient(path=_CHROMA_PATH)
_POLICY_COL = _CLIENT.get_or_create_collection("novacover_policy", embedding_function=_EF)
_NAIC_COL = _CLIENT.get_or_create_collection("naic_regulations", embedding_function=_EF)


@tool
def retrieve_policy_clauses(coverage_type: str, description: str) -> str:
    """Retrieve the 3 most relevant NovaCover policy clauses for this claim."""
    query = f"{coverage_type}: {description}"
    results = _POLICY_COL.query(query_texts=[query], n_results=3)
    docs = results["documents"][0] if results["documents"] else []
    return "\n\n---\n\n".join(docs) if docs else "No relevant clauses found."


@tool
def retrieve_naic_clause(topic: str) -> str:
    """Retrieve the most relevant NAIC regulatory clause for denial or escalation citations."""
    results = _NAIC_COL.query(query_texts=[topic], n_results=1)
    docs = results["documents"][0] if results["documents"] else []
    return docs[0] if docs else "No relevant NAIC clause found."
