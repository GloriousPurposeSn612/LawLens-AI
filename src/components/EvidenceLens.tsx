import React, { useState } from 'react';
import { Layers, FileText, Scale, Info, ExternalLink, CheckCircle, Search } from 'lucide-react';
import { AnalysisResult, OfficialAuthorityMatch } from '../../shared/types';

interface EvidenceLensProps {
  analysis: AnalysisResult;
}

export const EvidenceLens: React.FC<EvidenceLensProps> = ({ analysis }) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'document' | 'official' | 'contextual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [officialMatches, setOfficialMatches] = useState<OfficialAuthorityMatch[]>([]);
  const [isSearchingOfficial, setIsSearchingOfficial] = useState(false);

  // Fetch statutory match on query
  const handleSearchStatute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingOfficial(true);
    try {
      const res = await fetch(`/api/official-verify?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.matches) {
        setOfficialMatches(data.matches);
      }
    } catch (err) {
      console.error('Statute search failed:', err);
    } finally {
      setIsSearchingOfficial(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="glass-panel p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-950 rounded-xl border border-indigo-800/60 text-indigo-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Multi-Layer Evidence Lens</h2>
            <p className="text-xs text-slate-400">
              Distinguishing Document Evidence, Statutory Authority, and Secondary Contextual Information for complete grounding.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveLayer('all')}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition whitespace-nowrap ${
              activeLayer === 'all' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Evidence Layers
          </button>
          <button
            onClick={() => setActiveLayer('document')}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeLayer === 'document' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400" /> Layer 1: Document Evidence
          </button>
          <button
            onClick={() => setActiveLayer('official')}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeLayer === 'official' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-amber-400" /> Layer 2: Official Statutory Authority
          </button>
          <button
            onClick={() => setActiveLayer('contextual')}
            className={`text-xs px-3.5 py-2 rounded-xl font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeLayer === 'contextual' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Info className="h-3.5 w-3.5 text-teal-400" /> Layer 3: Contextual Guidance
          </button>
        </div>
      </div>

      {/* Layer 1: Uploaded Document Evidence */}
      {(activeLayer === 'all' || activeLayer === 'document') && (
        <div className="glass-panel p-6 border border-indigo-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold text-lg text-indigo-300">
              <FileText className="h-5 w-5 text-indigo-400" />
              Layer 1 — Uploaded Document Evidence ({analysis.clauses.length} Excerpts)
            </div>
            <span className="text-[10px] uppercase font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full">
              Primary Source
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.clauses.slice(0, 4).map((clause) => (
              <div key={clause.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>{clause.title}</span>
                  <span className="text-slate-400 font-mono">Page {clause.pageNumber || 1}</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
                  "{clause.originalText.substring(0, 200)}..."
                </p>
                <p className="text-indigo-300 text-[11px]">
                  ✓ Extracted directly from uploaded document buffer.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 2: Official Statutory Authority Verification */}
      {(activeLayer === 'all' || activeLayer === 'official') && (
        <div className="glass-panel p-6 border border-amber-900/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-display font-semibold text-lg text-amber-300">
              <Scale className="h-5 w-5 text-amber-400" />
              Layer 2 — Official Statutory Authority (Indian Statutory Laws)
            </div>
            <span className="text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full w-fit">
              Statutory Benchmark
            </span>
          </div>

          {/* Statutory Search Input */}
          <form onSubmit={handleSearchStatute} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search statutory rules (e.g., 'non-compete', 'notice period', 'copyright', 'gratuity')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSearchingOfficial}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition whitespace-nowrap"
            >
              {isSearchingOfficial ? 'Searching...' : 'Verify Statute'}
            </button>
          </form>

          {/* Statutory Matches */}
          <div className="space-y-3">
            {(officialMatches.length > 0 ? officialMatches : DefaultStatutes).map((statute) => (
              <div key={statute.id} className="bg-slate-950 p-4 rounded-xl border border-amber-900/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200 text-sm">{statute.actName}</span>
                  <span className="text-amber-400 font-mono text-[11px]">{statute.section}</span>
                </div>
                <p className="text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-amber-950/80">
                  "{statute.officialText}"
                </p>
                <div className="flex items-center justify-between pt-1 text-slate-400">
                  <span className="text-amber-300/90 font-medium">💡 Impact: {statute.relevanceSummary}</span>
                  {statute.officialUrl && (
                    <a
                      href={statute.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      India Code <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Contextual Secondary Guidance */}
      {(activeLayer === 'all' || activeLayer === 'contextual') && (
        <div className="glass-panel p-6 border border-teal-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold text-lg text-teal-300">
              <Info className="h-5 w-5 text-teal-400" />
              Layer 3 — Contextual Secondary Guidance & Industry Benchmarks
            </div>
            <span className="text-[10px] uppercase font-bold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
              Secondary Context
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-teal-200 text-sm">Notice Period Buyout Practices</span>
              <p className="text-slate-300">
                In software and technology roles in India, standard notice periods range from 30 to 90 days. While contracts often stipulate buyout rights, employers retain discretionary right to refuse buyout if critical handover is required.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-teal-200 text-sm">Non-Compete Enforceability Context</span>
              <p className="text-slate-300">
                High Courts across India (Delhi, Bombay, Karnataka) consistently uphold Section 27 of Contract Act, rendering post-termination non-compete clauses void regardless of duration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultStatutes: OfficialAuthorityMatch[] = [
  {
    id: 'statute-contract-27',
    actName: 'The Indian Contract Act, 1872',
    section: 'Section 27 — Agreement in restraint of trade, void',
    officialText: 'Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.',
    relevanceSummary: 'Post-employment non-compete covenants restricting an employee from taking up employment with a competitor are generally void and legally unenforceable in India.',
    officialUrl: 'https://www.indiacode.nic.in/handle/123456789/2187',
    sourceTier: 'authoritative',
  },
  {
    id: 'statute-it-43a',
    actName: 'The Information Technology Act, 2000',
    section: 'Section 43A — Compensation for failure to protect data',
    officialText: 'Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource... is negligent in maintaining reasonable security practices, it shall be liable to pay compensation.',
    relevanceSummary: 'Mandates data privacy and security measures when handling employee and client technical data.',
    officialUrl: 'https://www.indiacode.nic.in/handle/123456789/1999',
    sourceTier: 'authoritative',
  },
];
