from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.product import Product, Category
from app.schemas.search import (
    SearchSuggestionsResponse,
    SearchSuggestionItem,
    SearchCategorySuggestion,
)
from app.schemas.product import parse_images

router = APIRouter(prefix="/search", tags=["Search"])

_TOMAN = 10


@router.get(
    "/suggestions",
    response_model=SearchSuggestionsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Search Autocomplete Suggestions",
)
async def get_search_suggestions(
    q: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    trimmed = (q or "").strip()
    if len(trimmed) < 2:
        return SearchSuggestionsResponse(query=trimmed, products=[], categories=[], totalMatches=0)

    term = f"%{trimmed}%"
    stmt = (
        select(Product)
        .where(
            Product.is_active == True,
            or_(Product.title.ilike(term), Product.slug.ilike(term), Product.description.ilike(term)),
        )
        .options(selectinload(Product.variants), selectinload(Product.category))
        .limit(6)
    )
    res = await db.execute(stmt)
    products = res.scalars().unique().all()

    product_items = []
    for p in products:
        imgs = parse_images(p.images)
        first_img = imgs[0]["url"] if imgs and isinstance(imgs[0], dict) else (imgs[0] if imgs else "")
        price_toman = int(p.base_price_rial // _TOMAN)
        compare_toman = int(p.compare_at_price_rial // _TOMAN) if p.compare_at_price_rial else None

        product_items.append(
            SearchSuggestionItem(
                id=p.numeric_id or 1,
                title=p.title,
                slug=p.slug,
                price=price_toman,
                compare_at_price=compare_toman,
                primary_image=first_img,
                division=p.division or "apparel",
                category=p.category.slug if p.category else "shirts-blouses",
                season=p.season or "fall-1405",
                line=p.line,
                inStock=True,
            )
        )

    # Categories suggestions
    cat_stmt = select(Category).where(Category.title.ilike(term)).limit(4)
    cat_res = await db.execute(cat_stmt)
    cats = cat_res.scalars().all()
    cat_items = [SearchCategorySuggestion(name=c.title, slug=c.slug, count=1) for c in cats]

    return SearchSuggestionsResponse(
        query=trimmed,
        products=product_items,
        categories=cat_items,
        totalMatches=len(product_items) + len(cat_items),
    )
