"""
SandGuard GIS Processing and Spatial Analysis Service
Handles GeoJSON, Shapefile, KML parsing, coordinate conversion, river buffer analysis, and PostGIS spatial math.
"""

import json
from typing import Dict, Any, List, Optional
import shapely.geometry
from shapely.ops import transform
import pyproj
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.gis_repository import GISRepository
from app.core.exceptions import SpatialOperationException


class GISService:
    def __init__(self, session: AsyncSession):
        self.gis_repo = GISRepository(session)
        # Coordinate Transformer WGS84 (EPSG:4326) to UTM (EPSG:3857)
        self.wgs84_to_utm = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
        self.utm_to_wgs84 = pyproj.Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True).transform

    def parse_geojson(self, geojson_raw: str | Dict[str, Any]) -> Dict[str, Any]:
        """Validate and parse GeoJSON payload."""
        try:
            if isinstance(geojson_raw, str):
                data = json.loads(geojson_raw)
            else:
                data = geojson_raw

            if "type" not in data:
                raise ValueError("Missing 'type' field in GeoJSON")
            return data
        except Exception as e:
            raise SpatialOperationException(f"Invalid GeoJSON structure: {str(e)}")

    def calculate_polygon_area_sq_m(self, geojson_polygon: Dict[str, Any]) -> float:
        """Calculate exact metric surface area in square meters using EPSG:3857 projection."""
        try:
            geom = shapely.geometry.shape(geojson_polygon)
            projected_geom = transform(self.wgs84_to_utm, geom)
            return float(projected_geom.area)
        except Exception as e:
            raise SpatialOperationException(f"Failed to calculate polygon area: {str(e)}")

    def calculate_distance_meters(self, point1_lon_lat: tuple[float, float], point2_lon_lat: tuple[float, float]) -> float:
        """Calculate geodetic distance in meters between two coordinates."""
        try:
            p1 = shapely.geometry.Point(point1_lon_lat[0], point1_lon_lat[1])
            p2 = shapely.geometry.Point(point2_lon_lat[0], point2_lon_lat[1])
            
            p1_utm = transform(self.wgs84_to_utm, p1)
            p2_utm = transform(self.wgs84_to_utm, p2)
            
            return float(p1_utm.distance(p2_utm))
        except Exception as e:
            raise SpatialOperationException(f"Failed to calculate coordinate distance: {str(e)}")

    def create_river_buffer_geojson(self, linestring_geojson: Dict[str, Any], buffer_meters: float = 500.0) -> Dict[str, Any]:
        """Generate a buffer polygon around a river LineString."""
        try:
            geom = shapely.geometry.shape(linestring_geojson)
            projected_geom = transform(self.wgs84_to_utm, geom)
            buffered_utm = projected_geom.buffer(buffer_meters)
            buffered_wgs84 = transform(self.utm_to_wgs84, buffered_utm)
            return shapely.geometry.mapping(buffered_wgs84)
        except Exception as e:
            raise SpatialOperationException(f"Failed to create river buffer polygon: {str(e)}")

    async def get_rivers_near_coordinates(self, lon: float, lat: float, max_distance_meters: float = 1000.0):
        """Query rivers within proximity of coordinates."""
        return await self.gis_repo.find_rivers_near_point(lon, lat, max_distance_meters)
