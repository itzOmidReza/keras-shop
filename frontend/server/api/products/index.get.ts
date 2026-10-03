// server/api/products/index.get.ts
import { mockProducts } from '../../mock/products';
import type { ProductListItem, ProductDivision, ProductSeason } from '~/types/domain';

export default defineEventHandler(async (event): Promise<ProductListItem[]> => {
  const query = getQuery(event);

  // شبیه‌سازی تأخیر شبکه (۱۵۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 150));

  let items: ProductListItem[] = mockProducts.map((p): ProductListItem => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    division: p.division,
    category: p.category,
    season: p.season,
    price: p.price ?? p.base_price,
    base_price: p.base_price ?? p.price,
    compare_at_price: p.compare_at_price,
    images: p.images,
    sizes: p.sizes ?? p.available_sizes,
    available_sizes: p.available_sizes ?? p.sizes,
    colors: p.colors,
    inStock: p.inStock,
    rating: p.rating ?? p.rating_avg,
    rating_avg: p.rating_avg ?? p.rating,
    reviewCount: p.reviewCount ?? p.rating_count,
    rating_count: p.rating_count ?? p.reviewCount,
    description: p.description,
    fabric: p.fabric,
    fabric_composition: p.fabric_composition,
    fabric_gsm: p.fabric_gsm,
    is_active: p.is_active,
    badge: p.badge,
    has_transparency_test: p.has_transparency_test,
    stretch: p.stretch,
    softness: p.softness,
    opacity: p.opacity,
    line: p.line,
  }));

  // ۱. جست‌وجوی متنی (q)
  if (query.q && typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }

  // ۲. فیلتر شاخه اصلی (division: apparel / accessories)
  if (query.division && typeof query.division === 'string') {
    const targetDivision = query.division.toLowerCase().trim() as ProductDivision;
    if (targetDivision === 'apparel' || targetDivision === 'accessories') {
      items = items.filter((p) => p.division === targetDivision);
    }
  }

  // ۳. فیلتر فصل و کالکشن (season: fall-1405, winter-1405, spring-1406, summer-1405)
  if (query.season && typeof query.season === 'string') {
    const targetSeason = query.season.toLowerCase().trim() as ProductSeason;
    items = items.filter((p) => p.season === targetSeason);
  }

  // ۴. فیلتر دسته‌بندی کالا (category - تک‌دسته یا چنددسته با کاما)
  if (query.category && typeof query.category === 'string') {
    const categories = query.category.split(',').map((c) => c.trim().toLowerCase());
    items = items.filter((p) => categories.includes(p.category.toLowerCase()));
  }

  // ۵. فیلتر بج (مثلاً بج sale / حراج)
  if (query.badge && typeof query.badge === 'string') {
    const badgeTerm = query.badge.toLowerCase().trim();
    if (badgeTerm === 'sale') {
      items = items.filter(
        (p) =>
          (p.compare_at_price && p.compare_at_price > p.base_price) ||
          p.badge === 'حراج' ||
          p.badge === 'sale',
      );
    } else {
      items = items.filter((p) => p.badge?.toLowerCase() === badgeTerm);
    }
  }

  // ۶. فیلتر سایز (پشتیبانی از تک‌سایز و چندسایز با کاما)
  if (query.size && typeof query.size === 'string') {
    const targetSizes = query.size.split(',').map((s) => s.trim().toUpperCase());
    items = items.filter((p) =>
      p.available_sizes.some((sz) => targetSizes.includes(sz.toUpperCase())),
    );
  }

  // ۷. فیلتر رنگ (پشتیبانی از نام رنگ یا کد هگز)
  if (query.color && typeof query.color === 'string') {
    const targetColors = query.color.split(',').map((c) => c.trim().toLowerCase());
    items = items.filter((p) =>
      p.colors.some(
        (c) =>
          targetColors.includes(c.name.toLowerCase()) ||
          targetColors.includes(c.hex.toLowerCase()),
      ),
    );
  }

  // ۸. فیلتر حداقل و حداکثر قیمت (پشتیبانی از min_price و minPrice)
  const minVal = query.minPrice || query.min_price;
  if (minVal) {
    const min = Number(minVal);
    if (!isNaN(min) && min > 0) {
      items = items.filter((p) => p.base_price >= min);
    }
  }

  const maxVal = query.maxPrice || query.max_price;
  if (maxVal) {
    const max = Number(maxVal);
    if (!isNaN(max) && max > 0) {
      items = items.filter((p) => p.base_price <= max);
    }
  }

  // ۹. لاین سنتی (پشتیبانی از backwards compatibility)
  if (query.line && typeof query.line === 'string') {
    const targetLine = query.line.toLowerCase().trim();
    if (targetLine === 'move' || targetLine === 'calm') {
      items = items.filter((p) => p.line === targetLine);
    }
  }

  // ۱۰. مرتب‌سازی
  const sort = typeof query.sort === 'string' ? query.sort : 'bestseller';
  if (sort === 'price_asc') {
    items.sort((a, b) => a.base_price - b.base_price);
  } else if (sort === 'price_desc') {
    items.sort((a, b) => b.base_price - a.base_price);
  } else if (sort === 'newest') {
    items.sort((a, b) => b.id - a.id);
  } else {
    // پیش‌فرض: پرفروش‌ترین‌ها
    items.sort((a, b) => b.rating_count - a.rating_count);
  }

  return items;
});
