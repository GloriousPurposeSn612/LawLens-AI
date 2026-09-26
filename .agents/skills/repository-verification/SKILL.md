---
name: repository-verification
description: Verify LawLens AI repository health, implementation state, tests, build status, Git status, diffs, environment configuration, and documentation consistency. Use when checking whether a feature or milestone is complete and before committing.
---

# Repository Verification Skill

## Goal

Determine whether the current LawLens AI implementation is actually ready to be considered complete for the current task.

## Procedure

1. Inspect repository status.
2. Inspect relevant source changes.
3. Inspect package/dependency configuration.
4. Run applicable formatter/linter/type checks.
5. Run relevant tests.
6. Run the production build when applicable.
7. Verify environment variables are represented safely.
8. Check that documentation reflects the actual implementation.
9. Inspect the final Git diff.
10. Report failures explicitly.

## Rules

- Never claim a check passed without running it.
- Never hide failing tests.
- Never invent test results.
- Never commit secrets.
- Do not modify unrelated files merely to make checks pass.
- If a check cannot be run, state why.

## Completion Report

Report:

- checks executed;
- results;
- failures;
- warnings;
- files changed;
- whether the milestone is ready for commit.