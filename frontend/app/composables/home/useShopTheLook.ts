import { toast } from 'vue-sonner'

export interface LookItem {
  id: number
  slug: string
  title: string
  price: number
  compareAtPrice?: number
  image: string
  hotspot: { top: number; right: number }
  sizes: string[]
}

export interface OutfitLook {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  items: LookItem[]
}

export const OUTFIT_LOOKS: OutfitLook[] = [
  {
    id: 'look-autumn',
    title: 'استایل ادیتوریال پاییزه',
    subtitle: 'کالکشن جدید — پاییز ۱۴۰۵',
    description: 'ترکیب شومیز لینن اسلپ مدل کارن، شلوار واید لینن پاییزه و دستمال سر ژاکارد؛ هارمونی چشم‌نواز تنالیته شنی و خاکی برای استایل روزمره ادیتوریال.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 1,
        slug: 'karen-slub-linen-blouse',
        title: 'شومیز لینن اسلپ مدل کارن',
        price: 1850000,
        compareAtPrice: 2200000,
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 38, right: 48 },
        sizes: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 12,
        slug: 'autumn-wide-leg-linen-pants',
        title: 'شلوار واید لینن پاییزه',
        price: 1950000,
        compareAtPrice: 2350000,
        image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 72, right: 48 },
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 20,
        slug: 'cotton-jacquard-bandana',
        title: 'دستمال سر ژاکارد نخ پنبه',
        price: 390000,
        compareAtPrice: 480000,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 16, right: 50 },
        sizes: ['Free'],
      },
    ],
  },
  {
    id: 'look-winter',
    title: 'استایل لایه‌لایه گرم زمستانه',
    subtitle: 'کالکشن زمستان ۱۴۰۵',
    description: 'هارمونی شیک پالتو فوتر پشمی آستردار با پلیور بافت کرکی یقه اسکی و شال پشمی ضخیم؛ گرما، راحتی و وقار مینیمال در روزهای خنک.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 9,
        slug: 'long-lined-wool-fouter-coat',
        title: 'پالتو فوتر پشمی بلند آستردار',
        price: 4850000,
        compareAtPrice: 5600000,
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 40, right: 50 },
        sizes: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 5,
        slug: 'fluffy-turtleneck-knit-sweater',
        title: 'پلیور بافت کرکی یقه اسکی',
        price: 2450000,
        compareAtPrice: 2850000,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 60, right: 48 },
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 24,
        slug: 'thick-knit-wool-long-scarf',
        title: 'شال بلند پشمی بافت ضخیم',
        price: 1250000,
        compareAtPrice: 1550000,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 22, right: 52 },
        sizes: ['Free'],
      },
    ],
  },
  {
    id: 'look-accessories',
    title: 'ست اکسسوری و شال مکمل',
    subtitle: 'اکسسوری‌های دست‌ساز کراس',
    description: 'هماهنگی شال بلند پشمی بافت ضخیم، اسکرانچی ابریشم طبیعی و دستمال سر ژاکارد برای تکمیل استایل‌های پاییزی و روزمره.',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
    items: [
      {
        id: 17,
        slug: 'natural-silk-autumn-scrunchie',
        title: 'اسکرانچی ابریشم طبیعی پالت پاییزه',
        price: 280000,
        compareAtPrice: 350000,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 20, right: 52 },
        sizes: ['Free'],
      },
      {
        id: 24,
        slug: 'thick-knit-wool-long-scarf',
        title: 'شال بلند پشمی بافت ضخیم',
        price: 1250000,
        compareAtPrice: 1550000,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 46, right: 48 },
        sizes: ['Free'],
      },
      {
        id: 20,
        slug: 'cotton-jacquard-bandana',
        title: 'دستمال سر ژاکارد نخ پنبه',
        price: 390000,
        compareAtPrice: 480000,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
        hotspot: { top: 72, right: 50 },
        sizes: ['Free'],
      },
    ],
  },
]

export function useShopTheLook() {
  const cartStore = useCartStore()

  const selectedSizes = reactive<Record<number, string>>({
    1: 'M',
    5: 'M',
    9: 'M',
    12: 'M',
    17: 'Free',
    20: 'Free',
    24: 'Free',
  })

  const activeHotspotId = ref<number | null>(null)

  const toggleHotspot = (itemId: number) => {
    if (activeHotspotId.value === itemId) {
      activeHotspotId.value = null
    } else {
      activeHotspotId.value = itemId
    }
  }

  const getRegularTotal = (look: OutfitLook): number => {
    return look.items.reduce((sum, item) => sum + item.price, 0)
  }

  const getBundleTotal = (look: OutfitLook): number => {
    return Math.round(getRegularTotal(look) * 0.9)
  }

  const addEntireOutfitToCart = (look: OutfitLook) => {
    for (const item of look.items) {
      const size = selectedSizes[item.id] || item.sizes[0] || 'Free'
      const bundleDiscountedPrice = Math.round(item.price * 0.9)

      cartStore.addItem(
        {
          productId: item.id,
          title: item.title,
          slug: item.slug,
          size,
          price: bundleDiscountedPrice,
          compareAtPrice: item.price,
          maxStock: 10,
          image: item.image,
          color: 'رنگ ست ادیتوریال',
        },
        1,
      )
    }

    toast.success(
      `ست کامل «${look.title}» با ۱۰٪ تخفیف باندل به سبد خرید شما افزوده شد!`,
    )
  }

  return {
    looks: OUTFIT_LOOKS,
    selectedSizes,
    activeHotspotId,
    toggleHotspot,
    getRegularTotal,
    getBundleTotal,
    addEntireOutfitToCart,
  }
}
