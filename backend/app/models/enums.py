import enum


class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"          # Created, awaiting payment
    PROCESSING = "processing"    # Payment verified, preparing shipment
    SHIPPED = "shipped"          # Dispatched via courier
    DELIVERED = "delivered"      # Handed to customer
    CANCELLED = "cancelled"      # Cancelled by user/admin or expired


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentProvider(str, enum.Enum):
    SEP = "sep"
    ZARINPAL = "zarinpal"


class FulfillmentType(str, enum.Enum):
    EXPRESS = "express"
    STANDARD = "standard"
    PRE_ORDER = "pre_order"


class DiscountType(str, enum.Enum):
    PERCENTAGE = "percentage"
    FIXED_TOMAN = "fixed_toman"