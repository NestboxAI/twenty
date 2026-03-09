---
description: "MANDATORY workspace file-writing rules for the containerized agent environment. Triggers whenever files are created, written, saved, or generated. All deliverables MUST go to output/ subdirectory. Absolute paths like /home/user/ will fail."
---

# Workspace Environment — File Writing Rules

You are running in a container. Your cwd is the workspace root. You MUST follow these rules for EVERY file you create.

## The #1 Rule

**All deliverable files MUST be saved to `output/`.** The agent runtime ONLY collects files from the `output/` subdirectory. Files written anywhere else — including the workspace root — will NOT be returned to the user.

```bash
mkdir -p output
```

Then write deliverables as:
- `output/report.pdf`
- `output/report.docx`
- `output/report.xlsx`
- `output/report.pptx`

## Forbidden Paths

These will fail with EACCES — do not attempt:
- `/home/user/...`
- `/home/agent/...`
- `/tmp/...`
- Any absolute path outside your cwd

## Use Relative Paths Only

| Correct | Wrong |
|---------|-------|
| `output/report.pdf` | `/home/user/report.pdf` |
| `_research/gaps.md` | `/tmp/research/gaps.md` |

## Directory Layout

```
./                  ← cwd (workspace root)
├── output/         ← deliverables (ONLY place the runtime collects from)
├── _research/      ← intermediate research state
└── .claude/        ← settings (pre-seeded)
```
