import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  Search,
  Download,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  ListChecks,
} from 'lucide-react';
import { FormulaRenderer } from '../../components/common/FormulaRenderer';
import { MOCK_WEEK1_NOTES } from '../../services/mockData';
import { NoteSection } from '../../types';

export const WeeklyNotesPage: React.FC = () => {
  const { selectedWeek } = useOutletContext<{ selectedWeek: number }>();
  const [notes, setNotes] = useState(MOCK_WEEK1_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [showCoverageModal, setShowCoverageModal] = useState(false);

  const toggleCollapse = (id: string) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyNotes = () => {
    const fullText = notes.sections
      .map((sec) => `## ${sec.title}\n\n${sec.contentMarkdown}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const fullText = `# ${notes.weekTitle} (Week ${notes.weekNumber})\n\n${notes.overview}\n\n` +
      notes.sections.map((sec) => `## ${sec.title}\n\n${sec.contentMarkdown}`).join('\n\n---\n\n');
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyPilot_Week_${notes.weekNumber}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEdit = (sec: NoteSection) => {
    setEditingSectionId(sec.id);
    setEditText(sec.contentMarkdown);
  };

  const handleSaveEdit = (secId: string) => {
    setNotes((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === secId ? { ...sec, contentMarkdown: editText } : sec
      ),
    }));
    setEditingSectionId(null);
  };

  const handleRegenerateSection = (secId: string) => {
    setRegeneratingSectionId(secId);
    setTimeout(() => {
      setNotes((prev) => ({
        ...prev,
        sections: prev.sections.map((sec) =>
          sec.id === secId
            ? {
                ...sec,
                contentMarkdown:
                  sec.contentMarkdown +
                  '\n\n*Updated with extra slide boundary validation (Lecture 1-4).*',
                lastRegeneratedAt: new Date().toISOString(),
              }
            : sec
        ),
      }));
      setRegeneratingSectionId(null);
    }, 1000);
  };

  const filteredSections = notes.sections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Week {notes.weekNumber} Short Notes
            </span>
            <span className="text-xs text-slate-500">
              Lectures: {notes.lecturesCovered.join(', ')} • 100% Concept Coverage
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {notes.weekTitle}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Concept Coverage Badge Button */}
          <button
            onClick={() => setShowCoverageModal(!showCoverageModal)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Coverage Report: 100%</span>
          </button>

          <button
            onClick={handleCopyNotes}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Notes'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Markdown</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
          >
            <FileText className="h-4 w-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Concept Coverage Drawer / Modal */}
      {showCoverageModal && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-emerald-600" />
              <span>Concept Inventory & Coverage Checklist (24 Identified Architectural Concepts)</span>
            </h3>
            <button
              onClick={() => setShowCoverageModal(false)}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Close Checklist
            </button>
          </div>
          <p className="text-xs text-emerald-800">
            StudyPilot AI maps every concept taught in the uploaded slides. Here is the verified coverage report for Week {notes.weekNumber}:
          </p>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 pt-2">
            {notes.coverageReport.inventory.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-white p-2.5 text-xs shadow-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-[10px] text-slate-500">
                    Lec {c.lectureNumber} ({c.slideOrPage}) • {c.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Table of Contents Jump Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, formulas, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <span className="font-bold text-slate-400 mr-1">Quick Jump:</span>
          {notes.sections.map((sec, idx) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              §{idx + 1}
            </a>
          ))}
        </div>
      </div>

      {/* Week Learning Objectives Overview Box */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 shadow-sm space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <span>Week Learning Objectives & Scope</span>
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-700">{notes.overview}</p>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {filteredSections.map((section) => {
          const isCollapsed = collapsedSections[section.id];
          const isEditing = editingSectionId === section.id;
          const isRegen = regeneratingSectionId === section.id;

          return (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition space-y-4"
            >
              {/* Section Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">{section.title}</h2>
                  {section.subtitle && (
                    <p className="text-xs text-slate-500">{section.subtitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Inline Edit Button */}
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(section.id)}
                      className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(section)}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Edit section content"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}

                  {/* Section Regenerate Button */}
                  <button
                    onClick={() => handleRegenerateSection(section.id)}
                    disabled={isRegen}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="Regenerate this section from source slides"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRegen ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>

                  {/* Collapse Toggle */}
                  <button
                    onClick={() => toggleCollapse(section.id)}
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Section Content */}
              {!isCollapsed && (
                <>
                  {isEditing ? (
                    <textarea
                      rows={12}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 font-mono text-xs p-3 focus:border-indigo-500 focus:outline-none"
                    />
                  ) : (
                    <FormulaRenderer content={section.contentMarkdown} />
                  )}

                  {/* Source Citations Pill Footer */}
                  {section.sourceReferences.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-400">Slide Provenance:</span>
                      {section.sourceReferences.map((ref, rIdx) => (
                        <span
                          key={rIdx}
                          className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-700"
                        >
                          <BookOpen className="h-3 w-3 text-indigo-600" />
                          <span>{ref.documentName}</span>
                          {ref.slideNumber && (
                            <span className="font-bold text-indigo-700">
                              (Slide {ref.slideNumber})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
