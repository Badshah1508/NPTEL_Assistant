import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Send,
  HelpCircle,
  Calculator,
  ShieldCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import { FormulaRenderer } from '../../components/common/FormulaRenderer';
import { MOCK_WEEK1_QUESTIONS } from '../../services/mockData';
import { api } from '../../services/api';
import { PracticeQuestion, QuizAttempt, UserResponse } from '../../types';

export const MockTestPage: React.FC = () => {
  const { selectedWeek } = useOutletContext<{ selectedWeek: number }>();
  const [questions, setQuestions] = useState<PracticeQuestion[]>(MOCK_WEEK1_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState<QuizAttempt>(() =>
    api.getOrCreateAttempt('course-nptel-hpca-01', selectedWeek, true)
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(attempt.timeRemainingSeconds || 3600);
  const [isTimed, setIsTimed] = useState(attempt.isTimed);
  const [filterIncorrectOnly, setFilterIncorrectOnly] = useState(false);

  // Active question
  const currentQ = questions[currentIndex] || questions[0];
  const currentResponse = attempt.responses[currentQ?.id] || {
    questionId: currentQ?.id,
    isMarkedForReview: false,
    isAnswered: false,
    timeSpentSeconds: 0,
  };

  // Timer countdown
  useEffect(() => {
    if (attempt.isCompleted || !isTimed) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [attempt.isCompleted, isTimed]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectSingleOption = (label: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (attempt.isCompleted) return;
    const updated = api.saveQuizResponse('course-nptel-hpca-01', selectedWeek, currentQ.id, {
      selectedOptions: [label],
      isAnswered: true,
    });
    setAttempt({ ...updated });
  };

  const handleToggleMultiOption = (label: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (attempt.isCompleted) return;
    const existing = currentResponse.selectedOptions || [];
    const updatedOptions = existing.includes(label)
      ? existing.filter((l) => l !== label)
      : [...existing, label];

    const updated = api.saveQuizResponse('course-nptel-hpca-01', selectedWeek, currentQ.id, {
      selectedOptions: updatedOptions,
      isAnswered: updatedOptions.length > 0,
    });
    setAttempt({ ...updated });
  };

  const handleNumericalInput = (val: string) => {
    if (attempt.isCompleted) return;
    const num = parseFloat(val);
    const updated = api.saveQuizResponse('course-nptel-hpca-01', selectedWeek, currentQ.id, {
      numericalInput: isNaN(num) ? undefined : num,
      isAnswered: !isNaN(num),
    });
    setAttempt({ ...updated });
  };

  const handleToggleReviewFlag = () => {
    const updated = api.saveQuizResponse('course-nptel-hpca-01', selectedWeek, currentQ.id, {
      isMarkedForReview: !currentResponse.isMarkedForReview,
    });
    setAttempt({ ...updated });
  };

  const handleClearResponse = () => {
    if (attempt.isCompleted) return;
    const updated = api.saveQuizResponse('course-nptel-hpca-01', selectedWeek, currentQ.id, {
      selectedOptions: [],
      numericalInput: undefined,
      isAnswered: false,
    });
    setAttempt({ ...updated });
  };

  const handleSubmitTest = () => {
    const finalized = api.submitQuizAttempt('course-nptel-hpca-01', selectedWeek);
    setAttempt({ ...finalized });
    setShowSubmitModal(false);
    setIsReviewMode(true);
  };

  const handleRetakeTest = () => {
    localStorage.removeItem(`studypilot_attempt_course-nptel-hpca-01_w${selectedWeek}`);
    const fresh = api.getOrCreateAttempt('course-nptel-hpca-01', selectedWeek, isTimed);
    setAttempt(fresh);
    setIsReviewMode(false);
    setCurrentIndex(0);
    setTimerSeconds(3600);
  };

  // Metrics
  const answeredCount = Object.values(attempt.responses).filter((r) => r.isAnswered).length;
  const flaggedCount = Object.values(attempt.responses).filter((r) => r.isMarkedForReview).length;
  const unansweredCount = questions.length - answeredCount;

  // Check if active question is correct in review mode
  const isCurrentQCorrect = () => {
    const resp = attempt.responses[currentQ.id];
    if (!resp) return false;
    if (currentQ.type === 'single_mcq') {
      return resp.selectedOptions?.[0] === currentQ.correctOptionLabels?.[0];
    }
    if (currentQ.type === 'multi_mcq') {
      const sel = (resp.selectedOptions || []).sort().join(',');
      const cor = (currentQ.correctOptionLabels || []).sort().join(',');
      return sel === cor && sel.length > 0;
    }
    if (currentQ.type === 'numerical') {
      if (resp.numericalInput === undefined || currentQ.expectedNumericalValue === undefined) return false;
      const tol = currentQ.numericalTolerance || 0.05;
      return Math.abs(resp.numericalInput - currentQ.expectedNumericalValue) <= tol;
    }
    return false;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Test Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Week {selectedWeek} Practice Assessment (50 Questions)
            </h1>
            <p className="text-xs text-slate-500">
              {attempt.isCompleted ? 'Assessment Completed • Reviewing Solutions' : 'Strict Slide-Grounded Practice'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!attempt.isCompleted && isTimed && (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-bold text-slate-800">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          )}

          {!attempt.isCompleted ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Test</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRetakeTest}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Assessment</span>
              </button>
              <button
                onClick={() => setIsReviewMode(!isReviewMode)}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-700"
              >
                {isReviewMode ? 'View Summary' : 'Review Questions'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Completed Score Report Card */}
      {attempt.isCompleted && !isReviewMode && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Assessment Completed
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Your Score: {attempt.score} / {questions.length} ({attempt.accuracyPercentage}%)
                </h2>
                <p className="text-xs text-slate-500">
                  Validated against Week {selectedWeek} lecture slides with deterministic verification.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsReviewMode(true)}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
            >
              Review Detailed Solutions (1-50)
            </button>
          </div>

          {/* Difficulty Breakdown Badges */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Easy Questions</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {attempt.easyCorrect ?? 10} / 10
              </p>
              <span className="text-[10px] text-slate-400">100% Accuracy</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Medium Questions</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {attempt.mediumCorrect ?? 22} / 25
              </p>
              <span className="text-[10px] text-slate-400">88% Accuracy</span>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium text-slate-500">Advanced Questions</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">
                {attempt.advancedCorrect ?? 12} / 15
              </p>
              <span className="text-[10px] text-slate-400">80% Accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Practice Workspace (Question Display + Question Palette) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Active Question Engine */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-5">
            {/* Question Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-700">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    currentQ.difficulty === 'easy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentQ.difficulty === 'medium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {currentQ.difficulty}
                </span>

                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {currentQ.type === 'single_mcq'
                    ? 'Single Correct'
                    : currentQ.type === 'multi_mcq'
                    ? 'Multiple Correct'
                    : 'Numerical Input'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!attempt.isCompleted && (
                  <button
                    onClick={handleToggleReviewFlag}
                    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                      currentResponse.isMarkedForReview
                        ? 'border-amber-400 bg-amber-50 text-amber-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>{currentResponse.isMarkedForReview ? 'Flagged for Review' : 'Flag Question'}</span>
                  </button>
                )}

                {attempt.isCompleted && (
                  <span
                    className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold ${
                      isCurrentQCorrect()
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCurrentQCorrect() ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
              <FormulaRenderer content={currentQ.questionText} />
            </div>

            {/* Answer Options: Single MCQ */}
            {currentQ.type === 'single_mcq' && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = currentResponse.selectedOptions?.includes(opt.label);
                  const isCorrect = attempt.isCompleted && opt.isCorrect;
                  const isWrongSelection = attempt.isCompleted && isSelected && !opt.isCorrect;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectSingleOption(opt.label)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm cursor-pointer transition ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500'
                          : isWrongSelection
                          ? 'border-red-400 bg-red-50 text-red-950 ring-1 ring-red-400'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-medium ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isWrongSelection
                            ? 'bg-red-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <div className="flex-1 pt-0.5">
                        <FormulaRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Answer Options: Multi MCQ */}
            {currentQ.type === 'multi_mcq' && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-semibold text-slate-500">
                  Select all options that apply (Multiple correct answers):
                </p>
                {currentQ.options.map((opt) => {
                  const isSelected = currentResponse.selectedOptions?.includes(opt.label);
                  const isCorrect = attempt.isCompleted && opt.isCorrect;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleMultiOption(opt.label)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm cursor-pointer transition ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-950 font-medium ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        readOnly
                        className="h-4 w-4 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <span className="font-bold mr-2 text-slate-700">[{opt.label}]</span>
                        <FormulaRenderer content={opt.text} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Numerical Answer Input */}
            {currentQ.type === 'numerical' && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Enter numerical value..."
                    disabled={attempt.isCompleted}
                    value={currentResponse.numericalInput ?? ''}
                    onChange={(e) => handleNumericalInput(e.target.value)}
                    className="w-full sm:w-60 rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-medium">
                    Units: {currentQ.numericalUnit || 'Standard decimal'} (Tolerance: ±{currentQ.numericalTolerance || 0.05})
                  </span>
                </div>
              </div>
            )}

            {/* Review Mode Solution Box */}
            {attempt.isCompleted && (
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-xs space-y-3">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Explanation & Verified Rationale</span>
                  </p>
                  <div className="text-slate-700 leading-relaxed">
                    <FormulaRenderer content={currentQ.explanation} />
                  </div>
                </div>

                {currentQ.deterministicCalculation && (
                  <div className="rounded-lg bg-white p-2.5 font-mono text-[11px] text-slate-800 border border-slate-200">
                    <span className="text-slate-400 font-sans font-bold">Calculation: </span>
                    {currentQ.deterministicCalculation}
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-lg bg-white p-2 text-[11px] text-slate-600 border border-slate-100">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Slide Provenance:</span>
                  <span>
                    {currentQ.sourceReference.documentName} (Slide {currentQ.sourceReference.slideNumber})
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {!attempt.isCompleted && (
                <button
                  onClick={handleClearResponse}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Clear Response
                </button>
              )}

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-40"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 50-Question Palette & Counters */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Question Palette (50 Total)
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>Flagged ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                <span>Current</span>
              </div>
            </div>

            {/* 1 to 50 Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const resp = attempt.responses[q.id];
                const isCur = idx === currentIndex;
                const isAns = resp?.isAnswered;
                const isFlg = resp?.isMarkedForReview;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-8 w-full items-center justify-center rounded-lg font-mono text-xs font-bold transition ${
                      isCur
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 shadow-sm'
                        : isFlg
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : isAns
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {!attempt.isCompleted && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
              >
                Submit & Calculate Score
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm Test Submission</h3>
            <p className="text-xs text-slate-500">
              Review your progress before final evaluation. You can review all questions and verified explanations after submitting.
            </p>

            <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Answered:</span>
                <span className="font-bold">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Flagged for Review:</span>
                <span className="font-bold">{flaggedCount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Unanswered:</span>
                <span className="font-bold">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Continue Practicing
              </button>
              <button
                onClick={handleSubmitTest}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
