import json
import time
import uuid
from typing import List, Optional, Union, Dict, Any
from fastapi import APIRouter, Depends, Query, Response, status
from pydantic import BaseModel
from sqlalchemy import func, or_, and_, select, String
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
    response: Response,
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
    include_inactive: Optional[bool] = Query(False),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Product)
        .options(selectinload(Product.variants), selectinload(Product.category))
    )
    count_stmt = select(func.count(Product.id))

    if not include_inactive:
        stmt = stmt.where(Product.is_active == True)
        count_stmt = count_stmt.where(Product.is_active == True)

    if q:
        search_clause = _build_search_clause(q)
        if search_clause is not None:
            stmt = stmt.where(search_clause)
            count_stmt = count_stmt.where(search_clause)

    if division and division != "all":
        stmt = stmt.where(Product.division == division)
        count_stmt = count_stmt.where(Product.division == division)

    if category and category != "all":
        cat_filter = or_(Category.slug == category, Product.category_id == category)
        stmt = stmt.join(Product.category, isouter=True).where(cat_filter)
        count_stmt = count_stmt.join(Product.category, isouter=True).where(cat_filter)

    if season and season != "all":
        stmt = stmt.where(Product.season == season)
        count_stmt = count_stmt.where(Product.season == season)

    if brand and brand != "all":
        stmt = stmt.where(Product.brand == brand)
        count_stmt = count_stmt.where(Product.brand == brand)

    if line and line != "all":
        stmt = stmt.where(Product.line == line)
        count_stmt = count_stmt.where(Product.line == line)

    if min_price:
        stmt = stmt.where(Product.base_price_rial >= (min_price * _TOMAN))
        count_stmt = count_stmt.where(Product.base_price_rial >= (min_price * _TOMAN))

    if max_price:
        stmt = stmt.where(Product.base_price_rial <= (max_price * _TOMAN))
        count_stmt = count_stmt.where(Product.base_price_rial <= (max_price * _TOMAN))

    total = int((await db.execute(count_stmt)).scalar_one() or 0)
    response.headers["X-Total-Count"] = str(total)

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


