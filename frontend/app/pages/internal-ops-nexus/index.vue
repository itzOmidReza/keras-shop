<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Percent,
  Truck,
  Copy,
  Plus,
  Search,
  Package,
  Printer,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
} from '@lucide/vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { useAuthStore } from '~/stores/auth'
import { formatToman } from '~/utils/format'
import { mockOrders } from '../../../server/mock/orders'
import { mockProducts } from '../../../server/mock/products'
import type {
  TrackOrderResponse,
  ProductDetail,
  ProductDivision,
  ProductCategory,
  ProductSeason,
} from '~/types/domain'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

const authStore = useAuthStore()

// اعتبارسنجی امنیتی سخت‌گیرانه سمت کامپوننت برای پرتاب ۴۰۴
if (!authStore.isAuthenticated || authStore.user?.role !== 'super_admin') {
  throw createError({
    statusCode: 404,
    statusMessage: 'صفحه مورد نظر یافت نشد',
    fatal: true,
  })
}

useSeoMeta({
  title: 'مرکز فرماندهی آتلیه کراس | HQ Nexus',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()

const currentView = computed(() => {
  const v = route.query.view as string
  if (['analytics', 'products', 'fulfillment', 'inventory', 'orders', 'finance', 'articles', 'vouchers', 'crm'].includes(v)) {
    return v === 'orders' ? 'fulfillment' : v
  }
  return 'analytics'
})

const switchView = (view: string) => {
  router.push({ path: '/internal-ops-nexus', query: { view } })
}

// -------------------------------------------------------------
// ۱. دیده‌بان مالی و تحلیلی (Executive Analytics)
// -------------------------------------------------------------
const kpis = [
  {
    title: 'فروش ناخالص دوره (Gross Revenue)',
    amount: 42850000,
    unit: 'تومان',
    growth: '+۱۸.۴٪',
    growthPositive: true,
    subtitle: 'نسبت به دوره مالی پاییز گذشته',
    icon: TrendingUp,
  },
  {
    title: 'حاشیه سود خالص تخمینی',
    amount: 19282500,
    unit: 'تومان',
    growth: '+۱۴.۲٪',
    growthPositive: true,
    subtitle: 'پس از کسر بهای تمام‌شده و مالیات',
    icon: Percent,
  },
  {
    title: 'میانگین ارزش هر سبد (AOV)',
    amount: 2142500,
    unit: 'تومان',
    growth: '+۶.۸٪',
    growthPositive: true,
    subtitle: 'متوسط خرید در سفارش‌های ثبت‌شده',
    icon: ShoppingCart,
  },
  {
    title: 'نرخ سبدهای رهاشده',
    amount: null,
    percentage: '۲۸.۶٪',
    growth: '-۴.۱٪',
    growthPositive: true,
    subtitle: '۲۴ سبد در انتظار یادآوری هوشمند',
    icon: CreditCard,
  },
]

// -------------------------------------------------------------
// ۲. مدیریت محصولات و انبارداری (Full Product Catalog CRUD)
// -------------------------------------------------------------
const productsList = ref<ProductDetail[]>(
  JSON.parse(JSON.stringify(mockProducts)),
)

const productSearchQuery = ref('')
const selectedProductDivision = ref<'all' | 'apparel' | 'accessories'>('all')
const selectedProductCategory = ref('all')
const selectedProductSeason = ref('all')

const filteredProducts = computed(() => {
  return productsList.value.filter((p) => {
    const q = productSearchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))

    const matchesDivision =
      selectedProductDivision.value === 'all' ||
      p.division === selectedProductDivision.value

    const matchesCategory =
      selectedProductCategory.value === 'all' ||
      p.category === selectedProductCategory.value

    const matchesSeason =
      selectedProductSeason.value === 'all' ||
      p.season === selectedProductSeason.value

    return matchesSearch && matchesDivision && matchesCategory && matchesSeason
  })
})

const getProductTotalStock = (p: ProductDetail): number => {
  if (p.variants && p.variants.length > 0) {
    return p.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
  }
  return p.inStock ? 25 : 0
}

const toggleProductActive = (p: ProductDetail) => {
  p.is_active = !p.is_active
  toast.success(
    `وضعیت کالا «${p.title}» به ${p.is_active ? 'فعال' : 'غیرفعال'} تغییر یافت.`,
  )
}

// مودال افزودن / ویرایش کالا
const isProductModalOpen = ref(false)
const editingProduct = ref<ProductDetail | null>(null)

interface ProductFormData {
  title: string
  slug: string
  division: ProductDivision
  category: ProductCategory
  season: ProductSeason
  badge: string
  basePrice: number
  salePrice: number
  mainImage: string
  galleryImages: string
  fabricGsm: number
  fabricComposition: string
  fabricCare: string
  stockXS: number
  stockS: number
  stockM: number
  stockL: number
  stockXL: number
  stockFree: number
}

const productForm = ref<ProductFormData>({
  title: '',
  slug: '',
  division: 'apparel',
  category: 'shirts-blouses',
  season: 'fall-1405',
  badge: 'جدید',
  basePrice: 1850000,
  salePrice: 1850000,
  mainImage: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
  galleryImages: '',
  fabricGsm: 210,
  fabricComposition: '۱۰۰٪ الیاف طبیعی لینن اسلپ ارگانیک',
  fabricCare: 'شست‌وشوی دستی با آب ۳۰ درجه',
  stockXS: 5,
  stockS: 10,
  stockM: 15,
  stockL: 10,
  stockXL: 5,
  stockFree: 0,
})

const autoDiscountPercent = computed(() => {
  if (productForm.value.basePrice <= 0 || productForm.value.salePrice <= 0) return 0
  if (productForm.value.basePrice <= productForm.value.salePrice) return 0
  return Math.round(
    ((productForm.value.basePrice - productForm.value.salePrice) /
      productForm.value.basePrice) *
      100,
  )
})

const openAddProductModal = () => {
  editingProduct.value = null
  productForm.value = {
    title: '',
    slug: '',
    division: 'apparel',
    category: 'shirts-blouses',
    season: 'fall-1405',
    badge: 'جدید',
    basePrice: 1850000,
    salePrice: 1850000,
    mainImage: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
    galleryImages: '',
    fabricGsm: 220,
    fabricComposition: '۱۰۰٪ کتان ارگانیک شسته‌شده',
    fabricCare: 'شست‌وشوی ملایم با آب سرد، اتوکشی در دمای متوسط',
    stockXS: 4,
    stockS: 8,
    stockM: 12,
    stockL: 8,
    stockXL: 4,
    stockFree: 0,
  }
  isProductModalOpen.value = true
}

const openEditProductModal = (p: ProductDetail) => {
  editingProduct.value = p
  const xs = p.variants?.find((v) => v.size === 'XS')?.stock || 0
  const s = p.variants?.find((v) => v.size === 'S')?.stock || 0
  const m = p.variants?.find((v) => v.size === 'M')?.stock || 0
  const l = p.variants?.find((v) => v.size === 'L')?.stock || 0
  const xl = p.variants?.find((v) => v.size === 'XL')?.stock || 0
  const free = p.variants?.find((v) => v.size === 'Free')?.stock || 0

  productForm.value = {
    title: p.title,
    slug: p.slug,
    division: p.division,
    category: p.category,
    season: p.season,
    badge: p.badge || '',
    basePrice: p.compare_at_price || p.price,
    salePrice: p.price,
    mainImage: p.images?.[0]?.url || '',
    galleryImages: p.images?.slice(1).map((i) => i.url).join('\n') || '',
    fabricGsm: p.fabric?.gsm || p.fabric_gsm || 210,
    fabricComposition: p.fabric?.composition || p.fabric_composition || '',
    fabricCare: p.fabric?.care || '',
    stockXS: xs,
    stockS: s,
    stockM: m,
    stockL: l,
    stockXL: xl,
    stockFree: free,
  }
  isProductModalOpen.value = true
}

