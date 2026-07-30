"""
SandGuard Pydantic v2 Report and Alert Schemas
"""

from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class ReportCreate(BaseModel):
    title: str
    report_type: str = "DISTRICT"  # DISTRICT, MONTHLY, WEEKLY, ILLEGAL_MINING, ENVIRONMENTAL
    format: str = "PDF"  # PDF, EXCEL, CSV
    district_name: Optional[str] = None


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    report_type: str
    format: str
    district_name: Optional[str] = None
    file_path: Optional[str] = None
    status: str
    created_at: datetime


class AlertLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    alert_level: str
    district_name: str
    message: str
    is_acknowledged: bool
    created_at: datetime
