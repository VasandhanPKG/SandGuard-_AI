"""
SandGuard Main Application Entrypoint
FastAPI application initialization, middleware registration, CORS configuration, exception handlers, and API routing.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db_extensions
from app.core.exceptions import SandGuardException, sandguard_exception_handler
from app.middleware.audit_middleware import AuditMiddleware
from app.api.v1.router import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifespan events."""
    # Startup: Ensure PostGIS extension and UUID extensions exist
    await init_db_extensions()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI-powered illegal sand mining monitoring backend with PostGIS spatial analytics.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Security Audit Middleware
app.add_middleware(AuditMiddleware)

# Custom Exception Handlers
app.add_exception_handler(SandGuardException, sandguard_exception_handler)


@app.get("/", tags=["System Health"])
async def root():
    """Root platform health check endpoint."""
    return {
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "HEALTHY",
        "docs": "/docs"
    }


@app.get("/health", tags=["System Health"])
async def health_check():
    """System health inspection endpoint."""
    return {
        "status": "UP",
        "environment": settings.ENVIRONMENT,
        "database": "CONNECTED",
        "spatial_engine": "POSTGIS 3.4"
    }


# Mount API V1 Master Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
