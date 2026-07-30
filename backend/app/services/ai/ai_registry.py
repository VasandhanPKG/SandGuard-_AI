"""
SandGuard Modular AI Registry and Model Factory
Allows hot-swapping model architectures (YOLOv11, SegFormer, SAM2, DeepLabV3+) without rewriting core application code.
"""

from typing import Dict, Type
from app.services.ai.base_engine import BaseAIEngine
from app.services.ai.yolo_engine import YOLODetectionEngine
from app.services.ai.segformer_engine import SegFormerSegmentationEngine
from app.services.ai.sam2_engine import SAM2SegmentationEngine


class AIRegistry:
    def __init__(self):
        self._engines: Dict[str, BaseAIEngine] = {}
        # Register default model engines
        self.register_engine("yolo", YOLODetectionEngine())
        self.register_engine("segformer", SegFormerSegmentationEngine())
        self.register_engine("sam2", SAM2SegmentationEngine())

    def register_engine(self, key: str, engine: BaseAIEngine) -> None:
        """Register a new AI model engine implementation."""
        self._engines[key.lower()] = engine

    def get_engine(self, key: str) -> BaseAIEngine:
        """Retrieve model engine by key name or raise ValueError."""
        engine = self._engines.get(key.lower())
        if not engine:
            available = list(self._engines.keys())
            raise ValueError(f"AI engine '{key}' not registered. Available engines: {available}")
        return engine


ai_registry = AIRegistry()
