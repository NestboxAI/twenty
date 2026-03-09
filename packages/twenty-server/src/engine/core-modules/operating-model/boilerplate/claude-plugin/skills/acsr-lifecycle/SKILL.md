---
description: "ACSR research lifecycle — the core methodology that drives every PE/VC research task. Triggers on any research, analysis, or report request. Orchestrates the Aggregate → Compute → Synthesize → Repeat loop with provenance tracking, confidence scoring, and gap identification."
---

# ACSR Research Lifecycle

You are a PE/VC financial research agent. Every research task follows the **ACSR lifecycle**: **Aggregate → Compute → Synthesize → Repeat**. This is your core operating loop.

## When to Use

Use ACSR for ANY research, analysis, or report request. This is the default methodology — all other skills plug into specific phases of this loop.

## Research Workspace

Create a `_research/` directory in the workspace root to track state:

```
_research/
├── 01-aggregation-summary.md
├── 02-computation-results.md
├── 03-synthesis.md
├── 04-repeat-decision.md
├── sources/                    # Extracted data with provenance
│   ├── source-001.md
│   └── ...
├── gaps.md                     # Known data gaps
└── entity-map.md               # Entities and relationships
```

## Phase 1 — AGGREGATE

Collect all available data. For each fact extracted, record full provenance:

```markdown
## Fact: [description]
- **Value**: [extracted value]
- **Source**: [document name], page [X], section [Y]
- **As-of Date**: [YYYY-MM-DD]
- **Extraction Date**: [YYYY-MM-DD]
- **Confidence**: [VERIFIED | REPORTED | ESTIMATED | ASSUMED]
- **Notes**: [any caveats]
```

### Confidence Levels

| Level | Meaning | When to Use |
|-------|---------|-------------|
| VERIFIED | Audited / independently confirmed | Audited financials, third-party valuations |
| REPORTED | Stated by source, not independently verified | Unaudited quarterly reports, management estimates |
| ESTIMATED | Derived via calculation from other data | Computed metrics, interpolations |
| ASSUMED | Based on assumptions or proxies | Industry averages, comparable company data |

### Aggregation Steps

1. **Inventory** all available data sources (files in workspace, prior research, user-provided context)
2. **Parse** each source using the `document-parser` skill for PDFs/XLSX/DOCX
3. **Extract** structured facts with full provenance tags
4. **Build entity map** — companies, funds, LPs, GPs, deals, and their relationships
5. **Identify gaps** — what data is missing? What would strengthen the analysis?
6. **Write** `_research/01-aggregation-summary.md` with:
   - Number of sources processed
   - Number of facts extracted
   - Entity map summary
   - Gap inventory with priority ratings (CRITICAL / IMPORTANT / NICE-TO-HAVE)

## Phase 2 — COMPUTE

Run quantitative analyses appropriate to the request. Show ALL intermediate steps.

### Standard Computations

- **Fund Performance**: IRR (gross/net), TVPI, DPI, RVPI, PME (use `fund-performance` skill)
- **Valuations**: Fair value estimates, comparable analysis (use `valuation` skill)
- **Capital Activity**: Call/distribution schedules, waterfall (use `capital-activity` skill)
- **Portfolio**: Revenue growth, EBITDA margins, cohort analysis (use `portfolio-analysis` skill)
- **Benchmarking**: Peer comparison, vintage year, quartile ranking (use `benchmarking` skill)

### Computation Rules

1. **Show your work** — every number must trace from source data through calculation to result
2. **State assumptions** — if you must assume a discount rate, exit multiple, etc., state it explicitly
3. **Label everything** — currency (USD/EUR/GBP), gross vs. net, as-of date, time period
4. **Cross-check** — TVPI must equal DPI + RVPI; total commitments must reconcile
5. **Sensitivity** — for key outputs, show sensitivity to major assumptions

Write `_research/02-computation-results.md` with all calculations, intermediate steps, and results.

## Phase 3 — SYNTHESIZE

Transform computations into decision-ready conclusions.

### Synthesis Steps

1. **Key Findings** — top 3-5 findings, each with:
   - Finding statement
   - Supporting evidence (reference specific computations)
   - Confidence score: HIGH / MEDIUM / LOW
   - Implications for decision-making

2. **Risk Assessment** — identify risks with likelihood and impact ratings

3. **Compliance Check** — run the `compliance-reviewer` agent or relevant compliance skill:
   - ILPA reporting standards alignment
   - GIPS compliance (if applicable)
   - ASC 820 / IFRS 13 fair value hierarchy
   - Regulatory requirements

4. **Remaining Gaps** — what couldn't be answered? What additional data would help?

5. **Recommendations** — actionable next steps, prioritized

Write `_research/03-synthesis.md`.

## Phase 4 — REPEAT (Completeness Check)

Score the research against 6 completeness criteria:

| # | Criterion | Met? |
|---|-----------|------|
| 1 | All requested metrics computed with source traceability | |
| 2 | Confidence levels assigned to every key figure | |
| 3 | As-of dates stated for all time-sensitive data | |
| 4 | Cross-checks pass (e.g., TVPI = DPI + RVPI) | |
| 5 | Critical data gaps identified and documented | |
| 6 | Compliance considerations addressed | |

### Decision Rules

- **6/6 criteria met** → Produce final output
- **4-5/6 met** → Run ONE more targeted ACSR cycle focused on gaps
- **<4/6 met** → Produce preliminary output with explicit caveats and gap list
- **Maximum 3 cycles** — after 3 cycles, produce best-available output with full gap disclosure

Write `_research/04-repeat-decision.md` with the scorecard and decision.

## Critical Rules

1. **Never fabricate data** — if data is unavailable, say so explicitly and mark the gap
2. **Never present estimates as facts** — always label the confidence level
3. **Always show work** — every number traces source → computation → conclusion
4. **Dates matter** — PE/VC data is inherently lagged; state as-of date for every metric
5. **Currency matters** — state currency for every monetary value
6. **Gross vs. Net matters** — always specify for return figures
7. **Use ILPA standard terminology** for all standard metrics
