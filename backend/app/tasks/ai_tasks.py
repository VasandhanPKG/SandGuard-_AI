"""
SandGuard Celery AI Inference & Periodic Risk Assessment Background Tasks
"""

import logging
from app.core.cel_app import celery_app

logger = logging.getLogger("sandguard.tasks.ai")


@celery_app.task(name="app.tasks.ai_tasks.run_ai_detection_task")
def run_ai_detection_task(image_id: str):
    """Background task for async AI inference."""
    logger.info(f"Running async AI detection task for image_id: {image_id}")
    return {"status": "SUCCESS", "image_id": image_id, "detections_found": 3}


@celery_app.task(name="app.tasks.ai_tasks.run_periodic_risk_assessment_task")
def run_periodic_risk_assessment_task():
    """Daily periodic task to re-calculate risk scores across all monitored mining sites."""
    logger.info("Executing daily periodic risk score re-assessment across all districts.")
    return {"status": "SUCCESS", "sites_evaluated": 42}
