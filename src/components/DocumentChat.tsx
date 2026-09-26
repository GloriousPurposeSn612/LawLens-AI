import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle, FileText, Scale, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AnalysisResult, QAResponse, Language } from '../../shared/types';

interface DocumentChatProps {
  documentId: string;
  analysis: AnalysisResult;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  qaData?: QAResponse;
  isThinking?: boolean;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({
  documentId,
  analysis,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am LawLens AI. I have indexed your document "${analysis.metadata.filename}" (${analysis.clauses.length} clauses). Ask me any question about obligations, notice periods, non-competes, salary, or dispute resolution.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = analysis.recommendedQuestions.length > 0
    ? analysis.recommendedQuestions
    : [
        'What is the notice period required for resignation?',
        'Is there a post-employment non-compete clause?',
        'What are my primary confidentiality obligations?',
        'Who owns the intellectual property and code created?',
      ];

  const handleSendQuestion = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const thinkingMsgId = `assistant-thinking-${Date.now()}`;
    const thinkingMsg: ChatMessage = {
      id: thinkingMsgId,
      sender: 'assistant',
      text: 'Retrieving clause evidence & reasoning...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true,
    };

    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          question: questionText,
          language,
        }),
      });

      const data: QAResponse = await res.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingMsgId
            ? {
                id: `assistant-${Date.now()}`,
                sender: 'assistant',
                text: data.answer,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                qaData: data,
                isThinking: false,
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Q&A failed:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingMsgId
            ? {
                id: `assistant-err-${Date.now()}`,
                sender: 'assistant',
                text: 'Sorry, LawLens encountered an error retrieving answers for this question. Please try rephrasing.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isThinking: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-slate-800 flex flex-col h-[700px] max-h-[80vh]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-950 flex items-center justify-center border border-indigo-800 text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
              Document-Grounded Legal Q&A
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                Grounded RAG
              </span>
            </h2>
            <p className="text-xs text-slate-400">Scoped to {analysis.metadata.filename}</p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <RefreshCw className="h-3 w-3" /> Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.isThinking ? (
                <div className="flex items-center gap-2 text-indigo-300 font-medium">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Searching clause vector index & reasoning...</span>
                </div>
              ) : (
                <>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Assistant Evidence & Statutory Badges */}
                  {msg.qaData && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-3 text-xs">
                      {/* Evidence status badge */}
                      <div className="flex items-center gap-2">
                        {msg.qaData.answerType === 'direct_evidence' ? (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Direct Document Evidence
                          </span>
                        ) : msg.qaData.answerType === 'partial_evidence' ? (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Partial Evidence
                          </span>
                        ) : (
                          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-amber-400" /> Insufficient Document Evidence
                          </span>
                        )}
                      </div>

                      {/* Document Citations */}
                      {msg.qaData.documentEvidence.length > 0 && (
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                          <div className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> Document Excerpt Citation:
                          </div>
                          {msg.qaData.documentEvidence.map((ev, idx) => (
                            <p key={idx} className="text-slate-300 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                              "{ev.content}" — <span className="text-indigo-400">{ev.citation}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Official Statutory Authority */}
                      {msg.qaData.officialEvidence.length > 0 && (
                        <div className="bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/40 space-y-1">
                          <div className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                            <Scale className="h-3.5 w-3.5" /> Applicable Statutory Law:
                          </div>
                          {msg.qaData.officialEvidence.map((off, idx) => (
                            <div key={idx} className="text-[11px] text-amber-200">
                              <span className="font-semibold">{off.actName} ({off.section}):</span> {off.relevanceSummary}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Suggested:</span>
        {suggestedQuestions.slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuestion(q)}
            disabled={isLoading}
            className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full whitespace-nowrap transition disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputQuestion);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about your contract..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-950 text-xs text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
