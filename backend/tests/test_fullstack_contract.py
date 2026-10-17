import unittest
import httpx

class FullStackContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = httpx.Client(base_url="http://127.0.0.1:8000", timeout=10.0)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()

    def test_01_system_health(self):
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get("status"), "healthy")

    def test_02_catalog_products(self):
        resp = self.client.get("/api/products")
        self.assertEqual(resp.status_code, 200)
        products = resp.json()
        self.assertIsInstance(products, list)
        self.assertGreater(len(products), 0)
        first = products[0]
        self.assertIn("slug", first)
        self.assertIn("title", first)
        self.assertIn("price", first)

        # Detail PDP test
        pdp_resp = self.client.get(f"/api/products/{first['slug']}")
        self.assertEqual(pdp_resp.status_code, 200)
        pdp_data = pdp_resp.json()
        self.assertEqual(pdp_data["slug"], first["slug"])

    def test_03_store_taxonomy(self):
        resp = self.client.get("/api/taxonomy")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("colors", data)
        self.assertIn("sizes", data)
        self.assertIn("categories", data)
        self.assertIn("brands", data)
        self.assertIn("seasons", data)
        self.assertGreater(len(data["categories"]), 0)

    def test_04_site_settings(self):
        resp = self.client.get("/api/settings")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("branding", data)
        self.assertIn("contact", data)
        self.assertIn("shipping", data)
        self.assertEqual(data["branding"]["brandNameFa"], "کراس")

    def test_05_journal_articles(self):
        resp = self.client.get("/api/articles")
        self.assertEqual(resp.status_code, 200)
        articles = resp.json()
        self.assertIsInstance(articles, list)
        self.assertGreater(len(articles), 0)
        self.assertIn("slug", articles[0])

    def test_06_reviews_list(self):
        resp = self.client.get("/api/reviews")
        self.assertEqual(resp.status_code, 200)
        reviews = resp.json()
        self.assertIsInstance(reviews, list)
        self.assertGreater(len(reviews), 0)

    def test_07_auth_otp_and_profile_flow(self):
        phone = "09121112233"
        # 1. Send OTP
        send_resp = self.client.post("/api/auth/otp/send", json={"phoneNumber": phone})
        self.assertEqual(send_resp.status_code, 200)
        send_data = send_resp.json()
        self.assertTrue(send_data.get("success"))

        # 2. Verify OTP with universal dev test code
        verify_resp = self.client.post("/api/auth/otp/verify", json={"phoneNumber": phone, "code": "12345"})
        self.assertEqual(verify_resp.status_code, 200)
        auth_data = verify_resp.json()
        self.assertIn("access_token", auth_data)
        access_token = auth_data["access_token"]

        # 3. Access authenticated profile
        headers = {"Authorization": f"Bearer {access_token}"}
        profile_resp = self.client.get("/api/user/profile", headers=headers)
        self.assertEqual(profile_resp.status_code, 200)
        profile_data = profile_resp.json()
        self.assertEqual(profile_data["phoneNumber"], phone)

    def test_08_order_tracking(self):
        resp = self.client.post("/api/orders/track", json={"query": "KERAS-104921"})
        self.assertEqual(resp.status_code, 200)
        track_data = resp.json()
        self.assertEqual(track_data["orderNumber"], "KERAS-104921")
        self.assertIn("timeline", track_data)
        self.assertIn("items", track_data)
        self.assertGreater(len(track_data["items"]), 0)

    def test_09_cart_checkout_payment_pipeline(self):
        # 1. Create order as customer
        order_payload = {
            "items": [
                {
                    "id": "item-1",
                    "productId": 24,
                    "variantId": 1,
                    "title": "شال بلند پشمی بافت ضخیم",
                    "slug": "thick-knit-wool-long-scarf",
                    "size": "Free",
                    "color": "مشکی",
                    "price": 1350000,
                    "quantity": 1,
                    "maxStock": 10,
                    "image": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800",
                }
            ],
            "shippingAddress": {
                "fullName": "آرزو قنبری",
                "phoneNumber": "09127778899",
                "province": "تهران",
                "city": "تهران",
                "postalCode": "1999988888",
                "exactAddress": "ونک، خیابان ملاصدرا، پلاک ۵",
            },
            "shippingMethod": "standard",
            "paymentMethod": "online_gateway",
        }

        create_resp = self.client.post("/api/orders/create", json=order_payload)
        self.assertEqual(create_resp.status_code, 201)
        receipt = create_resp.json()
        order_number = receipt["orderNumber"]
        self.assertTrue(order_number.startswith("KERAS-"))
        self.assertEqual(receipt["subtotal"], 1350000)

        # 2. Initiate payment session
        init_resp = self.client.post(
            "/api/checkout/payment/initiate",
            json={
                "orderNumber": order_number,
                "amount": receipt["finalTotal"],
                "callbackUrl": "/checkout/callback",
            },
        )
        self.assertEqual(init_resp.status_code, 200)
        init_data = init_resp.json()
        payment_token = init_data["paymentToken"]

        # 3. Query payment session
        session_resp = self.client.get(f"/api/checkout/payment/session?token={payment_token}")
        self.assertEqual(session_resp.status_code, 200)
        session_data = session_resp.json()
        self.assertEqual(session_data["orderNumber"], order_number)
        self.assertEqual(session_data["status"], "pending")

        # 4. Verify payment
        verify_pay_resp = self.client.post(
            "/api/checkout/payment/verify",
            json={
                "paymentToken": payment_token,
                "cardNumber": "۶۰۳۷۹۹******۱۱۱۲",
                "action": "success",
            },
        )
        self.assertEqual(verify_pay_resp.status_code, 200)
        verify_pay_data = verify_pay_resp.json()
        self.assertTrue(verify_pay_data["success"])
        self.assertEqual(verify_pay_data["orderNumber"], order_number)

        # 5. Check order status was updated in DB
        track_resp = self.client.post("/api/orders/track", json={"query": order_number})
        self.assertEqual(track_resp.status_code, 200)
        self.assertEqual(track_resp.json()["status"], "processing")


if __name__ == "__main__":
    unittest.main()
