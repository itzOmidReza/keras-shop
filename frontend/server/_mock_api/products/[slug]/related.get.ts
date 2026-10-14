// server/api/products/[slug]/related.get.ts
import { mockProducts } from '../../../mock/products';
import type { ProductListItem } from '~/types/domain';

export default defineEventHandler(async (event): Promise<ProductListItem[]> => {
  const slug = getRouterParam(event, 'slug');

  // شبیه‌سازی تاخیر شبکه
  await new Promise((resolve) => setTimeout(resolve, 100));

  const current = mockProducts.find((p) => p.slug === slug);
  const others = mockProducts.filter((p) => p.slug !== slug);

  const mapToListItem = (p: (typeof mockProducts)[0]): ProductListItem => ({
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
  });

  if (!current) {
    return others.slice(0, 4).map(mapToListItem);
  }

  // اولویت ۱: محصولات هم‌دسته
  // اولویت ۲: محصولات با همان شاخه (پوشاک / اکسسوری) یا فصل
  const sorted = [...others].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.category === current.category) scoreA += 10;
    if (b.category === current.category) scoreB += 10;

    if (a.division === current.division) scoreA += 5;
    if (b.division === current.division) scoreB += 5;

    if (a.season === current.season) scoreA += 3;
    if (b.season === current.season) scoreB += 3;

    return scoreB - scoreA;
  });

  return sorted.slice(0, 4).map(mapToListItem);
});
