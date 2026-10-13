from typing import List, Optional
from sqlalchemy import String, Text, BigInteger, Integer, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import OrderStatus, PaymentStatus, PaymentProvider


class Order(Base):
    __tablename__ = "orders"

    order_number: Mapped[str] = mapped_column(String(30), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    
    # Snapshot customer details at time of purchase
    customer_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    province: Mapped[str] = mapped_column(String(50), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    postal_address: Mapped[str] = mapped_column(String(500), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(10), nullable=False)
    building_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Financial breakdown (in Rials)
    subtotal_amount_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)
    discount_amount_rial: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    shipping_cost_rial: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    total_amount_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)

    status: Mapped[OrderStatus] = mapped_column(
        SQLEnum(OrderStatus, name="order_status_enum"),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True,
    )
    status_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    shipping_method: Mapped[str] = mapped_column(String(50), default="standard", nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), default="online_gateway", nullable=False)
    
    # Payment gateway reference
    zarinpal_authority: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    zarinpal_ref_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Fulfillment tracking
    tracking_code: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    shipping_provider: Mapped[Optional[str]] = mapped_column(String(100), default="شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)", nullable=True)
    estimated_delivery: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    timeline: Mapped[Optional[List[dict]]] = mapped_column(JSON, default=list, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments: Mapped[List["PaymentTransaction"]] = relationship("PaymentTransaction", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id: Mapped[Optional[str]] = mapped_column(ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    
    product_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    product_slug: Mapped[Optional[str]] = mapped_column(String(220), nullable=True)
    product_title: Mapped[str] = mapped_column(String(200), nullable=False)
    variant_title: Mapped[str] = mapped_column(String(100), nullable=False)
    size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)
    total_price_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)

    order: Mapped["Order"] = relationship("Order", back_populates="items")


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="RESTRICT"), nullable=False, index=True)
    provider: Mapped[PaymentProvider] = mapped_column(
        SQLEnum(PaymentProvider, name="payment_provider_enum"),
        default=PaymentProvider.SEP,
        nullable=False,
    )
    amount_rial: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(PaymentStatus, name="payment_status_enum"),
        default=PaymentStatus.PENDING,
        nullable=False,
    )
    authority: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    ref_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    card_pan: Mapped[Optional[str]] = mapped_column(String(20), nullable=True) # Masked card number
    raw_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Gateway payload audit log
    expires_at: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    callback_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="payments")