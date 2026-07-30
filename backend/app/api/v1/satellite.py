"""
SandGuard Satellite Imagery Ingestion API Endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.satellite_service import SatelliteService
from app.schemas.satellite import SatelliteImageResponse
from app.repositories.satellite_repository import SatelliteImageRepository

router = APIRouter(prefix="/satellite", tags=["Satellite Imagery"])


@router.post("/upload", response_model=SatelliteImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_satellite_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    sensor_type: str = Form("SENTINEL-2"),
    db: AsyncSession = Depends(get_db)
):
    """Upload satellite raster file (GeoTIFF / PNG / JPEG) for ingestion and analysis."""
    satellite_service = SatelliteService(db)
    return await satellite_service.save_uploaded_raster(
        file=file,
        title=title,
        sensor_type=sensor_type
    )


@router.get("/", response_model=List[SatelliteImageResponse])
async def list_satellite_images(
    sensor_type: Optional[str] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """List ingested satellite imagery records."""
    sat_repo = SatelliteImageRepository(db)
    return await sat_repo.get_latest_images(sensor_type=sensor_type, limit=limit)


@router.get("/{image_id}", response_model=SatelliteImageResponse)
async def get_satellite_image(image_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch details of a single satellite image."""
    sat_service = SatelliteService(db)
    return await sat_service.get_satellite_image_by_id(image_id)
