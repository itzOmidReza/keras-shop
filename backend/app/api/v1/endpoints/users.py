from typing import List, Optional
from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, Address
from app.models.order import Order
from app.models.enums import UserRole
from app.schemas.user import (
    UserProfileResponse,
    UserProfileUpdate,
    AddressResponse,
    AddressCreate,
    AddressUpdate,
)
from app.schemas.order import OrderReceiptResponse, CartItemSchema, ShippingAddressSchema
from app.services.user import user_service
from app.core.exceptions import DomainException

router = APIRouter(tags=["User Profile & Addresses"])


def _map_user_to_response(u: User) -> UserProfileResponse:
    addr_list = []
    for a in getattr(u, "addresses", []):
        addr_list.append(
            AddressResponse(
                id=str(a.id),
                title=a.title,
                fullName=a.receiver_name,
                phoneNumber=a.receiver_phone,
                province=a.province,
                city=a.city,
                postalCode=a.postal_code,
                exactAddress=a.postal_address,
                buildingNumber=getattr(a, "building_number", None),
                unit=getattr(a, "unit", None),
                notes=getattr(a, "notes", None),
                isDefault=a.is_default,
                user_id=str(u.id),
                receiver_name=a.receiver_name,
                receiver_phone=a.receiver_phone,
                postal_address=a.postal_address,
                postal_code=a.postal_code,
                is_default=a.is_default,
            )
        )

    full_name = u.full_name or (
        f"{u.first_name} {u.last_name}".strip() if (u.first_name or u.last_name) else "کاربر گرامی کراس"
    )

    return UserProfileResponse(
        id=str(u.id),
        phoneNumber=u.phone,
        phone=u.phone,
        fullName=full_name,
        full_name=full_name,
        first_name=u.first_name,
        last_name=u.last_name,
        email=u.email,
        birth_date=u.birth_date,
        role="super_admin" if u.role == UserRole.ADMIN else u.role.value,
        is_active=u.is_active,
        createdAt=u.created_at.isoformat() if hasattr(u, "created_at") and u.created_at else None,
        addresses=addr_list,
    )


def _map_address_to_response(a: Address) -> AddressResponse:
    return AddressResponse(
        id=str(a.id),
        title=a.title,
        fullName=a.receiver_name,
        phoneNumber=a.receiver_phone,
        province=a.province,
        city=a.city,
        postalCode=a.postal_code,
        exactAddress=a.postal_address,
        buildingNumber=getattr(a, "building_number", None),
        unit=getattr(a, "unit", None),
        notes=getattr(a, "notes", None),
        isDefault=a.is_default,
        user_id=str(a.user_id),
        receiver_name=a.receiver_name,
        receiver_phone=a.receiver_phone,
        postal_address=a.postal_address,
        postal_code=a.postal_code,
        is_default=a.is_default,
    )


# -------------------------------------------------------------
# User Profile Endpoints (/users/me & /user/profile)
# -------------------------------------------------------------

@router.get("/users/me", response_model=UserProfileResponse)
@router.get("/user/profile", response_model=UserProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
):
    return _map_user_to_response(current_user)


@router.patch("/users/me", response_model=UserProfileResponse)
@router.put("/user/profile", response_model=UserProfileResponse)
async def update_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if payload.fullName or payload.full_name:
        current_user.full_name = payload.fullName or payload.full_name
    if payload.email is not None:
        current_user.email = payload.email
    if payload.birth_date is not None:
        current_user.birth_date = payload.birth_date

    await db.commit()
    res = await db.execute(select(User).where(User.id == current_user.id).options(selectinload(User.addresses)))
    return _map_user_to_response(res.scalar_one())


# -------------------------------------------------------------
# User Addresses Endpoints (/users/me/addresses & /user/addresses)
# -------------------------------------------------------------

@router.get("/users/me/addresses", response_model=List[AddressResponse])
@router.get("/user/addresses", response_model=List[AddressResponse])
async def list_addresses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Address).where(Address.user_id == current_user.id).order_by(Address.is_default.desc())
    res = await db.execute(stmt)
    addresses = res.scalars().all()
    return [_map_address_to_response(a) for a in addresses]


