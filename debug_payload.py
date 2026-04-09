import urllib.request
import urllib.error
import os
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("RECALL_API_KEY")

req = urllib.request.Request(
    "https://us-west-2.recall.ai/api/v1/bot",
    data=json.dumps({
        "meeting_url": "https://meet.google.com/sag-hpjc-dkr",
        "bot_name": "Test Bot"
    }).encode("utf-8"),
    headers={
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read())
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
