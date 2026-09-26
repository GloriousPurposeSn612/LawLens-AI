---
name: evaluator-audit
description: Audit LawLens AI specifically for AI evaluator-visible evidence, challenge alignment, feature completeness, UX quality, GenAI transparency, security evidence, testing evidence, documentation, and demo readiness for Google Virtual PromptWars.
---

# LawLens AI Evaluator Audit

## Goal

Evaluate whether implemented functionality is clearly observable and verifiable by an automated or human challenge evaluator.

The objective is not to add unnecessary features.

The objective is to maximize evidence per unit of implementation complexity.

## Audit

Check:

### Problem Alignment

- Does the implementation directly address AI for legal assistance and access?
- Is the primary workflow obvious?
- Is the product boundary clear?

### GenAI Evidence

- Is GenAI actually used?
- Is its purpose explicit?
- Is model/API integration visible in documentation?
- Are outputs dynamic?
- Are structured outputs validated?

### Document Intelligence

- PDF handling;
- visual/scanned-document handling;
- clause extraction;
- obligations;
- important terms;
- grounded answers.

### RAG Evidence

- embeddings;
- retrieval;
- clause-level evidence;
- source attribution;
- behavior when evidence is insufficient.

### Official Authority

- authoritative-source distinction;
- source citations;
- current-information handling;
- no fabricated sources.

### UX

- distinctive but usable visual language;
- responsive layout;
- light/dark theme;
- multilingual interaction;
- accessible controls;
- clear states and errors;
- no generic AI-template feel.

### Reliability

- API failure;
- malformed output;
- unsupported input;
- retrieval failure;
- empty input;
- degraded behavior.

### Security

- real security tests;
- prompt injection test;
- secret protection;
- upload security;
- sensitive-data handling.

### Documentation

Verify that README and architecture documentation describe the actual implementation.

### Demo

Verify that the core functionality can be demonstrated clearly within the challenge's time limit.

## Rules

- Do not recommend feature additions solely because they look impressive.
- Prioritize missing evaluator evidence.
- Never claim an implemented capability without verifying it.
- Distinguish implemented, partially implemented, planned, and unavailable features.