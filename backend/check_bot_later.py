import urllib.request
import os
import json
from app.services.recall_service import RecallService
os.environ["RECALL_API_KEY"] = "cd3bc382441800bcfcd333f217a4a95c8407c2b4"
bot_id = "587e5879-2702-4748-8fb0-7c24c4309d36"
r = RecallService()
req = urllib.request.Request(
    f"{r.base_url}/{bot_id}",
    headers={"Authorization": f"Token {r.api_key}", "Accept": "application/json"},
    method="GET"
)
try:
    with urllib.request.urlopen(req) as response:
        bot_data = json.loads(response.read())
        for rec in bot_data.get("recordings", []):
            transcript_shortcut = rec.get("media_shortcuts", {}).get("transcript")
            print("Transcript shortcut:", transcript_shortcut)
except Exception as e:
    print(e)
