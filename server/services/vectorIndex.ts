import { ClauseItem } from '../../shared/types.js';

export interface IndexedClauseNode {
  clause: ClauseItem;
  embedding: number[];
}

export class ClauseVectorIndex {
  private indexedNodes: IndexedClauseNode[] = [];

  /**
   * Clears existing index.
   */
  public clearIndex(): void {
    this.indexedNodes = [];
  }

  /**
   * Generates a lightweight numerical vector representation (TF-IDF / character n-gram cosine vector)
   * used as fallback or fast offline semantic embedding.
   */
  public static computeFallbackVector(text: string): number[] {
    const vocab = [
      'obligation', 'must', 'shall', 'pay', 'terminate', 'notice', 'breach',
      'confidential', 'non-compete', 'indemnify', 'liability', 'salary',
      'intellectual', 'property', 'dispute', 'court', 'penalty', 'work',
      'hours', 'leave', 'probation', 'employee', 'employer', 'contractor',
      'client', 'data', 'privacy', 'secret', 'remedy', 'jurisdiction'
    ];

    const lower = text.toLowerCase();
    const vector = vocab.map(word => {
      const count = (lower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      return count > 0 ? 1 + Math.log(count) : 0;
    });

    // Normalize vector
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return norm > 0 ? vector.map(v => v / norm) : vector;
  }

  /**
   * Adds a list of clauses into the vector index.
   */
  public indexClauses(clauses: ClauseItem[], embeddingsMap?: Map<string, number[]>): void {
    this.clearIndex();
    for (const clause of clauses) {
      const embedding = embeddingsMap?.get(clause.id) || ClauseVectorIndex.computeFallbackVector(`${clause.title} ${clause.originalText} ${clause.plainExplanation}`);
      this.indexedNodes.push({
        clause,
        embedding,
      });
    }
  }

  /**
   * Cosine similarity calculation between two vectors.
   */
  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Searches top-K relevant clauses for a given question embedding/query.
   */
  public searchRelevantClauses(queryText: string, queryEmbedding?: number[], topK = 3): { clause: ClauseItem; score: number }[] {
    const qVec = queryEmbedding && queryEmbedding.length > 0 
      ? queryEmbedding 
      : ClauseVectorIndex.computeFallbackVector(queryText);

    const scored = this.indexedNodes.map(node => {
      const score = ClauseVectorIndex.cosineSimilarity(qVec, node.embedding);
      return {
        clause: node.clause,
        score,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  }
}
