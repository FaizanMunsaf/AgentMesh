import asyncio
import json
from typing import TypedDict

from band import Agent
from band.adapters import LangGraphAdapter
from band.config import load_agent_config
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, BaseMessage
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, StateGraph

from agents.firewall.engine import apply_policy
from models.claim_record import ClearanceRequest, ClearanceResponse


class FirewallState(TypedDict):
    messages: list[BaseMessage]


def process_clearance(state: FirewallState) -> FirewallState:
    last_msg = state["messages"][-1]
    raw = (
        last_msg.content
        if isinstance(last_msg.content, str)
        else json.dumps(last_msg.content)
    )

    try:
        payload = json.loads(raw)
        req = ClearanceRequest.model_validate(payload)
    except Exception as e:
        error_msg = AIMessage(
            content=json.dumps({"error": f"Invalid clearance request: {e}"})
        )
        return {"messages": state["messages"] + [error_msg]}

    filtered, decisions = apply_policy(req.claim, req.role)
    response = ClearanceResponse(filtered_claim=filtered, decisions=decisions)
    reply = AIMessage(content=response.model_dump_json())
    return {"messages": state["messages"] + [reply]}


def build_firewall_graph():
    builder = StateGraph(FirewallState)
    builder.add_node("process", process_clearance)
    builder.set_entry_point("process")
    builder.add_edge("process", END)
    return builder.compile(checkpointer=InMemorySaver())


async def main():
    load_dotenv()
    agent_id, api_key = load_agent_config("firewall")

    graph = build_firewall_graph()
    adapter = LangGraphAdapter(graph=graph, checkpointer=InMemorySaver())

    agent = Agent.create(adapter=adapter, agent_id=agent_id, api_key=api_key)
    print("Firewall agent running — waiting for clearance requests on Band...")
    await agent.run()


if __name__ == "__main__":
    asyncio.run(main())
