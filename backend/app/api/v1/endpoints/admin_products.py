import json
import math
import re
import time
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, require_admin, get_optional_user
from app.core.config import settings
from app.core.exceptions import DomainException
from app.services.storage import storage_service
from app.models.enums import FulfillmentType, UserRole
from app.models.order import OrderItem
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.admin_product import (
    AdminProductCreate,
    AdminProductPageResponse,
    AdminProductResponse,
    AdminProductUpdate,
    AdminVariantResponse,
)

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

_TOMAN = 10  # 1 Toman = 10 Rial


def _parse_images(raw: str) -> List[str]:
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(u) for u in parsed]
    except (ValueError, TypeError):
        pass
    return [u.strip() for u in raw.split(",") if u.strip()]


def _serialize_variant(v: ProductVariant) -> AdminVariantResponse:
    return AdminVariantResponse(
        id=str(v.id),
        sku=v.sku,
        attributes=v.attributes or {},
        price_override_toman=v.price_rial // _TOMAN if v.price_rial is not None else None,
        fulfillment_type=v.fulfillment_type or "in_stock",
        stock_qty=max(0, v.stock),
        supplier_id=v.supplier_id,
    )


def _determine_status(p: Product) -> str:
    fulfillment_val = getattr(p.fulfillment_type, "value", str(p.fulfillment_type)).lower()
    if fulfillment_val in ("pre_order", "prewritten", "draft"):
        return "pre_order"
    return "active" if p.is_active else "inactive"


def _serialize_product(p: Product) -> AdminProductResponse:
    return AdminProductResponse(
        id=str(p.id),
        title=p.title,
        slug=p.slug,
        description=p.description,
        category_id=str(p.category_id),
        images=_parse_images(p.images),
        base_price_toman=p.base_price_rial // _TOMAN,
        status=_determine_status(p),
        variants=[_serialize_variant(v) for v in p.variants],
        created_at=p.created_at,
    )


async def _get_or_404(db: AsyncSession, product_id: str) -> Product:
    stmt = (
        select(Product)
        .where(Product.id == product_id)
        .options(selectinload(Product.variants))
    )
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise DomainException(
            message="Product not found.", code="PRODUCT_NOT_FOUND", status_code=404
        )
    return product


async def _ensure_slug_free(db: AsyncSession, slug: str, exclude_id: str = None) -> None:
    stmt = select(Product.id).where(Product.slug == slug)
    if exclude_id:
        stmt = stmt.where(Product.id != exclude_id)
    res = await db.execute(stmt)
    if res.scalar_one_or_none() is not None:
        raise DomainException(
            message=f"Slug '{slug}' is already in use.",
            code="SLUG_CONFLICT",
            status_code=422,
        )


@router.get("", response_model=AdminProductPageResponse)
async def list_admin_products(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=100),
    search: Optional[str] = Query(default=None),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Product).options(selectinload(Product.variants))
    count_stmt = select(func.count(Product.id))

    if search and search.strip():
        term = f"%{search.strip()}%"
        stmt = stmt.where(Product.title.ilike(term))
        count_stmt = count_stmt.where(Product.title.ilike(term))

    if status_filter and status_filter != "all":
        if status_filter == "active":
            stmt = stmt.where(Product.is_active == True, Product.fulfillment_type != FulfillmentType.PRE_ORDER)
            count_stmt = count_stmt.where(Product.is_active == True, Product.fulfillment_type != FulfillmentType.PRE_ORDER)
        elif status_filter == "inactive":
            stmt = stmt.where(Product.is_active == False)
            count_stmt = count_stmt.where(Product.is_active == False)
        elif status_filter in ("pre_order", "draft", "prewritten"):
            stmt = stmt.where(Product.fulfillment_type == FulfillmentType.PRE_ORDER)
            count_stmt = count_stmt.where(Product.fulfillment_type == FulfillmentType.PRE_ORDER)

    total = int((await db.execute(count_stmt)).scalar_one() or 0)
    stmt = stmt.order_by(Product.created_at.desc(), Product.title)
    stmt = stmt.offset((page - 1) * limit).limit(limit)
    products = (await db.execute(stmt)).scalars().unique().all()

    return AdminProductPageResponse(
        items=[_serialize_product(p) for p in products],
        total=total,
        page=page,
        limit=limit,
        total_pages=max(1, math.ceil(total / limit)) if total else 1,
    )


