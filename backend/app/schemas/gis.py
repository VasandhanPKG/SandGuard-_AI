"""
SandGuard Pydantic v2 GIS and Spatial Feature Schemas
"""

from datetime import datetime
from typing import Optional, Any, Dict, List
from pydantic import BaseModel, ConfigDict


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = {}


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]


class DistrictCreate(BaseModel):
    name: str
    state: str
    code: str
    area_sq_km: Optional[float] = None
    geojson_geometry: Optional[Dict[str, Any]] = None


class DistrictResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    state: str
    code: str
    area_sq_km: Optional[float] = None
    created_at: datetime


class WaterBodyCreate(BaseModel):
    name: str
    body_type: str
    district_name: Optional[str] = None
    protection_buffer_meters: float = 500.0
    geojson_geometry: Optional[Dict[str, Any]] = None


class RiverSegmentCreate(BaseModel):
    river_name: str
    segment_code: str
    length_km: Optional[float] = None
    vulnerability_score: float = 0.0
    geojson_geometry: Optional[Dict[str, Any]] = None
