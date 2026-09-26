import React, { useState } from 'react';
import { CheckSquare, Calendar, HelpCircle, Download, CheckCircle2, Circle, Clock, Printer } from 'lucide-react';
import { AnalysisResult, ActionChecklistItem } from '../../shared/types';

interface ActionCenterProps {
  analysis: AnalysisResult;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ analysis }) => {
  const [checklist, setChecklist] = useState<ActionChecklistItem[]>(analysis.actionChecklist);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } : item
      )
    );
  };

  const completedCount = checklist.filter((item) => item.status === 'completed').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export */}
      <div className="glass-panel p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-400" />
            Action Center & Professional Guidance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Recommended verification steps, key dates timeline, and questions to ask your employer or attorney.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-2 shrink-0 w-fit"
        >
          <Printer className="h-4 w-4 text-indigo-400" /> Export / Print Summary
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interactive Action Checklist */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-emerald-400" />
              Action Checklist
            </h3>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
              {completedCount} / {checklist.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => {
              const isDone = item.status === 'completed';
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 text-xs ${
                    isDone
                      ? 'bg-slate-950/60 border-emerald-900/60 text-slate-400'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                        {item.task}
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Dates Timeline */}
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              Key Dates & Timelines
            </h3>
          </div>

          <div className="space-y-3">
            {analysis.importantDates.length === 0 ? (
              <p className="text-xs text-slate-400">No specific deadlines detected in the document.</p>
            ) : (
              analysis.importantDates.map((dateItem) => (
                <div key={dateItem.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs flex items-start gap-3">
                  <div className="p-2 bg-amber-950 rounded-lg text-amber-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-300 text-sm mb-0.5">
                      {dateItem.dateOrTimeline}
                    </div>
                    <p className="text-slate-300">{dateItem.eventDescription}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Questions to Ask Employer / Legal Professional */}
      <div className="glass-panel p-6 border border-indigo-900/60 bg-indigo-950/20">
        <h3 className="font-display font-semibold text-lg text-white mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-400" />
          Recommended Questions to Ask Employer or Legal Advisor
        </h3>

        <div className="space-y-2.5 text-xs">
          {analysis.recommendedQuestions.map((q, idx) => (
            <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-900/40 text-slate-200 flex items-start gap-2.5">
              <span className="font-bold text-indigo-400 font-mono">Q{idx + 1}.</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
