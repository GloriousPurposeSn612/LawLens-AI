import { describe, it, expect } from 'vitest';
import { ClauseVectorIndex } from '../../server/services/vectorIndex.js';
import { ClauseItem } from '../../shared/types.js';

describe('ClauseVectorIndex Unit Tests', () => {
  const sampleClauses: ClauseItem[] = [
    {
      id: 'c1',
      title: 'Non-Compete Covenants',
      originalText: 'Employee shall not engage in competing business for 12 months.',
      plainExplanation: 'Restricts post-employment work.',
      riskLevel: 'high',
      category: 'restriction',
      confidence: 0.9,
    },
    {
      id: 'c2',
      title: 'Salary & Remuneration',
      originalText: 'Employer shall pay monthly CTC salary on the last working day.',
      plainExplanation: 'Monthly compensation terms.',
      riskLevel: 'low',
      category: 'monetary',
      confidence: 0.95,
    },
  ];

  it('should index clauses and retrieve top matches for query', () => {
    const index = new ClauseVectorIndex();
    index.indexClauses(sampleClauses);

    const results = index.searchRelevantClauses('non-compete restriction', undefined, 1);
    expect(results.length).toBe(1);
    expect(results[0].clause.id).toBe('c1');
  });

  it('should compute valid cosine similarity between identical vectors', () => {
    const vecA = [1, 0, 1];
    const vecB = [1, 0, 1];
    const similarity = ClauseVectorIndex.cosineSimilarity(vecA, vecB);
    expect(similarity).toBeCloseTo(1.0);
  });
});
