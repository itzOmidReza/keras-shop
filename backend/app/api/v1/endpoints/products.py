from typing import List, Optional, Union, Dict, Any
from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy import func, or_, and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import DomainException
from app.db.session import get_db
from app.models.product import Category, Product, ProductVariant
from app.models.review import ProductReview
from app.schemas.product import (
    CategoryResponse,
    ProductDetailResponse,
    ProductListResponse,
    ProductPageResponse,
    ProductVariantResponse,
    parse_images,
)
from app.schemas.review import (
    ProductReviewSchema,
    ProductReviewsResponse,
    ProductReviewSummarySchema,
    ProductReviewCreateRequest,
)

router = APIRouter(prefix="/products", tags=["Catalog & Products"])

_TOMAN = 10

SLUG_ALIASES: Dict[str, str] = {
    "lined-long-wool-fouter-coat": "long-lined-wool-fouter-coat",
    "cotton-jacquard-bandana-headband": "cotton-jacquard-bandana",
    "chunky-knit-long-wool-scarf": "thick-knit-wool-long-scarf",
    "wide-leg-autumn-linen-pants": "autumn-wide-leg-linen-pants",
}


def _clean_persian_str(col):
    return func.replace(
        func.replace(
            func.replace(func.replace(col, "ي", "ی"), "ك", "ک"),
            "\u200c", " "
        ),
        "آ", "ا"
    )


def _normalize_text(text: str) -> str:
    if not text:
        return ""
    return (
        text.replace("ي", "ی")
        .replace("ك", "ک")
        .replace("\u200c", " ")
        .replace("آ", "ا")
        .strip()
    )


def _build_search_clause(query_text: str):
    cleaned = _normalize_text(query_text)
    tokens = [t for t in cleaned.split() if t]
    if not tokens:
        return None

    normalized_title = _clean_persian_str(Product.title)
    normalized_desc = _clean_persian_str(Product.description)

    token_conditions = []
    for token in tokens:
        term = f"%{token}%"
        token_conditions.append(
            or_(
                normalized_title.ilike(term),
                Product.slug.ilike(term),
                normalized_desc.ilike(term),
            )
        )
    return and_(*token_conditions)


