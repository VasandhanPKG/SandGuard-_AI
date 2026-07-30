"""
SandGuard API v1 Master Router Package
Mounts all domain API modules under /api/v1 prefix.
"""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.organizations import router as org_router
from app.api.v1.satellite import router as satellite_router
from app.api.v1.mining import router as mining_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.reports import router as reports_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.ai import router as ai_router
from app.api.v1.gis import router as gis_router
from app.api.v1.notifications import router as notifications_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(org_router)
api_v1_router.include_router(satellite_router)
api_v1_router.include_router(mining_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(dashboard_router)
api_v1_router.include_router(ai_router)
api_v1_router.include_router(gis_router)
api_v1_router.include_router(notifications_router)
