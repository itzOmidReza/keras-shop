import logging
import re
from typing import Any, Dict
import httpx

from app.core.config import settings

logger = logging.getLogger("sage.sms")


class FarazSMSService:
    """
    FarazSMS / IPPanel Pattern SMS Client with multi-endpoint failover.
    Supports both WS v1 (attributes dict) and Classic JSON-RPC (inputData list).
    """

    WS_ENDPOINTS = [
        "https://api.iranpayamak.com/ws/v1/sms/pattern",
        "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
        "https://edge.ippanel.com/ws/v1/sms/pattern",
    ]
    CLASSIC_ENDPOINT = "https://ippanel.com/api/select"

    def __init__(self):
        self.api_key = settings.FARAZSMS_API_KEY.strip() if settings.FARAZSMS_API_KEY else ""
        self.pattern_code = settings.FARAZSMS_PATTERN_CODE.strip() if settings.FARAZSMS_PATTERN_CODE else ""
        self.line_number = settings.FARAZSMS_ORIGINATOR.replace("+", "").strip() or "90008361"
        self.var_name = settings.FARAZSMS_CODE_VARIABLE or "code"

    def _normalize_phone(self, phone: str) -> str:
        digits = re.sub(r"\D", "", phone)
        if digits.startswith("0098"):
            digits = digits[4:]
        elif digits.startswith("98"):
            digits = digits[2:]
        elif digits.startswith("9"):
            digits = "0" + digits
        return digits

    async def _try_ws_endpoint(self, client: httpx.AsyncClient, url: str, phone: str, code: str) -> bool:
        payload = {
            "code": self.pattern_code,
            "recipient": phone,
            "line_number": self.line_number,
            "number_format": "english",
            "attributes": {
                self.var_name: str(code)
            },
        }
        headers = {
            "Api-Key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        try:
            res = await client.post(url, json=payload, headers=headers)
            logger.debug(f"FarazSMS WS {url} returned [{res.status_code}]: {res.text}")
            if res.status_code in (200, 201):
                logger.info(f"✅ FarazSMS delivered via {url} to {phone}")
                return True
            logger.warning(f"⚠️ FarazSMS {url} returned [{res.status_code}]: {res.text}")
        except Exception as exc:
            logger.warning(f"⚠️ Failed connecting to {url}: {exc}")
        return False

    async def _try_classic_endpoint(self, client: httpx.AsyncClient, phone: str, code: str) -> bool:
        payload = {
            "op": "pattern",
            "user": self.api_key,
            "fromNum": self.line_number,
            "toNum": phone,
            "patternCode": self.pattern_code,
            "inputData": [
                {self.var_name: str(code)}
            ],
        }
        try:
            res = await client.post(self.CLASSIC_ENDPOINT, json=payload)
            logger.info(f"🔍 Classic IPPanel raw response: status={res.status_code}, body={res.text}")
            if res.status_code == 200:
                try:
                    data = res.json()
                except Exception:
                    data = res.text.strip()

                is_success = False
                
                # IPPanel Classic Success Patterns:
                # 1. Standard RPC success: [0, bulk_id] (0 indicates status OK)
                if isinstance(data, list) and len(data) >= 2 and str(data[0]).strip() in ("0", "200"):
                    is_success = True
                # 2. Raw bulk tracking integer > 0
                elif isinstance(data, int) and data > 0:
                    is_success = True
                # 3. Numeric string ID not matching known IPPanel error codes (< 900)
                elif isinstance(data, str) and data.isdigit() and int(data) > 0 and len(data) > 4:
                    is_success = True

                if is_success:
                    logger.info(f"✅ FarazSMS delivered via classic endpoint to {phone} (Tracking ID: {data})")
                    return True

                logger.warning(f"⚠️ Classic IPPanel returned logical error: {data}")
        except Exception as exc:
            logger.warning(f"⚠️ Failed connecting to classic endpoint: {exc}")
        return False

    async def send_otp(self, receptor: str, code: str) -> bool:
        phone = self._normalize_phone(receptor)

        if not re.match(r"^09\d{9}$", phone):
            logger.error(f"❌ Invalid mobile number format: '{receptor}' (normalized: '{phone}')")
            return False

        # Mock fallback if key is missing or dummy
        if not self.api_key or self.api_key in ("MOCK_KEY", ""):
            logger.info(f"🧪 [DEV MOCK SMS] Sent OTP [{code}] to {phone}")
            return True

        # trust_env=False prevents httpx from routing through system VPN/HTTP proxies
        async with httpx.AsyncClient(timeout=8.0, trust_env=False) as client:
            # 1. Try modern WS v1/v2 URLs
            for url in self.WS_ENDPOINTS:
                if await self._try_ws_endpoint(client, url, phone, code):
                    return True

            # 2. Try Classic IPPanel URL
            if await self._try_classic_endpoint(client, phone, code):
                return True

        # If gateways fail and in development mode, log code to prevent lockout
        if settings.ENVIRONMENT == "development":
            logger.warning(
                f"🚨 [DEV NETWORK FALLBACK] All SMS gateways unreachable. Dev OTP code is [{code}] for {phone}"
            )
            return True

        logger.critical(f"❌ FarazSMS delivery failed for {phone}")
        return False


sms_service = FarazSMSService()