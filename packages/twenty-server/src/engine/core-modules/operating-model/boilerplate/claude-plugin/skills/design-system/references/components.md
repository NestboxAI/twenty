# Component Patterns

Patterns for every visual element across DOCX, PPTX, and XLSX output. Each component defines structure, token usage, and format-specific implementation notes.

---

## 1. Title Page / Title Slide

The first thing the reader sees. Must convey: what, who, when, and confidentiality.

### Structure

```
┌─────────────────────────────────────────┐
│                                         │
│  [Logo — if brand/assets/logo.png]      │
│                                         │
│  REPORT TITLE                           │  ← primary, Bold, 28pt (DOCX) / 32pt (PPTX)
│  Report Subtitle / Type                 │  ← text-secondary, 16pt
│                                         │
│  Fund Name or Firm Name                 │  ← text-primary, 14pt
│  As of March 31, 2025                   │  ← text-secondary, 12pt
│                                         │
│  ─────────────────────────────────────  │  ← border, thin rule
│  CONFIDENTIAL                           │  ← text-muted, 10pt, uppercase
│                                         │
└─────────────────────────────────────────┘
```

### Tokens

- Background: `background` (white)
- Title: `primary` + Bold
- Rule line: `border` or `primary`, 1pt
- Confidentiality: `text-muted`, uppercase, tracked (letter-spacing +0.5pt)

### DOCX

- Center all title page elements vertically and horizontally
- Insert page break after title page
- If `logo.png` exists in `brand/assets/`, insert at top-center, max width 2.5 inches

### PPTX

- Use blank slide layout (layout index 6)
- Logo top-left, max 1.5 in wide
- Title centered vertically on slide
- Thin horizontal rule between content and confidentiality notice

### XLSX

- Not applicable — use a "Cover" tab with merged cells A1:F1 for title, A3:F3 for subtitle

---

## 2. Section Header

Separates major content areas. Provides clear visual hierarchy.

### Structure

```
─────────────────────────────────────────   ← border-strong, 2pt rule above
SECTION TITLE                               ← primary, Bold, H1 size
Brief description or context (optional)     ← text-secondary, body size
```

### Tokens

- Rule above: `border-strong` or `primary`, 2pt
- Title: `primary`, Bold
- Description: `text-secondary`, Regular

### DOCX

- Heading 1 style: `primary` color, 16pt Bold, 18pt space before, 6pt space after
- Thin rule above (2pt, `primary` or `border-strong`)

### PPTX

- Title bar: full-width rectangle at top of slide, filled with `primary`, white text
- Title text: `text-inverse`, 24pt Bold, left-aligned with 0.5in left padding

---

## 3. Subsection Header

### Tokens

- Text: `primary`, SemiBold, H2 size
- No rule above (differentiates from Section Header)

---

## 4. Data Table

The most common component. Used in every format.

### Structure

```
┌────────────┬──────────┬──────────┬──────────┐
│ HEADER 1   │ HEADER 2 │ HEADER 3 │ HEADER 4 │  ← primary fill, text-inverse, Bold
├────────────┼──────────┼──────────┼──────────┤
│ Row 1 data │ value    │ value    │ value    │  ← background (white)
│ Row 2 data │ value    │ value    │ value    │  ← surface (alternating)
│ Row 3 data │ value    │ value    │ value    │  ← background
├────────────┼──────────┼──────────┼──────────┤
│ TOTAL      │ total    │ total    │ total    │  ← Bold, border-strong top
└────────────┴──────────┴──────────┴──────────┘
   Source: Document Name, as of Sep 30, 2025     ← text-secondary, 8pt
```

### Tokens

| Element | Fill | Text | Border |
|---------|------|------|--------|
| Header row | `primary` | `text-inverse`, Bold 10pt | none |
| Odd data rows | `background` | `text-primary`, 10pt | `border-light` |
| Even data rows | `surface` | `text-primary`, 10pt | `border-light` |
| Total / summary row | `background` | `text-primary`, Bold | `border-strong` top |
| Source footnote | — | `text-secondary`, 8pt | — |

### Alignment

| Column type | Alignment |
|-------------|-----------|
| Text / labels | Left |
| Currency | Right |
| Percentages | Right |
| Multiples | Right |
| Dates | Center |
| Status / category | Center |

### Conditional Formatting

Apply color to numeric cells based on value:

| Condition | Text color | Background |
|-----------|-----------|------------|
| Positive gain / above target | `positive` | `positive-bg` (optional) |
| Negative loss / below target | `negative` | `negative-bg` (optional) |
| Warning / approaching limit | `warning` | `warning-bg` (optional) |
| Critical / write-off | `critical` | `critical-bg` (optional) |
| N/A or pending | `neutral` | none |

Use text-color-only by default. Add background fill only for dashboards or KPI summary tables where visual scanning is important.

### XLSX Specifics

- Freeze pane at A2 (header row always visible)
- Auto-filter on header row
- Column widths per token spec
- Print area set, page breaks after every 40 rows

