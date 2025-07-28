from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import FileResponse
from gtts import gTTS
import os
from .generate_lipsync import run_wav2lip

router = APIRouter()

class TTSRequest(BaseModel):
    message: str

@router.post("/generate-lipsync")
def generate_lipsync(req: TTSRequest):
    # Generate voice from chatbot reply
    tts = gTTS(req.message)
    audio_path = "tts_output.wav"
    tts.save(audio_path)

    # Generate lipsynced video
    output_video = run_wav2lip("avatar.mp4", audio_path, "output_lipsync.mp4")

    # Send the video file back to frontend
    return FileResponse(output_video, media_type="video/mp4")
