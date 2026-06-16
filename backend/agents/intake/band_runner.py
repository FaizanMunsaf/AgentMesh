import asyncio

from band import Agent
from band.adapters import LangGraphAdapter
from band.config import load_agent_config
from dotenv import load_dotenv
from langgraph.checkpoint.memory import InMemorySaver

from agents.intake.prompts import SYSTEM_PROMPT
from agents.intake.langchain_tools import lookup_policy
from shared.llm import get_chat_model


async def main():
    load_dotenv()
    agent_id, api_key = load_agent_config("intake")

    llm = get_chat_model()
    adapter = LangGraphAdapter(
        llm=llm,
        checkpointer=InMemorySaver(),
        custom_section=SYSTEM_PROMPT,
        additional_tools=[lookup_policy],
    )

    agent = Agent.create(adapter=adapter, agent_id=agent_id, api_key=api_key)
    print("Intake agent running — waiting for claim messages on Band...")
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())
