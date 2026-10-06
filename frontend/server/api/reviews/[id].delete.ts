// server/api/reviews/[id].delete.ts
import { mockReviews } from '../../mock/reviews';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه نظر الزامی است.',
    });
  }

  const index = mockReviews.findIndex((r) => String(r.id) === String(id));
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'نظر مورد نظر یافت نشد.',
    });
  }

  mockReviews.splice(index, 1);

  return {
    success: true,
    id,
  };
});
