# backend/endpoints/call.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Load Twilio credentials
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
EXPERT_PHONE_NUMBER = os.getenv("CALL_RECIPIENT_PHONE")

# Fallback Meet link
FALLBACK_MEET_URL = "https://meet.google.com/she-fiek-pkx"  # replace with your actual Meet link

class CallRequest(BaseModel):
    method: str  # "twilio" or "meet"
    user_number: str = None  # Optional, not used here directly

@router.post("/call")
async def initiate_call(data: CallRequest):
    if data.method == "meet":
        return {
            "status": "Redirecting to Google Meet.",
            "meet_link": FALLBACK_MEET_URL
        }

    elif data.method == "twilio":
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, EXPERT_PHONE_NUMBER]):
            return {
                "status": "Twilio not configured. Redirecting to Meet.",
                "meet_link": FALLBACK_MEET_URL
            }

        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

            call = client.calls.create(
                to=EXPERT_PHONE_NUMBER,
                from_=TWILIO_PHONE_NUMBER,
                twiml='<Response><Say voice="alice">Cybersecurity assistance requested. Please join the conversation.</Say></Response>'
            )

            return {
                "status": "Twilio call initiated.",
                "sid": call.sid
            }

        except Exception as e:
            print(f"⚠️ Twilio call failed: {e}")
            return {
                "status": "⚠️ Twilio call failed. Redirecting to Meet.",
                "meet_link": FALLBACK_MEET_URL
            }

    else:
        raise HTTPException(status_code=400, detail="Invalid call method.")
