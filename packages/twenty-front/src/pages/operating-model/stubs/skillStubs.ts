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
];
