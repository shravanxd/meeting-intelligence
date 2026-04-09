import re

with open("frontend/src/app/page.tsx", "r") as f:
    text = f.read()

# Add "use client" and imports
if '"use client"' not in text:
    text = '"use client";\nimport { useState, useEffect } from "react";\n' + text

pattern_hook = r"export default function Home\(\) \{"
replacement_hook = """export default function Home() {
  const [stats, setStats] = useState({
    active_matters: 0,
    meetings_processed: 0,
    pending_review: 0,
    recent_pending: []
  });

  useEffect(() => {
    fetch("http://localhost:8000/dashboard")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

"""

text = re.sub(pattern_hook, replacement_hook, text)

pattern_stats = r"\{\s*label:\s*\"Active Matters\".*?\}\].map\(\(stat, i\) => \("

replacement_stats = """[
          { label: "Active Matters", value: stats.active_matters },
          { label: "Meetings Processed", value: stats.meetings_processed },
          { label: "Pending Review", value: stats.pending_review, color: "text-amber-600" },
          { label: "Tasks Generated", value: "—" },
        ].map((stat, i) => ("""

text = re.sub(pattern_stats, replacement_stats, text, flags=re.DOTALL)

with open("frontend/src/app/page.tsx", "w") as f:
    f.write(text)
print("DASHBOARD_PATCHED")
