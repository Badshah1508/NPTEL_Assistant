import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  PlayCircle,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { MOCK_COURSE, MOCK_PERFORMANCE_ANALYTICS } from '../../services/mockData';

export const DashboardPage: React.FC = () => {
  const { selectedWeek, setSelectedWeek } = useOutletContext<{
    selectedWeek: number;
    setSelectedWeek: (w: number) => void;
  }>();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 text-white shadow-md sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>NPTEL-Style Autonomous Study Assistant</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Master Your Weekly Lecture Materials
          </h1>
          <p className="text-sm text-slate-300 sm:text-base">
            Upload your lecture slides ZIP. StudyPilot AI extracts concepts, builds concise short notes,
            and validates 50 original practice questions per week grounded strictly in your uploaded slides.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-600 transition"
            >
              <FileText className="h-4 w-4" />
              <span>Read Week {selectedWeek} Notes</span>
            </Link>
            <Link
              to="/questions"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Practice 50 Questions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* High-Level Stat Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Processed Weeks</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2 / 4</p>
          <p className="mt-1 text-[11px] text-slate-500">Week 1 & 2 ready for study</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Validated Questions</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <HelpCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-indigo-600">92</p>
          <p className="mt-1 text-[11px] text-slate-500">50 in W1 + 42 in W2</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Concept Coverage</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">98.5%</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">All core principles verified</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg Quiz Accuracy</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">85%</p>
          <p className="mt-1 text-[11px] text-slate-500">Across 4 completed tests</p>
        </div>
      </div>

      {/* Week-by-Week Workspace Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Weekly Learning Roadmaps</h2>
            <p className="text-xs text-slate-500">
              Select a week to review its concise short notes or attempt its 50-question practice bank.
            </p>
          </div>
          <Link
            to="/course"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>View Full Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_COURSE.weeks.map((week) => (
            <div
              key={week.id}
              onClick={() => setSelectedWeek(week.weekNumber)}
              className={`group flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                selectedWeek === week.weekNumber
                  ? 'border-indigo-500 bg-indigo-50/20 shadow-md ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    Week {week.weekNumber}
                  </span>
                  {week.status === 'ready' && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </span>
                  )}
                  {week.status === 'partial' && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      <AlertTriangle className="h-3 w-3" />
                      42 / 50 Qs
                    </span>
                  )}
                  {week.status === 'processing' && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      <Clock className="h-3 w-3 animate-spin" />
                      Processing
                    </span>
                  )}
                  {week.status === 'unprocessed' && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      Queued
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                  {week.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Lecture Slides:</span>
                    <span className="font-medium text-slate-700">{week.lecturesCount} lectures</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes Coverage:</span>
                    <span className="font-medium text-emerald-600">
                      {week.notesCoveragePercentage > 0 ? `${week.notesCoveragePercentage}%` : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>NPTEL Questions:</span>
                    <span className="font-semibold text-indigo-700">
                      {week.validQuestionsCount} / {week.targetQuestionsCount}
                    </span>
                  </div>
                </div>

                {week.shortageExplanation && (
                  <p className="rounded bg-amber-50 p-2 text-[10px] text-amber-800 leading-snug">
                    {week.shortageExplanation}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <Link
                  to="/notes"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Notes
                </Link>
                <Link
                  to="/questions"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  50 Qs
                </Link>
                <Link
                  to="/mock-test"
                  className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Take Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topic & Revision Priority Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommended Revision Focus</h3>
              <p className="text-xs text-slate-500">
                Concepts where previous practice test accuracy fell below 75%
              </p>
            </div>
          </div>
          <Link to="/progress" className="text-xs font-semibold text-indigo-600 hover:underline">
            View Analytics
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {MOCK_PERFORMANCE_ANALYTICS.weakTopics.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs"
            >
              <div>
                <p className="font-semibold text-slate-800">{item.topic}</p>
                <p className="text-[11px] text-slate-500">Week {item.recommendedWeek} • {item.missedQuestionsCount} missed</p>
              </div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                {item.accuracyPercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
