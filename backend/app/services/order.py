import uuid
from typing import Any, Dict, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.exceptions import DomainException
from app.models.enums import OrderStatus, PaymentProvider, PaymentStatus
from app.models.order import Order, OrderItem, PaymentTransaction
from app.models.product import ProductVariant
from app.models.user import Address, User
from app.schemas.coupon import CouponValidateRequest
from app.schemas.order import OrderCreateRequest
from app.services.coupon import coupon_service
from app.services.payment import payment_service


class OrderService:

    @staticmethod
    async def create_order_and_checkout(
        db: AsyncSession,
        user: User,
        request_data: OrderCreateRequest,
        base_callback_url: str,
    ) -> Dict[str, Any]:
        receiver_name = ""
        receiver_phone = ""
        province = ""
        city = ""
        postal_address = ""
        postal_code = ""

        if request_data.address_id:
            stmt_addr = select(Address).where(
                Address.id == request_data.address_id, Address.user_id == user.id
            )
            res_addr = await db.execute(stmt_addr)
            address = res_addr.scalar_one_or_none()
            if not address:
                raise DomainException(
                    message="Specified shipping address not found.",
                    code="ADDRESS_NOT_FOUND",
                    status_code=404,
                )
            receiver_name = address.receiver_name
            receiver_phone = address.receiver_phone
            province = address.province
            city = address.city
            postal_address = address.postal_address
            postal_code = address.postal_code
        else:
            receiver_name = (
                request_data.customer_name
                or user.full_name
                or f"{user.first_name or ''} {user.last_name or ''}".strip()
                or "مشتری"
            )
            receiver_phone = (request_data.phone_number or user.phone or "").strip()
            province = (request_data.province or "").strip()
            city = (request_data.city or "").strip()
            postal_address = (request_data.postal_address or request_data.address or "").strip()
            postal_code = (request_data.postal_code or "").strip()

            if not postal_address or not province or not city:
                raise DomainException(
                    message="Please provide a complete shipping address (province, city, and street address).",
                    code="INCOMPLETE_ADDRESS",
                    status_code=400,
                )
            if not receiver_phone:
                raise DomainException(
                    message="Please provide a valid receiver contact phone number.",
                    code="INVALID_PHONE",
                    status_code=400,
                )

        subtotal_rial = 0
        order_items = []
        variant_ids = [item.variant_id for item in request_data.items]

        # Lock rows in DB
        stmt_variants = (
            select(ProductVariant)
            .where(ProductVariant.id.in_(variant_ids))
            .options(selectinload(ProductVariant.product))
            .with_for_update()
        )
        res_variants = await db.execute(stmt_variants)
        variants_map = {v.id: v for v in res_variants.scalars().all()}

        for item in request_data.items:
            variant = variants_map.get(item.variant_id)
            if not variant:
                raise DomainException(
                    message=f"Variant ID {item.variant_id} does not exist.",
                    code="VARIANT_NOT_FOUND",
                    status_code=400,
                )

            if variant.stock < item.quantity:
                raise DomainException(
                    message=f"Insufficient inventory for '{variant.title}'. Available: {variant.stock}",
                    code="INSUFFICIENT_STOCK",
                    status_code=400,
                )

            variant.stock -= item.quantity
            item_total = variant.price_rial * item.quantity
            subtotal_rial += item_total

            order_items.append(
                OrderItem(
                    variant_id=variant.id,
                    product_title=variant.product.title if variant.product else "Product",
                    variant_title=variant.title,
                    quantity=item.quantity,
                    unit_price_rial=variant.price_rial,
                    total_price_rial=item_total,
                )
            )

        discount_amount_rial = 0
        coupon_entity = None

        if request_data.coupon_code:
            val_req = CouponValidateRequest(
                code=request_data.coupon_code,
                cart_subtotal_rial=subtotal_rial,
            )
            coupon_entity, discount_amount_rial = await coupon_service.validate_and_calculate(
                db, val_req
            )

        from app.core.config import FREE_SHIPPING_THRESHOLD_RIAL
        shipping_method = (request_data.shipping_method or "pishtaz").lower()
        if shipping_method == "free":
            if subtotal_rial < FREE_SHIPPING_THRESHOLD_RIAL:
                raise DomainException(
                    message="سبد خرید به حد نصاب ارسال رایگان نرسیده است.",
                    code="FREE_SHIPPING_NOT_ELIGIBLE",
                    status_code=400,
                )
            shipping_cost_rial = 0
        elif subtotal_rial >= FREE_SHIPPING_THRESHOLD_RIAL:
            shipping_cost_rial = 0
        elif shipping_method == "tipax":
            shipping_cost_rial = 600_000
        else:
            shipping_cost_rial = 500_000
        total_amount_rial = max(0, (subtotal_rial - discount_amount_rial)) + shipping_cost_rial

        if coupon_entity:
            coupon_entity.times_used += 1

        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order(
            order_number=order_number,
            user_id=user.id,
            customer_name=receiver_name,
            phone_number=receiver_phone,
            province=province,
            city=city,
            postal_address=postal_address,
            postal_code=postal_code,
            subtotal_amount_rial=subtotal_rial,
            discount_amount_rial=discount_amount_rial,
            shipping_cost_rial=shipping_cost_rial,
            total_amount_rial=total_amount_rial,
            status=OrderStatus.PENDING,
            shipping_method=request_data.shipping_method,
            items=order_items,
        )
        db.add(order)
        await db.flush()

        # Build clean callback without double question marks
        clean_base = base_callback_url.split("?")[0].rstrip("/")
        final_callback_url = f"{clean_base}?order_id={order.id}"

        # Request payment token from SEP
        token, payment_url = await payment_service.request_payment(
            amount_rial=total_amount_rial,
            res_num=order.order_number,
            callback_url=final_callback_url,
            cell_number=user.phone,
        )

        order.zarinpal_authority = token

        transaction = PaymentTransaction(
            order_id=order.id,
            provider=PaymentProvider.SEP,
            amount_rial=total_amount_rial,
            status=PaymentStatus.PENDING,
            authority=token,
        )
        db.add(transaction)
        await db.commit()

        return {
            "order_id": order.id,
            "order_number": order.order_number,
            "total_amount_rial": total_amount_rial,
            "payment_url": payment_url,
            "authority": token,
        }

    @staticmethod
    async def verify_payment_callback(
        db: AsyncSession,
        order_id: Optional[str] = None,
        authority: Optional[str] = None,
        ref_num: Optional[str] = None,
        res_num: Optional[str] = None,
        state: Optional[str] = "OK",
    ) -> Dict[str, Any]:
        """
        Verifies SEP callback, commits transaction on success, or restores stock on failure.
        """
        # Resolve order
        order = None
        if order_id:
            res = await db.execute(
                select(Order).where(Order.id == order_id).options(selectinload(Order.items)).with_for_update()
            )
            order = res.scalar_one_or_none()
        elif res_num:
            res = await db.execute(
                select(Order).where(Order.order_number == res_num).options(selectinload(Order.items)).with_for_update()
            )
            order = res.scalar_one_or_none()
        elif authority:
            res = await db.execute(
                select(Order).where(Order.zarinpal_authority == authority).options(selectinload(Order.items)).with_for_update()
            )
            order = res.scalar_one_or_none()

        if not order:
            raise DomainException(
                message="Order record not found.",
                code="ORDER_NOT_FOUND",
                status_code=404,
            )

        if order.status != OrderStatus.PENDING:
            return {
                "success": order.status in (OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED),
                "message": "سفارش قبلاً پردازش شده است.",
                "status": order.status.value,
                "order_number": order.order_number,
                "ref_id": order.zarinpal_ref_id,
            }

        effective_ref_num = ref_num or order.zarinpal_ref_id
        is_user_canceled = state != "OK" or not effective_ref_num

        if is_user_canceled:
            await OrderService._restore_stock_and_fail(db, order, f"SEP state error: {state}")
            return {
                "success": False,
                "message": "پرداخت توسط کاربر لغو شد یا با خطا مواجه گردید.",
                "order_number": order.order_number,
            }

        # Verify against SEP Gateway
        is_success, verified_ref, raw_res = await payment_service.verify_payment(
            ref_num=effective_ref_num,
            expected_amount_rial=order.total_amount_rial,
        )

        stmt_tx = select(PaymentTransaction).where(
            PaymentTransaction.order_id == order.id,
            PaymentTransaction.status == PaymentStatus.PENDING,
        )
        tx = (await db.execute(stmt_tx)).scalars().first()

        if is_success:
            order.status = OrderStatus.PROCESSING
            order.zarinpal_ref_id = verified_ref
            if tx:
                tx.status = PaymentStatus.PAID
                tx.ref_id = verified_ref
                tx.raw_response = str(raw_res)

            await db.commit()
            return {
                "success": True,
                "message": "پرداخت با موفقیت انجام شد.",
                "order_number": order.order_number,
                "ref_id": verified_ref,
            }
        else:
            await OrderService._restore_stock_and_fail(
                db, order, "Gateway payment verification failed", tx, str(raw_res)
            )
            return {
                "success": False,
                "message": "تایید تراکنش در درگاه بانکی با خطا مواجه شد.",
                "order_number": order.order_number,
            }

    @staticmethod
    async def _restore_stock_and_fail(
        db: AsyncSession,
        order: Order,
        reason: str,
        transaction: Optional[PaymentTransaction] = None,
        raw_res: Optional[str] = None,
    ):
        order.status = OrderStatus.CANCELLED
        for item in order.items:
            stmt_v = (
                select(ProductVariant)
                .where(ProductVariant.id == item.variant_id)
                .with_for_update()
            )
            variant = (await db.execute(stmt_v)).scalar_one_or_none()
            if variant:
                variant.stock += item.quantity

        if transaction:
            transaction.status = PaymentStatus.FAILED
            transaction.raw_response = raw_res

        await db.commit()



    @staticmethod
    async def cancel_expired_pending_orders(db: AsyncSession, older_than_minutes: int = 30) -> int:
        """
        Releases reserved stock for PENDING orders older than the cutoff threshold.
        """
        from datetime import datetime, timedelta, timezone
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=older_than_minutes)

        stmt = (
            select(Order)
            .where(Order.status == OrderStatus.PENDING, Order.created_at < cutoff)
            .options(selectinload(Order.items))
            .with_for_update()
        )
        res = await db.execute(stmt)
        expired_orders = res.scalars().all()

        cancelled_count = 0
        for order in expired_orders:
            for item in order.items:
                stmt_v = (
                    select(ProductVariant)
                    .where(ProductVariant.id == item.variant_id)
                    .with_for_update()
                )
                variant = (await db.execute(stmt_v)).scalar_one_or_none()
                if variant:
                    variant.stock += item.quantity

            order.status = OrderStatus.CANCELLED
            cancelled_count += 1

        if cancelled_count > 0:
            await db.commit()

        return cancelled_count


order_service = OrderService()