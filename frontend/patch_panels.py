import re

with open("src/app/review/[id]/page.tsx", "r") as f:
    content = f.read()

# 1. Add imports
content = content.replace(
    "import remarkGfm from 'remark-gfm';",
    "import remarkGfm from 'remark-gfm';\nimport { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';"
)

# 2. Update structural layout
content = content.replace(
    """      <div className="flex-1 overflow-hidden flex">
        {/* Left Side - Extraction Panel */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">""",
    """      <div className="flex-1 overflow-hidden flex">
        <PanelGroup direction="horizontal" autoSaveId="review-layout">
        {/* Left Side - Extraction Panel */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col border-r border-slate-200 bg-white">"""
)

# 3. Middle split
content = content.replace(
    """        {/* Right Side - Transcript & Context */}
        <div className="w-1/2 flex flex-col bg-slate-50">""",
    """        </Panel>
        
        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-blue-400 transition-colors cursor-col-resize flex flex-col justify-center items-center group">
           <div className="h-8 w-[2px] bg-slate-400 rounded-full group-hover:bg-white transition-colors"></div>
        </PanelResizeHandle>

        {/* Right Side - Transcript & Context */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-slate-50">
          <PanelGroup direction="vertical" autoSaveId="review-right-layout">
             <Panel defaultSize={65} minSize={20} className="flex flex-col">"""
)

# 4. Right split between transcript and chat
content = content.replace(
    """          {/* Ask AI Section */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white">
            <div className="mb-3 space-y-3 max-h-32 overflow-y-auto">""",
    """          </Panel>
             <PanelResizeHandle className="h-1 bg-slate-200 hover:bg-blue-400 transition-colors cursor-row-resize flex justify-center items-center group">
                <div className="w-8 h-[2px] bg-slate-400 rounded-full group-hover:bg-white transition-colors"></div>
             </PanelResizeHandle>
             <Panel defaultSize={35} minSize={15} className="flex flex-col bg-white">
          {/* Ask AI Section */}
          <div className="px-6 py-4 flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 border border-transparent">"""
)

# 5. Close newly opened panels
content = content.replace(
    """            </div>
          </div>

        </div>
      </div>
    </div>""",
    """            </div>
          </div>
             </Panel>
          </PanelGroup>
        </Panel>
        </PanelGroup>
      </div>
    </div>"""
)

with open("src/app/review/[id]/page.tsx", "w") as f:
    f.write(content)
