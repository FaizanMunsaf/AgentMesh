import os

from langchain_openai import ChatOpenAI


def get_chat_model() -> ChatOpenAI:
    return ChatOpenAI(
        model=os.environ.get("MODEL_NAME", "gpt-4o-mini"),
        api_key=os.environ["AIML_API_KEY"],
        base_url=os.environ.get("AIML_BASE_URL", "https://api.aimlapi.com/v1"),
    )
