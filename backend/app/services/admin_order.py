import math
from datetime import timezone
from typing import Optional, Tuple, List

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import DomainException
from app.models.enums import OrderStatus, PaymentStatus
from app.models.order import Order, PaymentTransaction
from app.models.product import ProductVariant
from app.schemas.admin_order import (
    AdminOrderFilterParams,
    OrderStatusUpdateRequest,
    RefundOrderRequest,
    TrackingCodeUpdateRequest,
)


class AdminOrderService:

    @staticmethod
    async def list_orders(
        db: AsyncSession, params: AdminOrderFilterParams
    ) -> Tuple[List[Order], int]:
        """
        Lists orders with pagination, search, city, date range, and status filters.
        """
        stmt = select(Order).options(selectinload(Order.items))
        count_stmt = select(func.count(Order.id))

        # Filter by status
        if params.status:
            stmt = stmt.where(Order.status == params.status)
            count_stmt = count_stmt.where(Order.status == params.status)

        # Filter by payment status (EXISTS subquery over the payment audit log)
        if params.payment_status:
            payment_clause = Order.payments.any(
                PaymentTransaction.status == params.payment_status
            )
            stmt = stmt.where(payment_clause)
            count_stmt = count_stmt.where(payment_clause)

        # Filter by city
        if params.city and params.city.strip():
            city_term = f"%{params.city.strip()}%"
            stmt = stmt.where(Order.city.ilike(city_term))
            count_stmt = count_stmt.where(Order.city.ilike(city_term))

        # Filter by date range
        if params.start_date:
            start_date = params.start_date
            if start_date.tzinfo is None:
                start_date = start_date.replace(tzinfo=timezone.utc)
            stmt = stmt.where(Order.created_at >= start_date)
            count_stmt = count_stmt.where(Order.created_at >= start_date)
        if params.end_date:
            end_date = params.end_date
            if end_date.tzinfo is None:
                end_date = end_date.replace(tzinfo=timezone.utc)
            stmt = stmt.where(Order.created_at <= end_date)
            count_stmt = count_stmt.where(Order.created_at <= end_date)

        # Search by order_number, customer_name, or phone_number
        if params.search and params.search.strip():
            pattern = f"%{params.search.strip()}%"
            search_clause = or_(
                Order.order_number.ilike(pattern),
                Order.customer_name.ilike(pattern),
                Order.phone_number.ilike(pattern),
            )
            stmt = stmt.where(search_clause)
            count_stmt = count_stmt.where(search_clause)

        # Count total records
        total_res = await db.execute(count_stmt)
        total = total_res.scalar() or 0

        # Pagination & Sorting
        offset = (params.page - 1) * params.limit
        stmt = stmt.order_by(Order.created_at.desc()).offset(offset).limit(params.limit)

        res = await db.execute(stmt)
        orders = res.scalars().unique().all()

        return list(orders), total

    @staticmethod
    async def get_order_by_id(db: AsyncSession, order_id: str) -> Order:
        stmt = (
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.items))
        )
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()

        if not order:
            raise DomainException(
                message=f"Order '{order_id}' not found.",
                code="ORDER_NOT_FOUND",
                status_code=404,
            )
        return order

    @staticmethod
    async def update_status(
        db: AsyncSession, order_id: str, payload: OrderStatusUpdateRequest
    ) -> Order:
        """
        Updates order status with validation for illegal state transitions.
        """
        order = await AdminOrderService.get_order_by_id(db, order_id)

        # Guard against modifying completed/cancelled orders
        if order.status in (OrderStatus.CANCELLED, OrderStatus.DELIVERED):
            raise DomainException(
                message=f"Cannot change status of an order that is already {order.status.value}.",
                code="INVALID_STATUS_TRANSITION",
                status_code=400,
            )

        order.status = payload.status
        await db.commit()

        # Re-fetch with items eager-loaded: db.refresh() expires the already
        # loaded relationships and lazy-loading is unavailable in async sessions.
        return await AdminOrderService.get_order_by_id(db, order_id)

    @staticmethod
    async def attach_tracking_code(
        db: AsyncSession, order_id: str, payload: TrackingCodeUpdateRequest
    ) -> Order:
        """
        Appends shipment tracking code and marks status as SHIPPED if currently PROCESSING.
        """
        order = await AdminOrderService.get_order_by_id(db, order_id)

        if order.status == OrderStatus.CANCELLED:
            raise DomainException(
                message="Cannot attach tracking code to a cancelled order.",
                code="ORDER_CANCELLED",
                status_code=400,
            )

        order.tracking_code = payload.tracking_code
        order.shipping_provider = payload.shipping_provider

        # Auto-advance status if order was waiting to ship
        if order.status == OrderStatus.PROCESSING:
            order.status = OrderStatus.SHIPPED

        await db.commit()

        # Re-fetch with items eager-loaded (refresh() would expire them)
        return await AdminOrderService.get_order_by_id(db, order_id)

    @staticmethod
    async def process_refund(
        db: AsyncSession, order_id: str, payload: RefundOrderRequest
    ) -> Order:
        """
        Cancels an active order, updates payment status, and restores product inventory.
        """
        stmt = (
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.items))
            .with_for_update()
        )
        res = await db.execute(stmt)
        order = res.scalar_one_or_none()

        if not order:
            raise DomainException(
                message=f"Order '{order_id}' not found.",
                code="ORDER_NOT_FOUND",
                status_code=404,
            )

        if order.status == OrderStatus.CANCELLED:
            raise DomainException(
                message="Order has already been cancelled and refunded.",
                code="ORDER_ALREADY_CANCELLED",
                status_code=400,
            )

        # 1. Restore stock if requested
        if payload.restore_stock:
            for item in order.items:
                stmt_v = (
                    select(ProductVariant)
                    .where(ProductVariant.id == item.variant_id)
                    .with_for_update()
                )
                res_v = await db.execute(stmt_v)
                variant = res_v.scalar_one_or_none()
                if variant:
                    variant.stock += item.quantity

        # 2. Update payment transaction audit log if exists
        stmt_tx = (
            select(PaymentTransaction)
            .where(PaymentTransaction.order_id == order.id)
            .with_for_update()
        )
        res_tx = await db.execute(stmt_tx)
        tx = res_tx.scalar_one_or_none()
        if tx:
            tx.status = PaymentStatus.REFUNDED

        # 3. Update order state
        order.status = OrderStatus.CANCELLED
        await db.commit()

        # Re-fetch with items eager-loaded (refresh() would expire them)
        return await AdminOrderService.get_order_by_id(db, order_id)


admin_order_service = AdminOrderService()