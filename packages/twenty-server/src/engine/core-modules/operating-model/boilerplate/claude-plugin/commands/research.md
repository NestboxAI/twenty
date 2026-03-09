---
name: research
description: Start a structured ACSR research loop on a PE/VC topic
tags:
  - research
  - analysis
  - deep-dive
  - pe
  - vc
placeholder: "e.g. What's driving the underperformance of our growth equity portfolio?"
defaultOutput: Document
icon: IconSearch
arguments:
  - name: topic
    description: The research topic, question, or analysis request
    required: true
---

# /research — Start ACSR Research Loop

You have been asked to conduct PE/VC financial research.

## Research Topic

The user wants to research: **$ARGUMENTS**

## Instructions

1. **Initialize the workspace**:
   - Run `mkdir -p output _research` — ALL deliverable files (PDF, DOCX, XLSX, etc.) MUST be saved to the `output/` subdirectory (e.g. `output/report.pdf`). The runtime only collects files from `output/`. Use relative paths only — never write to `/home/user/` or any absolute path.
   - Create `_research/gaps.md` to track known data gaps
   - Create `_research/entity-map.md` for entities and relationships

2. **Run the ACSR lifecycle** (use the `acsr-lifecycle` skill):
   - **AGGREGATE**: Scan workspace for relevant documents. Parse PDFs, XLSX, DOCX files. Extract structured facts with provenance. Build entity map. Identify gaps.
   - **COMPUTE**: Run appropriate quantitative analyses based on the topic. Show all work.
   - **SYNTHESIZE**: Produce decision-ready findings with confidence scores. Check compliance.
   - **REPEAT**: Score completeness (6 criteria). Decide whether to cycle again or produce output.

3. **Present findings** to the user with:
   - Executive summary (3-5 bullet points)
   - Detailed findings with confidence levels
   - Data gaps and caveats
   - Recommended next steps

4. **Offer follow-up options**:
   - Generate a formal report (`/lp-report`, `/ic-memo`, `/portfolio-review`)
   - Compute specific metrics (`/fund-metrics`)
   - Run benchmarking analysis (`/benchmark`)
   - Parse additional data (`/data-room`)

## Critical Rules

- Never fabricate data — mark gaps explicitly
- Never present estimates as facts — label confidence level
- Always show work — every number traces source → computation → conclusion
- State as-of dates for all metrics
- State currency for all monetary values
- Specify gross vs. net for all return figures
