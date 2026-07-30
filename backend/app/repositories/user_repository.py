"""
SandGuard User and Organization Repository Implementation
"""

from typing import Optional, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Organization
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Find user by email address."""
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_district(self, district_name: str) -> Sequence[User]:
        """Get officers assigned to a specific district."""
        query = select(User).where(User.district_name == district_name)
        result = await self.session.execute(query)
        return result.scalars().all()


class OrganizationRepository(BaseRepository[Organization]):
    def __init__(self, session: AsyncSession):
        super().__init__(Organization, session)

    async def get_by_code(self, code: str) -> Optional[Organization]:
        """Find organization by unique code."""
        query = select(Organization).where(Organization.code == code)
        result = await self.session.execute(query)
        return result.scalars().first()
