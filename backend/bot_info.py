import urllib.request
import json
import os
req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot/587e5879-2702-4748-8fb0-7c24c4309d36",
    headers={"Authorization": "Token cd3bc382441800bcfcd333f217a4a95c8407c2b4", "Accept": "application/json"}
)
with urllib.request.urlopen(req) as resp:
    b = json.loads(resp.read().decode())
    print("T options:", b.get("transcription_options"))
