// frontend/app/data/navigation.ts
export const headerNav = [
  { label: 'کالکشن جدید (پاییز ۱۴۰۵)', href: '/shop?season=fall-1405' },
  { label: 'پوشاک', href: '/shop?division=apparel' },
  { label: 'اکسسوری', href: '/shop?division=accessories' },
  { label: 'حراج فصل', href: '/shop?badge=sale' },
  { label: 'راهنمای سایز', href: '/size-guide' },
  { label: 'ژورنال و مقالات', href: '/journal' },
] as const

export const mobileNavItems = [
  { label: 'کالکشن جدید (پاییز ۱۴۰۵)', href: '/shop?season=fall-1405', badge: 'جدید' },
  { label: 'پوشاک', href: '/shop?division=apparel', badge: null },
  { label: 'اکسسوری', href: '/shop?division=accessories', badge: null },
  { label: 'حراج فصل', href: '/shop?badge=sale', badge: 'تخفیف' },
  { label: 'همه محصولات کاتالوگ', href: '/shop', badge: null },
  { label: 'راهنمای اندازه‌گیری و سایز', href: '/size-guide', badge: null },
  { label: 'ژورنال ادیتوریال کراس', href: '/journal', badge: null },
] as const

export const footerSections = {
  shop: {
    title: 'دسته‌بندی و کالکشن‌ها',
    links: [
      { label: 'تمام محصولات', href: '/shop' },
      { label: 'کالکشن پاییز ۱۴۰۵ (جدید)', href: '/shop?season=fall-1405' },
      { label: 'پوشاک چهارفصل', href: '/shop?division=apparel' },
      { label: 'شومیز و پیراهن', href: '/shop?category=shirts-blouses' },
      { label: 'بافت و پلیور', href: '/shop?category=knitwear' },
      { label: 'پالتو و بارانی', href: '/shop?category=coats-jackets' },
      { label: 'اکسسوری و اسکارف', href: '/shop?division=accessories' },
      { label: 'حراج فصل', href: '/shop?badge=sale' },
    ],
  },
  services: {
    title: 'خدمات و پشتیبانی',
    links: [
      { label: 'راهنمای اندازه‌گیری سایز', href: '/size-guide' },
      { label: 'پیگیری سفارش‌ها', href: '/tracking' },
      { label: 'رویه بازگشت و تعویض ۷ روزه', href: '/returns' },
      { label: 'پرسش‌های متداول', href: '/faq' },
      { label: 'تماس با ما', href: '/contact' },
    ],
  },
  brand: {
    title: 'برند کراس',
    links: [
      { label: 'داستان کراس', href: '/about' },
      { label: 'تست شفافیت و کیفیت الیاف', href: '/fabric-standards' },
      { label: 'ژورنال و مقالات استایل', href: '/journal' },
      { label: 'فرصت‌های شغلی', href: '/careers' },
    ],
  },
} as const
