from datetime import datetime
from typing import List, Optional, Union, Dict, Any
from pydantic import ConfigDict, BaseModel, Field, field_validator
from app.models.enums import OrderStatus, PaymentStatus


class ShippingAddressSchema(BaseModel):
    fullName: str
    phoneNumber: str
    province: str
    city: str
    postalCode: str
    exactAddress: str
    buildingNumber: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None


class CartItemSchema(BaseModel):
    id: Optional[str] = None
    productId: Optional[Union[int, str]] = None
    variantId: Optional[Union[int, str]] = None
    variant_id: Optional[Union[int, str]] = None
    title: str
    slug: Optional[str] = None
    size: Optional[str] = None
    color: Optional[str] = None
    price: int  # in Toman
    compareAtPrice: Optional[int] = None
    quantity: int = 1
    maxStock: Optional[int] = 10
    image: Optional[str] = ""


class OrderReceiptResponse(BaseModel):
    orderNumber: str
    items: List[CartItemSchema]
    shippingAddress: ShippingAddressSchema
    shippingMethod: str
    paymentMethod: str
    subtotal: int  # in Toman
    discount: int  # in Toman
    shippingCost: int  # in Toman
    finalTotal: int  # in Toman
    paymentStatus: str = "pending"
    createdAt: str
    estimatedDelivery: Optional[str] = None


class OrderItemCreate(BaseModel):
    variant_id: Optional[str] = None
    quantity: int = 1


class OrderCreateRequest(BaseModel):
    # Front-end Nuxt format & legacy backend test format
    items: Optional[List[Union[CartItemSchema, OrderItemCreate, Dict[str, Any]]]] = None
    shippingAddress: Optional[ShippingAddressSchema] = None
    shippingMethod: Optional[str] = "standard"
    shipping_method: Optional[str] = None
    paymentMethod: Optional[str] = "online_gateway"
    payment_method: Optional[str] = None
    couponCode: Optional[str] = None
    couponDiscount: Optional[int] = None

    def get_shipping_method(self) -> str:
        return self.shipping_method or self.shippingMethod or "standard"

    def get_payment_method(self) -> str:
        return self.payment_method or self.paymentMethod or "online_gateway"

    # Legacy/Admin format
    address_id: Optional[str] = None
    customer_name: Optional[str] = None
    phone_number: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    postal_address: Optional[str] = None
    postal_code: Optional[str] = None
    shipping_cost_toman: Optional[int] = None
    coupon_code: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    variant_id: Optional[str] = None
    product_title: str
    variant_title: str
    quantity: int
    unit_price_rial: int
    total_price_rial: int

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: str
    order_number: str
    status: OrderStatus
    subtotal_amount_rial: int
    discount_amount_rial: int
    shipping_cost_rial: int
    total_amount_rial: int
    customer_name: str
    phone_number: str
    province: str
    city: str
    postal_address: str
    postal_code: str
    shipping_method: str
    tracking_code: Optional[str] = None
    zarinpal_ref_id: Optional[str] = None
    created_at: Optional[datetime] = None
    items: List[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class TrackingEventSchema(BaseModel):
    status: str
    title: str
    description: str
    timestamp: str
    location: Optional[str] = None
    completed: bool


class TrackOrderResponse(BaseModel):
    orderNumber: str
    createdAt: str
    status: str
    statusLabel: str
    recipientName: str
    recipientPhone: Optional[str] = None
    shippingAddress: str
    trackingCode: str
    carrier: str
    estimatedDelivery: str
    timeline: List[TrackingEventSchema]
    items: List[Dict[str, Any]]
    totalAmount: int
    postalCode: Optional[str] = None
    paymentMethod: Optional[str] = None
    notes: Optional[str] = None


class TrackOrderRequest(BaseModel):
    query: str


class PaymentInitResponse(BaseModel):
    order_id: Optional[str] = None
    order_number: Optional[str] = None
    paymentToken: Optional[str] = None
    gatewayUrl: Optional[str] = None
    total_amount_rial: Optional[int] = None
    payment_url: Optional[str] = None
    authority: Optional[str] = None