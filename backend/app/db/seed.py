import asyncio
import json
import os
import uuid
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.enums import FulfillmentType, UserRole, OrderStatus
from app.models.product import Category, Product, ProductVariant
from app.models.user import User, Address
from app.models.settings import SiteSetting
from app.models.taxonomy import (
    CustomColor,
    CustomSize,
    TaxonomyCategory,
    TaxonomyBrand,
    TaxonomySeason,
)
from app.models.review import ProductReview
from app.models.article import JournalArticle
from app.models.coupon import Coupon
from app.models.enums import DiscountType

_TOMAN = 10


async def seed_data():
    seed_file = os.path.join(os.path.dirname(__file__), "seed_data.json")
    if not os.path.exists(seed_file):
        print(f"❌ Seed data file not found at {seed_file}")
        return

    with open(seed_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with AsyncSessionLocal() as session:
        print("🌱 Seeding Keras Atelier Storefront & Admin Data...")

        # 1. Seed Super Admin & Test Customer
        admin_phone = "09129990000"
        stmt = select(User).where(User.phone == admin_phone)
        admin = (await session.execute(stmt)).scalar_one_or_none()
        if not admin:
            admin = User(
                phone=admin_phone,
                full_name="مدیریت ارشد آتلیه کراس",
                first_name="مدیریت",
                last_name="کراس",
                role=UserRole.ADMIN,
                is_active=True,
            )
            session.add(admin)
            print(f"✅ Created Super Admin: {admin_phone}")
        else:
            admin.role = UserRole.ADMIN
            admin.full_name = "مدیریت ارشد آتلیه کراس"

        customer_phone = "09121112233"
        stmt = select(User).where(User.phone == customer_phone)
        cust = (await session.execute(stmt)).scalar_one_or_none()
        if not cust:
            cust = User(
                phone=customer_phone,
                full_name="سارا رادمنش",
                first_name="سارا",
                last_name="رادمنش",
                email="sara.rad@example.com",
                role=UserRole.CUSTOMER,
                is_active=True,
            )
            session.add(cust)
            await session.flush()

            addr = Address(
                user_id=cust.id,
                title="منزل",
                receiver_name="سارا رادمنش",
                receiver_phone="09121112233",
                province="تهران",
                city="تهران",
                postal_address="زعفرانیه، خیابان مقدس اردبیلی، پلاک ۲۴، واحد ۶",
                postal_code="1983963111",
                building_number="۲۴",
                unit="۶",
                is_default=True,
            )
            session.add(addr)
            print(f"✅ Created Demo Customer: {customer_phone}")

        await session.commit()

        # 2. Seed Settings
        settings_data = data.get("settings", {})
        for key, val in settings_data.items():
            if isinstance(val, dict):
                stmt = select(SiteSetting).where(SiteSetting.key == key)
                rec = (await session.execute(stmt)).scalar_one_or_none()
                if not rec:
                    rec = SiteSetting(key=key, value=val)
                    session.add(rec)
                else:
                    rec.value = val
        await session.commit()
        print("✅ Seeded Site Settings")

        # 3. Seed Taxonomy
        tax_data = data.get("taxonomy", {})
        for col in tax_data.get("colors", []):
            slug = col["slug"]
            stmt = select(CustomColor).where(CustomColor.slug == slug)
            if not (await session.execute(stmt)).scalar_one_or_none():
                session.add(CustomColor(name=col["name"], hex=col["hex"], slug=slug, is_system_default=col.get("isSystemDefault", False)))

        for sz in tax_data.get("sizes", []):
            stmt = select(CustomSize).where(CustomSize.name == sz["name"])
            if not (await session.execute(stmt)).scalar_one_or_none():
                session.add(CustomSize(name=sz["name"], group=sz["group"], order=sz["order"], is_system_default=sz.get("isSystemDefault", False)))

        for br in tax_data.get("brands", []):
            slug = br["slug"]
            stmt = select(TaxonomyBrand).where(TaxonomyBrand.slug == slug)
            if not (await session.execute(stmt)).scalar_one_or_none():
                session.add(TaxonomyBrand(name=br["name"], slug=slug, is_featured=br.get("isFeatured", False)))

        for sea in tax_data.get("seasons", []):
            slug = sea["slug"]
            stmt = select(TaxonomySeason).where(TaxonomySeason.slug == slug)
            if not (await session.execute(stmt)).scalar_one_or_none():
                session.add(TaxonomySeason(name=sea["name"], slug=slug, is_current_drop=sea.get("isCurrentDrop", False)))

        categories_map = {}
        for cat in tax_data.get("categories", []):
            slug = cat["slug"]
            stmt = select(Category).where(Category.slug == slug)
            existing = (await session.execute(stmt)).scalar_one_or_none()
            if not existing:
                new_cat = Category(
                    title=cat["name"],
                    slug=slug,
                    description=f"کالکشن تخصصی {cat['name']}",
                )
                session.add(new_cat)
                await session.flush()
                categories_map[slug] = new_cat
            else:
                categories_map[slug] = existing

            stmt2 = select(TaxonomyCategory).where(TaxonomyCategory.slug == slug)
            if not (await session.execute(stmt2)).scalar_one_or_none():
                session.add(TaxonomyCategory(name=cat["name"], slug=slug, division=cat.get("division", "apparel"), icon_name=cat.get("iconName")))

        await session.commit()
        print("✅ Seeded Store Taxonomy & Categories")

        # 4. Seed Products & Variants
        products_data = data.get("products", [])
        for p in products_data:
            slug = p["slug"]
            stmt = select(Product).where(Product.slug == slug)
            existing_p = (await session.execute(stmt)).scalar_one_or_none()

            cat_slug = p.get("category")
            category_obj = categories_map.get(cat_slug)

            price_rial = int((p.get("price") or p.get("base_price", 1000000)) * _TOMAN)
            compare_rial = int(p["compare_at_price"] * _TOMAN) if p.get("compare_at_price") else None

            images_raw = json.dumps(p.get("images", []), ensure_ascii=False)

            if not existing_p:
                product_obj = Product(
                    numeric_id=p.get("id"),
                    title=p["title"],
                    slug=slug,
                    description=p["description"],
                    category_id=category_obj.id if category_obj else None,
                    images=images_raw,
                    base_price_rial=price_rial,
                    compare_at_price_rial=compare_rial,
                    is_active=p.get("is_active", True),
                    brand=p.get("brand", "keras-atelier"),
                    division=p.get("division", "apparel"),
                    season=p.get("season", "fall-1405"),
                    badge=p.get("badge"),
                    line=p.get("line"),
                    fit_note=p.get("fit_note"),
                    fabric=p.get("fabric"),
                    fabric_composition=p.get("fabric_composition"),
                    fabric_gsm=p.get("fabric_gsm"),
                    stretch=p.get("stretch"),
                    softness=p.get("softness"),
                    opacity=p.get("opacity"),
                    has_transparency_test=p.get("has_transparency_test", False),
                    rating_avg=p.get("rating_avg", 5.0),
                    rating_count=p.get("rating_count", 0),
                    sizes=p.get("sizes", []),
                    available_sizes=p.get("available_sizes", []),
                    colors=p.get("colors", []),
                    size_chart=p.get("size_chart"),
                    activities=p.get("activities", ["yoga", "daily"]),
                )
                session.add(product_obj)
                await session.flush()

                # Add variants
                for v in p.get("variants", []):
                    v_price_rial = int((v.get("price_override") or p.get("price", 1000000)) * _TOMAN)
                    v_compare_rial = int(v["compare_at_price"] * _TOMAN) if v.get("compare_at_price") else None
                    var_obj = ProductVariant(
                        product_id=product_obj.id,
                        numeric_id=v.get("id"),
                        title=f"{v.get('color', '')} / {v.get('size', '')}".strip(" /"),
                        sku=v["sku"],
                        color=v.get("color"),
                        color_hex=v.get("color_hex"),
                        size=v.get("size"),
                        price_rial=v_price_rial,
                        compare_at_price_rial=v_compare_rial,
                        stock=v.get("stock", 10),
                        reserved=v.get("reserved", 0),
                        is_active=True,
                    )
                    session.add(var_obj)

        await session.commit()
        print(f"✅ Seeded {len(products_data)} Keras Fashion Products")

        # 5. Seed Reviews
        reviews_data = data.get("reviews", [])
        for r in reviews_data:
            stmt = select(ProductReview).where(
                ProductReview.product_slug == r["productSlug"],
                ProductReview.author_name == r["authorName"],
            )
            if not (await session.execute(stmt)).scalar_one_or_none():
                rev = ProductReview(
                    product_slug=r["productSlug"],
                    product_title=r["productTitle"],
                    product_thumbnail=r.get("productThumbnail"),
                    author_name=r["authorName"],
                    rating=r["rating"],
                    date=r["date"],
                    comment=r["comment"],
                    fit_feedback=r.get("fitFeedback"),
                    is_verified_buyer=r.get("isVerifiedBuyer", False),
                    status=r.get("status", "approved"),
                    size_purchased=r.get("size_purchased"),
                    reply=r.get("reply"),
                )
                session.add(rev)

        await session.commit()
        print(f"✅ Seeded {len(reviews_data)} Product Reviews")

        # 6. Seed Articles
        articles_data = data.get("articles", [])
        for a in articles_data:
            stmt = select(JournalArticle).where(JournalArticle.slug == a["slug"])
            if not (await session.execute(stmt)).scalar_one_or_none():
                art = JournalArticle(
                    title=a["title"],
                    slug=a["slug"],
                    category=a["category"],
                    category_label=a["categoryLabel"],
                    read_time=a["readTime"],
                    date=a["date"],
                    author=a["author"],
                    cover_image=a["coverImage"],
                    excerpt=a["excerpt"],
                    featured=a.get("featured", False),
                    status=a.get("status", "published"),
                    sections=a.get("sections", []),
                    linked_product_slugs=a.get("linkedProductSlugs", []),
                )
                session.add(art)

        await session.commit()
        print(f"✅ Seeded {len(articles_data)} Editorial Journal Articles")

        # 7. Seed Standard Boutique Coupons
        standard_coupons = [
            Coupon(
                code="KERAS-PRO",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=20,
                min_purchase_amount_rial=2000000 * _TOMAN,
                max_discount_amount_rial=800000 * _TOMAN,
                usage_limit=100,
                times_used=42,
                is_active=True,
            ),
            Coupon(
                code="SUMMER1405",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=15,
                min_purchase_amount_rial=1500000 * _TOMAN,
                max_discount_amount_rial=600000 * _TOMAN,
                usage_limit=150,
                times_used=88,
                is_active=True,
            ),
            Coupon(
                code="VIP-ATELIER",
                discount_type=DiscountType.FIXED_TOMAN,
                discount_value=500000 * _TOMAN,
                min_purchase_amount_rial=4000000 * _TOMAN,
                max_discount_amount_rial=500000 * _TOMAN,
                usage_limit=50,
                times_used=15,
                is_active=True,
            ),
            Coupon(
                code="WELCOME-KERAS",
                discount_type=DiscountType.PERCENTAGE,
                discount_value=10,
                min_purchase_amount_rial=1000000 * _TOMAN,
                max_discount_amount_rial=300000 * _TOMAN,
                usage_limit=500,
                times_used=230,
                is_active=True,
            ),
        ]
        for sc in standard_coupons:
            stmt = select(Coupon).where(Coupon.code == sc.code)
            if not (await session.execute(stmt)).scalar_one_or_none():
                session.add(sc)
        await session.commit()
        print(f"✅ Seeded Standard Boutique Coupons")

        print("🎉 Full Keras Seeding Complete!")


if __name__ == "__main__":
    asyncio.run(seed_data())