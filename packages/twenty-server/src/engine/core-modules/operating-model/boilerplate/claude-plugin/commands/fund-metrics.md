---
name: fund-metrics
description: Compute IRR, TVPI, DPI, RVPI, and other fund performance metrics
tags:
  - finance
  - irr
  - tvpi
  - dpi
  - fund-performance
  - metrics
placeholder: "e.g. Compute IRR and TVPI for Fund III as of Q4 2024"
defaultOutput: Spreadsheet
icon: IconChartBar
arguments:
  - name: fund
    description: Fund name or identifier (optional — computes for all funds if omitted)
    required: false
---

# /fund-metrics — Compute Fund Performance Metrics

Compute standard PE/VC fund performance metrics.

## Target

Fund: **$ARGUMENTS** (if blank, compute for all funds found in workspace data)

## Instructions

1. **Locate fund data** in the workspace:
   - Check `_research/entity-map.md` for fund entities
   - Search for capital account statements, quarterly reports, cash flow data
   - Parse any unparsed source documents using the `document-parser` skill

2. **Extract cash flow data** for each fund:
   - Capital calls (dates and amounts)
   - Distributions (dates, amounts, types)
   - Current NAV / residual value
   - Management fee and carry terms from LPA

3. **Compute metrics** using the `fund-performance` skill:
   - **Gross IRR** and **Net IRR** (after fees and carry)
   - **TVPI** (Total Value to Paid-In)
   - **DPI** (Distributions to Paid-In)
   - **RVPI** (Residual Value to Paid-In)
   - **PME** vs. appropriate benchmark index
   - Cross-check: TVPI = DPI + RVPI

4. **Present results** in a summary table:

   | Metric | Value | As-of Date | Confidence | Source |
   |--------|-------|------------|------------|--------|
   | Gross IRR | X.X% | YYYY-MM-DD | [level] | [source] |
   | Net IRR | X.X% | YYYY-MM-DD | [level] | [source] |
   | TVPI | X.Xx | YYYY-MM-DD | [level] | [source] |
   | DPI | X.Xx | YYYY-MM-DD | [level] | [source] |
   | RVPI | X.Xx | YYYY-MM-DD | [level] | [source] |
   | PME (vs. [index]) | X.Xx | YYYY-MM-DD | [level] | [source] |

5. **Show all computation steps** — inputs, intermediate calculations, final results

6. **Provide context**:
   - Fund age and vintage year
   - Investment period status (active/expired)
   - J-curve position
   - Benchmark comparison if data available

## Critical Rules

- Always specify gross vs. net for IRR
- Always state the as-of date
- Always state the currency
- Show all intermediate computation steps
- Cross-check: TVPI must equal DPI + RVPI
- Don't annualize IRR for funds less than 2 years old
- Note if NAV is audited (VERIFIED) or unaudited (REPORTED)
