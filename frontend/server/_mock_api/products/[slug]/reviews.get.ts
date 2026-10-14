// server/api/products/[slug]/reviews.get.ts
import { getProductReviewsResponse } from '../../../mock/reviews';
import type { ProductReviewsResponse } from '~/types/domain';

export default defineEventHandler(async (event): Promise<ProductReviewsResponse> => {
  const slug = getRouterParam(event, 'slug');

  // شبیه‌سازی تاخیر شبکه
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه محصول نامعتبر است.',
    });
  }

  return getProductReviewsResponse(slug);
});
