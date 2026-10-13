import logging
import uuid
from typing import Any, Dict, Optional, Tuple
import httpx

from app.core.config import settings
from app.core.exceptions import DomainException

logger = logging.getLogger("sage.payment")


class SEPPaymentService:
    """
    Saman Electronic Payment (SEP / سپ) REST integration driver.
    Documentation specs:
      - Token URL: https://sep.shaparak.ir/OnlinePG/OnlinePG
      - Verify URL: https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction
      - GET Redirect: https://sep.shaparak.ir/OnlinePG/SendToken?token={token}
    """

    TOKEN_URL = "https://sep.shaparak.ir/OnlinePG/OnlinePG"
    VERIFY_URL = "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction"
    GET_PAYMENT_URL = "https://sep.shaparak.ir/OnlinePG/SendToken"

    def __init__(self):
        self.terminal_id = (settings.SEP_TERMINAL_ID or "").strip()
        self.is_dev = settings.ENVIRONMENT == "development"

    def _is_mock_enabled(self) -> bool:
        # If mock mode is explicitly turned on, always use mock
        if settings.USE_MOCK_PAYMENT:
            return True
        # In development without a real terminal ID, fall back to mock
        if self.is_dev and (not self.terminal_id or self.terminal_id.startswith("your_")):
            return True
        return False

    async def request_payment(
        self,
        amount_rial: int,
        res_num: str,
        callback_url: str,
        cell_number: Optional[str] = None,
    ) -> Tuple[str, str]:
        """
        Requests payment token from SEP.
        Returns: (token, redirect_url)
        """
        if self._is_mock_enabled():
            mock_token = f"SEP-TOKEN-{uuid.uuid4().hex[:20]}"
            separator = "&" if "?" in callback_url else "?"
            mock_redirect = (
                f"{callback_url}{separator}State=OK&Status=2&ResNum={res_num}&RefNum=MOCK-REF-{uuid.uuid4().hex[:10]}"
            )
            return mock_token, mock_redirect

        if not self.terminal_id:
            raise DomainException(
                message="درگاه پرداخت سپ تنظیم نشده است.",
                code="PAYMENT_NOT_CONFIGURED",
                status_code=500,
            )

        payload = {
            "action": "token",
            "TerminalId": self.terminal_id,
            "Amount": int(amount_rial),
            "ResNum": str(res_num),
            "RedirectUrl": callback_url,
            "CellNumber": cell_number or "",
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(self.TOKEN_URL, json=payload)
                data = response.json()

                if data.get("status") == 1 and "token" in data:
                    token = str(data["token"])
                    redirect_url = f"{self.GET_PAYMENT_URL}?token={token}"
                    return token, redirect_url

                error_desc = data.get("errorDesc") or "خطا در برقراری ارتباط با درگاه پرداخت سپ"
                logger.error(f"❌ SEP Token Request Rejected: {data}")
                raise DomainException(
                    message=f"درخواست پرداخت ناموفق بود: {error_desc}",
                    code="PAYMENT_REQUEST_FAILED",
                    status_code=400,
                )
        except DomainException:
            raise
        except Exception as exc:
            logger.critical(f"❌ SEP Gateway Network Error: {exc}")
            raise DomainException(
                message="خطا در ارتباط با سرور درگاه سپ.",
                code="PAYMENT_GATEWAY_UNAVAILABLE",
                status_code=500,
            )

    async def verify_payment(
        self,
        ref_num: str,
        expected_amount_rial: int,
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Verifies transaction using SEP VerifyTransaction endpoint.
        Returns: (is_success, ref_num, raw_response)
        """
        if self._is_mock_enabled():
            return True, ref_num, {"mock": True, "ResultCode": 0}

        if not self.terminal_id:
            raise DomainException(
                message="درگاه پرداخت سپ تنظیم نشده است.",
                code="PAYMENT_NOT_CONFIGURED",
                status_code=500,
            )

        payload = {
            "RefNum": ref_num,
            "TerminalNumber": int(self.terminal_id) if self.terminal_id.isdigit() else self.terminal_id,
        }

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                response = await client.post(self.VERIFY_URL, json=payload)
                data = response.json()

                result_code = data.get("ResultCode")
                is_success = response.status_code == 200 and (result_code == 0 or result_code == "0")

                tx_detail = data.get("TransactionDetail") or {}
                original_amount = tx_detail.get("OrginalAmount") or tx_detail.get("AffectiveAmount")
                if is_success and original_amount:
                    if int(original_amount) != int(expected_amount_rial):
                        logger.error(
                            f"❌ SEP Amount Mismatch: expected {expected_amount_rial}, got {original_amount}"
                        )
                        return False, ref_num, {**data, "mismatch": True}

                return is_success, ref_num, data
        except Exception as exc:
            logger.critical(f"❌ SEP Verification Exception: {exc}")
            return False, ref_num, {"error": str(exc)}


payment_service = SEPPaymentService()