// server/api/products/index.get.ts
import { mockProducts } from '../../mock/products';
import type { ProductListItem } from '~/types/domain';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // شبیه‌سازی تأخیر شبکه (۱۵۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 150));

  let items = mockProducts.map((p): ProductListItem => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    line: p.line,
    base_price: p.base_price,
    compare_at_price: p.compare_at_price,
    images: p.images,
    colors: p.colors,
    rating_avg: p.rating_avg,
    rating_count: p.rating_count,
    is_active: p.is_active,
    has_transparency_test: p.has_transparency_test,
    stretch: p.stretch,
    opacity: p.opacity,
    available_sizes: p.available_sizes,
  }));

  // ۱. جست‌وجوی متنی عنوان یا اسلاگ (q)
  if (query.q && typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term),
    );
  }

  // ۲. فیلتر لاین محصول (move / calm)
  if (query.line && typeof query.line === 'string') {
    const targetLine = query.line.toLowerCase().trim();
    if (targetLine === 'move' || targetLine === 'calm') {
      items = items.filter((p) => p.line === targetLine);
    }
  }

  // ۲. فیلتر دسته‌بندی کالا
  if (query.category && typeof query.category === 'string') {
    const categories = query.category.split(',').map((c) => c.trim().toLowerCase());
    const fullProductsMap = new Map(mockProducts.map((p) => [p.id, p]));
    items = items.filter((item) => {
      const full = fullProductsMap.get(item.id);
      return (
        full &&
        (categories.includes(full.category.slug.toLowerCase()) ||
          categories.includes(full.category.title.toLowerCase()))
      );
    });
  }

  // ۳. فیلتر سایز (پشتیبانی از تک‌سایز و چندسایز با کاما)
  if (query.size && typeof query.size === 'string') {
    const targetSizes = query.size.split(',').map((s) => s.trim().toUpperCase());
    items = items.filter((p) =>
      p.available_sizes.some((sz) => targetSizes.includes(sz.toUpperCase())),
    );
  }

  // ۴. فیلتر رنگ (پشتیبانی از نام رنگ یا کد هگز)
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

  // ۵. فیلتر حداقل و حداکثر قیمت
  if (query.min_price) {
    const min = Number(query.min_price);
    if (!isNaN(min) && min > 0) {
      items = items.filter((p) => p.base_price >= min);
    }
  }

  if (query.max_price) {
    const max = Number(query.max_price);
    if (!isNaN(max) && max > 0) {
      items = items.filter((p) => p.base_price <= max);
    }
  }

  // ۶. مرتب‌سازی
  const sort = typeof query.sort === 'string' ? query.sort : 'bestseller';
  if (sort === 'price_asc') {
    items.sort((a, b) => a.base_price - b.base_price);
  } else if (sort === 'price_desc') {
    items.sort((a, b) => b.base_price - a.base_price);
  } else if (sort === 'newest') {
    items.sort((a, b) => b.id - a.id);
  } else {
    // پیش‌فرض: محبوب‌ترین و پرفروش
    items.sort((a, b) => b.rating_count - a.rating_count);
  }

  return items;
});
