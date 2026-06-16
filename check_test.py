import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Band Custom GUI Backend")

# Configuration
BAND_API_BASE = "https://app.band.ai/api/v1"
# Replace with your primary Band Platform/User API Key
BAND_API_KEY = "band_u_1781585178_410sOa6Lhat5FJieGr8EXbn_v1VEG9az" 

HEADERS = {
    "Authorization": f"Bearer {BAND_API_KEY}",
    "Content-Type": "application/json"
}

# The 3 remote agents you have configured in your Band account
AGENTS_TO_INVITE = [
    "@faizanmunsaf/hackthon-intake",
    "@faizanmunsaf/hackthon-firewall",
    "@faizanmunsaf/hackthon-assessment"
]

class ChatInitiateRequest(Model=BaseModel):
    user_message: str  # e.g., "John Doe, Policy NVC-10002, Auto Comprehensive, minor fender bender..."

@app.post("/api/v1/start-claim-chat")
def start_claim_chat(payload: ChatInitiateRequest):
    try:
        # Step 1: Create a brand new Chat Room session
        room_payload = {"name": "GUI Claim Session"}
        room_res = requests.post(f"{BAND_API_BASE}/chatrooms", json=room_payload, headers=HEADERS)
        
        if room_res.status_code != 201:
            raise HTTPException(status_code=room_res.status_code, detail="Failed to create chat room.")
        
        room_id = room_res.json().get("id")

        # Step 2: Programmatically invite all 3 workflow agents into the room
        for agent_handle in AGENTS_TO_INVITE:
            invite_payload = {"handle": agent_handle}
            invite_res = requests.post(
                f"{BAND_API_BASE}/chatrooms/{room_id}/participants", 
                json=invite_payload, 
                headers=HEADERS
            )
            if invite_res.status_code != 201:
                print(f"Warning: Could not invite agent {agent_handle}")

        # Step 3: Post the initial message to kick off the Intake agent
        # We prepend the mention bubble so the platform routes it to Intake first
        message_payload = {
            "text": f"@faizanmunsaf/hackthon-intake {payload.user_message}"
        }
        msg_res = requests.post(
            f"{BAND_API_BASE}/chatrooms/{room_id}/messages", 
            json=message_payload, 
            headers=HEADERS
        )
        
        if msg_res.status_code != 201:
            raise HTTPException(status_code=msg_res.status_code, detail="Failed to route initial message.")

        # Return the room ID to your custom GUI frontend
        return {
            "status": "success",
            "message": "Chat workflow successfully initialized.",
            "room_id": room_id
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal communication error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)