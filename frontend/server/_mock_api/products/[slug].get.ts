// server/api/products/[slug].get.ts
import { mockProducts } from '../../mock/products';
import type { ProductDetail } from '~/types/domain';

const SLUG_ALIASES: Record<string, string> = {
  'lined-long-wool-fouter-coat': 'long-lined-wool-fouter-coat',
  'cotton-jacquard-bandana-headband': 'cotton-jacquard-bandana',
  'chunky-knit-long-wool-scarf': 'thick-knit-wool-long-scarf',
  'wide-leg-autumn-linen-pants': 'autumn-wide-leg-linen-pants',
};

export default defineEventHandler(async (event): Promise<ProductDetail> => {
  const rawSlug = getRouterParam(event, 'slug');
  const slug = rawSlug ? (SLUG_ALIASES[rawSlug] || rawSlug) : '';

  // شبیه‌سازی تأخیر شبکه (۱۰۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const product = mockProducts.find((p) => p.slug === slug || p.slug === rawSlug);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product Not Found',
      message: `محصولی با مشخصه '${rawSlug}' یافت نشد.`,
    });
  }

  return product;
});
