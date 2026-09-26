import { describe, it, expect } from 'vitest';
import { DocumentProcessor } from '../../server/services/documentProcessor.js';

describe('DocumentProcessor Unit Tests', () => {
  it('should segment structured raw text into individual clauses', () => {
    const rawText = `
1. DEFINITIONS
In this agreement, Employee means Rahul.

2. COMPENSATION
Employer shall pay INR 18,00,000 CTC per annum.

3. TERMINATION
Either party may terminate with 30 days notice.
    `;

    const clauses = DocumentProcessor.segmentClauses(rawText);
    expect(clauses.length).toBeGreaterThanOrEqual(3);
    expect(clauses[0].title).toContain('DEFINITIONS');
    expect(clauses[1].title).toContain('COMPENSATION');
    expect(clauses[2].title).toContain('TERMINATION');
  });

  it('should handle unformatted text gracefully with paragraph fallback', () => {
    const rawText = 'Paragraph one of legal text without formal section headers.\n\nParagraph two describing general conditions and scope.';
    const clauses = DocumentProcessor.segmentClauses(rawText);
    expect(clauses.length).toBe(2);
  });
});
