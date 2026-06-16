import asyncio

from band import Agent
from band.adapters import LangGraphAdapter
from band.config import load_agent_config
from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver

from agents.payout.prompts import SYSTEM_PROMPT
from shared.llm import get_chat_model


async def main():
    load_dotenv()
    agent_id, api_key = load_agent_config("payout")

    llm = get_chat_model()
    adapter = LangGraphAdapter(
        llm=llm,
        checkpointer=InMemorySaver(),
        custom_section=SYSTEM_PROMPT,
    )

    agent = Agent.create(adapter=adapter, agent_id=agent_id, api_key=api_key)
    print("Payout agent running — waiting for approved claims on Band...")
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())
