from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
import time
import traceback

print("🚀 Starting main.py...")

# Load environment variables from .env
load_dotenv()

# Create FastAPI app
app = FastAPI()

# ✅ CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"🔥 [Middleware] {request.method} {request.url.path}")
    start_time = time.time()
    try:
        response = await call_next(request)
    except Exception as e:
        print(f"❌ Internal server error during {request.method} {request.url.path}: {str(e)}")
        traceback.print_exc()
        raise e
    duration = round(time.time() - start_time, 4)
    print(f"📥 {request.method} {request.url.path} → {response.status_code} ({duration}s)")
    return response

# ✅ Root test route
@app.get("/")
async def root():
    return {"message": "Backend server is running ✅"}

# ✅ Optional static file support
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
    print("📁 Static folder mounted at /static")
else:
    print("⚠️ No static folder found")

# ✅ Load routers (chat, avatar, tts, etc.)
try:
    from endpoints import chat, tts, avatar, call, threats

    app.include_router(chat.router)
    app.include_router(tts.router)
    app.include_router(avatar.router)
    app.include_router(call.router)
    app.include_router(threats.router)

    print("✅ All routers loaded")
except ImportError as e:
    print("❌ Router import failed:", str(e))
    traceback.print_exc()

