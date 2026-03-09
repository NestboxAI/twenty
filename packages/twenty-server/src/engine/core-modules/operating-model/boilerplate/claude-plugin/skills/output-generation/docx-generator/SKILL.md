---
description: "Generate Word documents (DOCX) from structured report data using python-docx. Creates professional PE/VC reports with consistent formatting, tables, headers, and footers. Handles LP reports, IC memos, and analysis documents. Always read the design-system skill first."
---

# DOCX Generator

Generate Word documents from structured report data using `python-docx`.

**Before generating, read the design system files:**
- `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md` — colors, typography, spacing
- `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md` — component patterns
- `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/language.md` — terminology, disclaimers
- `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` — firm name, confidentiality notice

Copy the logo into the workspace: `cp /shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png ./logo.png 2>/dev/null || true`

## Process

### Step 1 — Gather Content

Ensure all report content is finalized in `_research/` markdown files before generating.

### Step 2 — Write Python Script

Build a Python script that uses `python-docx`. Pull all color values, font sizes, and spacing from the design system tokens — do not hardcode.

```python
import os, shutil
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

# ── Design Tokens (from design-system/references/tokens.md) ──
PRIMARY     = RGBColor(0x1B, 0x3A, 0x5C)
ACCENT      = RGBColor(0x2E, 0x75, 0xB6)
TEXT        = RGBColor(0x2D, 0x2D, 0x2D)
TEXT_SEC    = RGBColor(0x66, 0x66, 0x66)
TEXT_INV    = RGBColor(0xFF, 0xFF, 0xFF)
SURFACE     = RGBColor(0xF7, 0xF8, 0xFA)
POSITIVE    = RGBColor(0x1A, 0x7A, 0x3A)
WARNING     = RGBColor(0xC6, 0x77, 0x00)
NEGATIVE    = RGBColor(0xC4, 0x26, 0x1D)
CRITICAL    = RGBColor(0x8B, 0x00, 0x00)

# ── Logo ──
LOGO_SRC = "/shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png"
LOGO_LOCAL = "logo.png"
if os.path.exists(LOGO_SRC):
    shutil.copy2(LOGO_SRC, LOGO_LOCAL)

def add_logo_to_doc(doc, width=Inches(2.0)):
    """Insert the firm logo at the current position in the document."""
    if os.path.exists(LOGO_LOCAL):
        doc.add_picture(LOGO_LOCAL, width=width)
```

### Step 3 — Execute and Verify

```bash
pip install python-docx 2>/dev/null
python generate_docx.py
ls -la output/report.docx
```

Save output to `output/report.docx`.

## Document Structure

### Page Setup

- Letter size (8.5 × 11 in)
- Margins: Top 1.0 in, Bottom 1.0 in, Left 1.25 in, Right 1.0 in
- Font: Calibri throughout

### Required Sections

1. **Title page** — call `add_logo_to_doc(doc)` first, then add title, subtitle, date, and "CONFIDENTIAL"
2. **Table of contents** — placeholder with update-field instruction
3. **Report body** — sections with H1/H2/H3 hierarchy per tokens
4. **Disclaimers** — standard disclaimer text from `references/language.md`

### Headers and Footers

- Header: Fund name (left), "CONFIDENTIAL" (right), 8pt, `text-secondary`
- Footer: "Page X of Y" (center), report date (right), 8pt
- Thin rule separating header/footer from content

### Table Formatting

Follow the Data Table component pattern:

- Header row: `primary` fill, white Bold 10pt text
- Alternating rows: white / `surface`
- Right-align numeric columns
- Total rows: Bold with `border-strong` top border
- Source footnote below: `text-secondary`, 8pt

### Number Formatting

Per tokens.md:

- Currency: $X,XXX or $X.XM
- Percentages: X.X%
- Multiples: X.XXx
- Negative: (X,XXX) in `negative` color

## Important Notes

- Always include confidentiality notice in header
- Always include as-of date on title page
- Include source citations for all data tables
- Label all figures as audited or unaudited
- Include standard disclaimers at end (see `references/language.md`)
- Apply confidence labels per language guide (VERIFIED/REPORTED/ESTIMATED/ASSUMED)
