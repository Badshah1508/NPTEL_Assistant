import os
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "NPTEL_Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite+aiosqlite:///./nptel_assistant.db"
    )

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*",
    ]

    @field_validator("CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    # File Storage & Limits
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
    UPLOAD_MAX_BYTES: int = 250 * 1024 * 1024  # 250 MB
    MAX_EXTRACTED_FILES: int = 200

    # AI Configuration (Provider-independent layer)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")  # mock, ollama, openai, gemini
    AI_MODEL: str = os.getenv("AI_MODEL", "nptel-assistant-v1")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Target constraints
    TARGET_QUESTIONS_PER_WEEK: int = 50
    EASY_QUESTIONS_COUNT: int = 10
    MEDIUM_QUESTIONS_COUNT: int = 25
    ADVANCED_QUESTIONS_COUNT: int = 15

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
