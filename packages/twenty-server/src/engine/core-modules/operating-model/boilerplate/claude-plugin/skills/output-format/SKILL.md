---
description: "Artifact delivery protocol for generating file deliverables (DOCX, PPTX, XLSX). Triggers when [OUTPUT_FORMAT: xxx] appears in the prompt. The file is saved as report.{format} in the workspace and automatically detected by the agent runtime in the QUERY_COMPLETED event."
---

# Artifact Delivery Protocol

When the prompt contains `[OUTPUT_FORMAT: docx|pptx|xlsx]`, you MUST produce a file deliverable in addition to the text analysis. This skill defines the mandatory protocol.

## Detection

Look for this marker in the prompt:
```
[OUTPUT_FORMAT: docx]
[OUTPUT_FORMAT: pptx]
[OUTPUT_FORMAT: xlsx]
```

If present, artifact generation is **required** — not optional.

## Format Reference

| Format | Label | Generator Skill | Library | Use For |
|--------|-------|----------------|---------|---------|
| `docx` | Word document (.docx) | docx-generator | `python-docx` | Reports, memos, analyses, compliance documents |
| `pptx` | PowerPoint presentation (.pptx) | pptx-generator | `python-pptx` | Board decks, LP summaries, IC presentations |
| `xlsx` | Excel spreadsheet (.xlsx) | xlsx-generator | `openpyxl` | Financial models, data tables, reconciliations, schedules |

## Workflow

### Step 1. Complete the Analysis First

Perform the full analysis as requested. Present all findings, tables, and narrative as normal text output. This text output is the human-readable version.

### Step 2. Read the Design System

Before writing any generation script, read these design references:
- `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md` — colors, typography, number formatting
- `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md` — title page, table, chart patterns
- `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` — firm name, confidentiality notice

Copy the logo into the workspace:
```bash
cp /shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png ./logo.png 2>/dev/null || true
```

### Step 3. Generate the File

Produce the final deliverable using the design system tokens and the corresponding generator skill.

Write a Python script that:
- Ensures the output directory exists: `os.makedirs("output", exist_ok=True)`
- Installs the required library if needed (`pip install python-docx` / `python-pptx` / `openpyxl`)
- Uses design tokens from `tokens.md` for all colors, fonts, and formatting
- Includes the logo on the title page (from `./logo.png` if it exists)
- Includes the firm name and confidentiality notice from `brand-overrides.json`
- Creates a professionally formatted file containing the analysis content
- Saves it as `output/report.{format}` (inside the `output/` subdirectory)

For example, if `[OUTPUT_FORMAT: docx]` is specified:
- Write a Python script that generates a Word document (.docx) using the docx-generator (python-docx) skill
- The script should include your analysis content, formatted professionally
- Save the output as `output/report.docx`

If `[OUTPUT_FORMAT: pptx]` is specified:
- Write a Python script that generates a PowerPoint presentation (.pptx) using the pptx-generator (python-pptx) skill
- Save the output as `output/report.pptx`

If `[OUTPUT_FORMAT: xlsx]` is specified:
- Write a Python script that generates an Excel spreadsheet (.xlsx) using the xlsx-generator (openpyxl) skill
- Save the output as `output/report.xlsx`

### Step 4. Run the Script

Execute the Python script to completion. Do not just write it — you must run it.

### Step 5. Verify the File

After the script runs, confirm the file was created:

```bash
ls -la output/report.{format}
```

The agent runtime automatically reads all files from the `output/` subdirectory, base64-encodes them, and includes them as `outputFiles` in the QUERY_COMPLETED event. You do NOT need to base64-encode or output the file contents manually.

## Rules

1. The file MUST be saved under the `output/` subdirectory as `output/report.{format}`.
2. Always create the output directory first: `os.makedirs("output", exist_ok=True)`.
3. Run the Python script to completion — do not just write it without executing.
4. If the Python library fails to install, report the error clearly — do not silently skip the file.
5. Verify the file exists after generation.
6. Do not skip file generation. The file deliverable is a mandatory part of the response.

## File Content Standards

### DOCX Reports
- Title page with report name, property/fund name, as-of date, "CONFIDENTIAL"
- Table of contents
- Section headers (Heading 1/2/3)
- Formatted tables with header row styling
- Page numbers and headers/footers
- Source citations and disclaimers

### PPTX Presentations
- Title slide with report name and date
- 16:9 widescreen format
- Max 20-25 slides
- Consistent color scheme (dark blue #1B3A5C, accent #2E75B6)
- Tables on data slides, not walls of text
- Page numbers on all slides

### XLSX Spreadsheets
- Summary tab first
- Descriptive tab names
- Frozen header row
- Formatted numbers (currency, percentages, multiples)
- Formulas where applicable (not static values)
- Column widths set for readability
