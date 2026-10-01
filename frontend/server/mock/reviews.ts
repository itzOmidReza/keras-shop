// server/mock/reviews.ts
import type { Review, ProductReviewsResponse } from '~/types/domain';

export const mockProductReviews: Record<string, Review[]> = {
  'calm-seamless-leggings-black': [
    {
      id: 1,
      author: 'سارا ملکی',
      rating: 5,
      created_at: '2026-02-14T10:30:00Z',
      comment:
        'واقعاً تست عدم عبور نور (اسکات‌پروف) رو پاس کرد! حین تمرینات کششی یوگا اصلاً بدن‌نما نیست و کمرش به هیچ وجه لول نمیشه. بافتش بی‌نهایت نرمه و اصطکاک پوستی نداره.',
      verified_purchase: true,
      size_purchased: 'M',
      fit_feedback: 'true_to_size',
    },
    {
      id: 2,
      author: 'نگار رادمهر',
      rating: 5,
      created_at: '2026-02-20T16:45:00Z',
      comment:
        'بهترین لگی که تا الان داشتم. فاق الماسی‌ش آزادی حرکت فوق‌العاده‌ای میده. قد کار برای من که ۱۶۸ هستم کاملاً استاندارد تا قوزک پا بود.',
      verified_purchase: true,
      size_purchased: 'S',
      fit_feedback: 'true_to_size',
    },
    {
      id: 3,
      author: 'مهسا کاظمی',
      rating: 4,
      created_at: '2026-03-02T11:20:00Z',
      comment:
        'کیفیت دوخت فلت‌لاک و کشسانی ۴ جهته عالیه. فیت کار کاملاً جذبه؛ اگه احساس راحتی بیشتر در روزمره می‌خواین شاید یک سایز بزرگ‌تر بهتر باشه.',
      verified_purchase: true,
      size_purchased: 'S',
      fit_feedback: 'small',
    },
    {
      id: 4,
      author: 'الهام توکلی',
      rating: 5,
      created_at: '2026-03-15T09:10:00Z',
      comment:
        'رنگ مشکی موکا بسیار شیک و خاصه و بعد از ۴ بار شست‌وشو اصلاً پرز نداد و تغییر فرم پیدا نکرد. ارزش خرید بالایی داره.',
      verified_purchase: true,
      size_purchased: 'L',
      fit_feedback: 'true_to_size',
    },
  ],
  'move-high-support-bra-coral': [
    {
      id: 5,
      author: 'پریسا ابراهیمی',
      rating: 5,
      created_at: '2026-01-28T14:15:00Z',
      comment:
        'برای دویدن و جلسات اسپینینگ ساپورت عالی داره و سینه رو کاملاً فیکس نگه می‌داره بدون اینکه حس خفگی یا فشار روی دنده‌ها بیاره.',
      verified_purchase: true,
      size_purchased: 'M',
      fit_feedback: 'true_to_size',
    },
    {
      id: 6,
      author: 'دریا کیانی',
      rating: 4,
      created_at: '2026-02-18T18:00:00Z',
      comment:
        'پدهای قابل تعویض کیفیت خوبی دارند و پارچه خیلی سریع عرق رو تبخیر می‌کنه. کاپ کار کمی فیت‌تر از برهای دیگه‌ست.',
      verified_purchase: true,
      size_purchased: 'M',
      fit_feedback: 'small',
    },
    {
      id: 7,
      author: 'سمیرا نادری',
      rating: 5,
      created_at: '2026-03-08T12:30:00Z',
      comment:
        'رنگ رز کراس فوق‌العاده‌ست! با شورت بایکری مچ کردم و ست خیلی تمیزی شد.',
      verified_purchase: true,
      size_purchased: 'S',
      fit_feedback: 'true_to_size',
    },
  ],
  'calm-ribbed-crop-top': [
    {
      id: 8,
      author: 'مونا صدری',
      rating: 5,
      created_at: '2026-02-11T13:40:00Z',
      comment:
        'الیاف بامبو واقعاً حس خنکی و ابریشمی عجیبی روی پوست داره. هم برای پیلاتس و هم به عنوان لباس پایه زیر کت عالیه.',
      verified_purchase: true,
      size_purchased: 'S',
      fit_feedback: 'true_to_size',
    },
    {
      id: 9,
      author: 'آناهیتا فرهمند',
      rating: 5,
      created_at: '2026-02-25T15:20:00Z',
      comment:
        'بافت کبریتی بسیار ظریف و لطیف. کشسانی خیلی نرمی داره و اصلاً رد کش روی پوست نمیمونه.',
      verified_purchase: true,
      size_purchased: 'M',
      fit_feedback: 'true_to_size',
    },
  ],
  'move-biker-shorts-sage': [
    {
      id: 10,
      author: 'طناز فلاح',
      rating: 5,
      created_at: '2026-03-01T17:10:00Z',
      comment:
        'جیب‌های بغل برای گوشی اندازه کامله و موقع دویدن تکون نمیخوره. لبه پایینی اصلاً لول نمیشه و بالا نمیره.',
      verified_purchase: true,
      size_purchased: 'M',
      fit_feedback: 'true_to_size',
    },
    {
      id: 11,
      author: 'شیرین پارسا',
      rating: 4,
      created_at: '2026-03-12T10:05:00Z',
      comment:
        'پارچه مات و محکم با نگه‌دارندگی مطلوب برای عضلات ران. رنگ مریم‌گلی در واقعیت هم خیلی مینیمال و قشنگه.',
      verified_purchase: true,
      size_purchased: 'L',
      fit_feedback: 'true_to_size',
    },
  ],
};

export function getProductReviewsResponse(slug: string): ProductReviewsResponse {
  const reviews = mockProductReviews[slug] || [];

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

    if (r.fit_feedback === 'small') fitBreakdown.small++;
    else if (r.fit_feedback === 'large') fitBreakdown.large++;
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
