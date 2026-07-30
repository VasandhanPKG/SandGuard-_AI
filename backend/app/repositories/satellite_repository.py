"""
SandGuard Satellite Image & AI Prediction Repository Implementation
"""

from typing import Sequence, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.satellite import SatelliteImage, ImagePrediction, SegmentationMask
from app.repositories.base import BaseRepository


class SatelliteImageRepository(BaseRepository[SatelliteImage]):
    def __init__(self, session: AsyncSession):
        super().__init__(SatelliteImage, session)

    async def get_latest_images(self, sensor_type: Optional[str] = None, limit: int = 20) -> Sequence[SatelliteImage]:
        """Fetch latest ingested satellite images."""
        query = select(SatelliteImage)
        if sensor_type:
            query = query.where(SatelliteImage.sensor_type == sensor_type)
        query = query.order_by(desc(SatelliteImage.acquired_at)).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()


class ImagePredictionRepository(BaseRepository[ImagePrediction]):
    def __init__(self, session: AsyncSession):
        super().__init__(ImagePrediction, session)

    async def get_by_image_id(self, satellite_image_id: str) -> Sequence[ImagePrediction]:
        """Fetch predictions for a specific image."""
        query = select(ImagePrediction).where(ImagePrediction.satellite_image_id == satellite_image_id)
        result = await self.session.execute(query)
        return result.scalars().all()
