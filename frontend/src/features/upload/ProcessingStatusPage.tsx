import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Terminal,
  RefreshCw,
  FileText,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_PROCESSING_JOB } from '../../services/mockData';

export const ProcessingStatusPage: React.FC = () => {
  const [job, setJob] = useState(MOCK_PROCESSING_JOB);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
              Job #{job.jobId}
            </span>
            <span className="text-xs text-slate-500">Live Orchestration Pipeline</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Document Extraction & AI Generation Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
          <Link
            to="/notes"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
          >
            <span>Open Ready Notes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Overall Progress Meter */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600 animate-pulse" />
            <span>Active Stage: {job.steps[job.currentStepIndex]?.title}</span>
          </span>
          <span className="text-indigo-600 text-sm font-bold">{job.overallProgress}% Completed</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-500"
            style={{ width: `${job.overallProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>7 of 10 stages completed</span>
          <span>Week 1 Notes & 50 Questions ready for practice</span>
        </div>
      </div>

      {/* Multi-Step Pipeline List */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          10-Stage Processing Architecture
        </h2>

        <div className="space-y-3">
          {job.steps.map((step) => {
            const isDone = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            return (
              <div
                key={step.stepIndex}
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-3 text-xs transition ${
                  isDone
                    ? 'border-emerald-100 bg-emerald-50/30 text-slate-800'
                    : isInProgress
                    ? 'border-indigo-200 bg-indigo-50/40 text-slate-900 shadow-sm'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="mt-0.5 sm:mt-0">
                    {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    {isInProgress && <Clock className="h-4 w-4 text-indigo-600 animate-spin" />}
                    {step.status === 'pending' && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] font-bold text-slate-400">
                        {step.stepIndex}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className={`font-semibold ${isInProgress ? 'text-indigo-950 font-bold' : ''}`}>
                      Stage {step.stepIndex}: {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{step.description}</p>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 flex items-center gap-3 self-end sm:self-center">
                  {step.startedAt && (
                    <span className="font-mono text-[10px] text-slate-400">
                      {step.startedAt} {step.completedAt ? `→ ${step.completedAt}` : ''}
                    </span>
                  )}
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isDone ? 'Completed' : isInProgress ? `${step.progressPercentage}% Validated` : 'Queued'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Live Event Log */}
      <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 text-xs font-mono text-slate-200 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400">
          <span className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>Worker Daemon Execution Log</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">● Streaming</span>
        </div>

        <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
          {job.logs.map((log, idx) => (
            <p key={idx} className="text-slate-300 leading-relaxed">
              {log}
            </p>
          ))}
          {job.warnings.map((warn, idx) => (
            <p key={idx} className="text-amber-400">
              [WARNING] {warn}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
