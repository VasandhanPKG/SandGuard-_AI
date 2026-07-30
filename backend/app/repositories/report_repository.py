"""
SandGuard Report and Alert Repository Implementation
"""

from typing import Sequence, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.reporting import Report, AlertLog, Notification
from app.repositories.base import BaseRepository


class ReportRepository(BaseRepository[Report]):
    def __init__(self, session: AsyncSession):
        super().__init__(Report, session)

    async def get_by_district(self, district_name: str) -> Sequence[Report]:
        """Fetch reports generated for a district."""
        query = select(Report).where(Report.district_name == district_name).order_by(desc(Report.created_at))
        result = await self.session.execute(query)
        return result.scalars().all()


class AlertLogRepository(BaseRepository[AlertLog]):
    def __init__(self, session: AsyncSession):
        super().__init__(AlertLog, session)

    async def get_unacknowledged_alerts(self) -> Sequence[AlertLog]:
        """Fetch active unacknowledged security/mining alerts."""
        query = select(AlertLog).where(AlertLog.is_acknowledged == False).order_by(desc(AlertLog.created_at))
        result = await self.session.execute(query)
        return result.scalars().all()
