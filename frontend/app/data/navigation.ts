export const headerNav = [
  { label: "فروشگاه", href: "/shop" },
  { label: "لاین آرامش (Calm)", href: "/products?line=calm" },
  { label: "لاین حرکت (Move)", href: "/products?line=move" },
  { label: "راهنمای سایز", href: "/size-guide" },
  { label: "مجله کراس", href: "/blog" },
] as const

export const mobileNavItems = [
  { label: "همه محصولات (فروشگاه)", href: "/shop", badge: null },
  { label: "لاین آرامش (Calm)", href: "/products?line=calm", badge: "راحتی" },
  { label: "لاین حرکت (Move)", href: "/products?line=move", badge: "عملکردی" },
  { label: "راهنمای اندازه‌گیری و سایز", href: "/size-guide", badge: null },
  { label: "مجله و بلاگ تخصصی کراس", href: "/blog", badge: null },
] as const

export const footerSections = {
  shop: {
    title: "دسته‌بندی کالاها",
    links: [
      { label: "تمام محصولات", href: "/shop" },
      { label: "لگ‌های ورزشی", href: "/products?category=leggings" },
      { label: "نیم‌تنه و تاپ", href: "/products?category=tops" },
      { label: "لاین آرامش (Calm)", href: "/products?line=calm" },
      { label: "لاین حرکت (Move)", href: "/products?line=move" },
    ],
  },
  services: {
    title: "خدمات و پشتیبانی",
    links: [
      { label: "راهنمای اندازه‌گیری سایز", href: "/size-guide" },
      { label: "پیگیری سفارش‌ها", href: "/tracking" },
      { label: "رویه بازگشت و تعویض ۷ روزه", href: "/returns" },
      { label: "پرسش‌های متداول", href: "/faq" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
  brand: {
    title: "برند کراس",
    links: [
      { label: "داستان کراس", href: "/about" },
      { label: "تست شفافیت و کیفیت الیاف", href: "/fabric-standards" },
      { label: "مجله استایل و تمرین", href: "/blog" },
      { label: "فرصت‌های شغلی", href: "/careers" },
    ],
  },
} as const
