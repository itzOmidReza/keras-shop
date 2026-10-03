export interface LookbookItem {
  id: number
  collection: 'calm' | 'move' | 'city'
  collectionTitle: string
  title: string
  subtitle: string
  location: string
  credits: {
    photographer: string
    stylist: string
  }
  image: string
  aspectRatio: string
  description: string
  featuredProduct: {
    title: string
    slug: string
    price: number
    badge: string
  }
}

export type JournalCollectionFilter = 'all' | 'calm' | 'move' | 'city'

export const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 1,
    collection: 'calm',
    collectionTitle: 'کالکشن آرامش پاییز',
    title: 'هارمونی کشسانی و سکوت',
    subtitle: 'آرامش در کشش‌های عمیق صبحگاهی',
    location: 'استودیو نور طبیعی نیاوران',
    credits: {
      photographer: 'سپهر رادمنش',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'تلفیقی از الیاف میکرو مدال تنفس‌پذیر با کمر بلند گنی، طراحی‌شده برای حرکات پیوسته یوگا و ریکاوری بدون احساس تنگی.',
    featuredProduct: {
      title: 'لگ سیم‌لس آرامش',
      slug: 'calm-seamless-leggings-black',
      price: 1450000,
      badge: 'لاین آرامش',
    },
  },
  {
    id: 2,
    collection: 'move',
    collectionTitle: 'پرفورمنس حرکت',
    title: 'انرژی انفجاری در گرگ‌ومیش',
    subtitle: 'آزمون ۳۰۰٪ کشسانی در تمرینات شدید اینتروال',
    location: 'مرکز پرفورمنس اکسیژن',
    credits: {
      photographer: 'آرش علوی',
      stylist: 'سارا کیانی',
    },
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'فشرده‌سازی عضلانی هدفمند با پارچه ۳۰۰ گرمی کاملاً اسکات‌پروف، متمرکز بر ثبات مفاصل در تمرینات جهشی و کراس‌فیت.',
    featuredProduct: {
      title: 'لگ ورزشی موو پرو مشکی',
      slug: 'move-performance-leggings-graphite',
      price: 1680000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 3,
    collection: 'calm',
    collectionTitle: 'کالکشن آرامش پاییز',
    title: 'سایه روشن بافت و لطافت',
    subtitle: 'پوشش دومین پوست بدون خط دوخت آزاردهنده',
    location: 'تراس مینیمال بام ولنجک',
    credits: {
      photographer: 'سپهر رادمنش',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'ایستایی طبیعی و تنفس مداوم الیاف در هوای خنک پاییزی. بدون رنگ‌رفتگی یا پرزدهی حتی پس از شست‌وشوهای مکرر.',
    featuredProduct: {
      title: 'نیم‌تنه ورزشی کامفورت',
      slug: 'calm-comfort-sports-bra-mocha',
      price: 980000,
      badge: 'لاین آرامش',
    },
  },
  {
    id: 4,
    collection: 'city',
    collectionTitle: 'استایل روزمره شهری',
    title: 'گذر از استودیو به خیابان',
    subtitle: 'طراحی کاربردی و لوکس برای زندگی پویا',
    location: 'خیابان ولیعصر، تهران',
    credits: {
      photographer: 'کیوان رحیمی',
      stylist: 'مریم سهرابی',
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'ترکیب کت‌های سبک با ست‌های اسپرت کراس؛ نمایانگر زیبایی‌شناسی مدرن که مرز میان ورزش و مد روزمره را محو می‌سازد.',
    featuredProduct: {
      title: 'تاپ تنفس‌پذیر مسابقه‌ای',
      slug: 'move-aero-tank-rose',
      price: 890000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 5,
    collection: 'move',
    collectionTitle: 'پرفورمنس حرکت',
    title: 'تمرکز مطلق در هر تکرار',
    subtitle: 'تکنولوژی مدیریت رطوبت و تعریق',
    location: 'باشگاه تمرینات قدرتی انقلاب',
    credits: {
      photographer: 'آرش علوی',
      stylist: 'سارا کیانی',
    },
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'خشک‌شوندگی سریع و ضدباکتری طبیعی، طراحی‌شده برای ورزشکارانی که تعهد به تمرین و دقت در ظاهر را هم‌زمان دنبال می‌کنند.',
    featuredProduct: {
      title: 'شلوارک دو لایه فشرده‌ساز',
      slug: 'move-compression-shorts-sage',
      price: 1120000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 6,
    collection: 'city',
    collectionTitle: 'استایل روزمره شهری',
    title: 'توازن رنگی پالت ارگانیک',
    subtitle: 'رنگ‌های برآمده از طبیعت ایران',
    location: 'گالری هنر معاصر فرشته',
    credits: {
      photographer: 'کیوان رحیمی',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1552196563-5527e3abbd73?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'پالت رنگی خاک رس، سبز مریم‌گلی و مشکی موکا، بازتاب اصالت و سادگی در پوشش مدرن بانوان و آقایان ورزشکار.',
    featuredProduct: {
      title: 'لگ سیم‌لس آرامش',
      slug: 'calm-seamless-leggings-black',
      price: 1450000,
      badge: 'لاین آرامش',
    },
  },
]

export function useJournalLookbook() {
  const activeCollection = ref<JournalCollectionFilter>('all')
  const selectedFrame = ref<LookbookItem | null>(null)

  const filteredItems = computed(() => {
    if (activeCollection.value === 'all') return LOOKBOOK_ITEMS
    return LOOKBOOK_ITEMS.filter(item => item.collection === activeCollection.value)
  })

  const selectFrame = (frame: LookbookItem) => {
    selectedFrame.value = frame
  }

  const closeFrameModal = () => {
    selectedFrame.value = null
  }

  return {
    activeCollection,
    selectedFrame,
    filteredItems,
    selectFrame,
    closeFrameModal,
  }
}
