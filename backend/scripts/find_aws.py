import urllib.request
import json

def test_payload(opts):
    req = urllib.request.Request(
        "https://us-west-2.recall.ai/api/v1/bot",
        data=json.dumps({"meeting_url": "https://meet.google.com/nov-ofbp-mbu", "transcription_options": opts}).encode("utf-8"),
        headers={"Authorization": "Token cd3bc382441800bcfcd333f217a4a95c8407c2b4", "Content-Type": "application/json"},
        method="POST"
    )
    try:
        urllib.request.urlopen(req)
        return "SUCCESS"
    except urllib.error.HTTPError as e:
        return e.read().decode()

configs = [
    {"provider": "aws_transcribe"},
    {"provider": "aws_transcribe", "language": "en-US"},
    {"provider": "aws_transcribe", "language_code": "en-US"}
]

for cfg in configs:
    print(f"Payload: {json.dumps(cfg)} -> {test_payload(cfg)}")
