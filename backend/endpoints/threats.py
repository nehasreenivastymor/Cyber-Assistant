from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/api/threats")
def get_threats():
    return {
        "threats": [
            {
                "id": "CVE-2025-12345",
                "title": "Remote Code Execution in Apache",
                "severity": "Critical",
                "published": str(datetime.now().date()),
                "description": "Allows attackers to execute arbitrary code via crafted HTTP headers."
            },
            {
                "id": "CVE-2025-67890",
                "title": "Privilege Escalation in Linux Kernel",
                "severity": "High",
                "published": str(datetime.now().date()),
                "description": "A vulnerability in memory management allows privilege escalation."
            }
        ]
    }
