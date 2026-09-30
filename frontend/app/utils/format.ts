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

/**
 * فرمت قیمت به تومان
 * ورودی مستقیماً به تومان است
 */
export const formatToman = (toman: number) =>
  `${new Intl.NumberFormat('fa-IR').format(Math.round(toman))} تومان`;

/** تبدیل تاریخ میلادی/ISO به تقویم شمسی */
export const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'medium',
  }).format(date);
};

/** اعتبارسنجی فرمت شماره موبایل ایران */
export const isIranMobile = (v: string) => /^09\d{9}$/.test(toEn(v).trim());
