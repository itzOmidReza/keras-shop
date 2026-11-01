import json
from datetime import datetime
from typing import List, Optional, Union, Dict, Any

from pydantic import BaseModel, ConfigDict, Field, model_validator, field_validator


def parse_images(raw: Optional[Union[str, List[Any]]]) -> List[Dict[str, Any]]:
    """Parse product images from string/JSON/list ensuring list of image dicts with valid url (rejecting raw base64)."""
    if not raw:
        return []
    items = []
    if isinstance(raw, list):
        items = raw
    elif isinstance(raw, str):
        raw = raw.strip()
        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    items = parsed
            except (ValueError, TypeError):
                items = []
        if not items and raw:
            items = [part.strip() for part in raw.split(",") if part.strip()]

    result = []
    for idx, it in enumerate(items):
        url_val = ""
        alt_val = ""
        kind_val = "photo"
        pos_val = idx + 1
        img_id = idx + 1

        if isinstance(it, dict) and "url" in it and it["url"]:
            url_val = str(it["url"]).strip()
            alt_val = it.get("alt") or ""
            kind_val = it.get("kind") or "photo"
            pos_val = it.get("position") or (idx + 1)
            img_id = it.get("id") or (idx + 1)
        elif isinstance(it, str) and it.strip():
            url_val = it.strip()

        # Reject or sanitize massive raw data URLs
        if url_val.startswith("data:image"):
            continue

        if url_val:
            result.append({
                "id": img_id,
                "url": url_val,
                "alt": alt_val,
                "kind": kind_val,
                "position": pos_val,
            })
    return result


class ProductImageSchema(BaseModel):
    id: Optional[int] = 1
    url: str
    alt: Optional[str] = ""
    kind: Optional[str] = "photo"
    position: Optional[int] = 1

    model_config = ConfigDict(from_attributes=True)

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if v and v.strip().startswith("data:image"):
            raise ValueError("Raw base64 data URLs are not allowed. Please upload image to storage.")
        return v


class ProductFabricSchema(BaseModel):
    composition: str
    gsm: Optional[int] = None
    care: str


class ProductVariantResponse(BaseModel):
    id: Union[int, str]
    sku: str
    title: Optional[str] = ""
    color: Optional[str] = None
    color_hex: Optional[str] = None
    size: Optional[str] = None
    price: Optional[int] = None  # in Toman
    price_override: Optional[int] = None
    compare_at_price: Optional[int] = None  # in Toman
    price_rial: Optional[int] = None
    compare_at_price_rial: Optional[int] = None
    stock: int = 0
    reserved: int = 0
    is_active: bool = True
    attributes: Optional[dict] = Field(default_factory=dict)
    fulfillment_type: Optional[str] = "in_stock"

    model_config = ConfigDict(from_attributes=True)


class CategoryResponse(BaseModel):
    id: Union[int, str]
    title: str
    name: Optional[str] = None
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def ensure_name(self) -> "CategoryResponse":
        if not self.name:
            self.name = self.title
        return self


class ProductListResponse(BaseModel):
    """Card/list shape matching frontend ProductListItem domain model."""
    id: Union[int, str]
    slug: str
    title: str
    brand: Optional[str] = "keras-atelier"
    division: str = "apparel"
    category: str = "shirts-blouses"
    season: str = "fall-1405"
    price: int  # in Toman
    base_price: int  # in Toman
    compare_at_price: Optional[int] = None  # in Toman
    images: List[Union[ProductImageSchema, Dict[str, Any], str]] = []
    sizes: List[str] = []
    available_sizes: List[str] = []
    colors: List[Dict[str, str]] = []
    inStock: bool = True
    rating: float = 5.0
    rating_avg: float = 5.0
    reviewCount: int = 0
    rating_count: int = 0
    description: str
    fabric: Optional[Union[ProductFabricSchema, Dict[str, Any]]] = None
    fabric_composition: Optional[str] = None
    fabric_gsm: Optional[int] = None
    is_active: bool = True
    badge: Optional[str] = None
    has_transparency_test: Optional[bool] = False
    stretch: Optional[int] = None
    softness: Optional[int] = None
    opacity: Optional[int] = None
    line: Optional[str] = None
    fit_note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProductDetailResponse(ProductListResponse):
    category_info: Optional[Dict[str, Any]] = None
    activities: Optional[List[str]] = []
    size_chart: Optional[Dict[str, Any]] = None
    variants: List[ProductVariantResponse] = []


class ProductPageResponse(BaseModel):
    """Paginated catalog envelope."""
    items: List[ProductListResponse]
    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_prev: bool
