// server/api/orders/create.post.ts
import type {
  CartItem,
  OrderReceipt,
  PaymentMethod,
  ShippingAddress,
  ShippingMethod,
} from '~/types/domain';

interface CreateOrderRequestBody {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  couponDiscount?: number;
}

export default defineEventHandler(async (event): Promise<OrderReceipt> => {
  const body = await readBody<CreateOrderRequestBody>(event);

  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'سبد خرید شما برای ثبت سفارش خالی است.',
    });
  }

  const { shippingAddress, shippingMethod, paymentMethod, items } = body;

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phoneNumber ||
    !shippingAddress.province ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.exactAddress
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'لطفاً تمامی فیلدهای الزامی آدرس و مشخصات تحویل‌گیرنده را تکمیل کنید.',
    });
  }

  // شبیه‌سازی تاخیر شبکه و اتصال به درگاه پرداخت شاپرک
  await new Promise((resolve) => setTimeout(resolve, 600));

  // محاسبه مبالغ
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemDiscounts = items.reduce((sum, item) => {
    if (item.compareAtPrice && item.compareAtPrice > item.price) {
      return sum + (item.compareAtPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const couponDiscount = Number(body.couponDiscount) || 0;
  const totalDiscount = itemDiscounts + couponDiscount;

  let shippingCost = 65000;
  if (shippingMethod === 'express') {
    shippingCost = 120000;
  } else if (subtotal >= 1500000) {
    shippingCost = 0;
  }

  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  // تولید شناسه یکتا برای سفارش
  const orderNumber = `KRS-${Math.floor(100000 + Math.random() * 900000)}`;

  const estimatedDelivery =
    shippingMethod === 'express'
      ? 'روز کاری بعد (پیک فوری تهران)'
      : '۲ تا ۴ روز کاری (پست پیشتاز کشوری)';

  const receipt: OrderReceipt = {
    orderNumber,
    items,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    subtotal,
    discount: totalDiscount,
    shippingCost,
    finalTotal,
    paymentStatus: 'completed',
    createdAt: new Date().toISOString(),
    estimatedDelivery,
  };

  return receipt;
});
