from typing import Optional
from pydantic import BaseModel


class PaymentInitiateRequest(BaseModel):
    orderNumber: str
    amount: int
    callbackUrl: Optional[str] = "/checkout/callback"


class PaymentInitiateResponse(BaseModel):
    paymentToken: str
    gatewayUrl: str


class PaymentVerifyRequest(BaseModel):
    paymentToken: str
    cardNumber: Optional[str] = None
    action: Optional[str] = "success"  # success | fail | cancel


class PaymentVerifyResponse(BaseModel):
    success: bool
    orderNumber: str
    transactionId: Optional[str] = None
    referenceId: Optional[str] = None
    paidAt: Optional[str] = None
    errorMessage: Optional[str] = None


class PaymentSessionInfo(BaseModel):
    token: str
    orderNumber: str
    amount: int
    merchantName: str = "فروشگاه اینترنتی پوشاک ورزشی کراس (Keras)"
    createdAt: str
    expiresAt: str
    status: str = "pending"  # pending | settled | failed | cancelled

