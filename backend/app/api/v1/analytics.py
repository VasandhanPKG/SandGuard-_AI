"""
SandGuard Analytics & Mining Hotspots API
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics & Spatial Hotspots"])


@router.get("/hotspots")
async def get_district_mining_hotspots(db: AsyncSession = Depends(get_db)):
    """Fetch high-density mining hotspot breakdown by district."""
    analytics_service = AnalyticsService(db)
    return await analytics_service.get_district_hotspots()
