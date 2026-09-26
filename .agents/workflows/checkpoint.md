---
description: Perform a verified development checkpoint: inspect changes, run relevant tests and checks, verify secrets and documentation, update project state if needed, then create a focused commit for the completed increment.
---

# LawLens AI Development Checkpoint

Use this workflow after completing a meaningful implementation increment.

1. Inspect current Git status.
2. Review the complete diff.
3. Run relevant tests.
4. Run relevant lint/type/build checks.
5. Manually verify the changed functionality where practical.
6. Check for secrets and sensitive data.
7. Update `docs/state/project-state.md`.
8. Update relevant documentation.
9. Summarize the completed increment.
10. If all checks pass, prepare a focused Conventional Commit.
11. Commit only the files belonging to this increment.
12. Re-run `git status`.
13. Report the resulting commit hash and clean/dirty repository state.

Never combine unrelated completed features into one commit.