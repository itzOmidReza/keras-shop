import asyncio
import json
import uuid
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.enums import FulfillmentType, UserRole
from app.models.product import Category, Product, ProductVariant
from app.models.user import Address, User

try:
    from app.models.enums import OrderStatus
except ImportError:
    try:
        from app.models.order import OrderStatus
    except ImportError:
        OrderStatus = None

try:
    from app.models.order import Order, OrderItem
except ImportError:
    try:
        from app.models.orders import Order, OrderItem
    except ImportError:
        Order = None
        OrderItem = None


def resolve_order_status(target: str):
    if OrderStatus is None:
        return target
    if hasattr(OrderStatus, target.upper()):
        return getattr(OrderStatus, target.upper())
    for member in OrderStatus:
        if member.value.lower() == target.lower():
            return member
    return list(OrderStatus)[0]


async def seed_data():
    async with AsyncSessionLocal() as db:
        print("🌱 Seeding Admin Panel & Storefront Data...")

        # ---------------------------------------------------------
        # 1. Admin & Test Customers
        # ---------------------------------------------------------
        admin_phone = "09120000001"
        res = await db.execute(select(User).where(User.phone == admin_phone))
        admin = res.scalar_one_or_none()

        if not admin:
            admin = User(
                id=str(uuid.uuid4()),
                phone=admin_phone,
                first_name="مدیر",
                last_name="سیستم",
                full_name="مدیر سیستم",
                email="admin@sagedesign.ir",
                birth_date=date(1990, 5, 15),
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin)
            print(f"✅ Created Admin: {admin_phone}")
        else:
            admin.role = UserRole.ADMIN
            print(f"ℹ️ Admin user already exists: {admin_phone}")

        customer_phone = "09123456789"
        res = await db.execute(select(User).where(User.phone == customer_phone))
        customer = res.scalar_one_or_none()

        if not customer:
            customer = User(
                id=str(uuid.uuid4()),
                phone=customer_phone,
                first_name="سارا",
                last_name="احمدی",
                full_name="سارا احمدی",
                email="sara@example.com",
                birth_date=date(1996, 8, 20),
                role=UserRole.CUSTOMER,
                is_active=True,
            )
            db.add(customer)
            print(f"✅ Created Customer: {customer_phone}")

        await db.flush()

        # Customer Address
        res = await db.execute(select(Address).where(Address.user_id == customer.id))
        cust_addr = res.scalars().first()
        if not cust_addr:
            cust_addr = Address(
                id=str(uuid.uuid4()),
                user_id=customer.id,
                title="منزل",
                receiver_name="سارا احمدی",
                receiver_phone="09123456789",
                province="تهران",
                city="تهران",
                postal_address="خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶",
                postal_code="1433714521",
                is_default=True,
            )
            db.add(cust_addr)
            await db.flush()

        # ---------------------------------------------------------
        # 2. Categories
        # ---------------------------------------------------------
        categories_data = [
            {"title": "انگشتر و بند انگشتی", "slug": "rings", "description": "انگشترهای طراحی شده با سنگ طبیعی و مینیمال"},
            {"title": "دستبند و النگو", "slug": "bracelets", "description": "دستبندهای چرمی، مهره‌ای و نقره استایل"},
            {"title": "گردنبند و آویز", "slug": "necklaces", "description": "زنجیر و پلاک‌های ظریف زنانه و مردانه"},
            {"title": "اکسسوری مو و کمربند", "slug": "lifestyle", "description": "اکسسوری‌های مکمل چرم و پارچه‌ای"},
        ]

        cat_map = {}
        for c in categories_data:
            res = await db.execute(select(Category).where(Category.slug == c["slug"]))
            existing_cat = res.scalar_one_or_none()
            if not existing_cat:
                new_cat = Category(
                    id=str(uuid.uuid4()),
                    title=c["title"],
                    slug=c["slug"],
                    description=c["description"],
                )
                db.add(new_cat)
                await db.flush()
                cat_map[c["slug"]] = new_cat
            else:
                cat_map[c["slug"]] = existing_cat

        print(f"✅ Verified {len(categories_data)} Categories")

        # ---------------------------------------------------------
        # 3. Products & Variants
        # ---------------------------------------------------------
        products_data = [
            {
                "title": "انگشتر نقره مینیمال مدل آرورا",
                "slug": "aurora-silver-ring",
                "description": "انگشتر مینیمال با نقره عیار ۹۲۵ ضد حساسیت و مقاوم در برابر اکسیداسیون مناسب استفاده روزمره.",
                "category_slug": "rings",
                "base_price_rial": 8900000,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80",
                    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=700&q=80",
                ]),
                "variants": [
                    {"title": "سایز ۵۴ / نقره‌ای مات", "sku": "RNG-AUR-54", "price_rial": 8900000, "stock": 14},
                    {"title": "سایز ۵۶ / نقره‌ای مات", "sku": "RNG-AUR-56", "price_rial": 8900000, "stock": 6},
                    {"title": "سایز ۵۸ / نقره‌ای براق", "sku": "RNG-AUR-58", "price_rial": 9200000, "stock": 2},
                ],
            },
            {
                "title": "دستبند بافت چرم طبیعی و پلاک استیل",
                "slug": "leather-steel-braided-bracelet",
                "description": "دستبند تهیه شده از چرم گاوی درجه یک با قفل مغناطیسی استیل ۳۱۶L مات ضد زنگ.",
                "category_slug": "bracelets",
                "base_price_rial": 12500000,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1611591475152-473523dd66c6?w=700&q=80",
                ]),
                "variants": [
                    {"title": "مشکی ذغالی / ۱۹ سانتی‌متر", "sku": "BRC-LTR-BLK-19", "price_rial": 12500000, "stock": 20},
                    {"title": "قهوه‌ای تیره / ۲۱ سانتی‌متر", "sku": "BRC-LTR-BRN-21", "price_rial": 12500000, "stock": 8},
                ],
            },
            {
                "title": "گردنبند دو ردیفه زنجیر ماری و کارتیر",
                "slug": "snake-cuban-chain-necklace",
                "description": "طراحی ترکیبی روز با آبکاری طلای ۱۸ عیار مقاوم در برابر کدر شدن و بدون حساسیت پوستی.",
                "category_slug": "necklaces",
                "base_price_rial": 14800000,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80",
                ]),
                "variants": [
                    {"title": "طلایی / ۴۵+۵ سانتی‌متر", "sku": "NCK-SNK-GLD-45", "price_rial": 14800000, "stock": 11},
                    {"title": "نقره‌ای / ۴۵+۵ سانتی‌متر", "sku": "NCK-SNK-SLV-45", "price_rial": 13900000, "stock": 0},
                ],
            },
            {
                "title": "کمربند چرم دست‌دوز سگک مات اسکاندیناوی",
                "slug": "nordic-matte-leather-belt",
                "description": "چرم طبیعی فلوتر با سگک فلزی دودی مات مقاوم، مناسب استفاده رسمی و کژوال.",
                "category_slug": "lifestyle",
                "base_price_rial": 19500000,
                "images": json.dumps([
                    "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=700&q=80",
                ]),
                "variants": [
                    {"title": "سایز ۱۱۰ سانتی‌متر / مشکی", "sku": "BLT-NRD-110", "price_rial": 19500000, "stock": 5},
                    {"title": "سایز ۱۲۰ سانتی‌متر / مشکی", "sku": "BLT-NRD-120", "price_rial": 19500000, "stock": 9},
                ],
            },
        ]

        variant_product_pairs = []

        for p_data in products_data:
            res = await db.execute(select(Product).where(Product.slug == p_data["slug"]))
            prod = res.scalar_one_or_none()

            if not prod:
                prod = Product(
                    id=str(uuid.uuid4()),
                    title=p_data["title"],
                    slug=p_data["slug"],
                    description=p_data["description"],
                    category_id=cat_map[p_data["category_slug"]].id,
                    images=p_data["images"],
                    base_price_rial=p_data["base_price_rial"],
                    is_active=True,
                    fulfillment_type=FulfillmentType.STANDARD,
                )
                db.add(prod)
                await db.flush()

                for v in p_data["variants"]:
                    var = ProductVariant(
                        id=str(uuid.uuid4()),
                        product_id=prod.id,
                        title=v["title"],
                        sku=v["sku"],
                        price_rial=v["price_rial"],
                        stock=v["stock"],
                        is_active=True,
                    )
                    db.add(var)
                    await db.flush()
                    variant_product_pairs.append((var, prod.title))
            else:
                res_vars = await db.execute(select(ProductVariant).where(ProductVariant.product_id == prod.id))
                for v in res_vars.scalars().all():
                    variant_product_pairs.append((v, prod.title))

        await db.flush()
        print(f"✅ Verified {len(products_data)} Products and Variants")

        # ---------------------------------------------------------
        # 4. Sample Orders
        # ---------------------------------------------------------
        if Order and variant_product_pairs:
            order_samples = [
                {
                    "number": "ORD-140509-101",
                    "status_str": "paid",
                    "hours_ago": 4,
                    "pair": variant_product_pairs[0],
                    "quantity": 1,
                },
                {
                    "number": "ORD-140509-102",
                    "status_str": "processing",
                    "hours_ago": 18,
                    "pair": variant_product_pairs[1] if len(variant_product_pairs) > 1 else variant_product_pairs[0],
                    "quantity": 2,
                },
                {
                    "number": "ORD-140509-103",
                    "status_str": "delivered",
                    "hours_ago": 72,
                    "pair": variant_product_pairs[2] if len(variant_product_pairs) > 2 else variant_product_pairs[0],
                    "quantity": 1,
                },
                {
                    "number": "ORD-140509-104",
                    "status_str": "pending",
                    "hours_ago": 1,
                    "pair": variant_product_pairs[0],
                    "quantity": 1,
                },
            ]

            for o_data in order_samples:
                res = await db.execute(select(Order).where(Order.order_number == o_data["number"]))
                existing_order = res.scalar_one_or_none()

                if not existing_order:
                    created_time = datetime.now(timezone.utc) - timedelta(hours=o_data["hours_ago"])
                    variant, prod_title = o_data["pair"]
                    item_price = variant.price_rial
                    qty = o_data["quantity"]
                    item_total = item_price * qty
                    shipping_cost = 450000

                    resolved_status = resolve_order_status(o_data["status_str"])

                    order = Order(
                        id=str(uuid.uuid4()),
                        user_id=customer.id,
                        order_number=o_data["number"],
                        customer_name="سارا احمدی",
                        phone_number="09123456789",
                        province="تهران",
                        city="تهران",
                        postal_address="خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶",
                        postal_code="1433714521",
                        subtotal_amount_rial=item_total,
                        discount_amount_rial=0,
                        shipping_cost_rial=shipping_cost,
                        total_amount_rial=item_total + shipping_cost,
                        status=resolved_status,
                        shipping_method="پست پیشتاز",
                        created_at=created_time,
                    )
                    db.add(order)
                    await db.flush()

                    if OrderItem:
                        item = OrderItem(
                            id=str(uuid.uuid4()),
                            order_id=order.id,
                            variant_id=variant.id,
                            product_title=prod_title,
                            variant_title=variant.title,
                            quantity=qty,
                            unit_price_rial=item_price,
                            total_price_rial=item_total,
                        )
                        db.add(item)

            await db.flush()
            print("✅ Verified Sample Orders and OrderItems for Admin Table")

        await db.commit()
        print("\n✨ Database successfully seeded!")
        print("--------------------------------------------------")
        print("👑 Admin Login Phone :  09120000001")
        print("👤 Customer Phone    :  09123456789")
        print("--------------------------------------------------")


if __name__ == "__main__":
    asyncio.run(seed_data())