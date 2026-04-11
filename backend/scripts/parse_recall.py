import urllib.request
import json
req = urllib.request.Request("https://us-west-2.recall.ai/api/v1/schema/")
try:
    with urllib.request.urlopen(req) as response:
        schema = json.loads(response.read().decode())
        opts = schema["components"]["schemas"]["TranscriptionOptions"]["properties"]["provider"]
        print(opts)
except Exception as e:
    print(e)
