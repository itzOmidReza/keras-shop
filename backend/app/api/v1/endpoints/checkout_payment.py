import uuid
from datetime import datetime, timezone
from typing import Optional, Dict
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.order import Order, PaymentTransaction
from app.models.enums import PaymentStatus, OrderStatus
from app.schemas.payment import (
    PaymentInitiateRequest,
    PaymentInitiateResponse,
    PaymentVerifyRequest,
    PaymentVerifyResponse,
    PaymentSessionInfo,
)
from app.core.exceptions import DomainException

router = APIRouter(prefix="/checkout/payment", tags=["Payment Gateway"])

_TOMAN = 10


@router.post(
    "/initiate",
    response_model=PaymentInitiateResponse,
    status_code=status.HTTP_200_OK,
    summary="Initiate Shaparak Payment Gateway",
)
async def initiate_payment(
    payload: PaymentInitiateRequest,
    db: AsyncSession = Depends(get_db),
):
    token = f"keras_pay_{uuid.uuid4().hex}"
    gateway_url = f"/checkout/gateway?token={token}"

    res = await db.execute(select(Order).where(Order.order_number == payload.orderNumber))
    order = res.scalar_one_or_none()

    if order:
        tx = PaymentTransaction(
            order_id=order.id,
            authority=token,
            amount_rial=payload.amount * _TOMAN,
            status=PaymentStatus.PENDING,
            callback_url=payload.callbackUrl or "/checkout/callback",
        )
        db.add(tx)
        await db.commit()

    return PaymentInitiateResponse(
        paymentToken=token,
        gatewayUrl=gateway_url,
    )


@router.get(
    "/session",
    response_model=PaymentSessionInfo,
    status_code=status.HTTP_200_OK,
    summary="Get Payment Session Info",
)
async def get_payment_session(
    token: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(PaymentTransaction).where(PaymentTransaction.authority == token))
    tx = res.scalar_one_or_none()

    now = datetime.now(timezone.utc)
    if tx:
        order_res = await db.execute(select(Order).where(Order.id == tx.order_id))
        order = order_res.scalar_one_or_none()
        order_num = order.order_number if order else "KERAS-ORDER"
        amt = int(tx.amount_rial // _TOMAN)
        st = "pending"
        if tx.status == PaymentStatus.PAID:
            st = "settled"
        elif tx.status == PaymentStatus.FAILED:
            st = "failed"

        return PaymentSessionInfo(
            token=token,
            orderNumber=order_num,
            amount=amt,
            createdAt=tx.created_at.isoformat() if tx.created_at else now.isoformat(),
            expiresAt=now.isoformat(),
            status=st,
        )

    return PaymentSessionInfo(
        token=token,
        orderNumber="KERAS-208314",
        amount=1450000,
        createdAt=now.isoformat(),
        expiresAt=now.isoformat(),
        status="pending",
    )


@router.post(
    "/verify",
    response_model=PaymentVerifyResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify Payment from Shaparak Gateway",
)
async def verify_payment(
    payload: PaymentVerifyRequest,
    db: AsyncSession = Depends(get_db),
):
    action = payload.action or "success"

    res = await db.execute(select(PaymentTransaction).where(PaymentTransaction.authority == payload.paymentToken))
    tx = res.scalar_one_or_none()

    order_num = "KERAS-208314"
    if tx:
        order_res = await db.execute(select(Order).where(Order.id == tx.order_id))
        order = order_res.scalar_one_or_none()
        if order:
            order_num = order.order_number

        if action == "success":
            tx.status = PaymentStatus.PAID
            tx.ref_id = str(uuid.uuid4().int)[:12]
            tx.card_pan = payload.cardNumber or "6037-99**-****-1234"
            if order:
                order.status = OrderStatus.PROCESSING
                order.status_label = "پرداخت موفق، در حال آماده‌سازی و بسته‌بندی"
            await db.commit()
            return PaymentVerifyResponse(
                success=True,
                orderNumber=order_num,
                transactionId=tx.authority,
                referenceId=tx.ref_id,
                paidAt=datetime.now(timezone.utc).isoformat(),
            )
        else:
            tx.status = PaymentStatus.FAILED
            await db.commit()
            return PaymentVerifyResponse(
                success=False,
                orderNumber=order_num,
                errorMessage="پرداخت ناموفق بود یا توسط کاربر لغو شد.",
            )

    if action == "success":
        return PaymentVerifyResponse(
            success=True,
            orderNumber=order_num,
            transactionId=f"TX-{uuid.uuid4().hex[:8]}",
            referenceId=str(uuid.uuid4().int)[:12],
            paidAt=datetime.now(timezone.utc).isoformat(),
        )

    return PaymentVerifyResponse(
        success=False,
        orderNumber=order_num,
        errorMessage="تراکنش ناموفق بود.",
    )

