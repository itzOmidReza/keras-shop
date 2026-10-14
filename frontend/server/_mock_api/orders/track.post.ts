// server/api/orders/track.post.ts
import type { TrackOrderRequest, TrackOrderResponse } from '~/types/domain';
import { findMockOrderByQuery } from '../../mock/orders';

export default defineEventHandler(async (event): Promise<TrackOrderResponse> => {
  const body = await readBody<TrackOrderRequest>(event);

  if (!body || !body.query || typeof body.query !== 'string' || !body.query.trim()) {
    throw createError({
      statusCode: 422,
      statusMessage: 'لطفاً شماره سفارش یا شماره تلفن همراه را وارد نمایید.',
    });
  }

  const rawQuery = body.query.trim();

  // شبیه‌سازی تاخیر استعلام از پایگاه داده و وب‌سرویس شرکت پست
  await new Promise((resolve) => setTimeout(resolve, 450));

  const matchedOrder = findMockOrderByQuery(rawQuery);

  if (!matchedOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: 'سفارشی با این کد رهگیری، شماره سفارش یا شماره تماس یافت نشد. لطفاً از صحت اطلاعات واردشده اطمینان حاصل فرمایید.',
    });
  }

  return matchedOrder;
});
