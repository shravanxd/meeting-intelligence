import urllib.request
import urllib.error
import os
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("RECALL_API_KEY")
bot_id = "216acb71-e583-4775-8150-acdc35244292" # The latest bot ID sent to Teams

req = urllib.request.Request(
    f"https://us-west-2.recall.ai/api/v1/bot/{bot_id}",
    headers={
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json"
    },
    method="GET"
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read())
        print(f"Bot Status: {data.get('status_changes')[-1].get('code') if data.get('status_changes') else 'No status yet'}")
        print("\nFull details:")
        print(json.dumps(data, indent=2))
except urllib.error.HTTPError as e:
    print(f"Error fetching status: {e.read().decode('utf-8')}")
