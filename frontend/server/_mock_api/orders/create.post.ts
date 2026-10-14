// server/api/orders/create.post.ts
import type {
  CartItem,
  OrderReceipt,
  PaymentMethod,
  ShippingAddress,
  ShippingMethod,
  TrackOrderResponse,
} from '~/types/domain';
import { mockUserOrders } from '../../mock/users';
import { addMockOrder } from '../../mock/orders';

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
  const orderNumber = `KERAS-${Math.floor(100000 + Math.random() * 900000)}`;

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

  const trackingBarcode =
    shippingMethod === 'express'
      ? `EXP-${orderNumber.replace('KERAS-', '')}`
      : `${Math.floor(100000000000 + Math.random() * 900000000000)}${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  const carrierName =
    shippingMethod === 'express'
      ? 'پیک اختصاصی کراس (تهران)'
      : 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)';

  // ثبت در مخزن کاربر لاگین شده
  mockUserOrders.unshift({
    orderNumber,
    createdAt: receipt.createdAt,
    status: 'processing',
    statusLabel: 'در حال پردازش در انبار',
    finalTotal,
    itemCount: items.reduce((sum, it) => sum + it.quantity, 0),
    trackingCode: trackingBarcode,
    shippingAddress,
    items,
  });

  // ثبت در مخزن رهگیری زنده سفارش‌ها
  const trackableOrder: TrackOrderResponse = {
    orderNumber,
    createdAt: receipt.createdAt,
    status: 'registered',
    statusLabel: 'سفارش ثبت‌شده (آماده پردازش)',
    recipientName: shippingAddress.fullName,
    recipientPhone: shippingAddress.phoneNumber,
    shippingAddress: `${shippingAddress.province}، ${shippingAddress.city}، ${shippingAddress.exactAddress}`,
    trackingCode: trackingBarcode,
    carrier: carrierName,
    estimatedDelivery,
    totalAmount: finalTotal,
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'سفارش شما در سیستم ثبت و پرداخت در درگاه با موفقیت تایید شد.',
        timestamp: 'هم‌اکنون',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
      {
        status: 'processing',
        title: 'بسته‌بندی و کنترل کیفیت',
        description: 'سفارش در صف آماده‌سازی و کنترل کیفی در انبار مرکزی قرار گرفت.',
        timestamp: 'در انتظار پردازش',
        location: 'انبار مرکزی تهران',
        completed: false,
      },
      {
        status: 'handed_over',
        title: 'تحویل به ناوگان ارسال',
        description: `بسته پس از بسته‌بندی تحویل ${carrierName} خواهد شد.`,
        timestamp: 'به زودی',
        location: 'مرکز ارسال',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'تحویل نهایی به خریدار',
        description: 'تحویل بسته به خریدار در آدرس ثبت‌شده.',
        timestamp: estimatedDelivery,
        location: 'نشانی تحویل‌گیرنده',
        completed: false,
      },
    ],
    items: items.map((item) => ({
      title: item.title,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    })),
  };

  addMockOrder(trackableOrder);

  return receipt;
});
