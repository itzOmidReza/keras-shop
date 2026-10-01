// server/api/products/[slug].get.ts
import { mockProducts } from '../../mock/products';
import type { ProductDetail } from '~/types/domain';

export default defineEventHandler(async (event): Promise<ProductDetail> => {
  const slug = getRouterParam(event, 'slug');

  // شبیه‌سازی تأخیر شبکه (۱۰۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product Not Found',
      message: `محصولی با مشخصه '${slug}' یافت نشد.`,
    });
  }

  return product;
});
