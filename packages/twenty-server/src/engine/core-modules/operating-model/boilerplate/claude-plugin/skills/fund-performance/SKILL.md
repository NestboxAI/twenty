---
description: "Compute PE/VC fund performance metrics — IRR (gross/net), TVPI, DPI, RVPI, PME (Kaplan-Schoar, Direct Alpha, Long-Nickels), J-curve analysis, and vintage year performance. Shows all intermediate steps with full traceability from source data."
---

# Fund Performance Metrics

Compute standard PE/VC fund performance metrics during the COMPUTE phase of the ACSR lifecycle.

## Core Metrics

### IRR (Internal Rate of Return)

The discount rate that makes NPV of all cash flows equal zero.

**Gross IRR**: Before management fees and carried interest.
**Net IRR**: After management fees and carried interest (what LPs actually earn).

**Always specify gross vs. net.**

#### Computation

```python
import numpy as np
from scipy.optimize import brentq

def compute_irr(cash_flows, dates):
    """
    cash_flows: list of (date, amount) tuples
                Negative = contribution (LP pays in)
                Positive = distribution (LP receives)
    Last cash flow should include residual NAV as a positive value.
    """
    from datetime import datetime

    def npv(rate):
        base_date = dates[0]
        total = 0
        for date, cf in zip(dates, cash_flows):
            years = (date - base_date).days / 365.25
            total += cf / (1 + rate) ** years
        return total

    try:
        irr = brentq(npv, -0.99, 10.0)
        return irr
    except ValueError:
        return None  # No IRR solution found
```

**Show**: All input cash flows (date, amount, type), the resulting IRR, and any assumptions about residual value.

### TVPI (Total Value to Paid-In)

```
TVPI = (Distributions + Residual NAV) / Paid-In Capital
```

**Cross-check**: TVPI = DPI + RVPI (must hold exactly).

### DPI (Distributions to Paid-In)

```
DPI = Total Distributions / Paid-In Capital
```

Also known as "cash-on-cash" or "realization ratio." Measures actual cash returned.

### RVPI (Residual Value to Paid-In)

```
RVPI = Residual NAV / Paid-In Capital
```

Measures unrealized value remaining. Subject to valuation uncertainty.

### PME (Public Market Equivalent)

Compares fund performance to a public market index.

#### Kaplan-Schoar PME

```
PME = (Sum of distributions compounded at index return + NAV) /
      (Sum of contributions compounded at index return)
```

- PME > 1.0 → Fund outperformed the index
- PME = 1.0 → Fund matched the index
- PME < 1.0 → Fund underperformed the index

**State the benchmark index used** (e.g., S&P 500, Russell 2000, MSCI World).

### J-Curve Analysis

Plot cumulative net cash flow over time to visualize the J-curve:

| Quarter | Contributions | Distributions | Cumulative Net CF | NAV | TVPI |
|---------|--------------|---------------|-------------------|-----|------|
| Q1 20XX | (X,XXX) | — | (X,XXX) | X,XXX | X.Xx |

## Presentation Requirements

For every metric computed:

1. **State the metric name** using ILPA standard terminology
2. **State the value** with appropriate precision (IRR: 1 decimal; multiples: 2 decimals)
3. **State as-of date**
4. **State gross or net**
5. **State currency**
6. **Show the computation** — inputs, formula, result
7. **State confidence level** — VERIFIED if from audited data, ESTIMATED if computed from unaudited inputs

## Benchmarking Context

When presenting fund metrics, provide context:

| Metric | Fund | Benchmark Median | Benchmark Upper Quartile | Quartile Rank |
|--------|------|-----------------|--------------------------|---------------|
| Net IRR | X.X% | X.X% | X.X% | [1st/2nd/3rd/4th] |
| TVPI | X.Xx | X.Xx | X.Xx | [1st/2nd/3rd/4th] |
| DPI | X.Xx | X.Xx | X.Xx | [1st/2nd/3rd/4th] |

**State the benchmark source and vintage year.**

## Common Pitfalls

- **Don't annualize IRR for funds < 2 years old** — the result is misleading
- **Interim IRR ≠ final IRR** — always note if the fund is still active
- **NAV is an estimate** — RVPI and TVPI are only as reliable as the NAV
- **Management fees reduce net returns** — typical 1.5-2.0% on committed/invested capital
- **Carried interest** — typically 20% above an 8% hurdle; affects net IRR significantly
