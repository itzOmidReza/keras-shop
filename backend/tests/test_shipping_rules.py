import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

from app.core.config import FREE_SHIPPING_THRESHOLD_RIAL
from app.core.exceptions import DomainException
from app.schemas.order import OrderCreateRequest, OrderItemCreate
from app.services.order import order_service


class ShippingRulesTests(unittest.IsolatedAsyncioTestCase):
    def _create_mocks(self, variant_price_rial: int):
        variant = SimpleNamespace(
            id="var-1",
            price_rial=variant_price_rial,
            stock=10,
            title="Ring",
            product=SimpleNamespace(title="Gold Ring"),
        )
        res_mock = MagicMock()
        res_mock.scalars().all.return_value = [variant]

        db = MagicMock()
        db.execute = AsyncMock(return_value=res_mock)
        db.add = MagicMock()
        db.flush = AsyncMock()
        db.commit = AsyncMock()

        user = SimpleNamespace(
            id="usr-1",
            full_name="Test User",
            phone="09120000000",
            first_name="Test",
            last_name="User",
        )
        return db, user

    async def test_below_threshold_free_shipping_rejected(self):
        # 1,000,000 Rial is well below 12,000,000 Rial
        db, user = self._create_mocks(variant_price_rial=1_000_000)
        req = OrderCreateRequest(
            items=[OrderItemCreate(variant_id="var-1", quantity=1)],
            shipping_method="free",
            customer_name="Test User",
            phone_number="09120000000",
            province="Tehran",
            city="Tehran",
            address="Street 123",
            postal_code="1234567890",
        )

        with self.assertRaises(DomainException) as ctx:
            await order_service.create_order_and_checkout(
                db=db,
                user=user,
                request_data=req,
                base_callback_url="http://test/callback",
            )
        self.assertEqual(ctx.exception.code, "FREE_SHIPPING_NOT_ELIGIBLE")
        self.assertEqual(ctx.exception.status_code, 400)

    async def test_at_threshold_free_shipping_allowed(self):
        # Exactly at FREE_SHIPPING_THRESHOLD_RIAL (12,000,000 Rial)
        db, user = self._create_mocks(variant_price_rial=FREE_SHIPPING_THRESHOLD_RIAL)
        req = OrderCreateRequest(
            items=[OrderItemCreate(variant_id="var-1", quantity=1)],
            shipping_method="free",
            customer_name="Test User",
            phone_number="09120000000",
            province="Tehran",
            city="Tehran",
            address="Street 123",
            postal_code="1234567890",
        )

        with patch("app.services.order.payment_service.request_payment", new=AsyncMock(return_value=("token_123", "http://pay.test"))):
            res = await order_service.create_order_and_checkout(
                db=db,
                user=user,
                request_data=req,
                base_callback_url="http://test/callback",
            )
        # Total amount must equal subtotal with 0 shipping cost
        self.assertEqual(res["total_amount_rial"], FREE_SHIPPING_THRESHOLD_RIAL)
        # Check added Order object
        added_order = db.add.call_args_list[0][0][0]
        self.assertEqual(added_order.shipping_cost_rial, 0)
        self.assertEqual(added_order.shipping_method, "free")

    async def test_below_threshold_pishtaz_costs_500k(self):
        # Below threshold with standard method
        db, user = self._create_mocks(variant_price_rial=1_000_000)
        req = OrderCreateRequest(
            items=[OrderItemCreate(variant_id="var-1", quantity=1)],
            shipping_method="pishtaz",
            customer_name="Test User",
            phone_number="09120000000",
            province="Tehran",
            city="Tehran",
            address="Street 123",
            postal_code="1234567890",
        )

        with patch("app.services.order.payment_service.request_payment", new=AsyncMock(return_value=("token_123", "http://pay.test"))):
            res = await order_service.create_order_and_checkout(
                db=db,
                user=user,
                request_data=req,
                base_callback_url="http://test/callback",
            )
        # 1,000,000 + 500,000 = 1,500,000
        self.assertEqual(res["total_amount_rial"], 1_500_000)
        added_order = db.add.call_args_list[0][0][0]
        self.assertEqual(added_order.shipping_cost_rial, 500_000)


if __name__ == "__main__":
    unittest.main()
