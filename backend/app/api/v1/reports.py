"""
SandGuard Executive Report Generation & Download APIs
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.report_service import ReportService
from app.schemas.reporting import ReportCreate, ReportResponse
from app.repositories.report_repository import ReportRepository

router = APIRouter(prefix="/reports", tags=["Reports Engine"])


@router.post("/generate", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def generate_report(
    report_in: ReportCreate,
    db: AsyncSession = Depends(get_db)
):
    """Trigger report generation in PDF, Excel, or CSV format."""
    report_service = ReportService(db)
    return await report_service.generate_report(
        title=report_in.title,
        report_type=report_in.report_type,
        format_type=report_in.format,
        district_name=report_in.district_name
    )


@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    district_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List generated compliance reports."""
    repo = ReportRepository(db)
    if district_name:
        return await repo.get_by_district(district_name)
    return await repo.get_all(skip=0, limit=50)


@router.get("/{report_id}/download")
async def download_report_file(report_id: str, db: AsyncSession = Depends(get_db)):
    """Download generated report document file."""
    repo = ReportRepository(db)
    report = await repo.get_by_id(report_id)
    if not report or not report.file_path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found")
    
    media_type = "application/pdf"
    if report.format == "EXCEL":
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif report.format == "CSV":
        media_type = "text/csv"

    return FileResponse(
        path=report.file_path,
        media_type=media_type,
        filename=f"{report.title}.{report.format.lower()}"
    )
