from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.user import User
from app.schemas.admin_analytics import DashboardAnalyticsResponse
from app.services.admin_analytics import admin_analytics_service

router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])


@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
async def get_dashboard_analytics(
    start_date: Optional[datetime] = Query(
        default=None,
        description="Filter metrics starting from ISO date (defaults to 30 days ago)",
    ),
    end_date: Optional[datetime] = Query(
        default=None,
        description="Filter metrics up to ISO date (defaults to current time)",
    ),
    low_stock_threshold: int = Query(
        default=5, ge=0, description="Threshold quantity for stock alerts"
    ),
    top_items_limit: int = Query(
        default=5, ge=1, le=50, description="Number of top selling items to retrieve"
    ),
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves store metrics:
    - Summary (Total Revenue, Total Orders, Success Rate, Average Order Value)
    - Revenue Trends by Date
    - Top Selling Variants
    - Order Status Distribution
    - Payment Gateway Performance
    - Low Stock Warnings
    """
    return await admin_analytics_service.get_dashboard_metrics(
        db=db,
        start_date=start_date,
        end_date=end_date,
        low_stock_threshold=low_stock_threshold,
        top_items_limit=top_items_limit,
    )