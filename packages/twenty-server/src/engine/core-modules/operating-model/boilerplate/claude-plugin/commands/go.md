---
name: go
description: Smart dispatcher — describe what you need in plain English and get routed to the right command
tags:
  - dispatch
  - router
  - natural-language
  - smart
placeholder: "e.g. Analyze Fund III performance, write IC memo for Acme Corp"
defaultOutput: Document
icon: IconPlayerPlay
arguments:
  - name: request
    description: Your request in natural language (e.g. "analyze Fund III performance", "write IC memo for Acme Corp")
    required: true
---

# /go — Smart Command Dispatcher

Route the user's natural-language request to the correct specialized command.

## User Request

**$ARGUMENTS**

## Routing Table

Classify the request against these intent patterns and route to the matching command:

| Intent Pattern | Command | Indicators |
|----------------|---------|------------|
| Research, analysis, deep-dive, investigate, explore a topic | `/research` | "analyze", "research", "deep-dive", "investigate", "what's driving", "explain why", "explore" |
| Fund metrics, IRR, TVPI, DPI, RVPI, PME, fund performance numbers | `/fund-metrics` | "IRR", "TVPI", "DPI", "RVPI", "PME", "compute metrics", "fund performance", "returns" |
| LP report, quarterly report, annual report, investor report | `/lp-report` | "LP report", "quarterly report", "annual report", "investor update", "ILPA" |
| Portfolio review, portfolio snapshot, how companies are doing | `/portfolio-review` | "portfolio review", "portfolio snapshot", "how are our companies", "full portfolio", "company overview" |
| Portfolio company metrics, ILPA PortCo report, single-company PE analysis, portco KPIs | `/portfolio-performance` | "ILPA", "PortCo", "portfolio company report", "portco metrics", "company KPIs", "PE company analysis", "buyout metrics", "growth equity metrics", "MOIC for [company]", "research [company] for our fund" |
| IC memo, investment memo, deal memo, exit memo | `/ic-memo` | "IC memo", "investment memo", "deal memo", "exit memo", "write memo for", "investment committee" |
| Benchmark, peer comparison, quartile ranking, vintage comparison | `/benchmark` | "benchmark", "peer comparison", "quartile", "ranking", "compare to peers", "vintage" |
| Data room, parse documents, ingest files, index documents | `/data-room` | "data room", "parse", "ingest", "index documents", "uploaded files", "extract from documents" |
| Demo, example, sample data, test run, try it out, show me how it works | `/example` | "example", "demo", "sample", "try", "test run", "show me how", "fabricate" |
| Status, progress, where are we, what's done, what's left | `/status` | "status", "progress", "where are we", "what's done", "what's left", "current state" |
| Rent roll, tenant roster, contracted income snapshot | `/rent-roll` | "rent roll", "tenant list", "contracted income", "lease roster", "who's in the building" |
| Lease expiration, rollover risk, lease maturity schedule | `/lease-expiration` | "lease expiration", "rollover", "maturity schedule", "leases expiring", "renewal risk" |
| Lease abstract, clause summary, lease terms extraction | `/lease-abstracting` | "lease abstract", "clause summary", "lease terms", "TI allowance", "co-tenancy", "escalation clause" |
| CAM reconciliation, common area maintenance true-up | `/cam-reconciliation` | "CAM reconciliation", "CAM true-up", "common area", "expense recovery", "NNN reconciliation" |
| Operating statement, property P&L, income and expenses | `/operating-statement` | "operating statement", "P&L", "income statement", "property financials", "NOI", "revenue and expenses" |
| Budget vs actual, variance analysis, expense variance | `/variance-report` | "variance", "budget vs actual", "budget comparison", "over budget", "under budget", "expense variance" |
| Accounts receivable, tenant delinquency, collections aging | `/ar-aging` | "A/R aging", "accounts receivable", "delinquency", "past due", "collections", "tenant owes" |
| NOI trend, income trend, performance over time | `/noi-trend` | "NOI trend", "income trend", "NOI history", "trailing NOI", "T12 NOI", "NOI over time" |
| Capital expenditures, CapEx tracking, TI spend, project budget | `/capex-report` | "CapEx", "capital expenditure", "TI spend", "tenant improvements", "roof replacement", "building improvements" |
| Debt service coverage, DSCR, loan covenant compliance | `/dscr-report` | "DSCR", "debt service coverage", "loan covenant", "debt compliance", "lender reporting" |
| Property cash flow, cash available for distribution | `/property-cash-flow` | "cash flow statement", "property cash flow", "cash available", "after debt service", "distributable cash" |
| Distribution waterfall, GP/LP splits, preferred return, promote | `/distribution-waterfall` | "waterfall", "distribution", "preferred return", "promote", "catch-up", "GP/LP split" |
| Property/fund IRR, equity multiple, investment returns | `/irr-equity-multiple` | "IRR", "equity multiple", "investment return", "realized return", "unrealized", "XIRR" |
| Property valuation, cap rate, NAV, DCF, comparable sales | `/cre-valuation` | "valuation", "cap rate", "NAV", "DCF", "comparable sales", "property value", "appraisal" |
| Compliance, CAM recoverability, lease billing audit, insurance check | `/compliance-report` | "compliance", "recoverability", "billing audit", "insurance compliance", "property tax reconciliation", "audit trail" |
| Mark-to-market rent, in-place vs market rent, embedded upside | `/mark-to-market` | "mark to market", "market rent", "in-place vs market", "rent spread", "below market", "above market" |
| Break-even occupancy, minimum occupancy to cover costs | `/break-even-occupancy` | "break-even", "break even occupancy", "minimum occupancy", "how much vacancy can we absorb" |
| Tenant concentration, revenue dependency, single-tenant risk | `/tenant-concentration` | "tenant concentration", "concentration risk", "top tenant", "revenue dependency", "HHI", "tenant diversity" |
| Weighted average lease term, WALT, income duration | `/walt` | "WALT", "weighted average lease term", "lease duration", "income stability", "average lease term" |
| Sensitivity analysis, stress test, cap rate impact, what-if scenarios | `/sensitivity-analysis` | "sensitivity", "stress test", "what if", "cap rate impact", "scenario analysis", "downside case" |

