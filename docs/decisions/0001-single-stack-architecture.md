# ADR 0001: Express TypeScript & Vite React Unified Stack

## Context
LawLens AI requires a fast, reliable, fullstack architecture supporting PDF document processing, Gemini API AI integration, structured schema validation, semantic vector retrieval, security controls, and a high-polish React user interface for the Google Virtual PromptWars 2026 challenge.

## Decision
We choose a single Node.js repository with Express (TypeScript) backend and React + Vite (TypeScript) frontend:
- **Backend:** Node.js + Express (TypeScript), `@google/genai`, `pdf-parse`, `zod`, `dotenv`, `cors`, `multer`.
- **Frontend:** React 18 + Vite (TypeScript) + Tailwind CSS + Lucide Icons + Framer Motion.
- **Testing:** Vitest + Supertest for fast unit, integration, and security test execution.

## Rationale
1. **Evaluator Visibility & Simplicity:** A single repository with clean frontend/backend separation is easy to audit, run locally with `npm run dev`, and deploy seamlessly to Render or Docker.
2. **Zero Client Secret Exposure:** All Gemini API key calls and vector index generation happen securely inside Express server routes; the client only receives sanitized, validated JSON responses.
3. **No Unnecessary Infrastructure:** In-memory semantic vector index avoids complex external database setup while delivering instant clause retrieval for legal Q&A.

## Status
Accepted.
