from typing import Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.exceptions import DomainException
from app.db.session import get_db
from app.models.enums import OrderStatus, PaymentProvider, PaymentStatus
from app.models.order import Order, PaymentTransaction
from app.models.user import User
from app.services.order import order_service
from app.services.payment import payment_service

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentRequestBody(BaseModel):
    order_id: str = Field(..., description="ID of the order awaiting payment")


class PaymentRequestResponse(BaseModel):
    payment_url: str
    authority: str
    order_number: str


class PaymentVerifyBody(BaseModel):
    order_id: Optional[str] = None
    authority: Optional[str] = None
    ref_num: Optional[str] = Field(default=None, alias="RefNum")
    res_num: Optional[str] = Field(default=None, alias="ResNum")
    state: str = Field(default="OK", alias="State")
    status: Optional[str] = Field(default=None)


class PaymentVerifyResponse(BaseModel):
    success: bool
    message: str
    ref_id: Optional[str] = None
    status: Optional[str] = None
    order_number: Optional[str] = None


@router.post(
    "/request",
    response_model=PaymentRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initialize / Re-initialize Payment for an Order",
)
async def request_payment(
    payload: PaymentRequestBody,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PaymentRequestResponse:
    stmt = select(Order).where(
        Order.id == payload.order_id, Order.user_id == current_user.id
    )
    res = await db.execute(stmt)
    order = res.scalar_one_or_none()
    if not order:
        raise DomainException(
            message="Order not found.", code="ORDER_NOT_FOUND", status_code=404
        )
    if order.status != OrderStatus.PENDING:
        raise DomainException(
            message="Order is not awaiting payment.",
            code="ORDER_NOT_PENDING",
            status_code=400,
        )

    callback_url = f"{settings.FRONTEND_URL.rstrip('/')}/payment/callback?order_id={order.id}"
    token, payment_url = await payment_service.request_payment(
        amount_rial=order.total_amount_rial,
        res_num=order.order_number,
        callback_url=callback_url,
        cell_number=current_user.phone,
    )

    order.zarinpal_authority = token

    stmt_tx = select(PaymentTransaction).where(
        PaymentTransaction.order_id == order.id,
        PaymentTransaction.status == PaymentStatus.PENDING,
    )
    tx = (await db.execute(stmt_tx)).scalar_one_or_none()
    if tx:
        tx.authority = token
        tx.provider = PaymentProvider.SEP
    else:
        db.add(
            PaymentTransaction(
                order_id=order.id,
                provider=PaymentProvider.SEP,
                amount_rial=order.total_amount_rial,
                status=PaymentStatus.PENDING,
                authority=token,
            )
        )

    await db.commit()
    return PaymentRequestResponse(
        payment_url=payment_url, authority=token, order_number=order.order_number
    )


@router.post(
    "/verify",
    response_model=PaymentVerifyResponse,
    summary="Verify Gateway Callback",
)
async def verify_payment(
    payload: PaymentVerifyBody,
    db: AsyncSession = Depends(get_db),
) -> PaymentVerifyResponse:
    result = await order_service.verify_payment_callback(
        db=db,
        order_id=payload.order_id,
        authority=payload.authority,
        ref_num=payload.ref_num,
        res_num=payload.res_num,
        state=payload.state or ("OK" if payload.status == "OK" else "NOK"),
    )

    return PaymentVerifyResponse(
        success=bool(result.get("success", False)),
        message=str(result.get("message", "")),
        ref_id=result.get("ref_id"),
        status=result.get("status"),
        order_number=result.get("order_number"),
    )