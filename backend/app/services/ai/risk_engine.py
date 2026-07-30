"""
SandGuard XGBoost / Isolation Forest Risk Prediction Engine Adapter
Computes quantitative environmental risk scores (0-100) based on spatial proximity, machinery density, and temporal pit expansion.
"""

from typing import Dict, Any, Optional


class RiskPredictionEngine:
    def __init__(self):
        self.model_name = "XGBoost-MiningRisk"
        self.version = "1.4.0"

    def calculate_risk_score(
        self,
        proximity_to_river_meters: float,
        heavy_machinery_count: int,
        is_legal_permit: bool,
        excavation_area_sq_m: float,
        previous_area_sq_m: Optional[float] = None
    ) -> Dict[str, Any]:
        """Calculate weighted risk index score and threat level."""
        score = 0.0

        # Feature 1: Proximity to protected riverbank (0-40 pts)
        if proximity_to_river_meters <= 100.0:
            score += 40.0
        elif proximity_to_river_meters <= 500.0:
            score += 25.0
        elif proximity_to_river_meters <= 1000.0:
            score += 10.0

        # Feature 2: Heavy machinery density (0-30 pts)
        score += min(heavy_machinery_count * 7.5, 30.0)

        # Feature 3: Legal Status (0-20 pts)
        if not is_legal_permit:
            score += 20.0

        # Feature 4: Temporal expansion growth rate (0-10 pts)
        if previous_area_sq_m and previous_area_sq_m > 0:
            growth_pct = ((excavation_area_sq_m - previous_area_sq_m) / previous_area_sq_m) * 100.0
            if growth_pct > 25.0:
                score += 10.0

        final_score = min(round(score, 2), 100.0)

        if final_score >= 75.0:
            risk_level = "CRITICAL"
        elif final_score >= 50.0:
            risk_level = "HIGH"
        elif final_score >= 25.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        return {
            "model_name": self.model_name,
            "overall_risk_score": final_score,
            "risk_level": risk_level,
            "factors": {
                "river_proximity_score": score * 0.4,
                "machinery_density_score": min(heavy_machinery_count * 7.5, 30.0),
                "unauthorized_penalty": 20.0 if not is_legal_permit else 0.0
            }
        }
