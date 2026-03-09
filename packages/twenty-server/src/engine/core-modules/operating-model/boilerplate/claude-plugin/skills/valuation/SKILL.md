---
description: "Perform fair value analysis for PE/VC portfolio companies — comparable company analysis, precedent transactions, DCF modeling, ASC 820 / IFRS 13 fair value hierarchy classification, and valuation reconciliation. Ensures compliance with accounting standards."
---

# Valuation Analysis

Perform fair value analysis during the COMPUTE phase of the ACSR lifecycle.

## ASC 820 / IFRS 13 Fair Value Hierarchy

Every valuation must be classified:

| Level | Inputs | Examples |
|-------|--------|----------|
| **Level 1** | Quoted prices in active markets | Public stock price, exchange-traded securities |
| **Level 2** | Observable inputs other than Level 1 | Comparable company multiples, recent transactions |
| **Level 3** | Unobservable inputs | DCF with internal projections, fund manager estimates |

**Most PE/VC investments are Level 3.** Always state the level.

## Valuation Methodologies

### 1. Comparable Company Analysis (Market Approach)

```markdown
### Comparable Company Analysis for [Company Name]

**Subject Company Metrics (as of [date])**:
- LTM Revenue: [amount] [currency]
- LTM EBITDA: [amount] [currency]
- Revenue Growth: [X.X%]
- EBITDA Margin: [X.X%]

**Selected Comparables**:

| Company | EV/Revenue | EV/EBITDA | Revenue Growth | EBITDA Margin |
|---------|-----------|-----------|----------------|---------------|
| [Comp 1] | X.Xx | X.Xx | X.X% | X.X% |
| [Comp 2] | X.Xx | X.Xx | X.X% | X.X% |
| [Comp 3] | X.Xx | X.Xx | X.X% | X.X% |
| **Median** | **X.Xx** | **X.Xx** | **X.X%** | **X.X%** |
| **Mean** | **X.Xx** | **X.Xx** | **X.X%** | **X.X%** |

**Selected Multiple**: [X.Xx] EV/EBITDA (state rationale for selection vs. median)

**Adjustments**:
- Size discount: [X%] (subject is smaller/less liquid)
- Growth premium/discount: [X%] (growth differential)
- Control premium: [X%] (if applicable)

**Implied Enterprise Value**: [amount] [currency]
**Less: Net Debt**: [amount]
**Equity Value**: [amount]
**Fund Ownership**: [X%]
**Fair Value of Fund's Interest**: [amount] [currency]
```

### 2. Precedent Transactions Analysis

Same structure as comparables but using transaction multiples. Note:
- Transaction multiples include control premiums
- Adjust for market conditions at time of transaction vs. current

### 3. Discounted Cash Flow (Income Approach)

```markdown
### DCF Analysis for [Company Name]

**Projection Period**: [X] years
**Terminal Value Method**: [Exit multiple / Gordon Growth]

| Year | Revenue | EBITDA | FCF | Discount Factor | PV of FCF |
|------|---------|--------|-----|-----------------|-----------|
| 1 | | | | | |
| 2 | | | | | |
| ... | | | | | |
| TV | | | | | |

**Key Assumptions**:
- Revenue CAGR: [X.X%] — Confidence: [level]
- EBITDA Margin (terminal): [X.X%]
- WACC: [X.X%] (Risk-free: X.X%, ERP: X.X%, Beta: X.X, Size premium: X.X%)
- Terminal Exit Multiple: [X.Xx] EV/EBITDA OR Terminal Growth Rate: [X.X%]

**Sensitivity Analysis**:

| WACC \ Exit Multiple | X.Xx | X.Xx | X.Xx |
|---------------------|------|------|------|
| X.X% | | | |
| X.X% | | | |
| X.X% | | | |
```

### 4. Calibration to Entry Valuation

Per ASC 820 guidance, calibrate current valuation to entry price:

- **Entry valuation**: [amount] at [date] at [X.Xx] EV/EBITDA
- **Current implied multiple**: [X.Xx] EV/EBITDA
- **Change in multiple justified by**: [operational improvement / market conditions / etc.]

## Valuation Reconciliation

When using multiple methods, reconcile:

| Method | Implied Fair Value | Weight | Weighted Value |
|--------|-------------------|--------|----------------|
| Comparable Companies | [amount] | [X%] | [amount] |
| Precedent Transactions | [amount] | [X%] | [amount] |
| DCF | [amount] | [X%] | [amount] |
| **Concluded Fair Value** | | **100%** | **[amount]** |

**State rationale for weighting.**

## Critical Rules

- Always show the fair value hierarchy level (1, 2, or 3)
- Always state the as-of date — valuations are point-in-time
- Always state the currency
- Show sensitivity analysis for Level 3 valuations
- Never present a single-point estimate without context on the range
- Document all assumptions — an auditor should be able to reproduce your work
- Flag any backsolve or calibration assumptions
