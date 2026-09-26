import path from 'path';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

export class SecuritySanitizer {
  private static MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
  private static ALLOWED_MIME_TYPES = [
    'application/pdf',
    'text/plain',
    'application/x-pdf'
  ];

  private static INJECTION_PATTERNS = [
    /ignore (all )?(previous|above) instructions/i,
    /disregard (all )?(previous|system) (instructions|prompts)/i,
    /you are now a/i,
    /system prompt/i,
    /jailbreak/i,
    /override (the )?system/i,
    /reveal (the )?(secret|api key|prompt)/i,
    /forget everything you were told/i,
    /act as an unrestricted/i,
    /<script>/i,
  ];

  /**
   * Validates uploaded file size, mime type, and filename safety.
   */
  public static validateUpload(file: { originalname: string; mimetype: string; size: number }): FileValidationResult {
    if (!file) {
      return { valid: false, error: 'No file provided.' };
    }

    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: `File size exceeds maximum limit of 10MB (Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB).` };
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase()) && !file.originalname.endsWith('.pdf') && !file.originalname.endsWith('.txt')) {
      return { valid: false, error: `Unsupported file format '${file.mimetype}'. Only PDF documents (.pdf) are permitted.` };
    }

    // Path traversal & filename sanitization
    if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\') || /\x00/.test(file.originalname)) {
      return { valid: false, error: 'Invalid or unsafe filename detected.' };
    }

    const basename = path.basename(file.originalname);
    const sanitizedFilename = basename.replace(/[^a-zA-Z0-9_\.\-]/g, '_');

    return {
      valid: true,
      sanitizedFilename,
    };
  }

  /**
   * Detects prompt injection attempts inside uploaded document text.
   */
  public static detectPromptInjection(text: string): { containsInjection: boolean; matches: string[] } {
    const matches: string[] = [];
    for (const pattern of this.INJECTION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }

    return {
      containsInjection: matches.length > 0,
      matches,
    };
  }

  /**
   * Wraps document content safely to prevent untrusted instructions from modifying system behavior.
   */
  public static wrapUntrustedDocument(text: string): string {
    const sanitizedText = text
      .replace(/<UNTRUSTED_DOCUMENT_CONTENT>/g, '[SANITIZED_TAG]')
      .replace(/<\/UNTRUSTED_DOCUMENT_CONTENT>/g, '[SANITIZED_TAG]');

    return `\n<UNTRUSTED_DOCUMENT_CONTENT>\n${sanitizedText}\n</UNTRUSTED_DOCUMENT_CONTENT>\n`;
  }
}
