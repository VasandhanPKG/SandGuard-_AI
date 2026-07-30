"""
SandGuard Schemas Package
"""

from app.schemas.user import Token, TokenData, UserCreate, UserUpdate, UserResponse, OrganizationCreate, OrganizationResponse
from app.schemas.gis import GeoJSONFeature, GeoJSONFeatureCollection, DistrictCreate, DistrictResponse, WaterBodyCreate, RiverSegmentCreate
from app.schemas.mining import MiningSiteCreate, MiningSiteResponse, IllegalMiningEventResponse, RiskScoreResponse
from app.schemas.satellite import SatelliteImageCreate, SatelliteImageResponse, ImagePredictionResponse
from app.schemas.reporting import ReportCreate, ReportResponse, AlertLogResponse

__all__ = [
    "Token",
    "TokenData",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "OrganizationCreate",
    "OrganizationResponse",
    "GeoJSONFeature",
    "GeoJSONFeatureCollection",
    "DistrictCreate",
    "DistrictResponse",
    "WaterBodyCreate",
    "RiverSegmentCreate",
    "MiningSiteCreate",
    "MiningSiteResponse",
    "IllegalMiningEventResponse",
    "RiskScoreResponse",
    "SatelliteImageCreate",
    "SatelliteImageResponse",
    "ImagePredictionResponse",
    "ReportCreate",
    "ReportResponse",
    "AlertLogResponse"
]
