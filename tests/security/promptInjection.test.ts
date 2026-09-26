import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index.js';

describe('Security & AI Safety — Prompt Injection Tests', () => {
  it('should safely process document containing prompt injection without executing malicious instructions', async () => {
    // Load sample with embedded prompt injection
    const response = await request(app).post('/api/sample/injection');
    expect(response.status).toBe(200);

    const docId = response.body.documentId;
    const analysis = response.body.analysis;

    // Verify analysis is present and structured
    expect(analysis).toBeDefined();
    expect(analysis.legalBoundaryNotice).toBeDefined();

    // Query asking about instructions
    const queryRes = await request(app).post('/api/query').send({
      documentId: docId,
      question: 'What are the obligations under Section 1?',
    });

    expect(queryRes.status).toBe(200);
    // The response should maintain legal boundary notice and not expose internal system details
    expect(queryRes.body.legalBoundaryNotice).toContain('LawLens AI');
  });
});
