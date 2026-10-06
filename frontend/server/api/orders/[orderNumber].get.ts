// server/api/orders/[orderNumber].get.ts
import type { TrackOrderResponse } from '~/types/domain';
import { findMockOrderByQuery } from '../../mock/orders';

export default defineEventHandler(async (event): Promise<TrackOrderResponse> => {
  const orderNumber = getRouterParam(event, 'orderNumber');

  if (!orderNumber || !orderNumber.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'شناسه سفارش معتبر نیست.',
    });
  }

  const rawQuery = decodeURIComponent(orderNumber).trim();
  const matchedOrder = findMockOrderByQuery(rawQuery);

  if (!matchedOrder) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Order Not Found',
      message: 'سفارشی با این شماره یافت نشد.',
    });
  }

  return matchedOrder;
});

