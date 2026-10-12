import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { MOCK_COURSE } from '../../services/mockData';

export const CourseWorkspacePage: React.FC = () => {
  const { selectedWeek, setSelectedWeek } = useOutletContext<{
    selectedWeek: number;
    setSelectedWeek: (w: number) => void;
  }>();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Course Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700">
                {MOCK_COURSE.code}
              </span>
              <span className="text-xs text-slate-500">4 Weeks • 16 Lecture Modules</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {MOCK_COURSE.title}
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              {MOCK_COURSE.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500">Total Validated Questions</p>
              <p className="text-2xl font-black text-indigo-600">92 / 200</p>
            </div>
            <Link
              to="/upload"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
            >
              <span>Add / Re-upload Lectures</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Week-by-Week Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-600" />
          <span>Weekly Learning Modules & Question Banks</span>
        </h2>

        <div className="grid gap-5">
          {MOCK_COURSE.weeks.map((week) => (
            <div
              key={week.id}
              className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                selectedWeek === week.weekNumber
                  ? 'border-indigo-400 ring-1 ring-indigo-400'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800">
                      Week {week.weekNumber}
                    </span>
                    {week.status === 'ready' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        50 Validated Questions Ready
                      </span>
                    )}
                    {week.status === 'partial' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        42 / 50 Questions Verified
                      </span>
                    )}
                    {week.status === 'processing' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                        <Clock className="h-3.5 w-3.5 animate-spin" />
                        Processing Documents...
                      </span>
                    )}
                    {week.status === 'unprocessed' && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        Awaiting Ingestion
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{week.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>{week.lecturesCount} Lecture Slides</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">
                      {week.notesCoveragePercentage > 0 ? `${week.notesCoveragePercentage}% Notes Coverage` : 'No Notes Yet'}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-700 font-semibold">
                      Target: {week.validQuestionsCount} / {week.targetQuestionsCount} Questions
                    </span>
                  </div>

                  {week.shortageExplanation && (
                    <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200/60 leading-relaxed">
                      <strong>Source Shortage Report:</strong> {week.shortageExplanation}
                    </div>
                  )}
                </div>

                {/* Week Action Buttons */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedWeek(week.weekNumber)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Select Week {week.weekNumber}
                  </button>

                  <Link
                    to="/notes"
                    onClick={() => setSelectedWeek(week.weekNumber)}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Notes</span>
                  </Link>

                  <Link
                    to="/questions"
                    onClick={() => setSelectedWeek(week.weekNumber)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>50 Practice Qs</span>
                  </Link>

                  <Link
                    to="/mock-test"
                    onClick={() => setSelectedWeek(week.weekNumber)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>Take Test</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
