import os
import json
import urllib.request

req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot",
    data=json.dumps({
        "meeting_url": "https://meet.google.com/nov-ofbp-mbu",
        "bot_name": "Test Transcriber",
        "transcription_options": {"provider": "meeting_captions"}
    }).encode("utf-8"),
    headers={
        "Authorization": f"Token cd3bc382441800bcfcd333f217a4a95c8407c2b4",
        "Content-Type": "application/json"
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req) as resp:
        print("Success")
except urllib.error.HTTPError as e:
    print(e.read().decode())
