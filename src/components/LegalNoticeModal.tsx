import React from 'react';
import { ShieldCheck, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel max-w-lg w-full p-6 border border-slate-700 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-950 rounded-xl border border-indigo-800 text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">LawLens AI — Product & Safety Boundary</h3>
            <p className="text-xs text-slate-400">Google PromptWars 2026 Challenge Compliance</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed pt-2 border-t border-slate-800">
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl flex items-start gap-2.5 text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold">Important Legal Notice:</strong> LawLens AI provides GenAI document intelligence, plain-language translation, statutory matching, and grounded information navigation. It is NOT a qualified legal professional or law firm and does NOT provide formal attorney-client legal representation or legal advice.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-white text-xs">LawLens AI Capabilities:</h4>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Extracts structured clause boundaries and obligations from PDFs.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Matches clauses against statutory provisions (Indian Contract Act, Labour Codes).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Provides document-grounded Q&A with explicit evidence citations.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
