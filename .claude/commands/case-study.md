---
description: Write a case study from approved evidence, or a runnable example if none is approved
argument-hint: "[ledger-id or example topic]"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

Target: `$ARGUMENTS`

1. Read `content/editorial/ledger.yaml`. If the target has `status: published`,
   run the **case-study-writer** subagent in Mode A.
2. If it does not, **stop before writing**. Report which entries are
   `needs-approval`, what each is blocked on, and draft an approval request the
   client could sign. Then offer Mode B — a runnable example from a system GJH
   actually runs — and build that instead if told to proceed.
3. Never write a composite or anonymised case study. A composite is a fiction
   with the persuasive weight of a fact.
4. Check with **evidence-checker**, then **machine-legibility**.
5. `npm run check:claims && npm run build`, update the calendar, append to
   `loop-run-log.md`, open a PR labelled `case-study` or `example`.
