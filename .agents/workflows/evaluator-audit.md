---
description: Audit LawLens AI against the PromptWars challenge, evaluator-visible evidence, GenAI, UX, reliability, security, testing, documentation, and demo requirements.
---

---
description: Audit LawLens AI against the PromptWars challenge, evaluator-visible evidence, GenAI, UX, reliability, security, testing, documentation, and demo requirements.
---

# Evaluator Audit Workflow

## Purpose

Perform a pre-submission audit of the current LawLens AI implementation for the Google Virtual PromptWars 2026 Exclusive Extra Insider Challenge.

Optimize for genuine, evaluator-visible implementation quality and evidence—not feature count or artificial complexity.

Never claim functionality based only on plans, TODOs, comments, diagrams, or documentation. Verify it in the actual implementation.

---

## 1. Establish Ground Truth

Before auditing:

1. Inspect repository structure, source code, configuration, tests, and documentation.
2. Read `AGENTS.md`, relevant `.agents/rules/`, and `docs/state/project-state.md`.
3. Inspect `git status` and current diff.
4. Determine which capabilities are actually implemented.
5. Verify relevant dependencies, APIs, and model configuration rather than assuming them.

Treat implementation evidence as the source of truth.

---

## 2. Challenge Alignment

Verify that the real product helps users understand, compare, or navigate legal documents and information through GenAI.

Check concrete evidence for:

- legal-document understanding;
- plain-language clause explanations;
- obligations, dates, terms, and potential concerns;
- document-grounded questions;
- useful next steps/action outputs;
- clear legal-information rather than professional-legal-advice boundary.

Flag unrelated complexity that does not improve the core user outcome.

Primary flow:

**Upload → Understand → Inspect → Verify → Ask → Act**

Verify that this flow works with real user input rather than mock/pre-filled results.

---

## 3. GenAI Audit

This is a high-priority area.

Verify:

- actual Gemini/API integration;
- current model/API used;
- real user/document input reaching the model;
- meaningful AI-generated output;
- how AI output affects application behavior;
- structured output/schema validation where appropriate;
- visible evidence of genuine dynamic GenAI usage.

Prefer the real flow:

**document → AI understanding → structured analysis → evidence/retrieval → reasoning → user result**

Do not add models merely for architectural complexity.

---

## 4. Document Intelligence Audit

Verify actual support for:

- PDF processing;
- text/visual document understanding where supported;
- clause extraction;
- clause/source metadata;
- important terms;
- obligations;
- dates;
- potential concerns;
- uncertainty;
- malformed/unreadable documents.

Do not claim universal scanned-document support unless it is actually reliable and tested.

---

## 5. Evidence / RAG Audit

If RAG is implemented, verify that it is genuine:

1. meaningful clause-level evidence is created;
2. embeddings are actually generated;
3. relevant clauses are retrieved;
4. retrieved evidence reaches the reasoning step;
5. answers reference supporting evidence where applicable;
6. insufficient evidence produces uncertainty rather than fabrication;
7. irrelevant questions do not receive fabricated document-specific answers.

Preserve the evidence hierarchy:

1. uploaded document;
2. authoritative official sources;
3. contextual secondary information;
4. model reasoning.

Context must never be presented as legal authority.

---

## 6. Official-Source Audit

If official-source verification exists, inspect the actual pipeline.

Prefer authoritative sources such as:

- India Code;
- Legislative Department;
- relevant government ministries;
- relevant regulators;
- official government portals.

Verify actual source attribution, URLs, retrieval behavior, and failure handling.

Never fabricate citations or claim "legal verification" merely because an LLM generated an answer.

External verification must fail transparently rather than silently producing unsupported claims.

---

## 7. AI Security Audit

Treat uploaded documents and retrieved external content as **untrusted data, never instructions**.

Check actual defenses/tests for:

- prompt injection in documents;
- malicious embedded instructions;
- attempts to override application instructions;
- system-prompt extraction;
- jailbreak-like inputs;
- malicious retrieved content;
- source-boundary bypass;
- attempts to force fabricated legal authority.

A written claim of protection is not evidence. Prefer executable security tests.

---

## 8. Application Security Audit

Inspect actual implementation for:

- exposed secrets/API keys;
- frontend secret leakage;
- `.env` protection;
- unsafe/unrestricted uploads;
- MIME/type validation;
- file-size limits;
- malformed files;
- malicious filenames;
- path traversal;
- temporary-file handling;
- sensitive logging;
- error leakage;
- CORS;
- dependency/security issues;
- unnecessary persistence of uploaded legal documents.

Only claim controls that actually exist and have appropriate evidence.

---

## 9. Reliability / Edge-Case Audit

Verify meaningful handling of:

