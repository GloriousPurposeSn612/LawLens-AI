---
trigger: always_on
---

# LawLens AI — Engineering Standards

## Core Principle

Build a real, maintainable application rather than a visually convincing prototype.

Every feature must have a real implementation path.

Do not create fake functionality merely to improve the appearance of the demo.

---

## Architecture

Prefer:

- clear module boundaries;
- typed interfaces;
- explicit API contracts;
- reusable components;
- centralized configuration;
- dependency injection where useful;
- deterministic utility functions;
- small testable units.

Avoid:

- unnecessary abstractions;
- unnecessary microservices;
- unnecessary agents;
- unnecessary databases;
- unnecessary third-party dependencies.

Technology must solve an identified problem.

---

## Frontend

The interface must be:

- responsive;
- accessible;
- keyboard-friendly;
- visually coherent;
- fast;
- usable on desktop and smaller screens;
- consistent across light and dark themes.

Do not use generic AI-dashboard layouts by default.

The UI should feel like a deliberate consumer product rather than a template.

Use a distinctive interaction language inspired by high-quality products such as Duolingo, Uber, Linear, Notion, or similarly polished applications where appropriate.

Inspiration means interaction quality and information hierarchy, not copying proprietary branding, layouts, assets, or visual identity.

---

## Product Interaction Style

Prefer:

- clear progressive disclosure;
- strong visual hierarchy;
- contextual cards;
- purposeful motion;
- meaningful empty states;
- clear status feedback;
- human-readable terminology;
- focused primary actions.

Avoid:

- excessive gradients;
- generic glassmorphism;
- meaningless glowing AI effects;
- decorative animations;
- dashboard-card overload;
- fake progress indicators;
- fake AI typing that hides latency;
- visual complexity that interferes with the legal-information task.

If a process takes time, communicate real states such as:

- Uploading
- Reading document
- Extracting clauses
- Building evidence index
- Analyzing
- Preparing results

Never display fabricated percentage progress.

---

## AI Integration

AI must be integrated through a clear application boundary.

Do not scatter model/API calls throughout UI components.

Prefer:

Frontend
→ application/backend API
→ AI service layer
→ provider/model
→ validation
→ normalized application response
→ UI

Keep provider-specific details isolated.

---

## Structured AI Output

Whenever structured AI data is required:

1. Define an explicit schema.
2. Request structured output.
3. Validate the returned data.
4. Handle malformed or incomplete output.
5. Never assume model output is trustworthy merely because it is syntactically valid.

---

## RAG

RAG must be evidence-producing rather than decorative.

Use:

- meaningful semantic chunks;
- clause-aware metadata;
- embeddings;
- similarity retrieval;
- explicit retrieved evidence;
- source identifiers.

The system must be able to explain which document evidence informed an answer.

Do not add a vector database unless implementation evidence demonstrates that the application actually requires one.

---

## External Sources

Use authoritative sources for legal authority whenever possible.

External-source handling must distinguish:

- authoritative sources;
- secondary sources;
- practical/community experiences.

Never present a secondary source as legislation or official authority.

Never invent or silently alter source URLs.

---

## Error Handling

Every external dependency must have an intentional failure path.

At minimum consider:

- timeout;
- rate limit;
- provider error;
- malformed response;
- unavailable source;
- invalid document;
- oversized document;
- unsupported file;
- unreadable document;
- empty input;
- retrieval failure.

Errors must be understandable to users without exposing secrets, stack traces, internal paths, or sensitive implementation details.

---

## Testing

Tests must test actual behavior.

Do not create placeholder tests that merely assert `true`, mock away the entire system, or document behavior without testing it.

Prioritize:

- unit tests;
- integration tests;
- AI-output validation;
- retrieval behavior;
- error handling;
- upload validation;
- security;
- prompt injection;
- sensitive-data handling.

Use safe synthetic fixtures.

Never place real confidential legal documents or personal information in the repository.

---

## Dependencies

Before adding a dependency:

1. Identify why it is required.
2. Check whether existing dependencies already solve the problem.
3. Prefer mature, maintained libraries.
4. Avoid unnecessary packages.
5. Update documentation when a significant dependency affects architecture.

---

## Code Quality

Prefer:

- descriptive names;
- small functions;
- explicit error handling;
- typed data;
- comments for non-obvious reasoning;
- minimal duplication.

Avoid:

- giant files;
- giant functions;
- unexplained magic values;
- dead code;
- commented-out abandoned implementations;
- hidden fallback behavior.

---

## Verification

After implementation:

- run formatter/linter where configured;
- run relevant tests;
- run build/type checks;
- inspect runtime behavior;
- inspect Git diff.

Never claim success without verification.