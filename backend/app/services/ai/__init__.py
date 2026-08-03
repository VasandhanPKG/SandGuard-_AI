"""
SandGuard AI Package
"""

from app.services.ai.base_engine import BaseAIEngine
from app.services.ai.yolo_engine import YOLODetectionEngine
from app.services.ai.segformer_engine import SegFormerSegmentationEngine
from app.services.ai.sam2_engine import SAM2SegmentationEngine
from app.services.ai.onnx_engine import ONNXInferenceEngine, TorchServeInferenceEngine
from app.services.ai.risk_engine import RiskPredictionEngine
from app.services.ai.gemini_engine import GeminiIntelligenceEngine
from app.services.ai.ai_registry import ai_registry

__all__ = [
    "BaseAIEngine",
    "YOLODetectionEngine",
    "SegFormerSegmentationEngine",
    "SAM2SegmentationEngine",
    "ONNXInferenceEngine",
    "TorchServeInferenceEngine",
    "RiskPredictionEngine",
    "GeminiIntelligenceEngine",
    "ai_registry"
]
