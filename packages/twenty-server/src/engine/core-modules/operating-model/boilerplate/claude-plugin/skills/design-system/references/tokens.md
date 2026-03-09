# Design Tokens

Single source of truth for all visual properties. Every generated output MUST use these values. Never hardcode colors or sizes inline — always reference this file.

---

## Color Palette

### Brand Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `primary` | `#1B3A5C` | 27, 58, 92 | Headers, table header fill, title bars, section rules |
| `primary-light` | `#2A5A8C` | 42, 90, 140 | Hover states, lighter header variants |
| `accent` | `#2E75B6` | 46, 117, 182 | Hyperlinks, chart accent, secondary emphasis, tab colors |
| `accent-light` | `#5B9BD5` | 91, 155, 213 | Chart series 2, info badges |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#2D2D2D` | All body text. Never use pure `#000000` — too harsh on white |
| `text-secondary` | `#666666` | Footnotes, captions, source attributions, metadata |
| `text-muted` | `#999999` | Placeholder text, disabled fields, watermarks |
| `text-inverse` | `#FFFFFF` | Text on dark backgrounds (header rows, title bars) |

### Background & Surface

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#FFFFFF` | Page/slide/cell background — ALWAYS white |
| `surface` | `#F7F8FA` | Alternating table rows (even rows), KPI card background, sidebar |
| `surface-dark` | `#EEF0F3` | Nested card background, secondary alternating row |

### Borders & Dividers

| Token | Hex | Usage |
|-------|-----|-------|
| `border` | `#D9DEE3` | Table cell borders, card outlines, horizontal rules |
| `border-light` | `#E8ECF0` | Inner grid lines, subtle dividers |
| `border-strong` | `#B0B8C1` | Section separators, table outer borders |

### Semantic Colors — Status & Performance

| Token | Hex | Label | Usage |
|-------|-----|-------|-------|
| `positive` | `#1A7A3A` | Green | Gains, above-target, compliant, performing, positive change |
| `positive-bg` | `#E8F5EC` | Light green | Background for positive KPI cards, conditional fill |
| `warning` | `#C67700` | Amber | Approaching threshold, covenant watch, moderate risk |
| `warning-bg` | `#FFF3D6` | Light amber | Background for warning cards, conditional fill |
| `negative` | `#C4261D` | Red | Losses, below-target, breached covenant, negative change |
| `negative-bg` | `#FDECEA` | Light red | Background for negative KPI cards, conditional fill |
| `critical` | `#8B0000` | Dark red | Severe underperformance, write-off, non-performing, default |
| `critical-bg` | `#F5E0E0` | Pale red | Background for critical alerts |
| `neutral` | `#6B7280` | Gray | N/A, pending, not applicable, informational |
| `neutral-bg` | `#F3F4F6` | Light gray | Background for neutral status |

### Chart Colors (ordered series)

Use these in sequence for multi-series charts:

| Series | Hex | Name |
|--------|-----|------|
| 1 | `#1B3A5C` | Primary (navy) |
| 2 | `#2E75B6` | Accent (blue) |
| 3 | `#5B9BD5` | Light blue |
| 4 | `#A5C8E1` | Pale blue |
| 5 | `#1A7A3A` | Green |
| 6 | `#C67700` | Amber |

For two-tone comparisons (e.g., current vs. prior): use Series 1 + Series 3.
For positive/negative: use `positive` + `negative`.

---

## Typography

### Font Stack

| Priority | Font | Fallback |
|----------|------|----------|
| Primary | Calibri | Arial, Helvetica, sans-serif |

Calibri is the institutional standard. Do not use decorative, serif, or monospace fonts in deliverables.

### Type Scale

| Element | Size (DOCX) | Size (PPTX) | Size (XLSX) | Weight | Color |
|---------|-------------|-------------|-------------|--------|-------|
| Document title | 28pt | 32pt | — | Bold | `primary` |
| Subtitle / report type | 16pt | 20pt | — | Regular | `text-secondary` |
| Section heading (H1) | 16pt | 24pt | — | Bold | `primary` |
| Subsection heading (H2) | 13pt | 18pt | — | SemiBold | `primary` |
| Sub-subsection (H3) | 11pt | 14pt | — | Bold | `text-primary` |
| Body text | 11pt | 12pt | 10pt | Regular | `text-primary` |
| Table header | 10pt | 10pt | 10pt | Bold | `text-inverse` on `primary` fill |
| Table body | 10pt | 10pt | 10pt | Regular | `text-primary` |
| KPI value (large) | 24pt | 36pt | 14pt | Bold | varies by status |
| KPI label | 9pt | 11pt | 9pt | Regular | `text-secondary` |
| Caption / footnote | 8pt | 8pt | 8pt | Regular | `text-secondary` |
| Disclaimer | 8pt | 7pt | 8pt | Regular | `text-muted` |

### Line Spacing

- Body text: 1.15× line height
- Table cells: 1.0× (tight)
- Bullet lists: 1.3× with 4pt space after each item

---

## Spacing & Layout

### Page Margins (DOCX)

| Edge | Size |
|------|------|
| Top | 1.0 in |
| Bottom | 1.0 in |
| Left | 1.25 in |
| Right | 1.0 in |

### Slide Dimensions (PPTX)

| Property | Value |
|----------|-------|
| Aspect ratio | 16:9 widescreen |
| Width | 13.333 in |
| Height | 7.5 in |
| Safe margin | 0.5 in from all edges |
| Title bar height | 1.0 in from top |
| Footer area | bottom 0.5 in |

### Column Widths (XLSX)

| Column Type | Width |
|-------------|-------|
| Label / name | 25–30 characters |
| Currency | 15 characters |
| Percentage | 10 characters |
| Date | 12 characters |
| Multiple | 10 characters |

---

## Number Formatting

| Data Type | DOCX / PPTX Display | XLSX Cell Format | Example |
|-----------|---------------------|------------------|---------|
| Currency | $X,XXX,XXX | `$#,##0` | $1,234,567 |
| Currency (millions) | $X.XM | `$#,##0.0,,"M"` | $12.3M |
| Currency (billions) | $X.XB | `$#,##0.0,,,"B"` | $1.2B |
| Percentage | X.X% | `0.0%` | 15.2% |
| Percentage (precise) | X.XX% | `0.00%` | 15.23% |
| Multiple | X.XXx | `0.00"x"` | 1.85x |
| Date | MMM DD, YYYY | `YYYY-MM-DD` | Sep 30, 2025 |
| Quarter | Q3 2025 | text | Q3 2025 |
| Integer | X,XXX | `#,##0` | 1,234 |
| Negative currency | ($X,XXX) in red | `$#,##0;[Red]($#,##0)` | ($1,234) |
| Negative percentage | (X.X%) in red | `0.0%;[Red](0.0%)` | (3.2%) |
| Basis points | XXX bps | text or `#,##0" bps"` | 150 bps |

### Rules

- Always show currency symbol for monetary values
- Always show sign for changes (+X.X% / −X.X%)
- Use parentheses for negative values in financial context, not minus sign
- Right-align all numeric columns
- Align decimal points within a column
