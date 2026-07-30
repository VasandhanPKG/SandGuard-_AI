"""
SandGuard Mining, Detection Event, Risk Score, and Environmental Impact Database Models
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry

from app.core.database import Base


class MiningSite(Base):
    __tablename__ = "mining_sites"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    site_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    district_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    legal_status: Mapped[str] = mapped_column(String(50), nullable=False, default="UNAUTHORIZED")  # AUTHORIZED, UNAUTHORIZED, EXPIRED_PERMIT, SUSPECTED
    
    lease_holder: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    permit_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    permit_expiry: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    allowed_depth_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Point location & Boundary polygon
    location_point = mapped_column(Geometry("POINT", srid=4326), nullable=True)
    boundary_polygon = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    
    is_active_monitoring: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    illegal_events: Mapped[List["IllegalMiningEvent"]] = relationship("IllegalMiningEvent", back_populates="mining_site")
    risk_scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="mining_site")


class IllegalMiningEvent(Base):
    __tablename__ = "illegal_mining_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    mining_site_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("mining_sites.id", ondelete="SET NULL"), nullable=True)
    district_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="DETECTED")  # DETECTED, INVESTIGATING, CONFIRMED, DISMISSED, ACTION_TAKEN
    
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0.0 to 1.0
    estimated_excavation_sq_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Location point or Polygon of illegal mining activity
    geom = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    mining_site: Mapped[Optional["MiningSite"]] = relationship("MiningSite", back_populates="illegal_events")
    environmental_impact: Mapped[Optional["EnvironmentalImpact"]] = relationship("EnvironmentalImpact", back_populates="event", uselist=False)


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    mining_site_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("mining_sites.id", ondelete="CASCADE"), nullable=True)
    district_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    
    overall_risk_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0 to 100
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    
    proximity_river_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    excavation_growth_rate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    heavy_machinery_count: Mapped[int] = mapped_column(default=0)
    
    risk_factors: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    mining_site: Mapped[Optional["MiningSite"]] = relationship("MiningSite", back_populates="risk_scores")


class EnvironmentalImpact(Base):
    __tablename__ = "environmental_impacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id: Mapped[str] = mapped_column(String(36), ForeignKey("illegal_mining_events.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    riverbank_erosion_meters: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    vegetation_loss_sq_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    water_turbidity_index: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ecotox_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    impact_assessment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    event: Mapped["IllegalMiningEvent"] = relationship("IllegalMiningEvent", back_populates="environmental_impact")
