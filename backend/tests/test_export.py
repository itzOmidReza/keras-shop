import csv
import io
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from app.api.v1.endpoints.admin_orders import export_orders_csv
from app.models.enums import OrderStatus, PaymentStatus


class ExportTests(unittest.IsolatedAsyncioTestCase):
    async def test_exports_every_page_and_preserves_filters(self):
        calls = []
        async def list_orders(db, params):
            calls.append(params.model_copy())
            start = (params.page - 1) * params.limit
            orders = [SimpleNamespace(
                order_number=f'ORD-{n}', customer_name='Test', phone_number='test',
                province='Test', city='Test', postal_code='test', postal_address='test',
                total_amount_rial=1000, status=OrderStatus.PROCESSING,
                tracking_code=None, created_at=None,
            ) for n in range(start, min(start + params.limit, 1001))]
            return orders, 1001

        with patch('app.api.v1.endpoints.admin_orders.admin_order_service.list_orders', side_effect=list_orders):
            response = await export_orders_csv(
                order_status='paid', city='Test', start_date=None, end_date=None,
                search='Test', payment_status=PaymentStatus.PAID,
                admin_user=object(), db=object(),
            )
            chunks = [chunk async for chunk in response.body_iterator]
        content = ''.join(chunk.decode() if isinstance(chunk, bytes) else chunk for chunk in chunks)
        rows = list(csv.reader(io.StringIO(content.lstrip('\ufeff'))))
        self.assertEqual(len(rows), 1002)
        self.assertEqual(rows[-1][0], 'ORD-1000')
        self.assertEqual([p.page for p in calls], [1, 2])
        for params in calls:
            self.assertEqual(params.payment_status, PaymentStatus.PAID)
            self.assertEqual(params.status, OrderStatus.PROCESSING)
            self.assertEqual(params.search, 'Test')


if __name__ == '__main__':
    unittest.main()
