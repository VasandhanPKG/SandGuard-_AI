"""
API Integration Tests for Authentication & Registration Endpoints
"""

import pytest


@pytest.mark.asyncio
async def test_root_health_check(async_client):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"


@pytest.mark.asyncio
async def test_user_registration(async_client):
    payload = {
        "email": "testofficer@sandguard.gov",
        "password": "SecurePassword123!",
        "full_name": "District Officer Jane",
        "role": "DISTRICT_OFFICER",
        "district_name": "Northern District"
    }
    response = await async_client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
