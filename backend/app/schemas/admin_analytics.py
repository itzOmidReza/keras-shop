from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel


class MetricSummary(BaseModel):
    total_revenue_rial: int
    total_orders_count: int
    successful_orders_count: int
    average_order_value_rial: int
    payment_success_rate: float  # Percentage (0.0 to 100.0)


class DailyRevenueTrend(BaseModel):
    date: date
    revenue_rial: int
    orders_count: int


class TopSellingVariant(BaseModel):
    variant_id: str
    product_title: str
    variant_title: str
    units_sold: int
    total_revenue_rial: int


class OrderStatusDistribution(BaseModel):
    status: str
    count: int


class PaymentGatewayMetric(BaseModel):
    provider: str
    total_transactions: int
    successful_transactions: int
    failed_transactions: int
    success_rate: float


class LowStockAlert(BaseModel):
    variant_id: str
    product_title: str
    variant_title: str
    current_stock: int


class DashboardAnalyticsResponse(BaseModel):
    summary: MetricSummary
    revenue_trends: List[DailyRevenueTrend]
    top_selling_variants: List[TopSellingVariant]
    status_distribution: List[OrderStatusDistribution]
    gateway_metrics: List[PaymentGatewayMetric]
    low_stock_alerts: List[LowStockAlert]