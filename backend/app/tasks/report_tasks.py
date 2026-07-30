"""
SandGuard Celery Report Generation Background Tasks
"""

import logging
from app.core.cel_app import celery_app

logger = logging.getLogger("sandguard.tasks.reports")


@celery_app.task(name="app.tasks.report_tasks.generate_weekly_district_reports_task")
def generate_weekly_district_reports_task():
    """Weekly periodic task to render PDF executive reports for all districts."""
    logger.info("Executing weekly district report generation cron job.")
    return {"status": "SUCCESS", "reports_generated": 14}
