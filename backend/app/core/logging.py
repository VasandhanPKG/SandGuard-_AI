"""
SandGuard Core Logging Module
Structured logging configuration with log formatting, request correlation, and security audit capability.
"""

import logging
import sys
from app.core.config import settings


def setup_logging():
    """Configure structured logging for SandGuard backend."""
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    log_format = (
        "[%(asctime)s] [%(process)d] [%(levelname)s] "
        "[%(name)s:%(lineno)d] - %(message)s"
    )
    
    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Suppress verbose third party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING if not settings.DEBUG else logging.INFO)
    
    logger = logging.getLogger("sandguard")
    logger.info(f"Logging initialized for environment: {settings.ENVIRONMENT}")
    return logger


logger = setup_logging()
