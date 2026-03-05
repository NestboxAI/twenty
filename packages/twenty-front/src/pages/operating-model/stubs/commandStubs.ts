import { type FileNode } from '../OperatingModelTypes';

export const COMMAND_STUBS: FileNode[] = [
  // Finance
  {
    id: 'cmd-revenue-analysis',
    name: 'revenue-analysis.md',
    path: 'commands/revenue-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: revenue-analysis
description: Revenue Analysis
---

# /revenue-analysis

## Tasks Required

- Pull consolidated revenue data for the trailing 12 months and current period
- Segment revenue by product line, geography, customer cohort, and contract type
- Calculate period-over-period growth rates at each segmentation level
- Identify seasonality patterns using 3-year historical comparison
- Assess customer concentration risk (top 10/25/50 customers as % of total)
- Compare realized revenue vs. plan and vs. prior year
- Flag any one-time or non-recurring revenue items for normalization`,
  },
  {
    id: 'cmd-cash-flow-forecast',
    name: 'cash-flow-forecast.md',
    path: 'commands/cash-flow-forecast.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: cash-flow-forecast
description: Cash Flow Forecast
---

# /cash-flow-forecast

## Tasks Required

- Compile a 13-week rolling cash flow model segmented by operating, investing, and financing activities
- Map all recurring cash inflows: customer collections, subscription payments, interest income
- Map all recurring cash outflows: payroll, rent, vendor payments, debt service, tax installments
- Overlay non-recurring items: capital expenditures, one-time settlements, milestone payments
- Build three scenarios: base case, downside (delayed AR + accelerated AP), and upside (early collections)
- Identify weeks where projected cash balance falls below the minimum liquidity threshold
- Reconcile the forecast opening balance to the most recent bank statement`,
  },
  {
    id: 'cmd-expense-breakdown',
    name: 'expense-breakdown.md',
    path: 'commands/expense-breakdown.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: expense-breakdown
description: Expense Breakdown
---

# /expense-breakdown

## Tasks Required

- Extract all operating expenses from the GL for the current and prior period
- Categorize expenses by cost center, department, and natural account
- Compare actuals vs. approved budget and vs. prior year for each line item
- Identify the top 10 expense categories by absolute magnitude and by growth rate
- Calculate key cost ratios: COGS as % of revenue, SGA as % of revenue, R&D as % of revenue
- Analyze fixed vs. variable cost composition and operating leverage sensitivity
- Recommend cost optimization opportunities with estimated annual savings`,
  },
  {
    id: 'cmd-competitor-benchmarking',
    name: 'competitor-benchmarking.md',
    path: 'commands/competitor-benchmarking.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: competitor-benchmarking
description: Competitor Benchmarking
---

# /competitor-benchmarking

## Tasks Required

- Define the competitive peer set (3-7 direct competitors plus 2-3 aspirational peers)
- Collect financial metrics: revenue, revenue growth, gross margin, EBITDA margin, net income margin
- Collect operational metrics: headcount, revenue per employee, customer count, NPS
- Gather valuation data: EV/Revenue, EV/EBITDA, P/E multiples (for public comps)
- Estimate market share by revenue or units within the addressable market
- Rank the company against peers on each metric and identify positioning gaps
- Summarize strategic implications: where the company leads, lags, or can differentiate`,
  },
  {
    id: 'cmd-unit-economics',
    name: 'unit-economics.md',
    path: 'commands/unit-economics.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: unit-economics
description: Unit Economics
---

# /unit-economics

## Tasks Required

- Calculate Customer Acquisition Cost (CAC) by channel: paid, organic, outbound, partnerships
- Compute Lifetime Value (LTV) using gross margin, average revenue per account, and churn rate
- Determine LTV/CAC ratio and CAC payback period in months for each acquisition channel
- Analyze contribution margin per customer or per unit at the cohort level
- Track cohort retention curves (monthly and annual) and expansion revenue trends
- Benchmark unit economics against SaaS industry medians and best-in-class peers
- Identify the highest-ROI channels and recommend reallocation of acquisition spend`,
  },
  {
    id: 'cmd-board-deck-summary',
    name: 'board-deck-summary.md',
    path: 'commands/board-deck-summary.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: board-deck-summary
description: Board Deck Summary
---

# /board-deck-summary

## Tasks Required

- Compile key financial highlights: revenue, EBITDA, net income, and cash position vs. plan
- Summarize progress against the top 5-7 company-level KPIs and OKRs
- Report on strategic milestones: product launches, major customer wins, partnerships, hiring
- Outline the top 3-5 risks and corresponding mitigation strategies
- Present capital allocation decisions: fundraising status, M&A pipeline, share repurchases
- Prepare a forward-looking section covering guidance, priorities, and board-level asks
- Format all content for a 20-30 minute board presentation with appendix backup`,
  },
  {
    id: 'cmd-fundraising-memo',
    name: 'fundraising-memo.md',
    path: 'commands/fundraising-memo.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: fundraising-memo
description: Fundraising Memo
---

# /fundraising-memo

## Tasks Required

- Draft an executive summary articulating the investment thesis in 2-3 paragraphs
- Describe the business model: value proposition, revenue model, pricing, and go-to-market strategy
- Size the market opportunity: TAM, SAM, SOM with bottom-up and top-down approaches
- Articulate the competitive moat: technology, network effects, switching costs, brand, or data advantage
- Present historical financials: revenue, gross margin, EBITDA, and cash flow for the last 3 years
- Build forward projections: 3-year P&L, cash flow, and key assumptions driving the model
- Detail the fundraising ask: amount, valuation expectations, use of proceeds, and target milestones
- Include key investor metrics: ARR, NDR, Rule of 40, burn multiple, and implied runway`,
  },
  {
    id: 'cmd-kpi-dashboard',
    name: 'kpi-dashboard.md',
    path: 'commands/kpi-dashboard.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: kpi-dashboard
description: KPI Dashboard
---

# /kpi-dashboard

## Tasks Required

- Define the KPI taxonomy: separate financial, operational, and strategic metrics
- Select 15-20 critical KPIs across revenue, profitability, growth, efficiency, and customer health
- Establish targets, thresholds, and alert triggers for each KPI
- Build period-over-period comparisons: MoM, QoQ, YoY, and trailing 12-month trends
- Implement traffic-light status indicators (green / yellow / red) based on threshold bands
- Conduct root cause analysis for any KPI flagged as off-track
- Design a single-page executive scorecard and a detailed drill-down view`,
  },
  {
    id: 'cmd-net-debt-analysis',
    name: 'net-debt-analysis.md',
    path: 'commands/net-debt-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: net-debt-analysis
description: Net Debt Analysis
---

# /net-debt-analysis

## Tasks Required

- Collect total outstanding debt balances across all instruments (term loans, revolving credit facilities, bonds, convertible notes, capital leases)
- Gather cash, cash equivalents, and short-term investment balances from treasury
- Map each debt instrument to its maturity date, coupon rate, and amortization schedule
- Compute leverage ratios and compare against covenant thresholds and peer benchmarks
- Identify refinancing windows and upcoming maturity walls`,
  },
  {
    id: 'cmd-working-capital',
    name: 'working-capital.md',
    path: 'commands/working-capital.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: working-capital
description: Working Capital
---

# /working-capital

## Tasks Required

- Extract accounts receivable, inventory, and accounts payable balances for trailing 12 months
- Calculate DSO (Days Sales Outstanding), DIO (Days Inventory Outstanding), and DPO (Days Payable Outstanding) for each period
- Compute the Cash Conversion Cycle (CCC = DSO + DIO - DPO) and trend over time
- Benchmark working capital ratios against industry peers
- Identify actionable levers to release trapped working capital`,
  },
  {
    id: 'cmd-debt-schedule',
    name: 'debt-schedule.md',
    path: 'commands/debt-schedule.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: debt-schedule
description: Debt Schedule
---

# /debt-schedule

## Tasks Required

- Catalog every debt tranche with principal balance, interest rate, maturity date, and amortization terms
- Build a quarterly amortization schedule for each tranche showing beginning balance, interest, principal, and ending balance
- Aggregate across tranches to produce a consolidated debt service schedule
- Model the impact of interest rate changes on floating-rate tranches
- Highlight balloon payments, bullet maturities, and prepayment option dates`,
  },
  {
    id: 'cmd-dcf-valuation',
    name: 'dcf-valuation.md',
    path: 'commands/dcf-valuation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: dcf-valuation
description: DCF Valuation
---

# /dcf-valuation

## Tasks Required

- Build revenue and expense projections for a 5-year explicit forecast period
- Calculate unlevered free cash flow (FCF) for each projection year
- Estimate the weighted average cost of capital (WACC) using CAPM and market cost of debt
- Determine terminal value using both perpetuity growth and exit multiple methods
- Perform sensitivity analysis across key assumptions and present an implied valuation range`,
  },
  {
    id: 'cmd-budget-variance',
    name: 'budget-variance.md',
    path: 'commands/budget-variance.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: budget-variance
description: Budget Variance
---

# /budget-variance

## Tasks Required

- Extract actual financial results and approved budget figures for the reporting period
- Calculate variances at the department, cost center, and line item level
- Classify each variance as favorable or unfavorable and determine materiality
- Decompose material variances into volume, price, mix, and timing effects
- Prepare management commentary explaining root causes and corrective actions`,
  },
  {
    id: 'cmd-capex-tracker',
    name: 'capex-tracker.md',
    path: 'commands/capex-tracker.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: capex-tracker
description: CapEx Tracker
---

# /capex-tracker

## Tasks Required

- Catalog all approved capital expenditure projects with original budget, timeline, and sponsoring department
- Track spend-to-date, committed but unpaid amounts, and remaining budget for each project
- Categorize projects as growth CapEx, maintenance CapEx, or strategic investments
- Identify projects with cost overruns, schedule delays, or scope changes
- Calculate ROI, payback period, and NPV for completed and in-progress projects`,
  },
  {
    id: 'cmd-ebitda-bridge',
    name: 'ebitda-bridge.md',
    path: 'commands/ebitda-bridge.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: ebitda-bridge
description: EBITDA Bridge
---

# /ebitda-bridge

## Tasks Required

- Calculate EBITDA for both the current and prior comparison period
- Decompose the change in EBITDA into discrete driver categories: volume, price, cost, FX, and one-time items
- Separate organic growth from inorganic (M&A) contributions
- Normalize for non-recurring items and accounting adjustments
- Format results as a waterfall for executive presentation`,
  },
  {
    id: 'cmd-treasury-dashboard',
    name: 'treasury-dashboard.md',
    path: 'commands/treasury-dashboard.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: treasury-dashboard
description: Treasury Dashboard
---

# /treasury-dashboard

## Tasks Required

- Consolidate cash positions across all bank accounts, entities, and geographies
- Track daily cash inflows and outflows by category
- Monitor FX exposures and mark-to-market hedging positions
- Assess counterparty risk across banking relationships
- Forecast short-term liquidity needs over the next 30, 60, and 90 days`,
  },
  {
    id: 'cmd-scenario-modeling',
    name: 'scenario-modeling.md',
    path: 'commands/scenario-modeling.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: scenario-modeling
description: Scenario Modeling
---

# /scenario-modeling

## Tasks Required

- Define base, upside, and downside scenarios with clearly articulated assumption sets
- Build integrated P&L, balance sheet, and cash flow projections for each scenario
- Calculate key output metrics: revenue, EBITDA, net income, cash runway, and valuation for each case
- Identify breakeven points and cash-out dates under stress
- Present a decision matrix comparing scenarios for leadership`,
  },
  {
    id: 'cmd-m-and-a-screening',
    name: 'm-and-a-screening.md',
    path: 'commands/m-and-a-screening.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: m-and-a-screening
description: M&A Screening
---

# /m-and-a-screening

## Tasks Required

- Define acquisition screening criteria: revenue range, growth rate, geography, sector, profitability, and strategic fit parameters
- Source and filter potential targets from databases and market intelligence
- Estimate acquisition multiples and implied deal values for shortlisted targets
- Assess strategic fit, synergy potential, and integration complexity for top candidates
- Rank targets and produce a shortlist with supporting rationale`,
  },
  {
    id: 'cmd-dividend-analysis',
    name: 'dividend-analysis.md',
    path: 'commands/dividend-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: dividend-analysis
description: Dividend Analysis
---

# /dividend-analysis

## Tasks Required

- Calculate the current dividend payout ratio, dividend yield, and free cash flow coverage ratio
- Analyze historical dividend trends: growth rate, consistency, and special dividends
- Model forward dividend capacity under base, upside, and downside earnings scenarios
- Benchmark dividend policy against sector peers and comparable companies
- Recommend an optimal payout level balancing shareholder returns and reinvestment needs`,
  },
  {
    id: 'cmd-fx-exposure-report',
    name: 'fx-exposure-report.md',
    path: 'commands/fx-exposure-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: fx-exposure-report
description: FX Exposure Report
---

# /fx-exposure-report

## Tasks Required

- Map all currency exposures across revenue, cost of goods sold, operating expenses, and balance sheet items
- Quantify transactional FX risk (cash flows in foreign currencies) and translational FX risk (consolidation of foreign subsidiaries)
- Review current hedging positions and calculate coverage ratios by currency pair
- Model P&L impact under adverse currency movements of 5% and 10%
- Recommend hedging strategy adjustments with cost-benefit analysis`,
  },
  {
    id: 'cmd-covenant-compliance',
    name: 'covenant-compliance.md',
    path: 'commands/covenant-compliance.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: covenant-compliance
description: Covenant Compliance
---

# /covenant-compliance

## Tasks Required

- Compile all financial covenants from each credit facility and debt agreement
- Calculate the current value of each covenant ratio using the most recent financial data
- Measure headroom to covenant thresholds in both absolute and percentage terms
- Project forward covenant compliance under base and stress scenarios for the next 4 quarters
- Flag any covenants at risk of breach and recommend remediation actions`,
  },
  {
    id: 'cmd-investor-update',
    name: 'investor-update.md',
    path: 'commands/investor-update.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: investor-update
description: Investor Update
---

# /investor-update

## Tasks Required

- Compile key financial metrics for the quarter: revenue, ARR/MRR, EBITDA, cash balance, and burn rate
- Summarize major operational milestones: product launches, customer wins, partnerships, and team hires
- Provide market context: competitive landscape developments, regulatory changes, and macroeconomic factors
- Articulate the forward outlook: next quarter priorities, guidance, and capital deployment plans
- Draft a professional letter suitable for distribution to investors and board members`,
  },

  // Real estate
  {
    id: 'cmd-cam-reconciliation',
    name: 'cam-reconciliation.md',
    path: 'commands/cam-reconciliation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: cam-reconciliation
description: CAM Reconciliation
---

# /cam-reconciliation

## Tasks Required

- Collect actual year-end operating expense invoices and GL detail for each property
- Pull estimated CAM budgets and monthly billing schedules from lease abstracts
- Calculate each tenant's pro-rata share based on GLA or NRA occupancy
- Compare estimated billings to actual costs and compute over/under amounts per tenant
- Generate reconciliation statements and credit/debit memos for distribution`,
  },
  {
    id: 'cmd-noi-analysis',
    name: 'noi-analysis.md',
    path: 'commands/noi-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: noi-analysis
description: NOI Analysis
---

# /noi-analysis

## Tasks Required

- Compile gross potential rent (GPR) from rent roll data for each property
- Calculate effective gross income (EGI) by adjusting for vacancy, concessions, and other income
- Aggregate operating expenses by category from the property GL
- Compute NOI, NOI margin, and NOI per square foot
- Compare results to prior periods, budget, and market benchmarks`,
  },
  {
    id: 'cmd-rent-roll-review',
    name: 'rent-roll-review.md',
    path: 'commands/rent-roll-review.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: rent-roll-review
description: Rent Roll Review
---

# /rent-roll-review

## Tasks Required

- Extract current rent roll data from the property management system for each asset
- Compile tenant roster with suite, GLA, lease dates, base rent, escalation schedule, and options
- Calculate portfolio-level metrics: occupancy, WALT, average rent PSF, and in-place vs. market rent
- Map lease expiration schedule and identify rollover concentration risk
- Flag below-market leases and quantify mark-to-market upside`,
  },
  {
    id: 'cmd-cap-rate-analysis',
    name: 'cap-rate-analysis.md',
    path: 'commands/cap-rate-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: cap-rate-analysis
description: Cap Rate Analysis
---

# /cap-rate-analysis

## Tasks Required

- Calculate going-in cap rate for each property using stabilized NOI and acquisition price or current appraised value
- Gather market cap rate comps by property type, class, and submarket
- Analyze cap rate trends over the trailing 3-5 year period
- Estimate implied property values under varying cap rate assumptions
- Assess portfolio-level weighted average cap rate`,
  },
  {
    id: 'cmd-lease-abstracting',
    name: 'lease-abstracting.md',
    path: 'commands/lease-abstracting.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: lease-abstracting
description: Lease Abstracting
---

# /lease-abstracting

## Tasks Required

- Obtain executed lease documents including all amendments, addenda, and side letters
- Extract key financial terms: base rent, escalations, percentage rent, CAM/tax/insurance recovery structure
- Capture tenant rights: renewal options, expansion options, termination rights, ROFO/ROFR, co-tenancy
- Document landlord obligations: TI allowance, free rent, capital repair responsibilities, exclusivity
- Organize extracted terms into a standardized abstract template for portfolio tracking`,
  },
  {
    id: 'cmd-property-valuation',
    name: 'property-valuation.md',
    path: 'commands/property-valuation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-valuation
description: Property Valuation
---

# /property-valuation

## Tasks Required

- Gather property-level financial data: rent roll, operating statements, and capital expenditure history
- Perform income approach valuation using direct capitalization and DCF analysis (10-year hold)
- Perform sales comparison approach with adjusted comparable transactions
- Perform cost approach estimating replacement cost new less depreciation plus land value
- Reconcile the three approaches and present a value conclusion with confidence range`,
  },
  {
    id: 'cmd-tenant-credit-review',
    name: 'tenant-credit-review.md',
    path: 'commands/tenant-credit-review.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: tenant-credit-review
description: Tenant Credit Review
---

# /tenant-credit-review

## Tasks Required

- Collect tenant financial statements (income statement, balance sheet, cash flow) for the trailing 2-3 years
- Pull commercial credit reports and scores from reporting agencies
- Analyze payment history from the property management system
- Calculate key financial ratios and compare to industry benchmarks
- Assign an internal credit rating and recommend appropriate lease security provisions`,
  },
  {
    id: 'cmd-construction-draw',
    name: 'construction-draw.md',
    path: 'commands/construction-draw.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: construction-draw
description: Construction Draw
---

# /construction-draw

## Tasks Required

- Receive and log draw request from contractor with schedule of values and completion percentages
- Verify percentage completion by trade against site inspection reports and photographs
- Collect and validate conditional and unconditional lien waivers from all subcontractors and suppliers
- Reconcile draw request to approved budget and track cumulative costs by line item
- Calculate retainage, remaining budget, and contingency balance; flag overruns and schedule variances`,
  },
  {
    id: 'cmd-deal-underwriting',
    name: 'deal-underwriting.md',
    path: 'commands/deal-underwriting.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: deal-underwriting
description: Deal Underwriting
---

# /deal-underwriting

## Tasks Required

- Gather property-level data: rent roll, T-12 operating statements, capital expenditure history, and offering memorandum
- Model acquisition cost basis: purchase price, closing costs, capex budget, and TI/LC reserves
- Structure capital stack: senior debt terms (LTV, rate, amortization, IO period), mezzanine or preferred equity, and sponsor equity
- Build a multi-year pro forma: project rental income with lease-up, market rent growth, vacancy, and operating expenses
- Calculate investment returns: levered and unlevered IRR, equity multiple, cash-on-cash yield, and MOIC
- Perform sensitivity and scenario analysis on key assumptions`,
  },
  {
    id: 'cmd-opex-benchmarking',
    name: 'opex-benchmarking.md',
    path: 'commands/opex-benchmarking.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: opex-benchmarking
description: OpEx Benchmarking
---

# /opex-benchmarking

## Tasks Required

- Extract operating expense data by category for each property from the property management system
- Normalize expenses to per-square-foot (PSF) and per-unit metrics for cross-property comparison
- Compile industry benchmark data by property type, class, region, and age
- Identify properties and expense categories with above-benchmark costs
- Analyze 3-5 year expense trends and recommend cost reduction initiatives`,
  },
  {
    id: 'cmd-portfolio-performance',
    name: 'portfolio-performance.md',
    path: 'commands/portfolio-performance.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: portfolio-performance
description: Portfolio Performance
---

# /portfolio-performance

## Tasks Required

- Aggregate property-level financial and operational data across the entire portfolio
- Calculate total returns: income return (cash yield) plus capital appreciation
- Track key operational metrics: occupancy, retention rate, leasing velocity, and WALT
- Compute same-store NOI growth to isolate organic performance from acquisitions/dispositions
- Provide return attribution by property type, geography, vintage year, and investment strategy`,
  },
  {
    id: 'cmd-re-debt-financing',
    name: 're-debt-financing.md',
    path: 'commands/re-debt-financing.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: re-debt-financing
description: RE Debt Financing
---

# /re-debt-financing

## Tasks Required

- Collect lender term sheets and quotes for the subject property or portfolio
- Analyze and compare loan structures: LTV, DSCR, rate, amortization, IO period, and prepayment provisions
- Model debt service cash flows under fixed, floating, and interest-only scenarios
- Evaluate refinancing opportunities for existing loans approaching maturity
- Prepare a debt comparison matrix and financing recommendation for investment committee`,
  },
  {
    id: 'cmd-market-survey',
    name: 'market-survey.md',
    path: 'commands/market-survey.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: market-survey
description: Market Survey
---

# /market-survey

## Tasks Required

- Define the target submarket boundaries and competitive set of comparable properties
- Gather current rental comps: asking rents, effective rents, concession packages by property class
- Compile vacancy rates, absorption trends, and inventory statistics for the submarket
- Research the new supply pipeline: planned, under construction, and recently delivered projects
- Assess demand drivers: employment growth, population trends, major employers, and infrastructure projects`,
  },

  // Accounting
  {
    id: 'cmd-invoice-processing',
    name: 'invoice-processing.md',
    path: 'commands/invoice-processing.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: invoice-processing
description: Invoice Processing
---

# /invoice-processing

## Tasks Required

- Retrieve incoming vendor invoices from email, portal, or AP inbox
- Perform 3-way match: invoice to purchase order to receiving document
- Validate GL account coding, cost center allocation, and tax treatment
- Check for duplicate invoices by vendor, amount, invoice number, and date
- Route through approval workflow based on dollar thresholds and delegation of authority
- Resolve pricing, quantity, and terms discrepancies with purchasing and vendors
- Post approved invoices to the AP subledger and schedule for payment`,
  },
  {
    id: 'cmd-month-end-close',
    name: 'month-end-close.md',
    path: 'commands/month-end-close.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: month-end-close
description: Month-End Close
---

# /month-end-close

## Tasks Required

- Execute close checklist tasks in sequence with owner assignments and deadlines
- Record accruals for incurred-but-not-invoiced expenses (IBNI) and earned-but-unbilled revenue
- Amortize prepaid expenses and recognize deferred revenue per schedules
- Post standard recurring journal entries (depreciation, amortization, allocations)
- Record non-standard adjusting entries with supporting documentation
- Reconcile all balance sheet accounts to subledgers and third-party statements
- Perform flux analysis on P&L line items vs. budget and prior period
- Prepare close package with management commentary for controller review`,
  },
  {
    id: 'cmd-bank-reconciliation',
    name: 'bank-reconciliation.md',
    path: 'commands/bank-reconciliation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: bank-reconciliation
description: Bank Reconciliation
---

# /bank-reconciliation

## Tasks Required

- Obtain month-end bank statements for all cash accounts and entities
- Match bank transactions to GL entries using amount, date, and reference
- Identify and list outstanding checks not yet cleared by the bank
- Identify and list deposits in transit recorded in GL but not on bank statement
- Investigate and resolve unmatched or unreconciled items
- Record adjusting entries for bank fees, interest, and errors
- Age outstanding items and escalate stale-dated checks (> 90 days)`,
  },
  {
    id: 'cmd-ar-aging-report',
    name: 'ar-aging-report.md',
    path: 'commands/ar-aging-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: ar-aging-report
description: AR Aging Report
---

# /ar-aging-report

## Tasks Required

- Extract accounts receivable open items from the AR subledger as of period end
- Bucket outstanding invoices into aging categories: current, 1-30, 31-60, 61-90, 90+ days past due
- Calculate Days Sales Outstanding (DSO) and compare to target and prior periods
- Identify top delinquent accounts by balance and days overdue
- Assess collectibility and estimate bad debt reserve (allowance for doubtful accounts)
- Prepare collection action recommendations by account and aging bucket
- Reconcile AR subledger total to GL control account`,
  },
  {
    id: 'cmd-ap-aging-report',
    name: 'ap-aging-report.md',
    path: 'commands/ap-aging-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: ap-aging-report
description: AP Aging Report
---

# /ap-aging-report

## Tasks Required

- Extract accounts payable open items from the AP subledger as of period end
- Bucket outstanding payables by current, 1-30, 31-60, 61-90, and 90+ days
- Calculate Days Payable Outstanding (DPO) and compare to target and peers
- Identify invoices eligible for early payment discounts and calculate capture savings
- Flag overdue invoices at risk of late fees, vendor holds, or relationship damage
- Reconcile AP subledger total to GL AP control account
- Prepare cash requirements forecast based on AP aging and payment terms`,
  },
  {
    id: 'cmd-revenue-recognition',
    name: 'revenue-recognition.md',
    path: 'commands/revenue-recognition.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: revenue-recognition
description: Revenue Recognition
---

# /revenue-recognition

## Tasks Required

- Identify all revenue contracts executed or modified during the period
- Apply ASC 606 five-step model to each contract
- Identify distinct performance obligations within multi-element arrangements
- Determine transaction price including variable consideration and constraints
- Allocate transaction price to performance obligations using standalone selling prices
- Determine timing of recognition: point-in-time vs. over-time for each obligation
- Record revenue journal entries and update deferred revenue and unbilled AR schedules
- Document significant judgments and estimates for audit support`,
  },
  {
    id: 'cmd-fixed-asset-register',
    name: 'fixed-asset-register.md',
    path: 'commands/fixed-asset-register.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: fixed-asset-register
description: Fixed Asset Register
---

# /fixed-asset-register

## Tasks Required

- Record all asset additions with acquisition cost, date, useful life, and location
- Process asset disposals and retirements: calculate gain or loss on disposal
- Record asset transfers between departments, locations, or entities
- Calculate monthly/quarterly depreciation by asset and method
- Reconcile fixed asset subledger net book value (NBV) to GL control accounts
- Perform periodic physical inventory of fixed assets and reconcile to register
- Identify and evaluate assets for impairment under ASC 360`,
  },
  {
    id: 'cmd-intercompany-recon',
    name: 'intercompany-recon.md',
    path: 'commands/intercompany-recon.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: intercompany-recon
description: Intercompany Recon
---

# /intercompany-recon

## Tasks Required

- Extract intercompany receivable and payable balances for all entities as of period end
- Match intercompany invoices, payments, and cost allocations across entity pairs
- Identify and age unmatched or disputed intercompany items
- Investigate root causes of imbalances: timing differences, FX, posting errors
- Calculate and post intercompany elimination entries for consolidation
- Enforce intercompany settlement SLAs and escalate aged disputes
- Reconcile intercompany loan balances and interest accruals`,
  },
  {
    id: 'cmd-tax-provision',
    name: 'tax-provision.md',
    path: 'commands/tax-provision.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: tax-provision
description: Tax Provision
---

# /tax-provision

## Tasks Required

- Calculate pre-tax book income with permanent and temporary difference adjustments
- Compute current federal, state, and foreign income tax expense
- Determine deferred tax assets (DTAs) and deferred tax liabilities (DTLs) from temporary differences
- Assess the need for a valuation allowance on deferred tax assets
- Prepare the effective tax rate (ETR) reconciliation from statutory to effective rate
- Calculate estimated quarterly tax payments using the annualized income method
- Document uncertain tax positions under ASC 740-10 (FIN 48)`,
  },
  {
    id: 'cmd-gl-account-recon',
    name: 'gl-account-recon.md',
    path: 'commands/gl-account-recon.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: gl-account-recon
description: GL Account Recon
---

# /gl-account-recon

## Tasks Required

- Identify all GL accounts requiring reconciliation based on materiality and risk assessment
- Obtain supporting detail for each account: subledger, third-party statement, or schedule
- Compare GL balance to supporting detail and identify reconciling items
- Investigate and resolve differences exceeding materiality thresholds
- Document reconciling items with expected clearance dates and responsible parties
- Obtain preparer and reviewer sign-off per internal control requirements
- Escalate aged or unexplained reconciling items to management`,
  },
  {
    id: 'cmd-expense-report-audit',
    name: 'expense-report-audit.md',
    path: 'commands/expense-report-audit.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: expense-report-audit
description: Expense Report Audit
---

# /expense-report-audit

## Tasks Required

- Select expense reports for audit using risk-based sampling methodology
- Verify that all required receipts and documentation are attached
- Validate that expenses comply with corporate travel and expense policy
- Check proper manager approval per delegation of authority matrix
- Verify GL account and cost center coding accuracy
- Flag out-of-policy items: over per diem, luxury upgrades, personal expenses, split transactions
- Calculate correct reimbursement amounts after policy adjustments
- Report audit findings and compliance metrics to management`,
  },
  {
    id: 'cmd-lease-accounting',
    name: 'lease-accounting.md',
    path: 'commands/lease-accounting.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: lease-accounting
description: Lease Accounting
---

# /lease-accounting

## Tasks Required

- Identify and inventory all operating and finance leases across the organization
- Classify each lease as operating or finance under ASC 842 criteria
- Calculate right-of-use (ROU) asset and lease liability at commencement
- Build amortization schedules for ROU asset and lease liability over the lease term
- Process lease modifications, remeasurements, reassessments, and early terminations
- Record monthly journal entries for lease expense and liability reduction
- Prepare ASC 842 disclosure schedules for financial statement footnotes
- Maintain lease data abstracts with key terms and critical dates`,
  },
  {
    id: 'cmd-financial-consolidation',
    name: 'financial-consolidation.md',
    path: 'commands/financial-consolidation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: financial-consolidation
description: Financial Consolidation
---

# /financial-consolidation

## Tasks Required

- Collect trial balances from all subsidiaries and reporting units
- Map subsidiary charts of accounts to the consolidated chart of accounts
- Convert foreign subsidiary financials to the reporting currency (ASC 830)
- Post intercompany elimination entries for transactions and investments
- Calculate and record minority interest (noncontrolling interest) adjustments
- Record equity method investment adjustments for unconsolidated affiliates
- Produce consolidated financial statements: income statement, balance sheet, cash flow, equity
- Perform top-side consolidating adjustments and management reclassifications`,
  },
  {
    id: 'cmd-audit-preparation',
    name: 'audit-preparation.md',
    path: 'commands/audit-preparation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: audit-preparation
description: Audit Preparation
---

# /audit-preparation

## Tasks Required

- Obtain and organize the PBC (prepared by client) request list from external auditors
- Assign PBC items to responsible preparers with deadlines by audit area
- Ensure all balance sheet reconciliations are complete, reviewed, and signed off
- Compile supporting schedules: debt, leases, equity, revenue, and significant estimates
- Draft the management representation letter for executive signature
- Prepare financial statement footnote disclosures and supporting calculations
- Organize document repository for auditor access (virtual data room or shared folder)
- Coordinate audit fieldwork timeline, conference rooms, and system access`,
  },
  {
    id: 'cmd-sales-tax-compliance',
    name: 'sales-tax-compliance.md',
    path: 'commands/sales-tax-compliance.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: sales-tax-compliance
description: Sales Tax Compliance
---

# /sales-tax-compliance

## Tasks Required

- Extract sales transactions from the billing system for the filing period
- Classify each transaction as taxable, exempt, or non-taxable by jurisdiction
- Apply correct tax rates by state, county, city, and special district
- Calculate total tax collected, tax due, and any variance to reconcile
- Prepare and file sales/use tax returns for each jurisdiction by due date
- Remit tax payments and track confirmation numbers
- Monitor economic nexus thresholds (revenue and transaction count) by state
- Identify overpayments, credits, and refund opportunities from prior periods`,
  },

  // Real estate
  {
    id: 'cmd-lease-expiration-schedule',
    name: 'lease-expiration-schedule.md',
    path: 'commands/lease-expiration-schedule.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: lease-expiration-schedule
description: Lease Expiration Schedule
---

# /lease-expiration-schedule

## Tasks Required

- Extract all active leases with expiration dates, renewal options, and notice deadlines
- Map lease expirations by month and year for the next 5-10 year horizon
- Calculate percentage of GLA and percentage of annualized rent expiring each period
- Assign renewal probability estimates based on tenant credit, market conditions, and lease terms
- Quantify rollover risk: NOI at risk, downtime assumptions, and re-leasing cost estimates
- Identify concentration risk where multiple large tenants expire in the same period`,
  },
  {
    id: 'cmd-lease-abstract-summary',
    name: 'lease-abstract-summary.md',
    path: 'commands/lease-abstract-summary.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: lease-abstract-summary
description: Lease Abstract Summary
---

# /lease-abstract-summary

## Tasks Required

- Compile executed lease documents including all amendments, side letters, and commencement agreements
- Extract escalation clauses: fixed increases, CPI-based adjustments, and fair market value resets
- Document CAM caps, expense stops, and base year provisions per tenant
- Quantify TI obligations: allowance amounts, disbursement conditions, and amortization schedules
- Identify free rent periods, abatement structures, and burn-off schedules
- Catalog all option rights with critical notice deadlines`,
  },
  {
    id: 'cmd-property-operating-statement',
    name: 'property-operating-statement.md',
    path: 'commands/property-operating-statement.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-operating-statement
description: Property Operating Statement
---

# /property-operating-statement

## Tasks Required

- Compile monthly income detail: base rent, percentage rent, CAM recoveries, parking, and other income
- Aggregate operating expenses by category: taxes, insurance, utilities, R&M, janitorial, management fee, administrative
- Calculate NOI on a monthly and YTD basis for each property
- Compare actual results to budget and prior year with dollar and percentage variances
- Identify material variances and provide explanatory commentary
- Consolidate property-level statements into a portfolio-level summary`,
  },
  {
    id: 'cmd-property-budget-variance',
    name: 'property-budget-variance.md',
    path: 'commands/property-budget-variance.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-budget-variance
description: Property Budget Variance
---

# /property-budget-variance

## Tasks Required

- Extract actual income and expense results from the property GL for the reporting period
- Pull approved budget amounts by line item and property for the same period
- Pull prior year actual amounts for year-over-year comparison
- Calculate dollar and percentage variances: actual vs budget and actual vs prior year
- Identify root causes for material variances at the line-item level
- Prepare variance commentary and action recommendations for asset management review`,
  },
  {
    id: 'cmd-property-ar-aging',
    name: 'property-ar-aging.md',
    path: 'commands/property-ar-aging.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-ar-aging
description: Property AR Aging
---

# /property-ar-aging

## Tasks Required

- Extract tenant-level accounts receivable balances from the property management system
- Age outstanding balances into standard buckets: current, 30 days, 60 days, 90+ days
- Calculate delinquency rate by property: delinquent rent / total billings
- Assess cash flow impact of delinquencies on property-level NOI and debt service coverage
- Identify repeat offenders and tenants with deteriorating payment patterns
- Recommend collection actions: demand letters, late fee enforcement, lease default notices`,
  },
  {
    id: 'cmd-noi-trend-report',
    name: 'noi-trend-report.md',
    path: 'commands/noi-trend-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: noi-trend-report
description: NOI Trend Report
---

# /noi-trend-report

## Tasks Required

- Compile monthly and quarterly NOI for each property over the trailing 12-24 months
- Calculate period-over-period change: MoM, QoQ, and YoY NOI growth rates
- Decompose NOI changes into income-driven and expense-driven components
- Compute NOI margin trends and identify margin compression or expansion
- Compare NOI performance to budget and to peer/benchmark properties
- Project forward NOI trajectory based on known lease events and expense trends`,
  },
  {
    id: 'cmd-property-capex-report',
    name: 'property-capex-report.md',
    path: 'commands/property-capex-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-capex-report
description: Property CapEx Report
---

# /property-capex-report

## Tasks Required

- Compile approved capital expenditure budgets by property and project category
- Track actual CapEx spend against approved amounts with remaining balance
- Categorize spend: tenant improvements, building systems, roof, parking, elevator, common area upgrades
- Assess ROI impact of completed capital projects on property value and NOI
- Monitor project timelines and flag budget overruns or schedule delays
- Forecast remaining CapEx obligations for the current and next fiscal year`,
  },
  {
    id: 'cmd-dscr-report',
    name: 'dscr-report.md',
    path: 'commands/dscr-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: dscr-report
description: DSCR Report
---

# /dscr-report

## Tasks Required

- Calculate debt service coverage ratio (DSCR) for each financed property
- Compare actual DSCR to lender covenant requirements and identify breaches or near-breaches
- Analyze DSCR trends over the trailing 12 months to detect deterioration
- Stress test DSCR under adverse scenarios: vacancy increase, rent decline, expense escalation
- Compile loan-level detail: outstanding balance, interest rate, maturity, and amortization schedule
- Prepare lender reporting package with supporting calculations`,
  },
  {
    id: 'cmd-property-cash-flow-statement',
    name: 'property-cash-flow-statement.md',
    path: 'commands/property-cash-flow-statement.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-cash-flow-statement
description: Property Cash Flow Statement
---

# /property-cash-flow-statement

## Tasks Required

- Compile property-level NOI from the operating statement
- Deduct debt service (principal and interest) from NOI to calculate cash flow after debt service
- Deduct capital expenditures (TI, building CapEx, leasing commissions) from cash flow
- Calculate cash available for distribution to equity holders
- Compare actual distributions to projected returns and partnership agreement requirements
- Prepare a sources and uses reconciliation for the reporting period`,
  },
  {
    id: 'cmd-distribution-waterfall',
    name: 'distribution-waterfall.md',
    path: 'commands/distribution-waterfall.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: distribution-waterfall
description: Distribution Waterfall
---

# /distribution-waterfall

## Tasks Required

- Parse the partnership or operating agreement to extract the waterfall structure
- Calculate preferred return accrual and cumulative unpaid preferred return balance
- Determine which waterfall tier is currently active based on cumulative distributions
- Allocate distributable cash through each tier: preferred return, return of capital, catch-up, and promote
- Compute GP and LP allocation at each tier and in total
- Reconcile cumulative distributions to date against invested capital and return hurdles`,
  },
  {
    id: 'cmd-irr-and-equity-multiple-report',
    name: 'irr-and-equity-multiple-report.md',
    path: 'commands/irr-and-equity-multiple-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: irr-and-equity-multiple-report
description: IRR & Equity Multiple Report
---

# /irr-and-equity-multiple-report

## Tasks Required

- Compile the complete cash flow history for each investment: contributions, distributions, and current value
- Calculate gross and net IRR using actual cash flow dates and amounts
- Calculate equity multiple: total value (distributions + current value) / total invested capital
- Separate realized returns (from distributions) and unrealized returns (from current asset value)
- Compare actual returns to underwritten projections and partnership return targets
- Benchmark returns against relevant indices and peer funds`,
  },
  {
    id: 'cmd-cam-recoverability-matrix',
    name: 'cam-recoverability-matrix.md',
    path: 'commands/cam-recoverability-matrix.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: cam-recoverability-matrix
description: CAM Recoverability Matrix
---

# /cam-recoverability-matrix

## Tasks Required

- Extract all recoverable and non-recoverable expense categories from each lease
- Build a tenant-by-expense-category matrix showing recoverability status
- Identify gaps where expenses are incurred but not recoverable under any lease
- Calculate total recoverable amount vs total operating expenses to determine landlord exposure
- Assess the impact of CAM caps, exclusions, and gross-up provisions on recoverability
- Recommend lease language improvements for future negotiations to close recovery gaps`,
  },
  {
    id: 'cmd-lease-compliance-report',
    name: 'lease-compliance-report.md',
    path: 'commands/lease-compliance-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: lease-compliance-report
description: Lease Compliance Report
---

# /lease-compliance-report

## Tasks Required

- Audit tenant billing accuracy: verify base rent, escalations, and recovery charges match lease terms
- Verify escalation enforcement: confirm annual increases were applied on schedule at the correct rate
- Track option exercise deadlines: renewal, expansion, termination, and ROFO/ROFR notice dates
- Monitor co-tenancy and exclusive use clause compliance across the tenant roster
- Identify billing errors, missed escalations, and under-collected amounts for correction
- Prepare a compliance scorecard for asset management and investor reporting`,
  },
  {
    id: 'cmd-insurance-compliance-report',
    name: 'insurance-compliance-report.md',
    path: 'commands/insurance-compliance-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: insurance-compliance-report
description: Insurance Compliance Report
---

# /insurance-compliance-report

## Tasks Required

- Extract insurance requirements from each lease: coverage types, minimum limits, and additional insured provisions
- Collect current certificates of insurance (COIs) from all tenants
- Compare COI coverage to lease requirements and identify gaps or deficiencies
- Track COI expiration dates and flag upcoming renewals requiring updated certificates
- Monitor additional insured and waiver of subrogation endorsement compliance
- Generate non-compliance notices for tenants with missing or insufficient coverage`,
  },
  {
    id: 'cmd-property-tax-reconciliation',
    name: 'property-tax-reconciliation.md',
    path: 'commands/property-tax-reconciliation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: property-tax-reconciliation
description: Property Tax Reconciliation
---

# /property-tax-reconciliation

## Tasks Required

- Compile assessed values, tax rates, and actual tax bills for each property
- Compare assessed values to budgeted and appraised values to identify assessment discrepancies
- Reconcile actual tax payments to budgeted amounts and to lender escrow disbursements
- Track tax appeal status, deadlines, and potential refund amounts
- Analyze effective tax rate trends and compare to comparable properties in the jurisdiction
- Project next-year tax liability based on reassessment indicators and millage rate changes`,
  },
  {
    id: 'cmd-tenant-sales-report',
    name: 'tenant-sales-report.md',
    path: 'commands/tenant-sales-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: tenant-sales-report
description: Tenant Sales Report
---

# /tenant-sales-report

## Tasks Required

- Collect monthly and annual gross sales figures from percentage rent tenants
- Compare reported sales to lease breakpoints and calculate percentage rent owed
- Analyze sales trends by tenant: MoM, YoY, and same-store growth
- Benchmark tenant sales PSF against category averages and mall/center performance
- Identify tenants performing below breakpoint and assess viability risk
- Verify sales reporting compliance with lease audit rights provisions`,
  },
  {
    id: 'cmd-mark-to-market-analysis',
    name: 'mark-to-market-analysis.md',
    path: 'commands/mark-to-market-analysis.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: mark-to-market-analysis
description: Mark-to-Market Analysis
---

# /mark-to-market-analysis

## Tasks Required

- Extract in-place rent for every lease from the current rent roll
- Gather current market asking and effective rents by submarket, property type, and class
- Calculate the rent spread: in-place rent minus market rent for each tenant on a PSF basis
- Quantify total mark-to-market opportunity: aggregate positive spread (upside) and negative spread (risk)
- Assess reversion timing based on lease expiration schedule and renewal probability
- Estimate the NOI and value impact of marking all leases to market at expiration`,
  },
  {
    id: 'cmd-break-even-occupancy',
    name: 'break-even-occupancy.md',
    path: 'commands/break-even-occupancy.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: break-even-occupancy
description: Break-Even Occupancy
---

# /break-even-occupancy

## Tasks Required

- Compile fixed costs for each property: debt service (P&I), fixed operating expenses, and required reserves
- Identify variable costs that scale with occupancy: utilities, janitorial, management fee (if percentage-based)
- Calculate the revenue per occupied square foot based on current rent roll and recovery income
- Determine the minimum occupancy level required to cover all fixed obligations
- Compare break-even occupancy to current actual occupancy to assess the safety margin
- Stress test break-even under varying rent, expense, and debt scenarios`,
  },
  {
    id: 'cmd-tenant-concentration-report',
    name: 'tenant-concentration-report.md',
    path: 'commands/tenant-concentration-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: tenant-concentration-report
description: Tenant Concentration Report
---

# /tenant-concentration-report

## Tasks Required

- Rank all tenants by annualized base rent contribution and by GLA occupied
- Calculate concentration metrics: top 1, top 5, top 10, and top 20 tenant share of total rent and GLA
- Compute the Herfindahl-Hirschman Index (HHI) for portfolio diversification measurement
- Assess credit quality distribution across the tenant base
- Evaluate industry sector concentration to identify correlated default risk
- Compare concentration metrics to institutional investor guidelines and fund-level thresholds`,
  },
  {
    id: 'cmd-walt-report',
    name: 'walt-report.md',
    path: 'commands/walt-report.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: walt-report
description: WALT Report
---

# /walt-report

## Tasks Required

- Calculate weighted average lease term (WALT) by annualized rent and by GLA for each property
- Segment WALT by tenant size, credit quality, and property type
- Analyze WALT trend over time as leases expire and new leases commence
- Assess expiration risk weighting: combine WALT with renewal probability for a risk-adjusted metric
- Compare WALT to market benchmarks and investor expectations
- Project forward WALT under various leasing assumptions`,
  },

  // Data engineering
  {
    id: 'cmd-document-abstraction-engine',
    name: 'document-abstraction-engine.md',
    path: 'commands/document-abstraction-engine.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: document-abstraction-engine
description: Document Abstraction Engine
---

# /document-abstraction-engine

## Tasks Required

- Ingest unstructured documents (PDF, DOCX, scanned images) from finance, legal, and operations
- Apply OCR and layout analysis to extract text, tables, and key-value pairs from each document
- Classify documents by type: invoice, contract, lease, financial statement, board resolution, tax form
- Extract structured fields per document type using configurable extraction templates
- Validate extracted data against business rules and flag low-confidence extractions for human review
- Write normalized output to the target data warehouse or staging tables`,
  },
  {
    id: 'cmd-etl-pipeline-builder',
    name: 'etl-pipeline-builder.md',
    path: 'commands/etl-pipeline-builder.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: etl-pipeline-builder
description: ETL Pipeline Builder
---

# /etl-pipeline-builder

## Tasks Required

- Design extract-transform-load pipelines for financial and operational data sources
- Define source connections: ERP, CRM, billing, banking, HRIS, and third-party APIs
- Specify transformation logic: cleansing, deduplication, type casting, currency conversion, and business rule application
- Map source fields to the target dimensional model (facts and dimensions)
- Implement incremental load strategies: CDC, watermark columns, or full refresh with merge
- Build error handling, retry logic, and dead-letter queues for failed records
- Schedule orchestration with dependency management across pipeline stages`,
  },
  {
    id: 'cmd-sql-query-generator',
    name: 'sql-query-generator.md',
    path: 'commands/sql-query-generator.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: sql-query-generator
description: SQL Query Generator
---

# /sql-query-generator

## Tasks Required

- Translate natural-language financial questions into optimized SQL queries against the data warehouse
- Resolve entity references: map business terms (revenue, EBITDA, headcount) to the correct tables and columns
- Apply appropriate joins across fact and dimension tables based on the query context
- Include standard filters: date ranges, entity hierarchies, currency, and elimination entries
- Optimize query performance: partition pruning, predicate pushdown, and materialized view usage
- Format results for downstream consumption: pivot, rank, window functions, and CTEs`,
  },

  // Data architecture
  {
    id: 'cmd-data-catalog-and-lineage',
    name: 'data-catalog-and-lineage.md',
    path: 'commands/data-catalog-and-lineage.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: data-catalog-and-lineage
description: Data Catalog & Lineage
---

# /data-catalog-and-lineage

## Tasks Required

- Inventory all data assets across the finance data ecosystem: tables, views, models, and reports
- Document each asset: description, owner, refresh frequency, grain, and primary/foreign keys
- Map end-to-end data lineage from source systems through transformations to final reports
- Classify data sensitivity: PII, financial confidential, SOX-relevant, and publicly reportable
- Track schema changes and assess downstream impact before migrations or refactors
- Maintain a searchable business glossary linking business terms to physical assets`,
  },

  // Data engineering
  {
    id: 'cmd-data-quality-framework',
    name: 'data-quality-framework.md',
    path: 'commands/data-quality-framework.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: data-quality-framework
description: Data Quality Framework
---

# /data-quality-framework

## Tasks Required

- Define data quality dimensions for financial data: accuracy, completeness, timeliness, consistency, and uniqueness
- Implement automated quality checks at ingestion, transformation, and presentation layers
- Build anomaly detection for key financial metrics: revenue, expenses, balances, and ratios
- Create data quality scorecards for each critical data asset and pipeline
- Establish remediation workflows for quality exceptions with SLA tracking
- Monitor and report on data quality trends to identify systemic issues`,
  },

  // Data architecture
  {
    id: 'cmd-dimensional-model-designer',
    name: 'dimensional-model-designer.md',
    path: 'commands/dimensional-model-designer.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: dimensional-model-designer
description: Dimensional Model Designer
---

# /dimensional-model-designer

## Tasks Required

- Analyze financial reporting requirements and map to a star or snowflake schema design
- Define fact tables for key business processes: journal entries, invoices, payments, budgets, and forecasts
- Design conformed dimensions: date, account, entity, cost center, vendor, customer, and currency
- Specify grain, measures, and aggregation rules for each fact table
- Implement slowly changing dimensions (SCD Type 1/2/3) for historical tracking
- Document the model with ERD diagrams, grain statements, and business rule annotations`,
  },

  // Data science
  {
    id: 'cmd-ai-anomaly-detection',
    name: 'ai-anomaly-detection.md',
    path: 'commands/ai-anomaly-detection.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: ai-anomaly-detection
description: AI Anomaly Detection
---

# /ai-anomaly-detection

## Tasks Required

- Deploy ML-based anomaly detection across financial transaction streams and metric time series
- Train models on historical patterns: journal entries, vendor payments, expense claims, and revenue streams
- Detect statistical outliers, pattern breaks, and emerging trends before they appear in standard reports
- Classify anomalies by risk tier: informational, review-required, and critical-escalation
- Integrate alerts into the finance workflow: Slack, email, and ticketing system notifications
- Build feedback loops so analysts can confirm or dismiss anomalies to improve model accuracy`,
  },

  // Data engineering
  {
    id: 'cmd-data-migration-playbook',
    name: 'data-migration-playbook.md',
    path: 'commands/data-migration-playbook.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: data-migration-playbook
description: Data Migration Playbook
---

# /data-migration-playbook

## Tasks Required

- Plan end-to-end data migration from legacy systems to the modern finance data stack
- Inventory source data assets: tables, files, reports, and undocumented spreadsheets
- Define mapping rules from legacy schemas to target dimensional model
- Build and execute data validation and reconciliation between source and target
- Manage cutover sequencing: parallel runs, data freeze windows, and rollback plans
- Document the migration for SOX compliance and audit trail requirements`,
  },

  // Data architecture
  {
    id: 'cmd-semantic-layer-configuration',
    name: 'semantic-layer-configuration.md',
    path: 'commands/semantic-layer-configuration.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: semantic-layer-configuration
description: Semantic Layer Configuration
---

# /semantic-layer-configuration

## Tasks Required

- Define a universal semantic layer that provides consistent metric definitions across all BI and reporting tools
- Map business metrics (revenue, EBITDA, working capital, burn rate) to their SQL computation logic
- Configure dimensions, hierarchies, and drill paths for self-service exploration
- Implement row-level and column-level security policies aligned with finance data access controls
- Ensure the semantic layer stays synchronized with the underlying warehouse schema
- Enable governed self-service: business users can explore without writing SQL while maintaining data consistency`,
  },

  // Data engineering
  {
    id: 'cmd-reverse-etl-and-data-activation',
    name: 'reverse-etl-and-data-activation.md',
    path: 'commands/reverse-etl-and-data-activation.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: reverse-etl-and-data-activation
description: Reverse ETL & Data Activation
---

# /reverse-etl-and-data-activation

## Tasks Required

- Push enriched data from the warehouse back into operational systems: CRM, ERP, email, and Slack
- Define sync configurations: which warehouse tables feed which operational destinations
- Map warehouse fields to destination system fields with transformation rules
- Implement sync schedules, change detection, and conflict resolution logic
- Build monitoring and alerting for sync failures, latency, and data drift
- Enable finance-triggered automations: alert on covenant breaches, flag overdue invoices, update CRM with payment status`,
  },

  // Ai
  {
    id: 'cmd-llm-finance-agent-builder',
    name: 'llm-finance-agent-builder.md',
    path: 'commands/llm-finance-agent-builder.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: llm-finance-agent-builder
description: LLM Finance Agent Builder
---

# /llm-finance-agent-builder

## Tasks Required

- Design and deploy LLM-powered agents that answer financial questions using the organization's own data
- Connect agents to the data warehouse, document store, and semantic layer as tool-callable data sources
- Implement retrieval-augmented generation (RAG) over financial documents: 10-Ks, board decks, policies, and memos
- Build guardrails: prevent hallucination on financial figures, enforce citation of source data, and restrict access by role
- Create agent workflows for recurring CFO tasks: variance commentary, board question prep, and audit inquiry responses
- Monitor agent accuracy, usage, and cost to optimize performance and manage API spend`,
  },

  // Data architecture
  {
    id: 'cmd-data-platform-cost-optimization',
    name: 'data-platform-cost-optimization.md',
    path: 'commands/data-platform-cost-optimization.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: data-platform-cost-optimization
description: Data Platform Cost Optimization
---

# /data-platform-cost-optimization

## Tasks Required

- Analyze compute and storage costs across the data platform: warehouse, ETL, BI, and ML infrastructure
- Attribute costs to business units, teams, and specific pipelines or queries
- Identify optimization opportunities: unused tables, expensive queries, over-provisioned warehouses, and redundant pipelines
- Implement cost controls: resource monitors, auto-suspend policies, and query governance
- Build chargeback or showback models for finance data platform consumption
- Forecast platform costs under growth scenarios and propose budget recommendations`,
  },

  // Geopolitical & Macro Risk
  {
    id: 'cmd-geopolitical-risk',
    name: 'geopolitical-risk.md',
    path: 'commands/geopolitical-risk.md',
    type: 'file',
    format: 'md',
    validationStatus: 'ok',
    content: `---
name: geopolitical-risk
description: Assess geopolitical risks and their impact on PE/VC portfolio companies \u2014 conflicts, sanctions, trade disputes, commodity shocks, and supply chain disruption
arguments:
  - name: scenario
    description: The geopolitical event, conflict, or risk scenario to analyze (e.g. "US-China trade war", "Middle East conflict", "Russia sanctions")
    required: true
---

# /geopolitical-risk \u2014 Geopolitical Risk Assessment

Analyze geopolitical events and quantify their impact on portfolio companies, fund performance, and CFO decision-making.

## Scenario

**\\\$ARGUMENTS**

## Instructions

### Step 1 \u2014 Initialize Workspace

- Run \\\`mkdir -p output _research\\\`
- Create \\\`_research/geo-risk-briefing.md\\\` for the situation overview
- Create \\\`_research/exposure-map.md\\\` for portfolio exposure tracking
- Create \\\`_research/gaps.md\\\` to track intelligence gaps

### Step 2 \u2014 Situation Intelligence Gathering

Research the geopolitical scenario using authoritative sources. Prioritize:

**Primary Intelligence Sources:**
- **Stratfor (Worldview)** \u2014 Geopolitical intelligence, mapping, forecasting, and scenario analysis
- **Reuters / BBC World News** \u2014 Real-time reporting of unfolding events and verified facts
- **Financial Times / Wall Street Journal** \u2014 Market reactions, policy analysis, and business impact
- **The Economist Intelligence Unit (EIU)** \u2014 Country risk ratings, political stability indices, and economic forecasts
- **ACLED (Armed Conflict Location & Event Data)** \u2014 Conflict event tracking and escalation patterns
- **International Crisis Group** \u2014 Conflict analysis and policy recommendations

**Macroeconomic & Market Data:**
- **Federal Reserve FRED** \u2014 Interest rates, GDP, inflation, trade balances
- **IMF World Economic Outlook** \u2014 Global growth forecasts and risk assessments
- **World Bank** \u2014 Development indicators, commodity price forecasts
- **OECD** \u2014 Trade policy, economic outlook, country reviews

**Commodity & Energy Intelligence:**
- **EIA (U.S. Energy Information Administration)** \u2014 Oil/gas supply, demand, and price forecasts
- **OPEC Monthly Oil Market Report** \u2014 Production quotas, compliance, spare capacity
- **Bloomberg Commodity Index** \u2014 Real-time commodity pricing and futures curves
- **S&P Global Commodity Insights** \u2014 Energy market analysis and shipping data

**Sanctions & Compliance:**
- **OFAC SDN List** \u2014 U.S. sanctions designations
- **EU Consolidated Sanctions List** \u2014 European restrictions
- **UN Security Council Sanctions** \u2014 International sanctions regimes
- **BIS Entity List** \u2014 U.S. export control restrictions

**Shipping & Trade:**
- **FreightWaves SONAR** \u2014 Shipping rates, route disruptions, port congestion
- **UN Comtrade** \u2014 International trade flow data
- **WTO Trade Monitoring** \u2014 Tariff schedules and trade dispute tracker

Document all sources with retrieval dates in \\\`_research/geo-risk-briefing.md\\\`.

### Step 3 \u2014 Identify Transmission Channels

Assess how the geopolitical event transmits risk through these channels:

\\\`\\\`\\\`markdown
## Transmission Channel Assessment

### 1. Energy & Commodities
| Factor | Current Level | Stress Scenario | Probability |
|--------|--------------|-----------------|-------------|
| Oil (Brent) | \\\$[X]/bbl | \\\$[X]/bbl (+X%) | [H/M/L] |
| Natural Gas | \\\$[X]/MMBtu | \\\$[X]/MMBtu (+X%) | [H/M/L] |
| [Other commodity] | \\\$[X] | \\\$[X] (+X%) | [H/M/L] |

### 2. Supply Chain
| Risk Factor | Affected Routes/Regions | Lead Time Impact | Alternative Sources |
|-------------|------------------------|-----------------|---------------------|
| [Route/chokepoint] | [Region] | +[X] days | [Alternatives] |

### 3. FX & Capital Markets
| Currency Pair | Current | Base Case | Stress Case | Portfolio Exposure |
|---------------|---------|-----------|-------------|-------------------|
| [CCY/USD] | [rate] | [rate] | [rate] | \\\$[X]M |

### 4. Regulatory & Sanctions
| Action | Probability | Affected Sectors | Portfolio Impact |
|--------|------------|-----------------|-----------------|
| [Sanction/regulation] | [H/M/L] | [Sectors] | [Description] |
\\\`\\\`\\\`

### Step 4 \u2014 Portfolio Exposure Mapping

For each portfolio company, score exposure across channels:

\\\`\\\`\\\`markdown
## Portfolio Exposure Heat Map

| Company | Energy | Supply Chain | FX | Credit | Regulatory | Overall |
|---------|--------|-------------|-----|--------|-----------|---------|
| [Co 1] | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] | [avg] |
| [Co 2] | [1-5] | [1-5] | [1-5] | [1-5] | [1-5] | [avg] |

### Scoring: 1 = Minimal | 2 = Low | 3 = Moderate | 4 = High | 5 = Critical

### Exposure Detail \u2014 [Highest Risk Company]
- **Direct exposure**: [Operations, customers, or suppliers in affected region]
- **Indirect exposure**: [Supply chain dependencies, commodity inputs, FX]
- **Revenue at risk**: \\\$[X]M ([X]% of total revenue)
- **Supplier concentration**: [X] of [Y] key suppliers in affected region
- **Mitigation in place**: [Existing hedges, alternative suppliers, insurance]
\\\`\\\`\\\`

### Step 5 \u2014 Scenario Stress Testing

Model three scenarios using the \\\`macro-impact\\\` skill:

\\\`\\\`\\\`markdown
## Scenario Definitions

| Parameter | De-escalation | Base Case | Escalation | Severe Escalation |
|-----------|--------------|-----------|------------|-------------------|
| Conflict duration | [X] months | [X] months | [X] months | [X]+ months |
| Oil price | \\\$[X]/bbl | \\\$[X]/bbl | \\\$[X]/bbl | \\\$[X]/bbl |
| Credit spreads | +[X]bps | +[X]bps | +[X]bps | +[X]bps |
| GDP impact | [X]% | [X]% | [X]% | [X]% |
| Probability | [X]% | [X]% | [X]% | [X]% |

## Portfolio Impact by Scenario

| Scenario | NAV Impact | IRR Impact | TVPI Impact | Key Driver |
|----------|-----------|------------|-------------|------------|
| De-escalation | [%] | [bps] | [X.Xx] | |
| Base Case | [%] | [bps] | [X.Xx] | |
| Escalation | [%] | [bps] | [X.Xx] | |
| Severe | [%] | [bps] | [X.Xx] | |
\\\`\\\`\\\`

### Step 6 \u2014 CFO Action Plan

Develop prioritized mitigation actions:

\\\`\\\`\\\`markdown
## CFO Action Items

### Immediate (0-2 weeks)
| Action | Owner | Cost | Risk Reduced | Priority |
|--------|-------|------|-------------|----------|
| [Action 1] | [Role] | \\\$[X] | [Description] | Critical |

### Short-Term (2-8 weeks)
| Action | Owner | Cost | Risk Reduced | Priority |
|--------|-------|------|-------------|----------|

### Medium-Term (2-6 months)
| Action | Owner | Cost | Risk Reduced | Priority |
|--------|-------|------|-------------|----------|

### Monitoring & Escalation
- **Daily**: [What to watch]
- **Weekly**: [What to report]
- **Trigger for escalation**: [Specific thresholds]
\\\`\\\`\\\`

### Step 7 \u2014 Write Output

1. Save the full analysis to \\\`_research/geo-risk-briefing.md\\\`
2. Save the exposure map to \\\`_research/exposure-map.md\\\`
3. Generate the executive briefing document in \\\`output/\\\`

## Critical Rules

- Always cite the source and date for every geopolitical intelligence claim
- Distinguish between confirmed facts, assessed likely, and speculative scenarios
- Never present a single scenario as certain \u2014 always show a range
- Quantify impact in dollar terms wherever possible \u2014 avoid vague language like "significant"
- Separate direct exposure (operations in affected region) from indirect exposure (supply chain, customers, FX)
- Include de-escalation scenarios, not just downside \u2014 geopolitical events can reverse
- Every risk must have a corresponding mitigation action
- State confidence levels: High (multiple corroborating sources), Medium (single credible source), Low (analyst assessment)`,
  },
];
