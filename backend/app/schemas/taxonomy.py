from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class CustomColorSchema(BaseModel):
    id: str
    name: str
    hex: str
    slug: str
    isSystemDefault: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class CustomSizeSchema(BaseModel):
    id: str
    name: str
    group: str = "alpha"  # alpha | numeric | accessory | free
    order: int = 0
    isSystemDefault: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class TaxonomyCategorySchema(BaseModel):
    id: str
    name: str
    slug: str
    division: str = "apparel"  # apparel | accessories
    iconName: Optional[str] = None
    isActive: bool = True

    model_config = ConfigDict(from_attributes=True)


class TaxonomyBrandSchema(BaseModel):
    id: str
    name: str
    slug: str
    logoSvg: Optional[str] = None
    isFeatured: bool = False

    model_config = ConfigDict(from_attributes=True)


class TaxonomySeasonSchema(BaseModel):
    id: str
    name: str
    slug: str
    isCurrentDrop: bool = False
    isActive: bool = True

    model_config = ConfigDict(from_attributes=True)


class StoreTaxonomyResponse(BaseModel):
    colors: List[CustomColorSchema] = []
    sizes: List[CustomSizeSchema] = []
    categories: List[TaxonomyCategorySchema] = []
    brands: List[TaxonomyBrandSchema] = []
    seasons: List[TaxonomySeasonSchema] = []

    model_config = ConfigDict(from_attributes=True)

