"""
SandGuard Multi-Channel Notification APIs
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/dispatch", status_code=status.HTTP_200_OK)
async def dispatch_notification(
    title: str,
    district_name: str,
    message: str,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    webhook_url: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Trigger manual or event-driven alert dispatch across Email, SMS, and Webhooks."""
    notif_service = NotificationService(db)
    alert = await notif_service.dispatch_critical_alert(
        title=title,
        district_name=district_name,
        message=message,
        recipient_email=email,
        recipient_phone=phone,
        webhook_url=webhook_url
    )
    return {
        "status": "DISPATCHED",
        "alert_id": alert.id,
        "district": district_name
    }