## Instructions

1. **Classify the request**: Read the user's request and match it against the routing table above. Look for keyword matches and semantic intent, not just exact phrases.

2. **If the intent is clear** (maps to exactly one command):
   - State which command you're routing to and why, in one short line (e.g., "Routing to `/fund-metrics` — you're asking for IRR computation.")
   - Execute that command's full workflow immediately, passing the relevant portion of the request as the argument. Follow the target command's instructions exactly as if the user had invoked it directly.

3. **If the intent is ambiguous** (could map to multiple commands):
   - State which commands matched and why (e.g., "This matches `/lp-report` and `/status` — running both.")
   - Execute all matching commands sequentially, passing the user's request to each one.
   - Clearly separate the output of each command with a heading so the user can distinguish results.

4. **If the request doesn't match any command**:
   - Tell the user their request doesn't map to a known workflow.
   - List the available commands with one-line descriptions so they can choose or rephrase:
     **PE/VC Commands:**
     - `/research` — Deep-dive analysis on a PE/VC topic
     - `/fund-metrics` — Compute IRR, TVPI, DPI, and other fund metrics
     - `/lp-report` — Generate an ILPA-compliant LP report
     - `/portfolio-review` — Full portfolio snapshot with company detail
     - `/ic-memo` — Investment committee memo for a deal
     - `/benchmark` — Peer benchmarking and quartile analysis
     - `/data-room` — Parse and index a data room
     - `/example` — Demo the plugin with fabricated data
     - `/status` — Show research progress and data gaps

     **CRE — Lease & Revenue:**
     - `/rent-roll` — Rent roll: snapshot of all contracted income
     - `/lease-expiration` — Lease expiration schedule and rollover risk
     - `/lease-abstracting` — Lease abstract: key clauses and terms summary

     **CRE — Operating & CAM:**
     - `/cam-reconciliation` — Annual CAM reconciliation and tenant true-ups
     - `/operating-statement` — Property-level P&L (income, expenses, NOI)
     - `/variance-report` — Budget vs. actual variance analysis
     - `/ar-aging` — Accounts receivable aging and delinquency tracking

     **CRE — Asset Performance:**
     - `/noi-trend` — NOI trend over time with YoY analysis
     - `/capex-report` — Capital expenditure tracking and ROI
     - `/dscr-report` — Debt service coverage ratio and covenant compliance

     **CRE — Investor / Fund Level:**
     - `/property-cash-flow` — Property cash flow: NOI through distributions
     - `/distribution-waterfall` — GP/LP distribution waterfall computation
     - `/irr-equity-multiple` — IRR, equity multiple, and return attribution
     - `/cre-valuation` — Property valuation (cap rate, DCF, comps, NAV)

     **CRE — Compliance & Controls:**
     - `/compliance-report` — CAM recoverability, billing audit, insurance, tax reconciliation

     **CRE — Strategic Analysis:**
     - `/mark-to-market` — Mark-to-market rent analysis (in-place vs. market)
     - `/break-even-occupancy` — Break-even occupancy analysis
     - `/tenant-concentration` — Tenant concentration and revenue dependency risk
     - `/walt` — Weighted Average Lease Term (WALT)
     - `/sensitivity-analysis` — Sensitivity and stress-test analysis

## Workspace Rules (MANDATORY)

Before executing any command, follow these rules:

1. **All files go in `output/`.** Run `mkdir -p output _research` first. Save every deliverable (PDF, DOCX, XLSX, PPTX, CSV, MD) to the `output/` subdirectory — e.g. `output/report.pdf`. The runtime ONLY collects files from `output/` — files written anywhere else will NOT be returned to the user.
2. **Use relative paths only.** Never write to `/home/user/`, `/home/agent/`, `/tmp/`, or any absolute path outside cwd.
3. **Don't waste turns on setup.** Do not check `$HOME`, do not explore the filesystem. Start working immediately.

## Design System (MANDATORY for file output)

When the routed command produces a file deliverable, read these design references BEFORE generating:

1. `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/tokens.md` — colors, typography, number formatting
2. `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/components.md` — title page, table, KPI card, chart patterns
3. `/shared/plugins/{{PLUGIN_NAME}}/skills/design-system/references/language.md` — PE/VC terminology, tone, disclaimers
4. `/shared/plugins/{{PLUGIN_NAME}}/brand/assets/brand-overrides.json` — firm name, confidentiality notice
5. Copy logo into workspace: `cp /shared/plugins/{{PLUGIN_NAME}}/brand/assets/logo.png ./logo.png 2>/dev/null || true`

## Critical Rules

- Always route — never answer the question yourself. The specialized commands have the domain logic.
- When the intent is clear, proceed immediately without asking for confirmation.
- When ambiguous, run all matching commands — don't ask, don't guess, just run them all.
- Pass the user's original request context through to the target command so nothing is lost.
