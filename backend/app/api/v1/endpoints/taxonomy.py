from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.taxonomy import (
    CustomColor,
    CustomSize,
    TaxonomyCategory,
    TaxonomyBrand,
    TaxonomySeason,
)
from app.schemas.taxonomy import (
    StoreTaxonomyResponse,
    CustomColorSchema,
    CustomSizeSchema,
    TaxonomyCategorySchema,
    TaxonomyBrandSchema,
    TaxonomySeasonSchema,
)
from app.core.exceptions import DomainException

router = APIRouter(prefix="/taxonomy", tags=["Taxonomy & Attributes"])


@router.get(
    "",
    response_model=StoreTaxonomyResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Full Store Taxonomy",
)
async def get_taxonomy(db: AsyncSession = Depends(get_db)):
    colors = (await db.execute(select(CustomColor))).scalars().all()
    sizes = (await db.execute(select(CustomSize).order_by(CustomSize.order.asc()))).scalars().all()
    categories = (await db.execute(select(TaxonomyCategory))).scalars().all()
    brands = (await db.execute(select(TaxonomyBrand))).scalars().all()
    seasons = (await db.execute(select(TaxonomySeason))).scalars().all()

    return StoreTaxonomyResponse(
        colors=[
            CustomColorSchema(
                id=c.slug,
                name=c.name,
                hex=c.hex,
                slug=c.slug,
                isSystemDefault=c.is_system_default,
            )
            for c in colors
        ],
        sizes=[
            CustomSizeSchema(
                id=s.name,
                name=s.name,
                group=s.group,
                order=s.order,
                isSystemDefault=s.is_system_default,
            )
            for s in sizes
        ],
        categories=[
            TaxonomyCategorySchema(
                id=cat.slug,
                name=cat.name,
                slug=cat.slug,
                division=cat.division,
                iconName=cat.icon_name,
                isActive=cat.is_active,
            )
            for cat in categories
        ],
        brands=[
            TaxonomyBrandSchema(
                id=b.slug,
                name=b.name,
                slug=b.slug,
                logoSvg=b.logo_svg,
                isFeatured=b.is_featured,
            )
            for b in brands
        ],
        seasons=[
            TaxonomySeasonSchema(
                id=sea.slug,
                name=sea.name,
                slug=sea.slug,
                isCurrentDrop=sea.is_current_drop,
                isActive=sea.is_active,
            )
            for sea in seasons
        ],
    )


@router.post(
    "/{domain}",
    status_code=status.HTTP_201_CREATED,
    summary="Create Taxonomy Entity",
)
async def create_taxonomy_entity(
    domain: str,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    valid_domains = ["colors", "sizes", "categories", "brands", "seasons"]
    if domain not in valid_domains:
        raise DomainException(message=f"دامنه نامعتبر است: {domain}", code="INVALID_DOMAIN", status_code=400)

    slug = payload.get("slug") or payload.get("id") or f"{domain[:3]}-{payload.get('name')}"

    if domain == "colors":
        ent = CustomColor(name=payload["name"], hex=payload["hex"], slug=slug)
    elif domain == "sizes":
        ent = CustomSize(name=payload["name"], group=payload.get("group", "alpha"), order=int(payload.get("order", 0)))
    elif domain == "categories":
        ent = TaxonomyCategory(name=payload["name"], slug=slug, division=payload.get("division", "apparel"), icon_name=payload.get("iconName"))
    elif domain == "brands":
        ent = TaxonomyBrand(name=payload["name"], slug=slug, is_featured=payload.get("isFeatured", False))
    elif domain == "seasons":
        ent = TaxonomySeason(name=payload["name"], slug=slug, is_current_drop=payload.get("isCurrentDrop", False))

    db.add(ent)
    await db.commit()
    tax = await get_taxonomy(db)
    return {"success": True, "entity": payload, "taxonomy": tax}


@router.put(
    "/{domain}/{item_id}",
    status_code=status.HTTP_200_OK,
    summary="Update Taxonomy Entity",
)
async def update_taxonomy_entity(
    domain: str,
    item_id: str,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    model_map = {
        "colors": CustomColor,
        "sizes": CustomSize,
        "categories": TaxonomyCategory,
        "brands": TaxonomyBrand,
        "seasons": TaxonomySeason,
    }
    model = model_map.get(domain)
    if model:
        stmt = select(model).where(
            or_(
                getattr(model, "slug", None) == item_id,
                getattr(model, "id", None) == item_id,
                getattr(model, "name", None) == item_id,
            )
        )
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        if record:
            if "name" in payload and hasattr(record, "name"):
                record.name = payload["name"]
            if "hex" in payload and hasattr(record, "hex"):
                record.hex = payload["hex"]
            if "isFeatured" in payload and hasattr(record, "is_featured"):
                record.is_featured = bool(payload["isFeatured"])
            if "isCurrentDrop" in payload and hasattr(record, "is_current_drop"):
                record.is_current_drop = bool(payload["isCurrentDrop"])
            await db.commit()

    tax = await get_taxonomy(db)
    return {"success": True, "entity": payload, "taxonomy": tax}


@router.delete(
    "/{domain}/{item_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Taxonomy Entity",
)
async def delete_taxonomy_entity(
    domain: str,
    item_id: str,
    db: AsyncSession = Depends(get_db),
):
    model_map = {
        "colors": CustomColor,
        "sizes": CustomSize,
        "categories": TaxonomyCategory,
        "brands": TaxonomyBrand,
        "seasons": TaxonomySeason,
    }
    model = model_map.get(domain)
    if model:
        stmt = select(model).where(
            or_(
                getattr(model, "slug", None) == item_id,
                getattr(model, "id", None) == item_id,
                getattr(model, "name", None) == item_id,
            )
        )
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        if record:
            await db.delete(record)
            await db.commit()

    tax = await get_taxonomy(db)
    return {"success": True, "id": item_id, "taxonomy": tax}

