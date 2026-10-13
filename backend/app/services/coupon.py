from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.coupon import Coupon
from app.models.enums import DiscountType
from app.schemas.coupon import CouponValidateRequest, CouponValidateResponse
from app.core.exceptions import DomainException


class CouponService:

    @staticmethod
    async def validate_and_calculate(
        db: AsyncSession, request_data: CouponValidateRequest
    ) -> Tuple[Coupon, int]:
        """
        Validates coupon code criteria (active status, expiration dates, min spend, usage limit)
        and computes the exact discount amount in Rials.
        
        Returns: (Coupon entity, discount_amount_rial)
        """
        code = request_data.code
        subtotal = request_data.cart_subtotal_rial

        # 1. Fetch Coupon Code
        stmt = select(Coupon).where(Coupon.code == code)
        result = await db.execute(stmt)
        coupon = result.scalar_one_or_none()

        if not coupon or not coupon.is_active:
            raise DomainException(
                message="Invalid or expired promotional code.",
                code="INVALID_COUPON",
                status_code=400,
            )

        now = datetime.now(timezone.utc)

        def _aware(dt: Optional[datetime]) -> Optional[datetime]:
            """Normalize DB datetimes to timezone-aware UTC for safe comparison."""
            if dt is not None and dt.tzinfo is None:
                return dt.replace(tzinfo=timezone.utc)
            return dt

        # 2. Check Validity Window
        valid_from = _aware(coupon.valid_from)
        if valid_from and valid_from > now:
            raise DomainException(
                message="Promotional code is not active yet.",
                code="COUPON_NOT_STARTED",
                status_code=400,
            )

        valid_until = _aware(coupon.valid_until)
        if valid_until and valid_until < now:
            raise DomainException(
                message="Promotional code has expired.",
                code="COUPON_EXPIRED",
                status_code=400,
            )

        # 3. Check Global Usage Limit
        if coupon.usage_limit is not None and coupon.times_used >= coupon.usage_limit:
            raise DomainException(
                message="Promotional code has reached its maximum redemptions.",
                code="COUPON_USAGE_EXHAUSTED",
                status_code=400,
            )

        # 4. Minimum Order Threshold Guardrail
        if coupon.min_purchase_amount_rial and subtotal < coupon.min_purchase_amount_rial:
            min_toman = coupon.min_purchase_amount_rial // 10
            raise DomainException(
                message=f"Cart subtotal must be at least {min_toman:,} Tomans to apply this coupon.",
                code="MIN_SPEND_NOT_MET",
                status_code=400,
            )

        # 5. Compute Discount Amount
        if coupon.discount_type == DiscountType.FIXED_TOMAN:
            # FIXED_TOMAN value is in Tomans; convert to Rials for financial calculations
            discount_amount = min(coupon.discount_value * 10, subtotal)
        elif coupon.discount_type == DiscountType.PERCENTAGE:
            raw_discount = (subtotal * coupon.discount_value) // 100
            if coupon.max_discount_amount_rial:
                discount_amount = min(raw_discount, coupon.max_discount_amount_rial)
            else:
                discount_amount = raw_discount
        else:
            discount_amount = 0

        # Safety clamp: a discount can never be negative or exceed the subtotal
        # (guards against bad DB rows, e.g. a percentage coupon with value > 100)
        discount_amount = max(0, min(discount_amount, subtotal))

        return coupon, discount_amount

    @staticmethod
    async def increment_usage(db: AsyncSession, coupon_id: str) -> None:
        """
        Increments times_used count when an order is successfully committed.
        """
        stmt = select(Coupon).where(Coupon.id == coupon_id)
        res = await db.execute(stmt)
        coupon = res.scalar_one_or_none()
        if coupon:
            coupon.times_used += 1


coupon_service = CouponService()