from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# For universal compatibility (works seamlessly with SQLite locally and PostgreSQL in production)
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite+aiosqlite://"):
    sync_db_url = db_url.replace("sqlite+aiosqlite://", "sqlite://")
elif db_url.startswith("postgresql+asyncpg://"):
    sync_db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
else:
    sync_db_url = db_url

connect_args = {"check_same_thread": False} if "sqlite" in sync_db_url else {}

engine = create_engine(sync_db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
