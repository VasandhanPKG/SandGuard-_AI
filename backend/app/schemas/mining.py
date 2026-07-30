"""
SandGuard Pydantic v2 Mining Site, Event, and Risk Schemas
"""

from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class MiningSiteCreate(BaseModel):
    site_code: str
    name: str
    district_name: str
    legal_status: str = "UNAUTHORIZED"
    lease_holder: Optional[str] = None
    permit_number: Optional[str] = None
    allowed_depth_meters: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    geojson_boundary: Optional[Dict[str, Any]] = None


class MiningSiteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    site_code: str
    name: str
    district_name: str
    legal_status: str
    lease_holder: Optional[str] = None
    permit_number: Optional[str] = None
    is_active_monitoring: bool
    created_at: datetime


class IllegalMiningEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    event_code: str
    district_name: str
    severity: str
    status: str
    confidence_score: float
    estimated_excavation_sq_m: Optional[float] = None
    detected_at: datetime
    description: Optional[str] = None


class RiskScoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    district_name: str
    overall_risk_score: float
    risk_level: str
    proximity_river_meters: Optional[float] = None
    heavy_machinery_count: int
    calculated_at: datetime
