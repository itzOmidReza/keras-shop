import uuid
from typing import List, Optional, Union, Dict, Any
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, require_admin
from app.models.lookbook import StyleLookbook
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.product import parse_images
from app.schemas.lookbook import (
    LookbookHotspotSchema,
    LookbookItemResponse,
    StyleLookbookPublicResponse,
    StyleLookbookAdminResponse,
    StyleLookbookCreateRequest,
    StyleLookbookUpdateRequest,
)
from app.core.exceptions import DomainException

router = APIRouter(tags=["Style Bundles & Lookbook"])

_TOMAN = 10


def _extract_image(p: Product) -> str:
    images = parse_images(p.images)
    if images:
        first = images[0]
        if isinstance(first, dict):
            return first.get("url", "")
        return getattr(first, "url", "")
    return ""


def _extract_sizes(p: Product) -> List[str]:
    sizes: List[str] = []
    if p.variants:
        for v in p.variants:
            if v.is_active and v.size and v.size not in sizes:
                sizes.append(v.size)
    if not sizes and getattr(p, "sizes", None):
        raw = getattr(p, "sizes")
        if isinstance(raw, list):
            sizes = [str(s) for s in raw if str(s)]
    return sizes if sizes else ["Free"]


def _match_product(p: Product, identifier: Union[str, int]) -> bool:
    s_id = str(identifier).strip()
    if p.id == s_id:
        return True
    if p.numeric_id is not None and str(p.numeric_id) == s_id:
        return True
    if p.slug == s_id:
        return True
    return False


async def _resolve_products_for_lookbooks(
    lookbooks: List[StyleLookbook], db: AsyncSession
) -> Dict[str, Product]:
    all_identifiers: set = set()
    for lb in lookbooks:
        for item in lb.items or []:
            pid = item.get("product_id") or item.get("id") or item.get("slug")
            if pid:
                all_identifiers.add(str(pid))

    if not all_identifiers:
        return {}

    uuid_ids = [i for i in all_identifiers if _is_uuid(i)]
    numeric_ids = [int(i) for i in all_identifiers if i.isdigit()]
    slug_candidates = [i for i in all_identifiers if not _is_uuid(i) and not i.isdigit()]

    conditions = []
    if uuid_ids:
        conditions.append(Product.id.in_(uuid_ids))
    if numeric_ids:
        conditions.append(Product.numeric_id.in_(numeric_ids))
    if slug_candidates:
        conditions.append(Product.slug.in_(slug_candidates))

    if not conditions:
        return {}

    stmt = (
        select(Product)
        .where(or_(*conditions))
        .options(selectinload(Product.variants))
    )
    res = await db.execute(stmt)
    products = res.scalars().all()

    # Map by id, numeric_id, and slug
    prod_map: Dict[str, Product] = {}
    for p in products:
        prod_map[p.id] = p
        if p.numeric_id is not None:
            prod_map[str(p.numeric_id)] = p
        prod_map[p.slug] = p

    return prod_map


def _is_uuid(val: Any) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, TypeError, AttributeError):
        return False


