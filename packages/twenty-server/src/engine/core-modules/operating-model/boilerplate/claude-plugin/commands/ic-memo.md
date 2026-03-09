---
name: ic-memo
description: Generate an investment committee memo for a deal
tags:
  - investment
  - memo
  - deal
  - ic
  - committee
placeholder: "e.g. Write an IC memo for the Acme Corp Series B investment"
defaultOutput: Document
icon: IconNotes
arguments:
  - name: company
    description: Company name for the IC memo
    required: true
  - name: action
    description: "Action type: new-investment, follow-on, exit, write-off (default: new-investment)"
    required: false
---

# /ic-memo — Investment Committee Memo

Generate a structured IC memo for an investment decision.

## Parameters

- **Company**: $ARGUMENTS
- **Action**: (from arguments, default: new-investment)

## Instructions

1. **Gather all available data** on the target company:
   - Parse workspace documents related to the company
   - Extract financials, market data, DD findings
   - Build entity relationships (investors, competitors, customers)

2. **Run ACSR lifecycle** focused on the company:
   - AGGREGATE: All company data, market context, DD materials
   - COMPUTE: Valuation analysis, return scenarios, comparable analysis
   - SYNTHESIZE: Investment thesis, risk assessment, recommendation

3. **Populate the IC memo template** (use `ic-memo` report template skill):
   - Header with deal summary
   - Executive summary
   - Company overview
   - Investment thesis (3-5 pillars with evidence and risks)
   - Financial analysis with scenario modeling
   - Valuation (multiple methodologies)
   - Due diligence summary
   - Deal terms
   - Risk assessment matrix
   - ESG considerations
   - Recommendation and vote framework

4. **For exit memos**, adjust focus:
   - Exit rationale and timing
   - Buyer/exit route analysis
   - Return attribution
   - Lessons learned

5. **Quality checks**:
   - All claims have source citations
   - Financial projections show assumptions
   - Risk assessment covers key areas
   - Valuation uses multiple methods with reconciliation
   - Scenarios include downside case

6. **Generate output**:
   - Save to `_research/ic-memo-[company].md`
   - Offer DOCX generation via `docx-generator` skill
   - Offer PPTX summary via `pptx-generator` skill
