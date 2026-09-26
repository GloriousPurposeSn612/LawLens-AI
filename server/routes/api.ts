import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SecuritySanitizer } from '../services/securitySanitizer.js';
import { DocumentProcessor } from '../services/documentProcessor.js';
import { AIService } from '../services/aiService.js';
import { ClauseVectorIndex } from '../services/vectorIndex.js';
import { OfficialSourceService } from '../services/officialSourceService.js';
import { AnalysisResult, QAResponse } from '../../shared/types.js';
import { QARequestSchema } from '../../shared/schemas.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Active in-memory document store for fast session retrieval
interface ActiveDocSession {
  analysis: AnalysisResult;
  rawText: string;
  vectorIndex: ClauseVectorIndex;
}

const activeSessions = new Map<string, ActiveDocSession>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'LawLens AI',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

/**
 * POST /api/upload - Accepts PDF or TXT legal document upload
 */
router.post('/upload', upload.single('document'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file uploaded.' });
    }

    // Security validation
    const validation = SecuritySanitizer.validateUpload({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Parse PDF/TXT document
    const parsed = await DocumentProcessor.parseDocumentBuffer(req.file.buffer, req.file.originalname);
    if (!parsed.text || parsed.text.trim().length === 0) {
      return res.status(422).json({ error: 'Uploaded document is unreadable or empty.' });
    }

    // AI Analysis
    const analysis = await AIService.analyzeDocument(
      parsed.text,
      parsed.clauses,
      validation.sanitizedFilename || req.file.originalname,
      req.file.size,
      parsed.pageCount
    );

    // Build vector index
    const vectorIndex = new ClauseVectorIndex();
    vectorIndex.indexClauses(analysis.clauses);

    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    activeSessions.set(documentId, {
      analysis,
      rawText: parsed.text,
      vectorIndex,
    });

    return res.json({
      documentId,
      analysis,
    });

  } catch (err: any) {
    console.error('Error handling document upload:', err);
    return res.status(500).json({ error: err.message || 'Internal server error during document processing.' });
  }
});

/**
 * POST /api/sample/:sampleId - Instant pre-loaded synthetic sample loader
 */
router.post('/sample/:sampleId', async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    let filename = 'synthetic_employment_offer.txt';

    if (sampleId === 'freelance') filename = 'synthetic_freelance_agreement.txt';
    if (sampleId === 'injection') filename = 'synthetic_malicious_prompt_injection.txt';

    const fixturePath = path.resolve(process.cwd(), 'server/fixtures/samples', filename);
    if (!fs.existsSync(fixturePath)) {
      return res.status(404).json({ error: `Sample fixture '${sampleId}' not found at ${fixturePath}` });
    }

    const fileBuffer = fs.readFileSync(fixturePath);
    const parsed = await DocumentProcessor.parseDocumentBuffer(fileBuffer, filename);

    const analysis = await AIService.analyzeDocument(
      parsed.text,
      parsed.clauses,
      filename,
      fileBuffer.length,
      parsed.pageCount
    );

    const vectorIndex = new ClauseVectorIndex();
    vectorIndex.indexClauses(analysis.clauses);

    const documentId = `sample-${sampleId}-${Date.now()}`;
    activeSessions.set(documentId, {
      analysis,
      rawText: parsed.text,
      vectorIndex,
    });

    return res.json({
      documentId,
      analysis,
    });
  } catch (err: any) {
    console.error('Error loading sample document:', err);
    return res.status(500).json({ error: 'Failed to load sample document.' });
  }
});

/**
 * POST /api/query - Grounded Document Q&A
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const parseResult = QARequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid query parameters.', details: parseResult.error.format() });
    }

    const { documentId, question, language } = parseResult.data;
    const session = activeSessions.get(documentId);

    if (!session) {
      return res.status(404).json({ error: 'Document session expired or invalid. Please re-upload document.' });
    }

    const qaResult: QAResponse = await AIService.answerQuestion(
      question,
      session.analysis,
      session.vectorIndex,
      language || 'en'
    );

    return res.json(qaResult);
  } catch (err: any) {
    console.error('Error executing grounded QA:', err);
    return res.status(500).json({ error: 'Failed to execute document Q&A.' });
  }
});

/**
 * GET /api/official-verify - Search statutory reference database
 */
router.get('/official-verify', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Search query required.' });
  }

  const matches = OfficialSourceService.findRelevantOfficialSources(query);
  return res.json({
    query,
    count: matches.length,
    matches,
  });
});

export default router;
