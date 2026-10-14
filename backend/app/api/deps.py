from typing import Optional

import jwt
import redis.asyncio as aioredis
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.db.session import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.enums import UserRole

security_scheme = HTTPBearer()
optional_bearer = HTTPBearer(auto_error=False)

_redis_pool: Optional[Redis] = None


def get_redis() -> Redis:
    """Lazily-created shared async Redis connection pool (cart storage)."""
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            decode_responses=False,
        )
    return _redis_pool


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type.",
            )
        user_id: str = payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired.",
        )

    stmt = select(User).where(User.id == user_id).options(selectinload(User.addresses))
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account disabled.",
        )

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Resolves the current user when a valid Bearer token is supplied; returns
    None for anonymous/guest requests instead of rejecting them (401).
    Used by guest-capable endpoints (e.g., cart).
    """
    if credentials is None:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            return None
        user_id: Optional[str] = payload.get("sub")
    except jwt.PyJWTError:
        return None

    result = await db.execute(select(User).where(User.id == user_id).options(selectinload(User.addresses)))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        return None
    return user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to system administrators.",
        )
    return current_user


get_optional_current_user = get_optional_user