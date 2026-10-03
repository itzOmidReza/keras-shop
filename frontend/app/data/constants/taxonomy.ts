// frontend/app/data/constants/taxonomy.ts
import type {
  ProductDivision,
  ProductCategory,
  ProductSeason,
} from '~/types/domain'

export interface DivisionMeta {
  id: ProductDivision
  label: string
  enLabel: string
  description: string
}

export interface CategoryMeta {
  slug: ProductCategory
  label: string
  enLabel: string
  division: ProductDivision
  description: string
}

export interface SeasonMeta {
  id: ProductSeason
  label: string
  shortLabel: string
  badge: string
  isActiveHeroDrop: boolean
  description: string
}

export const productDivisions: Record<ProductDivision, DivisionMeta> = {
  apparel: {
    id: 'apparel',
    label: 'پوشاک',
    enLabel: 'Apparel',
    description: 'کالکشن تخصصی پوشاک ادیتوریال چهارفصل کراس',
  },
  accessories: {
    id: 'accessories',
    label: 'اکسسوری',
    enLabel: 'Accessories',
    description: 'اکسسوری‌های دست‌ساز و استایل مکمل استودیو و روزمره',
  },
} as const

export const productCategories: Record<ProductCategory, CategoryMeta> = {
  // ۱. پوشاک (Apparel)
  'shirts-blouses': {
    slug: 'shirts-blouses',
    label: 'پیراهن / شومیز',
    enLabel: 'Shirts & Blouses',
    division: 'apparel',
    description: 'شومیزهای لینن، کرپ و پیراهن‌های اورسایز مینیمال',
  },
  knitwear: {
    slug: 'knitwear',
    label: 'بافت / پلیور',
    enLabel: 'Knitwear & Sweaters',
    division: 'apparel',
    description: 'پلیورهای پشمی، ژاکارد بوکله و بافت‌های کشمیر',
  },
  'coats-jackets': {
    slug: 'coats-jackets',
    label: 'پالتو و کاپشن',
    enLabel: 'Coats & Jackets',
    division: 'apparel',
    description: 'پالتوهای فوتر، ترنچ کت‌های بارانی و کاپشن‌های بادگیر',
  },
  pants: {
    slug: 'pants',
    label: 'شلوار',
    enLabel: 'Pants & Trousers',
    division: 'apparel',
    description: 'شلوارهای واید لینن، فاستونی پشمی و جاگرهای سنگشور',
  },
  tops: {
    slug: 'tops',
    label: 'تیشرت و تاپ',
    enLabel: 'Tops & T-Shirts',
    division: 'apparel',
    description: 'تیشرت‌های پنبه سوپر شانه و بادی‌های کبریتی',
  },

  // ۲. اکسسوری (Accessories)
  'hair-accessories': {
    slug: 'hair-accessories',
    label: 'اکسسوری مو',
    enLabel: 'Hair Accessories',
    division: 'accessories',
    description: 'اسکرانچی ابریشم طبیعی، گیره‌های ارگانیک سلولز و کش موی پشمی',
  },
  bandanas: {
    slug: 'bandanas',
    label: 'دستمال سر',
    enLabel: 'Bandanas',
    division: 'accessories',
    description: 'باندانا و دستمال سرهای ژاکارد نخ پنبه و ساتن ژئومتریک',
  },
  scarves: {
    slug: 'scarves',
    label: 'اسکارف و شال',
    enLabel: 'Scarves & Shawls',
    division: 'accessories',
    description: 'اسکارف‌های مینی ابریشمی دست‌دوز و شال‌های بافت پشمی',
  },
} as const

export const productSeasons: Record<ProductSeason, SeasonMeta> = {
  'fall-1405': {
    id: 'fall-1405',
    label: 'کالکشن جدید — پاییز ۱۴۰۵',
    shortLabel: 'پاییز ۱۴۰۵ (جدید)',
    badge: 'جدید',
    isActiveHeroDrop: true,
    description: 'دراپ فعال هیرو: بافت‌های میانی پاییزی و رنگ‌های گرم پالت کراس',
  },
  'winter-1405': {
    id: 'winter-1405',
    label: 'کالکشن زمستان ۱۴۰۵',
    shortLabel: 'زمستان ۱۴۰۵',
    badge: 'زمستان',
    isActiveHeroDrop: false,
    description: 'پالتوهای گرم فوتر، بافت‌های چندلایه و اکسسوری‌های عایق',
  },
  'spring-1406': {
    id: 'spring-1406',
    label: 'پیش‌نمایش بهار ۱۴۰۶',
    shortLabel: 'بهار ۱۴۰۶',
    badge: 'پیش‌نمایش',
    isActiveHeroDrop: false,
    description: 'پیش‌نمایش سیلوئت‌های سبک، رنگ‌های نچرال و پارچه‌های تنفس‌پذیر',
  },
  'summer-1405': {
    id: 'summer-1405',
    label: 'آرشیو تابستان ۱۴۰۵',
    shortLabel: 'تابستان ۱۴۰۵',
    badge: 'آرشیو',
    isActiveHeroDrop: false,
    description: 'کالکشن تابستانه با الیاف سبک پنبه و کتان شسته',
  },
} as const

export const getCategoryLabel = (cat: ProductCategory | string): string => {
  return productCategories[cat as ProductCategory]?.label || cat
}

export const getSeasonLabel = (season: ProductSeason | string): string => {
  return productSeasons[season as ProductSeason]?.shortLabel || season
}

export const getDivisionLabel = (division: ProductDivision | string): string => {
  return productDivisions[division as ProductDivision]?.label || division
}
