export type Language = 'en' | 'hi' | 'hinglish';

export type RiskLevel = 'high' | 'medium' | 'low' | 'neutral';

export type ClauseCategory = 
  | 'obligation' 
  | 'restriction' 
  | 'termination' 
  | 'monetary' 
  | 'liability' 
  | 'intellectual_property' 
  | 'dispute_resolution' 
  | 'general';

export interface DocumentMetadata {
  filename: string;
  fileSize: number;
  pageCount: number;
  mimeType: string;
  uploadTime: string;
  documentType: string;
  primaryEntities: string[];
  summary: string;
}

export interface ClauseItem {
  id: string;
  clauseNumber?: string;
  title: string;
  originalText: string;
  plainExplanation: string;
  riskLevel: RiskLevel;
  category: ClauseCategory;
  pageNumber?: number;
  confidence: number;
}

export interface ObligationItem {
  id: string;
  party: string;
  obligationText: string;
  deadlineOrCondition?: string;
  penaltyOrConsequence?: string;
  clauseId?: string;
}

export interface ImportantDateItem {
  id: string;
  dateOrTimeline: string;
  eventDescription: string;
  type: 'deadline' | 'effective_date' | 'expiry' | 'notice_period' | 'other';
  clauseId?: string;
}

export interface PotentialConcern {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  recommendation: string;
  clauseId?: string;
}

export interface ActionChecklistItem {
  id: string;
  category: 'Immediate Action' | 'Verification' | 'Clarification' | 'Record Keeping';
  task: string;
  reason: string;
  status: 'pending' | 'completed';
}

export interface OfficialAuthorityMatch {
  id: string;
  actName: string;
  section: string;
  officialText: string;
  relevanceSummary: string;
  officialUrl?: string;
  sourceTier: 'authoritative' | 'contextual';
}

export interface GroundedEvidence {
  sourceType: 'document' | 'official' | 'contextual';
  title: string;
  content: string;
  citation?: string;
  confidence: number;
}

export interface AnalysisResult {
  metadata: DocumentMetadata;
  plainLanguageOverview: string;
  clauses: ClauseItem[];
  obligations: ObligationItem[];
  importantDates: ImportantDateItem[];
  potentialConcerns: PotentialConcern[];
  recommendedQuestions: string[];
  actionChecklist: ActionChecklistItem[];
  legalBoundaryNotice: string;
}

export interface QARequest {
  documentId: string;
  question: string;
  language?: Language;
}

export interface QAResponse {
  question: string;
  answer: string;
  answerType: 'direct_evidence' | 'partial_evidence' | 'insufficient_evidence';
  plainLanguageExplanation: string;
  documentEvidence: GroundedEvidence[];
  officialEvidence: OfficialAuthorityMatch[];
  contextEvidence: GroundedEvidence[];
  uncertainties: string[];
  recommendedFollowUps: string[];
  legalBoundaryNotice: string;
}

export interface ProcessingStageStatus {
  stage: 'uploading' | 'parsing' | 'extracting_clauses' | 'indexing_embeddings' | 'analyzing_risks' | 'ready' | 'error';
  message: string;
  percentage?: number;
}