const saveProduct = () => {
  if (!productForm.value.title.trim()) {
    toast.error('لطفاً عنوان محصول را وارد نمایید.')
    return
  }
  if (!productForm.value.slug.trim()) {
    productForm.value.slug = `keras-item-${Date.now().toString().slice(-4)}`
  }

  const sizes =
    productForm.value.division === 'accessories'
      ? ['Free']
      : ['XS', 'S', 'M', 'L', 'XL']

  const variants =
    productForm.value.division === 'accessories'
      ? [
          {
            id: Date.now() + 1,
            sku: `${productForm.value.slug.toUpperCase()}-FREE`,
            color: 'تک‌رنگ',
            color_hex: 'rgb(59, 47, 44)',
            size: 'Free' as const,
            stock: productForm.value.stockFree || 15,
            reserved: 0,
          },
        ]
      : [
          { id: Date.now() + 1, sku: `${productForm.value.slug.toUpperCase()}-XS`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'XS' as const, stock: productForm.value.stockXS, reserved: 0 },
          { id: Date.now() + 2, sku: `${productForm.value.slug.toUpperCase()}-S`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'S' as const, stock: productForm.value.stockS, reserved: 0 },
          { id: Date.now() + 3, sku: `${productForm.value.slug.toUpperCase()}-M`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'M' as const, stock: productForm.value.stockM, reserved: 0 },
          { id: Date.now() + 4, sku: `${productForm.value.slug.toUpperCase()}-L`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'L' as const, stock: productForm.value.stockL, reserved: 0 },
          { id: Date.now() + 5, sku: `${productForm.value.slug.toUpperCase()}-XL`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'XL' as const, stock: productForm.value.stockXL, reserved: 0 },
        ]

  const galleryList = productForm.value.galleryImages
    .split('\n')
    .map((u) => u.trim())
    .filter((u) => u.length > 0)

  const images = [
    {
      id: Date.now() + 10,
      url: productForm.value.mainImage,
      alt: productForm.value.title,
      kind: 'photo' as const,
      position: 1,
    },
    ...galleryList.map((url, idx) => ({
      id: Date.now() + 20 + idx,
      url,
      alt: `${productForm.value.title} - زاویه ${idx + 2}`,
      kind: 'photo' as const,
      position: idx + 2,
    })),
  ]

  if (editingProduct.value) {
    // بروزرسانی
    Object.assign(editingProduct.value, {
      title: productForm.value.title,
      slug: productForm.value.slug,
      division: productForm.value.division,
      category: productForm.value.category,
      season: productForm.value.season,
      badge: productForm.value.badge,
      price: productForm.value.salePrice,
      base_price: productForm.value.basePrice,
      compare_at_price:
        productForm.value.basePrice > productForm.value.salePrice
          ? productForm.value.basePrice
          : undefined,
      images,
      sizes,
      available_sizes: sizes,
      variants,
      fabric: {
        composition: productForm.value.fabricComposition,
        gsm: productForm.value.fabricGsm,
        care: productForm.value.fabricCare,
      },
      fabric_gsm: productForm.value.fabricGsm,
      fabric_composition: productForm.value.fabricComposition,
    })
    toast.success(`تغییرات کالا «${productForm.value.title}» با موفقیت ذخیره شد.`)
  } else {
    // کالا جدید
    const newProd: ProductDetail = {
      id: Date.now(),
      slug: productForm.value.slug,
      title: productForm.value.title,
      brand: 'keras-atelier',
      division: productForm.value.division,
      category: productForm.value.category,
      season: productForm.value.season,
      badge: productForm.value.badge,
      price: productForm.value.salePrice,
      base_price: productForm.value.basePrice,
      compare_at_price:
        productForm.value.basePrice > productForm.value.salePrice
          ? productForm.value.basePrice
          : undefined,
      description: `طراحی و دوخت انحصاری استودیو کراس. متریال اعلا با گرماژ ${productForm.value.fabricGsm} گرم و برش مدرن ادیتوریال.`,
      fabric: {
        composition: productForm.value.fabricComposition,
        gsm: productForm.value.fabricGsm,
        care: productForm.value.fabricCare,
      },
      fabric_composition: productForm.value.fabricComposition,
      fabric_gsm: productForm.value.fabricGsm,
      stretch: 2,
      softness: 5,
      opacity: 5,
      rating: 5.0,
      rating_avg: 5.0,
      reviewCount: 0,
      rating_count: 0,
      is_active: true,
      inStock: true,
      sizes,
      available_sizes: sizes,
      colors: [{ name: 'اصلی', hex: 'rgb(59, 47, 44)' }],
      images,
      variants,
    }
    productsList.value.unshift(newProd)
    toast.success(`محصول جدید «${newProd.title}» به کاتالوگ اضافه گردید.`)
  }

  isProductModalOpen.value = false
}

// حذف / بایگانی کالا
const isDeleteProductDialogOpen = ref(false)
const productToDelete = ref<ProductDetail | null>(null)

const confirmDeleteProduct = () => {
  if (productToDelete.value) {
    const idx = productsList.value.findIndex(
      (p) => p.id === productToDelete.value?.id,
    )
    if (idx !== -1 && productsList.value[idx]) {
      const title = productsList.value[idx]!.title
      productsList.value.splice(idx, 1)
      toast.success(`کالای «${title}» با موفقیت حذف گردید.`)
    }
  }
  isDeleteProductDialogOpen.value = false
  productToDelete.value = null
}

// -------------------------------------------------------------
// ۳. میز سفارش‌ها و ثبت دستی (Advanced Orders Desk & Manual Entry)
// -------------------------------------------------------------
const ordersList = ref<TrackOrderResponse[]>(
  JSON.parse(JSON.stringify(mockOrders)),
)

const orderStatusFilter = ref<
  'all' | 'registered' | 'processing' | 'handed_over' | 'delivered' | 'canceled'
>('all')
const orderSearchQuery = ref('')

