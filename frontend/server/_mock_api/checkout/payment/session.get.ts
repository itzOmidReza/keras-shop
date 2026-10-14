// server/api/checkout/payment/session.get.ts
import type { PaymentSessionInfo } from '~/types/domain';
import { getTransaction } from '../../../mock/transactions';

export default defineEventHandler(async (event): Promise<PaymentSessionInfo> => {
  const query = getQuery(event);
  const token = typeof query.token === 'string' ? query.token : '';

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'توکن پرداخت شاپرک الزامی است.',
    });
  }

  // تاخیر کوتاه شبکه
  await new Promise((resolve) => setTimeout(resolve, 100));

  const tx = getTransaction(token);

  if (!tx) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'نشست پرداخت معتبر یافت نشد یا منقضی گردیده است.',
    });
  }

  // بررسی انقضای توکن
  if (new Date(tx.expiresAt).getTime() < Date.now()) {
    throw createError({
      statusCode: 410,
      statusMessage: 'Gone',
      message: 'مهلت پرداخت در درگاه شاپرک منقضی شده است.',
    });
  }

  return {
    token: tx.token,
    orderNumber: tx.orderNumber,
    amount: tx.amount,
    merchantName: tx.merchantName,
    createdAt: tx.createdAt,
    expiresAt: tx.expiresAt,
    status: tx.status,
  };
});
