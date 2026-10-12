import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Clock,
  Sliders,
  Trash2,
  CheckCircle2,
  Save,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [provider, setProvider] = useState<'mock' | 'ollama' | 'openai' | 'gemini'>('mock');
  const [modelName, setModelName] = useState('studypilot-deterministic-v1');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [timerDuration, setTimerDuration] = useState('60');
  const [noteDetail, setNoteDetail] = useState('balanced');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Reset all saved mock attempts and note edits in browser localStorage?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          System Preferences & Configuration
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Configure study preferences, timer constraints, AI provider integrations, and local storage caches.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Study Preferences Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-600" />
          <span>Study & Assessment Defaults</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Default Assessment Timer
            </label>
            <select
              value={timerDuration}
              onChange={(e) => setTimerDuration(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="45">45 Minutes</option>
              <option value="60">60 Minutes (Standard NPTEL)</option>
              <option value="90">90 Minutes</option>
              <option value="120">120 Minutes</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Short Notes Detail Level
            </label>
            <select
              value={noteDetail}
              onChange={(e) => setNoteDetail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="concise">Ultra-Concise Bullet Points</option>
              <option value="balanced">Balanced (High-Yield & Formulas)</option>
              <option value="in_depth">Comprehensive Revision</option>
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
          <strong>Default 50-Question Difficulty Target:</strong> 10 Easy (20%), 25 Medium (50%), 15 Advanced (30%).
          Maintained strictly against uploaded lecture slide content.
        </div>
      </div>

      {/* AI Provider Config */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600" />
            <span>AI Model & Provider Architecture</span>
          </h2>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
            {provider === 'mock' ? 'Mock Deterministic Mode' : 'Connected'}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Active Generation Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              <option value="mock">Local Deterministic Mock Engine (Offline Reliable)</option>
              <option value="ollama">Ollama Local LLM (Privacy-First On-Premise)</option>
              <option value="gemini">Google Gemini 1.5 Pro / Flash</option>
              <option value="openai">OpenAI Compatible (GPT-4o / Ollama Proxy)</option>
            </select>
          </div>

          {provider === 'ollama' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ollama Base URL</label>
                <input
                  type="text"
                  value={ollamaEndpoint}
                  onChange={(e) => setOllamaEndpoint(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Model Tag</label>
                <input
                  type="text"
                  value="llama3.1:8b"
                  readOnly
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2 font-mono text-xs text-slate-600"
                />
              </div>
            </div>
          )}

          <div className="rounded-lg bg-indigo-50/50 p-3 text-xs text-indigo-900 border border-indigo-100 leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-indigo-600 inline mr-1 -mt-0.5" />
            <strong>Strict Source Grounding Boundary:</strong> Even when cloud or local LLM models are active, the backend validator rejects any question or explanation introducing concepts absent from that week's uploaded slides.
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Local Storage & Cache Reset */}
      <div className="rounded-xl border border-red-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-red-900 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600" />
          <span>Local Data Management</span>
        </h2>
        <p className="text-xs text-slate-500">
          Reset local test answer caches, note edits, and clear stored offline data.
        </p>

        <button
          onClick={handleClearData}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
        >
          Reset Local Storage State
        </button>
      </div>
    </div>
  );
};
