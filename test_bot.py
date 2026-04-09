import sys
import os
import json
from dotenv import load_dotenv

# Load env vars from .env
load_dotenv()

from backend.app.services.recall_service import RecallService

if len(sys.argv) < 2:
    print("Usage: python3 test_bot.py <meeting_url>")
    sys.exit(1)

meeting_url = sys.argv[1]
print(f"Scheduled bot to join: {meeting_url}")

service = RecallService()
response = service.schedule_bot(meeting_url, bot_name="Novus AI Buddy")

if response:
    print("\n✅ Bot scheduled successfully!")
    print(json.dumps(response, indent=2))
else:
    print("\n❌ Failed to schedule bot. Check your RECALL_API_KEY and meeting URL.")
