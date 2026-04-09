import urllib.request
import json
import os
import certifi
import ssl

context = ssl.create_default_context(cafile=certifi.where())

dl_url = "https://us-west-2.recall.ai/api/v1/download/participant_events?token=eyJpZCI6Ijc3NWQ3Yzk5LWI5NzktNDgxMC1hYTEyLWYwMDIzZDU3ZWNkNSJ9%3A1wAek4%3A9KDgTX8gA4s7TM9CdgAkMavq5c7Mm-BOpjO052plRDA"
req = urllib.request.Request(dl_url, method="GET")
try:
    with urllib.request.urlopen(req, context=context) as response:
        print(response.read().decode()[:1000])
except Exception as e:
    print(e)
