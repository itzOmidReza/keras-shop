from typing import Optional
from fastapi import APIRouter, Cookie, Depends, Header, Response, status
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_db, get_optional_user, get_redis
from app.models.user import User
from app.schemas.cart import CartItemAddRequest, CartItemUpdateRequest, CartResponse
from app.services.cart import cart_service
from typing import Tuple

router = APIRouter(prefix="/cart", tags=["Cart"])


def _resolve_session_id(
    cart_session_id: Optional[str] = Cookie(None),
    x_cart_session_id: Optional[str] = Header(None, alias="X-Cart-Session-ID"),
) -> Tuple[str, bool]:
    """Retrieves session ID from Cookie/Header or generates a new one."""
    sid = cart_session_id or x_cart_session_id
    is_new = False
    if not sid:
        sid = str(uuid.uuid4())
        is_new = True
    return sid, is_new


@router.get("", response_model=CartResponse)
async def get_cart(
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    cart_session_info: Tuple[str, bool] = Depends(_resolve_session_id),
):
    session_id, is_new = cart_session_info
    if is_new and not current_user:
        response.set_cookie("cart_session_id", session_id, max_age=604800, httponly=True)

    user_id = str(current_user.id) if current_user else None
    return await cart_service.get_cart(
        redis, db, user_id=user_id, session_id=session_id if not user_id else None
    )


@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    request: CartItemAddRequest,
    response: Response,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    cart_session_info: Tuple[str, bool] = Depends(_resolve_session_id),
):
    session_id, is_new = cart_session_info
    if is_new and not current_user:
        response.set_cookie("cart_session_id", session_id, max_age=604800, httponly=True)

    user_id = str(current_user.id) if current_user else None
    return await cart_service.add_item(
        redis=redis,
        db=db,
        user_id=user_id,
        session_id=session_id if not user_id else None,
        variant_id=request.variant_id,
        quantity=request.quantity,
    )


@router.patch("/items/{variant_id}", response_model=CartResponse)
async def update_cart_item(
    variant_id: str,
    request: CartItemUpdateRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
    cart_session_info: Tuple[str, bool] = Depends(_resolve_session_id),
):
    session_id, _ = cart_session_info
    user_id = str(current_user.id) if current_user else None
    return await cart_service.update_item_quantity(
        redis=redis,
        db=db,
        user_id=user_id,
        session_id=session_id if not user_id else None,
        variant_id=variant_id,
        quantity=request.quantity,
    )


@router.post("/merge", status_code=status.HTTP_204_NO_CONTENT)
async def merge_cart_on_login(
    guest_session_id: str = Header(..., alias="X-Guest-Session-ID"),
    current_user: User = Depends(get_optional_user),  # Requires Auth
    db: AsyncSession = Depends(get_db),
    redis: Redis = Depends(get_redis),
):
    """Called automatically after authentication to merge temporary guest items into user cart."""
    if current_user and guest_session_id:
        await cart_service.merge_guest_cart_into_user_cart(
            redis=redis,
            db=db,
            guest_session_id=guest_session_id,
            user_id=str(current_user.id),
        )