@router.post(
    "",
    response_model=ProductDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Product",
)
async def create_product(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    title = (payload.get("title") or "").strip() or "محصول جدید کراس"
    slug = (payload.get("slug") or "").strip()
    if not slug:
        slug = f"item-{int(time.time())}"

    # Ensure unique slug
    existing = (await db.execute(select(Product.id).where(Product.slug == slug))).scalar_one_or_none()
    if existing:
        slug = f"{slug}-{str(uuid.uuid4())[:4]}"

    # Find category
    category_id = None
    cat_slug = payload.get("category")
    if cat_slug:
        cat_res = await db.execute(select(Category).where(Category.slug == str(cat_slug)))
        cat_obj = cat_res.scalar_one_or_none()
        if not cat_obj:
            try:
                uuid.UUID(str(cat_slug))
                cat_res = await db.execute(select(Category).where(Category.id == str(cat_slug)))
                cat_obj = cat_res.scalar_one_or_none()
            except (ValueError, TypeError):
                pass
        if cat_obj:
            category_id = cat_obj.id

    max_num_id = (await db.execute(select(func.coalesce(func.max(Product.numeric_id), 0)))).scalar_one() or 0
    numeric_id = max_num_id + 1

    price = int(payload.get("price") or payload.get("salePrice") or payload.get("basePrice") or 0)
    base_price = int(payload.get("basePrice") or price)
    compare_at = base_price if base_price > price else None

    images_raw = payload.get("images") or payload.get("galleryImages") or []
    if isinstance(images_raw, list):
        img_urls = [it["url"] if isinstance(it, dict) and "url" in it else str(it) for it in images_raw if it]
    else:
        img_urls = [str(images_raw)]
    if not img_urls and payload.get("mainImage"):
        img_urls = [payload.get("mainImage")]

    is_active = bool(payload.get("is_active", payload.get("isPublished", True)))

    product = Product(
        numeric_id=numeric_id,
        title=title,
        slug=slug,
        description=payload.get("description") or f"{title} — طراحی اختصاصی در آتلیه مد کراس",
        category_id=category_id,
        images=json.dumps(img_urls),
        base_price_rial=price * _TOMAN,
        compare_at_price_rial=compare_at * _TOMAN if compare_at else None,
        is_active=is_active,
        brand=payload.get("brand") or "keras-atelier",
        division=payload.get("division") or "apparel",
        season=payload.get("season") or "fall-1405",
        badge=payload.get("badge") or ("جدید" if is_active else None),
        fit_note=payload.get("fit_note") or payload.get("fitNote"),
        fabric=payload.get("fabric") if isinstance(payload.get("fabric"), dict) else {"composition": payload.get("fabric") or "۱۰۰٪ الیاف طبیعی", "care": payload.get("careInstructions") or "شست‌وشوی ملایم"},
        sizes=payload.get("sizes") or payload.get("selectedSizes") or ["S", "M", "L"],
        available_sizes=payload.get("available_sizes") or payload.get("selectedSizes") or ["S", "M", "L"],
        colors=payload.get("colors") or payload.get("selectedColors") or [{"name": "مشکی", "hex": "#1C1917"}],
    )
    db.add(product)
    await db.flush()

    variants_input = payload.get("variants") or []
    if variants_input:
        for idx, v in enumerate(variants_input):
            v_sku = v.get("sku") or f"{slug}-{idx + 1}"
            v_stock = int(v.get("stock") or 0)
            v_color = v.get("color") or "پیش‌فرض"
            v_color_hex = v.get("colorHex") or v.get("color_hex") or "#1C1917"
            v_size = v.get("size") or "Free"
            v_price = int(v.get("price") or price)
            v_obj = ProductVariant(
                product_id=product.id,
                sku=v_sku,
                title=f"{title} - {v_color} / {v_size}",
                color=v_color,
                color_hex=v_color_hex,
                size=v_size,
                stock=v_stock,
                price_rial=v_price * _TOMAN,
                is_active=True,
            )
            db.add(v_obj)
    else:
        default_v = ProductVariant(
            product_id=product.id,
            sku=f"{slug}-std",
            title=f"{title} - استاندارد",
            color="پیش‌فرض",
            color_hex="#1C1917",
            size="Free",
            stock=10,
            price_rial=price * _TOMAN,
            is_active=True,
        )
        db.add(default_v)

    await db.commit()
    stmt = (
        select(Product)
        .where(Product.id == product.id)
        .options(selectinload(Product.variants), selectinload(Product.category))
    )
    res = await db.execute(stmt)
    saved_product = res.scalar_one()
    return _build_product_detail_response(saved_product)


@router.put(
    "/{product_id}",
    response_model=ProductDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Product",
)
async def update_product(
    product_id: str,
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Product)
        .where(
            or_(
                Product.id == product_id,
                Product.slug == product_id,
                func.cast(Product.numeric_id, String) == str(product_id),
            )
        )
        .options(selectinload(Product.variants), selectinload(Product.category))
    )
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise DomainException(message="Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    if "title" in payload:
        product.title = payload["title"]
    if "description" in payload:
        product.description = payload["description"]
    if "is_active" in payload:
        product.is_active = bool(payload["is_active"])
    elif "isPublished" in payload:
        product.is_active = bool(payload["isPublished"])
    if "price" in payload or "salePrice" in payload:
        price = int(payload.get("salePrice") or payload.get("price"))
        product.base_price_rial = price * _TOMAN
    if "category" in payload:
        cat_slug = payload["category"]
        cat_res = await db.execute(select(Category).where(Category.slug == str(cat_slug)))
        cat_obj = cat_res.scalar_one_or_none()
        if not cat_obj:
            try:
                uuid.UUID(str(cat_slug))
                cat_res = await db.execute(select(Category).where(Category.id == str(cat_slug)))
                cat_obj = cat_res.scalar_one_or_none()
            except (ValueError, TypeError):
                pass
        if cat_obj:
            product.category_id = cat_obj.id

    if "images" in payload or "galleryImages" in payload:
        images_raw = payload.get("images") or payload.get("galleryImages") or []
        img_urls = [it["url"] if isinstance(it, dict) and "url" in it else str(it) for it in images_raw if it]
        if img_urls:
            product.images = json.dumps(img_urls)

    await db.commit()
    await db.refresh(product)
    return _build_product_detail_response(product)


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Product",
)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Product)
        .where(
            or_(
                Product.id == product_id,
                Product.slug == product_id,
                func.cast(Product.numeric_id, String) == str(product_id),
            )
        )
        .options(selectinload(Product.variants))
    )
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise DomainException(message="Product not found", code="PRODUCT_NOT_FOUND", status_code=404)

    for v in product.variants:
        await db.delete(v)
    await db.delete(product)
    await db.commit()
    return {"success": True, "message": "محصول با موفقیت حذف شد."}