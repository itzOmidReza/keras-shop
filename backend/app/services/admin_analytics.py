from datetime import datetime, timedelta, timezone
from typing import List, Optional
from sqlalchemy import case, cast, Date, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.enums import OrderStatus, PaymentStatus
from app.models.order import Order, OrderItem, PaymentTransaction
from app.models.product import ProductVariant
from app.schemas.admin_analytics import (
    DashboardAnalyticsResponse,
    DailyRevenueTrend,
    LowStockAlert,
    MetricSummary,
    OrderStatusDistribution,
    PaymentGatewayMetric,
    TopSellingVariant,
)


class AdminAnalyticsService:

    @staticmethod
    async def get_dashboard_metrics(
        db: AsyncSession,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        low_stock_threshold: int = 5,
        top_items_limit: int = 5,
    ) -> DashboardAnalyticsResponse:
        """
        Aggregates dashboard KPI metrics across orders, payments, products, and inventory.
        """
        # Default timeframe: Last 30 days (timezone-aware UTC)
        if not end_date:
            end_date = datetime.now(timezone.utc)
        elif end_date.tzinfo is None:
            end_date = end_date.replace(tzinfo=timezone.utc)
        if not start_date:
            start_date = end_date - timedelta(days=30)
        elif start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)

        # 1. Summary Metrics & Success Rates
        summary_stmt = select(
            func.coalesce(
                func.sum(
                    case(
                        (Order.status.in_([OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]), Order.total_amount_rial),
                        else_=0,
                    )
                ),
                0,
            ).label("total_revenue"),
            func.count(Order.id).label("total_orders"),
            func.coalesce(
                func.sum(
                    case(
                        (Order.status.in_([OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]), 1),
                        else_=0,
                    )
                ),
                0,
            ).label("successful_orders"),
        ).where(Order.created_at.between(start_date, end_date))

        summary_res = await db.execute(summary_stmt)
        summary_row = summary_res.one()

        total_rev = int(summary_row.total_revenue)
        total_orders = int(summary_row.total_orders)
        successful_orders = int(summary_row.successful_orders)

        avg_order_val = int(total_rev / successful_orders) if successful_orders > 0 else 0
        success_rate = round((successful_orders / total_orders * 100), 2) if total_orders > 0 else 0.0

        summary = MetricSummary(
            total_revenue_rial=total_rev,
            total_orders_count=total_orders,
            successful_orders_count=successful_orders,
            average_order_value_rial=avg_order_val,
            payment_success_rate=success_rate,
        )

        # 2. Daily Revenue & Order Count Trends
        trend_stmt = (
            select(
                cast(Order.created_at, Date).label("order_date"),
                func.coalesce(
                    func.sum(
                        case(
                            (Order.status.in_([OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]), Order.total_amount_rial),
                            else_=0,
                        )
                    ),
                    0,
                ).label("daily_revenue"),
                func.count(Order.id).label("daily_orders"),
            )
            .where(Order.created_at.between(start_date, end_date))
            .group_by(cast(Order.created_at, Date))
            .order_by(cast(Order.created_at, Date).asc())
        )

        trend_res = await db.execute(trend_stmt)
        revenue_trends = [
            DailyRevenueTrend(
                date=row.order_date,
                revenue_rial=int(row.daily_revenue),
                orders_count=int(row.daily_orders),
            )
            for row in trend_res.all()
        ]

        # 3. Top-Selling Variants
        top_variants_stmt = (
            select(
                OrderItem.variant_id,
                OrderItem.product_title,
                OrderItem.variant_title,
                func.sum(OrderItem.quantity).label("units_sold"),
                func.sum(OrderItem.total_price_rial).label("total_revenue"),
            )
            .join(Order, OrderItem.order_id == Order.id)
            .where(
                Order.created_at.between(start_date, end_date),
                Order.status.in_([OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]),
            )
            .group_by(
                OrderItem.variant_id,
                OrderItem.product_title,
                OrderItem.variant_title,
            )
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(top_items_limit)
        )

        top_res = await db.execute(top_variants_stmt)
        top_selling = [
            TopSellingVariant(
                variant_id=str(row.variant_id),
                product_title=row.product_title,
                variant_title=row.variant_title,
                units_sold=int(row.units_sold),
                total_revenue_rial=int(row.total_revenue),
            )
            for row in top_res.all()
        ]

        # 4. Order Status Distribution
        status_stmt = (
            select(
                Order.status,
                func.count(Order.id).label("status_count"),
            )
            .where(Order.created_at.between(start_date, end_date))
            .group_by(Order.status)
        )

        status_res = await db.execute(status_stmt)
        status_dist = [
            OrderStatusDistribution(
                status=row.status.value,
                count=int(row.status_count),
            )
            for row in status_res.all()
        ]

        # 5. Gateway Success Rates
        gateway_stmt = (
            select(
                PaymentTransaction.provider,
                func.count(PaymentTransaction.id).label("total_tx"),
                func.coalesce(
                    func.sum(case((PaymentTransaction.status == PaymentStatus.PAID, 1), else_=0)),
                    0,
                ).label("successful_tx"),
                func.coalesce(
                    func.sum(case((PaymentTransaction.status == PaymentStatus.FAILED, 1), else_=0)),
                    0,
                ).label("failed_tx"),
            )
            .where(PaymentTransaction.created_at.between(start_date, end_date))
            .group_by(PaymentTransaction.provider)
        )

        gateway_res = await db.execute(gateway_stmt)
        gateway_metrics = []
        for row in gateway_res.all():
            total = int(row.total_tx)
            succ = int(row.successful_tx)
            rate = round((succ / total * 100), 2) if total > 0 else 0.0
            gateway_metrics.append(
                PaymentGatewayMetric(
                    provider=row.provider.value,
                    total_transactions=total,
                    successful_transactions=succ,
                    failed_transactions=int(row.failed_tx),
                    success_rate=rate,
                )
            )

        # 6. Low Stock Alerts
        # (product eager-loaded: used for product_title below, and lazy-loading
        # is unavailable in async sessions)
        stock_stmt = (
            select(ProductVariant)
            .where(ProductVariant.stock <= low_stock_threshold)
            .options(selectinload(ProductVariant.product))
            .order_by(ProductVariant.stock.asc())
            .limit(20)
        )
        stock_res = await db.execute(stock_stmt)
        low_stock = [
            LowStockAlert(
                variant_id=str(v.id),
                product_title=v.product.title if v.product else "Product",
                variant_title=v.title,
                current_stock=v.stock,
            )
            for v in stock_res.scalars().all()
        ]

        return DashboardAnalyticsResponse(
            summary=summary,
            revenue_trends=revenue_trends,
            top_selling_variants=top_selling,
            status_distribution=status_dist,
            gateway_metrics=gateway_metrics,
            low_stock_alerts=low_stock,
        )


admin_analytics_service = AdminAnalyticsService()