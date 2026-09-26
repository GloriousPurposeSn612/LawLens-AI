import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index.js';

describe('API Routes Integration Tests', () => {
  it('GET /api/health should return 200 OK with app name', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.app).toBe('LawLens AI');
    expect(response.body.status).toBe('ok');
  });

  it('POST /api/sample/employment should load synthetic document and return structured analysis', async () => {
    const response = await request(app).post('/api/sample/employment');
    expect(response.status).toBe(200);
    expect(response.body.documentId).toBeDefined();
    expect(response.body.analysis).toBeDefined();
    expect(response.body.analysis.metadata.filename).toContain('employment');
    expect(response.body.analysis.clauses.length).toBeGreaterThan(0);
  });

  it('POST /api/query should answer document-grounded question for loaded document', async () => {
    // 1. Load sample document first
    const loadRes = await request(app).post('/api/sample/employment');
    const docId = loadRes.body.documentId;

    // 2. Query document
    const queryRes = await request(app).post('/api/query').send({
      documentId: docId,
      question: 'What is the required notice period for resignation?',
      language: 'en',
    });

    expect(queryRes.status).toBe(200);
    expect(queryRes.body.question).toBe('What is the required notice period for resignation?');
    expect(queryRes.body.answer).toBeDefined();
    expect(queryRes.body.documentEvidence.length).toBeGreaterThan(0);
  });

  it('GET /api/official-verify should search statutory provisions', async () => {
    const response = await request(app).get('/api/official-verify?q=non-compete');
    expect(response.status).toBe(200);
    expect(response.body.count).toBeGreaterThan(0);
    expect(response.body.matches[0].actName).toBeDefined();
  });
});
