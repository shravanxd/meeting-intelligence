import os
import urllib.request
import urllib.error
import sys
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("RECALL_API_KEY")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"API Key length: {len(api_key)}")
    print(f"API Key starts with: {api_key[:5]}...")

req = urllib.request.Request(
    "https://api.recall.ai/api/v1/bot",
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
        print("Success:", response.read())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} {e.reason}")
    print("Error Body:", e.read().decode('utf-8'))
except Exception as e:
    print(f"Other Error: {e}")
