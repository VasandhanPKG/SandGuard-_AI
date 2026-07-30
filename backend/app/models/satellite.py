"""
SandGuard Satellite Imagery, Machine Learning Detections, Segmentation Masks, and Prediction History Database Models
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Float, DateTime, ForeignKey, Text, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry

from app.core.database import Base


class SatelliteImage(Base):
    __tablename__ = "satellite_images"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    sensor_type: Mapped[str] = mapped_column(String(50), nullable=False, default="SENTINEL-2")  # SENTINEL-2, PLANET, LANDSAT, DRONE
    cloud_cover_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    resolution_meters: Mapped[float] = mapped_column(Float, default=10.0)
    
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    
    # Bounding Box Polygon geometry
    bbox_geom = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    
    acquired_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    predictions: Mapped[List["ImagePrediction"]] = relationship("ImagePrediction", back_populates="satellite_image", cascade="all, delete-orphan")


class ImagePrediction(Base):
    __tablename__ = "image_predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    satellite_image_id: Mapped[str] = mapped_column(String(36), ForeignKey("satellite_images.id", ondelete="CASCADE"), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)  # YOLOv11, SegFormer, SAM2, DeepLabV3+
    model_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1.0")
    
    detection_type: Mapped[str] = mapped_column(String(50), nullable=False, default="SAND_EXCAVATION")  # SAND_EXCAVATION, HEAVY_MACHINERY, DREDGER, TRUCK
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 to 1.0
    
    bbox_coordinates: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    raw_prediction_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    predicted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    satellite_image: Mapped["SatelliteImage"] = relationship("SatelliteImage", back_populates="predictions")
    masks: Mapped[List["SegmentationMask"]] = relationship("SegmentationMask", back_populates="prediction", cascade="all, delete-orphan")


class SegmentationMask(Base):
    __tablename__ = "segmentation_masks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    prediction_id: Mapped[str] = mapped_column(String(36), ForeignKey("image_predictions.id", ondelete="CASCADE"), nullable=False)
    
    mask_area_sq_m: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    
    # Polygon or MultiPolygon GeoJSON geometry of extracted sand pit outline
    geom = mapped_column(Geometry("POLYGON", srid=4326), nullable=True)
    
    mask_overlay_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    prediction: Mapped["ImagePrediction"] = relationship("ImagePrediction", back_populates="masks")


class PredictionHistory(Base):
    __tablename__ = "prediction_histories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    image_id: Mapped[str] = mapped_column(String(36), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(30), default="SUCCESS")  # SUCCESS, FAILED
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
