from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.enums import DiscountType


class CampaignBase(BaseModel):
    title: str = Field(..., max_length=150)
    slug: str = Field(..., max_length=160)
    description: Optional[str] = None
    banner_url: Optional[str] = None
    discount_type: DiscountType
    discount_value: int = Field(..., gt=0)
    is_active: bool = True
    start_date: datetime
    end_date: datetime


class CampaignCreate(CampaignBase):
    product_ids: List[str] = Field(default_factory=list)
    category_ids: List[str] = Field(default_factory=list)


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    banner_url: Optional[str] = None
    discount_type: Optional[DiscountType] = None
    discount_value: Optional[int] = None
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    product_ids: Optional[List[str]] = None
    category_ids: Optional[List[str]] = None


class CampaignResponse(CampaignBase):
    id: str
    product_ids: List[str] = []
    category_ids: List[str] = []

    model_config = ConfigDict(from_attributes=True)