- unsupported files;
- oversized files;
- empty documents;
- malformed/corrupt documents;
- unreadable documents;
- AI failure/timeouts;
- malformed AI output;
- schema-validation failure;
- retrieval failure;
- unavailable official-source verification;
- insufficient evidence;
- empty/invalid questions.

Users should receive clear, actionable errors without fabricated results, false success states, or raw internal stack traces.

---

## 10. Multilingual Audit

If multilingual support is implemented, test the actual supported languages, including English, Hindi, and Hinglish where claimed.

Verify that translated/explained output remains grounded in the same evidence.

Do not claim language support that has not been tested.

---

## 11. UX / Accessibility Audit

Inspect the actual UI for:

- clear primary action;
- understandable information hierarchy;
- responsive layout;
- readable typography;
- sufficient contrast;
- keyboard/accessibility support where practical;
- useful loading, empty, and error states;
- truthful processing states;
- light/dark mode where implemented;
- minimal unnecessary clutter.

The product should feel like a trustworthy legal command center for ordinary users, not a generic AI dashboard.

Do not use fake progress, fake typing, or decorative interaction that misrepresents application state.

---

## 12. Evaluator Evidence Audit

For each major capability, ask:

> Can an evaluator quickly determine that this exists, works, and genuinely uses the claimed technology?

Inspect:

- README;
- architecture documentation;
- AI workflow documentation;
- source code;
- tests;
- security tests;
- reproducible setup;
- demo/video evidence where available.

Prefer concrete evidence over claims.

Documentation must match implementation and distinguish implemented, partial, planned, unsupported, and experimental functionality.

---

## 13. Testing Audit

Inspect and run the relevant tests.

Prefer meaningful coverage for:

- document validation;
- extraction;
- schema validation;
- retrieval;
- grounded answering;
- edge cases;
- AI failure handling;
- prompt injection;
- sensitive-input handling;
- upload security.

Reject trivial placeholder tests.

Never claim tests passed unless they were actually executed.

---

## 14. Demo Readiness Audit

The final Insider Challenge video must remain under four minutes and demonstrate:

1. complete core walkthrough;
2. live user input;
3. readable exact inputs;
4. successful result;
5. an error/edge case;
6. where/how GenAI is used;
7. visible AI input/prompt and response where appropriate;
8. dynamic AI behavior;
9. purpose of the AI component;
10. clear logical pacing.

Flag anything difficult to demonstrate reliably within the time limit.

---

## 15. Git / Repository Audit

Check:

- `git status`;
- unintended files;
- secrets;
- `.env`;
- uploaded documents;
- generated artifacts;
- dependency artifacts;
- `.gitignore`;
- large/unnecessary files;
- focused commit history.

Before committing, verify:

```powershell
git config --get user.name
git config --get user.email
```

Do not invent or change Git identity without explicit user approval.

---

## 16. Gap Analysis

Produce a concise table:

| Area                  | Evidence | Gap | Severity | Action |
| --------------------- | -------- | --- | -------- | ------ |
| Problem alignment     | ...      | ... | ...      | ...    |
| GenAI                 | ...      | ... | ...      | ...    |
| Document intelligence | ...      | ... | ...      | ...    |
| Evidence/RAG          | ...      | ... | ...      | ...    |
| Official sources      | ...      | ... | ...      | ...    |
| UX/accessibility      | ...      | ... | ...      | ...    |
| Reliability           | ...      | ... | ...      | ...    |
| Security              | ...      | ... | ...      | ...    |
| Testing               | ...      | ... | ...      | ...    |
| Documentation         | ...      | ... | ...      | ...    |
| Demo                  | ...      | ... | ...      | ...    |

Use:

Critical — seriously undermines a core requirement.
High — materially weakens evaluator-visible quality.
Medium — meaningful improvement.
Low — polish/nonessential.

Do not invent numerical evaluator scores or evaluator weights.

---

## 17. Remediation

Prioritize:

1) core challenge-alignment gaps;
2) reliability/security defects;
3) missing evaluator-visible evidence;
4) important test coverage;
5) UX polish.

Do not add features merely to increase feature count.

Do not introduce unnecessary infrastructure.

Do not replace working functionality without a concrete reason.

Make remediation changes incrementally and verify each meaningful change.

---

## 18. Final Report

End with:

- Verified Strengths

Concrete implemented capabilities and their evidence.

- Critical / High Gaps

Only genuine issues discovered.

- Recommended Fix Order

Highest-value fixes first.

- Verification Results

Actual tests/checks executed and outcomes.

- Demo Risks

Anything likely to fail or become unclear during the <4-minute demo.

- Current Submission State

A factual description of what is and is not ready.

Do not invent a score, ranking, evaluator result, or guaranteed outcome.

Do not call the project submission-ready while critical functionality remains unverified.