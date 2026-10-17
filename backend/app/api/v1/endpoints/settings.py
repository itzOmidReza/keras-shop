from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.settings import SiteSetting
from app.schemas.settings import SiteSettingsResponse, SiteBrandingSettings, SiteContactSettings, SiteShippingSettings, SiteCheckoutRules, SiteSocialSettings, SiteIntegrationsSettings, SiteHomeHeroSettings
from sqlalchemy.orm.attributes import flag_modified

router = APIRouter(tags=["Site Settings"])


@router.get(
    "/settings",
    response_model=SiteSettingsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Site & Storefront Settings",
)
async def get_site_settings(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SiteSetting))
    records = res.scalars().all()

    settings_dict = {}
    for r in records:
        settings_dict[r.key] = r.value

    resp = SiteSettingsResponse()
    if "branding" in settings_dict:
        resp.branding = SiteBrandingSettings(**settings_dict["branding"])
    if "contact" in settings_dict:
        resp.contact = SiteContactSettings(**settings_dict["contact"])
    if "shipping" in settings_dict:
        resp.shipping = SiteShippingSettings(**settings_dict["shipping"])
    if "checkoutRules" in settings_dict:
        resp.checkoutRules = SiteCheckoutRules(**settings_dict["checkoutRules"])
    if "social" in settings_dict:
        resp.social = SiteSocialSettings(**settings_dict["social"])
    if "integrations" in settings_dict:
        resp.integrations = SiteIntegrationsSettings(**settings_dict["integrations"])
    if "homeHero" in settings_dict:
        resp.homeHero = SiteHomeHeroSettings(**settings_dict["homeHero"])

    resp.updatedAt = datetime.now(timezone.utc).isoformat()
    return resp


@router.put(
    "/settings",
    response_model=SiteSettingsResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Site Settings",
)
async def update_site_settings(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    for key, value in payload.items():
        if isinstance(value, dict):
            res = await db.execute(select(SiteSetting).where(SiteSetting.key == key))
            record = res.scalar_one_or_none()
            if not record:
                record = SiteSetting(key=key, value=dict(value))
                db.add(record)
            else:
                current_val = dict(record.value or {})
                current_val.update(value)
                record.value = current_val
                flag_modified(record, "value")

    await db.commit()
    return await get_site_settings(db)

