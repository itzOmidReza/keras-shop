from datetime import datetime
from typing import List, Optional
from pydantic import ConfigDict, BaseModel, Field, field_validator

from app.models.enums import OrderStatus, PaymentStatus

STATUS_ALIAS_MAP = {
    "pending_payment": OrderStatus.PENDING,
    "paid": OrderStatus.PROCESSING,
    "failed": OrderStatus.CANCELLED,
}


def _normalize_order_status(v):
    if v is None or isinstance(v, OrderStatus):
        return v
    if isinstance(v, str):
        v_lower = v.strip().lower()
        if v_lower in STATUS_ALIAS_MAP:
            return STATUS_ALIAS_MAP[v_lower]
        for member in OrderStatus:
            if member.value.lower() == v_lower or member.name.lower() == v_lower:
                return member
    return v


class AdminOrderFilterParams(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    search: Optional[str] = Field(
        default=None,
        description="Search by order number, customer name, or phone number",
    )
    city: Optional[str] = Field(
        default=None,
        description="Filter by recipient city",
    )
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=1000)

    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, v):
        return _normalize_order_status(v)


class OrderStatusUpdateRequest(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_code: Optional[str] = Field(
        default=None, min_length=5, max_length=100, description="Postal tracking code"
    )
    shipping_provider: Optional[str] = Field(
        default="Iran Post", description="Shipping carrier"
    )
    note: Optional[str] = Field(
        default=None, description="Internal admin note regarding status change"
    )

    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, v):
        return _normalize_order_status(v)

    
class TrackingCodeUpdateRequest(BaseModel):
    tracking_code: str = Field(..., min_length=5, max_length=100)
    shipping_provider: Optional[str] = Field(default="Iran Post")


class RefundOrderRequest(BaseModel):
    reason: str = Field(..., min_length=3, max_length=255)
    restore_stock: bool = Field(
        default=True, description="Whether to add items back to variant stock"
    )


class AdminOrderItemResponse(BaseModel):
    variant_id: str
    product_title: str
    variant_title: str
    quantity: int
    unit_price_rial: int
    total_price_rial: int

    model_config = ConfigDict(from_attributes=True)


class AdminOrderResponse(BaseModel):
    id: str
    order_number: str
    user_id: str
    customer_name: str
    phone_number: str
    province: str
    city: str
    postal_address: str
    postal_code: str
    status: OrderStatus
    total_amount_rial: int
    shipping_cost_rial: int
    tracking_code: Optional[str] = None
    shipping_provider: Optional[str] = None
    zarinpal_ref_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[AdminOrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class PaginatedAdminOrderResponse(BaseModel):
    items: List[AdminOrderResponse]
    total: int
    page: int
    limit: int
    total_pages: int