---
description: Draft the next article from the editorial calendar, checked and PR-ready
argument-hint: "[calendar-id] (optional — defaults to the first ready entry)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

Draft one article for gjh-inc.com.

1. Use the **insight-writer** subagent. Pass it `$ARGUMENTS` if a calendar id was
   given; otherwise it takes the first `status: ready` entry.
2. When the draft exists, run `npm run check:claims` and fix every error.
3. Hand the draft to the **evidence-checker** subagent. Apply every blocking fix.
   If the verdict is REJECT on the argument rather than the sentences, do not
   patch it — report why and stop.
4. Hand the built route to the **machine-legibility** subagent.
5. Re-run `npm run check:claims && npm run build`.
6. Open a draft PR labelled `insight`. Body must contain the thesis, the
   artifact, an **Uncertain** section, and both checker verdicts.

Do not merge. If the ready-queue is empty, stop and propose three topics with a
thesis each — do not write filler.
