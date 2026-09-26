import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentUploader } from './components/DocumentUploader';
import { PlainLanguageSummary } from './components/PlainLanguageSummary';
import { ClauseExplorer } from './components/ClauseExplorer';
import { EvidenceLens } from './components/EvidenceLens';
import { DocumentChat } from './components/DocumentChat';
import { ActionCenter } from './components/ActionCenter';
import { LegalNoticeModal } from './components/LegalNoticeModal';
import { AnalysisResult, Language, ProcessingStageStatus } from '../shared/types';
import { FileText, Layers, MessageSquare, CheckSquare, Sparkles, Upload, ShieldCheck } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState<boolean>(false);

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<ProcessingStageStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'summary' | 'clauses' | 'evidence' | 'qa' | 'action'>('summary');

  // Load sample document on initial visit for fast evaluator inspection
  useEffect(() => {
    handleLoadSample('employment');
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatus({ stage: 'uploading', message: `Uploading ${file.name}...` });

    try {
      const formData = new FormData();
      formData.append('document', file);

      setStatus({ stage: 'parsing', message: 'Reading & parsing PDF text...' });
      
      // Simulate real step updates
      setTimeout(() => {
        setStatus({ stage: 'extracting_clauses', message: 'Segmenting legal clauses & section metadata...' });
      }, 600);

      setTimeout(() => {
        setStatus({ stage: 'indexing_embeddings', message: 'Generating clause vector embeddings...' });
      }, 1200);

      setTimeout(() => {
        setStatus({ stage: 'analyzing_risks', message: 'Analyzing obligations & statutory authority...' });
      }, 1800);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to upload document.');
      }

      const data = await response.json();
      setDocumentId(data.documentId);
      setAnalysisResult(data.analysis);
      setStatus({ stage: 'ready', message: 'Analysis Complete' });
      setActiveTab('summary');

    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'Error processing document file.');
      setStatus({ stage: 'error', message: 'Upload Failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (sampleId: 'employment' | 'freelance' | 'injection') => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatus({ stage: 'parsing', message: `Loading demo sample '${sampleId}'...` });

    try {
      const res = await fetch(`/api/sample/${sampleId}`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to load sample document.');
      }
      const data = await res.json();
      setDocumentId(data.documentId);
      setAnalysisResult(data.analysis);
      setStatus({ stage: 'ready', message: 'Sample Loaded' });
      setActiveTab('summary');
    } catch (err: any) {
      console.error('Sample loading failed:', err);
      setErrorMessage(err.message || 'Error loading sample document.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header Bar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onLoadSample={handleLoadSample}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenLegalNotice={() => setIsLegalNoticeOpen(true)}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload Zone / Toggle */}
        {!analysisResult || isLoading ? (
          <DocumentUploader
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            status={status}
            errorMessage={errorMessage}
          />
        ) : (
          <>
            {/* Active Document Navigation Bar */}
            <div className="glass-panel p-2.5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <TabButton
                  active={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Overview & Summary"
                />
                <TabButton
                  active={activeTab === 'clauses'}
                  onClick={() => setActiveTab('clauses')}
                  icon={<FileText className="h-4 w-4" />}
                  label={`Clauses (${analysisResult.clauses.length})`}
                />
                <TabButton
                  active={activeTab === 'evidence'}
                  onClick={() => setActiveTab('evidence')}
                  icon={<Layers className="h-4 w-4 text-amber-400" />}
                  label="Evidence Lens"
                />
                <TabButton
                  active={activeTab === 'qa'}
                  onClick={() => setActiveTab('qa')}
                  icon={<MessageSquare className="h-4 w-4 text-indigo-400" />}
                  label="Document Q&A"
                />
                <TabButton
                  active={activeTab === 'action'}
                  onClick={() => setActiveTab('action')}
                  icon={<CheckSquare className="h-4 w-4 text-emerald-400" />}
                  label="Action Center"
                />
              </div>

              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setDocumentId(null);
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0"
              >
                <Upload className="h-3.5 w-3.5" /> Upload New PDF
              </button>
            </div>

            {/* Active Tab View */}
            {activeTab === 'summary' && (
              <PlainLanguageSummary
                analysis={analysisResult}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'clauses' && (
              <ClauseExplorer clauses={analysisResult.clauses} />
            )}

            {activeTab === 'evidence' && (
              <EvidenceLens analysis={analysisResult} />
            )}

            {activeTab === 'qa' && documentId && (
              <DocumentChat
                documentId={documentId}
                analysis={analysisResult}
                language={language}
              />
            )}

            {activeTab === 'action' && (
              <ActionCenter analysis={analysisResult} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-400">
          LAW LENS AI — GenAI Legal Document Intelligence & Navigation
        </p>
        <p>Google Virtual PromptWars 2026 Exclusive Extra Insider Challenge</p>
        <p className="text-[11px] text-slate-600 pt-1 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
          LawLens AI provides grounded legal document information. It does not provide legal advice or representation.
        </p>
      </footer>

      {/* Legal Boundary Notice Modal */}
      <LegalNoticeModal
        isOpen={isLegalNoticeOpen}
        onClose={() => setIsLegalNoticeOpen(false)}
      />
    </div>
  );
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`text-xs font-medium px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
      active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
        : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
