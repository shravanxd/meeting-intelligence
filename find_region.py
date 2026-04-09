import os
import urllib.request
import urllib.error
import sys
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("RECALL_API_KEY")

regions = ["us-west-2", "us-east-1", "eu-central-1", "ap-northeast-1"]

found = False
for region in regions:
    url = f"https://{region}.api.recall.ai/api/v1/bot"
    print(f"Testing region: {region}...")
    req = urllib.request.Request(
        url,
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
            print(f"✅ Success! Your region is: {region}")
            found = True
            break
    except urllib.error.HTTPError as e:
        if e.code != 401:
            print(f"✅ Success (got {e.code} instead of 401)! Your region is {region}")
            found = True
            break
        print(f"❌ Failed for {region}")
    except Exception as e:
        print(f"Other error: {e}")

if not found:
    print("Could not find a working region. Are you sure the API key is completely correct and active in the dashboard?")
