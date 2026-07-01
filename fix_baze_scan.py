import re

with open('src/components/BazeConsole.tsx', 'r') as f:
    content = f.read()

scan_lines = """const SCAN_LINES = [
  '[00:00.1]  Parsing brief · category: Packaging Systems',
  '[00:00.3]  Loading MENA supplier index · 287 records',
  '[00:00.6]  Cross-referencing SEA verified network · 213 records',
  '[00:00.9]  Applying filters · MOQ ≤ 500, budget < $2.00/unit',
  '[00:01.2]  Audit score pass threshold: 88.0 — 3 suppliers matched ✓',
];"""

if scan_lines not in content:
    content = content.replace("const BOOT_SEQUENCE = [", f"{scan_lines}\n\nconst BOOT_SEQUENCE = [")

with open('src/components/BazeConsole.tsx', 'w') as f:
    f.write(content)
print("Done")