def _build_public_response(
    lb: StyleLookbook, prod_map: Dict[str, Product]
) -> StyleLookbookPublicResponse:
    resolved_items: List[LookbookItemResponse] = []
    total_price = 0

    for raw_item in lb.items or []:
        pid = raw_item.get("product_id") or raw_item.get("id") or raw_item.get("slug")
        product = prod_map.get(str(pid)) if pid else None

        hx = float(raw_item.get("hotspot_x", raw_item.get("hotspot", {}).get("right", 50.0)))
        hy = float(raw_item.get("hotspot_y", raw_item.get("hotspot", {}).get("top", 50.0)))

        if product:
            price_toman = int(product.base_price_rial // _TOMAN)
            compare_at = (
                int(product.compare_at_price_rial // _TOMAN)
                if product.compare_at_price_rial
                else None
            )
            total_price += price_toman

            active_vars = [v for v in product.variants if v.is_active]
            in_stock = any(v.stock > 0 for v in active_vars) if active_vars else product.is_active

            resolved_items.append(
                LookbookItemResponse(
                    id=product.numeric_id or product.id,
                    slug=product.slug,
                    title=product.title,
                    price=price_toman,
                    compareAtPrice=compare_at,
                    image=_extract_image(product),
                    inStock=in_stock,
                    sizes=_extract_sizes(product),
                    hotspot_x=hx,
                    hotspot_y=hy,
                    hotspot=LookbookHotspotSchema(top=hy, right=hx),
                )
            )
        else:
            # Fallback for mock items if product was removed
            fallback_title = raw_item.get("title", f"آیتم {pid}")
            fallback_price = int(raw_item.get("price", 0))
            total_price += fallback_price
            resolved_items.append(
                LookbookItemResponse(
                    id=pid or str(uuid.uuid4()),
                    slug=raw_item.get("slug", f"item-{pid}"),
                    title=fallback_title,
                    price=fallback_price,
                    compareAtPrice=raw_item.get("compareAtPrice"),
                    image=raw_item.get("image", lb.cover_image),
                    inStock=True,
                    sizes=raw_item.get("sizes", ["Free"]),
                    hotspot_x=hx,
                    hotspot_y=hy,
                    hotspot=LookbookHotspotSchema(top=hy, right=hx),
                )
            )

    discount_pct = lb.discount_percent or 0
    discounted_price = int(round(total_price * (100 - discount_pct) / 100))

    return StyleLookbookPublicResponse(
        id=lb.id,
        title=lb.title,
        subtitle=lb.tagline or "کالکشن جدید کراس",
        tagline=lb.tagline,
        description=lb.description or "",
        image=lb.cover_image,
        cover_image=lb.cover_image,
        discount_percent=discount_pct,
        display_order=lb.display_order,
        items=resolved_items,
        bundle_total_price=total_price,
        discounted_price=discounted_price,
        item_count=len(resolved_items),
    )


def _build_admin_response(
    lb: StyleLookbook, prod_map: Dict[str, Product]
) -> StyleLookbookAdminResponse:
    pub = _build_public_response(lb, prod_map)
    return StyleLookbookAdminResponse(
        id=lb.id,
        title=lb.title,
        tagline=lb.tagline,
        description=lb.description or "",
        cover_image=lb.cover_image,
        discount_percent=lb.discount_percent,
        is_active=lb.is_active,
        display_order=lb.display_order,
        items=pub.items,
        bundle_total_price=pub.bundle_total_price,
        discounted_price=pub.discounted_price,
        product_count=len(pub.items),
        created_at=lb.created_at.isoformat() if lb.created_at else None,
        updated_at=lb.updated_at.isoformat() if lb.updated_at else None,
    )


# --------------------------------------------------------------------------
# Public Endpoints
# --------------------------------------------------------------------------

@router.get(
    "/lookbooks/public",
    response_model=List[StyleLookbookPublicResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Public Style Lookbooks",
)
@router.get(
    "/public/lookbooks",
    response_model=List[StyleLookbookPublicResponse],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/lookbooks",
    response_model=List[StyleLookbookPublicResponse],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def list_public_lookbooks(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(StyleLookbook)
        .where(StyleLookbook.is_active == True)  # noqa: E712
        .order_by(StyleLookbook.display_order.asc(), StyleLookbook.created_at.desc())
    )
    res = await db.execute(stmt)
    lookbooks = res.scalars().all()

    prod_map = await _resolve_products_for_lookbooks(lookbooks, db)
    return [_build_public_response(lb, prod_map) for lb in lookbooks]


# --------------------------------------------------------------------------
# Admin Endpoints (Require Super Admin Bearer Auth)
# --------------------------------------------------------------------------

@router.get(
    "/lookbooks/admin",
    response_model=List[StyleLookbookAdminResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Lookbooks for Admin",
)
@router.get(
    "/admin/lookbooks",
    response_model=List[StyleLookbookAdminResponse],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def list_admin_lookbooks(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    stmt = select(StyleLookbook).order_by(
        StyleLookbook.display_order.asc(), StyleLookbook.created_at.desc()
    )
    res = await db.execute(stmt)
    lookbooks = res.scalars().all()

    prod_map = await _resolve_products_for_lookbooks(lookbooks, db)
    return [_build_admin_response(lb, prod_map) for lb in lookbooks]


@router.get(
    "/lookbooks/admin/{id}",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Single Lookbook for Admin",
)
@router.get(
    "/admin/lookbooks/{id}",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def get_admin_lookbook(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    stmt = select(StyleLookbook).where(StyleLookbook.id == id)
    res = await db.execute(stmt)
    lb = res.scalar_one_or_none()
    if not lb:
        raise DomainException(
            message="ست و استایل مورد نظر یافت نشد.",
            code="LOOKBOOK_NOT_FOUND",
            status_code=404,
        )

    prod_map = await _resolve_products_for_lookbooks([lb], db)
    return _build_admin_response(lb, prod_map)


@router.post(
    "/lookbooks/admin",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Style Lookbook",
)
@router.post(
    "/admin/lookbooks",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
async def create_lookbook(
    payload: StyleLookbookCreateRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    title = payload.title.strip()
    if not title:
        raise DomainException(
            message="عنوان ست و لوک‌بوک الزامی است.",
            code="TITLE_REQUIRED",
            status_code=400,
        )

    cover_image = payload.cover_image.strip()
    if not cover_image:
        raise DomainException(
            message="تصویر کاور ست الزامی است.",
            code="COVER_IMAGE_REQUIRED",
            status_code=400,
        )

    if cover_image.startswith("data:image/"):
        raise DomainException(
            message="تصویر کاور باید ابتدا در سرور آپلود شود و نمی‌تواند به صورت Base64 مستقیم ارسال گردد.",
            code="BASE64_NOT_ALLOWED",
            status_code=400,
        )

    items_data = [item.model_dump() for item in payload.items]

    lb = StyleLookbook(
        title=title,
        tagline=payload.tagline.strip() if payload.tagline else None,
        description=payload.description.strip() if payload.description else "",
        cover_image=cover_image,
        discount_percent=payload.discount_percent if payload.discount_percent is not None else 10,
        is_active=payload.is_active if payload.is_active is not None else True,
        display_order=payload.display_order if payload.display_order is not None else 0,
        items=items_data,
    )
    db.add(lb)
    await db.commit()
    await db.refresh(lb)

    prod_map = await _resolve_products_for_lookbooks([lb], db)
    return _build_admin_response(lb, prod_map)


@router.put(
    "/lookbooks/admin/{id}",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Style Lookbook",
)
@router.put(
    "/admin/lookbooks/{id}",
    response_model=StyleLookbookAdminResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def update_lookbook(
    id: str,
    payload: StyleLookbookUpdateRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    stmt = select(StyleLookbook).where(StyleLookbook.id == id)
    res = await db.execute(stmt)
    lb = res.scalar_one_or_none()
    if not lb:
        raise DomainException(
            message="ست و استایل مورد نظر یافت نشد.",
            code="LOOKBOOK_NOT_FOUND",
            status_code=404,
        )

    if payload.title is not None:
        lb.title = payload.title.strip()
    if payload.tagline is not None:
        lb.tagline = payload.tagline.strip() if payload.tagline else None
    if payload.description is not None:
        lb.description = payload.description.strip()
    if payload.cover_image is not None:
        clean_cover = payload.cover_image.strip()
        if clean_cover.startswith("data:image/"):
            raise DomainException(
                message="تصویر کاور باید ابتدا در سرور آپلود شود و نمی‌تواند به صورت Base64 مستقیم ارسال گردد.",
                code="BASE64_NOT_ALLOWED",
                status_code=400,
            )
        lb.cover_image = clean_cover
    if payload.discount_percent is not None:
        lb.discount_percent = payload.discount_percent
    if payload.is_active is not None:
        lb.is_active = payload.is_active
    if payload.display_order is not None:
        lb.display_order = payload.display_order
    if payload.items is not None:
        lb.items = [item.model_dump() for item in payload.items]

    await db.commit()
    await db.refresh(lb)

    prod_map = await _resolve_products_for_lookbooks([lb], db)
    return _build_admin_response(lb, prod_map)


@router.delete(
    "/lookbooks/admin/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Style Lookbook",
)
@router.delete(
    "/admin/lookbooks/{id}",
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def delete_lookbook(
    id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    stmt = select(StyleLookbook).where(StyleLookbook.id == id)
    res = await db.execute(stmt)
    lb = res.scalar_one_or_none()
    if lb:
        await db.delete(lb)
        await db.commit()
    return {"success": True, "message": "ست و استایل با موفقیت حذف گردید."}

