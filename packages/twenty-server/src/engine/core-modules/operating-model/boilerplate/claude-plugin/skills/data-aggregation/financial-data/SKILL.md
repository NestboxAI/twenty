---
description: "Extract and structure financial data from public sources — SEC filings, market data feeds, industry benchmarks, and reference databases. Supplements workspace documents with external context for PE/VC analysis."
---

# Financial Data Extraction

Supplement workspace documents with publicly available financial data. Runs during the AGGREGATE phase of the ACSR lifecycle.

## Data Categories

### 1. Public Company Comparables

When valuing portfolio companies, gather comparable public company data:

- **Metrics**: Revenue, EBITDA, net income, market cap, EV
- **Multiples**: EV/Revenue, EV/EBITDA, P/E, P/B
- **Growth Rates**: Revenue CAGR, EBITDA CAGR
- **Margins**: Gross, EBITDA, net income

Structure as:
```markdown
## Comparable: [Company Name] ([Ticker])
- **Sector**: [GICS sector/subsector]
- **Market Cap**: [amount] [currency] as of [date]
- **EV**: [amount] [currency]
- **LTM Revenue**: [amount] → EV/Revenue: [X.Xx]
- **LTM EBITDA**: [amount] → EV/EBITDA: [X.Xx]
- **Revenue Growth (3Y CAGR)**: [X.X%]
- **EBITDA Margin**: [X.X%]
- **Source**: [source name], as of [date]
- **Confidence**: REPORTED
```

### 2. Industry Benchmarks

For benchmarking fund performance against peers:

- **PE/VC Benchmarks**: Cambridge Associates, Preqin, PitchBook vintage year benchmarks
- **Public Market**: S&P 500, Russell 2000, MSCI indices for PME calculations
- **Sector**: Industry-specific growth rates, margin benchmarks

### 3. Macroeconomic Data

For macro-impact analysis:

- **Interest Rates**: Fed funds rate, SOFR, 10Y Treasury, ECB rate
- **FX Rates**: Major currency pairs relevant to portfolio
- **Inflation**: CPI, PCE
- **Credit Spreads**: Investment grade, high yield, leveraged loan indices

### 4. SEC Filings (Public Portfolio Companies)

If portfolio companies are public or have public filings:

- 10-K (annual), 10-Q (quarterly), 8-K (current events)
- Schedule 13D/G (ownership disclosures)
- Proxy statements (compensation, governance)

## Extraction Process

1. **Identify needs** — based on entity map and analysis requirements, list data needed
2. **Search workspace first** — check if data exists in already-parsed documents
3. **Note external data needs** — list what public data would strengthen the analysis
4. **Record with provenance** — all external data gets REPORTED confidence level with source citation

## Important Caveats

- PE/VC fund data is largely private — most fund-level data comes from workspace documents, not public sources
- Public market data is supplementary — used for PME calculations, comparable analysis, and macro context
- Always note the as-of date — market data changes daily; PE/VC data is typically quarterly
- Currency conversion — if comparing cross-currency data, state the FX rate and date used
