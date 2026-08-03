"""
SandGuard Core Database Module
SQLAlchemy 2.0 Async/Sync engine, PostGIS session management, and dependency injection helpers with offline fallback.
"""

import logging
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

logger = logging.getLogger("sandguard.database")

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy 2.0 models."""
    pass

# Async Engine for PostgreSQL
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10
)

# Primary Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Fallback Async Engine & Session Factory (In-Memory SQLite with StaticPool so tables persist across sessions)
fallback_async_engine = create_async_engine(
    "sqlite+aiosqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=False
)

FallbackAsyncSessionLocal = async_sessionmaker(
    bind=fallback_async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

_use_fallback = False

# Sync Engine for Alembic & Background Tasks
try:
    sync_engine = create_engine(
        settings.SYNC_DATABASE_URL,
        echo=settings.DEBUG,
        pool_pre_ping=True
    )
except Exception as e:
    logger.warning(f"Sync database engine creation warning ({e}). Using SQLite memory engine for sync tasks.")
    sync_engine = create_engine("sqlite:///:memory:")

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False
)


async def init_db_extensions() -> None:
    """Ensure PostGIS extension exists in PostgreSQL, or initialize SQLite fallback tables."""
    global _use_fallback
    try:
        async with async_engine.begin() as conn:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
            logger.info("PostGIS and UUID extensions initialized successfully.")
    except Exception as e:
        logger.warning(f"PostgreSQL connection offline ({e}). Initializing SQLite in-memory fallback database.")
        _use_fallback = True
        try:
            import app.models  # noqa
            async with fallback_async_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("SQLite in-memory fallback tables created successfully.")
        except Exception as table_err:
            logger.warning(f"SQLite fallback table creation note: {table_err}")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for obtaining async database session in FastAPI endpoints with graceful fallback."""
    global _use_fallback

    # If fallback mode is active, yield SQLite fallback session
    if _use_fallback:
        async with FallbackAsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception as exc:
                await session.rollback()
                logger.error(f"Fallback database session error: {str(exc)}")
                raise
            finally:
                await session.close()
        return

    # Primary PostgreSQL session
    try:
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
    except Exception as conn_err:
        logger.warning(f"PostgreSQL session error ({conn_err}). Switching engine to SQLite in-memory fallback.")
        _use_fallback = True
        # Create tables on fallback engine if not already created
        try:
            import app.models  # noqa
            async with fallback_async_engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        except Exception:
            pass

        async with FallbackAsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception as exc:
                await session.rollback()
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
