from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from app.core.config import settings

# Enterprise production connection pool limits
async_engine: AsyncEngine = create_async_engine(
    settings.ASYNC_DATABASE_URI,
    echo=False,                  # Set to True only during raw query debugging
    future=True,
    pool_size=20,               # Maximum persistent connections
    max_overflow=10,            # Temporary burst connections during high load
    pool_timeout=30.0,          # Seconds to wait before throwing timeout error
    pool_recycle=1800,          # Recycle connections every 30 mins to prevent stale sockets
    pool_pre_ping=True,         # Health-check connection before handing to a request
)

# Thread-safe async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,     # Prevents unexpected lazy-loading I/O errors post-commit
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an isolated async database session per request.
    Guarantees session closure even if exceptions occur.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()