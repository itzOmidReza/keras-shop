from typing import List, Optional, Union
from pydantic import BaseModel, ConfigDict, Field


class LookbookHotspotSchema(BaseModel):
    top: float
    right: float


class LookbookItemInputSchema(BaseModel):
    product_id: Union[str, int]
    hotspot_x: float = Field(default=50.0, ge=0.0, le=100.0)
    hotspot_y: float = Field(default=50.0, ge=0.0, le=100.0)


class LookbookItemResponse(BaseModel):
    id: Union[int, str]
    slug: str
    title: str
    price: int
    compareAtPrice: Optional[int] = None
    image: str
    inStock: bool = True
    sizes: List[str] = []
    hotspot_x: float
    hotspot_y: float
    hotspot: LookbookHotspotSchema

    model_config = ConfigDict(from_attributes=True)


class StyleLookbookPublicResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    tagline: Optional[str] = None
    description: str
    image: str
    cover_image: str
    discount_percent: int
    display_order: int
    items: List[LookbookItemResponse]
    bundle_total_price: int
    discounted_price: int
    item_count: int

    model_config = ConfigDict(from_attributes=True)


class StyleLookbookAdminResponse(BaseModel):
    id: str
    title: str
    tagline: Optional[str] = None
    description: str
    cover_image: str
    discount_percent: int
    is_active: bool
    display_order: int
    items: List[LookbookItemResponse]
    bundle_total_price: int
    discounted_price: int
    product_count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class StyleLookbookCreateRequest(BaseModel):
    title: str
    tagline: Optional[str] = None
    description: Optional[str] = ""
    cover_image: str
    discount_percent: Optional[int] = 10
    is_active: Optional[bool] = True
    display_order: Optional[int] = 0
    items: List[LookbookItemInputSchema] = []


class StyleLookbookUpdateRequest(BaseModel):
    title: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    discount_percent: Optional[int] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None
    items: Optional[List[LookbookItemInputSchema]] = None
