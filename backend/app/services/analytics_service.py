"""
SandGuard Analytics & Dashboard Aggregation Service
Provides mining hotspot detection, temporal trend analytics, and executive dashboard metrics.
"""

from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.mining import MiningSite, IllegalMiningEvent, RiskScore
from app.models.reporting import AlertLog
from app.models.satellite import SatelliteImage


class AnalyticsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_executive_dashboard_summary(self) -> Dict[str, Any]:
        """Aggregate key KPI metrics for government dashboard APIs."""
        # Count totals across entities
        total_sites_q = await self.session.execute(select(func.count(MiningSite.id)))
        total_sites = total_sites_q.scalar() or 0

        unauthorized_q = await self.session.execute(
            select(func.count(MiningSite.id)).where(MiningSite.legal_status == "UNAUTHORIZED")
        )
        unauthorized_sites = unauthorized_q.scalar() or 0

        total_events_q = await self.session.execute(select(func.count(IllegalMiningEvent.id)))
        total_events = total_events_q.scalar() or 0

        critical_alerts_q = await self.session.execute(
            select(func.count(AlertLog.id)).where(AlertLog.alert_level == "CRITICAL", AlertLog.is_acknowledged == False)
        )
        active_critical_alerts = critical_alerts_q.scalar() or 0

        total_images_q = await self.session.execute(select(func.count(SatelliteImage.id)))
        total_satellite_rasters = total_images_q.scalar() or 0

        # Average risk score
        avg_risk_q = await self.session.execute(select(func.avg(RiskScore.overall_risk_score)))
        avg_risk = float(avg_risk_q.scalar() or 0.0)

        return {
            "total_monitored_sites": total_sites,
            "unauthorized_sites_count": unauthorized_sites,
            "total_illegal_events_detected": total_events,
            "active_critical_alerts": active_critical_alerts,
            "total_satellite_rasters": total_satellite_rasters,
            "average_system_risk_score": round(avg_risk, 2),
            "status": "OPERATIONAL"
        }

    async def get_district_hotspots(self) -> List[Dict[str, Any]]:
        """Identify high risk illegal mining hotspot clusters by district."""
        query = (
            select(
                IllegalMiningEvent.district_name,
                func.count(IllegalMiningEvent.id).label("event_count"),
                func.max(IllegalMiningEvent.severity).label("highest_severity")
            )
            .group_by(IllegalMiningEvent.district_name)
            .order_by(func.count(IllegalMiningEvent.id).desc())
        )
        result = await self.session.execute(query)
        return [
            {
                "district_name": row.district_name,
                "event_count": row.event_count,
                "highest_severity": row.highest_severity
            }
            for row in result.all()
        ]
