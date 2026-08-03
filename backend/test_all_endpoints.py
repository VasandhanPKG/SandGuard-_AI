import sys
import asyncio
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

endpoints_to_test = [
    ("GET", "/"),
    ("GET", "/health"),
    ("GET", "/metrics"),
    ("GET", "/api/v1/dashboard/summary"),
    ("GET", "/api/v1/analytics/hotspots"),
    ("GET", "/api/v1/satellite/"),
    ("GET", "/api/v1/mining/sites"),
    ("GET", "/api/v1/mining/events"),
    ("GET", "/api/v1/mining/risk-scores"),
    ("GET", "/api/v1/ai/models"),
    ("GET", "/api/v1/alerts/"),
    ("GET", "/api/v1/reports/"),
]

print("=== STARTING BACKEND ENDPOINT AUDIT ===")

passed = 0
failed = 0

for method, url in endpoints_to_test:
    try:
        if method == "GET":
            response = client.get(url)
        print(f"[{method}] {url} -> Status: {response.status_code}")
        if response.status_code in [200, 201]:
            passed += 1
        else:
            print(f"  FAILED Body: {response.text[:200]}")
            failed += 1
    except Exception as e:
        print(f"[{method}] {url} -> EXCEPTION: {e}")
        failed += 1

print("\n--- POST ENDPOINTS AUDIT ---")

post_endpoints = [
    ("POST", "/api/v1/gis/parse-geojson", {"json": {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [[[77.7, 11.3], [77.8, 11.3], [77.8, 11.4], [77.7, 11.4], [77.7, 11.3]]]}}}),
    ("POST", "/api/v1/gis/river-buffer", {"json": {"type": "LineString", "coordinates": [[77.7, 11.3], [77.8, 11.4]]}}),
    ("POST", "/api/v1/satellite/search-external", {"data": {"min_lon": 77.5, "min_lat": 12.9, "max_lon": 77.6, "max_lat": 13.0}}),
    ("POST", "/api/v1/ai/detect?satellite_image_id=test-123", {}),
    ("POST", "/api/v1/notifications/dispatch?title=Test&district_name=Bhavani&message=Alert", {}),
    ("POST", "/api/v1/reports/generate", {"json": {"title": "Test Report", "report_type": "COURT_DOSSIER", "format": "PDF", "district_name": "Bhavani River"}}),
]

for method, url, kwargs in post_endpoints:
    try:
        response = client.post(url, **kwargs)
        print(f"[{method}] {url} -> Status: {response.status_code}")
        if response.status_code in [200, 201]:
            passed += 1
        else:
            print(f"  FAILED Body: {response.text[:200]}")
            failed += 1
    except Exception as e:
        print(f"[{method}] {url} -> EXCEPTION: {e}")
        failed += 1

print(f"\nAUDIT SUMMARY: Passed={passed}, Failed={failed}")
