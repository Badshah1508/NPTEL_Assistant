from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SourceReferenceSchema(BaseModel):
    documentName: str
    lectureNumber: int
    slideNumber: Optional[int] = None
    pageNumber: Optional[int] = None
    sectionHeading: Optional[str] = None
    excerptSnippet: str

class QuestionOptionSchema(BaseModel):
    id: str
    label: str
    text: str
    isCorrect: Optional[bool] = None
    explanation: Optional[str] = None

class QuestionSchema(BaseModel):
    id: str
    weekId: str
    weekNumber: int
    questionNumber: int
    type: str  # single_mcq, multi_mcq, numerical
    difficulty: str  # easy, medium, advanced
    questionText: str
    options: Optional[List[QuestionOptionSchema]] = None
    correctOptionLabels: Optional[List[str]] = None
    expectedNumericalValue: Optional[float] = None
    numericalTolerance: Optional[float] = None
    numericalUnit: Optional[str] = None
    explanation: str
    conceptsTested: List[str] = []
    sourceReference: SourceReferenceSchema
    deterministicCalculation: Optional[str] = None
    validationStatus: str = "validated"
    isSlideOnlyGrounded: bool = True

class NoteSectionSchema(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    category: str
    contentMarkdown: str
    sourceReferences: List[SourceReferenceSchema] = []
    lastRegeneratedAt: Optional[str] = None

class ConceptItemSchema(BaseModel):
    id: str
    name: str
    category: str
    description: str
    lectureNumber: int
    slideOrPage: str
    importance: str
    coveredInNotes: bool = True
    coveredInQuestions: bool = True

class ConceptCoverageReportSchema(BaseModel):
    weekId: str
    totalIdentifiedConcepts: int
    notesCoveragePercentage: float
    questionsCoveragePercentage: float
    coveredConceptsCount: int
    inventory: List[ConceptItemSchema] = []
    missingConceptsWarnings: List[str] = []

class WeeklyNotesSchema(BaseModel):
    id: str
    courseId: str
    weekNumber: int
    weekTitle: str
    lecturesCovered: List[int]
    overview: str
    sections: List[NoteSectionSchema]
    coverageReport: ConceptCoverageReportSchema

class WeekOverviewSchema(BaseModel):
    id: str
    courseId: str
    weekNumber: int
    title: str
    lecturesCount: int
    documentsCount: int
    hasNotes: bool
    notesCoveragePercentage: float
    validQuestionsCount: int
    targetQuestionsCount: int = 50
    shortageExplanation: Optional[str] = None
    status: str
    lastUpdated: str

class CourseSchema(BaseModel):
    id: str
    title: str
    code: Optional[str] = None
    description: str
    totalWeeks: int
    totalLectures: int
    weeks: List[WeekOverviewSchema] = []

class UserResponseInputSchema(BaseModel):
    selectedOptions: Optional[List[str]] = None
    numericalInput: Optional[float] = None
    isMarkedForReview: bool = False
    isAnswered: bool = False
    timeSpentSeconds: int = 0

class QuizAttemptSchema(BaseModel):
    id: str
    courseId: str
    weekNumber: int
    startedAt: str
    completedAt: Optional[str] = None
    isCompleted: bool
    isTimed: bool
    timeLimitMinutes: int
    score: Optional[int] = None
    accuracyPercentage: Optional[float] = None
    totalQuestions: int = 50
    responses: Dict[str, Any] = {}

class UploadManifestItemSchema(BaseModel):
    id: str
    filename: str
    fileSizeBytes: int
    fileType: str
    assignedWeek: int
    lectureNumber: int
    detectedTitle: str
    slideOrPageCount: int
    status: str
    warningMessage: Optional[str] = None
    isIncluded: bool = True

class AskAIRequestSchema(BaseModel):
    question: str
    courseId: str
    weekNumber: int
    scope: str = "week"  # "week" or "course"

class AskAIResponseSchema(BaseModel):
    id: str
    sender: str = "assistant"
    content: str
    timestamp: str
    citations: List[SourceReferenceSchema] = []
    isOutOfScopeWarning: bool = False
