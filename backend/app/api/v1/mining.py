"""
SandGuard Mining Sites, Illegal Events & Risk Scoring APIs
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.mining_repository import MiningSiteRepository, IllegalMiningEventRepository, RiskScoreRepository
from app.schemas.mining import MiningSiteCreate, MiningSiteResponse, IllegalMiningEventResponse, RiskScoreResponse
from app.models.mining import MiningSite

router = APIRouter(prefix="/mining", tags=["Mining Sites & Detections"])


@router.post("/sites", response_model=MiningSiteResponse, status_code=status.HTTP_201_CREATED)
async def create_mining_site(
    site_in: MiningSiteCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new candidate or authorized mining site."""
    repo = MiningSiteRepository(db)
    site = MiningSite(
        site_code=site_in.site_code,
        name=site_in.name,
        district_name=site_in.district_name,
        legal_status=site_in.legal_status,
        lease_holder=site_in.lease_holder,
        permit_number=site_in.permit_number,
        allowed_depth_meters=site_in.allowed_depth_meters
    )
    return await repo.create(site)


@router.get("/sites", response_model=List[MiningSiteResponse])
async def list_mining_sites(
    district_name: Optional[str] = None,
    unauthorized_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List monitored mining sites with optional district filtering."""
    repo = MiningSiteRepository(db)
    if unauthorized_only:
        return await repo.get_unauthorized_sites()
    if district_name:
        return await repo.get_by_district(district_name)
    return await repo.get_all(skip=0, limit=100)


@router.get("/events", response_model=List[IllegalMiningEventResponse])
async def list_illegal_mining_events(
    severity: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List detected illegal sand mining events."""
    repo = IllegalMiningEventRepository(db)
    if severity:
        return await repo.get_events_by_severity(severity)
    return await repo.get_recent_events(limit=50)


@router.get("/risk-scores", response_model=List[RiskScoreResponse])
async def get_high_risk_scores(
    threshold: float = 50.0,
    db: AsyncSession = Depends(get_db)
):
    """List risk score assessments exceeding threshold."""
    repo = RiskScoreRepository(db)
    return await repo.get_high_risk_sites(threshold=threshold)
