// server/api/reviews/[id]/status.put.ts
import { mockReviews } from '../../../mock/reviews';
import type { ReviewStatus } from '~/types/domain';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ status: ReviewStatus }>(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه نظر الزامی است.',
    });
  }

  if (!body?.status || !['pending', 'approved', 'rejected'].includes(body.status)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'وضعیت ارسال‌شده نامعتبر است.',
    });
  }

  const review = mockReviews.find((r) => String(r.id) === String(id));
  if (!review) {
    throw createError({
      statusCode: 404,
      statusMessage: 'نظر مورد نظر یافت نشد.',
    });
  }

  review.status = body.status;

  return {
    success: true,
    review,
  };
});
