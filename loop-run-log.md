# loop-run-log.md

One line per unattended run. A run that produced nothing still logs that it
produced nothing — a log with gaps in it cannot distinguish "did not run" from
"ran and found nothing", and those need different responses.

Format: `TIMESTAMP | loop | status | note`

```
2026-08-11T12:41Z | content-audit | fail | 403 on https://gjh-inc.com/ — no score written
```
2026-08-26T07:00Z | insight-loop | failure | next-ready
2026-08-28T18:30Z | insight-loop | failure | next-ready
2026-08-31T13:26Z | insight-loop | failure | next-ready
