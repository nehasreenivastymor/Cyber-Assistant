# backend/endpoints/avatar.py

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

# Load env variables
load_dotenv()
DID_API_KEY = os.getenv("DID_API_KEY")

router = APIRouter()

class VideoRequest(BaseModel):
    text: str
    image_url: str

@router.post("/generate-video")
async def generate_video(req: VideoRequest, request: Request):
    try:
        print("📨 Received video generation request")
        print("📝 Text:", req.text)
        print("🖼️ Image URL:", req.image_url)

        payload = {
            "script": {
                "type": "text",
                "input": req.text,
                "provider": {
                    "type": "microsoft",
                    "voice_id": "en-US-JennyNeural"
                }
            },
            "source_url": req.image_url,
            "config": {
                "fluent": True,
                "pad_audio": 0.2,
                "driver_expressions": {
                    "expressions": [
                        {"expression": "neutral", "start_frame": 0, "intensity": 0.8}
                    ]
                }
            }
        }

        headers = {
            "Authorization": f"Basic {DID_API_KEY}",
            "Content-Type": "application/json"
        }

        print("📡 Sending request to D-ID API...")
        response = requests.post("https://api.d-id.com/talks", headers=headers, json=payload)

        print(f"📬 D-ID response status: {response.status_code}")
        print("📦 Response content:", response.text)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"D-ID API error: {response.text}")

        response_data = response.json()
        video_url = response_data.get("result_url") or response_data.get("url")
        if not video_url:
            raise HTTPException(status_code=500, detail="Video URL not returned by D-ID")

        print("✅ Video generated:", video_url)
        return {"video_url": video_url}

    except Exception as e:
        import traceback
        print("🔥 Internal Server Error:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unhandled error: {str(e)}")
