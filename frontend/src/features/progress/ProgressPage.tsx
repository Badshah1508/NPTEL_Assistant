import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
} from 'lucide-react';
import { MOCK_PERFORMANCE_ANALYTICS } from '../../services/mockData';

export const ProgressPage: React.FC = () => {
  const analytics = MOCK_PERFORMANCE_ANALYTICS;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Progress & Weak Areas Analytics
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Track your mastery across NPTEL practice sets, difficulty tiers, and identify concepts requiring focused revision.
        </p>
      </div>

      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Quizzes Completed</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{analytics.totalQuizzesTaken}</p>
          <span className="text-[11px] text-slate-500">Across Week 1 & 2</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Average Score</span>
          <p className="mt-2 text-2xl font-bold text-indigo-600">{analytics.averageScorePercentage}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Exceeds pass criteria</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Questions Practiced</span>
          <p className="mt-2 text-2xl font-bold text-slate-900">{analytics.totalQuestionsAttempted}</p>
          <span className="text-[11px] text-slate-500">Validated NPTEL-style</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Overall Accuracy</span>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{analytics.overallAccuracyPercentage}%</p>
          <span className="text-[11px] text-slate-500">Consistent performance</span>
        </div>
      </div>

      {/* Difficulty Breakdown Bars */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span>Cognitive Demand & Difficulty Accuracy</span>
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Easy Questions (Definitions, Direct Principles)</span>
              <span className="text-emerald-700">{analytics.accuracyByDifficulty.easy}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${analytics.accuracyByDifficulty.easy}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Medium Questions (Hazards, Amdahl's Law, Pipelines)</span>
              <span className="text-blue-700">{analytics.accuracyByDifficulty.medium}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${analytics.accuracyByDifficulty.medium}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Advanced Questions (Multistep Calculations & Analysis)</span>
              <span className="text-purple-700">{analytics.accuracyByDifficulty.advanced}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${analytics.accuracyByDifficulty.advanced}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Weak Topics List */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Targeted Weak Concept Inventory (Below 75% Mastery)</span>
          </h2>
          <span className="text-xs text-slate-500">Prioritize these before final exam</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {analytics.weakTopics.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  Week {item.recommendedWeek}
                </span>
                <span className="font-bold text-amber-800">{item.accuracyPercentage}%</span>
              </div>
              <p className="font-bold text-slate-900">{item.topic}</p>
              <p className="text-[11px] text-slate-500">{item.missedQuestionsCount} incorrect attempts</p>

              <Link
                to="/notes"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline pt-1"
              >
                <span>Review Week {item.recommendedWeek} Notes</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Attempt History Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Recent Assessment History</h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Week & Topic</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {analytics.recentAttempts.map((att) => (
                <tr key={att.attemptId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-600">{att.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    Week {att.weekNumber}: {att.weekTitle}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {att.score} / {att.total}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {Math.round((att.score / att.total) * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to="/mock-test"
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      Review Solutions
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
