import uuid
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.db.session import get_db
from app.api.deps import get_optional_user
from app.models.user import User
from app.models.coupon import Coupon
from app.models.enums import DiscountType
from app.schemas.coupon import CouponValidateRequest, CouponValidateResponse
from app.core.exceptions import DomainException

router = APIRouter(prefix="/coupons", tags=["Coupons & Discounts"])

_TOMAN = 10


def _is_valid_uuid(val: Any) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, TypeError, AttributeError):
        return False


def _map_coupon_to_dict(c: Coupon) -> dict:
    return {
        "id": str(c.id),
        "code": c.code,
        "type": "percent" if c.discount_type == DiscountType.PERCENTAGE else "fixed",
        "value": c.discount_value if c.discount_type == DiscountType.PERCENTAGE else (c.discount_value // _TOMAN),
        "minOrder": c.min_purchase_amount_rial // _TOMAN if c.min_purchase_amount_rial else 0,
        "maxDiscount": c.max_discount_amount_rial // _TOMAN if c.max_discount_amount_rial else 0,
        "expiresAt": "۱۴۰۵/۱۲/۲۹",
        "usedCount": c.times_used,
        "limit": c.usage_limit or 100,
        "isActive": c.is_active,
    }


@router.post(
    "/validate",
    response_model=CouponValidateResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate Coupon Code",
)
async def validate_coupon(
    payload: CouponValidateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    code = payload.code.strip().upper()
    subtotal_toman = payload.subtotal or payload.cart_total or (payload.cart_subtotal_rial // _TOMAN if payload.cart_subtotal_rial else 0)

    if subtotal_toman <= 0:
        raise DomainException(
            message="سبد خرید شما خالی است.",
            code="EMPTY_CART",
            status_code=400,
        )

    # First check database for dynamic coupon
    stmt = select(Coupon).where(Coupon.code == code, Coupon.is_active == True)
    res = await db.execute(stmt)
    db_coupon = res.scalar_one_or_none()

    if db_coupon:
        if db_coupon.min_purchase_amount_rial and (subtotal_toman * _TOMAN) < db_coupon.min_purchase_amount_rial:
            min_toman = int(db_coupon.min_purchase_amount_rial // _TOMAN)
            raise DomainException(
                message=f"حداقل مبلغ خرید برای این کد تخفیف {min_toman:,} تومان است.",
                code="MIN_PURCHASE_NOT_MET",
                status_code=400,
            )

        if db_coupon.discount_type == DiscountType.PERCENTAGE:
            discount_toman = int(round(subtotal_toman * (db_coupon.discount_value / 100.0)))
            if db_coupon.max_discount_amount_rial:
                max_t = int(db_coupon.max_discount_amount_rial // _TOMAN)
                discount_toman = min(discount_toman, max_t)
            return CouponValidateResponse(
                valid=True,
                code=db_coupon.code,
                discountAmount=discount_toman,
                discountPercent=db_coupon.discount_value,
                message=f"کد تخفیف {db_coupon.discount_value} درصدی با موفقیت اعمال شد.",
            )
        else:
            discount_toman = int(db_coupon.discount_value // _TOMAN)
            return CouponValidateResponse(
                valid=True,
                code=db_coupon.code,
                discountAmount=discount_toman,
                message="کد تخفیف با موفقیت اعمال شد.",
            )

    # Built-in standard mock/campaign coupons
    if code == "KERAS10":
        discount_amount = int(round(subtotal_toman * 0.1))
        return CouponValidateResponse(
            valid=True,
            code="KERAS10",
            discountAmount=discount_amount,
            discountPercent=10,
            message="کد تخفیف ۱۰ درصدی باشگاه کراس با موفقیت اعمال شد.",
        )
    elif code == "WELCOME":
        if subtotal_toman < 500000:
            raise DomainException(
                message="حداقل مبلغ خرید برای کد تخفیف خوش‌آمدگویی ۵۰۰,۰۰۰ تومان است.",
                code="MIN_PURCHASE_NOT_MET",
                status_code=400,
            )
        return CouponValidateResponse(
            valid=True,
            code="WELCOME",
            discountAmount=100000,
            message="تخفیف ۱۰۰,۰۰۰ تومانی خوش‌آمدگویی اعمال شد.",
        )
    elif code == "KERAS20":
        if subtotal_toman < 2000000:
            raise DomainException(
                message="حداقل مبلغ خرید برای کد تخفیف ۲۰ درصدی ۲,۰۰۰,۰۰۰ تومان است.",
                code="MIN_PURCHASE_NOT_MET",
                status_code=400,
            )
        discount_amount = int(round(subtotal_toman * 0.2))
        return CouponValidateResponse(
            valid=True,
            code="KERAS20",
            discountAmount=discount_amount,
            discountPercent=20,
            message="کد تخفیف ۲۰ درصدی خریدهای ویژه اعمال شد.",
        )

    raise DomainException(
        message="کد تخفیف وارد شده معتبر نمی‌باشد یا منقضی شده است.",
        code="INVALID_COUPON",
        status_code=400,
    )


@router.get(
    "",
    response_model=List[dict],
    status_code=status.HTTP_200_OK,
    summary="List all coupons",
)
async def list_coupons(
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Coupon).order_by(Coupon.created_at.desc())
    res = await db.execute(stmt)
    coupons = res.scalars().all()

    if not coupons:
        # Seed standard boutique coupons if table is empty
        seed_data = [
            Coupon(
                code="KERAS-PRO",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=20,
                min_purchase_amount_rial=2000000 * _TOMAN,
                max_discount_amount_rial=800000 * _TOMAN,
                usage_limit=100,
                times_used=42,
                is_active=True,
            ),
            Coupon(
                code="SUMMER1405",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=15,
                min_purchase_amount_rial=1500000 * _TOMAN,
                max_discount_amount_rial=600000 * _TOMAN,
                usage_limit=150,
                times_used=88,
                is_active=True,
            ),
            Coupon(
                code="VIP-ATELIER",
                discount_type=DiscountType.FIXED_TOMAN,
                discount_value=500000 * _TOMAN,
                min_purchase_amount_rial=4000000 * _TOMAN,
                max_discount_amount_rial=500000 * _TOMAN,
                usage_limit=50,
                times_used=15,
                is_active=True,
            ),
            Coupon(
                code="WELCOME-KERAS",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=10,
                min_purchase_amount_rial=1000000 * _TOMAN,
                max_discount_amount_rial=300000 * _TOMAN,
                usage_limit=500,
                times_used=230,
                is_active=True,
            ),
        ]
        for sc in seed_data:
            db.add(sc)
        await db.commit()
        stmt = select(Coupon).order_by(Coupon.created_at.desc())
        res = await db.execute(stmt)
        coupons = res.scalars().all()

    return [_map_coupon_to_dict(c) for c in coupons]


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create Coupon",
)
async def create_coupon(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    code = (payload.get("code") or "").strip().upper()
    if not code:
        raise DomainException(message="کد کوپن الزامی است.", code="CODE_REQUIRED", status_code=400)

    existing = await db.execute(select(Coupon).where(Coupon.code == code))
    if existing.scalar_one_or_none():
        raise DomainException(message="کوپن با این کد قبلاً ثبت شده است.", code="COUPON_EXISTS", status_code=400)

    is_percent = payload.get("type") == "percent"
    val = int(payload.get("value") or 10)
    min_order = int(payload.get("minOrder") or 0)
    max_disc = int(payload.get("maxDiscount") or 0)
    limit = int(payload.get("limit") or 100)

    coupon = Coupon(
        code=code,
        discount_type=DiscountType.PERCENTAGE if is_percent else DiscountType.FIXED_TOMAN,
        discount_value=val if is_percent else (val * _TOMAN),
        min_purchase_amount_rial=min_order * _TOMAN,
        max_discount_amount_rial=max_disc * _TOMAN if max_disc else None,
        usage_limit=limit,
        times_used=0,
        is_active=True,
    )
    db.add(coupon)
    await db.commit()
    await db.refresh(coupon)
    return _map_coupon_to_dict(coupon)


@router.patch(
    "/{coupon_id}/toggle",
    status_code=status.HTTP_200_OK,
    summary="Toggle Coupon Active State",
)
async def toggle_coupon(
    coupon_id: str,
    db: AsyncSession = Depends(get_db),
):
    conditions = [Coupon.code == coupon_id]
    if _is_valid_uuid(coupon_id):
        conditions.append(Coupon.id == coupon_id)
    res = await db.execute(select(Coupon).where(or_(*conditions)))
    coupon = res.scalar_one_or_none()
    if not coupon:
        raise DomainException(message="کوپن یافت نشد.", code="NOT_FOUND", status_code=404)

    coupon.is_active = not coupon.is_active
    await db.commit()
    await db.refresh(coupon)
    return _map_coupon_to_dict(coupon)


@router.delete(
    "/{coupon_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Coupon",
)
async def delete_coupon(
    coupon_id: str,
    db: AsyncSession = Depends(get_db),
):
    conditions = [Coupon.code == coupon_id]
    if _is_valid_uuid(coupon_id):
        conditions.append(Coupon.id == coupon_id)
    res = await db.execute(select(Coupon).where(or_(*conditions)))
    coupon = res.scalar_one_or_none()
    if coupon:
        await db.delete(coupon)
        await db.commit()
    return {"success": True, "message": "کد تخفیف با موفقیت حذف شد."}