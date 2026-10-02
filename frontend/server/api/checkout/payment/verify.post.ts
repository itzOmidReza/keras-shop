// server/api/checkout/payment/verify.post.ts
import type { PaymentVerifyRequest, PaymentVerifyResponse } from '~/types/domain';
import { getTransaction, updateTransaction } from '../../../mock/transactions';
import { updateMockOrderStatus } from '../../../mock/orders';
import { mockUserOrders } from '../../../mock/users';

export default defineEventHandler(async (event): Promise<PaymentVerifyResponse> => {
  const body = await readBody<PaymentVerifyRequest>(event);

  if (!body || !body.paymentToken) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'توکن پرداخت شاپرک الزامی است.',
    });
  }

  // شبیه‌سازی تاخیر استعلام شاپرک (۵۰۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const tx = getTransaction(body.paymentToken);

  if (!tx) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'تراکنش پرداخت یافت نشد یا منقضی گردیده است.',
    });
  }

  const action = body.action || 'success';

  if (action === 'cancel') {
    updateTransaction(body.paymentToken, {
      status: 'cancelled',
      errorMessage: 'تراکنش توسط کاربر لغو گردید.',
    });
    return {
      success: false,
      orderNumber: tx.orderNumber,
      errorMessage: 'فرآیند پرداخت توسط شما لغو شد. اقلام سبد خرید برای تلاش مجدد شما محفوظ باقی مانده‌اند.',
    };
  }

  if (action === 'fail') {
    updateTransaction(body.paymentToken, {
      status: 'failed',
      errorMessage: 'موجودی حساب کافی نیست یا تراکنش توسط بانک صادرکننده کارت رد شد.',
    });
    return {
      success: false,
      orderNumber: tx.orderNumber,
      errorMessage: 'پرداخت ناموفق بود: موجودی حساب کافی نیست یا اطلاعات کارت نامعتبر است (خطای شاپرک ۶۱).',
    };
  }

  // پرداخت موفقیت‌آمیز
  // تولید شماره مرجع ۱۲ رقمی شاپرک (RRN)
  const rrn = '98' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  // تولید شماره پیگیری داخلی سوئیچ
  const traceNo = Math.floor(100000 + Math.random() * 900000).toString();
  const paidAt = new Date().toISOString();

  updateTransaction(body.paymentToken, {
    status: 'settled',
    referenceId: rrn,
    transactionId: traceNo,
    cardNumber: body.cardNumber,
    paidAt,
  });

  // به‌روزرسانی وضعیت سفارش در دیتابیس سفارش‌ها
  updateMockOrderStatus(tx.orderNumber, 'processing', 'پرداخت تایید شد (در حال پردازش)');

  // به‌روزرسانی در لیست سفارشات پروفایل کاربر
  const userOrder = mockUserOrders.find((uo) => uo.orderNumber === tx.orderNumber);
  if (userOrder) {
    userOrder.status = 'processing';
    userOrder.statusLabel = 'پرداخت‌شده (در حال پردازش در انبار)';
  }

  return {
    success: true,
    orderNumber: tx.orderNumber,
    referenceId: rrn,
    transactionId: traceNo,
    paidAt,
  };
});
