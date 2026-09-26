---
name: security-audit
description: Audit LawLens AI for application security, secret exposure, unsafe file handling, sensitive-data leakage, prompt injection, AI-output safety, dependency risks, and security-test coverage. Use before security milestones, releases, demos, or evaluator submission.
---

# LawLens AI Security Audit

## Goal

Find concrete security weaknesses in the implemented application and verify that security claims are supported by real tests or evidence.

## Audit Areas

### Secrets

Check for:

- API keys;
- tokens;
- private keys;
- credentials;
- accidental `.env` files;
- secrets in frontend code;
- secrets in documentation;
- secrets in tests.

### File Security

Check:

- upload validation;
- MIME/type handling;
- size limits;
- filename sanitization;
- path traversal;
- temporary storage;
- unsafe file access.

### AI Security

Check:

- prompt injection;
- instruction/data separation;
- malicious retrieved content;
- system-prompt extraction attempts;
- unsupported claims;
- hallucinated legal citations.

### Data Protection

Check:

- logs;
- error messages;
- runtime storage;
- document retention;
- sensitive data exposure.

### API Security

Check applicable:

- CORS;
- authentication/authorization;
- input validation;
- rate limiting;
- error leakage;
- unsafe endpoints.

## Testing

Run existing security tests.

If an important security control has no test:

1. identify the missing test;
2. create a safe synthetic fixture;
3. implement the test;
4. run it;
5. document the result.

Do not create fake security tests.

## Output

Provide:

- finding;
- severity;
- evidence;
- affected location;
- recommended remediation;
- verification result.

Never expose actual secrets in the report.