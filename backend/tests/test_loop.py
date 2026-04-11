import urllib.request
import json
import os
for provider in ["default", "aws", "aws_transcribe", "aws-transcribe", "amazon"]:
    req = urllib.request.Request(
        "https://us-west-2.recall.ai/api/v1/bot",
        data=json.dumps({
            "meeting_url": "https://meet.google.com/nov-ofbp-mbu",
            "bot_name": "Test AWS Transcriber",
            "transcription_options": {"provider": provider}
        }).encode("utf-8"),
        headers={
            "Authorization": "Token cd3bc382441800bcfcd333f217a4a95c8407c2b4",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    try:
        urllib.request.urlopen(req)
        print(f"SUCCESS: {provider}")
        break
    except urllib.error.HTTPError as e:
        print(f"FAILED {provider}: {e.read().decode()}")
