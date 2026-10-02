// server/api/checkout/payment/initiate.post.ts
import type { PaymentInitiateRequest, PaymentInitiateResponse } from '~/types/domain';
import { createTransaction } from '../../../mock/transactions';

export default defineEventHandler(async (event): Promise<PaymentInitiateResponse> => {
  const body = await readBody<PaymentInitiateRequest>(event);

  if (!body || !body.orderNumber || !body.amount) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'شماره سفارش و مبلغ قابل پرداخت الزامی است.',
    });
  }

  // تاخیر اتصال به سوئیچ مرکزی شاپرک
  await new Promise((resolve) => setTimeout(resolve, 150));

  const tx = createTransaction({
    orderNumber: body.orderNumber,
    amount: body.amount,
    callbackUrl: body.callbackUrl || '/checkout/callback',
  });

  return {
    paymentToken: tx.token,
    gatewayUrl: `/checkout/gateway?token=${tx.token}`,
  };
});
