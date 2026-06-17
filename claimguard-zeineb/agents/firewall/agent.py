import asyncio
import json
import os
import re
from typing import TypedDict

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, BaseMessage
from langgraph.graph import END, StateGraph
from langgraph.checkpoint.memory import InMemorySaver
from band import Agent
from band.adapters import LangGraphAdapter

from claimguard.agents.firewall.engine import apply_policy
from claimguard.shared.schemas import ClaimRecord, ClearanceRequest, ClearanceResponse


class FirewallState(TypedDict):
    messages: list[BaseMessage]


def process_clearance(state: FirewallState) -> FirewallState:
    last_msg = state["messages"][-1]
    if isinstance(last_msg, tuple):
        raw = last_msg[1]
    elif isinstance(last_msg.content, str):
        raw = last_msg.content
    else:
        raw = json.dumps(last_msg.content)

    print(f"[Firewall] Received message: {raw[:200]}")

    # Extract JSON object from raw message — Band prepends "[Sender]: @[[uuid]]" prefix
    json_match = re.search(r'\{.*\}', raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)

    try:
        payload = json.loads(raw)
        req = ClearanceRequest.model_validate(payload)
    except Exception as e:
        print(f"[Firewall] Parse error: {e}")
        error_msg = AIMessage(content=json.dumps({"error": f"Invalid clearance request: {e}"}))
        return {"messages": state["messages"] + [error_msg]}

    filtered, decisions = apply_policy(req.claim, req.role)
    response = ClearanceResponse(filtered_claim=filtered, decisions=decisions)
    reply = AIMessage(content=response.model_dump_json())
    print(f"[Firewall] Sending clearance response for role={req.role}")
    return {"messages": state["messages"] + [reply]}


def build_firewall_graph():
    builder = StateGraph(FirewallState)
    builder.add_node("process", process_clearance)
    builder.set_entry_point("process")
    builder.add_edge("process", END)
    return builder.compile(checkpointer=InMemorySaver())


async def main():
    load_dotenv()

    from band.config import load_agent_config
    agent_id, api_key = load_agent_config("firewall")

    graph = build_firewall_graph()

    adapter = LangGraphAdapter(
        graph=graph,
        checkpointer=InMemorySaver(),
    )

    agent = Agent.create(
        adapter=adapter,
        agent_id=agent_id,
        api_key=api_key,
    )

    print("Firewall agent running — waiting for clearance requests on Band...")
    while True:
        try:
            await agent.run()
        except Exception as e:
            print(f"Firewall disconnected ({e}), reconnecting in 3s...")
            await asyncio.sleep(3)


if __name__ == "__main__":
    asyncio.run(main())
