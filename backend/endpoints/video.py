from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from uuid import uuid4
import os
from gtts import gTTS
from pydub import AudioSegment

from endpoints.generate_lipsync import run_wav2lip

router = APIRouter()

class VideoRequest(BaseModel):
    text: str

@router.post("/generate-video")
async def generate_video(req: VideoRequest):
    text = req.text

    # Unique file names
    uid = uuid4().hex
    mp3_file = f"static/audio_{uid}.mp3"
    wav_file = f"static/audio_{uid}.wav"
    output_video = f"static/output_{uid}.mp4"
    face_video = "static/avatar.mp4"

    # TTS to MP3
    tts = gTTS(text)
    tts.save(mp3_file)

    # Convert MP3 to WAV
    sound = AudioSegment.from_mp3(mp3_file)
    sound.export(wav_file, format="wav")

    # Run Wav2Lip
    run_wav2lip(face_video, wav_file, output_video)

    return JSONResponse(content={ "video_url": f"/{output_video}" })
