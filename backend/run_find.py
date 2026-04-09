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

for code in ["en-US", "en"]:
    for key in ["language", "language_code", "LanguageCode", "languageCode", "identify_language"]:
        cfg = {"provider": "aws_transcribe", "aws_transcribe": {key: code}}
        print(f"Testing {key}={code}: {test_payload(cfg)}")
