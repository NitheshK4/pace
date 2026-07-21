import os
from typing import List, Union
from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Pace LLM Observability"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/v1"

    # Database Settings
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://pace:pace@localhost:5432/pace",
        description="Async database connection string"
    )
    SYNC_DATABASE_URL: str = Field(
        default="postgresql://pace:pace@localhost:5432/pace",
        description="Sync database connection string for Alembic"
    )
    TIMESCALE_ENABLED: bool = Field(default=False)

    # Security Settings
    SECRET_KEY: str = Field(default="pace-development-secret-key-change-in-production-32bytes", min_length=16)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    INGESTION_KEY_SALT: str = Field(default="pace-ingestion-salt-32bytes-secret", min_length=16)

    # CORS Settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"]

    # Demo Mode
    DEMO_MODE: bool = False
    SEEDED_USER_EMAIL: str = "demo@pace.dev"
    SEEDED_USER_PASSWORD: str = "PaceDemo123!"

    # System & Retention
    DATA_RETENTION_DAYS: int = 90
    WORKER_ENABLED: bool = True

settings = Settings()
