import re

with open("frontend/src/app/review/[id]/page.tsx", "r") as f:
    text = f.read()

# Replace summary hardcode
text = re.sub(
    r'\{data\?\.summary \|\| "Client reviewed the initial draft[^"]+"\}',
    r'{data?.summary || "Meeting intelligence is being processed. Please wait..."}',
    text
)

# Render transcript text
text = text.replace(
    """             {/* Mention People / Participants */""",
    """             {data?.transcript_text && (
               <div className="p-4 bg-slate-50 border-b border-slate-200">
                 <h4 className="text-xs font-semibold text-slate-500 mb-2">RAW TRANSCRIPT</h4>
                 <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{data.transcript_text}</pre>
               </div>
             )}
             
             {/* Mention People / Participants */"""
)

with open("frontend/src/app/review/[id]/page.tsx", "w") as f:
    f.write(text)
    print("Replaced!")
