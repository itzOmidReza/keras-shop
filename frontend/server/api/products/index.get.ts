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

  // فیلتر بر اساس لاین محصول (move / calm)
  if (query.line && typeof query.line === 'string') {
    const targetLine = query.line.toLowerCase();
    items = items.filter((p) => p.line === targetLine);
  }

  // فیلتر بر اساس دسته‌بندی
  if (query.category && typeof query.category === 'string') {
    const fullProductsMap = new Map(mockProducts.map((p) => [p.id, p]));
    items = items.filter((item) => {
      const full = fullProductsMap.get(item.id);
      return full?.category.slug === query.category;
    });
  }

  // فیلتر بر اساس سایز
  if (query.size && typeof query.size === 'string') {
    items = items.filter((p) => p.available_sizes.includes(query.size as string));
  }

  // فیلتر بر اساس رنگ
  if (query.color && typeof query.color === 'string') {
    items = items.filter((p) => p.colors.some((c) => c.name === query.color));
  }

  // مرتب‌سازی
  if (query.sort === 'price_asc') {
    items.sort((a, b) => a.base_price - b.base_price);
  } else if (query.sort === 'price_desc') {
    items.sort((a, b) => b.base_price - a.base_price);
  } else if (query.sort === 'bestseller') {
    items.sort((a, b) => b.rating_count - a.rating_count);
  } else if (query.sort === 'newest') {
    items.sort((a, b) => b.id - a.id);
  }

  return items;
});
