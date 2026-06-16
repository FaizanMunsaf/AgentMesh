"""Build searchable policy chunks for the Assessment agent."""

import json
import re
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
CHUNKS_PATH = DATA_DIR / "rag_chunks.json"
CHUNK_SIZE = 500


def _chunk_text(text: str, chunk_size: int = CHUNK_SIZE) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


def _score(query: str, document: str) -> int:
    query_tokens = set(re.findall(r"[a-z0-9]+", query.lower()))
    doc_tokens = set(re.findall(r"[a-z0-9]+", document.lower()))
    return len(query_tokens & doc_tokens)


def ingest_collection(name: str, markdown_path: Path) -> list[dict]:
    text = markdown_path.read_text(encoding="utf-8")
    chunks = _chunk_text(text)
    return [{"collection": name, "text": chunk} for chunk in chunks]


def search_chunks(collection: str, query: str, n_results: int = 3) -> list[str]:
    if not CHUNKS_PATH.exists():
        return []
    all_chunks = json.loads(CHUNKS_PATH.read_text(encoding="utf-8"))
    filtered = [c for c in all_chunks if c["collection"] == collection]
    ranked = sorted(filtered, key=lambda c: _score(query, c["text"]), reverse=True)
    return [c["text"] for c in ranked[:n_results] if _score(query, c["text"]) > 0]


def main() -> None:
    policy_chunks = ingest_collection(
        "novacover_policy", DATA_DIR / "novacover_policy.md"
    )
    naic_chunks = ingest_collection(
        "naic_regulations", DATA_DIR / "naic_regulations.md"
    )
    all_chunks = policy_chunks + naic_chunks
    CHUNKS_PATH.write_text(json.dumps(all_chunks, indent=2), encoding="utf-8")
    print(
        f"Ingested {len(policy_chunks)} policy chunks and "
        f"{len(naic_chunks)} NAIC chunks to {CHUNKS_PATH}"
    )


if __name__ == "__main__":
    main()
