"""
SandGuard Alert Logs & Notification Management APIs
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.report_repository import AlertLogRepository
from app.schemas.reporting import AlertLogResponse

router = APIRouter(prefix="/alerts", tags=["Alert Logs"])


@router.get("/", response_model=List[AlertLogResponse])
async def get_active_unacknowledged_alerts(db: AsyncSession = Depends(get_db)):
    """Fetch unacknowledged active alerts."""
    alert_repo = AlertLogRepository(db)
    return await alert_repo.get_unacknowledged_alerts()


@router.post("/{alert_id}/acknowledge", response_model=AlertLogResponse)
async def acknowledge_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    """Mark an alert log entry as acknowledged by officer."""
    alert_repo = AlertLogRepository(db)
    alert = await alert_repo.get_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert record not found")
    
    updated = await alert_repo.update(alert_id, {"is_acknowledged": True})
    return updated
