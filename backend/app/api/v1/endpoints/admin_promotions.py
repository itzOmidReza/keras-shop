from datetime import timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.api.deps import require_admin
from app.models.user import User
from app.models.coupon import Coupon
from app.models.campaign import Campaign
from app.models.product import Product, Category
from app.schemas.coupon import CouponCreateRequest, CouponResponse
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse

router = APIRouter(prefix="/admin/promotions", tags=["Admin Promotions"])

# ==================== COUPONS ====================

@router.get("/coupons", response_model=List[CouponResponse])
async def list_coupons(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    stmt = select(Coupon).order_by(Coupon.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post("/coupons", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
async def create_coupon(
    payload: CouponCreateRequest,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    existing = await db.execute(select(Coupon).where(Coupon.code == payload.code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A coupon with this code already exists.")

    coupon_data = payload.model_dump()
    if coupon_data.get("valid_from") and coupon_data["valid_from"].tzinfo is None:
        coupon_data["valid_from"] = coupon_data["valid_from"].replace(tzinfo=timezone.utc)
    if coupon_data.get("valid_until") and coupon_data["valid_until"].tzinfo is None:
        coupon_data["valid_until"] = coupon_data["valid_until"].replace(tzinfo=timezone.utc)
    if (
        coupon_data.get("valid_from")
        and coupon_data.get("valid_until")
        and coupon_data["valid_from"] >= coupon_data["valid_until"]
    ):
        raise HTTPException(
            status_code=400,
            detail="The coupon valid_until timestamp must be strictly after valid_from.",
        )

    coupon = Coupon(**coupon_data)
    db.add(coupon)
    await db.commit()
    await db.refresh(coupon)
    return coupon


@router.patch("/coupons/{coupon_id}/toggle", response_model=CouponResponse)
async def toggle_coupon(
    coupon_id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    stmt = select(Coupon).where(Coupon.id == coupon_id)
    res = await db.execute(stmt)
    coupon = res.scalar_one_or_none()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    coupon.is_active = not coupon.is_active
    await db.commit()
    await db.refresh(coupon)
    return coupon


# ==================== CAMPAIGNS ====================

@router.get("/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    stmt = (
        select(Campaign)
        .options(
            selectinload(Campaign.products),
            selectinload(Campaign.categories),
        )
        .order_by(Campaign.created_at.desc())
    )
    res = await db.execute(stmt)
    campaigns = res.scalars().all()

    output = []
    for c in campaigns:
        output.append(
            CampaignResponse(
                id=c.id,
                title=c.title,
                slug=c.slug,
                description=c.description,
                banner_url=c.banner_url,
                discount_type=c.discount_type,
                discount_value=c.discount_value,
                is_active=c.is_active,
                start_date=c.start_date,
                end_date=c.end_date,
                product_ids=[p.id for p in c.products],
                category_ids=[cat.id for cat in c.categories],
            )
        )
    return output


@router.post("/campaigns", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    payload: CampaignCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    existing = await db.execute(select(Campaign).where(Campaign.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A campaign with this slug already exists.")

    start_date = (
        payload.start_date
        if payload.start_date.tzinfo is not None
        else payload.start_date.replace(tzinfo=timezone.utc)
    )
    end_date = (
        payload.end_date
        if payload.end_date.tzinfo is not None
        else payload.end_date.replace(tzinfo=timezone.utc)
    )
    if start_date >= end_date:
        raise HTTPException(
            status_code=400,
            detail="The campaign end_date must be strictly after start_date.",
        )

    campaign_data = payload.model_dump(exclude={"product_ids", "category_ids", "start_date", "end_date"})
    campaign = Campaign(
        **campaign_data,
        start_date=start_date,
        end_date=end_date,
    )

    if payload.product_ids:
        p_stmt = select(Product).where(Product.id.in_(payload.product_ids))
        products = (await db.execute(p_stmt)).scalars().all()
        if len(products) != len(payload.product_ids):
            found_ids = {p.id for p in products}
            missing = sorted(list(set(payload.product_ids) - found_ids))
            raise HTTPException(
                status_code=400,
                detail=f"The following products were not found: {missing}",
            )
        campaign.products = list(products)

    if payload.category_ids:
        c_stmt = select(Category).where(Category.id.in_(payload.category_ids))
        categories = (await db.execute(c_stmt)).scalars().all()
        if len(categories) != len(payload.category_ids):
            found_ids = {c.id for c in categories}
            missing = sorted(list(set(payload.category_ids) - found_ids))
            raise HTTPException(
                status_code=400,
                detail=f"The following categories were not found: {missing}",
            )
        campaign.categories = list(categories)

    db.add(campaign)
    await db.commit()

    # Re-query with eager relationships to safely serialize without lazy-loading issues
    stmt = (
        select(Campaign)
        .options(
            selectinload(Campaign.products),
            selectinload(Campaign.categories),
        )
        .where(Campaign.id == campaign.id)
    )
    campaign = (await db.execute(stmt)).scalar_one()

    return CampaignResponse(
        id=campaign.id,
        title=campaign.title,
        slug=campaign.slug,
        description=campaign.description,
        banner_url=campaign.banner_url,
        discount_type=campaign.discount_type,
        discount_value=campaign.discount_value,
        is_active=campaign.is_active,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        product_ids=[p.id for p in campaign.products],
        category_ids=[c.id for c in campaign.categories],
    )


@router.patch("/campaigns/{campaign_id}/toggle", response_model=CampaignResponse)
async def toggle_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_admin),
):
    stmt = (
        select(Campaign)
        .options(
            selectinload(Campaign.products),
            selectinload(Campaign.categories),
        )
        .where(Campaign.id == campaign_id)
    )
    res = await db.execute(stmt)
    campaign = res.scalar_one_or_none()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found.")

    campaign.is_active = not campaign.is_active
    await db.commit()

    return CampaignResponse(
        id=campaign.id,
        title=campaign.title,
        slug=campaign.slug,
        description=campaign.description,
        banner_url=campaign.banner_url,
        discount_type=campaign.discount_type,
        discount_value=campaign.discount_value,
        is_active=campaign.is_active,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        product_ids=[p.id for p in campaign.products],
        category_ids=[c.id for c in campaign.categories],
    )

