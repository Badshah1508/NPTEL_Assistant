export type QuestionType = 'single_mcq' | 'multi_mcq' | 'numerical';
export type DifficultyLevel = 'easy' | 'medium' | 'advanced';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'partial';

export interface SourceReference {
  documentId?: string;
  documentName: string;
  lectureNumber: number;
  slideNumber?: number;
  pageNumber?: number;
  sectionHeading?: string;
  excerptSnippet: string;
}

export interface ConceptItem {
  id: string;
  name: string;
  category: 'definition' | 'formula' | 'algorithm' | 'principle' | 'comparison' | 'distinction';
  description: string;
  lectureNumber: number;
  slideOrPage: string;
  importance: 'high' | 'medium' | 'standard';
  coveredInNotes: boolean;
  coveredInQuestions: boolean;
}

export interface ConceptCoverageReport {
  weekId: string;
  totalIdentifiedConcepts: number;
  notesCoveragePercentage: number;
  questionsCoveragePercentage: number;
  coveredConceptsCount: number;
  inventory: ConceptItem[];
  missingConceptsWarnings: string[];
}

export interface NoteSection {
  id: string;
  title: string;
  subtitle?: string;
  category: 'overview' | 'definitions' | 'principles' | 'formulas' | 'algorithms' | 'examples' | 'comparisons' | 'misconceptions' | 'quick_revision';
  contentMarkdown: string;
  sourceReferences: SourceReference[];
  lastRegeneratedAt?: string;
}

export interface WeeklyNotes {
  id: string;
  courseId: string;
  weekNumber: number;
  weekTitle: string;
  lecturesCovered: number[];
  overview: string;
  sections: NoteSection[];
  coverageReport: ConceptCoverageReport;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isCorrect?: boolean;
  explanation?: string;
}

export interface PracticeQuestion {
  id: string;
  weekId: string;
  weekNumber: number;
  courseId: string;
  questionNumber: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  questionText: string;
  options?: QuestionOption[];
  correctOptionLabels?: ('A' | 'B' | 'C' | 'D' | 'E')[];
  expectedNumericalValue?: number;
  numericalTolerance?: number;
  numericalUnit?: string;
  explanation: string;
  conceptsTested: string[];
  sourceReference: SourceReference;
  deterministicCalculation?: string;
  validationStatus: 'validated' | 'repaired' | 'flagged_for_review';
  isSlideOnlyGrounded: boolean;
}

export interface WeekOverview {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  lecturesCount: number;
  documentsCount: number;
  hasNotes: boolean;
  notesCoveragePercentage: number;
  validQuestionsCount: number; // Target 50
  targetQuestionsCount: number; // 50
  shortageExplanation?: string;
  status: 'ready' | 'processing' | 'partial' | 'unprocessed';
  lastUpdated: string;
}

export interface Course {
  id: string;
  title: string;
  code?: string;
  description: string;
  totalWeeks: number;
  totalLectures: number;
  createdAt: string;
  updatedAt: string;
  weeks: WeekOverview[];
}

export interface UploadManifestFile {
  id: string;
  filename: string;
  fileSizeBytes: number;
  fileType: 'pdf' | 'pptx' | 'docx' | 'txt' | 'md';
  assignedWeek: number;
  lectureNumber: number;
  detectedTitle: string;
  slideOrPageCount: number;
  status: 'valid' | 'warning' | 'error';
  warningMessage?: string;
  isIncluded: boolean;
}

export interface ProcessingJobStep {
  stepIndex: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  progressPercentage: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface ProcessingJob {
  jobId: string;
  courseId: string;
  status: JobStatus;
  overallProgress: number;
  currentStepIndex: number;
  steps: ProcessingJobStep[];
  logs: string[];
  warnings: string[];
}

export interface UserResponse {
  questionId: string;
  selectedOptions?: ('A' | 'B' | 'C' | 'D' | 'E')[];
  numericalInput?: number;
  isMarkedForReview: boolean;
  isAnswered: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  courseId: string;
  weekNumber: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  isTimed: boolean;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
  totalQuestions: number;
  responses: Record<string, UserResponse>;
  score?: number;
  accuracyPercentage?: number;
  easyCorrect?: number;
  mediumCorrect?: number;
  advancedCorrect?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: SourceReference[];
  isOutOfScopeWarning?: boolean;
}

export interface PerformanceAnalytics {
  totalQuizzesTaken: number;
  averageScorePercentage: number;
  totalQuestionsAttempted: number;
  overallAccuracyPercentage: number;
  accuracyByDifficulty: {
    easy: number;
    medium: number;
    advanced: number;
  };
  weakTopics: {
    topic: string;
    accuracyPercentage: number;
    recommendedWeek: number;
    missedQuestionsCount: number;
  }[];
  recentAttempts: {
    attemptId: string;
    weekTitle: string;
    weekNumber: number;
    score: number;
    total: number;
    date: string;
  }[];
}
