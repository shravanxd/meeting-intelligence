import urllib.request
import json
import os
req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot/...",
    headers={"Authorization": "Token "REPLACE_YOUR_TOKEN", "Accept": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    b = json.loads(resp.read().decode())
    print("T options:", b.get("transcription_options"))
