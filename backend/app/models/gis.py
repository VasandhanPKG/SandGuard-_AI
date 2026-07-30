"""
SandGuard GIS and Spatial Database Models
Using GeoAlchemy2 spatial geometry types (POLYGON, LINESTRING, MULTIPOLYGON) with SRID 4326.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from geoalchemy2 import Geometry

from app.core.database import Base


class District(Base):
    __tablename__ = "districts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    area_sq_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # GeoAlchemy2 Geometry Column (Polygon, WGS84 EPSG:4326)
    geom = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    
    meta_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class WaterBody(Base):
    __tablename__ = "water_bodies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    body_type: Mapped[str] = mapped_column(String(50), nullable=False)  # RIVER, LAKE, RESERVOIR, ESTUARY
    district_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    
    # Polygon or MultiPolygon geometry
    geom = mapped_column(Geometry("MULTIPOLYGON", srid=4326), nullable=True)
    
    protection_buffer_meters: Mapped[float] = mapped_column(Float, default=500.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class RiverSegment(Base):
    __tablename__ = "river_segments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    river_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    segment_code: Mapped[str] = mapped_column(String(50), nullable=False)
    length_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    vulnerability_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0 to 100
    
    # LineString spatial geometry
    geom = mapped_column(Geometry("LINESTRING", srid=4326), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AdministrativeBoundary(Base):
    __tablename__ = "administrative_boundaries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    boundary_name: Mapped[str] = mapped_column(String(150), nullable=False)
    admin_level: Mapped[int] = mapped_column(default=1)  # 1: State, 2: District, 3: Sub-district/Taluk
    parent_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    
    geom = mapped_column(Geometry("MULTIPOLYGON", srid=4326), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
