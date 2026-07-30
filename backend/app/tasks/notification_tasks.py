"""
SandGuard Celery Notification Background Tasks
"""

import logging
from app.core.cel_app import celery_app

logger = logging.getLogger("sandguard.tasks.notifications")


@celery_app.task(name="app.tasks.notification_tasks.dispatch_alert_notifications_task")
def dispatch_alert_notifications_task(alert_id: str, channel: str, recipient: str):
    """Async task for sending Email, SMS, or Webhooks."""
    logger.info(f"Dispatching notification: Alert={alert_id}, Channel={channel}, Recipient={recipient}")
    return {"status": "SUCCESS", "alert_id": alert_id}
