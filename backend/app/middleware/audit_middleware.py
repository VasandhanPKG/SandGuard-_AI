"""
SandGuard Security Audit & Compliance Logging Middleware
Tracks user actions, state modifications, client IP addresses, and request correlation IDs.
"""

import time
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("sandguard.audit")


class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        start_time = time.time()

        client_ip = request.client.host if request.client else "127.0.0.1"
        method = request.method
        path = request.url.path

        response = await call_next(request)

        duration_ms = round((time.time() - start_time) * 1000, 2)
        status_code = response.status_code

        # Audit log state-changing HTTP requests
        if method in ["POST", "PUT", "PATCH", "DELETE"]:
            logger.info(
                f"[AUDIT] ID={request_id} IP={client_ip} METHOD={method} PATH={path} "
                f"STATUS={status_code} DURATION={duration_ms}ms"
            )

        response.headers["X-Request-ID"] = request_id
        return response
