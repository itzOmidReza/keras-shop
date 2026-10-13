from typing import List, Optional
from sqlalchemy import (
    String,
    Text,
    BigInteger,
    Integer,
    Boolean,
    Float,
    ForeignKey,
    CheckConstraint,
    Enum as SQLEnum,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import FulfillmentType


class Category(Base):
    __tablename__ = "categories"

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parent_id: Mapped[Optional[str]] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    title: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category_id: Mapped[Optional[str]] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    images: Mapped[str] = mapped_column(Text, nullable=False)  # Comma-separated or JSON list of URLs
    base_price_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)
    compare_at_price_rial: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    fulfillment_type: Mapped[FulfillmentType] = mapped_column(
        SQLEnum(FulfillmentType, name="fulfillment_type_enum"),
        default=FulfillmentType.STANDARD,
        nullable=False,
    )

    # Keras Fashion Extensions
    numeric_id: Mapped[Optional[int]] = mapped_column(Integer, unique=True, index=True, nullable=True)
    brand: Mapped[Optional[str]] = mapped_column(String(100), default="keras-atelier", nullable=True)
    division: Mapped[str] = mapped_column(String(50), default="apparel", nullable=False)  # apparel | accessories
    season: Mapped[str] = mapped_column(String(50), default="fall-1405", nullable=False)
    badge: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    line: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # move | calm
    fit_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    fabric: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # {composition, gsm, care}
    fabric_composition: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    fabric_gsm: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    stretch: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    softness: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    opacity: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    has_transparency_test: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    rating_avg: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    rating_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sizes: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list, nullable=True)
    available_sizes: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list, nullable=True)
    colors: Mapped[Optional[List[dict]]] = mapped_column(JSON, default=list, nullable=True)
    size_chart: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    activities: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list, nullable=True)

    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="products")
    variants: Mapped[List["ProductVariant"]] = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"
    __table_args__ = (
        CheckConstraint("stock >= 0", name="check_stock_non_negative"),
    )

    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    sku: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    price_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)
    compare_at_price_rial: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reserved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Fashion variant fields
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    color_hex: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    numeric_id: Mapped[Optional[int]] = mapped_column(Integer, unique=True, index=True, nullable=True)
    
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    fulfillment_type: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # in_stock | dropship | pre_order
    supplier_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="variants")