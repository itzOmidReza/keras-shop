// server/api/products/[slug]/reviews.post.ts
import { mockReviews } from '../../../mock/reviews';
import { mockProducts } from '../../../mock/products';
import type { ProductReview, FitFeedback } from '~/types/domain';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const body = await readBody<{
    authorName?: string;
    rating?: number;
    comment: string;
    fitFeedback?: FitFeedback;
    sizePurchased?: string;
  }>(event);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه محصول الزامی است.',
    });
  }

  if (!body?.comment || !body.comment.trim()) {
    throw createError({
      statusCode: 422,
      statusMessage: 'متن دیدگاه نمی‌تواند خالی باشد.',
    });
  }

  const foundProduct = mockProducts.find((p) => p.slug === slug);
  const rating = Number(body.rating) >= 1 && Number(body.rating) <= 5 ? Number(body.rating) : 5;
  const authorName = body.authorName?.trim() || 'مشتری محترم';

  const firstImg = foundProduct?.images?.[0];
  const thumbnail =
    (typeof firstImg === 'string' ? firstImg : firstImg?.url) ||
    'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800';

  let normalizedFit: 'true_to_size' | 'runs_small' | 'runs_large' = 'true_to_size';
  if (body.fitFeedback === 'runs_small' || body.fitFeedback === 'small') {
    normalizedFit = 'runs_small';
  } else if (body.fitFeedback === 'runs_large' || body.fitFeedback === 'large') {
    normalizedFit = 'runs_large';
  }

  const newReview: ProductReview = {
    id: Date.now(),
    productSlug: slug,
    productTitle: foundProduct?.title || 'محصول کراس',
    productThumbnail: thumbnail,
    authorName,
    rating,
    date: '۱۴۰۵/۰۷/۱۵',
    comment: body.comment.trim(),
    fitFeedback: normalizedFit,
    isVerifiedBuyer: false,
    status: 'pending',
    size_purchased: body.sizePurchased,
    // سازگاری با کدهای پیشین
    author: authorName,
    verified_purchase: false,
    fit_feedback: normalizedFit === 'runs_small' ? 'small' : normalizedFit === 'runs_large' ? 'large' : 'true_to_size',
    created_at: new Date().toISOString(),
  };

  mockReviews.unshift(newReview);

  return {
    success: true,
    message: 'دیدگاه شما ثبت شد و پس از بررسی تیم منتشر خواهد شد.',
    review: newReview,
  };
});
