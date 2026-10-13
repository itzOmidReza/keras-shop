from typing import Optional, List
from pydantic import BaseModel
from app.schemas.product import ProductListResponse


class SearchSuggestionItem(BaseModel):
    id: int
    title: str
    slug: str
    price: int
    compare_at_price: Optional[int] = None
    primary_image: str
    division: str
    category: str
    season: str
    line: Optional[str] = None
    inStock: bool = True


class SearchCategorySuggestion(BaseModel):
    name: str
    slug: str
    count: int


class SearchSuggestionsResponse(BaseModel):
    query: str
    products: List[SearchSuggestionItem] = []
    categories: List[SearchCategorySuggestion] = []
    totalMatches: int = 0

