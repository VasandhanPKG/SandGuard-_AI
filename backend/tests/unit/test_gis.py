"""
Unit Tests for GIS Service & Spatial Operations
"""

import pytest
from app.services.gis_service import GISService


@pytest.mark.asyncio
async def test_polygon_area_calculation(db_session):
    gis_service = GISService(db_session)
    polygon = {
        "type": "Polygon",
        "coordinates": [[
            [77.5910, 12.9710],
            [77.5920, 12.9710],
            [77.5920, 12.9720],
            [77.5910, 12.9720],
            [77.5910, 12.9710]
        ]]
    }
    area_sq_m = gis_service.calculate_polygon_area_sq_m(polygon)
    assert area_sq_m > 0.0


@pytest.mark.asyncio
async def test_river_buffer_creation(db_session):
    gis_service = GISService(db_session)
    linestring = {
        "type": "LineString",
        "coordinates": [
            [77.5910, 12.9710],
            [77.5950, 12.9750]
        ]
    }
    buffer_result = gis_service.create_river_buffer_geojson(linestring, buffer_meters=500.0)
    assert buffer_result["type"] == "Polygon"
