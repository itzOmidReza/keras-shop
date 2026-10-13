from datetime import datetime
from typing import Optional
from sqlalchemy import String, BigInteger, Integer, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import DiscountType


class Coupon(Base):
    __tablename__ = "coupons"

    code: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    discount_type: Mapped[DiscountType] = mapped_column(
        SQLEnum(DiscountType, name="discount_type_enum"),
        nullable=False,
    )
    discount_value: Mapped[int] = mapped_column(BigInteger, nullable=False)  # Percentage (e.g. 10) or Rial amount
    min_purchase_amount_rial: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    max_discount_amount_rial: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    usage_limit: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    times_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    valid_from: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    valid_until: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)