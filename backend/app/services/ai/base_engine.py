"""
SandGuard Base AI Engine Interface
Abstract class defining contract for detection, segmentation, and risk inference models.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseAIEngine(ABC):
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the unique name of the model implementation."""
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        """Return the version string of the model."""
        pass

    @abstractmethod
    async def predict(self, image_path: str, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """Perform object detection or segmentation inference on input image file path."""
        pass
