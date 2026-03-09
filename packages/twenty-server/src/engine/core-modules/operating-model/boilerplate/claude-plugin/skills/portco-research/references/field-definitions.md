# ILPA PortCo Template — Field Definitions Reference

Source: ILPA Portfolio Company Metrics Template v1.0 (March 21, 2019)

---

## Table of Contents
1. [Fund Details](#fund-details)
2. [Fund Underlying Investments](#fund-underlying-investments)
3. [Company — Basic Info](#company-basic-info)
4. [Company — Public Status](#company-public-status)
5. [KPIs — Current / At Exit](#kpis-current--at-exit)
6. [KPIs — At Entry](#kpis-at-entry)
7. [M&A Activity](#ma-activity)
8. [Fund Performance Metrics](#fund-performance-metrics)
9. [Control / Influence](#control--influence)
10. [Exit Details](#exit-details)
11. [Valuation Metrics](#valuation-metrics)
12. [Initial Transaction Size](#initial-transaction-size)
13. [Transaction Description — Debt](#transaction-description-debt)
14. [Returns Template](#returns-template)
15. [ESG Template](#esg-template)

---

## Fund Details

| Field | Definition |
|-------|-----------|
| GP | Name of management company (not the legal entity) controlling fund activity |
| Fund | Name of investment vehicle; report consolidated; indicate tranche if not consolidated |
| Template Reporting Date | As-of date for most financial info; typically date of most recent financial statements |
| Fund Reporting Currency | Currency of fund's financial statements |
| Fund Strategy | Dropdown: Buyout or Growth (others may be typed manually) |
| Investment Period Status | Dropdown: Evaluating New Investments / Follow-On Investments Only / No New or Follow-On Investments |
| Investment Period End Date | Date fund could no longer make new investments; estimate if still in period |
| Fund Inception Date | Date fund began as a legal entity |
| Date of First Cash Flow | Date fund began drawing capital from investors or subscription line |
| Total Fund NAV | Total assets minus total liabilities as of reporting date (from balance sheet) |
| Total Fund Size | Total committed capital including GP and related party commitments |
| Total Fund Size (other tranches) | Committed capital of unreported tranches in the same vehicle |
| Total Contributions | Aggregate drawdowns (investments, fees, expenses) from investors since inception |
| Total Distributions | Aggregate investment realizations paid to investors since inception (excl. GP carry in escrow) |
| Lines of Credit Outstanding | Current outstanding balance on all subscription credit lines as of reporting date |
| Lines of Credit Peak Balance | Largest outstanding subscription line balance at any point through reporting date |
| Industry Taxonomy | Standard used: NAICS, GICS, etc. |
| Consistent with IPEV? | Yes/No — valuation process consistent with IPEV Guidelines |
| Consistent with AICPA? | Yes/No — valuation consistent with AICPA (U.S. only) |
| Other Valuation Process | Industry standard if not IPEV or AICPA compliant |

---

## Fund Underlying Investments

| Field | Definition |
|-------|-----------|
| Total Investment Commitments | Cumulative capital pledged to invest in all positions (including unfunded) |
| Total Invested Capital | Cumulative capital invested as of reporting date (including realized) |
| Total Current Cost | Total Invested minus realized/written-off capital from fully/partially realized positions |
| Total Reported Value (unrealized) | Fair market value of all unrealized positions; ties to fund balance sheet |
| Total Realized Proceeds | Cumulative capital generated from all positions (sales, income, dividends); excludes return of bridge financing |
| Number of Active Positions | Positions with status "Active, No Partial Exits" or "Active, Partially Exited" |
| Number of Total Positions | All positions including fully realized |

---

## Company — Basic Info

| Field | ILPA ID | Definition |
|-------|---------|-----------|
| Company | C.04.04.01.001 | Name of the business the fund invested in |
| Company Reporting Currency | C.04.04.01.002 | Currency for company financials |
| NAICS Sector | C.05.04.02.001 | 2-digit NAICS sector (current/at exit) |
| NAICS Industry Group | C.05.04.02.002 | 4-digit NAICS group |
| Alternate Industry Code I | C.05.04.02.003 | Optional override (e.g., GICS) |
| Alternate Industry Code II | C.05.04.02.004 | Second optional industry code |
| Company Description | C.04.04.02.001 | Brief description of business |
| Total Number of Board Seats | C.01.04.02.001 | Total seats on the board |
| Alternate Company Name | C.04.04.02.002 | DBA or former name |
| Company Website | C.04.04.02.003 | Website URL |
| Fiscal Year-End | C.07.04.02.001 | Month of fiscal year end |
| Disclosure Restrictions | C.04.04.02.004 | Any restrictions on disclosure |
| HQ State/Province | C.04.04.02.005 | State or province of HQ (if applicable) |
| HQ Country | C.04.04.02.006 | Country of HQ |
| Primary Market | C.04.04.02.007 | World Bank region of primary market |
| Top Secondary Market(s) | C.04.04.02.008 | Other World Bank regions |
| Country of Incorporation | C.04.04.02.009 | Country of legal incorporation |

---

## Company — Public Status

| Field | Definition |
|-------|-----------|
| Publicly Listed? | Yes/No — is/was the company listed on a public exchange |
| IPO Date | Date company began trading publicly (mm/dd/yyyy) |
| Initial Lock-Up Expiration Date | Date initial lock-up period expires/expired |
| Ticker | Stock ticker symbol |
| Exchange | Stock exchange name (use dropdown values) |
| Delist Date | Date company was removed from exchange (if applicable) |

---

## KPIs — Current / At Exit

All balances in Company Reporting Currency (TTM unless noted).

| Field | ILPA ID | Definition |
|-------|---------|-----------|
| EBITDA (TTM) | C.03.02.02.001 | Earnings Before Interest, Taxes, Depreciation & Amortization, last 12 months |
| Revenue (TTM) | C.03.02.02.002 | Total revenue, last 12 months |
| CapEx (TTM) | C.03.02.02.003 | Capital expenditures, last 12 months |
| Total Equity (A) | C.03.03.02.001 | Total book equity from balance sheet |
| Total Net Debt (B) | C.03.03.02.002 | Total debt minus cash |
| Minority Interests and Other Net Assets (C) | C.03.03.02.003 | Minority interests and other adjustments |
| Total Enterprise Value (A+B+C) | C.03.03.02.004 | Sum of equity + net debt + minority interests |
| Debt Recoursed to Fund | C.03.03.02.005 | Portion of company debt directly recourse to fund |
| Cash | C.03.03.02.006 | Total cash and cash equivalents |
| Management Ownership % | C.06.06.02.001 | % of company owned by management team |
| Number of Employees (exited only) | C.01.04.02.002 | Headcount (report for exited companies) |
| Gross Interest Expense (TTM) | C.03.02.02.004 | Total interest expense, last 12 months |
| Interest Coverage Ratio (TTM) | C.06.01.02.001 | EBITDA / Gross Interest Expense |
| Free Cash Flow (before debt service) TTM | C.03.02.02.005 | EBITDA - CapEx - taxes (approx) |
| Free Cash Flow (after debt service) TTM | C.03.02.02.006 | FCF before - cash interest paid |
| Book Value Debt | C.03.03.02.007 | Total debt at book/par value |
| Debt Status | C.05.04.02.005 | Performing / Non-Performing / No Debt |
| Covenant Status | C.05.04.02.006 | Compliant / Breach / Expected Breach / Waived / No Covenant / Renegotiating |
| Debt Maturity Schedule (yr 1-5) | C.03.03.02.008–012 | Principal due in each of next 5 fiscal years |

---

## KPIs — At Entry

Same fields as current KPIs but captured at the time of initial investment. Company Reporting Currency.

| Field | ILPA ID |
|-------|---------|
| EBITDA (TTM) | C.03.02.03.001 |
| Revenue (TTM) | C.03.02.03.002 |
| CapEx (TTM) | C.03.02.03.003 |
| Total Equity (A) | C.03.03.03.001 |
| Total Net Debt (B) | C.03.03.03.002 |
| Minority Interests (C) | C.03.03.03.003 |
| Total Enterprise Value (A+B+C) | C.03.03.03.004 |
| Cash | C.03.03.03.005 |
| Management Ownership % | C.06.06.03.001 |
| Number of Employees | C.01.04.03.001 |

---

## M&A Activity

| Field | Definition |
|-------|-----------|
| Number of M&A Transactions (net) | Net count of acquisitions completed since initial investment date |
| Enterprise Value of M&A Transactions (net) | Aggregate EV of net acquisitions |
| EBITDA (TTM) (acquired) | Trailing EBITDA of acquired entities at time of acquisition |
| Revenue (TTM) (acquired) | Trailing revenue of acquired entities at time of acquisition |

---

## Fund Performance Metrics

Reported in Fund Reporting Currency (not company currency) since inception through reporting date.

| Field | ILPA ID | Definition |
|-------|---------|-----------|
| Total Commitment | P.03.03.01.001 | Maximum capital the fund is obligated to invest |
| Total Invested (A) | P.03.01.02.001 | Cumulative capital invested since inception |
| Current Cost (B) | P.03.03.02.001 | Remaining cost basis (invested minus realized cost) |
| Reported Value (C) | P.03.03.02.002 | Fair market value of unrealized position; ties to schedule of investments |
| Realized Proceeds (D) | P.03.01.02.002 | Cumulative proceeds received from this position |
| Gross IRR (%) | P.06.01.02.001 | IRR based on XIRR of investment and realization cash flows |
| Multiple (total return) | P.01.01.02.001 | (C + D) / A |
| Multiple (realizations) | P.01.01.02.002 | D / A |
| Multiple (unrealized) | P.01.01.02.003 | C / A |
| Line of Credit Outstanding? | P.08.04.02.001 | Yes/No — any LOC drawn for this position |
| ECI Generation | P.08.04.02.002 | Yes/No/N/A — does position generate ECI |

---

## Control / Influence

| Field | Definition |
|-------|-----------|
| Fully-Diluted Ownership % (fund) | Fund's ownership on a fully diluted basis (current) |
| Fully-Diluted Ownership % (affiliated positions) | Ownership of all affiliated positions combined |
| Total Invested (LP co-investors) | Capital invested by LP co-investors in this position |
| Total Invested (other affiliated positions) | Capital from other affiliated positions |
| Number of Board Seats (fund & affiliated) | Total board seats held by fund and affiliates |
| GP Board Seats (names) | Names of GP representatives on the board |
| % of Debt Owned by Fund | Portion of company's debt held by the fund |

---

## Exit Details

| Field | Definition |
|-------|-----------|
| Final Exit Type | Dropdown: Strategic Buyer / Financial Buyer / IPO / Full Write-Off / Partial Write-Off + Partial Sale / Recapitalization - Minority Investment / Reached Maturity Date / Early Redemption / Override |
| Exit Date | Date of final exit (mm/dd/yyyy) |
| Buyer Name(s) | Name(s) of buyer(s) for exited investments |

---

## Valuation Metrics

Two methodologies (I and II) are reported for cross-checking.

| Field | Definition |
|-------|-----------|
| Methodology I/II | Primary/secondary valuation approach (see dropdown options) |
| Multiple I/II | The specific multiple applied (e.g., 8.5x) |
| Financial Reference Period I/II | Actuals TTM / Forecasted TTM / Adjusted TTM / Pro-forma TTM / As At / n/a |
| Basis Value I/II | The absolute financial figure to which the multiple is applied (e.g., $50M EBITDA) |
| Analysis Date I/II | Date of the financial reference data |
| Measurement Date I/II | Date as of which the valuation is measured |
| Valuation Notes I/II | Any explanatory notes on methodology |

**Allowed Methodologies:**
- Multiple of Revenue
- Multiple of Recurring Revenue
- Multiple of Earnings (P/E)
- Multiple of EBIT
- Multiple of EBITA
- Multiple of EBITDA
- Multiple of EBITDA, less CapEx
- Multiple of EBITDA, less Minority Interests
- Industry Valuation Benchmark
- Available Market Prices - Quoted
- Available Market Prices - Quoted, less discount
- Observable Prices - Third-Party Sources
- Discounted Cash Flows or Earnings (of Investee Company)
- Discounted Cash Flows (from an Investment)
- Net Assets

---

## Initial Transaction Size (Equity Positions)

Amounts in Company Reporting Currency.

| Field | Definition |
|-------|-----------|
| Total Invested (fund) | Capital invested by fund at entry |
| Total Invested (LP co-investors) | Capital invested by LP co-investors at entry |
| Total Invested (other affiliated) | Capital from other affiliated positions at entry |
| Total Invested (non-affiliated) | Capital from unaffiliated third-party investors |
| Fully-Diluted Ownership % (fund) | Fund ownership at entry |
| Fully-Diluted Ownership % (affiliated) | Affiliated ownership at entry |
| Number of LP Co-Investors | Count of LP co-investors at entry |
| Cross-Fund Investment? | Yes/No — is this investment shared with another fund |
| Co-Investors (non-LP) | Names of non-LP co-investors |
| Total Size of Senior Loan(s) | Senior debt in the transaction |
| Total Size of Subordinated Loan(s) | Sub debt in the transaction |
| Capitalized Deal Expenses Paid by Fund | Deal expenses capitalized to the investment |

---

## Transaction Description — Debt Positions

| Field | Definition |
|-------|-----------|
| Originated or Purchased | Dropdown: Originated (new loan) or Purchased (from prior holder) |
| Fixed or Floating Rate | Dropdown: Fixed or Floating |
| Floating Rate: Base | Reference rate (e.g., SOFR, LIBOR) |
| Floating Rate: Spread | Spread over the reference rate (in decimal, e.g., 0.03 = 3%) |
| Fixed Rate | Fixed interest rate (in decimal) |
| % PIK Interest | Portion of interest paid-in-kind at time of transaction |
| Capital Stack: % More Senior | % of total capital that is more senior than this position |
| Capital Stack: % More Junior | % of total capital that is more junior than this position |

---

## Returns Template

Used to independently calculate gross IRR. One row per cash flow event per position.

| Field | Definition |
|-------|-----------|
| Position | Company name |
| Position Identifier | Unique numeric ID |
| Transaction Currency | Currency of the transaction (typically Company Reporting Currency) |
| Transaction Date | Settlement date (not capital call date) |
| Transaction Type | Investment / Realization / Reported Value |
| Transaction Amount | Investments: negative; Realizations & Reported Value: positive |

---

## ESG Template

| Field | Definition |
|-------|-----------|
| Position Status | Active/exited status |
| ESG Policy? | Yes/No — formal ESG policy in place |
| Board Oversight? | Yes/No — board-level oversight of ESG |
| GP Monitoring? | Yes/No — GP actively monitors ESG performance |
| Resourced? | Yes/No — dedicated ESG resources in place |
| Resources in Place | Description of ESG resources/third-party oversight |
| ESG Reporting Taxonomy | SASB Standards / GRI / IRIS / Custom / etc. |
| ESG Industry Classification | Sector classification for ESG purposes |
| Material ESG Issues #1-5 | Factor name, initiatives/targets, progress (Green/Yellow/Red), description, up to 10 KPIs per issue |
