"""
SandGuard Autonomous AI Agent Router
Provides endpoints to trigger LangGraph multi-step illegal mining investigation workflows.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.agents.investigation_agent import SandGuardInvestigationAgent

router = APIRouter(prefix="/agents", tags=["Autonomous AI Agents"])


class InvestigationRequest(BaseModel):
    district_name: str = "Kaveri River Basin"
    latitude: float = 12.9716
    longitude: float = 77.5946


@router.post("/investigate", status_code=status.HTTP_200_OK)
async def run_autonomous_investigation(
    req: InvestigationRequest,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Trigger multi-step autonomous investigation agent (Satellite Ingest -> AI CV -> PostGIS GIS -> Risk Engine -> Gemini Briefing)."""
    agent = SandGuardInvestigationAgent(db)
    return await agent.run_investigation(
        district_name=req.district_name,
        latitude=req.latitude,
        longitude=req.longitude
    )
