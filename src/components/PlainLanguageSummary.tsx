import React from 'react';
import { FileText, ShieldAlert, Users, Calendar, AlertOctagon, CheckSquare } from 'lucide-react';
import { AnalysisResult } from '../../shared/types';

interface PlainLanguageSummaryProps {
  analysis: AnalysisResult;
  onNavigateTab: (tab: 'clauses' | 'evidence' | 'qa' | 'action') => void;
}

export const PlainLanguageSummary: React.FC<PlainLanguageSummaryProps> = ({
  analysis,
  onNavigateTab,
}) => {
  const { metadata, plainLanguageOverview, clauses, obligations, importantDates, potentialConcerns } = analysis;

  const highRiskCount = potentialConcerns.filter(c => c.riskLevel === 'high').length;

  return (
    <div className="space-y-6">
      {/* Document Overview Metadata Header */}
      <div className="glass-panel p-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {metadata.documentType}
              </span>
              <span className="text-xs text-slate-400">
                {metadata.pageCount} {metadata.pageCount === 1 ? 'Page' : 'Pages'} • {(metadata.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-400" />
              {metadata.filename}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('clauses')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
            >
              Inspect {clauses.length} Clauses
            </button>
            <button
              onClick={() => onNavigateTab('qa')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Ask Q&A
            </button>
          </div>
        </div>

        {/* Primary Parties */}
        {metadata.primaryEntities.length > 0 && (
          <div className="pt-4 flex items-center gap-2 text-xs text-slate-300">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-400">Identified Parties:</span>
            <span>{metadata.primaryEntities.join(' • ')}</span>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          icon={<FileText className="h-5 w-5 text-indigo-400" />}
          label="Identified Clauses"
          value={clauses.length.toString()}
          onClick={() => onNavigateTab('clauses')}
        />
        <MetricCard
          icon={<AlertOctagon className="h-5 w-5 text-red-400" />}
          label="Potential Risk Flags"
          value={highRiskCount.toString()}
          badge={highRiskCount > 0 ? 'Action Needed' : 'Clear'}
          onClick={() => onNavigateTab('clauses')}
        />
        <MetricCard
          icon={<CheckSquare className="h-5 w-5 text-emerald-400" />}
          label="Extracted Obligations"
          value={obligations.length.toString()}
          onClick={() => onNavigateTab('action')}
        />
        <MetricCard
          icon={<Calendar className="h-5 w-5 text-amber-400" />}
          label="Important Dates"
          value={importantDates.length.toString()}
          onClick={() => onNavigateTab('action')}
        />
      </div>

      {/* Plain Language Executive Summary */}
      <div className="glass-panel p-6 border border-slate-800">
        <h2 className="font-display font-semibold text-lg text-white mb-3 flex items-center gap-2">
          Plain-Language Explanation
        </h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-3">
          <p>{plainLanguageOverview}</p>
          <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800/80">
            Note: This breakdown translates formal legal terms into plain language while preserving core legal context.
          </p>
        </div>
      </div>

      {/* Potential Concerns Highlight Box */}
      {potentialConcerns.length > 0 && (
        <div className="glass-panel p-6 border border-red-900/60 bg-red-950/20">
          <div className="flex items-center gap-2 text-red-300 font-display font-semibold text-lg mb-4">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            Key Areas Requiring Attention & Clarification
          </div>
          <div className="space-y-3">
            {potentialConcerns.map((concern) => (
              <div key={concern.id} className="bg-slate-900/90 p-4 rounded-xl border border-red-900/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100 text-sm">{concern.title}</span>
                  <span className="risk-badge-high">{concern.riskLevel.toUpperCase()} RISK</span>
                </div>
                <p className="text-slate-300">{concern.description}</p>
                <p className="text-indigo-300 font-medium pt-1">
                  💡 Recommendation: {concern.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string; badge?: string; onClick: () => void }> = ({
  icon,
  label,
  value,
  badge,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="glass-panel p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition group"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 rounded-lg bg-slate-800 group-hover:scale-105 transition">{icon}</div>
      {badge && (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badge === 'Clear' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
          {badge}
        </span>
      )}
    </div>
    <div className="font-display font-bold text-2xl text-white mb-0.5">{value}</div>
    <div className="text-xs text-slate-400">{label}</div>
  </div>
);