@router.post("", response_model=AdminProductResponse, status_code=status.HTTP_201_CREATED)
async def create_admin_product(
    payload: AdminProductCreate,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    await _ensure_slug_free(db, payload.slug)

    fulfillment = FulfillmentType.STANDARD
    is_active = True

    if payload.status in ("pre_order", "draft", "prewritten"):
        fulfillment = FulfillmentType.PRE_ORDER
        is_active = True
    elif payload.status == "inactive":
        is_active = False

    product = Product(
        title=payload.title,
        slug=payload.slug,
        description=payload.description or "",
        category_id=payload.category_id,
        images=json.dumps(payload.images),
        base_price_rial=payload.base_price_toman * _TOMAN,
        is_active=is_active,
        fulfillment_type=fulfillment,
    )
    db.add(product)
    await db.flush()

    for idx, v in enumerate(payload.variants):
        sku = v.sku or f"{payload.slug}-{idx + 1}"
        variant = ProductVariant(
            product_id=product.id,
            sku=sku,
            title=f"{payload.title} - Variant {idx + 1}",
            price_rial=(v.price_override_toman * _TOMAN) if v.price_override_toman else product.base_price_rial,
            stock=v.stock_qty,
            is_active=True,
            attributes=v.attributes,
            fulfillment_type=v.fulfillment_type,
            supplier_id=v.supplier_id,
        )
        db.add(variant)

    await db.commit()
    return _serialize_product(await _get_or_404(db, product.id))


@router.patch("/{product_id}", response_model=AdminProductResponse)
async def update_admin_product(
    product_id: str,
    payload: AdminProductUpdate,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await _get_or_404(db, product_id)

    if payload.slug and payload.slug != product.slug:
        await _ensure_slug_free(db, payload.slug, exclude_id=product.id)
        product.slug = payload.slug

    if payload.title is not None:
        product.title = payload.title
    if payload.description is not None:
        product.description = payload.description
    if payload.images is not None:
        product.images = json.dumps(payload.images)
    if payload.base_price_toman is not None:
        product.base_price_rial = payload.base_price_toman * _TOMAN

    if payload.status is not None:
        new_status = payload.status.lower()
        if new_status in ("pre_order", "draft", "prewritten"):
            product.fulfillment_type = FulfillmentType.PRE_ORDER
            product.is_active = True
        elif new_status == "inactive":
            product.is_active = False
        elif new_status == "active":
            product.is_active = True
            product.fulfillment_type = FulfillmentType.STANDARD

    if payload.variants:
        for v_update in payload.variants:
            stmt = select(ProductVariant).where(
                ProductVariant.id == v_update.variant_id,
                ProductVariant.product_id == product.id,
            )
            res = await db.execute(stmt)
            variant = res.scalar_one_or_none()
            if variant:
                variant.stock = v_update.stock_qty

    await db.commit()
    return _serialize_product(await _get_or_404(db, product.id))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_product(
    product_id: str,
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await _get_or_404(db, product_id)
    variant_ids = [v.id for v in product.variants]
    if variant_ids:
        order_count_stmt = select(func.count(OrderItem.id)).where(OrderItem.variant_id.in_(variant_ids))
        order_count = (await db.execute(order_count_stmt)).scalar_one() or 0
        if order_count > 0:
            raise DomainException(
                message="این محصول در سفارش‌های قبلی ثبت شده و قابل حذف نیست. می‌توانید وضعیت آن را به غیرفعال تغییر دهید.",
                code="PRODUCT_HAS_ORDERS",
                status_code=400,
            )
    for v in product.variants:
        await db.delete(v)
    await db.delete(product)
    await db.commit()
    return None


@router.post("/upload")
async def upload_admin_product_image(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_optional_user),
):
    if settings.ENVIRONMENT == "production":
        if not current_user or current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation restricted to system administrators.",
            )

    if not file.filename:
        raise DomainException(
            message="فایل ارسال شده نامعتبر است",
            code="INVALID_FILE",
            status_code=400,
        )

    content = await file.read()
    filename = storage_service.generate_safe_filename(file.filename, default_stem="product")
    url = await storage_service.upload_file(content, filename, subfolder="products")

    return {"url": url}