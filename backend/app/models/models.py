import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    code = Column(String(64), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    weeks = relationship("Week", back_populates="course", cascade="all, delete-orphan")
    documents = relationship("LectureDocument", back_populates="course", cascade="all, delete-orphan")

class Week(Base):
    __tablename__ = "weeks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False, index=True)
    week_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(32), default="unprocessed")  # unprocessed, processing, ready, partial
    shortage_explanation = Column(Text, nullable=True)
    notes_coverage_percentage = Column(Float, default=0.0)
    valid_questions_count = Column(Integer, default=0)
    target_questions_count = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course", back_populates="weeks")
    documents = relationship("LectureDocument", back_populates="week")
    notes = relationship("WeeklyNotes", back_populates="week", uselist=False, cascade="all, delete-orphan")
    concepts = relationship("WeeklyConcept", back_populates="week", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="week", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="week", cascade="all, delete-orphan")

class LectureDocument(Base):
    __tablename__ = "lecture_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False, index=True)
    week_id = Column(String(36), ForeignKey("weeks.id"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    stored_path = Column(String(512), nullable=False)
    file_type = Column(String(16), nullable=False)  # pdf, pptx, docx, txt, md
    file_size_bytes = Column(Integer, nullable=False)
    lecture_number = Column(Integer, default=1)
    detected_title = Column(String(255), nullable=True)
    slide_or_page_count = Column(Integer, default=0)
    extraction_status = Column(String(32), default="pending")  # pending, extracted, failed
    is_included = Column(Boolean, default=True)
    warning_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="documents")
    week = relationship("Week", back_populates="documents")
    chunks = relationship("SourceChunk", back_populates="document", cascade="all, delete-orphan")

class SourceChunk(Base):
    __tablename__ = "source_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("lecture_documents.id"), nullable=False, index=True)
    week_id = Column(String(36), ForeignKey("weeks.id"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    slide_number = Column(Integer, nullable=True)
    page_number = Column(Integer, nullable=True)
    section_heading = Column(String(255), nullable=True)
    content_text = Column(Text, nullable=False)
    char_length = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("LectureDocument", back_populates="chunks")

class WeeklyConcept(Base):
    __tablename__ = "weekly_concepts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    week_id = Column(String(36), ForeignKey("weeks.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False)  # definition, formula, algorithm, principle, comparison
    description = Column(Text, nullable=False)
    lecture_number = Column(Integer, default=1)
    slide_or_page = Column(String(64), nullable=True)
    importance = Column(String(32), default="high")  # high, medium, standard
    covered_in_notes = Column(Boolean, default=True)
    covered_in_questions = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    week = relationship("Week", back_populates="concepts")

class WeeklyNotes(Base):
    __tablename__ = "weekly_notes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    week_id = Column(String(36), ForeignKey("weeks.id"), unique=True, nullable=False)
    overview = Column(Text, nullable=False)
    lectures_covered = Column(JSON, default=list)  # [1, 2, 3, 4]
    coverage_score = Column(Float, default=100.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    week = relationship("Week", back_populates="notes")
    sections = relationship("NoteSection", back_populates="weekly_notes", cascade="all, delete-orphan", order_by="NoteSection.order_index")

class NoteSection(Base):
    __tablename__ = "note_sections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    weekly_notes_id = Column(String(36), ForeignKey("weekly_notes.id"), nullable=False, index=True)
    order_index = Column(Integer, default=0)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    category = Column(String(64), default="principles")
    content_markdown = Column(Text, nullable=False)
    source_references = Column(JSON, default=list)
    last_regenerated_at = Column(DateTime, nullable=True)

    weekly_notes = relationship("WeeklyNotes", back_populates="sections")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    week_id = Column(String(36), ForeignKey("weeks.id"), nullable=False, index=True)
    question_number = Column(Integer, nullable=False)
    type = Column(String(32), nullable=False)  # single_mcq, multi_mcq, numerical
    difficulty = Column(String(32), nullable=False)  # easy, medium, advanced
    question_text = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    concepts_tested = Column(JSON, default=list)
    source_reference = Column(JSON, nullable=False)  # { documentName, lectureNumber, slideNumber, excerptSnippet }
    deterministic_calculation = Column(Text, nullable=True)
    expected_numerical_value = Column(Float, nullable=True)
    numerical_tolerance = Column(Float, nullable=True)
    numerical_unit = Column(String(32), nullable=True)
    validation_status = Column(String(32), default="validated")  # validated, repaired, flagged_for_review
    is_slide_only_grounded = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    week = relationship("Week", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.label")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False, index=True)
    label = Column(String(8), nullable=False)  # A, B, C, D, E
    text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)

    question = relationship("Question", back_populates="options")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    week_id = Column(String(36), ForeignKey("weeks.id"), nullable=False, index=True)
    user_id = Column(String(36), default="default-student", index=True)
    is_completed = Column(Boolean, default=False)
    is_timed = Column(Boolean, default=False)
    time_limit_minutes = Column(Integer, default=60)
    score = Column(Integer, default=0)
    accuracy_percentage = Column(Float, default=0.0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    week = relationship("Week", back_populates="quiz_attempts")
    responses = relationship("QuizResponse", back_populates="attempt", cascade="all, delete-orphan")

class QuizResponse(Base):
    __tablename__ = "quiz_responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    attempt_id = Column(String(36), ForeignKey("quiz_attempts.id"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False, index=True)
    selected_options = Column(JSON, default=list)
    numerical_input = Column(Float, nullable=True)
    is_marked_for_review = Column(Boolean, default=False)
    is_answered = Column(Boolean, default=False)
    is_correct = Column(Boolean, default=False)
    time_spent_seconds = Column(Integer, default=0)

    attempt = relationship("QuizAttempt", back_populates="responses")

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False, index=True)
    status = Column(String(32), default="processing")  # pending, processing, completed, failed
    overall_progress = Column(Integer, default=0)
    current_step_index = Column(Integer, default=1)
    logs = Column(JSON, default=list)
    warnings = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
