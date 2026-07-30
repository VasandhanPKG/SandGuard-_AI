"""
SandGuard Core Database Module
SQLAlchemy 2.0 Async/Sync engine, PostGIS session management, and dependency injection helpers.
"""

import logging
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

logger = logging.getLogger("sandguard.database")

# Async Engine for FastAPI APIs
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Sync Engine for Alembic & Background Tasks
sync_engine = create_engine(
    settings.SYNC_DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy 2.0 models."""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining async database session in FastAPI endpoints."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as exc:
            await session.rollback()
            logger.error(f"Database session error: {str(exc)}")
            raise
        finally:
            await session.close()


def get_sync_db() -> Generator:
    """Dependency / helper for synchronous database sessions (e.g. Celery workers)."""
    db = SyncSessionLocal()
    try:
        yield db
        db.commit()
    except Exception as exc:
        db.rollback()
        logger.error(f"Sync database session error: {str(exc)}")
        raise
    finally:
        db.close()


async def init_db_extensions() -> None:
    """Ensure PostGIS extension exists in PostgreSQL."""
    async with async_engine.begin() as conn:
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
            logger.info("PostGIS and UUID extensions initialized successfully.")
        except Exception as e:
            logger.warning(f"Could not initialize PostGIS extensions directly (may require superuser privileges): {e}")
