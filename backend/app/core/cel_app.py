"""
SandGuard Celery Application Instance
Configures Redis broker, result backend, task routing, and beat schedules.
"""

from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "sandguard",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.satellite_tasks",
        "app.tasks.ai_tasks",
        "app.tasks.report_tasks",
        "app.tasks.notification_tasks"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max for image processing
    worker_prefetch_multiplier=1
)

# Optional Periodic Celery Beat Schedule
celery_app.conf.beat_schedule = {
    "daily-mining-risk-assessment": {
        "task": "app.tasks.ai_tasks.run_periodic_risk_assessment_task",
        "schedule": 86400.0,  # Daily
    },
    "weekly-district-report-generation": {
        "task": "app.tasks.report_tasks.generate_weekly_district_reports_task",
        "schedule": 604800.0,  # Weekly
    }
}
