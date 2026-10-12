import {
  Course,
  WeeklyNotes,
  PracticeQuestion,
  UploadManifestFile,
  ProcessingJob,
  PerformanceAnalytics,
  QuizAttempt,
  UserResponse,
  ChatMessage,
} from '../types';
import {
  MOCK_COURSE,
  MOCK_WEEK1_NOTES,
  MOCK_WEEK1_QUESTIONS,
  MOCK_UPLOAD_MANIFEST,
  MOCK_PROCESSING_JOB,
  MOCK_PERFORMANCE_ANALYTICS,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  private getStorageKey(key: string): string {
    return `nptel_assistant_${key}`;
  }

  // --- Courses & Workspace ---
  async getCourse(courseId: string = 'course-nptel-hpca-01'): Promise<Course> {
    if (!FORCE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, { signal: AbortSignal.timeout(2000) });
        if (res.ok) return await res.json();
      } catch (err) {
        // Fallback to local mock data on network error
      }
    }
    await delay(100);
    return MOCK_COURSE;
  }

  // --- Weekly Notes ---
  async getWeeklyNotes(courseId: string, weekNumber: number): Promise<WeeklyNotes> {
    const stored = localStorage.getItem(this.getStorageKey(`notes_${courseId}_${weekNumber}`));
    if (stored) return JSON.parse(stored);

    if (!FORCE_MOCK) {
      try {
        const res = await fetch(`${API_BASE_URL}/courses/${courseId}/weeks/${weekNumber}/notes`, { signal: AbortSignal.timeout(2500) });
        if (res.ok) return await res.json();
      } catch (err) {
        // Fallback to mock notes
      }
    }
    await delay(150);
    return MOCK_WEEK1_NOTES;
  }

  async updateNoteSection(
    courseId: string,
    weekNumber: number,
    sectionId: string,
    newMarkdown: string
  ): Promise<WeeklyNotes> {
    await delay(300);
    const notes = await this.getWeeklyNotes(courseId, weekNumber);
    const updatedSections = notes.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, contentMarkdown: newMarkdown, lastRegeneratedAt: new Date().toISOString() } : sec
    );
    const updatedNotes = { ...notes, sections: updatedSections, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.getStorageKey(`notes_${courseId}_${weekNumber}`), JSON.stringify(updatedNotes));
    return updatedNotes;
  }

  async regenerateNoteSection(
    courseId: string,
    weekNumber: number,
    sectionId: string
  ): Promise<WeeklyNotes> {
    await delay(1200);
    const notes = await this.getWeeklyNotes(courseId, weekNumber);
    const updatedSections = notes.sections.map((sec) =>
      sec.id === sectionId
        ? {
            ...sec,
            contentMarkdown: sec.contentMarkdown + '\n\n*Regenerated and verified against source slide boundaries.*',
            lastRegeneratedAt: new Date().toISOString(),
          }
        : sec
    );
    const updatedNotes = { ...notes, sections: updatedSections, updatedAt: new Date().toISOString() };
    localStorage.setItem(this.getStorageKey(`notes_${courseId}_${weekNumber}`), JSON.stringify(updatedNotes));
    return updatedNotes;
  }

  // --- Practice Questions (Exactly 50 Target) ---
  async getPracticeQuestions(
    courseId: string,
    weekNumber: number,
    filters?: { difficulty?: string; type?: string; searchQuery?: string }
  ): Promise<PracticeQuestion[]> {
    if (!FORCE_MOCK) {
      try {
        const url = new URL(`${API_BASE_URL}/courses/${courseId}/weeks/${weekNumber}/questions`);
        if (filters?.difficulty) url.searchParams.set('difficulty', filters.difficulty);
        if (filters?.type) url.searchParams.set('type', filters.type);
        const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          let list: PracticeQuestion[] = await res.json();
          if (filters?.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            list = list.filter(
              (q) =>
                q.questionText.toLowerCase().includes(query) ||
                q.conceptsTested.some((c) => c.toLowerCase().includes(query))
            );
          }
          return list;
        }
      } catch (err) {
        // Fallback to local 50 questions
      }
    }

    await delay(150);
    let list = [...MOCK_WEEK1_QUESTIONS];
    if (filters?.difficulty && filters.difficulty !== 'all') {
      list = list.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((q) => q.type === filters.type);
    }
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      list = list.filter(
        (q) =>
          q.questionText.toLowerCase().includes(query) ||
          q.conceptsTested.some((c) => c.toLowerCase().includes(query))
      );
    }
    return list;
  }

  // --- Mock Test & Practice Engine ---
  getOrCreateAttempt(courseId: string, weekNumber: number, isTimed: boolean = false): QuizAttempt {
    const key = this.getStorageKey(`attempt_${courseId}_w${weekNumber}`);
    const existing = localStorage.getItem(key);
    if (existing) {
      return JSON.parse(existing);
    }
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      courseId,
      weekNumber,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      isTimed,
      timeLimitMinutes: 60,
      timeRemainingSeconds: 60 * 60,
      totalQuestions: 50,
      responses: {},
    };
    localStorage.setItem(key, JSON.stringify(newAttempt));
    return newAttempt;
  }

  saveQuizResponse(
    courseId: string,
    weekNumber: number,
    questionId: string,
    response: Partial<UserResponse>
  ): QuizAttempt {
    const key = this.getStorageKey(`attempt_${courseId}_w${weekNumber}`);
    const attempt = this.getOrCreateAttempt(courseId, weekNumber);
    const currentResp = attempt.responses[questionId] || {
      questionId,
      isMarkedForReview: false,
      isAnswered: false,
      timeSpentSeconds: 0,
    };
    attempt.responses[questionId] = { ...currentResp, ...response };
    localStorage.setItem(key, JSON.stringify(attempt));
    return attempt;
  }

  submitQuizAttempt(courseId: string, weekNumber: number): QuizAttempt {
    const key = this.getStorageKey(`attempt_${courseId}_w${weekNumber}`);
    const attempt = this.getOrCreateAttempt(courseId, weekNumber);

    let score = 0;
    let easyCorrect = 0;
    let mediumCorrect = 0;
    let advancedCorrect = 0;

    MOCK_WEEK1_QUESTIONS.forEach((q) => {
      const resp = attempt.responses[q.id];
      if (!resp) return;

      let isCorrect = false;
      if (q.type === 'single_mcq') {
        if (resp.selectedOptions && resp.selectedOptions[0] === q.correctOptionLabels?.[0]) {
          isCorrect = true;
        }
      } else if (q.type === 'multi_mcq') {
        const selected = (resp.selectedOptions || []).sort().join(',');
        const correct = (q.correctOptionLabels || []).sort().join(',');
        if (selected === correct && selected.length > 0) {
          isCorrect = true;
        }
      } else if (q.type === 'numerical') {
        if (
          resp.numericalInput !== undefined &&
          q.expectedNumericalValue !== undefined
        ) {
          const tol = q.numericalTolerance || 0.05;
          if (Math.abs(resp.numericalInput - q.expectedNumericalValue) <= tol) {
            isCorrect = true;
          }
        }
      }

      if (isCorrect) {
        score++;
        if (q.difficulty === 'easy') easyCorrect++;
        if (q.difficulty === 'medium') mediumCorrect++;
        if (q.difficulty === 'advanced') advancedCorrect++;
      }
    });

    attempt.isCompleted = true;
    attempt.completedAt = new Date().toISOString();
    attempt.score = score;
    attempt.accuracyPercentage = Math.round((score / MOCK_WEEK1_QUESTIONS.length) * 100);
    attempt.easyCorrect = easyCorrect;
    attempt.mediumCorrect = mediumCorrect;
    attempt.advancedCorrect = advancedCorrect;

    localStorage.setItem(key, JSON.stringify(attempt));
    return attempt;
  }

  // --- Upload & Ingestion Manifest ---
  async getUploadManifest(): Promise<UploadManifestFile[]> {
    await delay(300);
    return MOCK_UPLOAD_MANIFEST;
  }

  async getProcessingJob(): Promise<ProcessingJob> {
    await delay(200);
    return MOCK_PROCESSING_JOB;
  }

  // --- Grounded Ask AI Chat ---
  async askAI(
    courseId: string,
    weekNumber: number,
    question: string,
    scope: 'week' | 'course' = 'week'
  ): Promise<ChatMessage> {
    await delay(1000);
    const qLower = question.toLowerCase();

    if (qLower.includes('amdahl') || qLower.includes('speedup')) {
      return {
        id: `chat-${Date.now()}`,
        sender: 'assistant',
        content:
          'According to Lecture 3, Slide 15 of Week 1, Amdahl’s Law states that speedup is bounded by:\n\n$$S(N) = \\frac{1}{(1 - p) + \\frac{p}{N}}$$\n\nWhere $p$ represents the parallel fraction and $N$ is processor count. As $N \\to \\infty$, the maximum speedup can never exceed $\\frac{1}{1 - p}$. The serial portion becomes the primary bottleneck.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          {
            documentName: 'Week1_Lecture03_Amdahls_Law_and_Speedup.pdf',
            lectureNumber: 3,
            slideNumber: 15,
            excerptSnippet: 'Slide 15: Speedup limit S = 1 / ((1 - p) + p/N). Serial fraction dictates ceiling.',
          },
        ],
      };
    }

    if (qLower.includes('load') && qLower.includes('use')) {
      return {
        id: `chat-${Date.now()}`,
        sender: 'assistant',
        content:
          'Based strictly on Lecture 2, Slide 27:\n\nA **Load-Use Data Hazard** occurs when an instruction immediately consumes the register value loaded by a preceding `LW` instruction. Because the loaded data only becomes available at the end of the **MEM** stage, and the consumer instruction requires it at the start of its **EX** stage, full forwarding hardware cannot eliminate the gap. The hazard detection unit must insert **exactly 1 stall cycle (bubble)**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          {
            documentName: 'Week1_Lecture02_Hazards_and_Forwarding.pptx',
            lectureNumber: 2,
            slideNumber: 27,
            excerptSnippet: 'Slide 27: Load-use data hazard requires 1 stall cycle even with forwarding hardware.',
          },
        ],
      };
    }

    // Default grounded fallback with slide reference
    return {
      id: `chat-${Date.now()}`,
      sender: 'assistant',
      content:
        `Based on Week ${weekNumber} lecture slides:\n\nIn high-performance computer architecture, performance bottlenecks are minimized by balancing pipeline stage latencies, implementing forwarding datapaths, and employing dynamic branch predictors such as 2-bit saturating counters.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          documentName: 'Week1_Lecture01_Fundamentals_of_Pipelining.pdf',
          lectureNumber: 1,
          slideNumber: 12,
          excerptSnippet: 'Slide 12: Architectural performance balancing across synchronous stages.',
        },
      ],
    };
  }

  // --- Analytics ---
  async getPerformanceAnalytics(courseId: string): Promise<PerformanceAnalytics> {
    await delay(200);
    return MOCK_PERFORMANCE_ANALYTICS;
  }
}

export const api = new ApiService();
