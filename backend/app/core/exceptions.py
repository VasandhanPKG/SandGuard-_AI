"""
SandGuard Core Exceptions & Error Handling Module
Custom domain exceptions and structured HTTP response handlers.
"""

from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse


class SandGuardException(Exception):
    """Base exception for all SandGuard domain errors."""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class EntityNotFoundException(SandGuardException):
    """Raised when a requested database entity or GIS record is not found."""
    pass


class AuthenticationFailedException(SandGuardException):
    """Raised when authentication credentials fail validation."""
    pass


class SpatialOperationException(SandGuardException):
    """Raised when a GIS coordinate, GeoJSON or spatial overlay operation fails."""
    pass


class AIServiceException(SandGuardException):
    """Raised when AI inference or model prediction fails."""
    pass


async def sandguard_exception_handler(request: Request, exc: SandGuardException):
    """Global exception handler for domain exceptions."""
    status_code = status.HTTP_400_BAD_REQUEST
    if isinstance(exc, EntityNotFoundException):
        status_code = status.HTTP_404_NOT_FOUND
    elif isinstance(exc, AuthenticationFailedException):
        status_code = status.HTTP_401_UNAUTHORIZED
    elif isinstance(exc, SpatialOperationException):
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    elif isinstance(exc, AIServiceException):
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return JSONResponse(
        status_code=status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.message,
            "details": exc.details,
            "path": request.url.path
        }
    )
