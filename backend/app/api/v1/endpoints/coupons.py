from typing import Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.api.deps import get_optional_user
from app.models.user import User
from app.models.coupon import Coupon
from app.models.enums import DiscountType
from app.schemas.coupon import CouponValidateRequest, CouponValidateResponse
from app.core.exceptions import DomainException

router = APIRouter(prefix="/coupons", tags=["Coupons & Discounts"])

_TOMAN = 10


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