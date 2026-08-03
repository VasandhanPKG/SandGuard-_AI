"""
SandGuard Twilio SMS & WhatsApp Notification Client
Dispatches critical SMS/WhatsApp location alerts and risk notifications to district enforcement officers.
"""

import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("sandguard.notifications.twilio")


class TwilioSMSClient:
    """Twilio REST API SMS & WhatsApp message dispatcher."""

    def __init__(self, account_sid: Optional[str] = None, auth_token: Optional[str] = None):
        self.account_sid = account_sid or settings.TWILIO_ACCOUNT_SID
        self.auth_token = auth_token or settings.TWILIO_AUTH_TOKEN
        self.from_number = settings.TWILIO_FROM_NUMBER or "+15005550006"
        self.whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER or "whatsapp:+14155238886"

    async def send_sms_alert(self, recipient_phone: str, message_body: str) -> Dict[str, Any]:
        """Dispatch SMS text alert to officer phone number."""
        if not self.account_sid or not self.auth_token:
            logger.warning(f"Twilio credentials missing. Simulating SMS dispatch to {recipient_phone}")
            return {"status": "SIMULATED", "channel": "SMS", "recipient": recipient_phone, "message": message_body}

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
        data = {
            "From": self.from_number,
            "To": recipient_phone,
            "Body": message_body
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(url, data=data, auth=(self.account_sid, self.auth_token), timeout=10.0)
                if resp.status_code in (200, 201):
                    sid = resp.json().get("sid")
                    logger.info(f"Twilio SMS sent successfully to {recipient_phone} (SID: {sid})")
                    return {"status": "SENT", "channel": "SMS", "recipient": recipient_phone, "message_sid": sid}
                else:
                    logger.error(f"Twilio API error: {resp.status_code} - {resp.text}")
            except Exception as e:
                logger.error(f"Twilio SMS dispatch failed: {e}")

        return {"status": "FAILED", "channel": "SMS", "recipient": recipient_phone}

    async def send_whatsapp_alert(self, recipient_phone: str, message_body: str) -> Dict[str, Any]:
        """Dispatch WhatsApp text message alert via Twilio Messaging API."""
        formatted_to = recipient_phone if recipient_phone.startswith("whatsapp:") else f"whatsapp:{recipient_phone}"
        
        if not self.account_sid or not self.auth_token:
            logger.warning(f"Twilio credentials missing. Simulating WhatsApp dispatch to {formatted_to}")
            return {"status": "SIMULATED", "channel": "WHATSAPP", "recipient": formatted_to, "message": message_body}

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
        data = {
            "From": self.whatsapp_number,
            "To": formatted_to,
            "Body": message_body
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(url, data=data, auth=(self.account_sid, self.auth_token), timeout=10.0)
                if resp.status_code in (200, 201):
                    sid = resp.json().get("sid")
                    logger.info(f"Twilio WhatsApp message sent to {formatted_to} (SID: {sid})")
                    return {"status": "SENT", "channel": "WHATSAPP", "recipient": formatted_to, "message_sid": sid}
            except Exception as e:
                logger.error(f"Twilio WhatsApp dispatch failed: {e}")

        return {"status": "FAILED", "channel": "WHATSAPP", "recipient": formatted_to}
