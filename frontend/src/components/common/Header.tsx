import React from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Bell,
  UploadCloud,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar?: () => void;
  selectedWeek: number;
  onSelectWeek: (w: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  selectedWeek,
  onSelectWeek,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900">StudyPilot AI</span>
              <span className="hidden rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 sm:inline-block">
                NPTEL Practice
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              CS801: High-Performance Computer Architecture
            </p>
          </div>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-1 md:flex">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            onClick={() => onSelectWeek(w)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
              selectedWeek === w
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Week {w}</span>
            {w === 1 && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" title="Notes & 50 Questions Ready" />
            )}
            {w === 2 && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500" title="42 Questions Ready" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          <UploadCloud className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Course ZIP</span>
        </Link>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            SP
          </div>
        </div>
      </div>
    </header>
  );
};
