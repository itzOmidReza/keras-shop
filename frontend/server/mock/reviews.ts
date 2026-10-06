// server/mock/reviews.ts
import type { ProductReview, ProductReviewsResponse } from '~/types/domain';

export const mockReviews: ProductReview[] = [
  // Product: karen-slub-linen-blouse (شومیز لنین اسلپ کارن)
  {
    id: 1,
    productSlug: 'karen-slub-linen-blouse',
    productTitle: 'شومیز لنین اسلپ کارن',
    productThumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800',
    authorName: 'سارا ملکی',
    author: 'سارا ملکی',
    rating: 5,
    date: '۱۴۰۵/۰۶/۲۰',
    created_at: '2026-09-10T10:30:00Z',
    comment:
      'کیفیت الیاف لنین فوق‌العاده‌ست! ریزش پارچه و تن‌خور کار بی‌نظیره و اصلاً بعد شست‌وشو آبرفت نداشت.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'M',
    status: 'approved',
    reply: {
      text: 'سارا عزیز، خوشحالیم که از ایستایی و کیفیت الیاف طبیعی شومیز کارن رضایت دارید. پوشیدن آن در روزهای پاییزی همراه شماست.',
      date: '۱۴۰۵/۰۶/۲۱',
      author: 'آتلیه کراس',
    },
  },
  {
    id: 2,
    productSlug: 'karen-slub-linen-blouse',
    productTitle: 'شومیز لنین اسلپ کارن',
    productThumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800',
    authorName: 'نگار رادمهر',
    author: 'نگار رادمهر',
    rating: 5,
    date: '۱۴۰۵/۰۶/۲۸',
    created_at: '2026-09-18T16:45:00Z',
    comment:
      'دوخت بسیار تمیز و دکمه‌های صدفی باکیفیت. رنگ کرم ماسه‌ای دقیقاً شبیه عکس‌های آتلیه بود.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'S',
    status: 'approved',
  },
  {
    id: 3,
    productSlug: 'karen-slub-linen-blouse',
    productTitle: 'شومیز لنین اسلپ کارن',
    productThumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800',
    authorName: 'مهسا کاظمی',
    author: 'مهسا کاظمی',
    rating: 4,
    date: '۱۴۰۵/۰۷/۰۱',
    created_at: '2026-09-22T11:20:00Z',
    comment:
      'تن‌خور کار خیلی قشنگه فقط آستین‌هاش کمی بلندتر از حد معموله که برای استایل کژوال با تا زدن عالی میشه.',
    fitFeedback: 'runs_large',
    fit_feedback: 'large',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'M',
    status: 'approved',
  },
  {
    id: 4,
    productSlug: 'karen-slub-linen-blouse',
    productTitle: 'شومیز لنین اسلپ کارن',
    productThumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800',
    authorName: 'پریا دادخواه',
    author: 'پریا دادخواه',
    rating: 5,
    date: '۱۴۰۵/۰۷/۰۴',
    created_at: '2026-09-25T09:10:00Z',
    comment:
      'آیا رنگ زیتونی این کار دوباره شارژ میشه؟ کار قبلی رو خریدم و خیلی راضی بودم.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: false,
    verified_purchase: false,
    status: 'pending',
  },
  {
    id: 5,
    productSlug: 'oversized-washed-cotton-shirt',
    productTitle: 'پیراهن نخ پنبه واش‌شده اورسایز',
    productThumbnail: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=800',
    authorName: 'شیدا انوری',
    author: 'شیدا انوری',
    rating: 5,
    date: '۱۴۰۵/۰۶/۲۵',
    created_at: '2026-09-15T14:15:00Z',
    comment:
      'پارچه پنبه‌ای بسیار خنک و لطیف. برای پاییز زیر ژاکت یا به تنهایی استایل فوق‌العاده‌ای داره.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'L',
    status: 'approved',
    reply: {
      text: 'شیدا عزیز، سپاس از ثبت دیدگاه شما. پیراهن اورسایز واش‌شده از پرطرفدارترین طراحی‌های کپسول پاییزی ماست.',
      date: '۱۴۰۵/۰۶/۲۶',
      author: 'آتلیه کراس',
    },
  },
  {
    id: 6,
    productSlug: 'oversized-washed-cotton-shirt',
    productTitle: 'پیراهن نخ پنبه واش‌شده اورسایز',
    productThumbnail: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=800',
    authorName: 'الهام توکلی',
    author: 'الهام توکلی',
    rating: 3,
    date: '۱۴۰۵/۰۷/۰۲',
    created_at: '2026-09-23T18:00:00Z',
    comment:
      'قواره لباس بسیار بزرگ‌تر از چیزی هست که فکر می‌کردم، حتماً یک سایز کوچک‌تر انتخاب کنید.',
    fitFeedback: 'runs_large',
    fit_feedback: 'large',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'M',
    status: 'pending',
  },
  {
    id: 7,
    productSlug: 'fluffy-turtleneck-knit-sweater',
    productTitle: 'پلیور یقه اسکی بافت موهر',
    productThumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800',
    authorName: 'کیمیا افشار',
    author: 'کیمیا افشار',
    rating: 5,
    date: '۱۴۰۵/۰۶/۱۵',
    created_at: '2026-09-05T12:30:00Z',
    comment:
      'تراکم بافت موهر عالیه و اصلاً ایجاد خارش پوستی نمیکنه. رنگ شیری ملایم بسیار شیک است.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'S',
    status: 'approved',
  },
  {
    id: 8,
    productSlug: 'fluffy-turtleneck-knit-sweater',
    productTitle: 'پلیور یقه اسکی بافت موهر',
    productThumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800',
    authorName: 'مریم بهرامی',
    author: 'مریم بهرامی',
    rating: 2,
    date: '۱۴۰۵/۰۷/۰۵',
    created_at: '2026-09-26T13:40:00Z',
    comment: 'لطفاً متن نامربوط حذف شود... تبلیغات سایت دیگر.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: false,
    verified_purchase: false,
    status: 'rejected',
  },
  {
    id: 9,
    productSlug: 'cashmere-open-front-cardigan',
    productTitle: 'کاردیگان جلوباز پشمی با کشمیر',
    productThumbnail: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800',
    authorName: 'نازنین صفوی',
    author: 'نازنین صفوی',
    rating: 5,
    date: '۱۴۰۵/۰۷/۰۳',
    created_at: '2026-09-24T15:20:00Z',
    comment:
      'گرما و سبکی بی‌نظیر. لمس بافت کشمیر واقعاً حس لوکس بودن رو منتقل میکنه.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'Free',
    status: 'pending',
  },
  {
    id: 10,
    productSlug: 'calm-seamless-leggings-black',
    productTitle: 'لگینگ ورزشی سیم‌لس مشکی کالم',
    productThumbnail: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800',
    authorName: 'سمیرا نادری',
    author: 'سمیرا نادری',
    rating: 5,
    date: '۱۴۰۵/۰۶/۱۰',
    created_at: '2026-08-31T17:10:00Z',
    comment:
      'واقعاً تست اسکات‌پروف رو پاس کرد! حین تمرینات کششی یوگا اصلاً بدن‌نما نیست و کمرش لول نمیشه.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'M',
    status: 'approved',
  },
  {
    id: 11,
    productSlug: 'calm-seamless-leggings-black',
    productTitle: 'لگینگ ورزشی سیم‌لس مشکی کالم',
    productThumbnail: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800',
    authorName: 'رویا قاسم‌پور',
    author: 'رویا قاسم‌پور',
    rating: 4,
    date: '۱۴۰۵/۰۷/۰۶',
    created_at: '2026-09-27T10:05:00Z',
    comment:
      'کشسانی خوبی داره و فیت جذب و راحتی داره. سایزبندی کاملاً درسته.',
    fitFeedback: 'true_to_size',
    fit_feedback: 'true_to_size',
    isVerifiedBuyer: true,
    verified_purchase: true,
    size_purchased: 'S',
    status: 'pending',
  },
];

export function getProductReviewsResponse(slug: string): ProductReviewsResponse {
  // فقط نظرات تاییدشده (approved) برای عموم نمایش داده می‌شوند
  const reviews = mockReviews.filter(
    (r) => r.productSlug === slug && r.status === 'approved',
  );

  const ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const fitBreakdown = {
    small: 0,
    true_to_size: 0,
    large: 0,
  };

  let totalRatingSum = 0;

  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
    totalRatingSum += r.rating;

    const fit = r.fitFeedback || r.fit_feedback;
    if (fit === 'small' || fit === 'runs_small') fitBreakdown.small++;
    else if (fit === 'large' || fit === 'runs_large') fitBreakdown.large++;
    else fitBreakdown.true_to_size++;
  }

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? Number((totalRatingSum / totalReviews).toFixed(1)) : 5.0;

  return {
    summary: {
      average_rating: averageRating,
      total_reviews: totalReviews,
      rating_distribution: ratingDistribution,
      fit_breakdown: fitBreakdown,
    },
    reviews,
  };
}
