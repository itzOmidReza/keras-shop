import unittest
import httpx


class LookbookContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=10.0)
        # Login as Super Admin
        cls.client.post("/api/auth/otp/send", json={"phoneNumber": "09129990000"})
        resp = cls.client.post(
            "/api/auth/otp/verify",
            json={"phoneNumber": "09129990000", "code": "12345"},
        )
        assert resp.status_code == 200, f"Failed to login as admin: {resp.text}"
        data = resp.json()
        cls.admin_token = data["tokens"]["accessToken"]
        cls.admin_headers = {"Authorization": f"Bearer {cls.admin_token}"}

    @classmethod
    def tearDownClass(cls):
        cls.client.close()

    def test_01_public_lookbooks(self):
        resp = self.client.get("/api/v1/lookbooks/public")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

        first = data[0]
        self.assertIn("id", first)
        self.assertIn("title", first)
        self.assertIn("subtitle", first)
        self.assertIn("cover_image", first)
        self.assertIn("discount_percent", first)
        self.assertIn("bundle_total_price", first)
        self.assertIn("discounted_price", first)
        self.assertIn("items", first)
        self.assertGreater(len(first["items"]), 0)

        # Check item contract
        item = first["items"][0]
        self.assertIn("title", item)
        self.assertIn("slug", item)
        self.assertIn("price", item)
        self.assertIn("hotspot", item)
        self.assertIn("top", item["hotspot"])
        self.assertIn("right", item["hotspot"])

    def test_02_direct_lookbooks_route(self):
        resp = self.client.get("/api/lookbooks/public")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_03_admin_crud_lifecycle(self):
        # 1. Create Lookbook
        create_payload = {
            "title": "ست آزمایشی بهاره آتلیه",
            "tagline": "پیش‌نمایش اختصاصی بهار",
            "description": "تلفیقی از شومیز لینن و اکسسوری‌های مدرن.",
            "cover_image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
            "discount_percent": 15,
            "is_active": True,
            "display_order": 99,
            "items": [
                {
                    "product_id": "karen-slub-linen-blouse",
                    "hotspot_x": 45.0,
                    "hotspot_y": 35.0,
                }
            ],
        }
        res_create = self.client.post(
            "/api/admin/lookbooks", json=create_payload, headers=self.admin_headers
        )
        self.assertEqual(res_create.status_code, 201)
        created = res_create.json()
        lb_id = created["id"]
        self.assertEqual(created["title"], create_payload["title"])
        self.assertEqual(created["discount_percent"], 15)

        # 2. Get Single Lookbook by Admin
        res_get = self.client.get(
            f"/api/admin/lookbooks/{lb_id}", headers=self.admin_headers
        )
        self.assertEqual(res_get.status_code, 200)
        fetched = res_get.json()
        self.assertEqual(fetched["id"], lb_id)

        # 3. Update Lookbook
        update_payload = {
            "title": "ست بروزرسانی‌شده بهاره آتلیه",
            "discount_percent": 20,
        }
        res_update = self.client.put(
            f"/api/admin/lookbooks/{lb_id}",
            json=update_payload,
            headers=self.admin_headers,
        )
        self.assertEqual(res_update.status_code, 200)
        updated = res_update.json()
        self.assertEqual(updated["title"], update_payload["title"])
        self.assertEqual(updated["discount_percent"], 20)

        # 4. Delete Lookbook
        res_delete = self.client.delete(
            f"/api/admin/lookbooks/{lb_id}", headers=self.admin_headers
        )
        self.assertEqual(res_delete.status_code, 200)

        # Verify 404
        res_verify = self.client.get(
            f"/api/admin/lookbooks/{lb_id}", headers=self.admin_headers
        )
        self.assertEqual(res_verify.status_code, 404)

