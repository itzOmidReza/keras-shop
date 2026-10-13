import csv
import io
import math
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.enums import OrderStatus, PaymentStatus
from app.models.user import User
from app.schemas.admin_order import (
    AdminOrderFilterParams,
    AdminOrderResponse,
    OrderStatusUpdateRequest,
    PaginatedAdminOrderResponse,
    RefundOrderRequest,
    TrackingCodeUpdateRequest,
)
from app.services.admin_order import admin_order_service

router = APIRouter(prefix="/admin/orders", tags=["Admin Orders"])

# Map frontend filter strings to backend OrderStatus enum members
STATUS_ALIAS_MAP = {
    "pending_payment": "pending",
    "paid": "processing",
    "failed": "cancelled",
}


def _resolve_status(status_str: Optional[str]) -> Optional[OrderStatus]:
    if not status_str or status_str == "all":
        return None
    normalized = STATUS_ALIAS_MAP.get(status_str, status_str).lower()
    for member in OrderStatus:
        if member.value.lower() == normalized or member.name.lower() == normalized:
            return member
    return None


@router.get("", response_model=PaginatedAdminOrderResponse)
async def list_orders(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    order_status: Optional[str] = Query(default=None, alias="status"),
    payment_status: Optional[PaymentStatus] = Query(default=None),
    city: Optional[str] = Query(default=None),
    start_date: Optional[datetime] = Query(default=None),
    end_date: Optional[datetime] = Query(default=None),
    search: Optional[str] = Query(default=None),
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    resolved_status = _resolve_status(order_status)

    params = AdminOrderFilterParams(
        page=page,
        limit=limit,
        status=resolved_status,
        payment_status=payment_status,
        city=city,
        start_date=start_date,
        end_date=end_date,
        search=search,
    )
    orders, total = await admin_order_service.list_orders(db, params)
    total_pages = math.ceil(total / limit) if total > 0 else 1

    return PaginatedAdminOrderResponse(
        items=orders,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )

@router.get("/export/csv")
async def export_orders_csv(
    order_status: Optional[str] = Query(default=None, alias="status"),
    payment_status: Optional[PaymentStatus] = Query(default=None),
    city: Optional[str] = Query(default=None),
    start_date: Optional[datetime] = Query(default=None),
    end_date: Optional[datetime] = Query(default=None),
    search: Optional[str] = Query(default=None),
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    resolved_status = _resolve_status(order_status)

    async def csv_generator():
        output = io.StringIO()
        output.write("\ufeff")
        writer = csv.writer(output)
        writer.writerow([
            "شماره سفارش",
            "نام مشتری",
            "شماره همراه",
            "استان",
            "شهر",
            "کد پستی",
            "آدرس کامل",
            "مبلغ کل (تومان)",
            "وضعیت",
            "کد رهگیری پستی",
            "تاریخ ثبت",
        ])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)

        page = 1
        page_size = 1000
        while True:
            params = AdminOrderFilterParams(
                page=page,
                limit=page_size,
                status=resolved_status,
                payment_status=payment_status,
                city=city,
                start_date=start_date,
                end_date=end_date,
                search=search,
            )
            orders, total = await admin_order_service.list_orders(db, params)
            if not orders:
                break

            for o in orders:
                writer.writerow([
                    o.order_number,
                    o.customer_name,
                    o.phone_number,
                    o.province,
                    o.city,
                    o.postal_code,
                    o.postal_address,
                    o.total_amount_rial // 10,
                    getattr(o.status, "value", str(o.status)),
                    o.tracking_code or "",
                    o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "",
                ])
            yield output.getvalue()
            output.seek(0)
            output.truncate(0)

            if page * page_size >= total:
                break
            page += 1

    filename = f"orders_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        csv_generator(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
@router.get("/{order_id}", response_model=AdminOrderResponse)
async def get_order_details(
    order_id: str,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await admin_order_service.get_order_by_id(db, order_id)


@router.patch("/{order_id}/status", response_model=AdminOrderResponse)
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdateRequest,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    # 1. If tracking_code was supplied in the payload, attach it
    if payload.tracking_code:
        tracking_payload = TrackingCodeUpdateRequest(
            tracking_code=payload.tracking_code,
            shipping_provider=payload.shipping_provider or "Iran Post",
        )
        await admin_order_service.attach_tracking_code(db, order_id, tracking_payload)

    # 2. If status was supplied, update status (or advance to shipped if tracking added)
    if payload.status:
        return await admin_order_service.update_status(db, order_id, payload)

    # Return updated order state
    return await admin_order_service.get_order_by_id(db, order_id)


    
@router.put("/{order_id}/tracking", response_model=AdminOrderResponse)
async def append_tracking_code(
    order_id: str,
    payload: TrackingCodeUpdateRequest,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await admin_order_service.attach_tracking_code(db, order_id, payload)


@router.post("/{order_id}/refund", response_model=AdminOrderResponse)
async def process_order_refund(
    order_id: str,
    payload: RefundOrderRequest,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    return await admin_order_service.process_refund(db, order_id, payload)