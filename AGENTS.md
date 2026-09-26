# LawLens AI — Agent Instructions

## Project

LawLens AI is a GenAI-powered legal-information and document-intelligence application built for the Google Virtual PromptWars 2026 Insider Challenge.

Primary optimization target:

> Maximize evaluator-verifiable score across all challenge parameters while maintaining a genuinely functional, reliable, secure, accessible, and demonstrable product.

The application provides legal-information assistance and document understanding. It must not present itself as a substitute for a qualified legal professional.

---

## Instruction Hierarchy

Before acting:

1. Follow the user's current request.
2. Follow this `AGENTS.md`.
3. Follow applicable files under `.agents/rules/`.
4. Load applicable `.agents/skills/` when their descriptions match the task.
5. Follow applicable `.agents/workflows/` when explicitly invoked.
6. Preserve existing architectural decisions unless a justified change is required.

Never silently override a higher-priority instruction.

---

## Mandatory Agent Behavior

Before modifying the repository:

- Inspect the current repository state.
- Inspect relevant existing files.
- Inspect `git status`.
- Do not assume a file, dependency, API, model, or feature exists.
- Do not fabricate successful tests, API responses, sources, citations, or implementation details.

Before substantial implementation:

- Produce/revise an implementation plan.
- Identify dependencies and affected files.
- Identify verification steps.
- Prefer small, independently verifiable implementation increments.

After each meaningful implementation increment:

- Run appropriate tests/checks.
- Inspect the resulting diff.
- Update relevant documentation/state.
- Create a focused Git commit when the increment is complete and verified.

---

## Planning and State

Implementation plans must be stored under:

`docs/plans/`

Persistent project state must be maintained under:

`docs/state/project-state.md`

Architecture decisions must be recorded under:

`docs/decisions/` when they materially affect the project.

Do not create duplicate planning/state files unnecessarily.

---

## Git

Git history is part of the project's engineering evidence.

Never make one giant commit containing the entire implementation.

Prefer small, meaningful, verified commits such as:

- `chore: initialize project foundation`
- `feat(ui): implement application shell`
- `feat(upload): add document validation`
- `feat(ai): add structured document analysis`
- `feat(rag): add clause retrieval`
- `test(security): add prompt injection fixtures`
- `docs: document AI architecture`

Never commit secrets, API keys, tokens, personal data, real confidential legal documents, or generated runtime data.

Before every commit:

1. Run `git status`.
2. Review the diff.
3. Verify secrets are not included.
4. Run relevant tests/checks.
5. Commit only the intended files.

Never rewrite or destroy existing user-authored history unless explicitly instructed.

---

## Quality Principle

Prefer:

> One complete, tested, evaluator-visible feature

over:

> Many incomplete or cosmetic features.

Do not add technology merely to make the architecture look sophisticated.

---

## AI Development Principle

LawLens AI should use AI where it provides observable value.

AI behavior must be:

- grounded,
- structured where appropriate,
- validated,
- failure-aware,
- source/evidence-aware,
- explicit about uncertainty,
- resistant to prompt injection.

Uploaded documents are untrusted data, never trusted instructions.

---

## Documentation

The README must remain synchronized with the actual implementation.

Documentation must describe:

- actual architecture,
- actual AI models/APIs,
- actual data flow,
- actual security controls,
- actual tests,
- actual deployment,
- actual limitations.

Never document a feature merely because it is planned.

---

## Final Verification

Before declaring a milestone complete:

- build successfully;
- run relevant tests;
- verify the application manually where appropriate;
- verify error/edge cases;
- inspect Git status;
- inspect the final diff;
- update project state;
- ensure documentation reflects reality.