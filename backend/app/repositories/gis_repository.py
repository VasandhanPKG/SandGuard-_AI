"""
SandGuard PostGIS Spatial Repository Implementation
Provides spatial operations: ST_Intersects, ST_MakeEnvelope, ST_Buffer, ST_Distance, and Nearest Neighbor queries.
"""

from typing import Sequence, Optional
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.functions import ST_GeomFromGeoJSON, ST_AsGeoJSON, ST_Buffer, ST_Distance, ST_Intersects, ST_MakeEnvelope, ST_DWithin

from app.models.gis import District, WaterBody, RiverSegment, AdministrativeBoundary
from app.repositories.base import BaseRepository


class GISRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_district_by_name(self, name: str) -> Optional[District]:
        """Fetch district entity by name."""
        query = select(District).where(District.name == name)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def find_rivers_near_point(self, lon: float, lat: float, distance_meters: float = 1000.0) -> Sequence[RiverSegment]:
        """Find river segments within N meters of a given coordinate using ST_DWithin / ST_Distance."""
        point_wkt = f"SRID=4326;POINT({lon} {lat})"
        query = (
            select(RiverSegment)
            .where(func.ST_DWithin(RiverSegment.geom, func.ST_GeomFromText(point_wkt, 4326), distance_meters / 111320.0))
            .order_by(func.ST_Distance(RiverSegment.geom, func.ST_GeomFromText(point_wkt, 4326)))
        )
        result = await self.session.execute(query)
        return result.scalars().all()

    async def find_districts_in_bbox(self, min_lon: float, min_lat: float, max_lon: float, max_lat: float) -> Sequence[District]:
        """Find all districts intersecting a bounding box envelope."""
        envelope = func.ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)
        query = select(District).where(func.ST_Intersects(District.geom, envelope))
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_buffered_water_bodies(self, buffer_meters: float = 500.0) -> Sequence[dict]:
        """Generate buffered polygons around water bodies for environmental protection zones."""
        buffer_deg = buffer_meters / 111320.0
        query = select(
            WaterBody.id,
            WaterBody.name,
            WaterBody.body_type,
            func.ST_AsGeoJSON(func.ST_Buffer(WaterBody.geom, buffer_deg)).label("buffered_geojson")
        )
        result = await self.session.execute(query)
        return [dict(r._mapping) for r in result.all()]
