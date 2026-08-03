"""
SandGuard Telemetry & Observability Module
Configures OpenTelemetry Tracing instrumentation and Prometheus metric exporters.
"""

import time
import logging
from typing import Callable
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings

logger = logging.getLogger("sandguard.telemetry")

# In-Memory Prometheus Metric Counters & Histograms
METRIC_REQUESTS_TOTAL = {}
METRIC_REQUEST_DURATION_SECONDS = []
METRIC_AI_INFERENCES_TOTAL = {}
METRIC_ALERTS_DISPATCHED_TOTAL = {}


def record_request_metric(method: str, path: str, status_code: int, duration_seconds: float):
    """Record HTTP request metrics for Prometheus scraping."""
    key = (method, path, str(status_code))
    METRIC_REQUESTS_TOTAL[key] = METRIC_REQUESTS_TOTAL.get(key, 0) + 1
    METRIC_REQUEST_DURATION_SECONDS.append(duration_seconds)
    if len(METRIC_REQUEST_DURATION_SECONDS) > 1000:
        METRIC_REQUEST_DURATION_SECONDS.pop(0)


def record_ai_inference_metric(model_name: str, status: str = "success"):
    """Record AI model execution metric."""
    key = (model_name, status)
    METRIC_AI_INFERENCES_TOTAL[key] = METRIC_AI_INFERENCES_TOTAL.get(key, 0) + 1


def record_alert_dispatch_metric(channel: str, status: str = "sent"):
    """Record notification dispatch metric."""
    key = (channel, status)
    METRIC_ALERTS_DISPATCHED_TOTAL[key] = METRIC_ALERTS_DISPATCHED_TOTAL.get(key, 0) + 1


class PrometheusTelemetryMiddleware(BaseHTTPMiddleware):
    """Middleware capturing request counts and latency histograms."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        record_request_metric(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_seconds=duration
        )
        return response


def setup_opentelemetry(app: FastAPI) -> None:
    """Initialize OpenTelemetry tracer provider if enabled."""
    if not settings.ENABLE_TELEMETRY:
        logger.info("Telemetry disabled via config.")
        return

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

        resource = Resource.create({"service.name": "sandguard-backend-api"})
        provider = TracerProvider(resource=resource)
        trace.set_tracer_provider(provider)

        FastAPIInstrumentor.instrument_app(app, tracer_provider=provider)
        logger.info("OpenTelemetry FastAPI instrumentation initialized.")
    except Exception as e:
        logger.info(f"OpenTelemetry SDK optional packages not installed ({e}). Running custom Prometheus exporter.")


def generate_prometheus_metrics_text() -> str:
    """Format in-memory telemetry metrics into Prometheus Exposition Text Format."""
    lines = [
        "# HELP sandguard_http_requests_total Total number of HTTP requests processed.",
        "# TYPE sandguard_http_requests_total counter"
    ]

    for (method, path, status), count in METRIC_REQUESTS_TOTAL.items():
        lines.append(f'sandguard_http_requests_total{{method="{method}",path="{path}",status="{status}"}} {count}')

    lines.extend([
        "# HELP sandguard_ai_inferences_total Total AI model inference passes.",
        "# TYPE sandguard_ai_inferences_total counter"
    ])
    for (model, status), count in METRIC_AI_INFERENCES_TOTAL.items():
        lines.append(f'sandguard_ai_inferences_total{{model="{model}",status="{status}"}} {count}')

    lines.extend([
        "# HELP sandguard_alerts_dispatched_total Total notification alerts dispatched.",
        "# TYPE sandguard_alerts_dispatched_total counter"
    ])
    for (channel, status), count in METRIC_ALERTS_DISPATCHED_TOTAL.items():
        lines.append(f'sandguard_alerts_dispatched_total{{channel="{channel}",status="{status}"}} {count}')

    avg_duration = (
        sum(METRIC_REQUEST_DURATION_SECONDS) / len(METRIC_REQUEST_DURATION_SECONDS)
        if METRIC_REQUEST_DURATION_SECONDS else 0.0
    )
    lines.extend([
        "# HELP sandguard_http_request_duration_seconds_avg Average request processing latency in seconds.",
        "# TYPE sandguard_http_request_duration_seconds_avg gauge",
        f"sandguard_http_request_duration_seconds_avg {round(avg_duration, 4)}"
    ])

    return "\n".join(lines) + "\n"
