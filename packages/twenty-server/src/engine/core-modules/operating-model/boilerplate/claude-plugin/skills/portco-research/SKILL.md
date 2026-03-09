---
name: portco-research
description: >
  Use this skill whenever a user wants to research a portfolio company and generate an ILPA-compliant
  Portfolio Company Metrics (PortCo) report. Triggers include: any mention of "ILPA", "portfolio company
  report", "PortCo template", "PE fund reporting", "GP reporting", "LP reporting", "buyout company metrics",
  "growth equity metrics", or when a user asks to "research a company for private equity", "compute KPIs
  for a portco", "generate fund performance metrics", or "fill out a portfolio company template".
  Also triggers when a user provides a company name and asks for financial analysis in a PE/VC context,
  including requests for EBITDA multiples, IRR, MOIC, ownership metrics, or debt analysis.
  Output formats supported: Excel (.xlsx), PowerPoint (.pptx), or PDF report.
---

# ILPA Portfolio Company Metrics Research Skill

This skill researches a given company and produces a fully populated ILPA Portfolio Company Metrics
Template (PortCo Template v1.0), computing all required KPIs and fund performance metrics.
Output can be an Excel workbook (matching ILPA format), a PowerPoint deck, or a PDF report.

---

## Workflow Overview

1. **Parse Input** — extract company name, fund details, reporting date, and output format
2. **Research Phase** — use web search to gather financial data for all required ILPA fields
3. **Compute KPIs** — calculate derived metrics (EV, IRR, MOIC, coverage ratios, etc.)
4. **Generate Output** — produce the requested file format

---

## Step 1: Parse Input

Identify from the user's message:
- **Company name** (required)
- **Fund details** (optional: GP name, fund name, reporting date, fund size, currency)
- **Investment details** (optional: invested capital, ownership %, entry date, entry valuation)
- **Output format**: Excel (default), PowerPoint, or PDF
- **Position type**: Equity - Private (default), Equity - Publicly Traded, or Debt

If key investment details (total invested, entry EV) are missing, use web search to estimate them
from publicly available deal announcements or filings. Flag estimated values clearly.

---

## Step 2: Research Phase

Use `web_search` and `web_fetch` to gather the following data. Run searches in parallel where possible.

### Company Identification & Basic Info
Search: `"[company name]" company overview sector headquarters`
- Legal name, any DBA/alternate names
- Industry: NAICS sector + industry group (see `/references/naics-codes.md` if needed)
- HQ country, state/province
- Primary market + secondary markets (use World Bank regions)
- Country of incorporation
- Fiscal year-end month
- Company website
- Business description (1-2 sentences)
- Total employees (current and at entry if known)

### Financial Metrics (Current / TTM)
Search: `"[company name]" revenue EBITDA annual results [current year]`
Search: `"[company name]" financial results earnings [year-1]`

Gather (all TTM unless noted):
- **Revenue** (TTM)
- **EBITDA** (TTM) — if not available, estimate from EBIT + D&A or revenue × margin
- **CapEx** (TTM)
- **Total Equity** (book value, balance sheet)
- **Total Net Debt** = Total Debt − Cash
- **Cash** (balance sheet)
- **Gross Interest Expense** (TTM)
- **Free Cash Flow before debt service** = EBITDA − CapEx − taxes (approx)
- **Free Cash Flow after debt service** = FCF before − interest paid
- **Book Value Debt**
- **Debt Status**: Performing / Non-Performing / No Debt
- **Covenant Status**: Compliant / Breach / Expected Breach / Waived / No Covenant / Renegotiating

### Valuation Metrics
Search: `"[company name]" valuation enterprise value [year]`
Search: `"[company name]" comparable company multiples [sector]`

