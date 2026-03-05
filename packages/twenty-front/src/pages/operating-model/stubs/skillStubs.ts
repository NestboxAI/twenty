import { type FileNode } from '../OperatingModelTypes';

export const SKILL_STUBS: FileNode[] = [
  {
    id: 'skill-acsr',
    name: 'acsr-lifecycle',
    path: 'skills/acsr-lifecycle',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-acsr-md',
        name: 'SKILL.md',
        path: 'skills/acsr-lifecycle/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-01T08:00:00Z',
        content: `---
description: "ACSR research lifecycle — the core methodology that drives every PE/VC research task. Orchestrates the Aggregate \u2192 Compute \u2192 Synthesize \u2192 Repeat loop with provenance tracking, confidence scoring, and gap identification."
---

# ACSR Research Lifecycle

Every research task follows the **ACSR lifecycle**: **Aggregate \u2192 Compute \u2192 Synthesize \u2192 Repeat**.

## When to Use

Use ACSR for ANY research, analysis, or report request.

## Phase 1 — AGGREGATE

Collect all available data with full provenance tracking.

## Phase 2 — COMPUTE

Run quantitative analyses. Show ALL intermediate steps.

## Phase 3 — SYNTHESIZE

Transform computations into decision-ready conclusions.

## Phase 4 — REPEAT

Score completeness against 6 criteria and decide whether to cycle again.

## Critical Rules

1. Never fabricate data
2. Never present estimates as facts
3. Always show work
4. Dates and currency matter — state them for every metric`,
      },
    ],
  },
  {
    id: 'skill-fund-perf',
    name: 'fund-performance',
    path: 'skills/fund-performance',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-fund-perf-md',
        name: 'SKILL.md',
        path: 'skills/fund-performance/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-02T10:00:00Z',
        content: `---
description: "Compute PE/VC fund performance metrics \u2014 IRR (gross/net), TVPI, DPI, RVPI, PME (Kaplan-Schoar, Direct Alpha, Long-Nickels), J-curve analysis, and vintage year performance."
---

# Fund Performance Metrics

Compute standard PE/VC fund performance metrics during the COMPUTE phase.

## Core Metrics

### IRR (Internal Rate of Return)
- **Gross IRR**: Before management fees and carried interest
- **Net IRR**: After management fees and carried interest

### TVPI, DPI, RVPI
- TVPI = (Distributions + Residual NAV) / Paid-In Capital
- Cross-check: TVPI = DPI + RVPI

### PME (Public Market Equivalent)
- PME > 1.0 \u2192 Fund outperformed the index

## Presentation Requirements

For every metric: state name, value, as-of date, gross/net, currency, computation steps, and confidence level.`,
      },
    ],
  },
  {
    id: 'skill-data-agg',
    name: 'data-aggregation',
    path: 'skills/data-aggregation',
    type: 'directory',
    validationStatus: 'warning',
    children: [
      {
        id: 'skill-data-agg-doc-parser',
        name: 'document-parser',
        path: 'skills/data-aggregation/document-parser',
        type: 'directory',
        children: [
          {
            id: 'skill-data-agg-doc-parser-md',
            name: 'SKILL.md',
            path: 'skills/data-aggregation/document-parser/SKILL.md',
            type: 'file',
            format: 'md',
            required: true,
            validationStatus: 'ok',
            lastEdited: '2025-11-28T14:00:00Z',
            content: `---
description: "Parse and extract structured data from PDF, XLSX, DOCX, and CSV files. Handles financial statements, LP reports, fund documents, and data rooms."
---

# Document Parser

Parse and extract structured data from uploaded documents with full provenance metadata.

## Supported Formats

- PDF (text and scanned)
- XLSX (multi-sheet)
- DOCX
- CSV

## Extraction Format

For each extracted fact, record:
- **Value**: the extracted value
- **Source**: document name, page/sheet/section
- **Confidence**: VERIFIED / REPORTED / ESTIMATED / ASSUMED`,
          },
        ],
      },
      {
        id: 'skill-data-agg-fin-data',
        name: 'financial-data',
        path: 'skills/data-aggregation/financial-data',
        type: 'directory',
        children: [
          {
            id: 'skill-data-agg-fin-data-md',
            name: 'SKILL.md',
            path: 'skills/data-aggregation/financial-data/SKILL.md',
            type: 'file',
            format: 'md',
            required: true,
            validationStatus: 'warning',
            lastEdited: '2025-11-25T09:00:00Z',
            content: `---
description: "Extract and normalize financial data from structured sources — GL exports, trial balances, capital account statements, and portfolio company financials."
---

# Financial Data Extraction

Extract and normalize financial data from structured sources.

## Data Types

- General Ledger exports
- Trial balances
- Capital account statements
- Portfolio company financials

## Normalization

Map all extracted data to a standard chart of accounts with consistent date formats and currency handling.`,
          },
        ],
      },
    ],
  },
  {
    id: 'skill-valuation',
    name: 'valuation',
    path: 'skills/valuation',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-valuation-md',
        name: 'SKILL.md',
        path: 'skills/valuation/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-03T13:30:00Z',
        content: `---
description: "Fair value estimation using DCF, comparable companies, precedent transactions, and ASC 820 / IFRS 13 hierarchy classification."
---

# Valuation

Estimate fair value using multiple methodologies and reconcile.

## Methodologies

1. **DCF** — Discounted cash flow with explicit assumptions
2. **Comparable Companies** — Trading multiples from public peers
3. **Precedent Transactions** — Relevant M&A deal multiples
4. **Cost Approach** — For early-stage or distressed assets

## ASC 820 Fair Value Hierarchy

- **Level 1**: Quoted prices in active markets
- **Level 2**: Observable inputs (comparable transactions)
- **Level 3**: Unobservable inputs (models, assumptions)

Always state the hierarchy level and key assumptions.`,
      },
    ],
  },
  {
    id: 'skill-geo-risk',
    name: 'geopolitical-risk-assessment',
    path: 'skills/geopolitical-risk-assessment',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-geo-risk-md',
        name: 'SKILL.md',
        path: 'skills/geopolitical-risk-assessment/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-04T09:00:00Z',
        content: `---
description: "Assess geopolitical risks and their impact on PE/VC portfolios — conflict tracking, sanctions analysis, commodity price transmission, supply chain exposure mapping, and portfolio stress testing."
---

# Geopolitical Risk Assessment

Evaluate geopolitical events and quantify their impact on portfolio companies and fund performance.

## When to Use

Use for any geopolitical event, conflict, sanctions regime, trade dispute, or political instability that may affect portfolio companies.

## Transmission Channels

1. **Energy & Commodities** — Oil/gas price shocks, metals supply disruption, agricultural commodity impact
2. **Supply Chain** — Shipping route disruptions, single-source supplier risk, lead time increases
3. **FX & Capital Markets** — Currency volatility, credit spread widening, equity risk premium changes
4. **Regulatory & Sanctions** — Trade restrictions, compliance requirements, market access changes

## Risk Scoring

Score each portfolio company on a 1-5 scale across each channel. Aggregate into a portfolio heat map.

## Critical Rules

1. Always cite sources for geopolitical intelligence
2. Distinguish between direct exposure (operations in affected region) and indirect exposure (supply chain, customers)
3. Present both escalation and de-escalation scenarios
4. Quantify impact in dollar terms wherever possible
5. Include actionable mitigation steps for each identified risk`,
      },
    ],
  },
  {
    id: 'skill-sanctions',
    name: 'sanctions-screening',
    path: 'skills/sanctions-screening',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-sanctions-md',
        name: 'SKILL.md',
        path: 'skills/sanctions-screening/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-04T10:00:00Z',
        content: `---
description: "Screen portfolio companies and counterparties against OFAC, EU, and UN sanctions lists. Identify restricted entities, blocked persons, and sectoral sanctions that affect deal flow, banking, and operations."
---

# Sanctions Screening

Screen entities against global sanctions regimes and assess compliance risk.

## Sanctions Lists

- **OFAC SDN** — US Office of Foreign Assets Control Specially Designated Nationals
- **EU Consolidated List** — European Union restrictive measures
- **UN Security Council** — UN consolidated sanctions list
- **UK OFSI** — UK Office of Financial Sanctions Implementation

## Screening Process

1. Extract entity names, aliases, and jurisdictions from portfolio data
2. Run fuzzy matching against all active sanctions lists
3. Flag matches with confidence score and list source
4. Assess sectoral sanctions applicability (energy, finance, technology)
5. Recommend remediation actions for flagged entities

## Compliance Requirements

Always document screening date, lists checked, and match resolution rationale.`,
      },
    ],
  },
  {
    id: 'skill-commodity-impact',
    name: 'commodity-impact-analysis',
    path: 'skills/commodity-impact-analysis',
    type: 'directory',
    validationStatus: 'ok',
    children: [
      {
        id: 'skill-commodity-impact-md',
        name: 'SKILL.md',
        path: 'skills/commodity-impact-analysis/SKILL.md',
        type: 'file',
        format: 'md',
        required: true,
        validationStatus: 'ok',
        lastEdited: '2025-12-04T11:00:00Z',
        content: `---
description: "Analyze the impact of commodity price movements on portfolio company margins — oil, natural gas, metals, and agricultural inputs. Model pass-through rates, hedging effectiveness, and margin sensitivity."
---

# Commodity Impact Analysis

Quantify how commodity price changes affect portfolio company costs and margins.

## Commodities Tracked

- **Energy** — Crude oil (WTI, Brent), natural gas (Henry Hub, TTF), diesel, jet fuel
- **Metals** — Steel, aluminum, copper, lithium, rare earths
- **Agricultural** — Wheat, corn, soybeans, palm oil, coffee

## Analysis Framework

1. Map each portfolio company's commodity exposure (direct purchases + embedded in COGS)
2. Estimate cost pass-through rates (% of commodity cost increase absorbed vs. passed to customers)
3. Model margin sensitivity: EBITDA impact per 10% commodity price change
4. Evaluate existing hedges and their remaining effectiveness
5. Recommend hedging strategies with cost-benefit analysis

## Output

For each company: exposure amount, pass-through rate, unhedged margin sensitivity, and recommended actions.`,
      },
    ],
  },
];
