from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.models.user import User, Address
from app.schemas.user import UserProfileUpdate, AddressCreate, AddressUpdate
from app.core.exceptions import DomainException


class UserService:

    # --- Profile Operations ---

    @staticmethod
    async def get_profile(db: AsyncSession, user_id: str) -> User:
        # Addresses must be eager-loaded: they are serialized in the response
        # and lazy-loading is unavailable in async sessions (MissingGreenlet).
        stmt = (
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.addresses))
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise DomainException(
                message="User profile not found.",
                code="USER_NOT_FOUND",
                status_code=404,
            )
        return user

    @staticmethod
    async def update_profile(
        db: AsyncSession, user: User, payload: UserProfileUpdate
    ) -> User:
        update_data = payload.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        # Sync full_name when either first_name or last_name is updated
        if "first_name" in update_data or "last_name" in update_data:
            parts = [user.first_name or "", user.last_name or ""]
            user.full_name = " ".join(p for p in parts if p).strip() or None

        await db.commit()

        # Re-fetch with addresses eager-loaded (required by UserProfileResponse;
        # lazy-loading after commit is unavailable in async sessions)
        stmt = (
            select(User)
            .where(User.id == user.id)
            .options(selectinload(User.addresses))
        )
        result = await db.execute(stmt)
        return result.scalar_one()

    
    # --- Address CRUD Operations ---

    @staticmethod
    async def list_addresses(db: AsyncSession, user_id: str) -> List[Address]:
        stmt = select(Address).where(Address.user_id == user_id).order_by(Address.is_default.desc())
        result = await db.execute(stmt)
        return list(result.scalars().all())

    @staticmethod
    async def create_address(
        db: AsyncSession, user_id: str, payload: AddressCreate
    ) -> Address:
        # If set to default, unset any existing default address for this user
        if payload.is_default:
            await UserService._clear_default_address(db, user_id)

        address = Address(
            user_id=user_id,
            **payload.model_dump()
        )
        db.add(address)
        await db.commit()
        await db.refresh(address)
        return address

    @staticmethod
    async def update_address(
        db: AsyncSession, user_id: str, address_id: str, payload: AddressUpdate
    ) -> Address:
        stmt = select(Address).where(Address.id == address_id, Address.user_id == user_id)
        result = await db.execute(stmt)
        address = result.scalar_one_or_none()

        if not address:
            raise DomainException(
                message="Address not found or does not belong to this user.",
                code="ADDRESS_NOT_FOUND",
                status_code=404,
            )

        update_data = payload.model_dump(exclude_unset=True)

        if update_data.get("is_default") is True:
            await UserService._clear_default_address(db, user_id)

        for field, value in update_data.items():
            setattr(address, field, value)

        await db.commit()
        await db.refresh(address)
        return address

    @staticmethod
    async def delete_address(db: AsyncSession, user_id: str, address_id: str) -> None:
        stmt = select(Address).where(Address.id == address_id, Address.user_id == user_id)
        result = await db.execute(stmt)
        address = result.scalar_one_or_none()

        if not address:
            raise DomainException(
                message="Address not found or does not belong to this user.",
                code="ADDRESS_NOT_FOUND",
                status_code=404,
            )

        await db.delete(address)
        await db.commit()

    @staticmethod
    async def _clear_default_address(db: AsyncSession, user_id: str) -> None:
        stmt = (
            update(Address)
            .where(Address.user_id == user_id, Address.is_default == True)
            .values(is_default=False)
        )
        await db.execute(stmt)


user_service = UserService()