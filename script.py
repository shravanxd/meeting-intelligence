import os
path = '/Users/shravan/Desktop/Meeting-Intelligence/frontend/src/app/meetings/new/page.tsx'
with open(path, 'r') as f:
    c = f.read()

c = c.replace('useState<"join" | "upload" | "record">("join");', 'useState<"join" | "upload" | "record" | "paste">("join");')

nav = '<UploadCloud className="w-4 h-4" /> Upload Recording</button>'
paste_nav = nav + '
        <button onClick={() => setActiveTab("paste")} className={} disabled={isCapturing}><UploadCloud className="w-4 h-4" /> Paste Transcript / File</button>'
c = c.replace(nav, paste_nav)

label_title = '<label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>'
paste_section = '''{activeTab === "paste" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Transcript Text or File (TXT, PDF, Word, MP3, MP4, etc.)</label>
                <textarea className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm h-32" placeholder="Paste your meeting transcript here, or drag and drop a file..."></textarea>
                <div className="mt-2 text-xs text-slate-500">Alternatively, you can drag and drop supported files here.</div>
              </div>
            )}
            <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Title</label>'''
c = c.replace(label_title, paste_section)

c = c.replace('{activeTab === "join" ? "Simulate Agent Join" : activeTab === "upload" ? "Upload Media" : "In-Room Recording"}', '{activeTab === "join" ? "Simulate Agent Join" : activeTab === "upload" ? "Upload Media" : activeTab === "paste" ? "Paste Transcript / File" : "In-Room Recording"}')

with open(path, 'w') as f:
    f.write(c)
print('Done')
