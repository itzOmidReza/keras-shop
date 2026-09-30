const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

export const toFa = (v: string | number) =>
  String(v).replace(/\d/g, (d) => FA[+d]!);

export const toEn = (v: string) =>
  v
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));

// قیمت‌ها ریال‌اند؛ نمایش تومان. هیچ‌جا مستقیم /10 ننویس.
export const rialToToman = (rial: number) => Math.round(rial / 10);
export const formatToman = (rial: number) =>
  `${new Intl.NumberFormat('fa-IR').format(rialToToman(rial))} تومان`;

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'medium' }).format(
    new Date(iso),
  );

export const isIranMobile = (v: string) => /^09\d{9}$/.test(toEn(v));