- **Total Enterprise Value** = Total Equity (A) + Total Net Debt (B) + Minority Interests (C)
- **Valuation Methodology I** (primary): typically Multiple of EBITDA, Revenue, or EBIT
- **Multiple I**: EV / EBITDA, EV / Revenue, etc.
- **Financial Reference Period I**: Actuals TTM, Forecasted TTM, Adjusted TTM, or As At
- **Basis Value I**: the financial metric the multiple is applied to
- **Valuation Methodology II** (secondary cross-check if available)
- Analysis Date and Measurement Date

### Fund Performance Metrics
Calculate from provided or researched investment data:
- **Total Invested (A)** — from user input or deal announcement
- **Current Cost (B)** — remaining cost basis (= Total Invested − realized cost)
- **Reported Value (C)** — current fair market value (use current EV × ownership % as proxy)
- **Realized Proceeds (D)** — distributions received to date
- **Gross IRR (%)** — compute using cash flow timeline (see computation section)
- **Multiple (total return)** = (C + D) / A
- **Multiple (realizations)** = D / A
- **Multiple (unrealized)** = C / A

### M&A Activity
Search: `"[company name]" acquisitions mergers [last 3 years]`
- Number of net M&A transactions since entry
- Enterprise Value of net M&A transactions
- EBITDA and Revenue of acquired entities (TTM at time of acquisition)

### Public Status (if applicable)
Search: `"[company name]" IPO stock exchange ticker`
- Publicly listed? (Y/N)
- IPO date, initial lock-up expiration
- Ticker, exchange, delist date (if any)

### ESG (optional — populate if data available)
Search: `"[company name]" ESG sustainability report [year]`
- ESG policy in place?
- Board oversight?
- GP monitoring?
- Up to 5 material ESG issues with KPIs and progress

---

## Step 3: Compute KPIs

### Enterprise Value
```
EV = Total Equity (book) + Total Net Debt + Minority Interests & Other Net Assets
Net Debt = Total Debt - Cash
```

### Interest Coverage Ratio
```
ICR (TTM) = EBITDA / Gross Interest Expense
```
If interest expense is zero: report as N/A or ∞.

### Free Cash Flow
```
FCF (before debt service) = EBITDA - CapEx - Cash Taxes (estimate ~25% of EBIT if unknown)
FCF (after debt service) = FCF before - Cash Interest Paid
```

### Gross IRR
Use the XIRR method over the investment cash flow timeline:
```
Cash flows:
  Entry date: -Total Invested (negative)
  Any interim realizations: +amount (positive)
  Terminal/current date: +Reported Value or +Total Realized (positive)

IRR = XIRR([cash flows], [dates])
```
The script `scripts/compute_irr.py` implements this.

### Investment Multiples
```
MOIC (total)       = (Reported Value + Realized Proceeds) / Total Invested
MOIC (realized)    = Realized Proceeds / Total Invested
MOIC (unrealized)  = Reported Value / Total Invested
```

### Valuation Cross-Check
```
EV / EBITDA multiple = Enterprise Value / EBITDA (TTM)
EV / Revenue multiple = Enterprise Value / Revenue (TTM)
```
Compare against industry comps found during research. Flag if the implied multiple is >2 standard
deviations from sector median.

### Debt Maturity Schedule
If debt schedule is available, allocate principal repayments to fiscal years 1–5 from reporting date.
If not available, note "Not publicly available" in the notes field.

---

## Step 4: Generate Output

Before generating any file, read the design system references:
1. Read `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md` for colors, fonts, number formatting
2. Read `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md` for component patterns
3. Read `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` for firm name and confidentiality notice
4. Copy logo: `cp /shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png ./logo.png 2>/dev/null || true`

Then read the appropriate generator skill:
- **Excel (.xlsx)** → read `/shared/plugins/{{PLUGIN_NAME}}/skills/output-generation/xlsx-generator/SKILL.md`
- **PowerPoint (.pptx)** → read `/shared/plugins/{{PLUGIN_NAME}}/skills/output-generation/pptx-generator/SKILL.md`
- **PDF** → read `/shared/plugins/{{PLUGIN_NAME}}/skills/output-generation/docx-generator/SKILL.md` (use reportlab or fpdf2 for PDF)

