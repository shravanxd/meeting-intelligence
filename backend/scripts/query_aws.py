import urllib.request
try:
    req = urllib.request.Request("https://docs.recall.ai/docs/aws-transcribe", headers={"User-Agent": "Mozilla/5.0"})
    res = urllib.request.urlopen(req).read().decode()
    with open("aws_doc.html", "w") as f:
        f.write(res)
    print("Found aws-transcribe docs")
except Exception as e:
    print(e)
