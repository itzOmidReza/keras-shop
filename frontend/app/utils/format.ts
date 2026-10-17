// frontend/app/utils/format.ts
const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

/** تبدیل ارقام انگلیسی به فارسی */
export const toFa = (v: string | number) =>
  String(v).replace(/\d/g, (d) => FA[+d]!);

/** تبدیل ارقام فارسی و عربی به انگلیسی قبل از ارسال به API یا اعتبارسنجی */
export const toEn = (v: string) =>
  v
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));

/** فرمت عدد با جداکننده ارقام فارسی */
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === '') return '۰';
  const val = typeof num === 'string' ? parseFloat(toEn(num)) : num;
  if (isNaN(val)) return '۰';
  return new Intl.NumberFormat('fa-IR').format(Math.round(val));
};

/**
 * فرمت قیمت به تومان
 * به صورت پیش‌فرض کلمه «تومان» اضافه می‌شود.
 * در صورت includeUnit = false تنها رقم فرمت‌شده بدون پسوند برگردانده می‌شود.
 */
export const formatToman = (toman: number | string | null | undefined, includeUnit = true): string => {
  const formatted = formatNumber(toman);
  return includeUnit ? `${formatted} تومان` : formatted;
};

/** تبدیل تاریخ میلادی/ISO به تقویم شمسی */
export const formatDate = (iso: string | Date | null | undefined): string => {
  if (!iso) return '';
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'medium',
  }).format(date);
};

/** تبدیل تاریخ و زمان میلادی/ISO به تقویم شمسی با ساعت */
export const formatDateTime = (iso: string | Date | null | undefined): string => {
  if (!iso) return '';
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

/** اعتبارسنجی فرمت شماره موبایل ایران */
export const isIranMobile = (v: string) => /^09\d{9}$/.test(toEn(v).trim());
