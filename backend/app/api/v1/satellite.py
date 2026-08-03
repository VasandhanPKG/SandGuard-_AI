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


@router.post("/search-external")
async def search_external_satellite_imagery(
    min_lon: float = Form(77.50),
    min_lat: float = Form(12.90),
    max_lon: float = Form(77.65),
    max_lat: float = Form(13.05),
    start_date: str = Form("2026-07-01"),
    end_date: str = Form("2026-07-31"),
    max_cloud_cover: float = Form(20.0),
    providers: Optional[List[str]] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    """Search external satellite providers (Sentinel Hub, Planet Labs) by bounding box."""
    from app.services.external_satellite_service import ExternalSatelliteService
    service = ExternalSatelliteService(db)
    bbox = [min_lon, min_lat, max_lon, max_lat]
    return await service.search_satellite_data(
        bbox=bbox,
        start_date=start_date,
        end_date=end_date,
        providers=providers,
        max_cloud_cover=max_cloud_cover
    )


@router.post("/ingest-external", response_model=SatelliteImageResponse, status_code=status.HTTP_201_CREATED)
async def ingest_external_satellite_scene(
    scene_id: str = Form(...),
    provider: str = Form("SENTINEL_HUB"),
    title: str = Form("Sentinel-2 Scene"),
    sensor_type: str = Form("SENTINEL-2"),
    cloud_cover: float = Form(5.0),
    resolution_meters: float = Form(10.0),
    acquired_at: str = Form("2026-07-31T05:30:00Z"),
    db: AsyncSession = Depends(get_db)
):
    """Ingest scene metadata from Sentinel Hub or Planet Labs for AI processing."""
    from app.services.external_satellite_service import ExternalSatelliteService
    service = ExternalSatelliteService(db)
    return await service.ingest_external_scene(
        scene_id=scene_id,
        provider=provider,
        title=title,
        sensor_type=sensor_type,
        cloud_cover=cloud_cover,
        resolution_meters=resolution_meters,
        acquired_at_str=acquired_at
    )