const filteredOrders = computed(() => {
  return ordersList.value.filter((o) => {
    const q = orderSearchQuery.value.trim().toLowerCase()
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.recipientName.toLowerCase().includes(q) ||
      (o.recipientPhone && o.recipientPhone.includes(q)) ||
      (o.trackingCode && o.trackingCode.includes(q))

    const matchesStatus =
      orderStatusFilter.value === 'all' || o.status === orderStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'registered':
      return { label: 'در انتظار بررسی', class: 'bg-amber-50 text-amber-700 border border-amber-200' }
    case 'processing':
      return { label: 'در حال بسته‌بندی', class: 'bg-blue-50 text-blue-700 border border-blue-200' }
    case 'handed_over':
      return { label: 'ارسال با پست', class: 'bg-purple-50 text-purple-700 border border-purple-200' }
    case 'delivered':
      return { label: 'تحویل نهایی', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
    case 'canceled':
      return { label: 'مرجوعی / لغو', class: 'bg-rose-50 text-rose border border-rose/30' }
    default:
      return { label: status, class: 'bg-slate-100 text-slate-700 border border-slate-200' }
  }
}

const updateOrderStatus = (
  order: TrackOrderResponse,
  newStatus: TrackOrderResponse['status'],
) => {
  order.status = newStatus
  const badge = getStatusBadge(newStatus)
  order.statusLabel = badge.label
  toast.success(
    `وضعیت سفارش ${order.orderNumber} به «${badge.label}» به‌روزرسانی شد.`,
  )
}

// مودال بارکد ۲۴ رقمی پست
const isBarcodeModalOpen = ref(false)
const selectedOrderForBarcode = ref<TrackOrderResponse | null>(null)
const barcodeInput = ref('')

const openBarcodeModal = (order: TrackOrderResponse) => {
  selectedOrderForBarcode.value = order
  barcodeInput.value = order.trackingCode || ''
  isBarcodeModalOpen.value = true
}

const generateSampleBarcode = () => {
  const prefix = '98234'
  const randomSuffix = Math.floor(
    1000000000000000000 + Math.random() * 9000000000000000000,
  ).toString()
  barcodeInput.value = (prefix + randomSuffix).slice(0, 24)
}

const submitBarcode = () => {
  if (!barcodeInput.value || barcodeInput.value.length !== 24) {
    toast.error('کد رهگیری پست باید دقیقاً ۲۴ رقم باشد.')
    return
  }

  if (selectedOrderForBarcode.value) {
    selectedOrderForBarcode.value.trackingCode = barcodeInput.value
    selectedOrderForBarcode.value.status = 'handed_over'
    selectedOrderForBarcode.value.statusLabel = 'تحویل به شرکت پست'
    toast.success(
      `بارکد ۲۴ رقمی برای سفارش ${selectedOrderForBarcode.value.orderNumber} ثبت و پیامک رهگیری به شماره ${selectedOrderForBarcode.value.recipientPhone || 'خریدار'} شبیه‌سازی شد.`,
    )
  }
  isBarcodeModalOpen.value = false
}

// مودال ثبت سفارش دستی
const isManualOrderModalOpen = ref(false)

interface ManualOrderItem {
  productId: number
  title: string
  size: string
  quantity: number
  price: number
  image: string
}

const manualOrderCustomerMode = ref<'existing' | 'new'>('existing')
const manualCustomerName = ref('سارا رادمنش')
const manualCustomerPhone = ref('09121112233')
const manualCustomerProvince = ref('تهران')
const manualCustomerCity = ref('تهران')
const manualCustomerAddress = ref('بلوار اندرزگو، خیابان سلیمی شمالی، ساختمان نگین، طبقه ۳')
const manualPaymentMethod = ref<'card_to_card' | 'gateway' | 'cod'>('card_to_card')
const manualOrderItems = ref<ManualOrderItem[]>([])

const manualSelectedProductId = ref<number>(mockProducts[0]?.id ?? 1)
const manualSelectedSize = ref('M')
const manualSelectedQty = ref(1)

const addManualItem = () => {
  const prod = productsList.value.find(
    (p) => p.id === manualSelectedProductId.value,
  )
  if (!prod) return

  manualOrderItems.value.push({
    productId: prod.id,
    title: prod.title,
    size: manualSelectedSize.value,
    quantity: manualSelectedQty.value,
    price: prod.price,
    image: prod.images?.[0]?.url || '',
  })

  toast.success(`کالای «${prod.title}» به پیش‌فاکتور افزوده شد.`)
}

const removeManualItem = (index: number) => {
  manualOrderItems.value.splice(index, 1)
}

const manualOrderTotal = computed(() => {
  return manualOrderItems.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
})

const openManualOrderModal = () => {
  const firstProd = mockProducts[0] || productsList.value[0]
  if (firstProd) {
    manualOrderItems.value = [
      {
        productId: firstProd.id,
        title: firstProd.title,
        size: 'M',
        quantity: 1,
        price: firstProd.price,
        image: firstProd.images?.[0]?.url || '',
      },
    ]
  } else {
    manualOrderItems.value = []
  }
  isManualOrderModalOpen.value = true
}

const copyToClipboard = (text: string) => {
  if (import.meta.client && typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    toast.success('بارکد پستی کپی شد')
  }
}

const submitManualOrder = () => {
  if (manualOrderItems.value.length === 0) {
    toast.error('حداقل یک قلم کالا به سفارش اضافه کنید.')
    return
  }
  if (!manualCustomerName.value || !manualCustomerPhone.value) {
    toast.error('مشخصات خریدار الزامی است.')
    return
  }

  const newOrderNum = `KERAS-${Math.floor(400000 + Math.random() * 500000)}`
  const newOrder: TrackOrderResponse = {
    orderNumber: newOrderNum,
    createdAt: new Date().toISOString(),
    status: 'registered',
    statusLabel: 'ثبت و در انتظار بررسی',
    recipientName: manualCustomerName.value,
    recipientPhone: manualCustomerPhone.value,
    shippingAddress: `${manualCustomerProvince.value}، ${manualCustomerCity.value}، ${manualCustomerAddress.value}`,
    trackingCode: '',
    carrier: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    estimatedDelivery: '۲ الی ۴ روز کاری',
    totalAmount: manualOrderTotal.value,
    timeline: [
      {
        status: 'registered',
        title: 'ثبت سفارش دستی',
        description: 'سفارش از طریق پنل عملیات آتلیه با موفقیت ایجاد شد.',
        timestamp: 'اکنون',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
    ],
    items: manualOrderItems.value.map((i) => ({
      title: i.title,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
      image: i.image,
    })),
  }

  ordersList.value.unshift(newOrder)
  toast.success(`سفارش دستی ${newOrderNum} با موفقیت در سامانه صادر گردید.`)
  isManualOrderModalOpen.value = false
}

// مودال چاپ برگه ارسال / فاکتور (Packing Slip)
const isPackingSlipModalOpen = ref(false)
const selectedSlipOrder = ref<TrackOrderResponse | null>(null)

const openPackingSlip = (order: TrackOrderResponse) => {
  selectedSlipOrder.value = order
  isPackingSlipModalOpen.value = true
}

const triggerPrintSlip = () => {
  window.print()
}

// -------------------------------------------------------------
// ۴. امور مالی و حسابداری (Financial Ledger & Shaparak)
// -------------------------------------------------------------
const financeDateRange = ref<'today' | 'week' | 'month' | 'all'>('month')

interface ShaparakTx {
  id: string
  rrn: string
  cardNumber: string
  bankName: string
  orderNumber: string
  customerName: string
  amount: number
  fee: number
  status: 'settled' | 'pending' | 'failed'
  settledAt: string
}

const transactionsList = ref<ShaparakTx[]>([
  {
    id: 'tx_101',
    rrn: '982301449102',
    cardNumber: '6037-99**-****-1234',
    bankName: 'بانک ملی ایران',
    orderNumber: 'KERAS-104921',
    customerName: 'سارا ملکی',
    amount: 2340000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۲ - ۱۰:۱۵:۲۲',
  },
  {
    id: 'tx_102',
    rrn: '981423881903',
    cardNumber: '6104-33**-****-5678',
    bankName: 'بانک ملت',
    orderNumber: 'KERAS-208314',
    customerName: 'فرهاد احمدی',
    amount: 1450000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۱ - ۱۶:۴۰:۰۵',
  },
  {
    id: 'tx_103',
    rrn: '984511092834',
    cardNumber: '5892-10**-****-9012',
    bankName: 'بانک سپه',
    orderNumber: 'KERAS-309115',
    customerName: 'مریم کمالی',
    amount: 3890000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۱۰ - ۱۱:۲۲:۴۸',
  },
  {
    id: 'tx_104',
    rrn: '983391204856',
    cardNumber: '6221-06**-****-4321',
    bankName: 'بانک پارسیان',
    orderNumber: 'KERAS-401827',
    customerName: 'سارا رادمنش',
    amount: 1850000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۰۹ - ۰۹:۳۰:۱۴',
  },
  {
    id: 'tx_105',
    rrn: '985512948172',
    cardNumber: '5022-29**-****-8812',
    bankName: 'بانک پاسارگاد',
    orderNumber: 'KERAS-502918',
    customerName: 'نیلوفر رضایی',
    amount: 2650000,
    fee: 4000,
    status: 'settled',
    settledAt: '۱۴۰۵/۰۷/۰۸ - ۱۹:۱۴:۳۳',
  },
  {
    id: 'tx_106',
    rrn: '986623194850',
    cardNumber: '6274-12**-****-3399',
    bankName: 'بانک اقتصاد نوین',
    orderNumber: 'KERAS-609124',
    customerName: 'آیدا شمس',
    amount: 980000,
    fee: 4000,
    status: 'pending',
    settledAt: 'در صف تسویه پایا',
  },
])

const financialKpis = computed(() => {
  const gross = transactionsList.value.reduce(
    (sum, t) => sum + (t.status === 'settled' ? t.amount : 0),
    0,
  )
  const totalFees = transactionsList.value.reduce(
    (sum, t) => sum + (t.status === 'settled' ? t.fee : 0),
    0,
  )
  const discountsAbsorbed = 1850000
  const estimatedShipping = 340000
  const net = gross - discountsAbsorbed - totalFees - estimatedShipping

  return {
    gross,
    net,
    discountsAbsorbed,
    totalFees,
    estimatedShipping,
  }
})

const exportFinanceCsv = () => {
  const headers = 'شماره ارجاع (RRN),شماره سفارش,بانک عامل,شماره کارت,خریدار,مبلغ (تومان),کارمزد شاپرک,وضعیت تسویه,تاریخ و زمان\n'
  const rows = transactionsList.value
    .map(
      (t) =>
        `"${t.rrn}","${t.orderNumber}","${t.bankName}","${t.cardNumber}","${t.customerName}",${t.amount},${t.fee},"${t.status === 'settled' ? 'تسویه‌شده' : 'در انتظار'}","${t.settledAt}"`,
    )
    .join('\n')

  const blob = new Blob(['\uFEFF' + headers + rows], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `keras-ledger-${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('گزارش دفتر کل شاپرک با فرمت CSV دانلود گردید.')
}

const printFinanceSummary = () => {
  window.print()
}

// -------------------------------------------------------------
// ۵. مدیریت مقالات و ژورنال ادیتوریال (CMS Journal & Blog)
// -------------------------------------------------------------
interface ArticleItem {
  id: number
  title: string
  slug: string
  category: string
  categoryLabel: string
  readTime: string
  date: string
  author: string
  authorRole: string
  image: string
  excerpt: string
  status: 'published' | 'draft'
}

const articlesList = ref<ArticleItem[]>([
  {
    id: 1,
    title: 'علم فشرده‌سازی عضلانی و بازیابی سریع: چرا پارچه‌های ۳۰۰ گرمی سرنوشت‌سازند؟',
    slug: 'science-of-muscle-compression-300gsm',
    category: 'science',
    categoryLabel: 'علم متریال و الیاف',
    readTime: '۶ دقیقه',
    date: '۱۲ مهر ۱۴۰۵',
    author: 'دکتر مریم رادمنش',
    authorRole: 'متخصص فیزیولوژی ورزش',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    excerpt: 'بررسی بیومکانیک بافت‌های متراکم الاستین بر بهبود بازگشت خون سیاهرگی و کاهش تجمع اسید لاکتیک.',
    status: 'published',
  },
  {
    id: 2,
    title: 'هنر لایه‌بندی ادیتوریال پاییز ۱۴۰۵: از شومیز لینن اسلپ تا کت پشمی اورسایز',
    slug: 'editorial-autumn-layering-guide-1405',
    category: 'styling',
    categoryLabel: 'استایلینگ و ترندها',
    readTime: '۴ دقیقه',
    date: '۰۸ مهر ۱۴۰۵',
    author: 'سپهر رادمنش',
    authorRole: 'مدیر هنری استودیو کراس',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    excerpt: 'چگونه پارچه‌های تنفس‌پذیر تابستانی را با ژاکت‌های پشمی سنگین پاییزی ترکیب کنیم بدون از دست رفتن سبکی فرم.',
    status: 'published',
  },
  {
    id: 3,
    title: 'اصول پایداری الیاف نچرال: تست شفافیت و تراکم نخ در آتلیه مد',
    slug: 'natural-fiber-sustainability-metrics',
    category: 'sustainability',
    categoryLabel: 'پایداری و مراقبت',
    readTime: '۵ دقیقه',
    date: '۰۲ مهر ۱۴۰۵',
    author: 'نیلوفر امینی',
    authorRole: 'سرپرست کنترل کیفی الیاف',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'استانداردهای بین‌المللی Oeko-Tex و GOTS در فرآیند رنگرزی طبیعی و ثبات رنگ در برابر شست‌وشو.',
    status: 'draft',
  },
])

const isArticleModalOpen = ref(false)
const editingArticle = ref<ArticleItem | null>(null)

const articleForm = ref({
  title: '',
  slug: '',
  category: 'science',
  categoryLabel: 'علم متریال و الیاف',
  author: 'دکتر مریم رادمنش',
  authorRole: 'هیئت علمی آتلیه کراس',
  readTime: '۵ دقیقه',
  image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  excerpt: '',
  content: '',
})

const openAddArticleModal = () => {
  editingArticle.value = null
  articleForm.value = {
    title: '',
    slug: '',
    category: 'styling',
    categoryLabel: 'استایلینگ و ترندها',
    author: 'سپهر رادمنش',
    authorRole: 'مدیر هنری آتلیه کراس',
    readTime: '۴ دقیقه',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    excerpt: '',
    content: '',
  }
  isArticleModalOpen.value = true
}

const saveArticle = (publishNow = false) => {
  if (!articleForm.value.title.trim()) {
    toast.error('عنوان مقاله الزامی است.')
    return
  }

  const slug =
    articleForm.value.slug.trim() ||
    `journal-${Date.now().toString().slice(-4)}`

  if (editingArticle.value) {
    Object.assign(editingArticle.value, {
      title: articleForm.value.title,
      slug,
      category: articleForm.value.category,
      categoryLabel: articleForm.value.categoryLabel,
      author: articleForm.value.author,
      readTime: articleForm.value.readTime,
      image: articleForm.value.image,
      excerpt: articleForm.value.excerpt,
      status: publishNow ? 'published' : editingArticle.value.status,
    })
    toast.success('مقاله با موفقیت به‌روزرسانی شد.')
  } else {
    const newArt: ArticleItem = {
      id: Date.now(),
      title: articleForm.value.title,
      slug,
      category: articleForm.value.category,
      categoryLabel: articleForm.value.categoryLabel,
      readTime: articleForm.value.readTime,
      date: 'امروز',
      author: articleForm.value.author,
      authorRole: articleForm.value.authorRole,
      image: articleForm.value.image,
      excerpt: articleForm.value.excerpt,
      status: publishNow ? 'published' : 'draft',
    }
    articlesList.value.unshift(newArt)
    toast.success(
      publishNow
        ? 'مقاله جدید در ژورنال منتشر شد.'
        : 'پیش‌نویس مقاله با موفقیت ذخیره گردید.',
    )
  }

  isArticleModalOpen.value = false
}

const toggleArticleStatus = (art: ArticleItem) => {
  art.status = art.status === 'published' ? 'draft' : 'published'
  toast.success(
    `وضعیت مقاله «${art.title}» به ${art.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'} تغییر یافت.`,
  )
}

// -------------------------------------------------------------
// ۶. انبارداری متغیرها و هشدارهای کسری (Inventory Matrix)
// -------------------------------------------------------------
interface VariantRow {
  productId: number
  productTitle: string
  color: string
  colorClass: string
  stockXS: number
  stockS: number
  stockM: number
  stockL: number
  stockXL: number
  stockFree: number
  reserved: number
  isUrgentLow: boolean
}

const variantInventory = ref<VariantRow[]>([
  {
    productId: 1,
    productTitle: 'شومیز لینن اسلپ مدل کارن',
    color: 'شنی نچرال',
    colorClass: 'bg-amber-100 border border-amber-300',
    stockXS: 5,
    stockS: 8,
    stockM: 12,
    stockL: 2,
    stockXL: 1,
    stockFree: 0,
    reserved: 3,
    isUrgentLow: true,
  },
  {
    productId: 1,
    productTitle: 'شومیز لینن اسلپ مدل کارن',
    color: 'مشکی موکا',
    colorClass: 'bg-ink border border-slate-600',
    stockXS: 7,
    stockS: 9,
    stockM: 14,
    stockL: 6,
    stockXL: 3,
    stockFree: 0,
    reserved: 1,
    isUrgentLow: false,
  },
  {
    productId: 5,
    productTitle: 'پالتو پشمی دبل‌برست پاییزه',
    color: 'شتری کلاسیک',
    colorClass: 'bg-amber-700/80 border border-amber-800',
    stockXS: 2,
    stockS: 3,
    stockM: 4,
    stockL: 1,
    stockXL: 0,
    stockFree: 0,
    reserved: 4,
    isUrgentLow: true,
  },
  {
    productId: 9,
    productTitle: 'پلیور بافت کرکی یقه اسکی',
    color: 'زغالی ملانژ',
    colorClass: 'bg-slate-700 border border-slate-500',
    stockXS: 4,
    stockS: 6,
    stockM: 8,
    stockL: 5,
    stockXL: 2,
    stockFree: 0,
    reserved: 2,
    isUrgentLow: false,
  },
  {
    productId: 17,
    productTitle: 'روسری ابریشم توییل دست‌دوز',
    color: 'طرح ادیتوریال پاییز',
    colorClass: 'bg-rose-200 border border-rose-300',
    stockXS: 0,
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockXL: 0,
    stockFree: 18,
    reserved: 5,
    isUrgentLow: false,
  },
])

// -------------------------------------------------------------
// ۷. کمپین‌ها و کدهای تخفیف (Discount Engine)
// -------------------------------------------------------------
const vouchers = ref([
  {
    id: 1,
    code: 'KERAS-PRO',
    discount: '۱۵٪',
    maxDiscount: '۳۵۰,۰۰۰ تومان',
    minOrder: '۱,۵۰۰,۰۰۰ تومان',
    usedCount: 142,
    limit: 500,
    expiresAt: '۱۴۰۵/۰۸/۳۰',
    active: true,
  },
  {
    id: 2,
    code: 'FALL1405',
    discount: '۱۰٪',
    maxDiscount: '۲۰۰,۰۰۰ تومان',
    minOrder: '۱,۰۰۰,۰۰۰ تومان',
    usedCount: 88,
    limit: 300,
    expiresAt: '۱۴۰۵/۰۷/۳۰',
    active: true,
  },
  {
    id: 3,
    code: 'VIP-ATELIER',
    discount: '۲۰٪',
    maxDiscount: '۵۰۰,۰۰۰ تومان',
    minOrder: '۳,۰۰۰,۰۰۰ تومان',
    usedCount: 29,
    limit: 50,
    expiresAt: '۱۴۰۵/۰۹/۱۵',
    active: true,
  },
])

const toggleVoucher = (v: (typeof vouchers.value)[0]) => {
  v.active = !v.active
  toast.success(
    `وضعیت کد تخفیف ${v.code} به ${v.active ? 'فعال' : 'غیرفعال'} تغییر یافت.`,
  )
}
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- تب‌های ناوبری سریع دسکتاپ و موبایل (Breadcrumbs / Quick Switch) -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-3 gap-2 overflow-x-auto">
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          data-testid="tab-view-analytics"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'analytics' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('analytics')"
        >
          دیده‌بان اجرایی
        </button>

        <button
          type="button"
          data-testid="tab-view-products"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'products' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('products')"
        >
          محصولات و انبارداری
        </button>

        <button
          type="button"
          data-testid="tab-view-fulfillment"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'fulfillment' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('fulfillment')"
        >
          میز سفارش‌ها
        </button>

        <button
          type="button"
          data-testid="tab-view-inventory"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'inventory' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('inventory')"
        >
          ماتریس انبار
        </button>

        <button
          type="button"
          data-testid="tab-view-finance"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'finance' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('finance')"
        >
          امور مالی و شاپرک
        </button>

        <button
          type="button"
          data-testid="tab-view-articles"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'articles' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('articles')"
        >
          مجله و مقالات
        </button>

        <button
          type="button"
          data-testid="tab-view-vouchers"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="currentView === 'vouchers' ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          @click="switchView('vouchers')"
        >
          کدهای تخفیف
        </button>
      </div>

      <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
        <span>پایگاه داده: آنلاین</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      </div>
    </div>

    <!-- ============================================================= -->
    <!-- ۱. نمای دیده‌بان تحلیلی و مالی (Executive Analytics View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'analytics'" data-testid="nexus-analytics-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">دیده‌بان اجرایی و نظارت مالی</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">شاخص‌های کلیدی عملکرد آتلیه مد و وضعیت فروش کالکشن پاییز ۱۴۰۵</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="switchView('products')"
          >
            <Plus class="w-4 h-4 text-slate-500" />
            <span>محصول جدید</span>
          </button>
          <button
            type="button"
            class="h-9 px-3.5 rounded-xl bg-ink text-white hover:bg-ink/90 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="switchView('fulfillment')"
          >
            <Plus class="w-4 h-4" />
            <span>ثبت سفارش دستی</span>
          </button>
        </div>
      </div>

      <!-- کارت‌های شاخص‌های کلیدی (KPIs Grid) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.title"
          class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all"
        >
          <div class="flex items-start justify-between">
            <span class="text-xs font-bold text-slate-600 block">{{ kpi.title }}</span>
            <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <component :is="kpi.icon" class="w-4 h-4" />
            </div>
          </div>

          <div class="mt-4">
            <div v-if="kpi.amount !== null" class="flex items-baseline gap-1.5">
              <span class="text-2xl font-black text-slate-900 font-mono tracking-tight">{{ formatToman(kpi.amount) }}</span>
              <span class="text-xs text-slate-500">{{ kpi.unit }}</span>
            </div>
            <div v-else class="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {{ kpi.percentage }}
            </div>

            <div class="flex items-center gap-2 mt-2">
              <span
                class="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md"
                :class="kpi.growthPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose border border-rose/30'"
              >
                {{ kpi.growth }}
              </span>
              <span class="text-[11px] text-slate-500 truncate">{{ kpi.subtitle }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- کارت‌های خلاصه عملیات سریع (Operations Shortcuts) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-ink font-bold text-sm">
              <Package class="w-4.5 h-4.5" />
              <span>کاتالوگ فعال آتلیه</span>
            </div>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              ۲۴ محصول تعریف‌شده با موجودی انبار در ۵ سایز. کالکشن پاییز ۱۴۰۵ در وضعیت فعال قرار دارد.
            </p>
          </div>
          <button
            type="button"
            class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            @click="switchView('products')"
          >
            مدیریت کالاها و انبار
          </button>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Truck class="w-4.5 h-4.5" />
              <span>سفارش‌های در حال ارسال</span>
            </div>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              صدور بارکد ۲۴ رقمی پست پیشتاز برای مرسولات و ثبت سفارشات تلفنی و اینستاگرامی.
            </p>
          </div>
          <button
            type="button"
            class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            @click="switchView('fulfillment')"
          >
            مشاهده میز سفارش‌ها
          </button>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CreditCard class="w-4.5 h-4.5" />
              <span>تسویه حساب شاپرک</span>
            </div>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              گزارش لحظه‌ای شماره ارجاع‌های بانکی (RRN)، کارمزد ۱٪ شاپرک و خروجی اکسل دفتر کل.
            </p>
          </div>
          <button
            type="button"
            class="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            @click="switchView('finance')"
          >
            مشاهده دفتر کل مالی
          </button>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۲. نمای مدیریت محصولات و انبارداری (Products Catalog CRUD View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'products'" data-testid="nexus-products-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">مدیریت محصولات و کاتالوگ آتلیه</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">تعریف محصول جدید، ویرایش متغیرهای سایز، قیمت‌گذاری و کنترل عرضه</p>
        </div>

        <button
          type="button"
          data-testid="add-product-btn"
          class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          @click="openAddProductModal"
        >
          <Plus class="w-4 h-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      <!-- فیلترها و جستجوی کالاها -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div class="relative w-full md:w-80">
          <input
            v-model="productSearchQuery"
            type="text"
            placeholder="جستجوی عنوان، شناسه (Slug) یا برند..."
            class="w-full h-10 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-ink transition-all outline-hidden"
          >
          <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-3" />
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <!-- فیلتر بخش -->
          <select
            v-model="selectedProductDivision"
            class="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-ink"
          >
            <option value="all">همه بخش‌ها</option>
            <option value="apparel">پوشاک (Apparel)</option>
            <option value="accessories">اکسسوری (Accessories)</option>
          </select>

          <!-- فیلتر فصل -->
          <select
            v-model="selectedProductSeason"
            class="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden focus:border-ink"
          >
            <option value="all">همه فصل‌ها</option>
            <option value="fall-1405">پاییز ۱۴۰۵</option>
            <option value="winter-1405">زمستان ۱۴۰۵</option>
            <option value="spring-1406">بهار ۱۴۰۶</option>
            <option value="four-season">چهار فصل</option>
          </select>
        </div>
      </div>

      <!-- جدول جامع محصولات -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">کالا و مشخصات</th>
                <th class="p-3.5 text-start">بخش و دسته‌بندی</th>
                <th class="p-3.5 text-start">فصل</th>
                <th class="p-3.5 text-start">قیمت پایه و فروش</th>
                <th class="p-3.5 text-start">موجودی انبار</th>
                <th class="p-3.5 text-start">وضعیت عرضه</th>
                <th class="p-3.5 text-end">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- کالا و عکس -->
                <td class="p-3.5">
                  <div class="flex items-center gap-3">
                    <img
                      :src="product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=200&q=80'"
                      :alt="product.title"
                      class="w-12 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                    >
                    <div class="min-w-0">
                      <span class="font-bold text-slate-900 block truncate max-w-xs">{{ product.title }}</span>
                      <span class="text-[10px] text-slate-500 font-mono block mt-0.5">{{ product.slug }}</span>
                      <span v-if="product.badge" class="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        {{ product.badge }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- بخش و دسته -->
                <td class="p-3.5">
                  <span class="font-bold text-slate-800 block">
                    {{ product.division === 'apparel' ? 'پوشاک' : 'اکسسوری' }}
                  </span>
                  <span class="text-[10px] text-slate-500 block mt-0.5">{{ product.category }}</span>
                </td>

                <!-- فصل -->
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                    {{ product.season }}
                  </span>
                </td>

                <!-- قیمت -->
                <td class="p-3.5 font-mono">
                  <span class="font-bold text-slate-900 block">{{ formatToman(product.price) }} تومان</span>
                  <span
                    v-if="product.compare_at_price && product.compare_at_price > product.price"
                    class="text-[10px] text-slate-400 line-through block"
                  >
                    {{ formatToman(product.compare_at_price) }}
                  </span>
                </td>

                <!-- موجودی -->
                <td class="p-3.5">
                  <div class="flex items-center gap-1.5 font-mono">
                    <span
                      class="px-2 py-0.5 rounded-md font-bold text-xs"
                      :class="getProductTotalStock(product) < 10 ? 'bg-rose-50 text-rose border border-rose/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                    >
                      {{ getProductTotalStock(product) }} عدد
                    </span>
                  </div>
                </td>

                <!-- سوئیچ فعال/غیرفعال -->
                <td class="p-3.5">
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                    :class="product.is_active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
                    @click="toggleProductActive(product)"
                  >
                    {{ product.is_active ? 'فعال' : 'غیرفعال' }}
                  </button>
                </td>

                <!-- عملیات -->
                <td class="p-3.5 text-end">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      data-testid="edit-product-btn"
                      class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="ویرایش محصول"
                      @click="openEditProductModal(product)"
                    >
                      <Edit3 class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      data-testid="delete-product-btn"
                      class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose cursor-pointer"
                      title="حذف / بایگانی"
                      @click="productToDelete = product; isDeleteProductDialogOpen = true"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۳. میز سفارش‌ها و توزیع (Fulfillment & Manual Orders View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'fulfillment'" data-testid="nexus-fulfillment-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">میز مدیریت سفارش‌ها و توزیع پستی</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">پردازش وضعیت سفارش‌ها، تخصیص بارکد ۲۴ رقمی پست و ثبت سفارش دستی</p>
        </div>

        <button
          type="button"
          data-testid="create-manual-order-btn"
          class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          @click="openManualOrderModal"
        >
          <Plus class="w-4 h-4" />
          <span>+ ثبت سفارش دستی جدید</span>
        </button>
      </div>

      <!-- فیلترهای وضعیت سفارش -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div class="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="orderStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
            @click="orderStatusFilter = 'all'"
          >
            همه ({{ ordersList.length }})
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="orderStatusFilter === 'registered' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            @click="orderStatusFilter = 'registered'"
          >
            در انتظار بررسی
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="orderStatusFilter === 'processing' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            @click="orderStatusFilter = 'processing'"
          >
            در حال بسته‌بندی
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="orderStatusFilter === 'handed_over' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            @click="orderStatusFilter = 'handed_over'"
          >
            ارسال با پست
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            :class="orderStatusFilter === 'delivered' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
            @click="orderStatusFilter = 'delivered'"
          >
            تحویل شده
          </button>
        </div>

        <div class="relative w-full md:w-72">
          <input
            v-model="orderSearchQuery"
            type="text"
            placeholder="جستجوی شماره سفارش، خریدار یا بارکد..."
            class="w-full h-9 ps-8 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
          >
          <Search class="w-3.5 h-3.5 text-slate-400 absolute inset-s-2.5 top-2.5" />
        </div>
      </div>

      <!-- جدول سفارش‌ها -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">سفارش و خریدار</th>
                <th class="p-3.5 text-start">نشانی تحویل</th>
                <th class="p-3.5 text-start">اقلام</th>
                <th class="p-3.5 text-start">مبلغ فاکتور</th>
                <th class="p-3.5 text-start">وضعیت جاری</th>
                <th class="p-3.5 text-start">کد رهگیری پست</th>
                <th class="p-3.5 text-end">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="order in filteredOrders"
                :key="order.orderNumber"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- شماره و خریدار -->
                <td class="p-3.5">
                  <span class="font-bold text-slate-900 font-mono block">{{ order.orderNumber }}</span>
                  <span class="text-slate-700 font-medium block mt-0.5">{{ order.recipientName }}</span>
                  <span class="text-[10px] text-slate-400 font-mono block">{{ order.recipientPhone || '—' }}</span>
                </td>

                <!-- نشانی -->
                <td class="p-3.5 max-w-xs truncate text-slate-600" :title="order.shippingAddress">
                  {{ order.shippingAddress }}
                </td>

                <!-- اقلام -->
                <td class="p-3.5">
                  <div class="flex items-center gap-1.5">
                    <span class="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-[11px] text-slate-700">
                      {{ order.items.length }} قلم
                    </span>
                  </div>
                </td>

                <!-- مبلغ فاکتور -->
                <td class="p-3.5 font-mono font-bold text-slate-900">
                  {{ formatToman(order.totalAmount) }} تومان
                </td>

                <!-- وضعیت سفارش و تغییر سریع درون‌خطی -->
                <td class="p-3.5">
                  <select
                    :value="order.status"
                    class="h-8 px-2 rounded-lg text-xs font-bold border transition-colors outline-hidden cursor-pointer"
                    :class="getStatusBadge(order.status).class"
                    @change="updateOrderStatus(order, ($event.target as HTMLSelectElement).value as any)"
                  >
                    <option value="registered">در انتظار بررسی</option>
                    <option value="processing">در حال بسته‌بندی</option>
                    <option value="handed_over">ارسال با پست</option>
                    <option value="delivered">تحویل شده</option>
                    <option value="canceled">مرجوعی / لغو</option>
                  </select>
                </td>

                <!-- بارکد پست -->
                <td class="p-3.5">
                  <div v-if="order.trackingCode" class="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                    <span class="truncate max-w-[120px]">{{ order.trackingCode }}</span>
                    <button
                      type="button"
                      class="p-1 hover:text-ink cursor-pointer"
                      title="کپی بارکد"
                      @click="copyToClipboard(order.trackingCode!)"
                    >
                      <Copy class="w-3 h-3" />
                    </button>
                  </div>
                  <span v-else class="text-slate-400 text-[11px]">صادر نشده</span>
                </td>

                <!-- عملیات -->
                <td class="p-3.5 text-end">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      data-testid="assign-barcode-btn"
                      class="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                      title="تخصیص بارکد ۲۴ رقمی پست"
                      @click="openBarcodeModal(order)"
                    >
                      <Truck class="w-3 h-3" />
                      <span>تخصیص بارکد</span>
                    </button>
                    <button
                      type="button"
                      data-testid="print-packing-slip-btn"
                      class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="چاپ فاکتور و برچسب پستی"
                      @click="openPackingSlip(order)"
                    >
                      <Printer class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۴. امور مالی و حسابداری (Financial Ledger & Shaparak View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'finance'" data-testid="nexus-finance-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">دفتر کل مالی و تسویه شاپرک</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">تراز مالی، کارمزدهای شاپرک، تخفیف‌های جذب‌شده و اسناد تسویه بانکی</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            data-testid="export-finance-csv-btn"
            class="h-9 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="exportFinanceCsv"
          >
            <Download class="w-4 h-4 text-slate-500" />
            <span>خروجی اکسل (CSV)</span>
          </button>
          <button
            type="button"
            data-testid="print-finance-summary-btn"
            class="h-9 px-3.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="printFinanceSummary"
          >
            <Printer class="w-4 h-4" />
            <span>چاپ ترازنامه</span>
          </button>
        </div>
      </div>

      <!-- بازه زمانی و فیلترها -->
      <div class="flex items-center gap-1.5 bg-white border border-slate-200/80 p-2 rounded-2xl shadow-xs w-fit">
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="financeDateRange === 'today' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="financeDateRange = 'today'"
        >
          امروز
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="financeDateRange === 'week' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="financeDateRange = 'week'"
        >
          ۷ روز گذشته
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="financeDateRange === 'month' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="financeDateRange = 'month'"
        >
          این ماه
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          :class="financeDateRange === 'all' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="financeDateRange = 'all'"
        >
          کل دوره
        </button>
      </div>

      <!-- کارت‌های تراز مالی (Ledger KPI Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span class="text-xs font-bold text-slate-500 block">فروش ناخالص (Gross)</span>
          <span class="text-lg font-black text-slate-900 font-mono block mt-2">{{ formatToman(financialKpis.gross) }}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
        </div>

        <div class="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs bg-emerald-50/20">
          <span class="text-xs font-bold text-emerald-800 block">درآمد خالص تسویه (Net)</span>
          <span class="text-lg font-black text-emerald-700 font-mono block mt-2">{{ formatToman(financialKpis.net) }}</span>
          <span class="text-[10px] text-emerald-600 block mt-0.5">تومان</span>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span class="text-xs font-bold text-slate-500 block">تخفیف‌های جذب‌شده</span>
          <span class="text-lg font-black text-rose font-mono block mt-2">{{ formatToman(financialKpis.discountsAbsorbed) }}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span class="text-xs font-bold text-slate-500 block">هزینه ارسال پست</span>
          <span class="text-lg font-black text-slate-800 font-mono block mt-2">{{ formatToman(financialKpis.estimatedShipping) }}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
        </div>

        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <span class="text-xs font-bold text-slate-500 block">کارمزد شاپرک (۱٪)</span>
          <span class="text-lg font-black text-amber-700 font-mono block mt-2">{{ formatToman(financialKpis.totalFees) }}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
        </div>
      </div>

      <!-- جدول تراکنش‌های شاپرک -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-900">ریز اسناد تسویه شبکه پرداخت شاپرک</h3>
          <span class="text-[11px] text-slate-500 font-mono">{{ transactionsList.length }} سند ثبت‌شده</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">شماره ارجاع (RRN)</th>
                <th class="p-3.5 text-start">شماره کارت و بانک عامل</th>
                <th class="p-3.5 text-start">شماره سفارش و خریدار</th>
                <th class="p-3.5 text-start">مبلغ تراکنش</th>
                <th class="p-3.5 text-start">کارمزد ۱٪</th>
                <th class="p-3.5 text-start">وضعیت تسویه</th>
                <th class="p-3.5 text-start">زمان تسویه</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr
                v-for="tx in transactionsList"
                :key="tx.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- RRN -->
                <td class="p-3.5 font-bold text-slate-900">
                  {{ tx.rrn }}
                </td>

                <!-- کارت و بانک -->
                <td class="p-3.5 font-sans">
                  <span class="font-bold text-slate-800 block font-mono text-[11px]">{{ tx.cardNumber }}</span>
                  <span class="text-[10px] text-slate-500 block mt-0.5">{{ tx.bankName }}</span>
                </td>

                <!-- سفارش و خریدار -->
                <td class="p-3.5 font-sans">
                  <span class="font-bold text-slate-900 block font-mono text-[11px]">{{ tx.orderNumber }}</span>
                  <span class="text-[10px] text-slate-600 block mt-0.5">{{ tx.customerName }}</span>
                </td>

                <!-- مبلغ -->
                <td class="p-3.5 font-bold text-slate-900">
                  {{ formatToman(tx.amount) }} تومان
                </td>

                <!-- کارمزد -->
                <td class="p-3.5 text-slate-500">
                  {{ formatToman(tx.fee) }} تومان
                </td>

                <!-- وضعیت -->
                <td class="p-3.5 font-sans">
                  <span
                    class="px-2 py-0.5 rounded-full text-[11px] font-bold"
                    :class="tx.status === 'settled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                  >
                    {{ tx.status === 'settled' ? 'تسویه‌شده' : 'در انتظار' }}
                  </span>
                </td>

                <!-- زمان -->
                <td class="p-3.5 text-slate-500 font-sans text-[11px]">
                  {{ tx.settledAt }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۵. مدیریت مقالات و ژورنال ادیتوریال (CMS Journal & Blog View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'articles'" data-testid="nexus-articles-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">مدیریت مقالات و ژورنال ادیتوریال</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">تولید محتوا، راهنمای استایلینگ پاییزه، علم الیاف و انتشار در بلاگ</p>
        </div>

        <button
          type="button"
          data-testid="create-article-btn"
          class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          @click="openAddArticleModal"
        >
          <Plus class="w-4 h-4" />
          <span>+ نگارش مقاله جدید</span>
        </button>
      </div>

      <!-- جدول مقالات -->
      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">عنوان مقاله و کاور</th>
                <th class="p-3.5 text-start">دسته‌بندی</th>
                <th class="p-3.5 text-start">نویسنده</th>
                <th class="p-3.5 text-start">زمان مطالعه</th>
                <th class="p-3.5 text-start">وضعیت انتشار</th>
                <th class="p-3.5 text-end">عملیات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="article in articlesList"
                :key="article.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- عنوان و عکس -->
                <td class="p-3.5">
                  <div class="flex items-center gap-3">
                    <img
                      :src="article.image"
                      :alt="article.title"
                      class="w-12 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                    >
                    <div class="min-w-0 max-w-md">
                      <span class="font-bold text-slate-900 block truncate">{{ article.title }}</span>
                      <span class="text-[10px] text-slate-500 font-mono block mt-0.5">{{ article.slug }}</span>
                    </div>
                  </div>
                </td>

                <!-- دسته -->
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                    {{ article.categoryLabel }}
                  </span>
                </td>

                <!-- نویسنده -->
                <td class="p-3.5 text-slate-700">
                  <span class="font-bold block">{{ article.author }}</span>
                  <span class="text-[10px] text-slate-400 block mt-0.5">{{ article.authorRole }}</span>
                </td>

                <!-- زمان مطالعه -->
                <td class="p-3.5 text-slate-600 font-mono">
                  {{ article.readTime }}
                </td>

                <!-- وضعیت -->
                <td class="p-3.5">
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                    :class="article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                    @click="toggleArticleStatus(article)"
                  >
                    {{ article.status === 'published' ? 'منتشر شده' : 'پیش‌نویس' }}
                  </button>
                </td>

                <!-- عملیات -->
                <td class="p-3.5 text-end">
                  <div class="flex items-center justify-end gap-1.5">
                    <NuxtLink
                      :to="`/blog`"
                      target="_blank"
                      class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="مشاهده در وبلاگ"
                    >
                      <ExternalLink class="w-4 h-4" />
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۶. ماتریس موجودی انبارداری (Variant Stock Matrix View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'inventory'" data-testid="nexus-inventory-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">ماتریس موجودی انبار و متغیرهای سایز</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">کنترل متمرکز موجودی‌های S, M, L و هشدارهای اتوماتیک کسری انبار</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">کالا و رنگ</th>
                <th class="p-3.5 text-center">XS</th>
                <th class="p-3.5 text-center">S</th>
                <th class="p-3.5 text-center">M</th>
                <th class="p-3.5 text-center">L</th>
                <th class="p-3.5 text-center">XL</th>
                <th class="p-3.5 text-center">Free</th>
                <th class="p-3.5 text-start">رزرو شده</th>
                <th class="p-3.5 text-end">وضعیت کسری</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr
                v-for="(row, idx) in variantInventory"
                :key="idx"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="p-3.5 font-sans">
                  <div class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-full inline-block shrink-0" :class="row.colorClass" />
                    <div>
                      <span class="font-bold text-slate-900 block">{{ row.productTitle }}</span>
                      <span class="text-[10px] text-slate-500 block mt-0.5">{{ row.color }}</span>
                    </div>
                  </div>
                </td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockXS }}</td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockS }}</td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockM }}</td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockL }}</td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockXL }}</td>
                <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockFree }}</td>
                <td class="p-3.5 text-slate-500">{{ row.reserved }} عدد</td>
                <td class="p-3.5 text-end font-sans">
                  <span
                    v-if="row.isUrgentLow"
                    class="px-2 py-0.5 rounded-md font-bold text-[11px] bg-rose-50 text-rose border border-rose/30"
                  >
                    کسری انبار
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    مطلوب
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۷. کدهای تخفیف و پروموشن (Discount Vouchers View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'vouchers'" data-testid="nexus-vouchers-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">کمپین‌های تخفیف و پروموشن</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">مدیریت کوپن‌های فعال، درصد تخفیف، محدودیت مصرف و تاریخ انقضا</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="v in vouchers"
          :key="v.id"
          class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between">
              <span class="font-mono font-black text-base text-slate-900 px-2 py-1 rounded bg-slate-100 border border-slate-200">
                {{ v.code }}
              </span>
              <button
                type="button"
                class="px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
                :class="v.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'"
                @click="toggleVoucher(v)"
              >
                {{ v.active ? 'فعال' : 'غیرفعال' }}
              </button>
            </div>

            <div class="mt-4 space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>میزان تخفیف:</span>
                <span class="font-bold text-slate-900">{{ v.discount }}</span>
              </div>
              <div class="flex justify-between">
                <span>سقف تخفیف:</span>
                <span class="font-bold text-slate-900">{{ v.maxDiscount }}</span>
              </div>
              <div class="flex justify-between">
                <span>حداقل سبد خرید:</span>
                <span class="font-bold text-slate-900">{{ v.minOrder }}</span>
              </div>
              <div class="flex justify-between">
                <span>مصرف شده:</span>
                <span class="font-bold text-slate-900 font-mono">{{ v.usedCount }} از {{ v.limit }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>انقضا: {{ v.expiresAt }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- ۸. باشگاه مشتریان و CRM (CRM View) -->
    <!-- ============================================================= -->
    <section v-if="currentView === 'crm'" data-testid="nexus-crm-view" class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">باشگاه مشتریان و CRM آتلیه</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">مدیریت اعضای رسمی باشگاه مشتریان کراس، سطح‌بندی و ارزش سبد</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th class="p-3.5 text-start">نام خریدار</th>
                <th class="p-3.5 text-start">شماره تماس</th>
                <th class="p-3.5 text-start">سطح کاربری</th>
                <th class="p-3.5 text-start">تعداد سفارشات</th>
                <th class="p-3.5 text-start">مجموع خرید</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-sans">
              <tr class="hover:bg-slate-50/70">
                <td class="p-3.5 font-bold text-slate-900">سارا رادمنش</td>
                <td class="p-3.5 font-mono text-slate-600">09121112233</td>
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                    پلاتینوم آتلیه
                  </span>
                </td>
                <td class="p-3.5 font-mono">۴ سفارش</td>
                <td class="p-3.5 font-mono font-bold text-slate-900">۷,۵۵۰,۰۰۰ تومان</td>
              </tr>
              <tr class="hover:bg-slate-50/70">
                <td class="p-3.5 font-bold text-slate-900">سارا ملکی</td>
                <td class="p-3.5 font-mono text-slate-600">09123456789</td>
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                    طلایی
                  </span>
                </td>
                <td class="p-3.5 font-mono">۲ سفارش</td>
                <td class="p-3.5 font-mono font-bold text-slate-900">۳,۷۹۰,۰۰۰ تومان</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- مودال‌های تعاملی (Dialogs & Modals) -->
    <!-- ============================================================= -->

    <!-- مودال افزودن / ویرایش کالا -->
    <Dialog :open="isProductModalOpen" @update:open="isProductModalOpen = $event">
      <DialogContent class="sm:max-w-3xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-slate-900">
            {{ editingProduct ? 'ویرایش مشخصات کالا' : 'افزودن محصول جدید به کاتالوگ آتلیه' }}
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-500">
            اطلاعات پایه، تصاویر، گرماژ متریال و ماتریس موجودی سایزهای کالا
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-3 text-xs">
          <!-- بخش اول: عناوین و دسته‌بندی -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">عنوان فارسی کالا</label>
              <input
                v-model="productForm.title"
                type="text"
                placeholder="مثال: کت پشمی دبل‌برست پاییزه"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">شناسه یکتا (Slug)</label>
              <input
                v-model="productForm.slug"
                type="text"
                placeholder="double-breasted-wool-coat"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:border-ink outline-hidden"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">بخش اصلی</label>
              <select
                v-model="productForm.division"
                class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
              >
                <option value="apparel">پوشاک (Apparel)</option>
                <option value="accessories">اکسسوری (Accessories)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">دسته‌بندی</label>
              <select
                v-model="productForm.category"
                class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
              >
                <option value="shirts-blouses">شومیز و پیراهن</option>
                <option value="knitwear">بافت و پلیور</option>
                <option value="coats-jackets">پالتو و بارانی</option>
                <option value="pants">شلوار</option>
                <option value="scarves">شال و روسری</option>
                <option value="hair-accessories">اکسسوری مو</option>
                <option value="bandanas">باندانا</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">فصل و کالکشن</label>
              <select
                v-model="productForm.season"
                class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
              >
                <option value="fall-1405">پاییز ۱۴۰۵</option>
                <option value="winter-1405">زمستان ۱۴۰۵</option>
                <option value="spring-1406">بهار ۱۴۰۶</option>
                <option value="four-season">چهار فصل</option>
              </select>
            </div>
          </div>

          <!-- بخش دوم: قیمت‌گذاری -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span class="font-bold text-slate-800 block">قیمت‌گذاری و تخفیف</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-600 mb-1">قیمت پایه (تومان)</label>
                <input
                  v-model.number="productForm.basePrice"
                  type="number"
                  class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono outline-hidden"
                >
              </div>
              <div>
                <label class="block text-slate-600 mb-1">قیمت فروش نقدی (تومان)</label>
                <input
                  v-model.number="productForm.salePrice"
                  type="number"
                  class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono outline-hidden"
                >
              </div>
              <div>
                <label class="block text-slate-600 mb-1">درصد تخفیف خودکار</label>
                <div class="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center font-mono font-bold text-amber-700">
                  {{ autoDiscountPercent }}٪ تخفیف
                </div>
              </div>
            </div>
          </div>

          <!-- بخش سوم: تصاویر -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">آدرس تصویر اصلی</label>
            <input
              v-model="productForm.mainImage"
              type="text"
              placeholder="https://..."
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
            >
          </div>

          <!-- بخش چهارم: مشخصات پارچه -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">گرماژ پارچه (GSM)</label>
              <input
                v-model.number="productForm.fabricGsm"
                type="number"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">ترکیب الیاف</label>
              <input
                v-model="productForm.fabricComposition"
                type="text"
                placeholder="۸۰٪ پشم مرینوس، ۲۰٪ کشمیر"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
              >
            </div>
          </div>

          <!-- بخش پنجم: ماتریس موجودی سایزها -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="font-bold text-slate-800 block mb-2">موجودی انبار بر حسب سایز</span>
            <div v-if="productForm.division === 'apparel'" class="grid grid-cols-5 gap-2">
              <div>
                <label class="block text-center text-slate-500 mb-1">XS</label>
                <input
                  v-model.number="productForm.stockXS"
                  type="number"
                  class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
              <div>
                <label class="block text-center text-slate-500 mb-1">S</label>
                <input
                  v-model.number="productForm.stockS"
                  type="number"
                  class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
              <div>
                <label class="block text-center text-slate-500 mb-1">M</label>
                <input
                  v-model.number="productForm.stockM"
                  type="number"
                  class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
              <div>
                <label class="block text-center text-slate-500 mb-1">L</label>
                <input
                  v-model.number="productForm.stockL"
                  type="number"
                  class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
              <div>
                <label class="block text-center text-slate-500 mb-1">XL</label>
                <input
                  v-model.number="productForm.stockXL"
                  type="number"
                  class="w-full h-8 text-center rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
            </div>
            <div v-else class="max-w-xs">
              <label class="block text-slate-500 mb-1">موجودی تک‌سایز (Free Size)</label>
              <input
                v-model.number="productForm.stockFree"
                type="number"
                class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200 font-mono"
              >
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isProductModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="save-product-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
            @click="saveProduct"
          >
            ذخیره اطلاعات محصول
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- دیالوگ تایید حذف محصول -->
    <Dialog :open="isDeleteProductDialogOpen" @update:open="isDeleteProductDialogOpen = $event">
      <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-rose">تایید حذف کالا از کاتالوگ</DialogTitle>
          <DialogDescription class="text-xs text-slate-600">
            آیا از حذف محصول «{{ productToDelete?.title }}» اطمینان دارید؟ این عمل کالا را از ویترین فروشگاه خارج می‌سازد.
          </DialogDescription>
        </DialogHeader>
        <div class="flex items-center justify-end gap-2 pt-4">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isDeleteProductDialogOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="confirm-delete-product-btn"
            class="h-9 px-5 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold cursor-pointer"
            @click="confirmDeleteProduct"
          >
            بله، حذف شود
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- مودال تخصیص بارکد ۲۴ رقمی پست (Exact Text Preserved) -->
    <Dialog :open="isBarcodeModalOpen" @update:open="isBarcodeModalOpen = $event">
      <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-slate-900">
            تخصیص بارکد ۲۴ رقمی شرکت ملی پست
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-600">
            کد رهگیری صادرشده از باجه پستی را وارد کنید تا پیامک رهگیری به خریدار ارسال شود.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">بارکد ۲۴ رقمی مرسوله</label>
            <input
              v-model="barcodeInput"
              data-testid="dispatch-barcode-input"
              type="text"
              maxlength="24"
              placeholder="مثال: 982341908234123456789012"
              class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono tracking-widest text-slate-900 outline-hidden focus:bg-white focus:border-ink"
            >
          </div>

          <button
            type="button"
            class="text-xs text-ink hover:underline font-bold cursor-pointer flex items-center gap-1"
            @click="generateSampleBarcode"
          >
            <Sparkles class="w-3.5 h-3.5" />
            <span>تولید بارکد ۲۴ رقمی نمونه برای تست</span>
          </button>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isBarcodeModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="submit-barcode-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
            @click="submitBarcode"
          >
            ثبت بارکد و ارسال مرسوله
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- مودال ثبت سفارش دستی جدید -->
    <Dialog :open="isManualOrderModalOpen" @update:open="isManualOrderModalOpen = $event">
      <DialogContent class="sm:max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-slate-900">
            ثبت سفارش دستی جدید (فروش تلفنی / اینستاگرام)
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-500">
            انتخاب کالا از کاتالوگ، مشخصات خریدار و شیوه تسویه حساب
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-3 text-xs">
          <!-- مشخصات خریدار -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 block">مشخصات تحویل‌گیرنده</span>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer"
                  :class="manualOrderCustomerMode === 'existing' ? 'bg-ink text-white' : 'bg-slate-200 text-slate-700'"
                  @click="manualOrderCustomerMode = 'existing'; manualCustomerName = 'سارا رادمنش'; manualCustomerPhone = '09121112233'"
                >
                  سارا رادمنش (پیش‌فرض)
                </button>
                <button
                  type="button"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer"
                  :class="manualOrderCustomerMode === 'new' ? 'bg-ink text-white' : 'bg-slate-200 text-slate-700'"
                  @click="manualOrderCustomerMode = 'new'; manualCustomerName = ''; manualCustomerPhone = ''"
                >
                  خریدار جدید
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-600 mb-1">نام کامل خریدار</label>
                <input
                  v-model="manualCustomerName"
                  type="text"
                  class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200"
                >
              </div>
              <div>
                <label class="block text-slate-600 mb-1">شماره تماس (موبایل)</label>
                <input
                  v-model="manualCustomerPhone"
                  type="text"
                  class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200 font-mono"
                >
              </div>
            </div>
            <div>
              <label class="block text-slate-600 mb-1">نشانی دقیق پستی</label>
              <input
                v-model="manualCustomerAddress"
                type="text"
                class="w-full h-8 px-3 rounded-lg bg-white border border-slate-200"
              >
            </div>
            <div>
              <label class="block text-slate-600 mb-1">شیوه تسویه و پرداخت</label>
              <select
                v-model="manualPaymentMethod"
                class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
              >
                <option value="card_to_card">کارت‌به‌کارت بانکی</option>
                <option value="gateway">درگاه پرداخت اینترنتی شاپرک</option>
                <option value="cod">پرداخت در محل (تهران)</option>
              </select>
            </div>
          </div>

          <!-- انتخاب کالا -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <span class="font-bold text-slate-800 block">افزودن اقلام به پیش‌فاکتور</span>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div class="sm:col-span-2">
                <label class="block text-slate-600 mb-1">انتخاب کالا</label>
                <select
                  v-model="manualSelectedProductId"
                  class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <option v-for="p in productsList" :key="p.id" :value="p.id">
                    {{ p.title }} ({{ formatToman(p.price) }} ت)
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-slate-600 mb-1">سایز</label>
                <select
                  v-model="manualSelectedSize"
                  class="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="Free">Free</option>
                </select>
              </div>
              <div class="flex items-end">
                <button
                  type="button"
                  class="w-full h-8 rounded-lg bg-ink text-white font-bold text-xs cursor-pointer hover:bg-ink/90"
                  @click="addManualItem"
                >
                  + افزودن
                </button>
              </div>
            </div>

            <!-- جدول اقلام افزوده شده -->
            <div v-if="manualOrderItems.length > 0" class="mt-3 border-t border-slate-200 pt-2 space-y-1.5">
              <div
                v-for="(item, idx) in manualOrderItems"
                :key="idx"
                class="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
              >
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ item.title }}</span>
                  <span class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">سایز: {{ item.size }}</span>
                  <span class="text-slate-500 font-mono">({{ formatToman(item.price) }} تومان)</span>
                </div>
                <button
                  type="button"
                  class="text-rose hover:underline font-bold"
                  @click="removeManualItem(idx)"
                >
                  حذف
                </button>
              </div>

              <div class="flex justify-between items-center pt-2 font-bold text-sm text-slate-900">
                <span>جمع کل سفارش:</span>
                <span class="font-mono">{{ formatToman(manualOrderTotal) }} تومان</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isManualOrderModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="submit-manual-order-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
            @click="submitManualOrder"
          >
            ثبت نهایی سفارش
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- مودال چاپ برگ ارسال پستی (Packing Slip Modal) -->
    <Dialog :open="isPackingSlipModalOpen" @update:open="isPackingSlipModalOpen = $event">
      <DialogContent class="sm:max-w-xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-slate-900">
            برگ ارسال مرسوله پستی (Packing Slip)
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-500">
            برچسب چاپی استاندارد برای درج روی جعبه ارسالی آتلیه کراس
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedSlipOrder" class="p-4 border border-slate-300 rounded-xl space-y-4 text-xs font-sans bg-white">
          <div class="flex items-center justify-between border-b border-slate-300 pb-3">
            <div>
              <span class="font-black text-sm text-slate-900 block">کراس • استودیو مد و لباس</span>
              <span class="text-[10px] text-slate-500 block">برگ ارسال مرسوله پستی</span>
            </div>
            <div class="text-end font-mono">
              <span class="font-bold text-slate-900 block">{{ selectedSlipOrder.orderNumber }}</span>
              <span class="text-[10px] text-slate-500 block">پست پیشتاز</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg text-[11px]">
            <div>
              <span class="font-bold text-slate-700 block">فرستنده:</span>
              <p class="text-slate-600 mt-1 leading-relaxed">
                آتلیه مد کراس — تهران، خیابان فرشته، پلاک ۱۸<br >
                تلفن پشتیبانی: ۰۲۱۲۲۰۰۳۳۰۰
              </p>
            </div>
            <div>
              <span class="font-bold text-slate-700 block">گیرنده:</span>
              <p class="text-slate-900 font-bold mt-1">{{ selectedSlipOrder.recipientName }}</p>
              <p class="text-slate-600 font-mono">{{ selectedSlipOrder.recipientPhone || '—' }}</p>
              <p class="text-slate-600 mt-1 leading-relaxed">{{ selectedSlipOrder.shippingAddress }}</p>
            </div>
          </div>

          <div class="border border-slate-200 rounded-lg overflow-hidden">
            <table class="w-full text-start text-[11px]">
              <thead class="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-2 text-start">شرح کالا</th>
                  <th class="p-2 text-center">سایز</th>
                  <th class="p-2 text-center">تعداد</th>
                  <th class="p-2 text-end">مبلغ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(item, idx) in selectedSlipOrder.items" :key="idx">
                  <td class="p-2 font-bold">{{ item.title }}</td>
                  <td class="p-2 text-center font-mono">{{ item.size }}</td>
                  <td class="p-2 text-center font-mono">{{ item.quantity }}</td>
                  <td class="p-2 text-end font-mono">{{ formatToman(item.price) }} ت</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center pt-2 font-bold text-xs">
            <span>مجموع ارزش فاکتور:</span>
            <span class="font-mono text-sm">{{ formatToman(selectedSlipOrder.totalAmount) }} تومان</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isPackingSlipModalOpen = false"
          >
            بستن
          </button>
          <button
            type="button"
            data-testid="do-print-slip-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            @click="triggerPrintSlip"
          >
            <Printer class="w-4 h-4" />
            <span>چاپ برگه ارسال</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- مودال نگارش / ویرایش مقاله ژورنال -->
    <Dialog :open="isArticleModalOpen" @update:open="isArticleModalOpen = $event">
      <DialogContent class="sm:max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-base font-black text-slate-900">
            {{ editingArticle ? 'ویرایش مقاله ژورنال' : 'نگارش مقاله جدید در مجله ادیتوریال کراس' }}
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-500">
            محتوای آموزشی، ترندهای استایل، علم الیاف و انتشار در بلاگ
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">عنوان مقاله</label>
            <input
              v-model="articleForm.title"
              type="text"
              placeholder="مثال: هنر لایه‌بندی ادیتوریال پاییز ۱۴۰۵"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">نامک یکتا (Slug)</label>
              <input
                v-model="articleForm.slug"
                type="text"
                placeholder="autumn-layering-1405"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">دسته‌بندی موضوعی</label>
              <select
                v-model="articleForm.categoryLabel"
                class="w-full h-9 px-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
              >
                <option value="استایلینگ و ترندها">استایلینگ و ترندها</option>
                <option value="علم متریال و الیاف">علم متریال و الیاف</option>
                <option value="فیزیولوژی تمرین">فیزیولوژی تمرین</option>
                <option value="پایداری و مراقبت">پایداری و مراقبت</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">نویسنده</label>
              <input
                v-model="articleForm.author"
                type="text"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">زمان مطالعه تخمینی</label>
              <input
                v-model="articleForm.readTime"
                type="text"
                placeholder="۵ دقیقه"
                class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
              >
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">آدرس تصویر کاور</label>
            <input
              v-model="articleForm.image"
              type="text"
              class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono outline-hidden"
            >
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">خلاصه کوتاه مقاله (Excerpt)</label>
            <textarea
              v-model="articleForm.excerpt"
              rows="2"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden resize-none"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">متن کامل مقاله</label>
            <textarea
              v-model="articleForm.content"
              rows="5"
              placeholder="پاراگراف‌های کامل مقاله..."
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="isArticleModalOpen = false"
          >
            انصراف
          </button>
          <button
            type="button"
            data-testid="save-draft-article-btn"
            class="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            @click="saveArticle(false)"
          >
            ذخیره به عنوان پیش‌نویس
          </button>
          <button
            type="button"
            data-testid="publish-article-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold cursor-pointer"
            @click="saveArticle(true)"
          >
            انتشار فوری در ژورنال
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
