"""
SandGuard Models Package Exposing All Declarative Entities
"""

from app.models.user import User, Organization, APIKey
from app.models.gis import District, WaterBody, RiverSegment, AdministrativeBoundary
from app.models.mining import MiningSite, IllegalMiningEvent, RiskScore, EnvironmentalImpact
from app.models.satellite import SatelliteImage, ImagePrediction, SegmentationMask, PredictionHistory
from app.models.reporting import Report, AlertLog, Notification, ActivityLog, AuditLog
from app.models.system import ModelVersion, AIConfiguration, SystemSetting

__all__ = [
    "User",
    "Organization",
    "APIKey",
    "District",
    "WaterBody",
    "RiverSegment",
    "AdministrativeBoundary",
    "MiningSite",
    "IllegalMiningEvent",
    "RiskScore",
    "EnvironmentalImpact",
    "SatelliteImage",
    "ImagePrediction",
    "SegmentationMask",
    "PredictionHistory",
    "Report",
    "AlertLog",
    "Notification",
    "ActivityLog",
    "AuditLog",
    "ModelVersion",
    "AIConfiguration",
    "SystemSetting"
]
