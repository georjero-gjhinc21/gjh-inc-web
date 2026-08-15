# Frozen grading set

Ten fixtures with human-assigned scores. **Never shown to improve.py**.

After any rubric change, re-grade this set. If mean score rises while fixtures
are unchanged, the rubric got easier — that's grade inflation, not improvement.

Run: `python loop/check-frozen.py`

Exit 0 = no inflation detected  
Exit 1 = mean score rose on unchanged fixtures (rubric got easier)

The frozen set is load-bearing. Do not:
- Edit scores without re-running the baseline
- Add entries from actual runs (they leak improve.py's learned patterns back in)
- Show this directory to any improvement loop

Each `.json` carries page_text (rendered, no HTML) and expected_scores (human-assigned).
