import asyncio
from typing import Annotated, TypedDict

from band import Agent
from band.adapters import LangGraphAdapter
from band.config import load_agent_config
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, ToolMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from agents.payout.prompts import SYSTEM_PROMPT
from shared.llm import get_chat_model


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]


def build_react_graph(llm, tools, checkpointer=None):
    tool_map = {t.name: t for t in tools}
    llm_with_tools = llm.bind_tools(tools) if tools else llm

    async def call_model(state):
        response = await llm_with_tools.ainvoke(state["messages"])
        return {"messages": [response]}

    async def call_tools(state):
        last = state["messages"][-1]
        results = []
        for tc in last.tool_calls:
            t = tool_map.get(tc["name"])
            try:
                result = await t.ainvoke(tc["args"]) if t else f"Unknown tool: {tc['name']}"
            except Exception as e:
                result = f"Error calling {tc['name']}: {e}"
            results.append(ToolMessage(content=str(result), tool_call_id=tc["id"], name=tc["name"]))
        return {"messages": results}

    def should_continue(state):
        last = state["messages"][-1]
        if isinstance(last, AIMessage) and getattr(last, "tool_calls", None):
            return "tools"
        return END

    builder = StateGraph(AgentState)
    builder.add_node("agent", call_model)
    builder.add_node("tools", call_tools)
    builder.set_entry_point("agent")
    builder.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    builder.add_edge("tools", "agent")
    return builder.compile(checkpointer=checkpointer)


async def main():
    load_dotenv()
    agent_id, api_key = load_agent_config("payout")

    llm = get_chat_model()
    checkpointer = InMemorySaver()

    def graph_factory(band_tools):
        return build_react_graph(llm, band_tools, checkpointer=checkpointer)

    adapter = LangGraphAdapter(
        graph_factory=graph_factory,
        custom_section=SYSTEM_PROMPT,
        inject_system_prompt=True,
    )

    agent = Agent.create(adapter=adapter, agent_id=agent_id, api_key=api_key)
    print("Payout agent running — waiting for approved claims on Band...")
    while True:
        try:
            await agent.run()
        except Exception as e:
            print(f"Payout disconnected ({e}), reconnecting in 3s...")
            await asyncio.sleep(3)


if __name__ == "__main__":
    asyncio.run(main())
