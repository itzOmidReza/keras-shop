import json
from typing import Any, Dict, Optional, Tuple

import redis.asyncio as aioredis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import DomainException
from app.models.product import ProductVariant
from app.schemas.cart import CartItemResponse, CartResponse


class CartService:
    GUEST_CART_TTL = 60 * 60 * 24 * 7  # 7 days in seconds

    def _get_cart_key(self, user_id: Optional[str], session_id: Optional[str]) -> str:
        if user_id:
            return f"cart:user:{user_id}"
        if session_id:
            return f"cart:guest:{session_id}"
        raise DomainException(
            message="Neither user identity nor guest session was provided.",
            code="INVALID_CART_OWNER",
            status_code=400,
        )

    async def add_item(
        self,
        redis: aioredis.Redis,
        db: AsyncSession,
        user_id: Optional[str],
        session_id: Optional[str],
        variant_id: str,
        quantity: int,
    ) -> CartResponse:
        cart_key = self._get_cart_key(user_id, session_id)

        # Validate variant existence & stock & active status
        stmt = select(ProductVariant).where(ProductVariant.id == variant_id)
        res = await db.execute(stmt)
        variant = res.scalar_one_or_none()

        if not variant:
            raise DomainException(
                message=f"Variant ID {variant_id} not found.",
                code="VARIANT_NOT_FOUND",
                status_code=404,
            )

        if not variant.is_active:
            raise DomainException(
                message=f"Item '{variant.title}' is currently unavailable.",
                code="VARIANT_INACTIVE",
                status_code=400,
            )

        # Get current quantity in cart
        existing_data = await redis.hget(cart_key, variant_id)
        current_qty = 0
        if existing_data:
            current_qty = json.loads(existing_data).get("quantity", 0)

        new_qty = current_qty + quantity
        if variant.stock < new_qty:
            raise DomainException(
                message=f"Cannot add {quantity} item(s). Only {variant.stock} available in stock.",
                code="INSUFFICIENT_STOCK",
                status_code=400,
            )

        # Save to Redis
        payload = {"quantity": new_qty}
        await redis.hset(cart_key, variant_id, json.dumps(payload))

        # Set expiration if it's a guest cart
        if not user_id:
            await redis.expire(cart_key, self.GUEST_CART_TTL)

        return await self.get_cart(redis, db, user_id, session_id)

    async def update_item_quantity(
        self,
        redis: aioredis.Redis,
        db: AsyncSession,
        user_id: Optional[str],
        session_id: Optional[str],
        variant_id: str,
        quantity: int,
    ) -> CartResponse:
        cart_key = self._get_cart_key(user_id, session_id)

        if quantity == 0:
            await redis.hdel(cart_key, variant_id)
        else:
            stmt = select(ProductVariant).where(ProductVariant.id == variant_id)
            res = await db.execute(stmt)
            variant = res.scalar_one_or_none()

            if not variant:
                raise DomainException(
                    message=f"Variant ID {variant_id} not found.",
                    code="VARIANT_NOT_FOUND",
                    status_code=404,
                )
            if not variant.is_active or variant.stock < quantity:
                raise DomainException(
                    message="Requested quantity exceeds available stock or item is no longer active.",
                    code="INSUFFICIENT_STOCK",
                    status_code=400,
                )

            await redis.hset(cart_key, variant_id, json.dumps({"quantity": quantity}))

        return await self.get_cart(redis, db, user_id, session_id)

    async def get_cart(
        self,
        redis: aioredis.Redis,
        db: AsyncSession,
        user_id: Optional[str],
        session_id: Optional[str],
    ) -> CartResponse:
        cart_key = self._get_cart_key(user_id, session_id)
        raw_items: Dict[bytes, bytes] = await redis.hgetall(cart_key)

        if not raw_items:
            return CartResponse(items=[], subtotal_rial=0, total_items=0)

        # Extract variant IDs and quantities
        item_qty_map = {
            k.decode("utf-8"): json.loads(v.decode("utf-8"))["quantity"]
            for k, v in raw_items.items()
        }

        # Query database for up-to-date pricing and titles
        stmt = (
            select(ProductVariant)
            .where(ProductVariant.id.in_(list(item_qty_map.keys())))
            .options(selectinload(ProductVariant.product))
        )
        res = await db.execute(stmt)
        variants = res.scalars().all()

        # Purge stale hash entries whose variants no longer exist in the DB
        found_ids = {v.id for v in variants}
        stale_ids = set(item_qty_map.keys()) - found_ids
        if stale_ids:
            await redis.hdel(cart_key, *stale_ids)

        items_response = []
        subtotal = 0
        total_items = 0

        for variant in variants:
            qty = item_qty_map.get(variant.id, 0)
            item_total = variant.price_rial * qty
            subtotal += item_total
            total_items += qty

            items_response.append(
                CartItemResponse(
                    variant_id=variant.id,
                    product_title=variant.product.title if variant.product else "Product",
                    variant_title=variant.title,
                    price_rial=variant.price_rial,
                    price_toman=variant.price_rial // 10,
                    quantity=qty,
                    total_price_rial=item_total,
                    total_price_toman=item_total // 10,
                    stock_available=variant.stock,
                )
            )

        return CartResponse(
            items=items_response,
            subtotal_rial=subtotal,
            subtotal_toman=subtotal // 10,
            total_items=total_items,
        )

    async def merge_guest_cart_into_user_cart(
        self,
        redis: aioredis.Redis,
        db: AsyncSession,
        guest_session_id: str,
        user_id: str,
    ) -> None:
        """
        Merges guest cart items into the authenticated user's cart on login/register.
        Resolves conflicts by selecting the highest requested quantity capped at available stock.
        """
        guest_key = f"cart:guest:{guest_session_id}"
        user_key = f"cart:user:{user_id}"

        guest_items = await redis.hgetall(guest_key)
        if not guest_items:
            return  # No guest cart to merge

        user_items = await redis.hgetall(user_key)
        user_cart = {
            k.decode("utf-8"): json.loads(v.decode("utf-8"))["quantity"]
            for k, v in user_items.items()
        }

        # Fetch variants to check stock limits
        all_variant_ids = list(
            set(
                [k.decode("utf-8") for k in guest_items.keys()]
                + list(user_cart.keys())
            )
        )
        stmt = select(ProductVariant).where(ProductVariant.id.in_(all_variant_ids))
        res = await db.execute(stmt)
        variants_map = {v.id: v for v in res.scalars().all()}

        # Merge logic
        for k, v in guest_items.items():
            variant_id = k.decode("utf-8")
            guest_qty = json.loads(v.decode("utf-8"))["quantity"]
            existing_user_qty = user_cart.get(variant_id, 0)

            variant = variants_map.get(variant_id)
            if not variant:
                continue

            merged_qty = existing_user_qty + guest_qty
            # Cap quantity at maximum available stock
            final_qty = min(merged_qty, variant.stock)

            if final_qty > 0:
                user_cart[variant_id] = final_qty

        # Write merged state back to user cart
        pipe = redis.pipeline()
        for vid, qty in user_cart.items():
            pipe.hset(user_key, vid, json.dumps({"quantity": qty}))

        # Clear guest cart
        pipe.delete(guest_key)
        await pipe.execute()


cart_service = CartService()