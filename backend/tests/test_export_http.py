"""HTTP + real SQLAlchemy pagination, isolated from the production database."""
import csv
import io
import unittest
from datetime import datetime, timezone

import httpx
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.api.v1.endpoints.admin_orders import router
from app.api.deps import get_db, require_admin
from app.db.base import Base
from app.models.order import Order, PaymentTransaction
from app.models.user import User
from app.models.enums import OrderStatus, PaymentStatus
# Register all relationship targets before mapper configuration.
from app.main import app as registered_app


class ExportHttpTests(unittest.IsolatedAsyncioTestCase):
    async def test_http_export_spans_pages_and_filters_paid_transactions(self):
        engine = create_async_engine('sqlite+aiosqlite:///:memory:')
        sessions = async_sessionmaker(engine, expire_on_commit=False)
        try:
            async with engine.begin() as connection:
                await connection.run_sync(Base.metadata.create_all)
            async with sessions() as db:
                user = User(phone='test-only')
                db.add(user)
                await db.flush()
                for n in range(1002):
                    order = Order(
                        order_number=f'ORD-{n:04}', user_id=user.id,
                        customer_name='Test', phone_number='test', province='Test',
                        city='Test', postal_address='Test', postal_code='test',
                        subtotal_amount_rial=1000, total_amount_rial=1000,
                        shipping_cost_rial=0, discount_amount_rial=0,
                        shipping_method='test', status=OrderStatus.PROCESSING,
                        created_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
                    )
                    db.add(order)
                    await db.flush()
                    db.add(PaymentTransaction(
                        order_id=order.id, amount_rial=1000, authority=f'test-{n}',
                        status=PaymentStatus.PAID if n < 1001 else PaymentStatus.FAILED,
                    ))
                await db.commit()
            app = FastAPI()
            app.include_router(router)
            async def test_db():
                async with sessions() as db:
                    yield db
            app.dependency_overrides[get_db] = test_db
            app.dependency_overrides[require_admin] = lambda: object()
            async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='http://test') as client:
                response = await client.get('/admin/orders/export/csv', params={'payment_status': 'paid'})
                self.assertEqual(response.status_code, 200, response.text)
                rows = list(csv.reader(io.StringIO(response.text.lstrip('\ufeff'))))
                self.assertEqual(len(rows), 1002)
                self.assertEqual({row[0] for row in rows[1:]}, {f'ORD-{n:04}' for n in range(1001)})
                invalid = await client.get('/admin/orders/export/csv', params={'payment_status': 'invalid'})
                self.assertEqual(invalid.status_code, 422)
        finally:
            await engine.dispose()
