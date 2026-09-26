import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, ChevronRight, BookOpen, Tag } from 'lucide-react';
import { ClauseItem, RiskLevel } from '../../shared/types';

interface ClauseExplorerProps {
  clauses: ClauseItem[];
}

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({ clauses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(clauses[0]?.id || null);

  const filteredClauses = clauses.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.plainExplanation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRisk === 'all' || c.riskLevel === selectedRisk;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;

    return matchesSearch && matchesRisk && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="glass-panel p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clause title, keywords, or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </div>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="all">All Risks</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
            <option value="neutral">Neutral</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 text-xs text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="obligation">Obligations</option>
            <option value="restriction">Restrictions</option>
            <option value="termination">Termination</option>
            <option value="monetary">Monetary / Pay</option>
            <option value="intellectual_property">Intellectual Property</option>
            <option value="liability">Liability</option>
          </select>
        </div>
      </div>

      {/* Clause Catalog List */}
      <div className="space-y-4">
        {filteredClauses.length === 0 ? (
          <div className="glass-panel p-8 text-center border border-slate-800 text-slate-400 text-sm">
            No clauses match your current filter criteria.
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const isExpanded = expandedClauseId === clause.id;
            return (
              <div
                key={clause.id}
                className={`glass-panel border transition ${
                  isExpanded ? 'border-indigo-500/80 bg-slate-900/90' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-display font-semibold text-base text-white">
                          {clause.title}
                        </span>
                        {clause.clauseNumber && (
                          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                            Clause {clause.clauseNumber}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1 capitalize">
                          <Tag className="h-3 w-3 text-slate-500" /> {clause.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RiskBadge level={clause.riskLevel} />
                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-400' : ''}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Legalese Excerpt */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Original Document Excerpt</span>
                        <span className="text-[10px] text-indigo-400 font-mono">Page {clause.pageNumber || 1}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap">
                        {clause.originalText}
                      </p>
                    </div>

                    {/* Plain Language Explanation */}
                    <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/40 space-y-2">
                      <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                        Plain-Language Explanation
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-indigo-800/40">
                        {clause.plainExplanation}
                      </p>

                      {clause.riskLevel === 'high' && (
                        <div className="flex items-start gap-2 bg-red-950/40 border border-red-800/60 p-2.5 rounded-lg text-xs text-red-300">
                          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                          <div>
                            <span className="font-semibold">Attention: </span>
                            This clause contains potential risk factors or restrictive terms. Check statutory provisions or request written clarification.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  if (level === 'high') return <span className="risk-badge-high">High Risk</span>;
  if (level === 'medium') return <span className="risk-badge-medium">Medium Risk</span>;
  if (level === 'low') return <span className="risk-badge-low">Low Risk</span>;
  return <span className="risk-badge-neutral">Neutral</span>;
};
