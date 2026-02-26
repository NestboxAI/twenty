import { type AnalyxSkill } from './AnalyxTypes';

export const DEFAULT_SKILLS: AnalyxSkill[] = [
  // CFO / General Finance
  {
    id: 'default-revenue-analysis',
    name: 'Revenue Analysis',
    description: `### Tasks Required
- Pull consolidated revenue data for the trailing 12 months and current period
- Segment revenue by product line, geography, customer cohort, and contract type
- Calculate period-over-period growth rates at each segmentation level
- Identify seasonality patterns using 3-year historical comparison
- Assess customer concentration risk (top 10/25/50 customers as % of total)
- Compare realized revenue vs. plan and vs. prior year
- Flag any one-time or non-recurring revenue items for normalization

### Data Sources
- **ERP / General Ledger** (NetSuite, SAP, QuickBooks) — revenue journal entries by account, entity, and period
- **CRM** (Salesforce, Twenty CRM) — closed-won deals, pipeline stages, customer metadata
- **Billing Platform** (Stripe, Chargebee, Zuora) — invoice-level detail, subscription schedules, usage records
- **Data Warehouse** (Snowflake, BigQuery) — historical revenue tables, product catalog mapping
- **Budget Model** (Adaptive, Anaplan, Excel) — approved plan by segment for variance analysis

### Computation Process
1. Extract revenue transactions from the GL and map to the standard chart of accounts
2. Enrich each transaction with product line, geography, and customer cohort dimensions from the CRM and billing system
3. Aggregate into a revenue cube: rows = segments, columns = periods (monthly and quarterly)
4. Compute YoY, QoQ, and MoM growth rates; calculate CAGR for multi-year trends
5. Run a seasonal decomposition (additive or multiplicative) across 36 months of history
6. Rank customers by revenue contribution and compute cumulative concentration curves
7. Calculate variance to budget (actual minus plan) and prior year at each segment level
8. Normalize for one-time items and FX effects to derive organic growth rates

### Output Structure
- **Executive Summary**: Top-line revenue, total growth rate, and 3 key takeaways
- **Segment Detail**: Revenue by product, geography, and cohort with growth rates
- **Seasonality Analysis**: Monthly indices and expected seasonal peaks and troughs
- **Concentration Risk**: Herfindahl index, top-10 customer dependency chart
- **Variance Bridge**: Waterfall from budget to actual with labeled drivers
- **Trend Outlook**: Forward-looking commentary based on pipeline and bookings momentum

### Required Sub-Skills
- **Expense Breakdown**: Needed to compute gross margin by revenue segment
- **Unit Economics**: Provides per-customer revenue metrics and cohort retention rates
- **KPI Dashboard**: Supplies MRR, ARR, and net revenue retention for SaaS segments

### MCP Services & Integrations
- **NetSuite / SAP API**: Pull GL trial balance and revenue subledger detail
- **Salesforce / Twenty CRM API**: Retrieve closed-won opportunity data and account hierarchy
- **Stripe / Chargebee API**: Fetch invoice-level billing data, subscription MRR, and churn events
- **Snowflake / BigQuery Connector**: Query historical revenue tables for trend analysis
- **Google Sheets / Excel Online**: Read and write budget model data for variance calculations`,
    tags: ['finance', 'cfo', 'revenue', 'fp&a', 'reporting'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-cash-flow-forecast',
    name: 'Cash Flow Forecast',
    description: `### Tasks Required
- Compile a 13-week rolling cash flow model segmented by operating, investing, and financing activities
- Map all recurring cash inflows: customer collections, subscription payments, interest income
- Map all recurring cash outflows: payroll, rent, vendor payments, debt service, tax installments
- Overlay non-recurring items: capital expenditures, one-time settlements, milestone payments
- Build three scenarios: base case, downside (delayed AR + accelerated AP), and upside (early collections)
- Identify weeks where projected cash balance falls below the minimum liquidity threshold
- Reconcile the forecast opening balance to the most recent bank statement

### Data Sources
- **Bank Feeds** (Plaid, bank portals) — real-time account balances and cleared transactions
- **ERP / GL** (NetSuite, SAP, QuickBooks) — AP and AR subledgers, payroll registers, accruals
- **Billing Platform** (Stripe, Chargebee) — expected collection schedule from outstanding invoices
- **HRIS** (Rippling, ADP, Gusto) — upcoming payroll dates, headcount changes, bonus schedules
- **Debt Agreements** — amortization schedules, interest payment dates, covenant thresholds
- **Treasury Management System** — intercompany transfers, FX settlement dates, investment maturities

### Computation Process
1. Pull the latest bank balance and reconcile to the GL cash account as the starting position
2. Import the AR aging report and apply historical collection curves to forecast weekly inflows
3. Import the AP aging report and scheduled payment runs to forecast weekly outflows
4. Layer in payroll, tax, and debt service from fixed schedules
5. Add planned capex and one-time items from the approved budget
6. Sum net weekly cash flow and compute a rolling ending cash balance
7. Build downside scenario: delay AR collections by 15 days, accelerate AP by 10 days, reduce new sales by 20%
8. Build upside scenario: accelerate AR by 7 days, defer discretionary spend, add new bookings uplift
9. Flag any week where ending balance breaches the minimum cash threshold under any scenario
10. Calculate days of cash remaining (runway) under each scenario

### Output Structure
- **Weekly Cash Flow Schedule**: 13 columns showing inflows, outflows, net flow, and ending balance
- **Scenario Comparison**: Side-by-side base, downside, and upside ending balances
- **Liquidity Alert Panel**: Weeks flagged as below-threshold with deficit amount
- **Cash Runway Metric**: Number of weeks until cash exhaustion under stress
- **Reconciliation Summary**: Opening balance tie-out to bank statement
- **Action Items**: Recommended levers to improve liquidity (draw on revolver, defer capex, accelerate collections)

### Required Sub-Skills
- **Revenue Analysis**: Provides the revenue forecast baseline for cash inflow modeling
- **Expense Breakdown**: Supplies categorized operating expense data for outflow projections
- **Working Capital**: Delivers DSO, DIO, and DPO metrics for collection and payment timing assumptions

### MCP Services & Integrations
- **Plaid API**: Real-time bank account balances and transaction feeds
- **NetSuite / QuickBooks API**: AR and AP subledger data, payment schedules, GL cash accounts
- **Stripe / Chargebee API**: Outstanding invoice amounts and expected payment dates
- **ADP / Gusto API**: Payroll calendars, net pay amounts, tax withholding schedules
- **Google Sheets / Excel Online**: Collaborative forecast model for scenario adjustments`,
    tags: ['finance', 'cfo', 'cash flow', 'treasury', 'forecasting'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-expense-breakdown',
    name: 'Expense Breakdown',
    description: `### Tasks Required
- Extract all operating expenses from the GL for the current and prior period
- Categorize expenses by cost center, department, and natural account
- Compare actuals vs. approved budget and vs. prior year for each line item
- Identify the top 10 expense categories by absolute magnitude and by growth rate
- Calculate key cost ratios: COGS as % of revenue, SGA as % of revenue, R&D as % of revenue
- Analyze fixed vs. variable cost composition and operating leverage sensitivity
- Recommend cost optimization opportunities with estimated annual savings

### Data Sources
- **ERP / General Ledger** (NetSuite, SAP, QuickBooks) — expense journal entries by account, cost center, and vendor
- **Budget Model** (Adaptive, Anaplan, Google Sheets) — approved budget by department and line item
- **Procurement System** (Coupa, SAP Ariba) — purchase order and contract spend data
- **Expense Management** (Brex, Ramp, Expensify) — employee expense reports and card transactions
- **HRIS** (Rippling, ADP) — headcount and compensation data for personnel cost analysis

### Computation Process
1. Pull all expense transactions from the GL for the analysis period
2. Map each transaction to its cost center, department, and expense category using the chart of accounts
3. Aggregate into a cost matrix: rows = expense categories, columns = months/quarters
4. Compute budget variance (actual minus plan) and prior year variance for each cell
5. Rank expense lines by absolute spend and by period-over-period growth rate
6. Calculate cost ratios by dividing each major category by total revenue
7. Classify expenses as fixed or variable based on their correlation with revenue
8. Identify optimization candidates: categories with above-plan spend, above-peer cost ratios, or low ROI

### Output Structure
- **Cost Summary Table**: Total OpEx, YoY change, and OpEx as % of revenue
- **Category Detail**: Each expense category with actuals, budget, variance, and commentary
- **Top 10 Drivers**: Largest and fastest-growing expense lines highlighted
- **Cost Ratio Benchmarks**: COGS %, SGA %, R&D % compared to industry medians
- **Optimization Recommendations**: Specific actions with estimated savings and implementation effort`,
    tags: ['finance', 'cfo', 'expenses', 'budgeting', 'cost optimization'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-competitor-benchmarking',
    name: 'Competitor Benchmarking',
    description: `### Tasks Required
- Define the competitive peer set (3-7 direct competitors plus 2-3 aspirational peers)
- Collect financial metrics: revenue, revenue growth, gross margin, EBITDA margin, net income margin
- Collect operational metrics: headcount, revenue per employee, customer count, NPS
- Gather valuation data: EV/Revenue, EV/EBITDA, P/E multiples (for public comps)
- Estimate market share by revenue or units within the addressable market
- Rank the company against peers on each metric and identify positioning gaps
- Summarize strategic implications: where the company leads, lags, or can differentiate

### Data Sources
- **Public Filings** (SEC EDGAR, Companies House) — 10-K, 10-Q, annual reports for public peers
- **Market Data** (PitchBook, Crunchbase, CB Insights) — private company revenue estimates and funding history
- **Industry Reports** (Gartner, Forrester, IBISWorld) — market size, share, and growth projections
- **News & Earnings Calls** — recent strategic announcements, M&A activity, product launches
- **Internal Financials** (ERP, FP&A model) — company's own metrics for comparison

### Computation Process
1. Build a peer company master list with standardized names, tickers, and data sources
2. Pull the most recent fiscal year and trailing twelve-month financials for each peer
3. Normalize metrics to a common basis (e.g., USD, calendar year, ex-one-time items)
4. Calculate derived metrics: Rule of 40, magic number, burn multiple, gross margin-adjusted growth
5. Rank the company vs. peers on each metric using percentile positioning
6. Estimate market share using total addressable market size and each company's revenue
7. Identify the 3 largest gaps (where the company underperforms) and 3 key advantages
8. Synthesize findings into a competitive positioning narrative

### Output Structure
- **Peer Overview**: Company names, revenue, growth rate, and business model summary
- **Financial Benchmarks**: Side-by-side metrics with company highlighted in context
- **Operational Comparison**: Efficiency metrics like revenue per employee and customer metrics
- **Valuation Multiples**: Trading comps with implied valuation range for the company
- **Competitive Positioning Map**: Qualitative summary of strengths, weaknesses, and differentiation
- **Strategic Recommendations**: Actionable insights for leadership based on competitive gaps`,
    tags: [
      'finance',
      'strategy',
      'benchmarking',
      'competitive analysis',
      'market research',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-unit-economics',
    name: 'Unit Economics',
    description: `### Tasks Required
- Calculate Customer Acquisition Cost (CAC) by channel: paid, organic, outbound, partnerships
- Compute Lifetime Value (LTV) using gross margin, average revenue per account, and churn rate
- Determine LTV/CAC ratio and CAC payback period in months for each acquisition channel
- Analyze contribution margin per customer or per unit at the cohort level
- Track cohort retention curves (monthly and annual) and expansion revenue trends
- Benchmark unit economics against SaaS industry medians and best-in-class peers
- Identify the highest-ROI channels and recommend reallocation of acquisition spend

### Data Sources
- **CRM** (Salesforce, Twenty CRM) — lead source, acquisition date, deal size, customer segment
- **Marketing Platform** (HubSpot, Google Ads, LinkedIn Ads) — campaign spend by channel
- **Billing Platform** (Stripe, Chargebee) — MRR, churn events, expansion and contraction by account
- **Product Analytics** (Amplitude, Mixpanel) — user engagement, activation rates, feature adoption
- **ERP / GL** (NetSuite, QuickBooks) — sales and marketing cost detail for CAC calculation

### Computation Process
1. Aggregate total sales and marketing spend by channel for the measurement period
2. Count new customers acquired by channel from the CRM
3. Calculate CAC = total channel spend / new customers acquired, for each channel
4. Compute average revenue per account (ARPA) on a monthly and annual basis
5. Calculate gross margin-adjusted ARPA by applying the blended gross margin percentage
6. Determine monthly revenue churn rate and derive average customer lifetime = 1 / monthly churn
7. Calculate LTV = gross margin-adjusted ARPA multiplied by average lifetime in months
8. Compute LTV/CAC ratio and payback period = CAC / gross margin-adjusted monthly ARPA
9. Build cohort retention curves for the last 12 monthly cohorts
10. Identify expansion revenue (upsell + cross-sell) contribution to net revenue retention

### Output Structure
- **Unit Economics Summary**: CAC, LTV, LTV/CAC ratio, and payback period at the blended level
- **Channel Detail**: CAC and LTV/CAC broken down by each acquisition channel
- **Cohort Analysis**: Monthly retention curves and net dollar retention by cohort vintage
- **Contribution Margin**: Per-customer margin after variable costs
- **Benchmark Comparison**: Company metrics vs. industry medians (SaaS: 3x LTV/CAC, less than 18-month payback)
- **Recommendations**: Channel reallocation opportunities and levers to improve LTV`,
    tags: ['finance', 'saas', 'unit economics', 'cac', 'ltv', 'growth'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-board-deck-summary',
    name: 'Board Deck Summary',
    description: `### Tasks Required
- Compile key financial highlights: revenue, EBITDA, net income, and cash position vs. plan
- Summarize progress against the top 5-7 company-level KPIs and OKRs
- Report on strategic milestones: product launches, major customer wins, partnerships, hiring
- Outline the top 3-5 risks and corresponding mitigation strategies
- Present capital allocation decisions: fundraising status, M&A pipeline, share repurchases
- Prepare a forward-looking section covering guidance, priorities, and board-level asks
- Format all content for a 20-30 minute board presentation with appendix backup

### Data Sources
- **ERP / GL** (NetSuite, SAP) — month-end or quarter-end financial statements
- **FP&A Model** (Adaptive, Anaplan, Excel) — budget, forecast, and variance analysis
- **CRM** (Salesforce, Twenty CRM) — pipeline summary, bookings, win rates, churn
- **HRIS** (Rippling, ADP) — headcount, hiring plan progress, attrition rates
- **Product / Engineering** (Jira, Linear) — roadmap milestones, release velocity, uptime
- **Prior Board Materials** — previous deck for continuity and follow-up tracking

### Computation Process
1. Pull the latest monthly or quarterly financials and compute variance to budget and prior year
2. Calculate the top KPIs: revenue growth, gross margin, burn rate, ARR, NDR, CAC payback
3. Gather milestone updates from product, sales, and people teams via structured intake forms
4. Compile the risk register and update probability, impact, and mitigation status for each risk
5. Summarize the cash position, runway, and any capital activity (draws, raises, distributions)
6. Draft the narrative arc: performance summary, strategic progress, challenges, and outlook
7. Build the appendix with detailed financials, cohort data, and competitive context
8. Format into a standardized board deck template with consistent slide layouts

### Output Structure
- **Financial Snapshot**: One-page summary of P&L, cash, and key metrics with traffic-light indicators
- **KPI Scorecard**: Each KPI with target, actual, trend arrow, and brief commentary
- **Strategic Milestones**: What was accomplished, what slipped, and what is upcoming
- **Risk & Mitigation Matrix**: Top risks ranked by severity with owner and action plan
- **Capital & Liquidity**: Cash bridge, runway, and any pending financing decisions
- **Outlook & Asks**: Forward guidance, board discussion topics, and specific approvals requested

### Required Sub-Skills
- **Revenue Analysis**: Feeds the revenue and growth metrics for the financial snapshot
- **Cash Flow Forecast**: Provides the liquidity and runway data for the capital section
- **KPI Dashboard**: Supplies the formatted KPI scorecard with trend data
- **Competitor Benchmarking**: Adds competitive context for the strategic positioning narrative

### MCP Services & Integrations
- **NetSuite / SAP API**: Automated pull of financial statements and trial balance
- **Salesforce / Twenty CRM API**: Pipeline and bookings data for the sales update section
- **Google Slides / PowerPoint API**: Programmatic generation of formatted board deck slides
- **Jira / Linear API**: Product milestone status and engineering velocity metrics
- **Notion / Confluence API**: Retrieve prior board minutes and action item tracking`,
    tags: ['finance', 'cfo', 'board', 'executive', 'reporting', 'governance'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-fundraising-memo',
    name: 'Fundraising Memo',
    description: `### Tasks Required
- Draft an executive summary articulating the investment thesis in 2-3 paragraphs
- Describe the business model: value proposition, revenue model, pricing, and go-to-market strategy
- Size the market opportunity: TAM, SAM, SOM with bottom-up and top-down approaches
- Articulate the competitive moat: technology, network effects, switching costs, brand, or data advantage
- Present historical financials: revenue, gross margin, EBITDA, and cash flow for the last 3 years
- Build forward projections: 3-year P&L, cash flow, and key assumptions driving the model
- Detail the fundraising ask: amount, valuation expectations, use of proceeds, and target milestones
- Include key investor metrics: ARR, NDR, Rule of 40, burn multiple, and implied runway

### Data Sources
- **ERP / GL** (NetSuite, QuickBooks) — audited or reviewed historical financial statements
- **FP&A Model** (Excel, Adaptive) — forward projections and scenario assumptions
- **CRM** (Salesforce, Twenty CRM) — customer count, logo retention, pipeline coverage
- **Market Research** (Gartner, PitchBook, Statista) — TAM/SAM estimates and industry growth rates
- **Cap Table** (Carta, Pulley) — current ownership structure, option pool, and prior round terms
- **Comparable Transactions** (PitchBook, Crunchbase) — recent funding rounds for peer companies

### Computation Process
1. Compile 3 years of historical P&L and normalize for one-time items
2. Build a bottoms-up revenue projection using bookings pipeline, win rates, and expansion assumptions
3. Model operating expenses by department with planned hires and unit cost assumptions
4. Calculate projected free cash flow and determine monthly burn rate under the forecast
5. Size the market using industry data and validate with a bottoms-up customer count approach
6. Compute key SaaS metrics: ARR, YoY growth, net dollar retention, gross margin, burn multiple
7. Determine the fundraising amount based on 18-24 months of projected cash needs plus buffer
8. Prepare a valuation framework using revenue multiples from comparable transactions
9. Draft the use-of-proceeds allocation: product/engineering, sales/marketing, G&A, and buffer
10. Map expected milestones to capital deployment timeline

### Output Structure
- **Executive Summary**: Investment thesis, key metrics, and fundraising terms at a glance
- **Company Overview**: Business model, product, customers, and go-to-market strategy
- **Market Opportunity**: TAM/SAM/SOM with supporting data and growth drivers
- **Competitive Landscape**: Positioning matrix and moat articulation
- **Financial Performance**: Historical financials with commentary on key trends
- **Forward Projections**: 3-year P&L, unit economics trajectory, and path to profitability
- **The Ask**: Fundraising amount, intended valuation, use of proceeds, and milestone targets
- **Appendix**: Cap table summary, customer case studies, and detailed model assumptions

### Required Sub-Skills
- **Revenue Analysis**: Provides the historical and projected revenue data with segmentation
- **Unit Economics**: Supplies CAC, LTV, and payback metrics that investors scrutinize
- **Competitor Benchmarking**: Delivers the competitive context and valuation multiples for positioning
- **Cash Flow Forecast**: Feeds the burn rate and runway analysis into the fundraising rationale

### MCP Services & Integrations
- **PitchBook / Crunchbase API**: Comparable transaction data and peer funding round details
- **Carta / Pulley API**: Cap table data, waterfall analysis, and dilution modeling
- **NetSuite / QuickBooks API**: Historical financial data extraction for the financials section
- **Salesforce / Twenty CRM API**: Customer metrics, logo count, and pipeline data
- **Google Docs / Notion API**: Collaborative drafting and formatting of the memo document`,
    tags: [
      'finance',
      'fundraising',
      'investor relations',
      'venture capital',
      'startup',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-kpi-dashboard',
    name: 'KPI Dashboard',
    description: `### Tasks Required
- Define the KPI taxonomy: separate financial, operational, and strategic metrics
- Select 15-20 critical KPIs across revenue, profitability, growth, efficiency, and customer health
- Establish targets, thresholds, and alert triggers for each KPI
- Build period-over-period comparisons: MoM, QoQ, YoY, and trailing 12-month trends
- Implement traffic-light status indicators (green / yellow / red) based on threshold bands
- Conduct root cause analysis for any KPI flagged as off-track
- Design a single-page executive scorecard and a detailed drill-down view

### Data Sources
- **ERP / GL** (NetSuite, SAP, QuickBooks) — revenue, COGS, operating expenses, cash balance
- **Billing Platform** (Stripe, Chargebee) — MRR, ARR, churn rate, expansion revenue, ARPU
- **CRM** (Salesforce, Twenty CRM) — pipeline value, win rate, sales cycle length, new logos
- **Product Analytics** (Amplitude, Mixpanel) — DAU/MAU, activation rate, feature adoption, session time
- **Customer Support** (Zendesk, Intercom) — CSAT, NPS, ticket volume, first response time, resolution time
- **HRIS** (Rippling, ADP) — headcount, attrition rate, time-to-fill, revenue per employee

### Computation Process
1. Inventory all available data sources and map each KPI to its authoritative source system
2. Define the calculation formula for each KPI with clear numerator and denominator
3. Pull current-period actuals and compute each KPI value
4. Pull prior-period values and compute MoM, QoQ, and YoY deltas (absolute and percentage)
5. Calculate a trailing 12-month trend line and identify inflection points
6. Apply threshold logic: green (at or above target), yellow (within 10% of target), red (below 90% of target)
7. For any red-flagged KPI, pull supporting detail data and draft a root cause hypothesis
8. Rank KPIs by strategic importance and organize into the scorecard layout
9. Generate the drill-down views with segment-level breakdowns for each metric

### Output Structure
- **Executive Scorecard**: Single-page view with all KPIs, actuals, targets, and status indicators
- **Financial Metrics Section**: MRR, ARR, gross margin, EBITDA margin, burn rate, runway
- **Growth Metrics Section**: Revenue growth rate, net new ARR, bookings, pipeline coverage ratio
- **Customer Metrics Section**: NPS, CSAT, logo churn, net dollar retention, LTV/CAC
- **Operational Metrics Section**: Revenue per employee, sales cycle days, support resolution time
- **Off-Track Analysis**: Each red/yellow KPI with root cause, trend context, and recommended action
- **Trend Dashboard**: 12-month sparklines for all KPIs showing trajectory and momentum

### Required Sub-Skills
- **Revenue Analysis**: Provides the underlying revenue metrics and segmentation for financial KPIs
- **Unit Economics**: Supplies CAC, LTV, and retention metrics for the customer health section
- **Expense Breakdown**: Feeds cost ratios and burn rate into the financial metrics section
- **Cash Flow Forecast**: Delivers runway and liquidity metrics for the financial scorecard

### MCP Services & Integrations
- **NetSuite / SAP API**: Financial KPI data from the general ledger and subledgers
- **Stripe / Chargebee API**: Subscription metrics including MRR, churn, and expansion
- **Salesforce / Twenty CRM API**: Sales pipeline, win rates, and bookings data
- **Amplitude / Mixpanel API**: Product engagement and activation metrics
- **Zendesk / Intercom API**: Customer satisfaction and support performance data
- **Google Sheets / Looker API**: Dashboard rendering and data visualization layer`,
    tags: ['finance', 'cfo', 'kpi', 'dashboard', 'reporting', 'metrics'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  // Finance - Debt & Capital
  {
    id: 'default-net-debt-analysis',
    name: 'Net Debt Analysis',
    description: `### Tasks Required
- Collect total outstanding debt balances across all instruments (term loans, revolving credit facilities, bonds, convertible notes, capital leases)
- Gather cash, cash equivalents, and short-term investment balances from treasury
- Map each debt instrument to its maturity date, coupon rate, and amortization schedule
- Compute leverage ratios and compare against covenant thresholds and peer benchmarks
- Identify refinancing windows and upcoming maturity walls

### Data Sources
- **General Ledger / ERP** (SAP, NetSuite, Oracle) — outstanding debt balances, cash accounts, and interest expense postings
- **Loan Agreements & Term Sheets** (document repository) — contractual terms, covenants, prepayment penalties, and rate reset provisions
- **Treasury Management System** (Kyriba, GTreasury) — real-time cash positions, bank account balances, and short-term investments
- **Credit Rating Agencies** (Moody's, S&P, Fitch) — current issuer and issue-level ratings for benchmarking
- **Market Data** (Bloomberg Terminal, Refinitiv) — current benchmark rates (SOFR, EURIBOR), credit spreads, and comparable company leverage multiples

### Computation Process
1. Aggregate gross debt by instrument type: senior secured, senior unsecured, subordinated, convertible, and lease obligations
2. Subtract unrestricted cash, cash equivalents, and liquid short-term investments to arrive at net debt
3. Build a maturity profile schedule showing principal due by quarter for the next 5 years and annually thereafter
4. Calculate key leverage ratios: Net Debt / LTM EBITDA, Total Debt / Total Capitalization, Interest Coverage Ratio (EBITDA / Interest Expense), and Fixed Charge Coverage
5. Stress-test net debt under scenarios: 10% EBITDA decline, 200bps rate increase on floating-rate debt, and accelerated maturity triggers
6. Compare computed ratios against financial covenant requirements and calculate headroom as both percentage and absolute dollar amount
7. Flag instruments maturing within 18 months that require refinancing action

### Output Structure
- **Net Debt Summary**: Total gross debt, cash offsets, and net debt figure with period-over-period change
- **Debt Composition**: Breakdown by instrument type with outstanding balance, rate (fixed vs. floating), and maturity
- **Maturity Schedule**: Quarterly and annual principal repayment timeline with refinancing risk flags
- **Leverage Ratios**: Net Debt/EBITDA, Debt/Equity, Interest Coverage, and Fixed Charge Coverage with trend and covenant comparison
- **Covenant Compliance Snapshot**: Current ratio values vs. thresholds with headroom percentages
- **Risk Flags & Recommendations**: Refinancing needs, concentration risks, and suggested actions

### Required Sub-Skills
- **Covenant Compliance**: Needed to cross-reference computed ratios against specific covenant tests across all credit facilities
- **Debt Schedule**: Provides the tranche-level amortization detail that feeds the maturity profile analysis
- **Treasury Dashboard**: Supplies real-time cash position data required for accurate net debt calculation
- **Scenario Modeling**: Enables stress-testing of leverage ratios under adverse conditions

### MCP Services & Integrations
- **SAP / NetSuite API**: Pull GL balances for debt and cash accounts via financial reporting APIs
- **Bloomberg DATA License**: Retrieve benchmark interest rates, credit spreads, and peer leverage multiples
- **Kyriba Treasury**: Access consolidated cash positions and bank account balances across entities
- **Moody's Analytics / CreditEdge**: Obtain credit ratings and probability of default metrics for benchmarking
- **Document Generation (Docxtemplater, Carbone)**: Produce formatted net debt analysis reports for CFO and board distribution`,
    tags: ['finance', 'debt', 'leverage', 'capital structure', 'credit'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-working-capital',
    name: 'Working Capital',
    description: `### Tasks Required
- Extract accounts receivable, inventory, and accounts payable balances for trailing 12 months
- Calculate DSO (Days Sales Outstanding), DIO (Days Inventory Outstanding), and DPO (Days Payable Outstanding) for each period
- Compute the Cash Conversion Cycle (CCC = DSO + DIO - DPO) and trend over time
- Benchmark working capital ratios against industry peers
- Identify actionable levers to release trapped working capital

### Data Sources
- **ERP System** (SAP, NetSuite, Oracle) — AR, AP, and inventory subledger balances with aging detail
- **Bank Statements / Treasury System** — cash inflow and outflow timing data to validate cycle assumptions
- **Industry Benchmarks** (REL Working Capital Survey, Hackett Group) — peer DSO, DIO, DPO, and CCC benchmarks by sector
- **Sales and Procurement Records** — invoice terms, payment terms, and vendor/customer concentration data

### Computation Process
1. Pull monthly AR, inventory, and AP balances for the trailing 12 months from the general ledger
2. Calculate DSO = (Average AR / Revenue) x Days in Period for each month
3. Calculate DIO = (Average Inventory / COGS) x Days in Period for each month
4. Calculate DPO = (Average AP / COGS) x Days in Period for each month
5. Derive CCC = DSO + DIO - DPO and plot the trend line
6. Decompose changes in working capital into volume effects (revenue/COGS growth) vs. efficiency effects (days metric changes)
7. Identify top 10 customers by AR contribution and top 10 vendors by AP contribution for concentration analysis
8. Quantify cash release opportunity if DSO, DIO, or DPO moved to peer median levels

### Output Structure
- **Working Capital Summary**: Current net working capital balance, CCC, and period-over-period change
- **DSO / DIO / DPO Trends**: Monthly values with 12-month rolling averages and peer comparison
- **Cash Conversion Cycle Analysis**: Waterfall decomposition showing which component drove changes
- **Concentration Analysis**: Top customers and vendors by impact on working capital
- **Cash Release Opportunities**: Dollar value of cash freed by improving each metric to benchmark levels
- **Recommendations**: Specific actions for AR collections, inventory management, and payment term optimization`,
    tags: [
      'finance',
      'working capital',
      'cash management',
      'treasury',
      'liquidity',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-debt-schedule',
    name: 'Debt Schedule',
    description: `### Tasks Required
- Catalog every debt tranche with principal balance, interest rate, maturity date, and amortization terms
- Build a quarterly amortization schedule for each tranche showing beginning balance, interest, principal, and ending balance
- Aggregate across tranches to produce a consolidated debt service schedule
- Model the impact of interest rate changes on floating-rate tranches
- Highlight balloon payments, bullet maturities, and prepayment option dates

### Data Sources
- **Loan Agreements & Credit Facilities** (document repository) — principal amounts, spreads, SOFR floors, amortization schedules, and prepayment terms
- **ERP / General Ledger** (SAP, NetSuite) — current outstanding balances and historical interest expense by tranche
- **Market Data Provider** (Bloomberg, Refinitiv) — current and forward SOFR/EURIBOR curves for floating-rate projections
- **Bank Statements** — actual debt service payments for reconciliation

### Computation Process
1. List each debt tranche: facility name, lender, original principal, current outstanding, fixed or floating rate, spread, maturity, and amortization type
2. For amortizing loans, calculate quarterly principal payments based on the contractual amortization schedule
3. For floating-rate debt, apply the current benchmark rate plus contractual spread; project forward using the market-implied forward curve
4. For fixed-rate debt, compute interest as (outstanding balance x fixed rate x day count fraction)
5. Build a consolidated quarterly schedule summing interest expense and principal repayments across all tranches
6. Calculate weighted average cost of debt = total annual interest expense / average total debt outstanding
7. Scenario-test: model +100bps, +200bps, and -50bps parallel shifts to the yield curve and show impact on annual interest expense
8. Flag quarters with balloon payments or bullet maturities exceeding a materiality threshold

### Output Structure
- **Debt Inventory**: Complete listing of all tranches with key terms in a structured list format
- **Quarterly Amortization Schedule**: Period-by-period breakdown of interest and principal by tranche
- **Consolidated Debt Service**: Aggregated quarterly interest expense and total debt service obligations
- **Rate Sensitivity Analysis**: Impact of rate movements on annual interest expense for floating-rate tranches
- **Maturity Timeline**: Visual timeline of upcoming maturities and refinancing events
- **Key Metrics**: Weighted average cost of debt, weighted average maturity, and fixed vs. floating mix`,
    tags: ['finance', 'debt', 'amortization', 'interest', 'capital structure'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-dcf-valuation',
    name: 'DCF Valuation',
    description: `### Tasks Required
- Build revenue and expense projections for a 5-year explicit forecast period
- Calculate unlevered free cash flow (FCF) for each projection year
- Estimate the weighted average cost of capital (WACC) using CAPM and market cost of debt
- Determine terminal value using both perpetuity growth and exit multiple methods
- Perform sensitivity analysis across key assumptions and present an implied valuation range

### Data Sources
- **Company Financials** (ERP, SEC filings, internal FP&A models) — historical income statements, balance sheets, cash flow statements, and management projections
- **Market Data** (Bloomberg Terminal, Capital IQ) — risk-free rate (10Y Treasury), equity risk premium, sector beta, credit spreads, and comparable company trading multiples
- **Industry Research** (IBISWorld, Gartner, McKinsey) — market growth rates, TAM estimates, and margin benchmarks for the sector
- **Analyst Consensus** (Visible Alpha, Bloomberg) — street revenue and EBITDA estimates for validation
- **Federal Reserve / Central Bank Data** — current yield curves and inflation expectations for terminal growth calibration

### Computation Process
1. Project revenue for years 1-5 using a bottoms-up model (volume x price) or top-down approach (market share x TAM growth)
2. Forecast operating expenses, EBITDA margin, depreciation, capital expenditures, and changes in net working capital for each year
3. Calculate unlevered free cash flow: EBIT x (1 - Tax Rate) + D&A - CapEx - Change in NWC
4. Compute cost of equity using CAPM: Ke = Rf + Beta x (ERP) + size premium (if applicable)
5. Compute after-tax cost of debt: Kd x (1 - Tax Rate) using the company's marginal borrowing rate
6. Calculate WACC using market-value weights of debt and equity
7. Estimate terminal value via Gordon Growth Model: TV = FCF(n+1) / (WACC - g), where g is the long-term growth rate
8. Cross-check terminal value with exit multiple method: TV = EBITDA(n) x Exit EV/EBITDA Multiple
9. Discount all projected FCFs and terminal value back to present at the WACC
10. Sum discounted values to arrive at enterprise value; subtract net debt and add non-operating assets to derive equity value
11. Build a sensitivity table varying WACC (plus/minus 100bps) and terminal growth rate (plus/minus 50bps)

### Output Structure
- **Assumptions Summary**: Revenue growth rates, margin trajectory, CapEx as % of revenue, NWC assumptions, and tax rate
- **Projected Free Cash Flow**: Year-by-year FCF build from revenue through unlevered FCF
- **WACC Calculation**: Component breakdown showing cost of equity, cost of debt, capital structure weights, and blended WACC
- **Terminal Value**: Both perpetuity growth and exit multiple approaches with implied terminal year metrics
- **Enterprise & Equity Value**: Bridge from enterprise value to equity value per share
- **Sensitivity Analysis**: Matrix showing implied equity value across WACC and terminal growth rate combinations
- **Valuation Football Field**: Range of implied values from DCF, comparable companies, and precedent transactions

### Required Sub-Skills
- **Net Debt Analysis**: Provides the net debt figure needed to bridge from enterprise value to equity value
- **Scenario Modeling**: Enables building upside/downside FCF projections that feed alternative DCF scenarios
- **Competitor Benchmarking**: Supplies comparable company multiples for cross-checking terminal value and validating assumptions
- **EBITDA Bridge**: Helps decompose historical EBITDA changes to inform the quality of forward projections

### MCP Services & Integrations
- **Capital IQ / S&P Global**: Retrieve comparable company trading multiples, historical financials, and beta estimates
- **Bloomberg Terminal / DATA License**: Pull risk-free rates, equity risk premiums, credit spreads, and forward yield curves
- **SAP or NetSuite ERP**: Extract historical financial data for model calibration
- **Visible Alpha or FactSet**: Access consensus analyst estimates for revenue and EBITDA to validate projections
- **Document Generation (Carbone, LaTeX)**: Produce formatted valuation memorandums with embedded sensitivity tables`,
    tags: ['finance', 'valuation', 'dcf', 'modeling', 'investment banking'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-budget-variance',
    name: 'Budget Variance',
    description: `### Tasks Required
- Extract actual financial results and approved budget figures for the reporting period
- Calculate variances at the department, cost center, and line item level
- Classify each variance as favorable or unfavorable and determine materiality
- Decompose material variances into volume, price, mix, and timing effects
- Prepare management commentary explaining root causes and corrective actions

### Data Sources
- **ERP / General Ledger** (SAP, NetSuite, Oracle) — actual revenue and expense data by cost center and GL account
- **Budgeting System** (Adaptive Planning, Anaplan, Vena) — approved annual and quarterly budgets with department-level detail
- **HR / Payroll System** (Workday, ADP) — headcount actuals vs. plan for personnel cost variance analysis
- **CRM** (Salesforce, HubSpot) — bookings and pipeline data to explain revenue variances

### Computation Process
1. Pull actual results and budget for the reporting period at the GL account and cost center level
2. Calculate absolute variance = Actual - Budget and percentage variance = (Actual - Budget) / Budget
3. Apply materiality thresholds (e.g., variances greater than $50K or 10% of budget) to flag items requiring explanation
4. For revenue variances, decompose into volume (units sold vs. plan), price (ASP vs. plan), and mix effects
5. For expense variances, separate into rate/price effects (cost per unit vs. plan) and volume/usage effects (consumption vs. plan)
6. For personnel costs, decompose into headcount variance, compensation rate variance, and timing (hire date vs. plan)
7. Aggregate department-level variances into a company-level P&L variance summary
8. Draft management commentary for each material variance with root cause and expected persistence

### Output Structure
- **Executive Summary**: Total revenue and expense variance at the company level with key drivers
- **Revenue Variance Detail**: Line-by-line breakdown with volume, price, and mix decomposition
- **Expense Variance by Department**: Each department's budget vs. actual with favorable/unfavorable classification
- **Personnel Cost Variance**: Headcount, rate, and timing effects by department
- **Material Variance Commentary**: Root cause narrative for each variance exceeding materiality threshold
- **Forecast Impact**: Whether variances are one-time or expected to recur, with implications for full-year outlook`,
    tags: ['finance', 'fp&a', 'budgeting', 'variance analysis', 'reporting'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-capex-tracker',
    name: 'CapEx Tracker',
    description: `### Tasks Required
- Catalog all approved capital expenditure projects with original budget, timeline, and sponsoring department
- Track spend-to-date, committed but unpaid amounts, and remaining budget for each project
- Categorize projects as growth CapEx, maintenance CapEx, or strategic investments
- Identify projects with cost overruns, schedule delays, or scope changes
- Calculate ROI, payback period, and NPV for completed and in-progress projects

### Data Sources
- **ERP / Fixed Asset Module** (SAP, NetSuite, Oracle) — capital project codes, PO commitments, invoices paid, and asset capitalization records
- **Project Management System** (Smartsheet, MS Project, Monday.com) — project timelines, milestones, and completion percentages
- **Budgeting System** (Adaptive, Anaplan) — approved CapEx budgets by project and department
- **Procurement System** — purchase orders, vendor contracts, and committed spend not yet invoiced

### Computation Process
1. List all approved CapEx projects with project ID, name, sponsor, category, and approved budget
2. For each project, aggregate: invoiced/paid spend, committed/open POs, and remaining budget = approved - (paid + committed)
3. Calculate percentage complete based on spend (spend-to-date / total approved) and compare to project timeline percentage
4. Flag projects where spend rate exceeds timeline pace (indicating potential overrun) or where spend lags significantly (indicating delay)
5. For completed projects, calculate actual ROI = (incremental annual benefit - annual depreciation) / total project cost
6. Calculate simple payback period = total project cost / annual incremental cash flow benefit
7. Aggregate by category to show total growth vs. maintenance vs. strategic CapEx allocation
8. Compare total CapEx spend-to-date against the annual CapEx budget envelope

### Output Structure
- **CapEx Summary Dashboard**: Total approved budget, spent to date, committed, and remaining across all projects
- **Project-Level Detail**: Each project with budget, spend, committed, remaining, % complete, and status flag
- **Category Breakdown**: Growth, maintenance, and strategic CapEx totals with percentage allocation
- **Overrun & Delay Report**: Projects exceeding budget or behind schedule with variance amounts and explanations
- **ROI Analysis**: Payback period and ROI for completed projects; projected ROI for in-progress projects
- **Recommendations**: Projects to accelerate, defer, or cancel based on performance and strategic priority`,
    tags: ['finance', 'capex', 'capital allocation', 'project tracking', 'roi'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-ebitda-bridge',
    name: 'EBITDA Bridge',
    description: `### Tasks Required
- Calculate EBITDA for both the current and prior comparison period
- Decompose the change in EBITDA into discrete driver categories: volume, price, cost, FX, and one-time items
- Separate organic growth from inorganic (M&A) contributions
- Normalize for non-recurring items and accounting adjustments
- Format results as a waterfall for executive presentation

### Data Sources
- **ERP / General Ledger** (SAP, NetSuite) — revenue, COGS, and operating expense detail by product line, geography, and cost center
- **FP&A Models** (Adaptive, Anaplan) — budget assumptions for volume, pricing, and cost benchmarks
- **M&A Integration Tracker** — acquired entity revenue and cost contributions since close date
- **FX Rates** (Bloomberg, ECB, Federal Reserve) — average and spot exchange rates for both periods

### Computation Process
1. Calculate reported EBITDA for both periods: Revenue - COGS - OpEx + D&A addback
2. Identify and remove non-recurring items from both periods (restructuring charges, litigation, asset impairments, one-time gains)
3. Calculate volume effect: (current period units - prior period units) x prior period margin per unit
4. Calculate price effect: (current period ASP - prior period ASP) x current period units
5. Calculate cost effect: change in per-unit COGS and OpEx applied to current volume
6. Calculate FX effect: restate current period results at prior period exchange rates and measure the difference
7. Isolate M&A contribution: revenue and EBITDA from acquired entities not present in the prior period
8. Reconcile: Prior EBITDA + Volume + Price + Cost + FX + M&A + One-Time Items = Current EBITDA
9. Verify the bridge balances to within an acceptable rounding tolerance

### Output Structure
- **Bridge Summary**: Prior period EBITDA walking to current period EBITDA with each driver labeled
- **Volume Impact**: Units and revenue change attributable to volume growth or decline
- **Price Impact**: Revenue change from average selling price movements
- **Cost Impact**: COGS and OpEx changes broken into input costs, labor, and overhead
- **FX Impact**: Currency translation effect on revenue, costs, and EBITDA
- **M&A & One-Time Items**: Inorganic contributions and non-recurring adjustments isolated
- **Waterfall Chart Data**: Ordered values suitable for rendering a waterfall visualization`,
    tags: ['finance', 'ebitda', 'profitability', 'fp&a', 'executive reporting'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-treasury-dashboard',
    name: 'Treasury Dashboard',
    description: `### Tasks Required
- Consolidate cash positions across all bank accounts, entities, and geographies
- Track daily cash inflows and outflows by category
- Monitor FX exposures and mark-to-market hedging positions
- Assess counterparty risk across banking relationships
- Forecast short-term liquidity needs over the next 30, 60, and 90 days

### Data Sources
- **Treasury Management System** (Kyriba, GTreasury, ION) — consolidated bank balances, cash pooling structures, and investment positions
- **Bank Portals / SWIFT** (J.P. Morgan Access, Citi Treasury, HSBC HSBCnet) — real-time bank account balances and intraday transaction feeds
- **ERP / General Ledger** (SAP, NetSuite) — AP payment runs, AR collection receipts, and payroll outflows
- **FX Data Provider** (Bloomberg, Refinitiv, OANDA) — spot rates, forward rates, and option pricing for hedging valuations
- **Investment Platforms** (money market fund portals, brokerage accounts) — short-term investment balances and yields

### Computation Process
1. Aggregate opening balances across all bank accounts, converting foreign currency accounts at the daily spot rate
2. Categorize daily inflows: customer collections, investment maturities, intercompany transfers, financing proceeds
3. Categorize daily outflows: vendor payments, payroll, debt service, tax payments, CapEx disbursements
4. Calculate net daily cash position = opening balance + inflows - outflows
5. Mark-to-market all FX hedging positions (forwards, options, swaps) using current market rates
6. Calculate hedging effectiveness: notional hedged / total exposure by currency pair
7. Compute counterparty concentration: total deposits and credit lines per banking partner as percentage of total
8. Build a 13-week cash forecast by extrapolating known inflows/outflows and applying historical patterns

### Output Structure
- **Global Cash Position**: Total cash by entity, currency, and bank with consolidated USD equivalent
- **Daily Cash Flow Tracker**: Inflows and outflows by category with running balance
- **FX Exposure Summary**: Net exposure by currency pair with hedged vs. unhedged portions
- **Hedging Position Report**: Mark-to-market P&L on outstanding FX contracts with maturity dates
- **Counterparty Exposure**: Banking partner concentration with credit ratings and limit utilization
- **Short-Term Liquidity Forecast**: 30/60/90-day projected cash positions with minimum balance alerts`,
    tags: ['finance', 'treasury', 'cash management', 'banking', 'liquidity'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-scenario-modeling',
    name: 'Scenario Modeling',
    description: `### Tasks Required
- Define base, upside, and downside scenarios with clearly articulated assumption sets
- Build integrated P&L, balance sheet, and cash flow projections for each scenario
- Calculate key output metrics: revenue, EBITDA, net income, cash runway, and valuation for each case
- Identify breakeven points and cash-out dates under stress
- Present a decision matrix comparing scenarios for leadership

### Data Sources
- **Internal FP&A Models** (Adaptive, Anaplan, Excel) — current budget, forecast, and historical actuals as the foundation for the base case
- **Company Operational Data** (CRM, HR system, product analytics) — pipeline, headcount plans, churn data, and usage metrics to inform assumptions
- **Market Data** (Bloomberg, Capital IQ, PitchBook) — comparable company growth rates, margin profiles, and valuation multiples for calibration
- **Macroeconomic Data** (Federal Reserve, IMF, World Bank) — GDP growth, inflation, interest rate forecasts, and FX projections for macro scenarios
- **Industry Research** (Gartner, Forrester, IBISWorld) — market size forecasts, competitive dynamics, and regulatory outlook

### Computation Process
1. Establish the base case using the current approved budget/forecast as the starting point
2. Define upside scenario by adjusting key assumptions favorably: higher revenue growth, improved retention, faster deal velocity, lower input costs
3. Define downside scenario by stressing assumptions adversely: revenue growth contraction, increased churn, delayed product launches, cost inflation
4. For each scenario, project the income statement line by line from revenue through net income
5. Model the balance sheet using working capital ratios, CapEx plans, and debt/equity assumptions specific to each scenario
6. Derive the cash flow statement from P&L and balance sheet changes; calculate ending cash balance and runway
7. Calculate EBITDA, free cash flow, and key ratios (leverage, coverage, liquidity) for each scenario
8. Determine breakeven revenue level and months of cash runway under the downside scenario
9. Probability-weight the scenarios (e.g., 50% base, 25% upside, 25% downside) to compute an expected value
10. Build a decision matrix showing trade-offs across scenarios for key strategic choices

### Output Structure
- **Scenario Assumptions**: Side-by-side comparison of all key assumptions across base, upside, and downside
- **Projected P&L by Scenario**: Revenue, gross margin, EBITDA, and net income for each case
- **Balance Sheet Projections**: Key balance sheet items and ratios under each scenario
- **Cash Flow & Runway**: Free cash flow, ending cash, and months of runway for each case
- **Breakeven Analysis**: Revenue and unit volume required to reach cash flow breakeven
- **Decision Matrix**: Strategic options ranked by risk-adjusted return across scenarios
- **Probability-Weighted Outcome**: Expected value blending all three scenarios

### Required Sub-Skills
- **DCF Valuation**: Used to compute implied enterprise value under each scenario for valuation sensitivity
- **Net Debt Analysis**: Provides leverage metrics that change materially across scenarios
- **Budget Variance**: Historical variance patterns inform the plausibility range of assumption deviations
- **EBITDA Bridge**: Decomposition of historical changes helps calibrate the magnitude of scenario adjustments

### MCP Services & Integrations
- **Anaplan or Adaptive Planning**: Pull current budget and forecast models as the base case foundation
- **Bloomberg / Capital IQ**: Retrieve market data for comparable company calibration and macro assumptions
- **Salesforce CRM**: Access pipeline and bookings data to inform revenue scenario assumptions
- **Federal Reserve FRED API**: Pull macroeconomic data series (GDP, CPI, Fed Funds Rate) for macro scenario calibration
- **Document Generation (Carbone, Google Slides API)**: Produce scenario comparison decks for board and leadership review`,
    tags: ['finance', 'fp&a', 'modeling', 'forecasting', 'scenario analysis'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-ma-screening',
    name: 'M&A Screening',
    description: `### Tasks Required
- Define acquisition screening criteria: revenue range, growth rate, geography, sector, profitability, and strategic fit parameters
- Source and filter potential targets from databases and market intelligence
- Estimate acquisition multiples and implied deal values for shortlisted targets
- Assess strategic fit, synergy potential, and integration complexity for top candidates
- Rank targets and produce a shortlist with supporting rationale

### Data Sources
- **Deal & Company Databases** (PitchBook, Capital IQ, Crunchbase, CB Insights) — company profiles, financials, funding history, ownership, and deal flow
- **Market Data** (Bloomberg, Refinitiv) — public company trading multiples, precedent transaction multiples, and sector benchmarks
- **Industry Research** (Gartner, Forrester, IBISWorld) — market maps, competitive landscapes, and sector growth forecasts
- **Internal Strategy Documents** — acquisition mandate, strategic priorities, geographic expansion plans, and technology gaps
- **News & Intelligence** (Factiva, Google News, industry publications) — recent leadership changes, funding rounds, strategic pivots, and distressed situations

### Computation Process
1. Translate the strategic mandate into quantitative screening filters: minimum/maximum revenue, revenue growth rate threshold, EBITDA margin floor, geography, and sector codes
2. Query deal databases to generate a long list of companies matching the initial filter criteria
3. Apply secondary qualitative filters: product/technology fit, customer overlap, cultural compatibility, and regulatory considerations
4. For each shortlisted target, estimate enterprise value using relevant multiples (EV/Revenue, EV/EBITDA) from precedent transactions and comparable public companies
5. Calculate a control premium range (typically 20-40%) over current trading value for public targets
6. Estimate revenue and cost synergies: cross-sell opportunities, overlapping SGA, and technology platform consolidation
7. Model accretion/dilution to EPS under assumed financing mix (cash, debt, equity)
8. Score each target on a weighted criteria matrix covering strategic fit, financial attractiveness, synergy potential, and integration risk
9. Rank targets by composite score and select top 5-10 for the shortlist

### Output Structure
- **Screening Criteria Summary**: All quantitative and qualitative filters applied
- **Long List**: Complete universe of companies matching initial filters with key data points
- **Shortlist Profiles**: Detailed profiles of top-ranked targets with financials, strategic rationale, and estimated deal value
- **Valuation Estimates**: Implied enterprise value range for each target using multiple methodologies
- **Synergy Assessment**: Estimated revenue synergies, cost synergies, and implementation timeline
- **Scoring Matrix**: Weighted ranking of targets across strategic, financial, and execution criteria
- **Recommendation**: Top 3-5 targets with go/no-go rationale and suggested next steps

### Required Sub-Skills
- **DCF Valuation**: Provides standalone intrinsic valuation of shortlisted targets to cross-check market multiples
- **Competitor Benchmarking**: Supplies comparative financial and operational metrics for evaluating targets relative to the acquirer's peer set
- **Scenario Modeling**: Enables modeling of post-acquisition combined entity financials under different integration assumptions
- **Net Debt Analysis**: Required to assess target leverage and determine the net purchase price after assuming or refinancing target debt

### MCP Services & Integrations
- **PitchBook / Capital IQ**: Primary screening databases for company search, filtering, and financial data retrieval
- **Bloomberg Terminal**: Access trading multiples, precedent transaction comps, and real-time market data
- **Crunchbase / CB Insights**: Source private company profiles, funding rounds, and investor information for venture-stage targets
- **Factiva / LexisNexis**: Monitor news flow for potential targets including management changes, strategic reviews, and distressed situations
- **Document Generation (Docxtemplater, Google Slides API)**: Produce target profile books and investment committee screening memos`,
    tags: [
      'finance',
      'm&a',
      'mergers',
      'acquisitions',
      'corporate development',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-dividend-analysis',
    name: 'Dividend Analysis',
    description: `### Tasks Required
- Calculate the current dividend payout ratio, dividend yield, and free cash flow coverage ratio
- Analyze historical dividend trends: growth rate, consistency, and special dividends
- Model forward dividend capacity under base, upside, and downside earnings scenarios
- Benchmark dividend policy against sector peers and comparable companies
- Recommend an optimal payout level balancing shareholder returns and reinvestment needs

### Data Sources
- **Company Financials** (ERP, SEC filings) — net income, EPS, free cash flow, and cash balances for payout calculations
- **Investor Relations Data** — historical dividend per share, ex-dividend dates, and declared special dividends
- **Market Data** (Bloomberg, Capital IQ) — peer dividend yields, payout ratios, and total shareholder return comparisons
- **Board / Capital Allocation Policy Documents** — target payout ratio, minimum cash reserve requirements, and dividend policy guidelines

### Computation Process
1. Calculate payout ratio = total dividends paid / net income for the trailing 12 months
2. Calculate dividend yield = annual dividend per share / current share price
3. Calculate FCF coverage = free cash flow / total dividends paid (values above 1.5x indicate strong coverage)
4. Compute the 5-year CAGR of dividends per share to assess growth trajectory
5. Model forward dividend capacity: project net income and FCF for 3 years, apply the target payout ratio, and derive sustainable DPS
6. Stress-test dividend sustainability under a 20% earnings decline scenario
7. Compare payout ratio, yield, and FCF coverage against the peer median and sector average
8. Calculate total shareholder return (dividend yield + share buyback yield + capital appreciation) vs. peers
9. Identify the payout ratio range that maximizes shareholder value while maintaining investment-grade credit metrics

### Output Structure
- **Dividend Summary**: Current DPS, yield, payout ratio, and FCF coverage with historical trend
- **Payout Sustainability Analysis**: Forward FCF capacity vs. projected dividend obligations
- **Stress Test Results**: Dividend coverage under downside earnings scenarios
- **Peer Comparison**: Payout ratio, yield, and total shareholder return benchmarked against comparables
- **Historical Dividend Track Record**: Annual DPS history, growth rate, and consistency score
- **Recommendation**: Suggested target payout ratio and DPS level with supporting rationale`,
    tags: [
      'finance',
      'dividends',
      'shareholder returns',
      'capital allocation',
      'equity',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-fx-exposure',
    name: 'FX Exposure Report',
    description: `### Tasks Required
- Map all currency exposures across revenue, cost of goods sold, operating expenses, and balance sheet items
- Quantify transactional FX risk (cash flows in foreign currencies) and translational FX risk (consolidation of foreign subsidiaries)
- Review current hedging positions and calculate coverage ratios by currency pair
- Model P&L impact under adverse currency movements of 5% and 10%
- Recommend hedging strategy adjustments with cost-benefit analysis

### Data Sources
- **ERP / General Ledger** (SAP, NetSuite) — revenue and expense data by currency, intercompany balances, and foreign subsidiary trial balances
- **Treasury Management System** (Kyriba, GTreasury) — outstanding FX forwards, options, and cross-currency swaps with notional amounts and maturity dates
- **FX Market Data** (Bloomberg, Refinitiv, OANDA) — spot rates, forward curves, implied volatility, and option pricing for major currency pairs
- **Sales Contracts / Procurement Agreements** — contractual currency of invoicing for key customers and vendors
- **Central Bank Data** (ECB, Federal Reserve, BOJ) — policy rate expectations and intervention signals

### Computation Process
1. Extract all revenue streams by invoicing currency and all expense items by payment currency
2. Calculate net transactional exposure by currency pair: foreign currency revenue minus foreign currency costs
3. Identify translational exposures: net assets of foreign subsidiaries that convert to the reporting currency
4. Inventory all existing hedging instruments: FX forwards (notional, rate, maturity), options (strike, premium, expiry), and swaps
5. Calculate hedge coverage ratio = notional hedged / total exposure for each currency pair and tenor bucket
6. Model P&L sensitivity: apply a 5% and 10% adverse movement to each unhedged exposure to quantify dollar impact
7. Estimate the cost of extending hedge coverage (forward points, option premiums) for unhedged exposures
8. Perform cost-benefit analysis: compare hedging cost vs. potential P&L volatility reduction
9. Identify natural hedges (revenue and costs in the same currency) that reduce the need for financial hedging

### Output Structure
- **Exposure Map**: Net exposure by currency pair for transactional and translational risk
- **Hedging Position Summary**: All outstanding FX instruments with notional, rate, maturity, and mark-to-market value
- **Coverage Ratios**: Percentage of exposure hedged by currency pair and time horizon
- **Sensitivity Analysis**: P&L impact of 5% and 10% adverse currency moves on unhedged exposures
- **Natural Hedge Identification**: Currency pairs where revenues and costs offset, reducing net exposure
- **Hedging Cost-Benefit Analysis**: Cost of additional hedge coverage vs. risk reduction achieved
- **Recommendations**: Suggested changes to hedging policy, instruments, and coverage targets`,
    tags: [
      'finance',
      'fx',
      'currency',
      'hedging',
      'risk management',
      'treasury',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-financial-covenant',
    name: 'Covenant Compliance',
    description: `### Tasks Required
- Compile all financial covenants from each credit facility and debt agreement
- Calculate the current value of each covenant ratio using the most recent financial data
- Measure headroom to covenant thresholds in both absolute and percentage terms
- Project forward covenant compliance under base and stress scenarios for the next 4 quarters
- Flag any covenants at risk of breach and recommend remediation actions

### Data Sources
- **Loan Agreements & Credit Facilities** (document repository) — specific covenant definitions, calculation methodologies, testing frequency, and cure provisions
- **ERP / General Ledger** (SAP, NetSuite) — financial data required for covenant calculations (EBITDA, total debt, interest expense, fixed charges, current assets/liabilities)
- **FP&A Forecast Models** (Adaptive, Anaplan) — forward projections of P&L, balance sheet, and cash flow for prospective compliance testing
- **Bank Compliance Certificates** — historical covenant compliance certificates submitted to lenders for trend analysis

### Computation Process
1. Extract the precise covenant definitions from each credit agreement, noting any permitted adjustments or addbacks to EBITDA
2. Calculate adjusted EBITDA per the credit agreement definition (which may differ from management or GAAP EBITDA)
3. Compute each required ratio using the agreement-specific formulas: Leverage Ratio = Total Debt / Adjusted EBITDA (trailing 12 months), Interest Coverage = Adjusted EBITDA / Cash Interest Expense, Fixed Charge Coverage = (Adjusted EBITDA - CapEx - Taxes) / (Interest + Scheduled Principal + Distributions), Current Ratio = Current Assets / Current Liabilities, Minimum Liquidity = Cash + Available Revolver
4. Compare each calculated ratio to its covenant threshold and compute headroom = (current value - threshold) / threshold
5. Project each ratio for the next 4 quarters using the FP&A forecast to identify prospective breaches
6. Stress-test by applying a 15% EBITDA decline and a 200bps rate increase to floating-rate debt
7. For any covenant projected to breach, identify the financial metric that must improve and by how much
8. Document cure rights, equity cure provisions, and waiver request timelines

### Output Structure
- **Covenant Inventory**: All financial covenants listed by credit facility with threshold values and testing frequency
- **Current Compliance Status**: Computed ratio vs. threshold for each covenant with pass/fail designation
- **Headroom Analysis**: Absolute and percentage cushion for each covenant, ranked from tightest to widest
- **Forward Compliance Projection**: Projected covenant ratios for the next 4 quarters under base and stress scenarios
- **Breach Risk Assessment**: Covenants at risk with estimated quarter of potential breach and required metric improvement
- **Remediation Options**: Available cure rights, potential operational levers, and recommended preemptive actions`,
    tags: ['finance', 'debt', 'covenants', 'compliance', 'credit', 'banking'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-investor-update',
    name: 'Investor Update',
    description: `### Tasks Required
- Compile key financial metrics for the quarter: revenue, ARR/MRR, EBITDA, cash balance, and burn rate
- Summarize major operational milestones: product launches, customer wins, partnerships, and team hires
- Provide market context: competitive landscape developments, regulatory changes, and macroeconomic factors
- Articulate the forward outlook: next quarter priorities, guidance, and capital deployment plans
- Draft a professional letter suitable for distribution to investors and board members

### Data Sources
- **Internal FP&A / ERP** (SAP, NetSuite, Adaptive) — actual financial results, KPIs, and budget-to-actual comparisons
- **CRM** (Salesforce, HubSpot) — new customer logos, expansion revenue, pipeline metrics, and churn data
- **Product / Engineering Dashboards** (Jira, Linear) — product roadmap milestones, feature launches, and technical achievements
- **HR System** (Workday, Rippling) — headcount changes, key hires, and organizational updates
- **Market Intelligence** (Gartner, Crunchbase, news feeds) — competitor funding rounds, product launches, and market developments

### Computation Process
1. Pull final financial results for the quarter: revenue, gross margin, EBITDA, net income, and cash position
2. Calculate key SaaS/growth metrics if applicable: ARR, MRR growth, net dollar retention, CAC payback, and burn multiple
3. Compare results to the prior quarter, prior year quarter, and budget/forecast
4. Compile a milestone tracker: customer wins (logo count and ARR added), product releases, partnerships signed, and key hires
5. Summarize market developments that impact the business: competitor moves, regulatory updates, and macro trends
6. Draft the forward outlook section: next quarter revenue guidance range, key initiatives, planned investments, and risk factors
7. Include a capital summary: cash runway, upcoming financing needs, and use-of-proceeds update (if recently funded)
8. Structure the letter in a professional investor-communication format with consistent tone and appropriate detail level

### Output Structure
- **Financial Highlights**: Top-line metrics with quarter-over-quarter and year-over-year comparisons
- **Key Performance Indicators**: Operational KPIs with trend indicators (improving, stable, declining)
- **Business Milestones**: Major customer wins, product launches, and strategic accomplishments
- **Market & Competitive Update**: Relevant industry developments and competitive positioning
- **Team & Organization**: Key hires, headcount growth, and organizational changes
- **Forward Outlook**: Next quarter priorities, revenue guidance, and strategic initiatives
- **Capital & Fundraising Update**: Cash position, runway, and planned capital activities`,
    tags: [
      'finance',
      'investor relations',
      'reporting',
      'fundraising',
      'communications',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  // Real Estate
  {
    id: 'default-cam-reconciliation',
    name: 'CAM Reconciliation',
    description: `### Tasks Required
- Collect actual year-end operating expense invoices and GL detail for each property
- Pull estimated CAM budgets and monthly billing schedules from lease abstracts
- Calculate each tenant's pro-rata share based on GLA or NRA occupancy
- Compare estimated billings to actual costs and compute over/under amounts per tenant
- Generate reconciliation statements and credit/debit memos for distribution

### Data Sources
- **Property Management System** (Yardi / MRI / AppFolio) — actual expense ledgers, tenant billing history, and lease terms
- **Lease Abstracts** — pro-rata share methodology, CAM cap provisions, exclusions, and gross-up clauses
- **Vendor Invoices & Contracts** — supporting detail for each operating expense line item
- **Prior-Year Reconciliations** — comparison baseline and trend context

### Computation Process
1. Extract actual operating expenses by GL account for the reconciliation period
2. Classify expenses as recoverable vs. non-recoverable per lease terms
3. Apply gross-up adjustments for properties below stabilized occupancy
4. Calculate each tenant's pro-rata share using the lease-specified method (GLA share, NRA share, or fixed percentage)
5. Apply CAM caps and exclusion clauses per individual lease
6. Compare calculated tenant share to amounts actually billed during the period
7. Compute net adjustment (credit or additional charge) per tenant
8. Validate totals — sum of tenant shares plus landlord share equals total actual costs

### Output Structure
- **Expense Summary by Category**: Actual vs. budget for taxes, insurance, utilities, R&M, janitorial, management fee, landscaping, snow removal, security
- **Tenant-Level Reconciliation Schedule**: Tenant name, suite, GLA, pro-rata share %, estimated billings, actual share, net adjustment
- **CAM Cap Impact Analysis**: Tenants with capped recoveries and landlord-absorbed overages
- **Variance Commentary**: Explanation of material budget-to-actual deviations by expense category
- **Reconciliation Statements**: Tenant-ready letters with supporting schedules for distribution`,
    tags: [
      'real estate',
      'realestate',
      'cam',
      'property management',
      'commercial',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-noi-analysis',
    name: 'NOI Analysis',
    description: `### Tasks Required
- Compile gross potential rent (GPR) from rent roll data for each property
- Calculate effective gross income (EGI) by adjusting for vacancy, concessions, and other income
- Aggregate operating expenses by category from the property GL
- Compute NOI, NOI margin, and NOI per square foot
- Compare results to prior periods, budget, and market benchmarks

### Data Sources
- **Rent Roll** — current base rents, percentage rent, antenna/signage income, and parking revenue
- **Property Management System** (Yardi / MRI) — GL-level income and expense detail, vacancy loss, and concession tracking
- **Budget / Pro Forma** — approved operating budget for variance analysis
- **Market Comps** (CoStar / CBRE Research) — NOI per SF and expense ratios for comparable properties

### Computation Process
1. Sum gross potential rent from all occupied and vacant units at market rate
2. Deduct vacancy and credit loss to arrive at net rental income
3. Add other income: CAM recoveries, percentage rent, parking, late fees, and miscellaneous
4. Total these items to produce effective gross income (EGI)
5. Aggregate operating expenses: real estate taxes, insurance, utilities, repairs & maintenance, management fees, janitorial, landscaping, administrative, and professional fees
6. Subtract total operating expenses from EGI to compute NOI
7. Calculate NOI margin (NOI / EGI) and NOI per SF (NOI / GLA)
8. Perform YoY comparison and variance-to-budget analysis

### Output Structure
- **Income Breakdown**: GPR, vacancy loss, concessions, other income, and EGI with period-over-period change
- **Expense Detail by Category**: Each OpEx line with actual, budget, variance, and per-SF metrics
- **NOI Summary**: NOI, NOI margin, NOI/SF for current and prior periods
- **Property Comparison Matrix**: Side-by-side NOI metrics across portfolio properties
- **Trend Analysis**: Trailing 12-month NOI trend with commentary on drivers`,
    tags: [
      'real estate',
      'realestate',
      'noi',
      'income',
      'property performance',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-rent-roll',
    name: 'Rent Roll Review',
    description: `### Tasks Required
- Extract current rent roll data from the property management system for each asset
- Compile tenant roster with suite, GLA, lease dates, base rent, escalation schedule, and options
- Calculate portfolio-level metrics: occupancy, WALT, average rent PSF, and in-place vs. market rent
- Map lease expiration schedule and identify rollover concentration risk
- Flag below-market leases and quantify mark-to-market upside

### Data Sources
- **Property Management System** (Yardi / MRI / AppFolio) — tenant master, lease terms, billing schedules, and payment history
- **Lease Abstracts** — renewal options, termination rights, expansion rights, and co-tenancy clauses
- **Market Rent Surveys** (CoStar / Cushman & Wakefield) — asking and effective rents by submarket and property class
- **CRM** (Twenty CRM) — tenant contact information and relationship notes

### Computation Process
1. Pull active leases and compile tenant name, suite, GLA, lease start/end, base rent (annual and PSF), and escalation type
2. Calculate physical occupancy (occupied GLA / total GLA) and economic occupancy (actual rent collected / GPR)
3. Compute weighted average lease term (WALT) using annual rent as the weighting factor
4. Build lease expiration schedule by year and by quarter for the next 5 years
5. Compare in-place rent PSF to current market asking rent PSF to identify below-market and above-market leases
6. Quantify mark-to-market opportunity: (market rent - in-place rent) x GLA for each below-market lease
7. Assess tenant credit quality distribution and flag any tenants on watchlist
8. Identify leases with near-term expiration (12 months) and no renewal option exercised

### Output Structure
- **Tenant Roster**: Full listing with suite, GLA, lease term, base rent, escalation, and expiration date
- **Occupancy Summary**: Physical and economic occupancy by property and portfolio-wide
- **WALT & Rent Metrics**: Weighted average lease term, average in-place rent PSF, and rent spread to market
- **Lease Expiration Schedule**: Annual and quarterly rollover by GLA and rent, with renewal probability estimates
- **Mark-to-Market Analysis**: Below-market leases ranked by upside opportunity with estimated reversion rent`,
    tags: [
      'real estate',
      'realestate',
      'rent roll',
      'leasing',
      'occupancy',
      'tenants',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-cap-rate',
    name: 'Cap Rate Analysis',
    description: `### Tasks Required
- Calculate going-in cap rate for each property using stabilized NOI and acquisition price or current appraised value
- Gather market cap rate comps by property type, class, and submarket
- Analyze cap rate trends over the trailing 3-5 year period
- Estimate implied property values under varying cap rate assumptions
- Assess portfolio-level weighted average cap rate

### Data Sources
- **NOI Analysis Output** — stabilized net operating income for each asset
- **Transaction Comps** (CoStar / Real Capital Analytics) — recent sales with cap rates by property type and geography
- **Appraisal Reports** — most recent third-party appraised values and cap rate indications
- **Broker Research** (CBRE / JLL / Cushman) — market cap rate surveys and investor sentiment reports
- **Portfolio Records** — original acquisition prices, closing dates, and capital improvements

### Computation Process
1. Determine stabilized NOI for each property (trailing 12-month actual or forward projection)
2. Calculate going-in cap rate: NOI / acquisition price (or current market value)
3. Calculate current yield: current NOI / most recent appraised or estimated value
4. Compile comparable transaction cap rates from the same submarket and property type
5. Adjust comps for differences in quality, tenancy, lease term, and condition
6. Compute cap rate spread: portfolio cap rate vs. market average cap rate
7. Build sensitivity matrix showing implied values at cap rates ranging +/- 100 bps from current
8. Analyze historical cap rate movement to identify compression or expansion trends

### Output Structure
- **Property-Level Cap Rates**: Going-in cap rate, current yield, and implied value for each asset
- **Market Comp Summary**: Comparable transactions with adjusted cap rates by submarket
- **Cap Rate Sensitivity Matrix**: Implied property values at 25 bps increments across a range of cap rates
- **Trend Analysis**: Historical cap rate movement by property type with market context
- **Portfolio Summary**: Weighted average cap rate, spread to market, and value impact of cap rate shifts`,
    tags: ['real estate', 'realestate', 'cap rate', 'valuation', 'investment'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-lease-abstracting',
    name: 'Lease Abstracting',
    description: `### Tasks Required
- Obtain executed lease documents including all amendments, addenda, and side letters
- Extract key financial terms: base rent, escalations, percentage rent, CAM/tax/insurance recovery structure
- Capture tenant rights: renewal options, expansion options, termination rights, ROFO/ROFR, co-tenancy
- Document landlord obligations: TI allowance, free rent, capital repair responsibilities, exclusivity
- Organize extracted terms into a standardized abstract template for portfolio tracking

### Data Sources
- **Lease Documents** — executed leases, amendments, commencement date agreements, SNDAs, and guaranty agreements
- **Document Management System** — centralized repository for all lease-related files
- **Property Management System** (Yardi / MRI) — existing lease data for cross-reference and gap identification
- **Legal Counsel Notes** — interpretation guidance on ambiguous clauses or non-standard provisions

### Computation Process
1. Review the full lease document including all amendments in chronological order
2. Extract premises identification: suite number, GLA, building, and property address
3. Capture lease term: commencement date, expiration date, and any early occupancy or fixturing periods
4. Document rent structure: base rent schedule with all escalation steps (fixed, CPI-based, or fair market value)
5. Record recovery obligations: tenant's pro-rata share, base year or net stop, CAM caps, and exclusions
6. Identify all option rights with notice deadlines: renewal terms, expansion spaces, termination fees, ROFO/ROFR
7. Note concessions and incentives: TI allowance (amount and disbursement method), free rent months, moving allowance
8. Catalog operational clauses: permitted use, hours of operation, signage rights, parking allocation, assignment/subletting restrictions
9. Flag critical dates and deadlines for calendar tracking

### Output Structure
- **Lease Summary Header**: Tenant, suite, GLA, lease term, commencement, expiration, guarantor
- **Financial Terms**: Base rent schedule (annual and PSF), escalation type, percentage rent breakpoint, security deposit
- **Recovery Structure**: Recovery type (NNN, modified gross, full service), base year, pro-rata share %, caps and exclusions
- **Tenant Options & Rights**: Renewal, expansion, termination, ROFO/ROFR with deadlines and exercise terms
- **Concessions & Obligations**: TI allowance, free rent, landlord work, capital repair responsibilities
- **Critical Date Calendar**: Option notice dates, expiration, escalation dates, and insurance renewal deadlines`,
    tags: [
      'real estate',
      'realestate',
      'lease',
      'legal',
      'commercial',
      'contracts',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-property-valuation',
    name: 'Property Valuation',
    description: `### Tasks Required
- Gather property-level financial data: rent roll, operating statements, and capital expenditure history
- Perform income approach valuation using direct capitalization and DCF analysis (10-year hold)
- Perform sales comparison approach with adjusted comparable transactions
- Perform cost approach estimating replacement cost new less depreciation plus land value
- Reconcile the three approaches and present a value conclusion with confidence range

### Data Sources
- **Rent Roll & Operating Statements** — in-place income, vacancy, and trailing 12-month expenses
- **Property Management System** (Yardi / MRI) — historical financial performance and capital spend
- **Transaction Comps** (CoStar / Real Capital Analytics) — recent comparable sales with pricing detail
- **Market Data** (CoStar / CBRE / REIS) — market rents, vacancy rates, cap rates, and absorption trends
- **Construction Cost Databases** (Marshall & Swift / RSMeans) — replacement cost estimates by property type
- **County Assessor / Tax Records** — land values, assessed values, and tax history
- **Appraisal Reports** — prior third-party appraisals for baseline and methodology reference

### Computation Process
1. **Income Approach — Direct Capitalization**: Stabilize NOI using market vacancy and expense ratios, then divide by market cap rate
2. **Income Approach — DCF**: Project 10-year cash flows with rent growth, renewal probability, downtime, TI/LC costs, and capital reserves; discount at market-derived rate; add reversion value at exit cap rate
3. **Sales Comparison Approach**: Select 4-6 comparable transactions; adjust for property rights, financing, conditions of sale, location, physical characteristics, and market timing; reconcile adjusted price PSF
4. **Cost Approach**: Estimate land value from comparable land sales; calculate replacement cost new using cost databases; deduct physical deterioration, functional obsolescence, and external obsolescence
5. Reconcile all three indications giving appropriate weight based on property type and data quality
6. Perform sensitivity analysis varying cap rate, discount rate, rent growth, and exit assumptions
7. Present final value conclusion as a point estimate with a confidence range

### Output Structure
- **Income Approach Summary**: Direct cap value, DCF value, key assumptions (cap rate, discount rate, exit cap, rent growth)
- **DCF Cash Flow Schedule**: Year-by-year NOI, capital costs, net cash flow, reversion, and present value
- **Sales Comparison Grid**: Comparable sales with adjustment matrix and adjusted price PSF
- **Cost Approach Breakdown**: Land value, replacement cost new, depreciation deductions, and indicated value
- **Reconciliation & Value Conclusion**: Weighted value indication, confidence range, and methodology rationale
- **Sensitivity Analysis**: Value output across ranges of cap rate (+/- 50 bps), discount rate, and rent growth assumptions

### Required Sub-Skills
- **NOI Analysis**: Produces the stabilized NOI input required for direct capitalization and DCF
- **Cap Rate Analysis**: Provides market cap rates and comparable transaction data for income approach calibration
- **Rent Roll Review**: Supplies in-place lease data, WALT, and mark-to-market analysis for cash flow projections
- **Market Survey**: Delivers submarket rent comps, vacancy trends, and demand drivers to support growth assumptions

### MCP Services & Integrations
- **Yardi / MRI Software**: Property-level financial data extraction — historical income, expenses, and capital spend
- **CoStar / Real Capital Analytics**: Transaction comps, market cap rates, and property-level sales data
- **REIS / CoStar Market Analytics**: Submarket rent forecasts, vacancy projections, and absorption data
- **Marshall & Swift / RSMeans**: Construction cost estimation for the cost approach
- **County Assessor Databases**: Land value comps and tax assessment records
- **Twenty CRM**: Broker contacts, comparable sale sourcing, and deal pipeline tracking`,
    tags: ['real estate', 'realestate', 'valuation', 'appraisal', 'investment'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-tenant-credit',
    name: 'Tenant Credit Review',
    description: `### Tasks Required
- Collect tenant financial statements (income statement, balance sheet, cash flow) for the trailing 2-3 years
- Pull commercial credit reports and scores from reporting agencies
- Analyze payment history from the property management system
- Calculate key financial ratios and compare to industry benchmarks
- Assign an internal credit rating and recommend appropriate lease security provisions

### Data Sources
- **Tenant Financial Statements** — audited or reviewed annual financials, interim statements, and tax returns
- **Credit Reporting Agencies** (D&B / Experian Business) — commercial credit scores, payment behavior, and public filings
- **Property Management System** (Yardi / MRI) — tenant payment history, delinquency records, and outstanding balances
- **Industry Databases** (IBIS World / S&P Capital IQ) — sector risk profiles and peer financial benchmarks
- **Public Filings** — SEC filings for public tenants, UCC filings, liens, and bankruptcy records

### Computation Process
1. Review the most recent 2-3 years of financial statements for revenue trends, profitability, and cash generation
2. Calculate liquidity ratios: current ratio, quick ratio, and cash coverage ratio
3. Calculate leverage ratios: debt-to-equity, total liabilities-to-assets, and interest coverage (EBITDA / interest expense)
4. Analyze rent-to-revenue ratio: annual rent obligation as a percentage of tenant's total revenue
5. Review commercial credit score and payment history — identify any slow-pay patterns or derogatory items
6. Assess qualitative factors: industry outlook, management stability, customer concentration, and geographic diversification
7. Map findings to an internal credit rating scale (e.g., A/B/C/D or investment-grade/non-investment-grade)
8. Determine recommended security provisions: months of security deposit, letter of credit, or personal guaranty

### Output Structure
- **Tenant Profile**: Company name, industry, years in operation, number of locations, and parent/guarantor
- **Financial Ratio Summary**: Key ratios with trend direction and comparison to industry medians
- **Credit Score & Payment History**: Commercial credit score, Paydex or equivalent, and AR aging from property records
- **Risk Assessment Matrix**: Qualitative and quantitative risk factors scored on a standardized scale
- **Credit Rating & Recommendation**: Internal rating, recommended security deposit or LC amount, and suggested lease term limitations`,
    tags: ['real estate', 'realestate', 'tenant', 'credit', 'risk', 'leasing'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-construction-draw',
    name: 'Construction Draw',
    description: `### Tasks Required
- Receive and log draw request from contractor with schedule of values and completion percentages
- Verify percentage completion by trade against site inspection reports and photographs
- Collect and validate conditional and unconditional lien waivers from all subcontractors and suppliers
- Reconcile draw request to approved budget and track cumulative costs by line item
- Calculate retainage, remaining budget, and contingency balance; flag overruns and schedule variances

### Data Sources
- **Contractor AIA G702/G703 Forms** — application for payment with schedule of values and percentage complete
- **Construction Management Platform** (Procore / Buildertrend / CMiC) — project schedule, RFIs, change orders, and cost tracking
- **Site Inspection Reports** — third-party inspector or owner's rep verification of work-in-place
- **Lien Waiver Documentation** — conditional and unconditional waivers from GC, subs, and material suppliers
- **Approved Budget & Change Orders** — original construction budget plus approved change order log

### Computation Process
1. Review submitted G702/G703 and compare claimed completion percentages to prior draw
2. Cross-reference completion claims against independent inspection report and site photographs
3. Verify all required lien waivers are collected for the prior draw period before approving current draw
4. Check for approved change orders that modify the schedule of values — incorporate into budget baseline
5. Calculate current draw amount: (cumulative completion % x contract value) - prior draws - retainage
6. Apply retainage withholding per contract terms (typically 5-10% until substantial completion)
7. Compute remaining budget by line item: original budget + change orders - cumulative draws
8. Flag any line items where cumulative costs exceed budget or where remaining budget is insufficient for remaining work
9. Validate total draw against lender's construction loan disbursement schedule

### Output Structure
- **Draw Summary**: Draw number, period, requested amount, approved amount, cumulative to date, and retainage held
- **Schedule of Values Detail**: Line-by-line breakdown with original budget, change orders, cumulative billed, current draw, retainage, and remaining
- **Lien Waiver Tracker**: Status of waivers by subcontractor (conditional/unconditional, received/outstanding)
- **Budget Variance Report**: Line items with cost overruns, percent over budget, and impact on contingency
- **Project Status Dashboard**: Overall completion percentage, days ahead/behind schedule, contingency remaining, and risk flags`,
    tags: [
      'real estate',
      'realestate',
      'construction',
      'development',
      'project management',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-deal-underwriting',
    name: 'Deal Underwriting',
    description: `### Tasks Required
- Gather property-level data: rent roll, T-12 operating statements, capital expenditure history, and offering memorandum
- Model acquisition cost basis: purchase price, closing costs, capex budget, and TI/LC reserves
- Structure capital stack: senior debt terms (LTV, rate, amortization, IO period), mezzanine or preferred equity, and sponsor equity
- Build a multi-year pro forma: project rental income with lease-up, market rent growth, vacancy, and operating expenses
- Calculate investment returns: levered and unlevered IRR, equity multiple, cash-on-cash yield, and MOIC
- Perform sensitivity and scenario analysis on key assumptions

### Data Sources
- **Offering Memorandum / Investment Brief** — property overview, seller's pro forma, and asking price
- **Rent Roll & T-12 Operating Statements** — in-place income and trailing expense data
- **Market Data** (CoStar / REIS / CBRE) — market rents, vacancy, absorption, cap rates, and comparable transactions
- **Lender Term Sheets** — senior debt quotes with LTV, rate, DSCR requirements, and fee structure
- **Property Condition Reports** — engineering assessments, environmental Phase I/II, and capital needs
- **Lease Abstracts** — detailed tenant terms for cash flow modeling
- **Tax & Insurance Quotes** — projected real estate taxes and insurance premiums

### Computation Process
1. Establish purchase price and total cost basis (price + closing costs + immediate capex + reserves)
2. Underwrite year-one income: in-place rents, contractual escalations, vacancy loss, and other income
3. Project rental revenue over the hold period using market rent growth, lease rollover assumptions (renewal probability, downtime, TI/LC costs), and absorption schedule for vacant space
4. Model operating expenses with inflation factors by category; apply management fee as percentage of EGI
5. Calculate NOI for each year of the hold period
6. Layer in capital expenditures: tenant improvements, leasing commissions, and building capital reserves
7. Model debt service: interest and principal payments based on loan terms; calculate DSCR by year
8. Compute annual levered cash flow (NOI - capex - debt service) and cash-on-cash return
9. Model exit: apply exit cap rate to forward NOI, deduct disposition costs and loan payoff
10. Calculate unlevered and levered IRR, equity multiple, and MOIC using the full cash flow stream
11. Run sensitivity analysis: vary purchase price, exit cap rate, rent growth, vacancy, and interest rate

### Output Structure
- **Deal Summary**: Property overview, pricing, cost basis, and capital stack breakdown
- **Sources & Uses**: Total capital required, debt proceeds, equity contribution, and closing cost detail
- **Pro Forma Cash Flow**: Year-by-year income, expenses, NOI, capex, debt service, and levered cash flow
- **Return Metrics**: Levered IRR, unlevered IRR, equity multiple, MOIC, cash-on-cash yield, and average DSCR
- **Sensitivity Tables**: IRR and equity multiple grids across purchase price/exit cap, rent growth/vacancy, and LTV/interest rate scenarios
- **Investment Memo**: Executive summary with thesis, key risks, mitigants, and recommendation

### Required Sub-Skills
- **NOI Analysis**: Validates the income and expense underwriting against historical performance
- **Rent Roll Review**: Provides granular lease-level data for cash flow projections and rollover modeling
- **Cap Rate Analysis**: Establishes market-based going-in and exit cap rate assumptions
- **Property Valuation**: Cross-checks the purchase price against independent valuation methods
- **Market Survey**: Supports rent growth, vacancy, and absorption assumptions with submarket data
- **RE Debt Financing**: Models the optimal financing structure and compares lender term sheets
- **Tenant Credit Review**: Assesses credit risk of major tenants that drive the income stream

### MCP Services & Integrations
- **Yardi / MRI Software**: Historical property financial data, rent roll export, and operating expense detail
- **CoStar / Real Capital Analytics**: Transaction comps for pricing validation and exit cap rate assumptions
- **REIS / CoStar Market Analytics**: Submarket rent and vacancy forecasts for pro forma assumptions
- **Lender Platforms / Term Sheet Database**: Debt quotes, rate benchmarks, and financing structure comparison
- **Twenty CRM**: Broker relationships, deal pipeline tracking, and investment committee workflow
- **Procore / Construction Platforms**: Capital improvement cost estimates and project timeline data (for value-add deals)`,
    tags: [
      'real estate',
      'realestate',
      'underwriting',
      'acquisition',
      'investment',
      'irr',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-opex-benchmarking',
    name: 'OpEx Benchmarking',
    description: `### Tasks Required
- Extract operating expense data by category for each property from the property management system
- Normalize expenses to per-square-foot (PSF) and per-unit metrics for cross-property comparison
- Compile industry benchmark data by property type, class, region, and age
- Identify properties and expense categories with above-benchmark costs
- Analyze 3-5 year expense trends and recommend cost reduction initiatives

### Data Sources
- **Property Management System** (Yardi / MRI / AppFolio) — GL-level operating expense detail by property
- **Industry Benchmarks** (BOMA Experience Exchange / IREM Income/Expense Analysis) — expense benchmarks by property type and region
- **Utility Providers** — detailed consumption and rate data for energy, water, and waste
- **Vendor Contracts** — service agreements for janitorial, security, landscaping, and maintenance
- **Internal Portfolio Data** — historical expense data for same-store comparison across owned assets

### Computation Process
1. Extract actual operating expenses by GL category for the analysis period
2. Normalize all expenses to PSF using GLA or NRA as the denominator
3. Group expenses into standard categories: real estate taxes, insurance, utilities (electric, gas, water), janitorial, security, repairs & maintenance, landscaping, management fee, administrative, and other
4. Pull benchmark data for comparable properties (same type, class, geography, and age cohort)
5. Calculate variance to benchmark for each category: (actual PSF - benchmark PSF) / benchmark PSF
6. Rank properties by total OpEx PSF and identify outliers (properties above the 75th percentile)
7. Analyze year-over-year expense growth rates by category and compare to CPI and sector-specific inflation
8. Identify specific cost reduction opportunities with estimated annual savings

### Output Structure
- **Portfolio OpEx Summary**: Total OpEx, OpEx PSF, and OpEx as percentage of EGI for each property
- **Category-Level Benchmarking**: Actual PSF vs. benchmark PSF by expense category with variance and percentile ranking
- **Outlier Properties**: Assets with above-benchmark costs, ranked by magnitude of overspend
- **Trend Analysis**: 3-5 year expense growth rates by category with comparison to inflation indices
- **Cost Reduction Recommendations**: Specific initiatives (contract renegotiation, energy retrofit, service consolidation) with estimated annual savings and implementation timeline`,
    tags: [
      'real estate',
      'realestate',
      'opex',
      'benchmarking',
      'property management',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-portfolio-performance',
    name: 'Portfolio Performance',
    description: `### Tasks Required
- Aggregate property-level financial and operational data across the entire portfolio
- Calculate total returns: income return (cash yield) plus capital appreciation
- Track key operational metrics: occupancy, retention rate, leasing velocity, and WALT
- Compute same-store NOI growth to isolate organic performance from acquisitions/dispositions
- Provide return attribution by property type, geography, vintage year, and investment strategy

### Data Sources
- **Property Management System** (Yardi / MRI) — property-level income, expenses, NOI, and occupancy
- **Accounting System** — capital account balances, equity contributions, distributions, and unrealized gains
- **Appraisal Reports** — periodic property valuations for capital appreciation calculation
- **Rent Roll Data** — lease-level detail for occupancy, WALT, and retention analysis
- **Benchmark Indices** (NCREIF / ODCE / MSCI) — institutional RE return benchmarks by property type and geography

### Computation Process
1. Calculate income return for each property: annual cash distributions / beginning-of-period equity
2. Calculate capital appreciation: (ending value - beginning value - net capital invested) / beginning equity
3. Compute total return: income return + capital appreciation, time-weighted for interim cash flows
4. Determine same-store NOI growth: YoY NOI change for properties held in both periods (exclude acquisitions, dispositions, and developments)
5. Measure portfolio occupancy (physical and economic) and track period-over-period change
6. Calculate tenant retention rate: renewed GLA / expiring GLA for the period
7. Measure leasing velocity: new leases signed (GLA) per quarter and average days on market
8. Perform return attribution: decompose total portfolio return by property type, geography, vintage, and manager
9. Compare portfolio returns to relevant benchmark indices

### Output Structure
- **Portfolio Dashboard**: Total return, income yield, capital appreciation, and same-store NOI growth
- **Operational Metrics**: Occupancy rate, WALT, retention rate, leasing velocity, and average rent PSF
- **Property-Level Scorecard**: Individual asset returns, NOI, occupancy, and status (stabilized, lease-up, repositioning)
- **Return Attribution**: Performance decomposition by property type, market, vintage year, and investment strategy
- **Benchmark Comparison**: Portfolio returns vs. NCREIF, ODCE, or custom benchmark with tracking error and alpha`,
    tags: [
      'real estate',
      'realestate',
      'portfolio',
      'performance',
      'returns',
      'reporting',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-debt-financing',
    name: 'RE Debt Financing',
    description: `### Tasks Required
- Collect lender term sheets and quotes for the subject property or portfolio
- Analyze and compare loan structures: LTV, DSCR, rate, amortization, IO period, and prepayment provisions
- Model debt service cash flows under fixed, floating, and interest-only scenarios
- Evaluate refinancing opportunities for existing loans approaching maturity
- Prepare a debt comparison matrix and financing recommendation for investment committee

### Data Sources
- **Lender Term Sheets** — proposed loan terms from banks, life companies, CMBS conduits, and debt funds
- **Property Financials** — stabilized NOI, appraised value, and trailing 12-month cash flow
- **Rate Benchmarks** (SOFR / Treasury / Swap Rates) — current benchmark rates and forward curves
- **Existing Loan Documents** — current mortgage terms, maturity dates, prepayment provisions, and covenant requirements
- **Property Management System** (Yardi / MRI) — debt tracking module with payment history and balance schedules

### Computation Process
1. Compile key terms from each lender quote: loan amount, LTV, rate (fixed/floating), spread, index, amortization, IO period, term, fees, prepayment (defeasance, yield maintenance, step-down), and recourse provisions
2. Calculate maximum loan proceeds based on the lower of LTV and DSCR constraints
3. Model annual debt service for each loan option: principal and interest payments over the loan term
4. Calculate DSCR by year (NOI / annual debt service) and debt yield (NOI / loan amount)
5. Compute all-in effective cost of capital including origination fees, rate lock costs, and exit fees
6. For floating-rate options, model cash flows under forward curve, +100 bps, and +200 bps rate scenarios
7. For refinancing analysis: compare current loan terms to market terms, calculate breakeven on prepayment penalty, and quantify annual cash flow improvement
8. Assess covenant headroom: DSCR, LTV, and debt yield covenants under base and stress scenarios

### Output Structure
- **Term Sheet Comparison Matrix**: Side-by-side comparison of all lender quotes across key terms
- **Loan Sizing Summary**: Maximum proceeds by LTV and DSCR constraint for each quote
- **Debt Service Schedule**: Annual and monthly P&I payments, balances, and DSCR for the recommended structure
- **Rate Scenario Analysis**: Cash flow impact under fixed, floating, IO, and stressed-rate scenarios
- **Refinancing Analysis**: Current vs. proposed terms, prepayment cost, NPV of savings, and breakeven period
- **Recommendation Memo**: Recommended financing structure with rationale, risk considerations, and IC-ready summary`,
    tags: [
      'real estate',
      'realestate',
      'debt',
      'financing',
      'mortgage',
      'lending',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-market-survey',
    name: 'Market Survey',
    description: `### Tasks Required
- Define the target submarket boundaries and competitive set of comparable properties
- Gather current rental comps: asking rents, effective rents, concession packages by property class
- Compile vacancy rates, absorption trends, and inventory statistics for the submarket
- Research the new supply pipeline: planned, under construction, and recently delivered projects
- Assess demand drivers: employment growth, population trends, major employers, and infrastructure projects

### Data Sources
- **Market Research Platforms** (CoStar / REIS / CBRE EA) — submarket statistics, rent comps, vacancy, absorption, and inventory
- **Broker Research Reports** (CBRE / JLL / Cushman / Newmark) — quarterly market overviews and forecast data
- **Census & BLS Data** — population growth, household formation, employment by sector, and wage trends
- **Municipal Planning Departments** — zoning changes, building permits, and entitled developments
- **County Assessor / Tax Records** — property details, ownership, and assessed values for competitive set
- **News & Economic Development Sources** — corporate relocations, infrastructure projects, and economic incentive programs

### Computation Process
1. Define submarket geography and identify the competitive set (properties of similar type, class, age, and size)
2. Compile rental comps: asking rent PSF, effective rent PSF (net of concessions), and concession months by property
3. Calculate submarket averages: weighted average asking rent, weighted average vacancy, and trailing 12-month net absorption
4. Map the supply pipeline: projects under construction (estimated delivery date, SF, developer) and entitled/planned projects
5. Calculate supply-demand balance: projected deliveries vs. trailing absorption rate to estimate months of supply
6. Analyze demand-side fundamentals: employment growth rate, largest employers, population growth, median household income, and commute patterns
7. Identify comparable transactions and leases for pricing context
8. Synthesize findings into a market outlook: bullish, neutral, or bearish with supporting rationale

### Output Structure
- **Submarket Overview**: Geography, total inventory (SF/units), property class mix, and competitive set summary
- **Rental Comp Survey**: Property-level asking rents, effective rents, concessions, occupancy, and year built
- **Vacancy & Absorption Trends**: Historical and current vacancy rate, net absorption (trailing 4 and 12 quarters), and trend direction
- **Supply Pipeline**: Projects under construction and planned, with delivery dates, sizes, and developers
- **Demand Driver Analysis**: Employment by sector, population growth, income trends, and infrastructure developments
- **Market Outlook & Risk Assessment**: Forward rent growth forecast, vacancy projection, supply risk, and key upside/downside scenarios`,
    tags: [
      'real estate',
      'realestate',
      'market research',
      'comps',
      'due diligence',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  // Accounting
  {
    id: 'default-invoice-processing',
    name: 'Invoice Processing',
    description: `### Tasks Required
- Retrieve incoming vendor invoices from email, portal, or AP inbox
- Perform 3-way match: invoice to purchase order to receiving document
- Validate GL account coding, cost center allocation, and tax treatment
- Check for duplicate invoices by vendor, amount, invoice number, and date
- Route through approval workflow based on dollar thresholds and delegation of authority
- Resolve pricing, quantity, and terms discrepancies with purchasing and vendors
- Post approved invoices to the AP subledger and schedule for payment

### Data Sources
- **AP Subledger** (ERP) — open payables, vendor master, payment terms
- **Purchase Order Module** (ERP) — PO details, line items, approved amounts
- **Receiving/Warehouse System** (ERP or WMS) — goods receipt confirmations, packing slips
- **Vendor Portal or Email Inbox** (document source) — incoming invoice images and PDFs
- **GL Chart of Accounts** (ERP) — valid account codes and cost center hierarchy

### Computation Process
1. Extract invoice header and line-item data via OCR or electronic data interchange (EDI)
2. Match invoice line items to corresponding PO lines and receiving documents
3. Flag tolerance exceptions: price variance > 2%, quantity variance > 0, missing receipt
4. Validate sales tax, use tax, or VAT treatment against jurisdiction rules
5. Apply GL coding rules based on expense category, department, and project
6. Calculate early payment discount availability (e.g., 2/10 net 30 terms)
7. Submit matched and coded invoices for manager approval per delegation matrix
8. Post approved invoices and update AP aging

### Output Structure
- **Match Results Summary**: Count of 3-way matched, 2-way matched, and unmatched invoices
- **Exception Report**: Invoices failing tolerance checks with variance details
- **Duplicate Detection Log**: Potential duplicate invoices flagged with match criteria
- **GL Coding Validation**: Invoices with invalid or missing account assignments
- **Discount Opportunity Report**: Available early-pay discounts with capture deadlines
- **Processing Metrics**: Average cycle time, SLA compliance rate, invoices per FTE`,
    tags: ['accounting', 'accounts payable', 'invoicing', 'ap', 'procurement'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-month-end-close',
    name: 'Month-End Close',
    description: `### Tasks Required
- Execute close checklist tasks in sequence with owner assignments and deadlines
- Record accruals for incurred-but-not-invoiced expenses (IBNI) and earned-but-unbilled revenue
- Amortize prepaid expenses and recognize deferred revenue per schedules
- Post standard recurring journal entries (depreciation, amortization, allocations)
- Record non-standard adjusting entries with supporting documentation
- Reconcile all balance sheet accounts to subledgers and third-party statements
- Perform flux analysis on P&L line items vs. budget and prior period
- Prepare close package with management commentary for controller review

### Data Sources
- **General Ledger** (ERP) — trial balance, journal entry detail, account balances
- **AP/AR Subledgers** (ERP) — outstanding payables, receivables, aging detail
- **Bank Statements** (banking portal) — month-end balances, transactions
- **Payroll System** (HRIS/payroll) — wage accruals, benefit allocations, tax liabilities
- **Fixed Asset Module** (ERP) — depreciation schedules, asset additions and disposals
- **Contract/Billing System** (CRM or billing) — deferred revenue schedules, milestone data
- **Budget/Forecast Model** (FP&A) — budget by account and cost center for variance analysis

### Computation Process
1. Run pre-close subledger-to-GL reconciliation to identify out-of-balance conditions
2. Calculate expense accruals using PO receipts without invoices and contractual obligations
3. Amortize prepaid assets and deferred revenue on straight-line or usage basis
4. Post depreciation, intercompany allocations, and corporate overhead entries
5. Reconcile each balance sheet account; investigate items > materiality threshold
6. Perform P&L flux analysis: actual vs. budget, actual vs. prior month, actual vs. prior year
7. Calculate key ratios: gross margin, operating margin, SGA as % of revenue
8. Compile close package with trial balance, reconciliations, JE log, and variance commentary

### Output Structure
- **Close Checklist Status**: Task-level completion tracker with owner, deadline, and status
- **Journal Entry Log**: All entries posted during close with descriptions and approvals
- **Balance Sheet Reconciliations**: Account-by-account reconciliation with supporting detail
- **Flux Analysis Report**: P&L variances by line item with root cause explanations
- **Close Package**: Consolidated deliverable for controller/CFO review and sign-off
- **Close Metrics**: Days to close, number of adjusting entries, open items carried forward

### Required Sub-Skills
- **Bank Reconciliation**: Reconcile cash accounts as prerequisite to close
- **Intercompany Recon**: Clear intercompany balances before consolidation
- **Fixed Asset Register**: Ensure depreciation is current before P&L close
- **Revenue Recognition**: Confirm ASC 606 entries are posted for the period
- **GL Account Recon**: All material accounts must be reconciled before close sign-off

### MCP Services & Integrations
- **NetSuite / SAP / QuickBooks** (ERP): GL posting, subledger data, trial balance extraction
- **BlackLine / FloQast**: Close task management, reconciliation workflow, sign-off tracking
- **Banking APIs** (Plaid, Yodlee): Automated bank statement retrieval for reconciliation
- **Workiva / Wdesk**: Close package assembly and review workflow
- **Payroll Providers** (ADP, Gusto, Rippling): Payroll accrual data and tax liability feeds`,
    tags: [
      'accounting',
      'month-end',
      'close',
      'journal entries',
      'reconciliation',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-bank-reconciliation',
    name: 'Bank Reconciliation',
    description: `### Tasks Required
- Obtain month-end bank statements for all cash accounts and entities
- Match bank transactions to GL entries using amount, date, and reference
- Identify and list outstanding checks not yet cleared by the bank
- Identify and list deposits in transit recorded in GL but not on bank statement
- Investigate and resolve unmatched or unreconciled items
- Record adjusting entries for bank fees, interest, and errors
- Age outstanding items and escalate stale-dated checks (> 90 days)

### Data Sources
- **Bank Statements** (banking portal or API) — cleared transactions, ending balances, fees
- **General Ledger Cash Accounts** (ERP) — book balance, posted transactions, check register
- **AP Check Register** (ERP) — issued checks with dates, payees, and amounts
- **AR Deposit Log** (ERP) — recorded deposits with reference numbers and dates
- **Prior Month Reconciliation** (workpaper) — carried-forward outstanding items

### Computation Process
1. Import bank statement transactions and GL cash account transactions for the period
2. Perform automated matching on check number, amount, and date within tolerance
3. Classify unmatched bank items: fees, interest income, returned items, wire transfers
4. Classify unmatched GL items: outstanding checks, deposits in transit, posting errors
5. Calculate adjusted bank balance: bank ending balance + deposits in transit - outstanding checks
6. Calculate adjusted book balance: GL ending balance + interest income - bank fees +/- errors
7. Verify adjusted bank balance equals adjusted book balance; investigate any difference
8. Age all outstanding items and flag checks outstanding > 90 days for void consideration

### Output Structure
- **Reconciliation Summary**: Bank balance, book balance, adjustments, reconciled balance
- **Outstanding Checks List**: Check number, date, payee, amount, days outstanding
- **Deposits in Transit**: Deposit date, reference, amount, expected clearing date
- **Bank Adjustments**: Fees, interest, returned items requiring GL entries
- **Stale-Dated Items**: Outstanding items > 90 days with recommended action
- **Reconciliation Sign-Off**: Preparer, reviewer, date, and disposition of exceptions`,
    tags: [
      'accounting',
      'bank reconciliation',
      'cash',
      'general ledger',
      'controls',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-ar-aging',
    name: 'AR Aging Report',
    description: `### Tasks Required
- Extract accounts receivable open items from the AR subledger as of period end
- Bucket outstanding invoices into aging categories: current, 1-30, 31-60, 61-90, 90+ days past due
- Calculate Days Sales Outstanding (DSO) and compare to target and prior periods
- Identify top delinquent accounts by balance and days overdue
- Assess collectibility and estimate bad debt reserve (allowance for doubtful accounts)
- Prepare collection action recommendations by account and aging bucket
- Reconcile AR subledger total to GL control account

### Data Sources
- **AR Subledger** (ERP) — open invoices, credit memos, customer payments, terms
- **Customer Master** (ERP/CRM) — payment history, credit limits, contact information
- **GL AR Control Account** (ERP) — book balance for reconciliation
- **Cash Receipts Journal** (ERP) — recent payments not yet applied
- **Historical Write-Off Data** (ERP) — prior period bad debt experience rates

### Computation Process
1. Pull all open AR items with invoice date, due date, amount, and customer
2. Calculate days past due = report date minus invoice due date
3. Assign each item to aging bucket based on days past due
4. Sum balances by bucket and by customer to produce the aging matrix
5. Calculate DSO = (ending AR / revenue for period) x days in period
6. Calculate weighted average days past due across the portfolio
7. Apply historical loss rates by aging bucket to estimate allowance for doubtful accounts
8. Compare current allowance to calculated reserve; recommend adjustment if material

### Output Structure
- **Aging Summary**: Total AR by bucket (current, 1-30, 31-60, 61-90, 90+) with percentages
- **Top Delinquent Accounts**: Largest past-due balances with customer name, amount, and aging
- **DSO Analysis**: Current DSO, trend over trailing 6 months, comparison to target
- **Bad Debt Reserve Calculation**: Reserve by aging bucket using historical loss rates
- **Collection Action Plan**: Recommended actions per account (call, demand letter, escalation)
- **Subledger-to-GL Reconciliation**: AR subledger total vs. GL control account balance`,
    tags: ['accounting', 'accounts receivable', 'ar', 'collections', 'dso'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-ap-aging',
    name: 'AP Aging Report',
    description: `### Tasks Required
- Extract accounts payable open items from the AP subledger as of period end
- Bucket outstanding payables by current, 1-30, 31-60, 61-90, and 90+ days
- Calculate Days Payable Outstanding (DPO) and compare to target and peers
- Identify invoices eligible for early payment discounts and calculate capture savings
- Flag overdue invoices at risk of late fees, vendor holds, or relationship damage
- Reconcile AP subledger total to GL AP control account
- Prepare cash requirements forecast based on AP aging and payment terms

### Data Sources
- **AP Subledger** (ERP) — open invoices, debit memos, vendor credits, payment terms
- **Vendor Master** (ERP) — payment terms, discount terms, vendor contacts, 1099 status
- **GL AP Control Account** (ERP) — book balance for reconciliation
- **Cash Position Report** (treasury) — available cash for payment scheduling
- **Purchase Order Module** (ERP) — PO commitments not yet invoiced

### Computation Process
1. Pull all open AP items with invoice date, due date, amount, vendor, and terms
2. Calculate days outstanding = report date minus invoice date (or due date for past-due aging)
3. Assign each item to aging bucket based on days outstanding
4. Sum balances by bucket and by vendor to produce the AP aging matrix
5. Calculate DPO = (ending AP / COGS for period) x days in period
6. Identify invoices with early payment discount terms (e.g., 2/10 net 30) still within window
7. Calculate annualized ROI of capturing each discount opportunity
8. Forecast cash outflows by week based on due dates and payment scheduling

### Output Structure
- **Aging Summary**: Total AP by bucket (current, 1-30, 31-60, 61-90, 90+) with percentages
- **DPO Analysis**: Current DPO, trend over trailing 6 months, benchmark comparison
- **Discount Opportunity Report**: Invoices eligible for discount with savings and deadline
- **Overdue Vendor Report**: Past-due invoices with vendor, amount, and escalation risk
- **Cash Requirements Forecast**: Projected AP disbursements by week for the next 4 weeks
- **Subledger-to-GL Reconciliation**: AP subledger total vs. GL control account balance`,
    tags: ['accounting', 'accounts payable', 'ap', 'vendor management', 'dpo'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-revenue-recognition',
    name: 'Revenue Recognition',
    description: `### Tasks Required
- Identify all revenue contracts executed or modified during the period
- Apply ASC 606 five-step model to each contract
- Identify distinct performance obligations within multi-element arrangements
- Determine transaction price including variable consideration and constraints
- Allocate transaction price to performance obligations using standalone selling prices
- Determine timing of recognition: point-in-time vs. over-time for each obligation
- Record revenue journal entries and update deferred revenue and unbilled AR schedules
- Document significant judgments and estimates for audit support

### Data Sources
- **Billing/Contract System** (CRM or billing platform) — contract terms, pricing, milestones
- **AR Subledger** (ERP) — billed amounts, cash collections, unbilled receivables
- **Deferred Revenue Schedule** (ERP or spreadsheet) — opening balance, additions, releases
- **Sales Order Module** (ERP) — order details, delivery dates, acceptance criteria
- **Standalone Selling Price (SSP) Database** — SSP analysis for allocation methodology

### Computation Process
1. **Step 1 — Identify the contract**: Verify approval, rights, payment terms, commercial substance
2. **Step 2 — Identify performance obligations**: Assess whether goods/services are distinct
3. **Step 3 — Determine transaction price**: Include fixed and variable consideration, apply constraint
4. **Step 4 — Allocate transaction price**: Use relative SSP method; apply residual approach if needed
5. **Step 5 — Recognize revenue**: Apply over-time criteria (input or output method) or point-in-time triggers
6. Roll forward deferred revenue: opening balance + billings - recognized revenue = closing balance
7. Roll forward unbilled AR: opening balance + recognized revenue - billings = closing balance
8. Prepare disclosure schedules: disaggregated revenue, remaining performance obligations, contract balances

### Output Structure
- **Contract Analysis Worksheet**: Five-step analysis for new and modified contracts
- **Revenue Waterfall**: Revenue recognized by performance obligation and timing
- **Deferred Revenue Roll-Forward**: Opening, additions, releases, and closing by contract
- **Unbilled Receivables Schedule**: Recognized revenue not yet billed, with expected billing dates
- **SSP Allocation Summary**: Standalone selling price analysis and allocation methodology
- **Judgment and Estimate Documentation**: Key assumptions, methodologies, and audit trail`,
    tags: [
      'accounting',
      'revenue recognition',
      'asc 606',
      'gaap',
      'compliance',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-fixed-asset-register',
    name: 'Fixed Asset Register',
    description: `### Tasks Required
- Record all asset additions with acquisition cost, date, useful life, and location
- Process asset disposals and retirements: calculate gain or loss on disposal
- Record asset transfers between departments, locations, or entities
- Calculate monthly/quarterly depreciation by asset and method
- Reconcile fixed asset subledger net book value (NBV) to GL control accounts
- Perform periodic physical inventory of fixed assets and reconcile to register
- Identify and evaluate assets for impairment under ASC 360

### Data Sources
- **Fixed Asset Module** (ERP) — asset master, acquisition details, depreciation schedules
- **GL Fixed Asset Accounts** (ERP) — asset cost, accumulated depreciation, NBV balances
- **Capital Expenditure Approvals** (procurement) — approved CARs with project and budget codes
- **AP Invoice Detail** (ERP) — invoices coded to capital accounts for asset additions
- **Physical Inventory Records** (operations) — asset tags, locations, condition assessments

### Computation Process
1. Identify new capital expenditures meeting capitalization threshold (e.g., > $5,000)
2. Assign asset class, useful life, salvage value, and depreciation method per policy
3. Calculate periodic depreciation: straight-line, declining balance, or units-of-production
4. For disposals: NBV = cost - accumulated depreciation; gain/loss = proceeds - NBV
5. Post depreciation expense to P&L and accumulated depreciation to balance sheet
6. Reconcile subledger totals (cost, accumulated depreciation, NBV) to GL control accounts
7. Compare physical inventory results to register; investigate and adjust for missing or untagged assets
8. Test long-lived assets for impairment: compare carrying amount to undiscounted future cash flows

### Output Structure
- **Asset Register Detail**: Complete listing with cost, date, class, useful life, method, NBV
- **Additions Report**: New assets capitalized during the period with source documentation
- **Disposals and Retirements**: Assets removed with gain/loss calculation
- **Depreciation Schedule**: Current period expense by asset class and department
- **Subledger-to-GL Reconciliation**: Cost, accumulated depreciation, and NBV tie-out
- **Physical Inventory Results**: Variances between register and physical count with resolution`,
    tags: [
      'accounting',
      'fixed assets',
      'depreciation',
      'asset management',
      'capex',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-intercompany-recon',
    name: 'Intercompany Recon',
    description: `### Tasks Required
- Extract intercompany receivable and payable balances for all entities as of period end
- Match intercompany invoices, payments, and cost allocations across entity pairs
- Identify and age unmatched or disputed intercompany items
- Investigate root causes of imbalances: timing differences, FX, posting errors
- Calculate and post intercompany elimination entries for consolidation
- Enforce intercompany settlement SLAs and escalate aged disputes
- Reconcile intercompany loan balances and interest accruals

### Data Sources
- **Intercompany Subledgers** (ERP) — IC receivables and payables by entity pair
- **GL Intercompany Accounts** (ERP) — balances across all entities in the group
- **Intercompany Invoice Register** (ERP) — issued and received IC invoices
- **Transfer Pricing Documentation** — allocation methodologies and arm's length pricing
- **FX Rate Tables** (treasury) — period-end and average exchange rates for currency conversion
- **Intercompany Loan Agreements** — principal, interest rate, repayment terms

### Computation Process
1. Extract IC balances from each entity's GL and present in a matrix format (entity vs. entity)
2. For each entity pair, net IC receivable against IC payable to identify imbalance
3. Match individual IC transactions by invoice number, amount (in functional currency), and date
4. Convert balances to common reporting currency using period-end FX rates
5. Isolate FX-driven differences from true reconciling items
6. Age unmatched items and classify: timing difference, posting error, disputed amount
7. Prepare elimination journal entries: debit IC payable, credit IC receivable per entity pair
8. Verify that all IC eliminations net to zero at the consolidated level

### Output Structure
- **IC Balance Matrix**: Entity-by-entity grid showing receivable, payable, and net difference
- **Matched Transactions**: Successfully reconciled IC items with references
- **Unmatched Items Report**: Open items by entity pair, amount, age, and root cause
- **FX Impact Analysis**: Currency-driven differences separated from operational variances
- **Elimination Entries**: Journal entries to eliminate IC balances for consolidation
- **SLA Compliance Dashboard**: Settlement timeliness, dispute aging, and resolution rates`,
    tags: [
      'accounting',
      'intercompany',
      'consolidation',
      'elimination',
      'multi-entity',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-tax-provision',
    name: 'Tax Provision',
    description: `### Tasks Required
- Calculate pre-tax book income with permanent and temporary difference adjustments
- Compute current federal, state, and foreign income tax expense
- Determine deferred tax assets (DTAs) and deferred tax liabilities (DTLs) from temporary differences
- Assess the need for a valuation allowance on deferred tax assets
- Prepare the effective tax rate (ETR) reconciliation from statutory to effective rate
- Calculate estimated quarterly tax payments using the annualized income method
- Document uncertain tax positions under ASC 740-10 (FIN 48)

### Data Sources
- **General Ledger** (ERP) — pre-tax book income, trial balance detail
- **Prior Year Tax Returns** — filed positions, NOL carryforwards, credit carryforwards
- **Tax Fixed Asset Register** — tax basis, tax depreciation (MACRS/Section 179/bonus)
- **Deferred Tax Roll-Forward** (workpaper) — prior period DTA/DTL balances and movements
- **State Apportionment Data** — revenue, payroll, and property factors by jurisdiction
- **Transfer Pricing Documentation** — intercompany pricing for international provisions

### Computation Process
1. Start with pre-tax book income from the trial balance
2. Identify permanent differences: meals and entertainment, stock compensation, tax-exempt income
3. Identify temporary differences: depreciation, accrued liabilities, deferred revenue, NOLs
4. Calculate current tax expense: (book income + permanent differences) x statutory rate by jurisdiction
5. Calculate deferred tax: change in temporary differences x enacted tax rate
6. Test DTAs for realizability: weight positive and negative evidence for valuation allowance
7. Compute ETR reconciliation: statutory rate +/- rate impact of each permanent item and rate differential
8. Apply ASC 740-10 two-step recognition and measurement for uncertain tax positions

### Output Structure
- **Current Tax Expense**: Federal, state, and foreign current tax by jurisdiction
- **Deferred Tax Schedule**: DTA and DTL balances by category with roll-forward
- **Valuation Allowance Assessment**: Positive/negative evidence analysis and conclusion
- **ETR Reconciliation**: Bridge from statutory rate to effective rate with each component
- **Quarterly Estimated Tax Calculation**: Annualized income method with installment payments
- **Uncertain Tax Position Summary**: Positions evaluated, recognition threshold, and reserve amounts`,
    tags: ['accounting', 'tax', 'tax provision', 'asc 740', 'compliance'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-gl-account-recon',
    name: 'GL Account Recon',
    description: `### Tasks Required
- Identify all GL accounts requiring reconciliation based on materiality and risk assessment
- Obtain supporting detail for each account: subledger, third-party statement, or schedule
- Compare GL balance to supporting detail and identify reconciling items
- Investigate and resolve differences exceeding materiality thresholds
- Document reconciling items with expected clearance dates and responsible parties
- Obtain preparer and reviewer sign-off per internal control requirements
- Escalate aged or unexplained reconciling items to management

### Data Sources
- **General Ledger** (ERP) — account balances, transaction detail, posting history
- **AP/AR Subledgers** (ERP) — open item detail for payable and receivable accounts
- **Bank Statements** (banking portal) — cash account support
- **Payroll Reports** (HRIS) — accrued compensation, benefits, tax liabilities
- **Amortization Schedules** (workpapers) — prepaids, deferred revenue, intangibles
- **Prior Period Reconciliations** (workpapers) — carried-forward reconciling items

### Computation Process
1. Generate a risk-ranked list of all balance sheet accounts by materiality and complexity
2. Extract GL ending balance and transaction detail for each account
3. Obtain supporting detail: subledger report, vendor/bank statement, or internal schedule
4. Perform item-level or balance-level comparison depending on account type
5. Identify reconciling items: timing differences, posting errors, reclassifications needed
6. Classify each item: cleared in subsequent period, requires adjusting entry, or under investigation
7. Calculate net unreconciled difference and compare to account-level materiality threshold
8. Update reconciliation status tracker with completion date, preparer, and reviewer

### Output Structure
- **Reconciliation Summary Dashboard**: Account-level status (complete, in progress, overdue)
- **Account Detail Workpapers**: GL balance, supporting balance, reconciling items per account
- **Aged Reconciling Items**: Items open > 30 days with owner, root cause, and expected resolution
- **Adjusting Entry Recommendations**: Journal entries needed to correct identified differences
- **Risk Assessment Matrix**: Accounts ranked by materiality, complexity, and error history
- **Sign-Off Log**: Preparer, reviewer, date completed, and exceptions noted`,
    tags: [
      'accounting',
      'general ledger',
      'reconciliation',
      'controls',
      'balance sheet',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-expense-report-audit',
    name: 'Expense Report Audit',
    description: `### Tasks Required
- Select expense reports for audit using risk-based sampling methodology
- Verify that all required receipts and documentation are attached
- Validate that expenses comply with corporate travel and expense policy
- Check proper manager approval per delegation of authority matrix
- Verify GL account and cost center coding accuracy
- Flag out-of-policy items: over per diem, luxury upgrades, personal expenses, split transactions
- Calculate correct reimbursement amounts after policy adjustments
- Report audit findings and compliance metrics to management

### Data Sources
- **Expense Management System** (Concur, Expensify, Brex) — submitted reports, receipts, approvals
- **Corporate T&E Policy** (internal document) — per diem rates, category limits, required approvals
- **Employee Master** (HRIS) — department, cost center, reporting chain, travel authorization
- **GL Chart of Accounts** (ERP) — valid expense accounts and cost center assignments
- **Credit Card Statements** (corporate card program) — transaction detail for reconciliation
- **GSA Per Diem Tables** (government source) — lodging and meal rates by location

### Computation Process
1. Select sample using stratified random sampling: high-dollar, frequent travelers, and flagged submitters
2. For each report, verify receipt is present for every line item above receipt threshold
3. Compare each expense to applicable policy limit (meal per diem, lodging cap, mileage rate)
4. Check approval chain: correct approver, approved before payment, no self-approval
5. Validate GL coding: expense type maps to correct account, cost center matches submitter department
6. Identify split transactions (one expense divided to stay under approval threshold)
7. Calculate policy-compliant reimbursement vs. submitted amount; note adjustments needed
8. Aggregate findings by violation type, department, and frequency for trend reporting

### Output Structure
- **Audit Sample Selection**: Reports selected with selection criteria and risk score
- **Compliance Results**: Pass/fail by report with specific violations cited
- **Policy Exception Detail**: Out-of-policy expenses by type, amount, and submitter
- **GL Coding Corrections**: Misclassified expenses requiring reclassification entries
- **Reimbursement Adjustments**: Overpayments to recover and underpayments to correct
- **Trend Analysis Report**: Violation rates by department, category, and quarter over time`,
    tags: ['accounting', 'expense management', 'audit', 'compliance', 'policy'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-lease-accounting',
    name: 'Lease Accounting',
    description: `### Tasks Required
- Identify and inventory all operating and finance leases across the organization
- Classify each lease as operating or finance under ASC 842 criteria
- Calculate right-of-use (ROU) asset and lease liability at commencement
- Build amortization schedules for ROU asset and lease liability over the lease term
- Process lease modifications, remeasurements, reassessments, and early terminations
- Record monthly journal entries for lease expense and liability reduction
- Prepare ASC 842 disclosure schedules for financial statement footnotes
- Maintain lease data abstracts with key terms and critical dates

### Data Sources
- **Lease Agreements** (legal/contracts) — terms, payments, options, escalations, termination rights
- **Lease Management System** (LeaseQuery, CoStar, Visual Lease) — lease abstracts and payment schedules
- **GL Lease Accounts** (ERP) — ROU asset, lease liability, and lease expense balances
- **Incremental Borrowing Rate (IBR) Analysis** — entity-specific discount rate calculations
- **Real Estate and Equipment Inventories** — physical locations and asset linkage

### Computation Process
1. Determine lease term: base term plus periods covered by reasonably certain renewal or termination options
2. Calculate present value of lease payments using the implicit rate or incremental borrowing rate (IBR)
3. Establish initial ROU asset = lease liability + initial direct costs + prepaid rent - lease incentives
4. For **operating leases**: recognize single lease cost on straight-line basis over the lease term
5. For **finance leases**: recognize amortization expense (straight-line on ROU asset) and interest expense (effective interest on liability) separately
6. Process modifications: reassess classification, remeasure liability at revised discount rate, adjust ROU asset
7. Record short-term lease elections (leases < 12 months) as period expense without balance sheet recognition
8. Generate disclosure data: maturity analysis, weighted-average remaining term, weighted-average discount rate

### Output Structure
- **Lease Inventory**: Complete listing of leases with classification, term, and payment summary
- **ROU Asset Roll-Forward**: Opening balance, additions, amortization, modifications, impairments, ending balance
- **Lease Liability Roll-Forward**: Opening balance, additions, interest accretion, payments, modifications, ending balance
- **Amortization Schedules**: Payment-by-payment breakdown of principal, interest, and ROU amortization
- **Maturity Analysis**: Undiscounted future lease payments by year with reconciliation to liability
- **Disclosure Package**: All required ASC 842 quantitative and qualitative disclosures`,
    tags: ['accounting', 'lease accounting', 'asc 842', 'gaap', 'real estate'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-consolidation',
    name: 'Financial Consolidation',
    description: `### Tasks Required
- Collect trial balances from all subsidiaries and reporting units
- Map subsidiary charts of accounts to the consolidated chart of accounts
- Convert foreign subsidiary financials to the reporting currency (ASC 830)
- Post intercompany elimination entries for transactions and investments
- Calculate and record minority interest (noncontrolling interest) adjustments
- Record equity method investment adjustments for unconsolidated affiliates
- Produce consolidated financial statements: income statement, balance sheet, cash flow, equity
- Perform top-side consolidating adjustments and management reclassifications

### Data Sources
- **Subsidiary Trial Balances** (local ERPs) — entity-level account balances and detail
- **Consolidated Chart of Accounts Mapping** — subsidiary-to-parent account crosswalk
- **FX Rate Tables** (treasury or central bank) — period-end spot rates and average rates
- **Intercompany Transaction Register** — IC invoices, loans, dividends, and management fees
- **Equity and Ownership Records** — ownership percentages, acquisition dates, goodwill schedules
- **Prior Period Consolidation Workpapers** — carried-forward CTA, goodwill, and minority interest

### Computation Process
1. Validate subsidiary trial balances are closed and in balance (debits = credits)
2. Map each subsidiary account to the consolidated chart of accounts
3. Translate foreign currency financials: balance sheet at spot rate, P&L at average rate
4. Calculate cumulative translation adjustment (CTA) and record in other comprehensive income
5. Eliminate intercompany revenue/expense, receivables/payables, and unrealized profit in inventory
6. Eliminate parent investment against subsidiary equity; calculate and allocate goodwill
7. Calculate noncontrolling interest share of subsidiary net income and equity
8. Aggregate all entities and produce consolidated trial balance and financial statements

### Output Structure
- **Consolidating Trial Balance**: Side-by-side entity balances, eliminations, and consolidated totals
- **Currency Translation Worksheet**: Local currency, FX rates, translated amounts, CTA calculation
- **Elimination Entries**: IC revenue/expense, IC balances, investment eliminations with references
- **Goodwill and Intangibles Schedule**: Acquisition-date balances, amortization, and impairment testing
- **Noncontrolling Interest Summary**: Minority share of income, equity, and dividends
- **Consolidated Financial Statements**: P&L, balance sheet, cash flow statement, and equity roll-forward

### Required Sub-Skills
- **Intercompany Recon**: All IC balances must be reconciled before elimination entries
- **Month-End Close**: Each subsidiary must complete local close before consolidation
- **Revenue Recognition**: Consistent ASC 606 application across all entities
- **Fixed Asset Register**: Uniform depreciation policies or consolidating adjustments required
- **Tax Provision**: Consolidated tax provision requires entity-level pre-tax income inputs

### MCP Services & Integrations
- **SAP BPC / Oracle FCCS / NetSuite OneWorld**: Multi-entity consolidation and elimination engines
- **Workiva / Wdesk**: Consolidated financial statement drafting and cross-referencing
- **BlackLine**: Intercompany transaction matching and account reconciliation
- **XE / Bloomberg / Central Bank APIs**: Automated FX rate feeds for currency translation
- **FloQast**: Close management and consolidation task tracking across entities`,
    tags: [
      'accounting',
      'consolidation',
      'multi-entity',
      'financial statements',
      'reporting',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-audit-prep',
    name: 'Audit Preparation',
    description: `### Tasks Required
- Obtain and organize the PBC (prepared by client) request list from external auditors
- Assign PBC items to responsible preparers with deadlines by audit area
- Ensure all balance sheet reconciliations are complete, reviewed, and signed off
- Compile supporting schedules: debt, leases, equity, revenue, and significant estimates
- Draft the management representation letter for executive signature
- Prepare financial statement footnote disclosures and supporting calculations
- Organize document repository for auditor access (virtual data room or shared folder)
- Coordinate audit fieldwork timeline, conference rooms, and system access

### Data Sources
- **General Ledger and Trial Balance** (ERP) — audited period balances and transaction detail
- **Balance Sheet Reconciliations** (workpapers) — all accounts reconciled with support
- **Contract and Agreement Files** (legal) — debt agreements, leases, vendor contracts, customer contracts
- **Board Minutes and Resolutions** (governance) — approvals for transactions, dividends, authorizations
- **Prior Year Audit Workpapers** — prior findings, adjustments, and management letter points
- **Tax Returns and Provision Workpapers** — filed returns, provision calculations, DTA/DTL support
- **Bank Confirmations** (banking) — bank balance confirmations, loan confirmations

### Computation Process
1. Parse the PBC list into categories: balance sheet, income statement, compliance, disclosures
2. Map each PBC item to the responsible preparer, data source, and internal deadline
3. Track completion status and review sign-off for each PBC item on a daily basis
4. Validate that reconciliations tie to the trial balance and contain no stale items
5. Cross-reference footnote disclosures to supporting schedules for mathematical accuracy
6. Review management representation letter assertions against actual account balances
7. Prepare a summary of significant estimates and judgments with methodology documentation
8. Compile prior year audit adjustments and confirm current year treatment

### Output Structure
- **PBC Tracker Dashboard**: Item-level status with owner, deadline, and completion percentage
- **Document Repository Index**: Organized listing of all audit support documents by category
- **Reconciliation Completeness Report**: Status of all balance sheet reconciliations
- **Draft Management Representation Letter**: Standard assertions with entity-specific additions
- **Footnote Disclosure Package**: All required GAAP disclosures with supporting calculations
- **Audit Timeline and Logistics Plan**: Fieldwork dates, team contacts, and system access details`,
    tags: ['accounting', 'audit', 'external audit', 'compliance', 'sox'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-sales-tax-compliance',
    name: 'Sales Tax Compliance',
    description: `### Tasks Required
- Extract sales transactions from the billing system for the filing period
- Classify each transaction as taxable, exempt, or non-taxable by jurisdiction
- Apply correct tax rates by state, county, city, and special district
- Calculate total tax collected, tax due, and any variance to reconcile
- Prepare and file sales/use tax returns for each jurisdiction by due date
- Remit tax payments and track confirmation numbers
- Monitor economic nexus thresholds (revenue and transaction count) by state
- Identify overpayments, credits, and refund opportunities from prior periods

### Data Sources
- **Billing/Invoicing System** (ERP or billing platform) — sales transactions, customer addresses, product codes
- **Tax Engine** (Avalara, Vertex, TaxJar) — tax rate lookup, taxability rules, exemption certificates
- **Customer Exemption Certificate Database** — valid exemption and resale certificates on file
- **State Tax Authority Portals** — filing forms, rate tables, nexus threshold rules
- **GL Sales Tax Accounts** (ERP) — tax collected liability, tax expense, and remittance history
- **Prior Period Returns** (filed copies) — carryforward credits, prior overpayments

### Computation Process
1. Pull all sales transactions for the period with ship-to address, product/service type, and amount
2. Determine taxability: apply product taxability matrix and check for valid exemption certificates
3. Look up applicable combined tax rate (state + county + city + district) for each transaction
4. Calculate tax due per transaction: taxable amount x combined rate
5. Aggregate by jurisdiction to produce return-level totals: gross sales, exempt sales, taxable sales, tax due
6. Reconcile tax collected (per GL liability account) to tax due (per return calculations)
7. Prepare return forms with all required schedules and file electronically or by mail
8. Review nexus indicators: compare YTD revenue and transaction count to each state's economic nexus threshold

### Output Structure
- **Sales Tax Returns by Jurisdiction**: Completed returns with gross sales, deductions, taxable amount, and tax due
- **Taxability Classification Report**: Transactions by taxable, exempt, and non-taxable with reason codes
- **Tax Collected vs. Tax Due Reconciliation**: Variance analysis between collected and calculated amounts
- **Nexus Monitoring Dashboard**: State-by-state revenue and transaction counts vs. threshold triggers
- **Exemption Certificate Status**: Valid, expired, and missing certificates by customer
- **Filing Calendar and Remittance Log**: Due dates, filing confirmations, and payment references`,
    tags: [
      'accounting',
      'sales tax',
      'tax compliance',
      'nexus',
      'indirect tax',
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    isDefault: true,
  },
];
