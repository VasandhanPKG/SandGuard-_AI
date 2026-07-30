"""
SandGuard Mining Site & Illegal Mining Detection Repository Implementation
"""

from typing import Sequence, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.mining import MiningSite, IllegalMiningEvent, RiskScore, EnvironmentalImpact
from app.repositories.base import BaseRepository


class MiningSiteRepository(BaseRepository[MiningSite]):
    def __init__(self, session: AsyncSession):
        super().__init__(MiningSite, session)

    async def get_by_district(self, district_name: str) -> Sequence[MiningSite]:
        """Fetch all mining sites in a district."""
        query = select(MiningSite).where(MiningSite.district_name == district_name)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_unauthorized_sites(self) -> Sequence[MiningSite]:
        """Fetch unauthorized or expired permit mining sites."""
        query = select(MiningSite).where(MiningSite.legal_status.in_(["UNAUTHORIZED", "EXPIRED_PERMIT", "SUSPECTED"]))
        result = await self.session.execute(query)
        return result.scalars().all()


class IllegalMiningEventRepository(BaseRepository[IllegalMiningEvent]):
    def __init__(self, session: AsyncSession):
        super().__init__(IllegalMiningEvent, session)

    async def get_recent_events(self, limit: int = 50) -> Sequence[IllegalMiningEvent]:
        """Fetch recent detected illegal mining events ordered by date."""
        query = select(IllegalMiningEvent).order_by(desc(IllegalMiningEvent.detected_at)).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_events_by_severity(self, severity: str) -> Sequence[IllegalMiningEvent]:
        """Fetch events by severity level (CRITICAL, HIGH, MEDIUM, LOW)."""
        query = select(IllegalMiningEvent).where(IllegalMiningEvent.severity == severity)
        result = await self.session.execute(query)
        return result.scalars().all()


class RiskScoreRepository(BaseRepository[RiskScore]):
    def __init__(self, session: AsyncSession):
        super().__init__(RiskScore, session)

    async def get_high_risk_sites(self, threshold: float = 70.0) -> Sequence[RiskScore]:
        """Fetch risk scores exceeding threshold."""
        query = select(RiskScore).where(RiskScore.overall_risk_score >= threshold).order_by(desc(RiskScore.overall_risk_score))
        result = await self.session.execute(query)
        return result.scalars().all()
