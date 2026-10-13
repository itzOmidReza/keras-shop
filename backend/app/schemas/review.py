from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, ConfigDict


class ProductReviewReplySchema(BaseModel):
    text: str
    date: str
    author: str


class ProductReviewSchema(BaseModel):
    id: Union[int, str]
    productSlug: str
    productTitle: str
    productThumbnail: Optional[str] = None
    authorName: str
    rating: float
    date: str
    comment: str
    fitFeedback: Optional[str] = "true_to_size"
    isVerifiedBuyer: bool = False
    status: str = "pending"
    reply: Optional[ProductReviewReplySchema] = None
    sizePurchased: Optional[str] = None

    # Compatibility aliases
    author: Optional[str] = None
    created_at: Optional[str] = None
    verified_purchase: Optional[bool] = None
    fit_feedback: Optional[str] = None
    size_purchased: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProductReviewSummarySchema(BaseModel):
    average_rating: float = 5.0
    total_reviews: int = 0
    rating_distribution: Dict[int, int] = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    fit_breakdown: Dict[str, int] = {"small": 0, "true_to_size": 0, "large": 0}


class ProductReviewsResponse(BaseModel):
    summary: ProductReviewSummarySchema = ProductReviewSummarySchema()
    reviews: List[ProductReviewSchema] = []

    model_config = ConfigDict(from_attributes=True)


class ProductReviewCreateRequest(BaseModel):
    authorName: Optional[str] = None
    rating: Optional[float] = 5.0
    comment: str
    fitFeedback: Optional[str] = "true_to_size"
    sizePurchased: Optional[str] = None

