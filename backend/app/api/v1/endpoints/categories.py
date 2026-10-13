import re
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import DomainException
from app.db.session import get_db
from app.models.product import Category, Product
from app.schemas.product import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Catalog & Products"])


class CategoryCreateInput(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None


def _slugify(text: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", text.strip().lower())
    return re.sub(r"[-\s]+", "-", cleaned) or f"cat-{abs(hash(text)) % 100000}"


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Categories",
    description="Product categories used by storefront and admin.",
)
async def list_categories(
    only_with_products: bool = Query(
        False,
        description="Filter to categories having at least one active product (storefront view)",
    ),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    stmt = select(Category)

    if only_with_products:
        stmt = (
            stmt.join(Product, Product.category_id == Category.id)
            .where(Product.is_active == True)
            .group_by(Category.id)
            .having(func.count(Product.id) > 0)
        )

    stmt = stmt.order_by(Category.title.asc())
    result = await db.execute(stmt)
    categories = result.scalars().all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "name": c.title,
            "slug": c.slug,
            "description": getattr(c, "description", None),
            "icon": getattr(c, "icon", None),
            "parent_id": getattr(c, "parent_id", None),
        }
        for c in categories
    ]


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create Category",
    description="Add a new category dynamically from admin panel.",
)
async def create_category(
    payload: CategoryCreateInput,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    raw_slug = payload.slug.strip() if payload.slug and payload.slug.strip() else _slugify(payload.title)

    # Check for duplicate slug
    existing = await db.execute(select(Category).where(Category.slug == raw_slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دسته‌بندی با این شناسه انگلیسی (slug) قبلاً ثبت شده است.",
        )

    category = Category(
        title=payload.title.strip(),
        slug=raw_slug,
        description=payload.description.strip() if payload.description else None,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)

    return {
        "id": category.id,
        "title": category.title,
        "name": category.title,
        "slug": category.slug,
        "description": category.description,
        "icon": None,
        "parent_id": None,
    }


@router.get(
    "/{slug}",
    response_model=CategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Category by Slug",
)
async def get_category_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> CategoryResponse:
    stmt = select(Category).where(Category.slug == slug)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()
    if not category:
        raise DomainException(
            message=f"Category with slug '{slug}' was not found.",
            code="CATEGORY_NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return CategoryResponse.model_validate(category)
