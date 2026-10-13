import json
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class AdminVariantCreate(BaseModel):
    """Variant payload for admin product creation (prices in Toman)."""

    sku: Optional[str] = None
    attributes: dict = Field(default_factory=dict)
    price_override_toman: Optional[int] = Field(None, ge=0)
    stock_qty: int = Field(0, ge=0)
    fulfillment_type: str = "in_stock"
    supplier_id: Optional[str] = None


class AdminProductCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=220)
    description: Optional[str] = None
    category_id: str
    images: List[str] = Field(default_factory=list)
    base_price_toman: int = Field(..., ge=0)
    status: str = Field("active", description="active | inactive | draft")
    variants: List[AdminVariantCreate] = Field(default_factory=list)


class AdminVariantStockUpdate(BaseModel):
    variant_id: str
    stock_qty: int = Field(..., ge=0)


class AdminProductUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    base_price_toman: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None
    variants: Optional[List[AdminVariantStockUpdate]] = None


class AdminVariantResponse(BaseModel):
    """Matches the frontend ProductVariant contract (Toman prices)."""

    id: str
    sku: str
    attributes: dict = Field(default_factory=dict)
    price_override_toman: Optional[int] = None
    fulfillment_type: str
    stock_qty: int
    supplier_id: Optional[str] = None


class AdminProductResponse(BaseModel):
    """Matches the frontend admin Product contract (Toman prices)."""

    id: str
    title: str
    slug: str
    description: Optional[str] = None
    category_id: str
    images: List[str] = []
    base_price_toman: int
    status: str
    variants: List[AdminVariantResponse] = []
    created_at: Optional[datetime] = None


class AdminProductPageResponse(BaseModel):
    items: List[AdminProductResponse]
    total: int
    page: int
    limit: int
    total_pages: int
