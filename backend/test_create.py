import urllib.request
import json
import os
os.environ["RECALL_API_KEY"] = "cd3bc382441800bcfcd333f217a4a95c8407c2b4"
req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot",
    data=json.dumps({
        "meeting_url": "https://meet.google.com/nov-ofbp-mbu",
        "bot_name": "Test Transcriber",
        "transcription_options": {"provider": "assembly_ai"}
    }).encode("utf-8"),
    headers={
        "Authorization": f"Token {os.environ['RECALL_API_KEY']}",
        "Content-Type": "application/json"
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req) as resp:
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
