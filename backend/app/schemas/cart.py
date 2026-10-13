from typing import List, Optional
from pydantic import BaseModel, Field


class CartItemAddRequest(BaseModel):
    variant_id: str
    quantity: int = Field(default=1, ge=1)


class CartItemUpdateRequest(BaseModel):
    quantity: int = Field(..., ge=0)


class CartItemResponse(BaseModel):
    variant_id: str
    product_title: str
    variant_title: str
    price_rial: int
    quantity: int
    total_price_rial: int
    image_url: Optional[str] = None
    stock_available: int
    price_toman: Optional[int] = None
    total_price_toman: Optional[int] = None


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal_rial: int
    total_items: int
    subtotal_toman: Optional[int] = None