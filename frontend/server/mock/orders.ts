// server/mock/orders.ts
import type { TrackOrderResponse } from '~/types/domain';

export const mockOrders: TrackOrderResponse[] = [
  {
    orderNumber: 'KERAS-104921',
    createdAt: '2026-03-24T10:15:00Z',
    status: 'delivered',
    statusLabel: 'تحویل نهایی به خریدار',
    recipientName: 'سارا ملکی',
    recipientPhone: '09123456789',
    shippingAddress: 'تهران، خیابان ولیعصر، بالاتر از پارک وی، کوچه مریم، پلاک ۱۲، واحد ۴',
    trackingCode: '982341908234123456789012',
    carrier: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    estimatedDelivery: 'تحویل داده شده',
    totalAmount: 2340000,
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'سفارش با موفقیت در سامانه کراس ثبت و پرداخت تایید شد.',
        timestamp: '۱۴۰۳/۰۷/۰۱ - ۱۰:۱۵',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
      {
        status: 'processing',
        title: 'بسته‌بندی و کنترل کیفیت',
        description: 'اقلام سفارش بررسی کیفی شده و در جعبه اختصاصی قرار گرفتند.',
        timestamp: '۱۴۰۳/۰۷/۰۱ - ۱۴:۳۰',
        location: 'انبار مرکزی تهران',
        completed: true,
      },
      {
        status: 'handed_over',
        title: 'تحویل به شرکت پست',
        description: 'مرسوله تحویل باجه پستی شد و بارکد ۲۴ رقمی صادر گردید.',
        timestamp: '۱۴۰۳/۰۷/۰۲ - ۰۹:۰۰',
        location: 'مرکز مبادلات پست تهران',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'تحویل نهایی به خریدار',
        description: 'مرسوله با امضای تحویل‌گیرنده تحویل داده شد.',
        timestamp: '۱۴۰۳/۰۷/۰۳ - ۱۱:۴۵',
        location: 'تهران، مقصد',
        completed: true,
      },
    ],
    items: [
      {
        title: 'لگ سیم‌لس آرامش',
        size: 'M',
        color: 'مشکی زغالی',
        quantity: 1,
        price: 1450000,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'نیم‌تنه تمرینی حرکت',
        size: 'S',
        color: 'خاک رس',
        quantity: 1,
        price: 890000,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    orderNumber: 'KERAS-208314',
    createdAt: '2026-04-01T16:20:00Z',
    status: 'handed_over',
    statusLabel: 'تحویل به ناوگان پست (در مسیر ارسال)',
    recipientName: 'پرهام انصاری',
    recipientPhone: '09351234567',
    shippingAddress: 'اصفهان، خیابان چهارباغ بالا، مجتمع کوثر، طبقه ۲، واحد ۲۰۱',
    trackingCode: '124987239841567890123456',
    carrier: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    estimatedDelivery: '۱ تا ۲ روز کاری آینده',
    totalAmount: 1890000,
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'سفارش با موفقیت ثبت شد و صورت‌حساب مالی صادر گردید.',
        timestamp: '۱۴۰۳/۰۷/۰۹ - ۱۶:۲۰',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
      {
        status: 'processing',
        title: 'بسته‌بندی و کنترل کیفیت',
        description: 'الیاف پارچه و دوخت بررسی و بسته آماده تحویل به پست شد.',
        timestamp: '۱۴۰۳/۰۷/۱۰ - ۰۸:۴۵',
        location: 'انبار مرکزی تهران',
        completed: true,
      },
      {
        status: 'handed_over',
        title: 'تحویل به شرکت پست',
        description: 'مرسوله با بارکد رسمی به ناوگان پستی سپرده شد و در حال رهسپاری به مقصد است.',
        timestamp: '۱۴۰۳/۰۷/۱۰ - ۱۲:۳۰',
        location: 'مرکز تجزیه و مبادلات پست لشکر',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'تحویل نهایی به خریدار',
        description: 'توزیع توسط مامور پست در نشانی خریدار.',
        timestamp: 'پیش‌بینی: ۱۲ مهر',
        location: 'اصفهان',
        completed: false,
      },
    ],
    items: [
      {
        title: 'شورت ورزشی دویدن حرکت',
        size: 'L',
        color: 'سبز مریم‌گلی',
        quantity: 1,
        price: 1100000,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'تاپ ورزشی آرامش',
        size: 'M',
        color: 'شنی',
        quantity: 1,
        price: 790000,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    orderNumber: 'KERAS-309115',
    createdAt: '2026-04-02T10:05:00Z',
    status: 'processing',
    statusLabel: 'در حال بسته‌بندی در انبار مرکزی',
    recipientName: 'نیلوفر راد',
    recipientPhone: '09199876543',
    shippingAddress: 'تهران، شهرک غرب، خیابان ایران زمین، کوچه چهارم، پلاک ۱۸',
    trackingCode: 'KERAS-EXP-309115',
    carrier: 'پیک اختصاصی کراس (ارسال فوری تهران)',
    estimatedDelivery: 'امروز تا ساعت ۲۰:۰۰ (ارسال اکسپرس)',
    totalAmount: 3200000,
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'سفارش دریافت شد و در صف پردازش انبار اختصاصی قرار گرفت.',
        timestamp: 'امروز - ۱۰:۰۵',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
      {
        status: 'processing',
        title: 'بسته‌بندی و کنترل کیفیت',
        description: 'واحد کنترل کیفیت در حال بررسی سلامت الیاف و بسته‌بندی با کاور محافظ است.',
        timestamp: 'امروز - ۱۱:۳۰',
        location: 'انبار مرکزی تهران',
        completed: true,
      },
      {
        status: 'handed_over',
        title: 'تحویل به سفیر کراس',
        description: 'هماهنگی جهت تحویل بسته به سفیر اختصاصی ناوگان کراس.',
        timestamp: 'پیش‌بینی: ساعت ۱۵:۰۰',
        location: 'مرکز توزیع تهران',
        completed: false,
      },
      {
        status: 'delivered',
        title: 'تحویل نهایی به خریدار',
        description: 'تحویل حضوری به تحویل‌گیرنده در محل.',
        timestamp: 'پیش‌بینی: تا ساعت ۲۰:۰۰',
        location: 'تهران، نشانی خریدار',
        completed: false,
      },
    ],
    items: [
      {
        title: 'لگینگ فشاری حرکت ۳۰۰ GSM',
        size: 'S',
        color: 'قرمز عقیق',
        quantity: 1,
        price: 1850000,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'نیم‌تنه تمرینی حرکت',
        size: 'S',
        color: 'مشکی',
        quantity: 1,
        price: 1350000,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

/**
 * افزودن سفارش جدید به مخزن سفارش‌های قابل رهگیری
 */
export const addMockOrder = (order: TrackOrderResponse) => {
  mockOrders.unshift(order);
  return order;
};

/**
 * جستجوی سفارش بر اساس شماره سفارش، کد رهگیری پستی یا شماره همراه
 */
export const findMockOrderByQuery = (rawQuery: string): TrackOrderResponse | undefined => {
  if (!rawQuery) return undefined;

  // نرمال‌سازی ارقام فارسی و عربی به انگلیسی
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const AR = '٠١٢٣٤٥٦٧٨٩';
  const query = rawQuery
    .trim()
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));

  const cleanQuery = query.toLowerCase();
  const digitsOnly = query.replace(/\D/g, '');

  return mockOrders.find((order) => {
    const orderNum = order.orderNumber.toLowerCase();
    const orderDigits = order.orderNumber.replace(/\D/g, '');
    const tracking = order.trackingCode.toLowerCase();
    const phone = (order.recipientPhone || '').replace(/\D/g, '');

    // مطابقت کامل با شماره سفارش (مثل KERAS-208314 یا KRS-208314)
    if (orderNum === cleanQuery) return true;

    // مطابقت بدون پیشوند (مثل 208314)
    if (digitsOnly.length >= 5 && orderDigits === digitsOnly) return true;

    // مطابقت با کد رهگیری پستی
    if (tracking === cleanQuery || (digitsOnly.length > 10 && tracking.includes(digitsOnly))) return true;

    // مطابقت با شماره همراه خریدار (مثل 09123456789 یا 9123456789)
    if (digitsOnly.length >= 10 && (phone === digitsOnly || phone.endsWith(digitsOnly.slice(-10)))) return true;

    return false;
  });
};
