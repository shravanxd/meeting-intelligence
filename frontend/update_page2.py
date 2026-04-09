import re

with open("frontend/src/app/review/[id]/page.tsx", "r") as f:
    text = f.read()

# Replace hardcoded action items
pattern = r'(: \(\s*<>\s*<li className="flex items-start gap-2 bg-white.*?</>\s*\)\s*)\}'
replacement = r': (<p className="text-sm text-slate-500 italic">No action items extracted yet.</p>)}'

text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open("frontend/src/app/review/[id]/page.tsx", "w") as f:
    f.write(text)
    print("Replaced!")
