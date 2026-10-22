from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import (
    String,
    BigInteger,
    Integer,
    Boolean,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Table,
    Column,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import DiscountType

if TYPE_CHECKING:
    from app.models.product import Category, Product

# Association table for campaigns targeting specific products
campaign_products = Table(
    "campaign_products",
    Base.metadata,
    Column("campaign_id", UUID(as_uuid=False), ForeignKey("campaigns.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", UUID(as_uuid=False), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True, index=True),
)

# Association table for campaigns targeting whole categories
campaign_categories = Table(
    "campaign_categories",
    Base.metadata,
    Column("campaign_id", UUID(as_uuid=False), ForeignKey("campaigns.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", UUID(as_uuid=False), ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True, index=True),
)


class Campaign(Base):
    __tablename__ = "campaigns"

    title: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    banner_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    discount_type: Mapped[DiscountType] = mapped_column(
        SQLEnum(DiscountType, name="discount_type_enum"),
        nullable=False,
    )
    discount_value: Mapped[int] = mapped_column(BigInteger, nullable=False)  # e.g., 20% or 50,000 Tomans
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    products: Mapped[List["Product"]] = relationship(
        "Product", secondary=campaign_products, backref="campaigns", lazy="selectin"
    )
    categories: Mapped[List["Category"]] = relationship(
        "Category", secondary=campaign_categories, backref="campaigns", lazy="selectin"
    )

