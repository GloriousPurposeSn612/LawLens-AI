import { z } from 'zod';

export const RiskLevelSchema = z.enum(['high', 'medium', 'low', 'neutral']);
export const ClauseCategorySchema = z.enum([
  'obligation', 
  'restriction', 
  'termination', 
  'monetary', 
  'liability', 
  'intellectual_property', 
  'dispute_resolution', 
  'general'
]);

export const DocumentMetadataSchema = z.object({
  filename: z.string(),
  fileSize: z.number(),
  pageCount: z.number(),
  mimeType: z.string(),
  uploadTime: z.string(),
  documentType: z.string(),
  primaryEntities: z.array(z.string()),
  summary: z.string(),
});

export const ClauseItemSchema = z.object({
  id: z.string(),
  clauseNumber: z.string().optional(),
  title: z.string(),
  originalText: z.string(),
  plainExplanation: z.string(),
  riskLevel: RiskLevelSchema,
  category: ClauseCategorySchema,
  pageNumber: z.number().optional(),
  confidence: z.number().min(0).max(1),
});

export const ObligationItemSchema = z.object({
  id: z.string(),
  party: z.string(),
  obligationText: z.string(),
  deadlineOrCondition: z.string().optional(),
  penaltyOrConsequence: z.string().optional(),
  clauseId: z.string().optional(),
});

export const ImportantDateItemSchema = z.object({
  id: z.string(),
  dateOrTimeline: z.string(),
  eventDescription: z.string(),
  type: z.enum(['deadline', 'effective_date', 'expiry', 'notice_period', 'other']),
  clauseId: z.string().optional(),
});

export const PotentialConcernSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  riskLevel: RiskLevelSchema,
  recommendation: z.string(),
  clauseId: z.string().optional(),
});

export const ActionChecklistItemSchema = z.object({
  id: z.string(),
  category: z.enum(['Immediate Action', 'Verification', 'Clarification', 'Record Keeping']),
  task: z.string(),
  reason: z.string(),
  status: z.enum(['pending', 'completed']),
});

export const AnalysisResultSchema = z.object({
  metadata: DocumentMetadataSchema,
  plainLanguageOverview: z.string(),
  clauses: z.array(ClauseItemSchema),
  obligations: z.array(ObligationItemSchema),
  importantDates: z.array(ImportantDateItemSchema),
  potentialConcerns: z.array(PotentialConcernSchema),
  recommendedQuestions: z.array(z.string()),
  actionChecklist: z.array(ActionChecklistItemSchema),
  legalBoundaryNotice: z.string(),
});

export const QARequestSchema = z.object({
  documentId: z.string(),
  question: z.string().min(1, "Question cannot be empty"),
  language: z.enum(['en', 'hi', 'hinglish']).optional(),
});
