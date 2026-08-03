"""
SandGuard User, Authentication, and Organization Business Logic Service
"""

from datetime import datetime, timezone
from typing import Optional, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User, Organization
from app.repositories.user_repository import UserRepository, OrganizationRepository
from app.schemas.user import UserCreate, UserUpdate, OrganizationCreate, Token
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, UserRole


class UserService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)
        self.org_repo = OrganizationRepository(session)

    async def authenticate_user(self, email: str, password: str) -> User:
        """Authenticate user by email and password credentials."""
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User account is deactivated"
            )
        
        # Update last login timestamp
        await self.user_repo.update(user.id, {"last_login": datetime.now(timezone.utc)})
        return user

    async def create_tokens_for_user(self, user: User) -> Token:
        """Generate JWT access and refresh token pair."""
        role_str = user.role.value if isinstance(user.role, UserRole) else str(user.role)
        access_token = create_access_token(subject=user.id, role=role_str, org_id=user.organization_id)
        refresh_token = create_refresh_token(subject=user.id, role=role_str)
        return Token(access_token=access_token, refresh_token=refresh_token)

    async def register_user(self, user_in: UserCreate) -> User:
        """Register a new user in the system."""
        existing_user = await self.user_repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        hashed_pw = get_password_hash(user_in.password)
        new_user = User(
            email=user_in.email,
            hashed_password=hashed_pw,
            full_name=user_in.full_name,
            role=user_in.role,
            district_name=user_in.district_name,
            phone_number=user_in.phone_number,
            organization_id=user_in.organization_id
        )
        return await self.user_repo.create(new_user)

    async def get_user_by_id(self, user_id: str) -> User:
        """Fetch user by ID or raise 404."""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def create_organization(self, org_in: OrganizationCreate) -> Organization:
        """Create a new government or enterprise organization."""
        existing_org = await self.org_repo.get_by_code(org_in.code)
        if existing_org:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organization code already registered")
        
        org = Organization(
            name=org_in.name,
            code=org_in.code,
            org_type=org_in.org_type,
            description=org_in.description
        )
        return await self.org_repo.create(org)

    async def list_organizations(self) -> Sequence[Organization]:
        """List all registered organizations."""
        return await self.org_repo.get_all(skip=0, limit=100)
