"""
SandGuard Multi-Format Report Generator Service (PDF, Excel, CSV)
Builds district executive briefings, monthly compliance summaries, and illegal mining audit logs.
"""

import os
import csv
import io
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import pandas as pd

from app.models.reporting import Report
from app.repositories.report_repository import ReportRepository
from app.repositories.mining_repository import IllegalMiningEventRepository
from app.core.config import settings
from app.services.ai.gemini_engine import GeminiIntelligenceEngine


class ReportService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.report_repo = ReportRepository(session)
        self.event_repo = IllegalMiningEventRepository(session)
        self.gemini_engine = GeminiIntelligenceEngine()

    async def generate_report(
        self,
        title: str,
        report_type: str = "DISTRICT",
        format_type: str = "PDF",
        district_name: Optional[str] = "Central District",
        user_id: Optional[str] = None
    ) -> Report:
        """Generate structured report file (PDF, Excel, or CSV) and save record."""
        os.makedirs(os.path.join(settings.UPLOAD_DIR, "reports"), exist_ok=True)
        file_ext = format_type.lower()
        filename = f"sandguard_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, "reports", filename)

        # Fetch recent illegal events for report body
        events = await self.event_repo.get_recent_events(limit=20)
        events_data = [
            {
                "Event Code": e.event_code,
                "District": e.district_name,
                "Severity": e.severity,
                "Status": e.status,
                "Confidence Score": f"{e.confidence_score:.2f}",
                "Excavation Area (sq.m)": e.estimated_excavation_sq_m or 0.0,
                "Detected At": e.detected_at.strftime("%Y-%m-%d %H:%M UTC") if e.detected_at else ""
            }
            for e in events
        ]

        if format_type.upper() == "CSV":
            self._export_csv(filepath, events_data)
        elif format_type.upper() == "EXCEL":
            self._export_excel(filepath, events_data)
        else:  # PDF Default
            ai_narrative = await self.gemini_engine.generate_district_intelligence_summary(
                district_name=district_name or "National",
                total_events=len(events_data),
                critical_sites=len([e for e in events_data if e["Severity"] == "CRITICAL"]),
                environmental_score=82.5
            )
            self._export_pdf(filepath, title, district_name or "All", events_data, ai_narrative)

        report = Report(
            title=title,
            report_type=report_type,
            format=format_type.upper(),
            district_name=district_name,
            file_path=filepath,
            status="COMPLETED",
            generated_by=user_id,
            summary_data={"total_records": len(events_data)}
        )
        return await self.report_repo.create(report)

    def _export_csv(self, filepath: str, data: List[Dict[str, Any]]) -> None:
        """Export data array to CSV format."""
        if not data:
            data = [{"Info": "No illegal mining events detected for period."}]
        fieldnames = list(data[0].keys())
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)

    def _export_excel(self, filepath: str, data: List[Dict[str, Any]]) -> None:
        """Export data array to Excel spreadsheet (.xlsx)."""
        df = pd.DataFrame(data if data else [{"Info": "No illegal mining events detected for period."}])
        with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="Mining Detections", index=False)

    def _export_pdf(self, filepath: str, title: str, district: str, data: List[Dict[str, Any]], narrative: str) -> None:
        """Export executive PDF report with ReportLab."""
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Heading1"],
            fontSize=20,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=12
        )
        body_style = ParagraphStyle(
            "BodyStyle",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155")
        )

        elements = []
        elements.append(Paragraph(f"<b>SandGuard AI Platform</b>", title_style))
        elements.append(Paragraph(f"<b>Report:</b> {title} | <b>District:</b> {district}", body_style))
        elements.append(Spacer(1, 10))
        
        # Executive Summary Box
        elements.append(Paragraph("<b>Executive Intelligence Briefing:</b>", styles["Heading2"]))
        elements.append(Paragraph(narrative.replace("\n", "<br/>"), body_style))
        elements.append(Spacer(1, 15))

        # Detections Table
        elements.append(Paragraph("<b>Recent Detections Summary:</b>", styles["Heading2"]))
        if data:
            headers = list(data[0].keys())
            table_rows = [headers]
            for item in data[:10]:
                table_rows.append([str(item[h]) for h in headers])

            t = Table(table_rows, colWidths=[80, 70, 60, 65, 75, 80, 90])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 8),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ('FONTSIZE', (0, 1), (-1, -1), 7),
            ]))
            elements.append(t)
        else:
            elements.append(Paragraph("No events detected.", body_style))

        doc.build(elements)
