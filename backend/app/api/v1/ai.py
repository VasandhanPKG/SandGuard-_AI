"""
SandGuard AI Inference & Model Backend Endpoints
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.prediction_service import PredictionService
from app.services.ai.ai_registry import ai_registry

router = APIRouter(prefix="/ai", tags=["AI & Machine Learning Engine"])


@router.post("/detect", status_code=status.HTTP_200_OK)
async def trigger_mining_detection(
    satellite_image_id: str,
    detection_model: str = "yolo",
    segmentation_model: str = "segformer",
    district_name: str = "Central District",
    db: AsyncSession = Depends(get_db)
):
    """Trigger automated AI detection and segmentation pipeline on a satellite image."""
    prediction_service = PredictionService(db)
    return await prediction_service.run_detection_pipeline(
        satellite_image_id=satellite_image_id,
        detection_model=detection_model,
        segmentation_model=segmentation_model,
        district_name=district_name
    )


@router.get("/models")
async def list_available_ai_models():
    """List all available model engines in the registry."""
    engines = []
    for key in ["yolo", "segformer", "sam2"]:
        try:
            eng = ai_registry.get_engine(key)
            engines.append({
                "key": key,
                "name": eng.model_name,
                "version": eng.version
            })
        except ValueError:
            pass
    return {"registered_engines": engines}