### Excel Output Structure (ILPA-aligned)
Reproduce the following tabs from the ILPA PortCo Template:

| Tab | Content |
|-----|---------|
| Fund Level | GP, fund name, reporting date, NAV, commitments, contributions, distributions |
| Company (current) | Basic info, public status, current KPIs, M&A activity |
| Company (at entry) | Entry KPIs (EBITDA, revenue, EV, employees, etc.) |
| Position (current) | Fund performance metrics, control/influence, exit details, valuation metrics |
| Position (at entry) | Transaction description, initial sizing, ownership at entry |
| Returns Template | Cash flow timeline for IRR computation |
| ESG Template | ESG program and material issues (if data available) |

See `references/field-definitions.md` for exact field names and definitions matching ILPA spec.

### PowerPoint Output Structure
Slide 1: Company Overview (name, description, sector, geography, employees)
Slide 2: Investment Summary (entry date, invested capital, ownership %, position type)
Slide 3: Financial Performance (revenue, EBITDA, EV — entry vs. current, with % change)
Slide 4: Key Performance Indicators (ICR, FCF, debt metrics, debt maturity bar chart)
Slide 5: Fund Performance (IRR, MOIC total/realized/unrealized, commitment vs. value)
Slide 6: Valuation Analysis (methodology, comparable multiples, EV bridge)
Slide 7: M&A Activity (acquisitions since entry, EV and EBITDA of acquired entities)
Slide 8: ESG Summary (if available)
Slide 9: Risk Flags & Notes (data gaps, estimated fields, covenant status)

### PDF Output Structure
Similar to PowerPoint but in a formatted report style with narrative commentary per section.

---

## Data Quality & Flagging Rules

- Any field populated via estimate (not sourced directly): append `*` and note in the Notes field
- Any field where data is unavailable: populate as `N/A` or leave blank per ILPA spec
- If the company is private and financials are not publicly available, use comparable public company
  data to estimate EBITDA margins and multiples — flag clearly as estimated
- Summarize all data gaps in a "Research Limitations" section at the end of the output

---

## Key ILPA Field Reference

See `references/field-definitions.md` for the full 180+ field definitions.

Critical fields and their ILPA IDs:
- EBITDA TTM: `C.03.02.02.001` (current), `C.03.02.03.001` (at entry)
- Revenue TTM: `C.03.02.02.002` (current), `C.03.02.03.002` (at entry)
- Total EV: `C.03.03.02.004` (current), `C.03.03.03.004` (at entry)
- Gross IRR: `P.06.01.02.001`
- MOIC total: `P.01.01.02.001`
- Total Invested: `P.03.01.02.001`
- Reported Value: `P.03.03.02.001`

---

## Dropdown Values Reference

See `references/dropdown-options.md` for allowed values for all dropdown fields including:
- Position Type, Position Status, Purchase Process, Purchase Type
- Investment Strategy, Deal Role, Final Exit Type
- Valuation Methodology I & II, Financial Reference Period
- Debt Status, Covenant Status, NAICS Sectors

---

## Example Invocation

User: "Research Apple Inc. for our buyout fund. We invested $500M in 2022, own 15%, and want an ILPA PortCo report as an Excel file."

Claude should:
1. Parse: company=Apple, invested=$500M, ownership=15%, entry=2022, format=Excel
2. Search for Apple's current financials (revenue, EBITDA, EV, debt, employees)
3. Search for Apple's 2022 financials for at-entry KPIs
4. Compute EV, ICR, FCF, IRR (from 2022 to today), MOIC
5. Generate Excel with all ILPA tabs populated
6. Flag any estimated/unavailable fields

---

## Files in This Skill

- `SKILL.md` — this file (workflow + instructions)
- `references/field-definitions.md` — all 180+ ILPA field definitions
- `references/dropdown-options.md` — allowed dropdown values
- `scripts/compute_irr.py` — XIRR computation utility
- `scripts/generate_output.py` — output generation driver
