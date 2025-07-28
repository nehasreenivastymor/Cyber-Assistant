import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "openai/gpt-3.5-turbo"  # You can switch this if needed

class MessageInput(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_bot(message_input: MessageInput):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key missing")

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",  # Adjust if frontend is on another port
        "X-Title": "AI Cyber Assistant"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful cybersecurity assistant."},
            {"role": "user", "content": message_input.message}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            print("💡 Status Code:", response.status_code)
            print("📦 Response Text:", response.text)

            response.raise_for_status()
            data = response.json()  # ✅ FIXED HERE (no await)
            return {"response": data["choices"][0]["message"]["content"]}

    except httpx.HTTPStatusError as e:
        print("🔥 HTTP error occurred:", str(e))
        print("🧾 Response content:", e.response.text)
        raise HTTPException(status_code=e.response.status_code, detail="OpenRouter request failed.")

    except Exception as e:
        print("🔥 Unexpected exception occurred:", str(e))
        raise HTTPException(status_code=500, detail="LLM call failed. Check logs.")

