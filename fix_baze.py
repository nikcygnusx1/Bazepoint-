import re

with open('src/components/BazeConsole.tsx', 'r') as f:
    content = f.read()

# 1. Add React, useCallback to imports if not there
if 'useCallback' not in content:
    content = content.replace("import { useState, useEffect, useMemo, useRef } from 'react';", "import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';")
else:
    content = content.replace("import { useState, useEffect, useMemo, useRef, useCallback } from 'react';", "import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';")

# 2. Extract BOOT_SEQUENCE
boot_seq_match = re.search(r'  const BOOT_SEQUENCE = useMemo\(\(\) => (\[\s*".*?"\s*\]),\s*\[\]\);', content, re.DOTALL)
if boot_seq_match:
    boot_seq = boot_seq_match.group(1)
    content = content.replace(boot_seq_match.group(0), "")
    content = content.replace("type ConsoleMode =", f"const BOOT_SEQUENCE = {boot_seq};\n\ntype ConsoleMode =")
else:
    print("BOOT_SEQUENCE not found or already extracted.")

# 3. Extract SCAN_LINES
scan_lines_match = re.search(r'    const SCAN_LINES = \[\s*\'\[00:00\.1\].*?\];\s*', content, re.DOTALL)
if scan_lines_match:
    scan_lines = scan_lines_match.group(0).strip()
    content = content.replace(scan_lines_match.group(0), "")
    # Place after BOOT_SEQUENCE
    content = content.replace("const BOOT_SEQUENCE = [", f"{scan_lines}\n\nconst BOOT_SEQUENCE = [")
else:
    print("SCAN_LINES not found or already extracted.")

# 4. React.memo and export
content = content.replace("export function BazeConsole({", "export const BazeConsole = React.memo(function BazeConsole({")
content = content.replace("  // FRAGMENT MODE VIEWS", "  // FRAGMENT MODE VIEWS")
# Add closing parenthesis for React.memo
content = re.sub(r'  \);\n}', r'  );\n});', content)

# 5. Fix useEffect dependencies
content = content.replace("[mode, bootComplete, BOOT_SEQUENCE]", "[mode, bootComplete]")

# 6. useCallback for handlers
content = content.replace(
    "const handleSelectRow = (id: string) => {",
    "const handleSelectRow = useCallback((id: string) => {"
).replace(
    "    if (onSelectManufacturer) {\n      onSelectManufacturer(id);\n      setActiveMobileTab('draft');\n    }\n  };",
    "    if (onSelectManufacturer) {\n      onSelectManufacturer(id);\n      setActiveMobileTab('draft');\n    }\n  }, [mode, onSelectManufacturer]);"
)

content = content.replace(
    "const handleCopyEmail = () => {",
    "const handleCopyEmail = useCallback(() => {"
).replace(
    "    setTimeout(() => setCopiedText(false), 2000);\n  };",
    "    setTimeout(() => setCopiedText(false), 2000);\n  }, [emailDraftData]);"
)

content = content.replace(
    "const handleGmailOpen = () => {",
    "const handleGmailOpen = useCallback(() => {"
).replace(
    "    window.open(url, '_blank');\n  };",
    "    window.open(url, '_blank');\n  }, [selectedManufacturer, emailDraftData]);"
)

with open('src/components/BazeConsole.tsx', 'w') as f:
    f.write(content)
print("Done")