### PPTX Specifics

- Max 8–10 rows per slide table; split across slides if needed
- Table width: slide width minus 1.0 in margins
- Cell padding: 0.05 in vertical, 0.1 in horizontal

---

## 5. KPI Card / Metric Callout

Highlight a single key metric prominently. Used in dashboards, executive summaries, and slide decks.

### Structure

```
┌──────────────────┐
│  NET IRR          │  ← text-secondary, 9pt, uppercase
│  18.3%            │  ← KPI value size, Bold, positive/negative/text-primary
│  +2.1% vs prior  │  ← text-secondary, 8pt, with directional color
└──────────────────┘
```

### Tokens

- Card background: `surface`
- Card border: `border`, 1pt, rounded corners (PPTX) or simple box (DOCX)
- Label: `text-secondary`, uppercase, 9pt
- Value: status-colored (positive/negative/text-primary), Bold, 24pt (DOCX) / 36pt (PPTX)
- Change indicator: directional color (`positive` for +, `negative` for −), 8pt

### Layout

- 3–4 cards in a row for PPTX (equal width, 0.15in gap)
- For DOCX: inline table with borderless cells, or side-by-side text frames
- For XLSX: merged cells with centered large-font value, label in row above

---

## 6. Callout / Highlight Box

Draw attention to key findings, risk flags, or important notes.

### Variants

| Variant | Left border color | Background | Icon prefix |
|---------|------------------|------------|-------------|
| Info | `accent` | `background` | none |
| Positive | `positive` | `positive-bg` | none |
| Warning | `warning` | `warning-bg` | none |
| Critical | `critical` | `critical-bg` | none |

### Structure

```
  ┃  Key Finding: The fund's Net IRR of 18.3% places it in the
  ┃  top quartile of its 2019 vintage peer group.
```

- Left border: 3pt solid, variant color
- Background: variant background color
- Text: `text-primary`, body size
- Padding: 8pt all sides

### DOCX

- Indented paragraph with left border using paragraph formatting
- Or single-cell table with left border and shading

### PPTX

- Rectangle shape with left-aligned text, variant left border, variant fill

---

## 7. Chart

### General Rules

- White background (`background`) — never gray or colored chart areas
- Grid lines: `border-light`, thin, horizontal only (remove vertical grid lines)
- Axis labels: `text-secondary`, 9pt
- Data labels: `text-primary`, 9pt, Bold for emphasis
- Legend: `text-primary`, 9pt, positioned below chart
- Series colors: use chart series palette from tokens (Series 1 through 6)
- Title: `text-primary`, 12pt Bold, left-aligned above chart

### Bar Chart

- Vertical bars, no gap between grouped series, 50% gap between categories
- Positive bars: series color; negative bars: `negative`

### Line Chart

- 2pt line weight, circle markers at data points
- Series 1: solid line; Series 2: dashed line (for comparison)

### Waterfall Chart

- Increase bars: `positive`; decrease bars: `negative`; total bars: `primary`
- Connector lines: `border-light`, dashed

---

## 8. Header & Footer

### DOCX

- Header: Fund/firm name left-aligned (`text-secondary`, 8pt), "CONFIDENTIAL" right-aligned (`text-muted`, 8pt)
- Footer: Page X of Y center-aligned, report date right-aligned (`text-secondary`, 8pt)
- Thin rule (`border-light`, 0.5pt) separating header/footer from content

### PPTX

- Slide number: bottom-right, `text-secondary`, 8pt
- Confidentiality: bottom-left, `text-muted`, 7pt
- No header on content slides (title bar serves that purpose)

### XLSX

- Print headers: fund name left, "CONFIDENTIAL" right
- Print footers: "Page &P of &N" center, date right

---

## 9. Disclaimer Block

Always the last page/slide/tab. Required on every deliverable.

### Tokens

- Text: `text-muted`, 8pt
- Background: `background`
- Top rule: `border`, 1pt

### Content Template

See `references/language.md` for the standard disclaimer text.

---

## 10. Status Badge / Tag

Inline status indicators for tables and text.

| Status | Text color | Background | Label examples |
|--------|-----------|------------|----------------|
| Performing | `positive` | `positive-bg` | PERFORMING, COMPLIANT, ON TRACK |
| Watch | `warning` | `warning-bg` | WATCH, CAUTION, APPROACHING |
| Underperforming | `negative` | `negative-bg` | UNDERPERFORMING, BREACHED, BELOW TARGET |
| Write-off | `critical` | `critical-bg` | WRITE-OFF, DEFAULT, NON-PERFORMING |
| Realized | `accent` | none | REALIZED, EXITED, DISTRIBUTED |
| Pending | `neutral` | `neutral-bg` | PENDING, N/A, TBD |

### Implementation

- XLSX: Conditional formatting rules on status column
- DOCX: Inline bold text with color
- PPTX: Small rounded rectangle shapes or colored text
