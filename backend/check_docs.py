from bs4 import BeautifulSoup
import urllib.request
req = urllib.request.Request("https://docs.recall.ai/reference/transcript_retrieve", headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode()
soup = BeautifulSoup(html, 'html.parser')
for code in soup.find_all('code'):
    text = code.get_text()
    if 'url' in text or 'v' in text:
        print(text.strip())
