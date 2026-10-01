// server/api/products/[slug]/related.get.ts
import { mockProducts } from '../../../mock/products';
import type { ProductListItem } from '~/types/domain';

export default defineEventHandler(async (event): Promise<ProductListItem[]> => {
  const slug = getRouterParam(event, 'slug');

  // شبیه‌سازی تاخیر شبکه
  await new Promise((resolve) => setTimeout(resolve, 100));

  const current = mockProducts.find((p) => p.slug === slug);

  // حذف محصول جاری از لیست پیشنهادات
  const others = mockProducts.filter((p) => p.slug !== slug);

  if (!current) {
    return others.slice(0, 4).map((p): ProductListItem => ({
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
  }

  // اولویت ۱: محصولات هم‌لاین (Move / Calm)
  // اولویت ۲: محصولات با دسته‌بندی مکمل
  const sorted = [...others].sort((a, b) => {
    const aSameLine = a.line === current.line ? 1 : 0;
    const bSameLine = b.line === current.line ? 1 : 0;
    return bSameLine - aSameLine;
  });

  return sorted.slice(0, 4).map((p): ProductListItem => ({
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
});
