"""
Pytest Test Suite Configuration and Shared Fixtures for SandGuard
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token, UserRole
from app.models.user import User
from app.core.security import get_password_hash

# SQLite In-Memory Engine for Fast Async Testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="session")
async def async_test_engine():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(async_test_engine):
    session_factory = async_sessionmaker(async_test_engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def async_client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_auth_headers(db_session):
    admin_user = User(
        email="admin@sandguard.gov",
        hashed_password=get_password_hash("admin_password_123"),
        full_name="Admin Officer",
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(admin_user)
    await db_session.commit()
    await db_session.refresh(admin_user)

    token = create_access_token(subject=admin_user.id, role="ADMIN")
    return {"Authorization": f"Bearer {token}"}
