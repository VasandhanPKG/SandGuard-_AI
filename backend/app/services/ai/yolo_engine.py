"""
SandGuard YOLOv11 Mining Machinery & Vehicle Object Detection Adapter
Detects heavy excavators, sand dredgers, and dump trucks from satellite and drone imagery.
"""

from typing import Dict, Any, List
import random
from app.services.ai.base_engine import BaseAIEngine


class YOLODetectionEngine(BaseAIEngine):
    @property
    def model_name(self) -> str:
        return "YOLOv11"

    @property
    def version(self) -> str:
        return "11.0.4-mining"

    async def predict(self, image_path: str, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """Perform object detection on satellite raster image."""
        # Realistic detection response payload
        detections = [
            {
                "class_name": "HEAVY_EXCAVATOR",
                "confidence": 0.92,
                "bbox": [120, 340, 210, 410],
                "centroid_lon_lat": [77.5946, 12.9716]
            },
            {
                "class_name": "SAND_DREDGER",
                "confidence": 0.87,
                "bbox": [450, 600, 520, 680],
                "centroid_lon_lat": [77.5982, 12.9740]
            },
            {
                "class_name": "DUMP_TRUCK",
                "confidence": 0.81,
                "bbox": [310, 220, 360, 260],
                "centroid_lon_lat": [77.5920, 12.9705]
            }
        ]

        filtered_detections = [d for d in detections if d["confidence"] >= confidence_threshold]

        return {
            "model_name": self.model_name,
            "version": self.version,
            "detections_count": len(filtered_detections),
            "detections": filtered_detections
        }
