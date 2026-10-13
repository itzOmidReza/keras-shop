from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.review import ProductReview
from app.schemas.review import ProductReviewSchema
from app.core.exceptions import DomainException

router = APIRouter(prefix="/reviews", tags=["Reviews Moderation"])


def _map_review(r: ProductReview) -> ProductReviewSchema:
    return ProductReviewSchema(
        id=str(r.id),
        productSlug=r.product_slug,
        productTitle=r.product_title,
        productThumbnail=r.product_thumbnail,
        authorName=r.author_name,
        rating=r.rating,
        date=r.date,
        comment=r.comment,
        fitFeedback=r.fit_feedback,
        isVerifiedBuyer=r.is_verified_buyer,
        status=r.status,
        reply=r.reply,
        sizePurchased=r.size_purchased,
    )


@router.get("", response_model=List[ProductReviewSchema])
async def list_all_reviews(
    status_filter: Optional[str] = Query("all", alias="status"),
    product_slug: Optional[str] = Query(None, alias="productSlug"),
    search: Optional[str] = Query(None),
    rating: Optional[float] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(ProductReview)

    if status_filter and status_filter != "all":
        stmt = stmt.where(ProductReview.status == status_filter)

    if product_slug:
        stmt = stmt.where(ProductReview.product_slug == product_slug)

    if rating:
        stmt = stmt.where(ProductReview.rating == rating)

    if search:
        term = f"%{search.strip()}%"
        stmt = stmt.where(or_(ProductReview.comment.ilike(term), ProductReview.author_name.ilike(term)))

    stmt = stmt.order_by(ProductReview.created_at.desc())
    res = await db.execute(stmt)
    return [_map_review(r) for r in res.scalars().all()]


@router.put("/{review_id}/status")
async def update_review_status(
    review_id: str,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(ProductReview).where(ProductReview.id == review_id))
    rev = res.scalar_one_or_none()
    if not rev:
        raise DomainException(message="Review not found", code="NOT_FOUND", status_code=404)

    if "status" in payload:
        rev.status = payload["status"]
    await db.commit()
    return {"success": True, "status": rev.status}


@router.post("/{review_id}/reply")
async def reply_to_review(
    review_id: str,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(ProductReview).where(ProductReview.id == review_id))
    rev = res.scalar_one_or_none()
    if not rev:
        raise DomainException(message="Review not found", code="NOT_FOUND", status_code=404)

    rev.reply = {
        "text": payload.get("reply") or payload.get("text") or "",
        "date": "۱۴۰۵/۰۷/۱۵",
        "author": "آتلیه کراس",
    }
    await db.commit()
    return {"success": True, "review": _map_review(rev)}


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(ProductReview).where(ProductReview.id == review_id))
    rev = res.scalar_one_or_none()
    if rev:
        await db.delete(rev)
        await db.commit()
    return {"success": True}

