"""
SandGuard Automated Detection & Prediction Service
Coordinates the end-to-end inference, spatial overlay, risk scoring, and event creation workflow.
"""

from datetime import datetime, timezone
import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.satellite_service import SatelliteService
from app.services.ai.ai_registry import ai_registry
from app.services.ai.risk_engine import RiskPredictionEngine
from app.services.gis_service import GISService
from app.repositories.satellite_repository import ImagePredictionRepository
from app.repositories.mining_repository import IllegalMiningEventRepository, RiskScoreRepository
from app.models.satellite import ImagePrediction
from app.models.mining import IllegalMiningEvent, RiskScore


class PredictionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.satellite_service = SatelliteService(session)
        self.gis_service = GISService(session)
        self.prediction_repo = ImagePredictionRepository(session)
        self.event_repo = IllegalMiningEventRepository(session)
        self.risk_repo = RiskScoreRepository(session)
        self.risk_engine = RiskPredictionEngine()

    async def run_detection_pipeline(
        self,
        satellite_image_id: str,
        detection_model: str = "yolo",
        segmentation_model: str = "segformer",
        district_name: str = "Central District"
    ) -> Dict[str, Any]:
        """Execute full automated AI pipeline on a satellite image."""
        # 1. Fetch satellite image metadata
        sat_image = await self.satellite_service.get_satellite_image_by_id(satellite_image_id)

        # 2. Run object detection engine
        detector = ai_registry.get_engine(detection_model)
        detection_res = await detector.predict(sat_image.file_path)

        # 3. Run segmentation engine
        segmenter = ai_registry.get_engine(segmentation_model)
        segmentation_res = await segmenter.predict(sat_image.file_path)

        # 4. Save prediction record to DB
        prediction = ImagePrediction(
            satellite_image_id=satellite_image_id,
            model_name=f"{detector.model_name}+{segmenter.model_name}",
            model_version=f"{detector.version}",
            detection_type="SAND_EXCAVATION",
            confidence_score=segmentation_res.get("confidence_score", 0.90),
            raw_prediction_json={"detections": detection_res, "segmentation": segmentation_res}
        )
        saved_prediction = await self.prediction_repo.create(prediction)

        # 5. Compute Risk Score
        machinery_count = detection_res.get("detections_count", 1)
        excavated_area = segmentation_res.get("segmented_area_sq_m", 10000.0)

        risk_analysis = self.risk_engine.calculate_risk_score(
            proximity_to_river_meters=250.0,  # Spatial distance
            heavy_machinery_count=machinery_count,
            is_legal_permit=False,  # Unauthorized site flag
            excavation_area_sq_m=excavated_area
        )

        # 6. Save Risk Score Record
        risk_record = RiskScore(
            district_name=district_name,
            overall_risk_score=risk_analysis["overall_risk_score"],
            risk_level=risk_analysis["risk_level"],
            proximity_river_meters=250.0,
            heavy_machinery_count=machinery_count,
            risk_factors=risk_analysis["factors"]
        )
        await self.risk_repo.create(risk_record)

        # 7. Create Illegal Mining Event if Risk is High or Critical
        event_record = None
        if risk_analysis["overall_risk_score"] >= 50.0:
            event_code = f"IME-{uuid.uuid4().hex[:8].upper()}"
            event_record = IllegalMiningEvent(
                event_code=event_code,
                district_name=district_name,
                severity=risk_analysis["risk_level"],
                status="DETECTED",
                confidence_score=segmentation_res.get("confidence_score", 0.90),
                estimated_excavation_sq_m=excavated_area,
                description=f"AI-detected illegal sand excavation pit ({excavated_area:.1f} sq.m) with {machinery_count} heavy machinery units."
            )
            await self.event_repo.create(event_record)

        return {
            "prediction_id": saved_prediction.id,
            "satellite_image_id": satellite_image_id,
            "detections": detection_res,
            "segmentation": segmentation_res,
            "risk_assessment": risk_analysis,
            "event_created": event_record.event_code if event_record else None
        }
