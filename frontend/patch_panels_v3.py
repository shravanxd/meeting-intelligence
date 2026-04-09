import re

with open("src/app/review/[id]/page.tsx", "r") as f:
    content = f.read()

# 1. Add imports
content = content.replace(
    "import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';",
    "import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';"
)

# 2. Update structural layout (autoSaveId changes and direction->orientation)
content = content.replace(
    """<PanelGroup direction="horizontal" autoSaveId="review-layout">""",
    """<PanelGroup orientation="horizontal" id="review-layout">"""
)

# 3. Middle split
content = content.replace(
    """<PanelGroup direction="vertical" autoSaveId="review-right-layout">""",
    """<PanelGroup orientation="vertical" id="review-right-layout">"""
)

with open("src/app/review/[id]/page.tsx", "w") as f:
    f.write(content)
