import urllib.request
import json
import ssl
context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE
req = urllib.request.Request("https://docs.recall.ai/docs/transcription", headers={"User-Agent":"Mozilla"})
try:
    with urllib.request.urlopen(req, context=context) as response:
        html = response.read().decode()
        # Find where aws_transcribe is mentioned
        import re
        for match in re.findall(r'.{0,100}aws_transcribe.{0,100}', html, re.IGNORECASE):
            print(match)
except Exception as e:
    print(e)
