"""
SandGuard Core Configuration Module
Pydantic v2 BaseSettings implementation for typed environment management.
"""

from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # Core System
    PROJECT_NAME: str = "SandGuard AI Monitoring Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return []

    # Security
    SECRET_KEY: str = "super_secret_sandguard_jwt_key_change_in_production_min32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database Settings
    POSTGRES_USER: str = "sandguard"
    POSTGRES_PASSWORD: str = "sandguard_secret_pass"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "sandguard_db"

    DATABASE_URL: str = "postgresql+asyncpg://sandguard:sandguard_secret_pass@localhost:5432/sandguard_db"
    SYNC_DATABASE_URL: str = "postgresql://sandguard:sandguard_secret_pass@localhost:5432/sandguard_db"

    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # AI Service Keys
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""

    # GIS & File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 500

    # Notification & Email Settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "alerts@sandguard.gov"
    EMAILS_FROM_NAME: str = "SandGuard Monitoring Team"

    # SMS Settings
    SMS_API_KEY: str = ""
    SMS_SENDER_ID: str = "SANDGUARD"


settings = Settings()
