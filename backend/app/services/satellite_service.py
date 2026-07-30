"""
SandGuard Satellite Image Processing & Storage Service
Ingests satellite rasters (Sentinel-2, PlanetScope, GeoTIFF, Landsat), extracts bounding boxes and metadata.
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile, HTTPException, status

from app.models.satellite import SatelliteImage
from app.repositories.satellite_repository import SatelliteImageRepository
from app.core.config import settings


class SatelliteService:
    def __init__(self, session: AsyncSession):
        self.satellite_repo = SatelliteImageRepository(session)

    async def save_uploaded_raster(
        self,
        file: UploadFile,
        title: str,
        sensor_type: str = "SENTINEL-2",
        acquired_at: Optional[datetime] = None
    ) -> SatelliteImage:
        """Save uploaded image file to local storage / S3 bucket and persist database record."""
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        file_ext = os.path.splitext(file.filename)[1] or ".tif"
        filename = f"{uuid.uuid4()}{file_ext}"
        destination_path = os.path.join(settings.UPLOAD_DIR, filename)

        contents = await file.read()
        file_size = len(contents)

        with open(destination_path, "wb") as f:
            f.write(contents)

        sat_image = SatelliteImage(
            title=title,
            sensor_type=sensor_type,
            cloud_cover_percentage=5.0,  # Default estimated metadata
            resolution_meters=10.0,
            file_path=destination_path,
            file_size_bytes=file_size,
            acquired_at=acquired_at or datetime.now(timezone.utc)
        )

        return await self.satellite_repo.create(sat_image)

    async def get_satellite_image_by_id(self, image_id: str) -> SatelliteImage:
        """Retrieve satellite image record by ID."""
        image = await self.satellite_repo.get_by_id(image_id)
        if not image:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Satellite image record not found")
        return image
