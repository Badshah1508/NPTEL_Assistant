import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  HelpCircle,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Download,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Calculator,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FormulaRenderer } from '../../components/common/FormulaRenderer';
import { MOCK_WEEK1_QUESTIONS, MOCK_COURSE } from '../../services/mockData';
import { DifficultyLevel, PracticeQuestion, QuestionType } from '../../types';

export const QuestionBankPage: React.FC = () => {
  const { selectedWeek } = useOutletContext<{ selectedWeek: number }>();
  const [questions, setQuestions] = useState<PracticeQuestion[]>(MOCK_WEEK1_QUESTIONS);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  const weekInfo = MOCK_COURSE.weeks.find((w) => w.weekNumber === selectedWeek) || MOCK_COURSE.weeks[0];

  const toggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllAnswers = () => {
    const allExpanded = Object.keys(expandedAnswers).length === questions.length;
    if (allExpanded) {
      setExpandedAnswers({});
    } else {
      const newMap: Record<string, boolean> = {};
      questions.forEach((q) => {
        newMap[q.id] = true;
      });
      setExpandedAnswers(newMap);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    if (typeFilter !== 'all' && q.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchText = q.questionText.toLowerCase().includes(query);
      const matchConcept = q.conceptsTested.some((c) => c.toLowerCase().includes(query));
      if (!matchText && !matchConcept) return false;
    }
    return true;
  });

  const easyCount = questions.filter((q) => q.difficulty === 'easy').length;
  const mediumCount = questions.filter((q) => q.difficulty === 'medium').length;
  const advancedCount = questions.filter((q) => q.difficulty === 'advanced').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Week {selectedWeek} Practice Bank
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Strict Slide-Grounded Only
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {weekInfo.validQuestionsCount} Validated NPTEL-Style Questions
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Target: 50 Questions per week (10 Easy, 25 Medium, 15 Advanced). Generated and verified exclusively from Week {selectedWeek} slides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/mock-test"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Launch Mock Test</span>
          </Link>
          <button
            onClick={toggleAllAnswers}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <span>{Object.keys(expandedAnswers).length === questions.length ? 'Hide All Explanations' : 'Show All Explanations'}</span>
          </button>
        </div>
      </div>

      {/* Shortage Warning Banner (If week has < 50 questions) */}
      {weekInfo.shortageExplanation && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <span>Source Grounding Shortage Notice ({weekInfo.validQuestionsCount} / {weekInfo.targetQuestionsCount} Questions)</span>
          </div>
          <p className="leading-relaxed">
            {weekInfo.shortageExplanation} StudyPilot AI prioritizes factual authenticity over arbitrary counts and never invents synthetic questions.
          </p>
        </div>
      )}

      {/* Distribution Counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          onClick={() => setDifficultyFilter('all')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            difficultyFilter === 'all'
              ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Total Validated</span>
          <p className="mt-1 text-xl font-bold text-slate-900">{questions.length} / 50</p>
          <span className="text-[10px] text-slate-500">Target Reached</span>
        </div>

        <div
          onClick={() => setDifficultyFilter('easy')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            difficultyFilter === 'easy'
              ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Easy (Target: 10)</span>
          <p className="mt-1 text-xl font-bold text-emerald-600">{easyCount} Qs</p>
          <span className="text-[10px] text-slate-500">Definitions & Basics</span>
        </div>

        <div
          onClick={() => setDifficultyFilter('medium')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            difficultyFilter === 'medium'
              ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Medium (Target: 25)</span>
          <p className="mt-1 text-xl font-bold text-blue-600">{mediumCount} Qs</p>
          <span className="text-[10px] text-slate-500">Application & Stalls</span>
        </div>

        <div
          onClick={() => setDifficultyFilter('advanced')}
          className={`cursor-pointer rounded-xl border p-3.5 transition ${
            difficultyFilter === 'advanced'
              ? 'border-purple-500 bg-purple-50/30 ring-1 ring-purple-500'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Advanced (Target: 15)</span>
          <p className="mt-1 text-xl font-bold text-purple-600">{advancedCount} Qs</p>
          <span className="text-[10px] text-slate-500">Multistep Math & Arch</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or tested concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (10)</option>
              <option value="medium">Medium (25)</option>
              <option value="advanced">Advanced (15)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Format:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Formats</option>
              <option value="single_mcq">Single Choice MCQ</option>
              <option value="multi_mcq">Multiple Choice MCQ</option>
              <option value="numerical">Numerical Answer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {filteredQuestions.map((question) => {
          const isExpanded = expandedAnswers[question.id];

          return (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition space-y-4"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-bold text-indigo-700">
                    Q{question.questionNumber}
                  </span>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      question.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : question.difficulty === 'medium'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {question.difficulty}
                  </span>

                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {question.type === 'single_mcq'
                      ? 'Single Choice MCQ'
                      : question.type === 'multi_mcq'
                      ? 'Multiple Choice MCQ'
                      : 'Numerical Problem'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Grounded
                  </span>
                  <button
                    onClick={() => toggleAnswer(question.id)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <span>{isExpanded ? 'Hide Answer' : 'View Answer & Explanation'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Question Body */}
              <div className="text-sm font-medium text-slate-900 leading-relaxed">
                <FormulaRenderer content={question.questionText} />
              </div>

              {/* MCQ Options */}
              {question.options && (
                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {question.options.map((opt) => {
                    const isCorrect = isExpanded && opt.isCorrect;
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-slate-50/50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.label}
                        </span>
                        <div className="flex-1">
                          <FormulaRenderer content={opt.text} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Numerical Answer Info */}
              {question.type === 'numerical' && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-indigo-600" />
                    <span>Format: Decimal numerical value (Units: {question.numericalUnit || 'none'})</span>
                  </div>
                  {isExpanded && (
                    <span className="font-mono font-bold text-emerald-700">
                      Answer: {question.expectedNumericalValue} (±{question.numericalTolerance || 0.05})
                    </span>
                  )}
                </div>
              )}

              {/* Expanded Explanation & Slide Citations */}
              {isExpanded && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-xs space-y-3">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Correct Solution & Rationale</span>
                    </p>
                    <div className="text-slate-700 leading-relaxed">
                      <FormulaRenderer content={question.explanation} />
                    </div>
                  </div>

                  {question.deterministicCalculation && (
                    <div className="rounded-lg bg-white p-2.5 font-mono text-[11px] text-slate-800 border border-slate-200">
                      <span className="text-slate-400 font-sans font-bold">Deterministic Calculation: </span>
                      {question.deterministicCalculation}
                    </div>
                  )}

                  {/* Tested Concepts Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-slate-500 font-semibold text-[11px]">Concepts Tested:</span>
                    {question.conceptsTested.map((con, cIdx) => (
                      <span
                        key={cIdx}
                        className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-800"
                      >
                        {con}
                      </span>
                    ))}
                  </div>

                  {/* Exact Slide Grounding Citation */}
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2 text-[11px] text-slate-600 border border-slate-100">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Source Provenance:</span>
                    <span>
                      {question.sourceReference.documentName}
                      {question.sourceReference.slideNumber && ` (Slide ${question.sourceReference.slideNumber})`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
