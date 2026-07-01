import re

with open('src/components/BazeConsole.tsx', 'r') as f:
    content = f.read()

boot_seq = """const BOOT_SEQUENCE = [
  "BAZE OS v1.0 — Initializing...",
  "Loading factory network index...",
  "MENA region: 312 verified partners ✓",
  "SEA region: 201 verified partners ✓",
  "UAE supplement labs: 47 certified ✓",
  "Quality audit layer: ACTIVE",
  "MOQ filter engine: ACTIVE",
  "Email draft module: ACTIVE",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "READY. Describe your product below.",
];"""

# Replace the useMemo version
content = re.sub(r'  const BOOT_SEQUENCE = useMemo\(\(\) => \[\n.*?\n  \], \[\]\);', '', content, flags=re.DOTALL)

# Insert before type ConsoleMode
if boot_seq not in content:
    content = content.replace("type ConsoleMode =", f"{boot_seq}\n\ntype ConsoleMode =")

with open('src/components/BazeConsole.tsx', 'w') as f:
    f.write(content)
print("Done")
