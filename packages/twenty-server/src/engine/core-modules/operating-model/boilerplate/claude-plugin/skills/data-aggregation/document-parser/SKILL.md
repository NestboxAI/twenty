---
description: "Parse and extract structured data from PDF, XLSX, DOCX, and CSV files in the workspace. Handles financial statements, LP reports, fund documents, data rooms, and other PE/VC materials. Outputs structured facts with full provenance metadata."
---

# Document Parser

Extract structured data from documents in the workspace. This skill is called during the AGGREGATE phase of the ACSR lifecycle.

## Supported Formats

| Format | Method | Key Libraries |
|--------|--------|--------------|
| PDF | Python: `pdfplumber` or `PyMuPDF` | Tables, text blocks, page-level extraction |
| XLSX | Python: `openpyxl` | Named ranges, multiple sheets, formulas |
| DOCX | Python: `python-docx` | Paragraphs, tables, headers |
| CSV | Python: `pandas` | Tabular data |

## Extraction Workflow

### Step 1 — Discover Files

```bash
find /workspace -type f \( -name "*.pdf" -o -name "*.xlsx" -o -name "*.docx" -o -name "*.csv" \) | head -100
```

List all parseable files. Present the inventory to guide prioritization.

### Step 2 — Classify Each Document

Before parsing, classify the document type:

- **Financial Statements** — P&L, balance sheet, cash flow
- **Fund Reports** — quarterly/annual LP reports, capital account statements
- **Valuation Reports** — third-party or internal valuations
- **Legal Documents** — LPA, side letters, subscription agreements
- **Data Room Materials** — due diligence documents, CIM, management presentations
- **Market Data** — industry reports, benchmarks, comparable transactions
- **Correspondence** — emails, memos, meeting notes

### Step 3 — Extract Data

Write a Python extraction script tailored to the document type. Example for PDF:

```python
import pdfplumber
import json

def extract_pdf(filepath):
    results = []
    with pdfplumber.open(filepath) as pdf:
        for i, page in enumerate(pdf.pages):
            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                results.append({
                    "type": "table",
                    "page": i + 1,
                    "data": table
                })
            # Extract text blocks
            text = page.extract_text()
            if text:
                results.append({
                    "type": "text",
                    "page": i + 1,
                    "content": text
                })
    return results
```

### Step 4 — Structure Output

For each extracted fact, create a provenance record:

```markdown
## Extracted: [description]
- **Value**: [value]
- **Source**: [filename], page [N] / sheet [name] / section [heading]
- **As-of Date**: [date if identifiable]
- **Confidence**: VERIFIED if from audited source, REPORTED otherwise
- **Raw Text**: "[exact text from document]"
```

### Step 5 — Write Source Files

Save extracted data to `_research/sources/source-NNN.md` with:
- Document metadata (filename, type, date, pages/sheets)
- All extracted facts with provenance
- Extraction quality notes (any parsing issues, low-confidence extractions)

## Handling Common PE/VC Documents

### Capital Account Statements
Look for: beginning balance, contributions, distributions, management fees, carried interest, ending balance, IRR, TVPI, DPI, RVPI.

### Quarterly LP Reports
Look for: NAV, portfolio company updates, cash flow summary, performance metrics, market commentary.

### Financial Statements
Look for: revenue, EBITDA, net income, total assets, total debt, cash, working capital. Note the reporting period and currency.

### Valuation Reports
Look for: methodology (DCF, comparables, precedent transactions), key assumptions (discount rate, exit multiple, growth rate), fair value conclusion, ASC 820 level classification.

## Error Handling

- If a PDF is scanned/image-based, note it as a gap: "Document [X] requires OCR — not extracted"
- If tables are malformed, extract what's readable and flag quality issues
- If a file is password-protected, note it as a gap
- Never guess values from partially readable text — mark as gap instead
