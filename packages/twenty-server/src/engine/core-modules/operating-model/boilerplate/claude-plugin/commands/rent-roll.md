---
name: rent-roll
description: Generate a comprehensive rent roll — the core monthly snapshot of all contracted income across the property
tags:
  - real-estate
  - cre
  - rent-roll
  - tenant
  - lease
  - income
placeholder: "e.g. Generate rent roll for 100 Main Street as of March 2024"
defaultOutput: Spreadsheet
icon: IconBuilding
arguments:
  - name: property
    description: "Property name or address, or 'all' for full portfolio (default: current workspace property)"
    required: false
---

# /rent-roll — Rent Roll Report

Generate the most important recurring CRE report: a complete snapshot of contracted income for a property.

## Target

**$ARGUMENTS** (default: current workspace property)

## Instructions

### Step 1 — Gather Lease Data

Scan the workspace for lease agreements, rent schedules, and tenant records. Use the `document-parser` skill for PDFs/XLSX. Extract every active lease with full provenance.

### Step 2 — Build the Rent Roll Table

Produce a table with one row per tenant/suite:

```markdown
# Rent Roll
## Property: [name]
## As-of Date: [YYYY-MM-DD]
## Total GLA: [SF] | Occupied: [SF] | Vacant: [SF] | Occupancy: [%]

| # | Tenant | Suite | GLA (SF) | Lease Start | Lease End | Base Rent (Annual) | Rent/SF | Escalation Schedule | CAM Structure | Security Deposit | Options/Renewals |
|---|--------|-------|----------|-------------|-----------|-------------------|---------|---------------------|---------------|-----------------|-----------------|
```

### Step 3 — Summarize Key Metrics

Below the table, present:

- **Total Contracted Base Rent** (annual and monthly)
- **Weighted Average Rent/SF** (weighted by GLA)
- **Weighted Average Lease Term (WALT)** remaining
- **Vacancy Rate** (% of GLA)
- **Expiring within 12 months** (% of GLA, % of rent)
- **CAM Structure Breakdown** (NNN vs. modified gross vs. gross — count and % of GLA)

### Step 4 — Escalation Schedule

Show upcoming rent escalations for the next 12 months:

| Tenant | Suite | Escalation Date | Current Rent/SF | New Rent/SF | Increase (%) | Annual Impact ($) |
|--------|-------|-----------------|-----------------|-------------|-------------- |-------------------|

### Step 5 — Flag Issues

Identify and flag:
- Leases expiring within 6 months with no renewal option
- Below-market rents (compare to market rent if available)
- Tenants with outstanding security deposit issues
- Missing or incomplete lease data (record as gaps in `_research/gaps.md`)

### Step 6 — Write Output

Save the rent roll to `_research/rent-roll.md` and update `_research/entity-map.md` with tenant entities.

## Critical Rules

- Every rent figure must state: annual vs. monthly, gross vs. net, currency
- Every metric must have an as-of date
- Escalation schedules must be mathematically consistent (base × escalation % = new rent)
- Vacancy must reconcile: Occupied SF + Vacant SF = Total GLA
- Never fabricate data — mark missing fields as gaps
- Label confidence levels on all extracted values
