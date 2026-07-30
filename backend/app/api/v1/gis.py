"""
SandGuard Interactive GIS & Spatial Analysis API Endpoints
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.gis_service import GISService
from app.schemas.gis import GeoJSONFeature

router = APIRouter(prefix="/gis", tags=["GIS & Spatial Analysis"])


@router.post("/parse-geojson")
async def parse_geojson_payload(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db)
):
    """Validate and compute spatial metrics for input GeoJSON feature."""
    gis_service = GISService(db)
    parsed = gis_service.parse_geojson(payload)
    area_sq_m = 0.0
    if parsed.get("type") in ["Polygon", "Feature"]:
        geom = parsed.get("geometry", parsed)
        area_sq_m = gis_service.calculate_polygon_area_sq_m(geom)

    return {
        "status": "VALID",
        "type": parsed.get("type"),
        "calculated_area_sq_m": area_sq_m,
        "calculated_area_hectares": round(area_sq_m / 10000.0, 2)
    }


@router.post("/river-buffer")
async def generate_river_buffer(
    linestring_geojson: Dict[str, Any],
    buffer_meters: float = 500.0,
    db: AsyncSession = Depends(get_db)
):
    """Generate protection zone polygon buffer around river segment."""
    gis_service = GISService(db)
    buffered_polygon = gis_service.create_river_buffer_geojson(linestring_geojson, buffer_meters)
    return {
        "buffer_meters": buffer_meters,
        "buffered_geojson": buffered_polygon
    }
