import re

with open("frontend/src/app/page.tsx", "r") as f:
    text = f.read()

pattern = r"""<div className="divide-y divide-slate-100">.*?<a href="/review/1".*?Start Review\s*</a>\s*</div>\s*</div>"""

replacement = """<div className="divide-y divide-slate-100">
              {stats.recent_pending.length === 0 ? (
                 <div className="p-6 text-sm text-slate-500">No meetings pending review.</div>
              ) : (
                stats.recent_pending.map((m: any) => (
                  <div key={m.id} className="p-6 hover:bg-slate-50 transition flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900 mb-1">{m.title}</h3>
                      <p className="text-sm text-slate-500 mb-3">Matter: {m.matter} • {new Date(m.created_at).toLocaleDateString()}</p>
                      
                      <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Extraction</span>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Draft Email</span>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{m.status}</span>
                      </div>
                    </div>
                    <a href={`/review/${m.id}`} className="text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                      Start Review
                    </a>
                  </div>
                ))
              )}
            </div>"""

text = re.sub(pattern, replacement, text, flags=re.DOTALL)

# Let's also patch the 1 Action Required indicator dynamically
text = re.sub(r"""<span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">1 Action Required</span>""",
              """{stats.pending_review > 0 && <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{stats.pending_review} Action Required</span>}""", text)

with open("frontend/src/app/page.tsx", "w") as f:
    f.write(text)

print("DASHBOARD_PENDING_PATCHED")