@router.post("/users/me/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
@router.post("/user/addresses", response_model=AddressResponse, status_code=status.HTTP_200_OK)
async def create_address(
    payload: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    is_default = bool(payload.isDefault or payload.is_default)
    if is_default:
        existing = await db.execute(select(Address).where(Address.user_id == current_user.id))
        for item in existing.scalars().all():
            item.is_default = False

    addr = Address(
        user_id=current_user.id,
        title=payload.title,
        receiver_name=payload.fullName or payload.receiver_name or current_user.full_name or "کاربر",
        receiver_phone=payload.phoneNumber or payload.receiver_phone or current_user.phone,
        province=payload.province,
        city=payload.city,
        postal_address=payload.exactAddress or payload.postal_address or "",
        postal_code=payload.postalCode or payload.postal_code or "1111111111",
        building_number=payload.buildingNumber or payload.building_number,
        unit=payload.unit,
        notes=payload.notes,
        is_default=is_default,
    )
    db.add(addr)
    await db.commit()
    await db.refresh(addr)
    return _map_address_to_response(addr)


@router.put("/user/addresses/{address_id}/default", status_code=status.HTTP_200_OK)
async def set_default_address(
    address_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(Address).where(Address.id == address_id, Address.user_id == current_user.id))
    addr = res.scalar_one_or_none()
    if not addr:
        raise DomainException(message="Address not found", code="NOT_FOUND", status_code=404)

    all_user_addr = await db.execute(select(Address).where(Address.user_id == current_user.id))
    for a in all_user_addr.scalars().all():
        a.is_default = (a.id == addr.id)

    await db.commit()
    return {"success": True, "message": "نشانی پیش‌فرض تغییر یافت."}


@router.delete("/users/me/addresses/{address_id}")
@router.delete("/user/addresses/{address_id}")
async def delete_address(
    address_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(Address).where(Address.id == address_id, Address.user_id == current_user.id))
    addr = res.scalar_one_or_none()
    if addr:
        await db.delete(addr)
        await db.commit()
    return {"success": True}


# -------------------------------------------------------------
# User Orders (/user/orders)
# -------------------------------------------------------------

@router.get("/user/orders")
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Order)
        .options(selectinload(Order.items))
        .where(
            (Order.user_id == current_user.id) | (Order.phone_number == current_user.phone)
        )
        .order_by(Order.created_at.desc())
        .limit(20)
    )
    res = await db.execute(stmt)
    orders = res.scalars().all()

    output = []
    for o in orders:
        items = []
        for it in o.items:
            items.append({
                "id": str(it.id),
                "productId": it.product_id or 1,
                "title": it.product_title,
                "slug": it.product_slug or "product",
                "size": it.size or "Free",
                "color": it.color or "",
                "price": int(it.unit_price_rial // 10),
                "quantity": it.quantity,
                "maxStock": 10,
                "image": it.image or "",
            })

        recipient_name = o.customer_name or "مشتری کراس"
        recipient_phone = o.phone_number or ""
        carrier_name = o.shipping_method or "پست پیشتاز"
        if carrier_name == "standard":
            carrier_name = "شرکت ملی پست (پیشتاز)"
        formatted_address = f"{o.province or ''}، {o.city or ''}، {o.postal_address or ''}".strip("، ")

        st_val = o.status.value
        if st_val == "cancelled":
            st_val = "canceled"

        output.append({
            "orderNumber": o.order_number,
            "createdAt": o.created_at.strftime("%Y/%m/%d - %H:%M") if o.created_at else "",
            "status": st_val,
            "statusLabel": o.status_label or "در حال پردازش",
            "recipientName": recipient_name,
            "recipientPhone": recipient_phone,
            "shippingAddress": formatted_address or "تهران، آتلیه کراس",
            "shippingAddressDetails": {
                "fullName": recipient_name,
                "phoneNumber": recipient_phone,
                "province": o.province,
                "city": o.city,
                "postalCode": o.postal_code,
                "exactAddress": o.postal_address,
            },
            "carrier": carrier_name,
            "trackingCode": o.tracking_code or "",
            "finalTotal": int(o.total_amount_rial // 10),
            "totalAmount": int(o.total_amount_rial // 10),
            "itemCount": len(items),
            "items": items,
        })
    return output