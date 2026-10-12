from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import courses, notes, questions, quizzes, upload, chat, analytics
from app.database.session import Base, engine

# Create tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NPTEL_Assistant — Intelligent Weekly Study Notes and NPTEL-Style Practice Platform API",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

# Include API Routers
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(notes.router, prefix="/api/courses", tags=["Weekly Notes"])
app.include_router(questions.router, prefix="/api/courses", tags=["50 Practice Questions"])
app.include_router(quizzes.router, prefix="/api/courses", tags=["Quizzes & Mock Tests"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload & Processing Pipeline"])
app.include_router(chat.router, prefix="/api/chat", tags=["Grounded Ask AI"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Progress Analytics"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
