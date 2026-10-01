// frontend/app/utils/fit-calculator.ts
import type {
  FitPreference,
  FitRecommendation,
  SizeMeasurement,
} from '~/types/domain';

/**
 * جدول ابعاد استاندارد پوشاک زنانه کراس بر حسب سانتی‌متر (CM)
 * تمامی ابعاد کاملاً متریک و دقیق هستند.
 */
export const STANDARD_MEASUREMENTS: SizeMeasurement[] = [
  { size: 'XS', waist: 62, hips: 88, bust: 82, inseam: 68 },
  { size: 'S', waist: 68, hips: 94, bust: 87, inseam: 69 },
  { size: 'M', waist: 74, hips: 100, bust: 93, inseam: 70 },
  { size: 'L', waist: 81, hips: 106, bust: 99, inseam: 71 },
  { size: 'XL', waist: 88, hips: 114, bust: 105, inseam: 71 },
];

/**
 * محدوده مقادیر مجاز ورودی متریک
 */
export const METRIC_LIMITS = {
  height: { min: 150, max: 195, default: 168, step: 1 },
  weight: { min: 45, max: 110, default: 62, step: 1 },
} as const;

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

/**
 * محاسبه سایز هوشمند بر اساس قد، وزن، ترجیح تنخور و لاین محصول
 * ورودی‌ها کاملاً متریک: قد به سانتی‌متر (CM) و وزن به کیلوگرم (KG)
 */
export function calculateRecommendedSize(
  heightCm: number,
  weightKg: number,
  preference: FitPreference = 'regular',
  collection: 'move' | 'calm' = 'move',
): FitRecommendation {
  // ۱. اعتبارسنجی و کراپ مقادیر در محدوده مجاز متریک
  const height = Math.max(
    METRIC_LIMITS.height.min,
    Math.min(METRIC_LIMITS.height.max, heightCm),
  );
  const weight = Math.max(
    METRIC_LIMITS.weight.min,
    Math.min(METRIC_LIMITS.weight.max, weightKg),
  );

  // ۲. محاسبه شاخص توده بدنی (BMI) بر اساس متر و کیلوگرم
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  // ۳. تخمین سایز پایه بر اساس ترکیب وزن، قد و BMI
  let baseIndex: number;

  if (weight < 53 && bmi < 20.0) {
    baseIndex = 0; // XS
  } else if (weight <= 61 && bmi < 22.8) {
    baseIndex = 1; // S
  } else if (weight <= 71 && bmi < 25.8) {
    baseIndex = 2; // M
  } else if (weight <= 83 && bmi < 29.5) {
    baseIndex = 3; // L
  } else {
    baseIndex = 4; // XL
  }

  // اصلاح شاخص برای افراد با قد بالای ۱۷۸ سانتی‌متر جهت جلوگیری از کوتاهی فاق
  if (height >= 178 && baseIndex < 4 && weight > 57) {
    baseIndex = Math.min(4, baseIndex + 1);
  }

  // ۴. اعمال اثر فیزیک پارچه کالکشن و اولویت تنخور کاربر
  let finalIndex = baseIndex;

  if (collection === 'move') {
    // لاین Move: تراکم بالا، خاصیت Squat-Proof و فشردگی متمرکز
    if (preference === 'relaxed') {
      finalIndex = Math.min(4, baseIndex + 1);
    } else if (preference === 'snug') {
      // فرم‌دهی بیشینه در همان سایز متناسب
      finalIndex = baseIndex;
    }
  } else {
    // لاین Calm: الیاف کره‌ای بسیار نرم (Modal / 4-way stretch)، بدون فشار
    if (preference === 'snug' && baseIndex > 0) {
      // به دلیل کشسانی بالا، انتخاب یک سایز کوچک‌تر حس دومین پوست را ایجاد می‌کند
      if (bmi < 24.5) {
        finalIndex = Math.max(0, baseIndex - 1);
      }
    } else if (preference === 'relaxed') {
      finalIndex = Math.min(4, baseIndex + 1);
    }
  }

  const recommendedSize = SIZES[finalIndex]!;

  // ۵. تعیین میزان اطمینان (Confidence)
  let confidence = 94;
  if (preference === 'regular') confidence = 97;
  if (height < 155 || height > 188) confidence -= 5;

  // ۶. تولید یادداشت فیت اختصاصی به فارسی بر مبنای دیزاین سیستم کراس
  let fitNote: string;

  if (collection === 'move') {
    if (preference === 'snug') {
      fitNote = `لاین Move با الاستین متراکم، بیشترین نگه‌دارندگی عضلانی را دارد. سایز ${recommendedSize} فرم‌دهی دقیق و فیت بدون لغزش در تمرینات پرفشار برای شما رقم می‌زند.`;
    } else if (preference === 'relaxed') {
      fitNote = `به دلیل خاصیت فشردگی بالای بافت لاین Move، سایز ${recommendedSize} تنخوری راحت‌تر با حفظ ایستایی بدون احساس تنگی موضعی فراهم می‌سازد.`;
    } else {
      fitNote = `سایز ${recommendedSize} تعادل مهندسی‌شده‌ای میان نگه‌دارندگی لاین Move و آزادی عمل در حرکات کششی ایجاد می‌کند.`;
    }
  } else {
    if (preference === 'snug') {
      fitNote = `بافت کره‌ای و کشسان ۴طرفه لاین Calm این امکان را می‌دهد تا سایز ${recommendedSize} مانند پوست دوم بدون ایجاد خط برش روی بدن بنشیند.`;
    } else if (preference === 'relaxed') {
      fitNote = `سایز ${recommendedSize} در لاین Calm راحتی بی‌وزن، پوشش ملایم و حس سبکی ایده‌آلی برای استایل روزمره و یوگا به ارمغان می‌آورد.`;
    } else {
      fitNote = `سایز استاندارد ${recommendedSize} جریان لطافت طبیعی الیاف Calm را بدون فشار به خطوط طبیعی بدن به نمایش می‌گذارد.`;
    }
  }

  return {
    recommendedSize,
    confidence,
    fitNote,
  };
}
