// server/api/reviews/[id]/reply.post.ts
import { mockReviews } from '../../../mock/reviews';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody<{ replyText?: string; text?: string; author?: string }>(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه نظر الزامی است.',
    });
  }

  const text = (body?.replyText || body?.text || '').trim();
  if (!text) {
    throw createError({
      statusCode: 422,
      statusMessage: 'متن پاسخ نمی‌تواند خالی باشد.',
    });
  }

  const review = mockReviews.find((r) => String(r.id) === String(id));
  if (!review) {
    throw createError({
      statusCode: 404,
      statusMessage: 'نظر مورد نظر یافت نشد.',
    });
  }

  review.reply = {
    text,
    date: '۱۴۰۵/۰۷/۱۵',
    author: body?.author || 'آتلیه کراس',
  };

  return {
    success: true,
    review,
  };
});
