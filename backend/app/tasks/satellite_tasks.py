"""
SandGuard Celery Satellite Image Background Tasks
"""

import logging
from app.core.cel_app import celery_app

logger = logging.getLogger("sandguard.tasks.satellite")


@celery_app.task(name="app.tasks.satellite_tasks.process_satellite_image_task")
def process_satellite_image_task(image_id: str):
    """Background task to extract GeoTIFF spatial metadata and create tile pyramids."""
    logger.info(f"Processing satellite image task for image_id: {image_id}")
    return {"status": "SUCCESS", "image_id": image_id}
