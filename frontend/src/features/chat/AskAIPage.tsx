import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { FormulaRenderer } from '../../components/common/FormulaRenderer';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';

export const AskAIPage: React.FC = () => {
  const { selectedWeek } = useOutletContext<{ selectedWeek: number }>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        `Hello! I am your **StudyPilot AI Assistant**, strictly grounded in your Week ${selectedWeek} uploaded lecture slides.\n\nAsk me about mathematical derivations (e.g. Amdahl's Law, CPU execution equations), pipeline hazards, or dynamic branch prediction. Every response is verified with exact slide citations.`,
      timestamp: '11:00 AM',
      citations: [
        {
          documentName: 'Week1_Lecture01_Fundamentals_of_Pipelining.pdf',
          lectureNumber: 1,
          slideNumber: 1,
          excerptSnippet: 'Lecture 1 Overview and Datapath Architecture.',
        },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [scope, setScope] = useState<'week' | 'course'>('week');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleQuestions = [
    "Explain Amdahl's Law and its theoretical speedup ceiling.",
    "Why does a Load-Use hazard require a 1-cycle stall even with forwarding?",
    "How does a 2-bit saturating counter branch predictor prevent thrashing?",
  ];

  const handleSend = async (textToSend?: string) => {
    const questionText = textToSend || input;
    if (!questionText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const assistantMsg = await api.askAI('course-nptel-hpca-01', selectedWeek, questionText, scope);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'An error occurred while retrieving slide passages. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header and Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
              Grounded RAG Chat
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Slide-Only Grounded
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Ask AI Study Assistant</h1>
        </div>

        {/* Scope Toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            onClick={() => setScope('week')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              scope === 'week' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Week {selectedWeek} Only (Strict)
          </button>
          <button
            onClick={() => setScope('course')}
            className={`rounded-md px-3 py-1 font-semibold transition ${
              scope === 'course' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            All 4 Weeks
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm shadow-sm space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b pb-1.5 opacity-80 text-[10px]">
                <span className="font-bold uppercase tracking-wider">
                  {msg.sender === 'user' ? 'You' : 'StudyPilot AI'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="leading-relaxed">
                <FormulaRenderer content={msg.content} />
              </div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verified Slide Sources:
                  </span>
                  {msg.citations.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-1.5 rounded bg-slate-50 p-1.5 text-[11px] text-slate-700 border border-slate-200/60"
                    >
                      <BookOpen className="h-3 w-3 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-900">{c.documentName}</span>
                      {c.slideNumber && (
                        <span className="font-bold text-indigo-700">Slide {c.slideNumber}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'assistant' && (
              <button
                onClick={() => handleCopy(msg.id, msg.content)}
                className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600"
              >
                {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 w-fit">
            <Sparkles className="h-4 w-4 animate-spin text-indigo-600" />
            <span>Searching Week {selectedWeek} slides and validating source citations...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2 pt-2">
        {sampleQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-700 transition shadow-2xs"
          >
            💡 {sq}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-indigo-500">
        <input
          type="text"
          placeholder={`Ask anything grounded in Week ${selectedWeek} slides...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-900 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 disabled:opacity-40 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
