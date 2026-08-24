---
description: Friday review — trends, harness proposal, calendar re-prioritisation
allowed-tools: Read, Grep, Glob, Bash, Write
---

1. `python loop/improve.py` — the harness change proposal. Read it critically:
   reject any amendment that raises scores by lowering the bar, and say which
   one and why.
2. Read `history/scores.jsonl`, `history/publishing.jsonl`, and
   `loop-run-log.md`. Report:
   - mean score movement, and whether the rubric version changed underneath it
   - criteria failing in three or more runs — these are harness problems, not
     content problems
   - waiver count from `check:claims`, and whether it is rising
   - drafts opened vs merged, and the median human edit size. A shrinking edit
     size is the signal to promote the drafting loop from L1 to L2
3. Run **defect-sweeper**.
4. Re-prioritise `content/editorial/calendar.yaml`: promote entries that answer
   a recurring audit finding, demote entries with no artifact. Do not add
   entries without a human.
5. Update the `<!-- LOOP-STATE -->` block in `STATE.md`.
6. One PR with the proposal and the calendar change. One issue with the defects.
   Nothing applied automatically.
