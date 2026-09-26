import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Shield } from 'lucide-react';
import { ProcessingStageStatus } from '../../shared/types';

interface DocumentUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  status: ProcessingStageStatus | null;
  errorMessage: string | null;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileUpload,
  isLoading,
  status,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 max-w-3xl mx-auto my-8 border border-slate-800">
      <div className="text-center mb-6">
        <h2 className="font-display font-bold text-2xl text-white mb-2">Upload Legal Document</h2>
        <p className="text-sm text-slate-400">
          Support for employment contracts, NDAs, service agreements, and commercial leases (PDF format, max 10MB).
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-950/80 border border-red-800 text-red-200 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Failure</p>
            <p className="text-red-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 px-6 bg-slate-900/90 border border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-950 flex items-center justify-center border border-indigo-700/50">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-5 w-5 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <Shield className="h-3 w-3 text-slate-950" />
            </div>
          </div>

          <h3 className="font-display font-semibold text-lg text-white mb-1">
            {status?.message || 'Processing Legal Document...'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Running prompt-injection sanitization, clause extraction, statutory matching, and vector index construction.
          </p>

          {/* Real Processing Pipeline Stages */}
          <div className="w-full max-w-md bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left space-y-2.5">
            <StageStep label="Reading Document & Parsing PDF" active={status?.stage === 'parsing'} done={['extracting_clauses', 'indexing_embeddings', 'analyzing_risks', 'ready'].includes(status?.stage || '')} />
            <StageStep label="Segmenting Clause Boundaries & Metadata" active={status?.stage === 'extracting_clauses'} done={['indexing_embeddings', 'analyzing_risks', 'ready'].includes(status?.stage || '')} />
            <StageStep label="Generating Clause Semantic Embeddings" active={status?.stage === 'indexing_embeddings'} done={['analyzing_risks', 'ready'].includes(status?.stage || '')} />
            <StageStep label="Analyzing Obligations & Statutory Authority" active={status?.stage === 'analyzing_risks'} done={status?.stage === 'ready'} />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition flex flex-col items-center justify-center gap-4 ${
            isDragOver ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="h-16 w-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
            <Upload className="h-8 w-8" />
          </div>

          <div>
            <p className="font-semibold text-base text-white mb-1">
              Drag & drop your PDF contract here, or <span className="text-indigo-400 underline">browse file</span>
            </p>
            <p className="text-xs text-slate-400">
              PDF or TXT documents up to 10MB. Files are processed in secure memory and never exposed publicly.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-900 w-full justify-center">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-emerald-400" /> Untrusted Data Isolation</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-indigo-400" /> Clause-Aware RAG</span>
          </div>
        </div>
      )}
    </div>
  );
};

const StageStep: React.FC<{ label: string; active?: boolean; done?: boolean }> = ({ label, active, done }) => (
  <div className="flex items-center gap-2.5 text-xs">
    {done ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
    ) : active ? (
      <Loader2 className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
    ) : (
      <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0" />
    )}
    <span className={done ? 'text-emerald-300 font-medium' : active ? 'text-indigo-300 font-medium' : 'text-slate-500'}>
      {label}
    </span>
  </div>
);
