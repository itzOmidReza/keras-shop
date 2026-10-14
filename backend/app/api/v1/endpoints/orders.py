import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Union
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.exceptions import DomainException
from app.db.session import get_db
from app.api.deps import get_current_user, get_optional_current_user
from app.models.enums import OrderStatus
from app.models.order import Order, OrderItem
from app.models.user import User
from app.models.product import Product
from app.schemas.order import (
    OrderCreateRequest,
    OrderResponse,
    PaymentInitResponse,
    OrderReceiptResponse,
    TrackOrderResponse,
    TrackOrderRequest,
    CartItemSchema,
    ShippingAddressSchema,
    TrackingEventSchema,
)
from app.services.order import order_service

router = APIRouter(prefix="/orders", tags=["Orders & Payments"])

_TOMAN = 10


def _build_receipt_response(order: Order) -> OrderReceiptResponse:
    items = []
    for it in order.items:
        items.append(
            CartItemSchema(
                id=str(it.id),
                productId=it.product_id or 1,
                variantId=1,
                title=it.product_title,
                slug=it.product_slug or "product",
                size=it.size or "Free",
                color=it.color,
                price=int(it.unit_price_rial // _TOMAN),
                quantity=it.quantity,
                maxStock=10,
                image=it.image or "",
            )
        )

    shipping_addr = ShippingAddressSchema(
        fullName=order.customer_name,
        phoneNumber=order.phone_number,
        province=order.province,
        city=order.city,
        postalCode=order.postal_code,
        exactAddress=order.postal_address,
        buildingNumber=order.building_number,
        unit=order.unit,
        notes=order.notes,
    )

    return OrderReceiptResponse(
        orderNumber=order.order_number,
        items=items,
        shippingAddress=shipping_addr,
        shippingMethod=order.shipping_method,
        paymentMethod=order.payment_method,
        subtotal=int(order.subtotal_amount_rial // _TOMAN),
        discount=int(order.discount_amount_rial // _TOMAN),
        shippingCost=int(order.shipping_cost_rial // _TOMAN),
        finalTotal=int(order.total_amount_rial // _TOMAN),
        paymentStatus="completed" if order.status == OrderStatus.PROCESSING else "pending",
        createdAt=order.created_at.isoformat() if order.created_at else datetime.now(timezone.utc).isoformat(),
        estimatedDelivery=order.estimated_delivery or "۲ تا ۴ روز کاری آینده",
    )


def _build_tracking_response(order: Order) -> TrackOrderResponse:
    timeline_items = order.timeline or [
        {
            "status": "registered",
            "title": "ثبت و تأیید سفارش",
            "description": "سفارش با موفقیت در سامانه کراس ثبت شد.",
            "timestamp": "۱۴۰۵/۰۷/۱۰ - ۱۰:۱۵",
            "location": "سامانه مرکزی کراس",
            "completed": True,
        },
        {
            "status": "processing",
            "title": "بسته‌بندی و کنترل کیفیت",
            "description": "اقلام سفارش بررسی کیفی شده و در جعبه اختصاصی قرار گرفتند.",
            "timestamp": "۱۴۰۵/۰۷/۱۱ - ۱۴:۳۰",
            "location": "آتلیه کراس تهران",
            "completed": order.status in (OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED),
        },
        {
            "status": "handed_over",
            "title": "تحویل به ناوگان پست",
            "description": "مرسوله تحویل باجه پستی شد و بارکد صادر گردید.",
            "timestamp": "۱۴۰۵/۰۷/۱۲ - ۰۹:۰۰",
            "location": "مرکز مبادلات پست تهران",
            "completed": order.status in (OrderStatus.SHIPPED, OrderStatus.DELIVERED),
        },
        {
            "status": "delivered",
            "title": "تحویل نهایی به خریدار",
            "description": "مرسوله با امضای تحویل‌گیرنده تحویل داده شد.",
            "timestamp": "۱۴۰۵/۰۷/۱۳ - ۱۱:۴۵",
            "location": f"{order.city}، مقصد",
            "completed": order.status == OrderStatus.DELIVERED,
        },
    ]

    items = []
    for it in order.items:
        items.append({
            "title": it.product_title,
            "size": it.size or "Free",
            "color": it.color,
            "quantity": it.quantity,
            "price": int(it.unit_price_rial // _TOMAN),
            "image": it.image or "",
        })

    status_str = "pending"
    if order.status == OrderStatus.PROCESSING:
        status_str = "processing"
    elif order.status == OrderStatus.SHIPPED:
        status_str = "handed_over"
    elif order.status == OrderStatus.DELIVERED:
        status_str = "delivered"
    elif order.status == OrderStatus.CANCELLED:
        status_str = "canceled"

    return TrackOrderResponse(
        orderNumber=order.order_number,
        createdAt=order.created_at.isoformat() if order.created_at else "",
        status=status_str,
        statusLabel=order.status_label or "در حال پردازش",
        recipientName=order.customer_name,
        recipientPhone=order.phone_number,
        shippingAddress=f"{order.province}، {order.city}، {order.postal_address}",
        trackingCode=order.tracking_code or "982341908234123456789012",
        carrier=order.shipping_provider or "شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)",
        estimatedDelivery=order.estimated_delivery or "۲ تا ۴ روز کاری آینده",
        timeline=[TrackingEventSchema(**ev) for ev in timeline_items],
        items=items,
        totalAmount=int(order.total_amount_rial // _TOMAN),
        postalCode=order.postal_code,
        paymentMethod=order.payment_method,
        notes=order.notes,
    )


@router.post(
    "/create",
    response_model=OrderReceiptResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Order (Nuxt Frontend Contract)",
)
async def create_order_frontend(
    payload: OrderCreateRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not payload.items or len(payload.items) == 0:
        raise DomainException(
            message="سبد خرید شما برای ثبت سفارش خالی است.",
            code="EMPTY_CART",
            status_code=400,
        )

    addr = payload.shippingAddress
    if not addr:
        raise DomainException(
            message="اطلاعات آدرس تحویل‌گیرنده الزامی است.",
            code="MISSING_ADDRESS",
            status_code=400,
        )

    # Find or create user
    user = current_user
    if not user:
        phone = addr.phoneNumber.strip()
        res = await db.execute(select(User).where(User.phone == phone))
        user = res.scalar_one_or_none()
        if not user:
            user = User(
                phone=phone,
                full_name=addr.fullName,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

    order_num = f"KERAS-{str(uuid.uuid4().int)[:6]}"
    subtotal_toman = sum(it.price * it.quantity for it in payload.items)
    discount_toman = payload.couponDiscount or 0
    shipping_fee_toman = 0 if subtotal_toman >= 1500000 else 65000
    final_total_toman = max(0, subtotal_toman - discount_toman + shipping_fee_toman)

    order = Order(
        order_number=order_num,
        user_id=user.id,
        customer_name=addr.fullName,
        phone_number=addr.phoneNumber,
        province=addr.province,
        city=addr.city,
        postal_address=addr.exactAddress,
        postal_code=addr.postalCode,
        building_number=addr.buildingNumber,
        unit=addr.unit,
        notes=addr.notes,
        subtotal_amount_rial=subtotal_toman * _TOMAN,
        discount_amount_rial=discount_toman * _TOMAN,
        shipping_cost_rial=shipping_fee_toman * _TOMAN,
        total_amount_rial=final_total_toman * _TOMAN,
        status=OrderStatus.PENDING,
        status_label="در انتظار پرداخت",
        shipping_method=payload.shippingMethod or "standard",
        payment_method=payload.paymentMethod or "online_gateway",
        tracking_code=f"TRK-{str(uuid.uuid4().int)[:12]}",
    )
    db.add(order)
    await db.flush()

    for it in payload.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=it.productId if isinstance(it.productId, int) else None,
            product_slug=it.slug,
            product_title=it.title,
            variant_title=f"{it.color or ''} / {it.size or ''}".strip(" /"),
            size=it.size,
            color=it.color,
            image=it.image,
            quantity=it.quantity,
            unit_price_rial=it.price * _TOMAN,
            total_price_rial=it.price * it.quantity * _TOMAN,
        )
        db.add(order_item)

    await db.commit()
    res = await db.execute(select(Order).where(Order.id == order.id).options(selectinload(Order.items)))
    created_order = res.scalar_one()

    return _build_receipt_response(created_order)


@router.post(
    "/track",
    response_model=TrackOrderResponse,
    status_code=status.HTTP_200_OK,
    summary="Track Order by Number or Tracking Code",
)
async def track_order(
    payload: TrackOrderRequest,
    db: AsyncSession = Depends(get_db),
):
    query = payload.get_query()
    if not query:
        raise DomainException(
            message="لطفاً شماره سفارش یا شماره تلفن همراه را وارد نمایید.",
            code="INVALID_QUERY",
            status_code=422,
        )

    stmt = (
        select(Order)
        .where(
            or_(
                Order.order_number == query,
                Order.tracking_code == query,
                Order.phone_number == query,
            )
        )
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .limit(1)
    )
    res = await db.execute(stmt)
    order = res.scalar_one_or_none()

    if not order:
        raise DomainException(
            message="سفارشی با این مشخصات یافت نشد.",
            code="ORDER_NOT_FOUND",
            status_code=404,
        )

    return _build_tracking_response(order)


@router.get(
    "/{order_identifier}",
    response_model=Union[OrderReceiptResponse, OrderResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Order By Number or ID",
)
async def get_order_by_identifier(
    order_identifier: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Order)
        .where(
            or_(
                Order.id == order_identifier,
                Order.order_number == order_identifier,
            )
        )
        .options(selectinload(Order.items))
    )
    res = await db.execute(stmt)
    order = res.scalar_one_or_none()

    if not order:
        raise DomainException(
            message="سفارش یافت نشد.",
            code="ORDER_NOT_FOUND",
            status_code=404,
        )

    # Return receipt format if queried by order_number (e.g. KERAS-...)
    if order.order_number == order_identifier:
        return _build_receipt_response(order)

    return OrderResponse.model_validate(order)


@router.post(
    "/checkout",
    response_model=PaymentInitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Legacy Create Order & Initialize Payment Gateway",
)
async def create_checkout(
    payload: OrderCreateRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    frontend_url = settings.FRONTEND_URL.rstrip("/")
    callback_url = f"{frontend_url}/payment/callback"

    result = await order_service.create_order_and_checkout(
        db=db,
        user=current_user,
        request_data=payload,
        base_callback_url=callback_url,
    )

    return PaymentInitResponse(**result)