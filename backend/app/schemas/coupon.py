from datetime import datetime
from typing import Optional
from pydantic import ConfigDict, BaseModel, Field, field_validator
from app.models.enums import DiscountType


class CouponValidateRequest(BaseModel):
    code: str = Field(..., example="KERAS10", description="Promotional coupon code")
    subtotal: Optional[int] = None  # Front-end Nuxt (in Toman)
    cart_total: Optional[int] = None
    cart_subtotal_rial: Optional[int] = None  # Legacy API (in Rials)

    @field_validator("code")
    @classmethod
    def normalize_code(cls, v: str) -> str:
        clean = v.strip().upper()
        if not clean:
            raise ValueError("Coupon code cannot be empty.")
        return clean


class CouponValidateResponse(BaseModel):
    valid: bool = True
    code: str
    discountAmount: int = 0  # in Toman for frontend
    discountPercent: Optional[int] = None
    message: str = "کد تخفیف با موفقیت اعمال شد."

    # Legacy fields
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[int] = None
    discount_amount_rial: Optional[int] = None
    final_subtotal_rial: Optional[int] = None
    is_valid: Optional[bool] = None


class CouponCreateRequest(BaseModel):
    code: str = Field(..., example="WELCOME10")
    discount_type: DiscountType = DiscountType.PERCENTAGE
    discount_value: int = Field(..., gt=0, description="Percentage (1-100) or flat amount in Rials")
    max_discount_amount_rial: Optional[int] = Field(None, description="Cap for percentage discounts")
    min_purchase_amount_rial: Optional[int] = Field(0, description="Minimum order subtotal required")
    usage_limit: Optional[int] = Field(None, description="Total allowed global redemptions")
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: bool = True

    @field_validator("code")
    @classmethod
    def uppercase_code(cls, v: str) -> str:
        return v.strip().upper()


class CouponResponse(CouponCreateRequest):
    id: str
    times_used: int = 0

    model_config = ConfigDict(from_attributes=True)