def _build_product_list_response(p: Product) -> ProductListResponse:
    images = parse_images(p.images)
    active_variants = [v for v in p.variants if v.is_active]
    in_stock = any(v.stock > 0 for v in active_variants) if active_variants else True

    price_toman = int(p.base_price_rial // _TOMAN)
    compare_at = int(p.compare_at_price_rial // _TOMAN) if p.compare_at_price_rial else None

    # Resolve sizes and colors
    sizes = p.sizes or ["XS", "S", "M", "L", "XL"]
    colors = p.colors or [{"name": "پیش‌فرض", "hex": "#1C1917"}]

    return ProductListResponse(
        id=p.numeric_id or p.id,
        slug=p.slug,
        title=p.title,
        brand=p.brand or "keras-atelier",
        division=p.division or "apparel",
        category=p.category.slug if p.category else "shirts-blouses",
        season=p.season or "fall-1405",
        price=price_toman,
        base_price=price_toman,
        compare_at_price=compare_at,
        images=images,
        sizes=sizes,
        available_sizes=p.available_sizes or sizes,
        colors=colors,
        inStock=in_stock,
        rating=p.rating_avg or 5.0,
        rating_avg=p.rating_avg or 5.0,
        reviewCount=p.rating_count or 0,
        rating_count=p.rating_count or 0,
        description=p.description,
        fabric=p.fabric or {"composition": p.fabric_composition or "۱۰۰٪ الیاف طبیعی", "care": "شست‌وشوی ملایم"},
        fabric_composition=p.fabric_composition,
        fabric_gsm=p.fabric_gsm,
        is_active=p.is_active,
        badge=p.badge,
        has_transparency_test=p.has_transparency_test,
        stretch=p.stretch,
        softness=p.softness,
        opacity=p.opacity,
        line=p.line,
        fit_note=p.fit_note,
    )


def _build_product_detail_response(p: Product) -> ProductDetailResponse:
    base_item = _build_product_list_response(p)

    variants_resp = []
    for v in p.variants:
        variants_resp.append(
            ProductVariantResponse(
                id=v.numeric_id or v.id,
                sku=v.sku,
                title=v.title,
                color=v.color or "پیش‌فرض",
                color_hex=v.color_hex or "#1C1917",
                size=v.size or "Free",
                price=int(v.price_rial // _TOMAN),
                price_override=int(v.price_rial // _TOMAN),
                compare_at_price=int(v.compare_at_price_rial // _TOMAN) if v.compare_at_price_rial else None,
                stock=v.stock,
                reserved=v.reserved,
                is_active=v.is_active,
                attributes=v.attributes or {},
                fulfillment_type=v.fulfillment_type or "in_stock",
            )
        )

    cat_info = None
    if p.category:
        cat_info = {
            "id": p.category.id,
            "title": p.category.title,
            "slug": p.category.slug,
        }

    return ProductDetailResponse(
        **base_item.model_dump(),
        category_info=cat_info,
        activities=p.activities or ["yoga", "daily"],
        size_chart=p.size_chart,
        variants=variants_resp,
    )


@router.get(
    "",
    response_model=List[ProductListResponse],
    status_code=status.HTTP_200_OK,
    summary="List Products",
)
async def list_products(
    q: Optional[str] = Query(None, description="Search query"),
    division: Optional[str] = Query(None, description="Division: apparel | accessories"),
    category: Optional[str] = Query(None, description="Category slug"),
    season: Optional[str] = Query(None, description="Season slug"),
    brand: Optional[str] = Query(None, description="Brand slug"),
    line: Optional[str] = Query(None, description="Line: move | calm"),
    sort: Optional[str] = Query("newest", description="Sorting criteria"),
    page: Optional[int] = Query(None, ge=1),
    limit: Optional[int] = Query(None, ge=1, le=100),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Product)
        .where(Product.is_active == True)
        .options(selectinload(Product.variants), selectinload(Product.category))
    )

    if q:
        search_clause = _build_search_clause(q)
        if search_clause is not None:
            stmt = stmt.where(search_clause)

    if division and division != "all":
        stmt = stmt.where(Product.division == division)

    if category and category != "all":
        stmt = stmt.join(Product.category, isouter=True).where(
            or_(Category.slug == category, Product.category_id == category)
        )

    if season and season != "all":
        stmt = stmt.where(Product.season == season)

    if brand and brand != "all":
        stmt = stmt.where(Product.brand == brand)

    if line and line != "all":
        stmt = stmt.where(Product.line == line)

    if min_price:
        stmt = stmt.where(Product.base_price_rial >= (min_price * _TOMAN))

    if max_price:
        stmt = stmt.where(Product.base_price_rial <= (max_price * _TOMAN))

    # Order by
    if sort == "price_asc":
        stmt = stmt.order_by(Product.base_price_rial.asc())
    elif sort == "price_desc":
        stmt = stmt.order_by(Product.base_price_rial.desc())
    else:
        stmt = stmt.order_by(Product.created_at.desc())

    if limit:
        p = page or 1
        stmt = stmt.offset((p - 1) * limit).limit(limit)

    res = await db.execute(stmt)
    products = res.scalars().unique().all()
    return [_build_product_list_response(p) for p in products]


@router.get(
    "/{slug}/related",
    response_model=List[ProductListResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Related Products",
)
async def get_related_products(
    slug: str,
    limit: int = Query(4, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
):
    real_slug = SLUG_ALIASES.get(slug, slug)
    stmt = select(Product).where(or_(Product.slug == real_slug, Product.slug == slug))
    res = await db.execute(stmt)
    current_product = res.scalar_one_or_none()

    related_stmt = (
        select(Product)
        .where(Product.is_active == True)
        .options(selectinload(Product.variants), selectinload(Product.category))
        .order_by(Product.created_at.desc())
        .limit(limit)
    )

    if current_product:
        related_stmt = related_stmt.where(Product.id != current_product.id)
        if current_product.category_id:
            related_stmt = related_stmt.where(Product.category_id == current_product.category_id)

    related_res = await db.execute(related_stmt)
    related_products = list(related_res.scalars().unique().all())

    if len(related_products) < limit:
        needed = limit - len(related_products)
        existing_ids = [p.id for p in related_products]
        if current_product:
            existing_ids.append(current_product.id)

        fallback_stmt = (
            select(Product)
            .where(Product.is_active == True, ~Product.id.in_(existing_ids))
            .options(selectinload(Product.variants), selectinload(Product.category))
            .order_by(Product.created_at.desc())
            .limit(needed)
        )
        fallback_res = await db.execute(fallback_stmt)
        related_products.extend(fallback_res.scalars().unique().all())

    return [_build_product_list_response(p) for p in related_products]


@router.get(
    "/{slug}/reviews",
    response_model=ProductReviewsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Reviews for Product",
)
async def get_product_reviews(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    real_slug = SLUG_ALIASES.get(slug, slug)
    stmt = (
        select(ProductReview)
        .where(
            or_(ProductReview.product_slug == real_slug, ProductReview.product_slug == slug),
            ProductReview.status == "approved",
        )
        .order_by(ProductReview.created_at.desc())
    )
    res = await db.execute(stmt)
    reviews = res.scalars().all()

    ratings = [int(round(r.rating)) for r in reviews if r.rating]
    dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for r in ratings:
        if 1 <= r <= 5:
            dist[r] += 1

    avg_rating = round(sum(ratings) / len(ratings), 1) if ratings else 5.0
    fit_counts = {"small": 0, "true_to_size": 0, "large": 0}
    for r in reviews:
        fb = r.fit_feedback or "true_to_size"
        if fb in ("small", "runs_small"):
            fit_counts["small"] += 1
        elif fb in ("large", "runs_large"):
            fit_counts["large"] += 1
        else:
            fit_counts["true_to_size"] += 1

    review_schemas = [
        ProductReviewSchema(
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
        for r in reviews
    ]

    return ProductReviewsResponse(
        summary=ProductReviewSummarySchema(
            average_rating=avg_rating,
            total_reviews=len(reviews),
            rating_distribution=dist,
            fit_breakdown=fit_counts,
        ),
        reviews=review_schemas,
    )


@router.post(
    "/{slug}/reviews",
    status_code=status.HTTP_201_CREATED,
    summary="Submit Product Review",
)
async def submit_product_review(
    slug: str,
    payload: ProductReviewCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    real_slug = SLUG_ALIASES.get(slug, slug)
    res = await db.execute(select(Product).where(or_(Product.slug == real_slug, Product.slug == slug)))
    product = res.scalar_one_or_none()

    new_rev = ProductReview(
        product_slug=slug,
        product_title=product.title if product else "محصول کراس",
        product_thumbnail=parse_images(product.images)[0]["url"] if product and parse_images(product.images) else None,
        author_name=payload.authorName or "مشتری محترم",
        rating=payload.rating or 5.0,
        date="۱۴۰۵/۰۷/۱۵",
        comment=payload.comment,
        fit_feedback=payload.fitFeedback or "true_to_size",
        is_verified_buyer=False,
        status="pending",
        size_purchased=payload.sizePurchased,
    )
    db.add(new_rev)
    await db.commit()
    return {"success": True, "message": "دیدگاه شما با موفقیت ثبت شد و پس از بازبینی منتشر خواهد شد."}


@router.get(
    "/{slug}",
    response_model=ProductDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Product Details",
)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    real_slug = SLUG_ALIASES.get(slug, slug)
    stmt = (
        select(Product)
        .where(or_(Product.slug == real_slug, Product.slug == slug), Product.is_active == True)
        .options(selectinload(Product.variants), selectinload(Product.category))
    )
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()

    if not product:
        raise DomainException(
            message=f"Product with slug '{slug}' was not found.",
            code="PRODUCT_NOT_FOUND",
            status_code=404,
        )

    return _build_product_detail_response(product)