"""
SandGuard SendGrid Email Notification Client
Dispatches high-priority illegal mining security alerts and PDF report attachments via SendGrid API v3.
"""

import logging
import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger("sandguard.notifications.sendgrid")


class SendGridEmailClient:
    """SendGrid API v3 transactional email dispatcher."""
    SEND_URL = "https://api.sendgrid.com/v3/mail/send"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.SENDGRID_API_KEY
        self.from_email = settings.EMAILS_FROM_EMAIL
        self.from_name = settings.EMAILS_FROM_NAME

    async def send_email_alert(
        self,
        recipient_email: str,
        subject: str,
        html_content: str,
        plain_text_content: Optional[str] = None
    ) -> Dict[str, Any]:
        """Dispatch HTML alert email via SendGrid."""
        if not self.api_key:
            logger.warning(f"SendGrid API key missing. Simulating email dispatch to {recipient_email}")
            return {"status": "SIMULATED", "recipient": recipient_email, "subject": subject}

        payload = {
            "personalizations": [{"to": [{"email": recipient_email}]}],
            "from": {"email": self.from_email, "name": self.from_name},
            "subject": subject,
            "content": [
                {"type": "text/plain", "value": plain_text_content or subject},
                {"type": "text/html", "value": html_content}
            ]
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(self.SEND_URL, json=payload, headers=headers, timeout=10.0)
                if resp.status_code in (200, 202):
                    logger.info(f"SendGrid email successfully delivered to {recipient_email}")
                    return {"status": "SENT", "recipient": recipient_email, "status_code": resp.status_code}
                else:
                    logger.error(f"SendGrid error response: {resp.status_code} - {resp.text}")
            except Exception as e:
                logger.error(f"SendGrid email dispatch failed: {e}")

        return {"status": "FAILED", "recipient": recipient_email}
