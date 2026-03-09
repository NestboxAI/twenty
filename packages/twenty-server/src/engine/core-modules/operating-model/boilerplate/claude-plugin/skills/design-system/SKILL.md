---
description: >
  This skill should be used whenever generating any file output — DOCX, PPTX, XLSX, PDF, or
  formatted text. Triggers on: "generate report", "create presentation", "build spreadsheet",
  "write document", "produce PDF", "format output", or any use of the docx-generator,
  pptx-generator, or xlsx-generator skills. Provides the mandatory visual design system,
  color tokens, component patterns, and PE/VC language standards for all deliverables.
---

# Design System — PE/VC Professional Output

All generated deliverables MUST follow this design system.

## Plugin Location

The plugin is mounted at:
```
/shared/plugins/{{PLUGIN_NAME}}
```

All paths below are relative to this root. To read any file, prepend this path.

## Brand Assets

Before generating any output with a title page, check for these files:

| File | Path | Purpose |
|------|------|---------|
| Logo | `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png` | Primary logo for title pages and headers |
| Logo (square) | `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo-sq.png` | Square variant for footers and watermarks |
| Brand overrides | `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` | Firm name, custom colors, confidentiality notice |

To use the logo in a Python generation script, copy it into the workspace first:
```python
import shutil, os
PLUGIN = "/shared/plugins/{{PLUGIN_NAME}}"
logo_src = os.path.join(PLUGIN, "brand/assets/logo.png")
if os.path.exists(logo_src):
    shutil.copy2(logo_src, "logo.png")
```

## Reference Files

Read these before generating output:

- **Color palette, typography, spacing, number formatting**:
  `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md`

- **Component patterns (tables, KPI cards, title pages, charts, callouts)**:
  `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md`

- **PE/VC language dictionary, terminology, tone, disclaimers**:
  `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/language.md`

## Core Principles

1. **White background, dark text** — clean institutional aesthetic; never use colored backgrounds for pages or slides
2. **Minimal chrome** — let data breathe; avoid decorative borders, gradients, shadows, or clip art
3. **Data density over decoration** — institutional investors expect information-rich documents, not marketing material
4. **Consistent hierarchy** — same visual weight for the same level of information across all formats

## Quick Reference — Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1B3A5C` | Headers, table header rows, title bars |
| `accent` | `#2E75B6` | Links, secondary emphasis, chart accent |
| `text` | `#2D2D2D` | Body text (not pure black) |
| `text-secondary` | `#666666` | Footnotes, captions, metadata |
| `background` | `#FFFFFF` | Page/slide background — always white |
| `surface` | `#F7F8FA` | Alternating table rows, card backgrounds |
| `border` | `#D9DEE3` | Table borders, dividers, card outlines |
| `positive` | `#1A7A3A` | Gains, above-target, compliant |
| `warning` | `#C67700` | Approaching threshold, caution |
| `negative` | `#C4261D` | Losses, below-target, breached |
| `critical` | `#8B0000` | Severe, write-off, non-performing |
| `neutral` | `#6B7280` | N/A, pending, informational |

## Quick Reference — Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Document title | Calibri | Bold | 28pt (DOCX), 32pt (PPTX) |
| Section heading | Calibri | Bold | 16pt (DOCX), 24pt (PPTX) |
| Subsection heading | Calibri | SemiBold | 13pt (DOCX), 18pt (PPTX) |
| Body text | Calibri | Regular | 11pt (DOCX), 12pt (PPTX), 10pt (XLSX) |
| Table header | Calibri | Bold | 10pt |
| Table body | Calibri | Regular | 10pt |
| Caption / footnote | Calibri | Regular | 8pt |

## Applying the System

1. Read `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md` for exact color and typography values
2. Read `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md` for the component being generated
3. Read `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/language.md` for terminology and tone
4. Read `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` for firm name and confidentiality notice
5. Copy `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png` into the workspace and include it on the title page
