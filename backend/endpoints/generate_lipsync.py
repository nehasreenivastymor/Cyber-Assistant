import subprocess
import os

def run_wav2lip(face_video_path, audio_path, output_path):
    # Construct the full path to inference.py
    script_path = os.path.abspath("inference.py")  # Since it's in backend/
    
    checkpoint_path = os.path.abspath("wav2lip/checkpoints/wav2lip_gan.pth")
    
    command = [
        "python", script_path,
        "--checkpoint_path", checkpoint_path,
        "--face", os.path.abspath(face_video_path),
        "--audio", os.path.abspath(audio_path),
        "--outfile", os.path.abspath(output_path)
    ]

    print(f"Running command: {' '.join(command)}")
    
    subprocess.run(command, check=True)
