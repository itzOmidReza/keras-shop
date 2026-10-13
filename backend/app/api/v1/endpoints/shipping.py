from fastapi import APIRouter, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/shipping", tags=["Shipping"])

# Server-side source of truth for shipping rates (Rial). These MUST mirror the
# demo/mock values the storefront UI was built against:
# pishtaz 50,000 Toman | tipax 60,000 Toman | free above 600,000 Toman subtotal

PISHTAZ_COST_RIAL = 500_000
TIPAX_COST_RIAL = 600_000
FREE_SHIPPING_THRESHOLD_TOMAN = 600_000


class ShippingCalcRequest(BaseModel):
    province: str = Field(default="", description="Destination province")
    city: str = Field(default="", description="Destination city")
    subtotal_toman: int = Field(default=0, ge=0, description="Cart subtotal in Toman")


class ShippingQuote(BaseModel):
    method: str
    title: str
    cost_toman: int
    eta_days: str


class ShippingCalcResponse(BaseModel):
    quotes: list[ShippingQuote]
    free_shipping_threshold_toman: int = FREE_SHIPPING_THRESHOLD_TOMAN


@router.post(
    "/calculate",
    response_model=ShippingCalcResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate available shipping methods for a destination/subtotal",
)
async def calculate_shipping(payload: ShippingCalcRequest) -> ShippingCalcResponse:
    quotes = [
        ShippingQuote(
            method="pishtaz",
            title="پیشتاز",
            cost_toman=PISHTAZ_COST_RIAL // 10,
            eta_days="۲ تا ۴ روز کاری",
        ),
        ShippingQuote(
            method="tipax",
            title="تیپاکس",
            cost_toman=TIPAX_COST_RIAL // 10,
            eta_days="۱ تا ۳ روز کاری",
        ),
    ]

    if payload.subtotal_toman >= FREE_SHIPPING_THRESHOLD_TOMAN:
        quotes.append(
            ShippingQuote(
                method="free",
                title="ارسال رایگان",
                cost_toman=0,
                eta_days="۲ تا ۴ روز کاری",
            )
        )

    return ShippingCalcResponse(quotes=quotes)