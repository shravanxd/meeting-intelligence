import urllib.request
import json
req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot",
    data=json.dumps({
        "meeting_url": "https://meet.google.com/nov-ofbp-mbu",
        "bot_name": "Test",
        "transcription_options": {
            "provider": "default"
        }
    }).encode("utf-8"),
    headers={
        "Authorization": "Token cd3bc382441800bcfcd333f217a4a95c8407c2b4",
        "Content-Type": "application/json"
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(json.dumps(data.get("transcription_options", {}), indent=2))
        print("Bot created with default!")
except urllib.error.HTTPError as e:
    print(e.read().decode())
