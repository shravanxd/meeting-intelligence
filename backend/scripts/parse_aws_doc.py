from bs4 import BeautifulSoup
with open("aws_doc.html") as f:
    soup = BeautifulSoup(f, "html.parser")
for pre in soup.find_all("pre"):
    print(pre.get_text())
