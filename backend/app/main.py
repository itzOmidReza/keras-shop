import asyncio
import logging
from contextlib import asynccontextmanager
import httpx
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import (
    DomainException,
    domain_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)
from app.core.middleware import SecurityHeadersMiddleware
from app.core.openapi import custom_openapi
from app.api.v1.router import api_v1_router
from app.db.session import async_engine as engine, AsyncSessionLocal
from app.services.order import order_service


logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("sage.main")


async def expired_orders_cleanup_worker():
    """Periodically marks uncompleted orders as CANCELLED and restores reserved inventory."""
    while True:
        try:
            await asyncio.sleep(300)  # Check every 5 minutes
            async with AsyncSessionLocal() as session:
                cancelled = await order_service.cancel_expired_pending_orders(session, older_than_minutes=30)
                if cancelled > 0:
                    logger.info(f"🧹 Released stock for {cancelled} expired order(s).")
        except asyncio.CancelledError:
            break
        except Exception as exc:
            logger.error(f"Error running order expiry cleanup worker: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🚀 Launching Sage Engine [{settings.ENVIRONMENT.upper()}]")
    cleanup_task = asyncio.create_task(expired_orders_cleanup_worker())
    yield
    cleanup_task.cancel()
    logger.info("🛑 Shutting down Sage Engine - closing database connection pool...")
    await engine.dispose()


app = FastAPI(
    title="Sage E-Commerce Core API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.openapi = lambda: custom_openapi(app)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(SecurityHeadersMiddleware)

app.add_exception_handler(DomainException, domain_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


@app.get("/", tags=["System Diagnostics"], include_in_schema=False)
async def root():
    return {
        "name": "Sage E-Commerce Core API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


@app.get(
    "/health",
    tags=["System Diagnostics"],
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
)
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


class ContactFormPayload(BaseModel):
    name: str
    phone: str
    email: str
    subject: str
    message: str


@app.post(
    "/api/contact",
    tags=["Contact Support"],
    summary="Relay contact form submission to local support bot",
    status_code=status.HTTP_200_OK,
)
async def handle_contact_submission(payload: ContactFormPayload):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "http://127.0.0.1:8081/api/contact-webhook",
                json=payload.model_dump(),
            )
            if resp.status_code != 200:
                logger.error(f"Support bot webhook returned code {resp.status_code}: {resp.text}")
                raise HTTPException(status_code=502, detail="خطا در ثبت پیام پشتیبانی")
            return resp.json()
    except httpx.RequestError as exc:
        logger.error(f"Failed connecting to support bot service on port 8081: {exc}")
        raise HTTPException(status_code=502, detail="سرویس پشتیبانی در دسترس نیست")

from app.api.v1.router import api_v1_router, api_direct_router

app.include_router(api_v1_router, prefix="/api")
app.include_router(api_direct_router, prefix="/api")