import pdfParse from 'pdf-parse';

export interface ParsedDocument {
  text: string;
  pageCount: number;
  info?: any;
  clauses: ExtractedRawClause[];
}

export interface ExtractedRawClause {
  id: string;
  clauseNumber?: string;
  title: string;
  text: string;
  pageNumber?: number;
  charStart: number;
  charEnd: number;
}

export class DocumentProcessor {
  /**
   * Parses PDF buffer or plain text file into text and structured raw clauses.
   */
  public static async parseDocumentBuffer(buffer: Buffer, originalFilename: string): Promise<ParsedDocument> {
    if (originalFilename.toLowerCase().endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      const clauses = this.segmentClauses(text);
      return {
        text,
        pageCount: 1,
        clauses,
      };
    }

    try {
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text || '';
      const pageCount = pdfData.numpages || 1;
      const clauses = this.segmentClauses(text);

      return {
        text,
        pageCount,
        info: pdfData.info,
        clauses,
      };
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message || 'Corrupted or password-protected file.'}`);
    }
  }

  /**
   * Rule-based & regex clause boundary segmenter.
   */
  public static segmentClauses(fullText: string): ExtractedRawClause[] {
    const lines = fullText.split('\n');
    const clauses: ExtractedRawClause[] = [];

    // Header patterns matching legal document headers:
    // e.g., "1. DEFINITIONS", "SECTION 2: DUTIES", "Clause 3 - Termination", "Article IV", "WHEREAS", "10. GOVERNING LAW"
    const headerRegex = /^(?:(?:SECTION|CLAUSE|ARTICLE|PART|SCHEDULE|PARAGRAPH)\s+[\dA-Z]+|(?:[\d]+(?:\.[\d]+)*)[\.\:]?)\s+([A-Z0-9\s,\-\/]{3,60})$/i;
    const numberedPrefixRegex = /^(\d+(?:\.\d+)*)\.?\s+(.+)$/;

    let currentTitle = '';
    let currentClauseNumber: string | undefined = undefined;
    let currentTextBuffer: string[] = [];
    let clauseIndex = 1;
    let startChar = 0;
    let currentCharCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      currentCharCount += line.length + 1;

      if (!line) continue;

      const headerMatch = line.match(headerRegex) || line.match(numberedPrefixRegex);

      if (headerMatch) {
        // Save preceding clause if buffer contains non-empty text
        const textContent = currentTextBuffer.join(' ').trim();
        if (textContent.length > 0 && currentTitle) {
          clauses.push({
            id: `raw-clause-${clauseIndex++}`,
            clauseNumber: currentClauseNumber,
            title: currentTitle,
            text: textContent,
            charStart: startChar,
            charEnd: currentCharCount - line.length,
          });
        }

        // Start new clause
        if (headerMatch[1] && /^\d+/.test(line)) {
          currentClauseNumber = headerMatch[1];
          currentTitle = headerMatch[2] ? headerMatch[2].trim() : line;
        } else {
          currentClauseNumber = undefined;
          currentTitle = line.length < 60 ? line : line.substring(0, 50) + '...';
        }
        currentTextBuffer = [line];
        startChar = currentCharCount;
      } else {
        if (!currentTitle && currentTextBuffer.length === 0) {
          currentTitle = 'General Provisions / Preamble';
        }
        currentTextBuffer.push(line);
      }
    }

    // Flush last clause
    if (currentTextBuffer.length > 0) {
      const textContent = currentTextBuffer.join(' ').trim();
      if (textContent.length > 0) {
        clauses.push({
          id: `raw-clause-${clauseIndex++}`,
          clauseNumber: currentClauseNumber,
          title: currentTitle || 'General Provisions',
          text: textContent,
          charStart: startChar,
          charEnd: currentCharCount,
        });
      }
    }

    // Fallback: If document structure didn't yield multiple clauses, chunk by paragraph
    if (clauses.length <= 1 && fullText.trim().length > 0) {
      const paragraphs = fullText.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 15);
      if (paragraphs.length > 1) {
        return paragraphs.map((p, idx) => ({
          id: `raw-clause-${idx + 1}`,
          title: `Section ${idx + 1}`,
          text: p,
          charStart: 0,
          charEnd: p.length,
        }));
      }
    }

    return clauses;
  }
}
