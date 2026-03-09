# Brand Configuration

This directory holds customer-facing brand assets. Place files here to customize the look and language of all generated reports.

## Assets

Place brand files in `assets/`:

| File | Purpose | Format |
|------|---------|--------|
| `logo.png` | Primary logo for report headers and title pages | PNG, transparent background, min 300px wide |
| `logo-dark.png` | Logo variant for dark backgrounds (optional) | PNG, transparent background |
| `icon.png` | Small icon for footers and watermarks (optional) | PNG, 64×64px or 128×128px |

## Customization

To override default colors, typography, or language for a specific client deployment, create a `brand-overrides.json` file in this directory:

```json
{
  "firm_name": "Acme Capital Partners",
  "colors": {
    "primary": "#1B3A5C",
    "accent": "#2E75B6"
  },
  "confidentiality_notice": "CONFIDENTIAL — For Authorized Recipients Only",
  "disclaimer": "This document is provided for informational purposes only..."
}
```

The design system skill reads these overrides and applies them to all generated output.
