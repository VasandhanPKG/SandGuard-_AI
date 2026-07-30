"""
SandGuard Government Dashboard Summary APIs
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/dashboard", tags=["Government Dashboard"])


@router.get("/summary")
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    """Fetch aggregated summary KPI metrics for executive government dashboards."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_executive_dashboard_summary()
