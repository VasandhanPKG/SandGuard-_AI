"""
SandGuard Pydantic v2 Satellite Image and ML Prediction Schemas
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class SatelliteImageCreate(BaseModel):
    title: str
    sensor_type: str = "SENTINEL-2"
    cloud_cover_percentage: float = 0.0
    resolution_meters: float = 10.0
    acquired_at: datetime


class SatelliteImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    sensor_type: str
    cloud_cover_percentage: float
    resolution_meters: float
    file_path: str
    acquired_at: datetime
    created_at: datetime


class ImagePredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    satellite_image_id: str
    model_name: str
    model_version: str
    detection_type: str
    confidence_score: float
    predicted_at: datetime
