import os

from langchain_openai import ChatOpenAI


def get_chat_model() -> ChatOpenAI:
    # Accept either AIML_API_KEY or fallback to OPENAI_API_KEY for convenience
    api_key = os.environ.get("AIML_API_KEY") or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing AIML_API_KEY (or OPENAI_API_KEY). Set it in backend/.env or the environment."
        )

    return ChatOpenAI(
        model=os.environ.get("MODEL_NAME", "gpt-4o-mini"),
        api_key=api_key,
        base_url=os.environ.get("AIML_BASE_URL", "https://api.aimlapi.com/v1"),
    )
