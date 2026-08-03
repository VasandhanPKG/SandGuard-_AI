"""
Unit tests for SandGuard enterprise integrations:
  1. Sentinel Hub & Planet Labs Satellite Data Service
  2. ONNX Runtime & TorchServe AI Inference Engines
  3. LangGraph Autonomous Investigation Agent
  4. SendGrid & Twilio Notification Services
  5. OpenTelemetry & Prometheus Metrics Exporter
"""

import pytest
from app.services.external_satellite_service import SentinelHubClient, PlanetLabsClient
from app.services.ai.onnx_engine import ONNXInferenceEngine, TorchServeInferenceEngine
from app.services.ai.ai_registry import ai_registry
from app.services.notifications.sendgrid_service import SendGridEmailClient
from app.services.notifications.twilio_service import TwilioSMSClient
from app.core.telemetry import (
    record_request_metric,
    record_ai_inference_metric,
    record_alert_dispatch_metric,
    generate_prometheus_metrics_text
)


@pytest.mark.asyncio
async def test_sentinel_hub_client_search():
    client = SentinelHubClient()
    bbox = [77.50, 12.90, 77.65, 13.05]
    scenes = await client.search_scenes(bbox=bbox, start_date="2026-07-01", end_date="2026-07-31")
    assert isinstance(scenes, list)
    assert len(scenes) > 0
    assert scenes[0]["provider"] == "SENTINEL_HUB"


@pytest.mark.asyncio
async def test_planet_labs_client_search():
    client = PlanetLabsClient()
    bbox = [77.50, 12.90, 77.65, 13.05]
    scenes = await client.search_scenes(bbox=bbox, start_date="2026-07-01", end_date="2026-07-31")
    assert isinstance(scenes, list)
    assert len(scenes) > 0
    assert scenes[0]["provider"] == "PLANET_LABS"


@pytest.mark.asyncio
async def test_onnx_inference_engine():
    engine = ONNXInferenceEngine()
    result = await engine.predict("test_image.tif")
    assert "model_name" in result
    assert "confidence_score" in result
    assert result["confidence_score"] > 0.8


@pytest.mark.asyncio
async def test_torchserve_inference_engine():
    engine = TorchServeInferenceEngine()
    result = await engine.predict("test_image.tif")
    assert "model_name" in result
    assert "segmented_area_sq_m" in result


def test_ai_registry_registered_engines():
    onnx_engine = ai_registry.get_engine("onnx")
    torchserve_engine = ai_registry.get_engine("torchserve")
    assert onnx_engine is not None
    assert torchserve_engine is not None


@pytest.mark.asyncio
async def test_sendgrid_email_client():
    client = SendGridEmailClient()
    res = await client.send_email_alert("officer@sandguard.gov", "Illegal Mining Alert", "<p>Test</p>")
    assert res["status"] in ("SENT", "SIMULATED")


@pytest.mark.asyncio
async def test_twilio_sms_client():
    client = TwilioSMSClient()
    res = await client.send_sms_alert("+15551234567", "SandGuard Alert Test")
    assert res["status"] in ("SENT", "SIMULATED")


def test_prometheus_telemetry_exporter():
    record_request_metric("GET", "/api/v1/mining", 200, 0.045)
    record_ai_inference_metric("YOLOv11", "success")
    record_alert_dispatch_metric("EMAIL", "sent")

    metrics_text = generate_prometheus_metrics_text()
    assert "sandguard_http_requests_total" in metrics_text
    assert "sandguard_ai_inferences_total" in metrics_text
    assert "sandguard_alerts_dispatched_total" in metrics_text
