<!-- frontend/app/pages/internal-ops-nexus/index.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  CreditCard,
  ShoppingCart,
  Percent,
  Truck,
  Boxes,
  TicketPercent,
  Users,
  Copy,
  Plus,
  RefreshCw,
  AlertTriangle,
  Search,
  Check,
  Send,
  SlidersHorizontal,
} from '@lucide/vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { useAuthStore } from '~/stores/auth'
import { formatToman, toFa, toEn } from '~/utils/format'
import { mockOrders } from '../../../server/mock/orders'
import type { TrackOrderResponse } from '~/types/domain'
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
  if (['analytics', 'fulfillment', 'inventory', 'vouchers', 'crm'].includes(v)) {
    return v
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
    color: 'amber',
  },
  {
    title: 'حاشیه سود خالص تخمینی (Net Margin)',
    amountText: '۳۴.۸٪',
    unit: 'سود برآوردی: ۱۴,۹۰۰,۰۰۰ تومان',
    growth: '+۲.۱٪',
    growthPositive: true,
    subtitle: 'پس از کسر هزینه تامین و دوخت',
    icon: Percent,
    color: 'emerald',
  },
  {
    title: 'میانگین ارزش هر سفارش (AOV)',
    amount: 2380000,
    unit: 'تومان',
    growth: '+۶.۲٪',
    growthPositive: true,
    subtitle: 'میانگین اقلام در هر فاکتور: ۲.۳ قلم',
    icon: CreditCard,
    color: 'sky',
  },
  {
    title: 'سبدهای خرید در جریان (Active Carts)',
    amountText: '۲۴ سبد',
    unit: 'نرخ نهایی‌سازی: ۴.۸٪',
    growth: '+۱۲٪',
    growthPositive: true,
    subtitle: 'تعداد مشتریان در مرحله پرداخت',
    icon: ShoppingCart,
    color: 'rose',
  },
]

const recentTransactions = [
  { id: 'TXN-90812', amount: 2850000, user: 'مهسا کامرانی', gateway: 'شاپرک (سامان)', time: '۱۰ دقیقه پیش', status: 'موفق' },
  { id: 'TXN-90811', amount: 1450000, user: 'سارا رادمنش', gateway: 'شاپرک (ملت)', time: '۲۵ دقیقه پیش', status: 'موفق' },
  { id: 'TXN-90810', amount: 4320000, user: 'نیلوفر رهنما', gateway: 'شاپرک (سامان)', time: '۱ ساعت پیش', status: 'موفق' },
  { id: 'TXN-90809', amount: 890000, user: 'فاطمه موسوی', gateway: 'شاپرک (پارسیان)', time: '۲ ساعت پیش', status: 'موفق' },
]

// -------------------------------------------------------------
// ۲. میز مدیریت سفارش‌ها و توزیع پستی (Order Fulfillment Desk)
// -------------------------------------------------------------
interface LocalOrder extends TrackOrderResponse {
  paymentStatus: 'paid' | 'pending' | 'failed'
}

const orders = ref<LocalOrder[]>([
  ...mockOrders.map((o) => ({
    ...o,
    paymentStatus: 'paid' as const,
  })),
  {
    orderNumber: 'KERAS-502118',
    createdAt: '2026-04-03T18:20:00Z',
    status: 'registered',
    statusLabel: 'ثبت و پرداخت تایید شده',
    recipientName: 'نگار رضایی',
    recipientPhone: '09127778899',
    shippingAddress: 'تهران، فرمانیه، خیابان سنبل، پلاک ۱۸، واحد ۴',
    trackingCode: '',
    carrier: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    estimatedDelivery: '۲ الی ۳ روز کاری',
    totalAmount: 3120000,
    paymentStatus: 'paid',
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'سفارش در سیستم ثبت شد و پرداخت آنلاین تایید گردید.',
        timestamp: '۱۴۰۵/۰۷/۱۲ - ۱۸:۲۰',
        location: 'سامانه مرکزی کراس',
        completed: true,
      },
    ],
    items: [
      {
        title: 'شومیز اسلپ لینن کارن',
        size: 'M',
        color: 'شیری صدف',
        quantity: 1,
        price: 2450000,
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    orderNumber: 'KERAS-619042',
    createdAt: '2026-04-03T19:40:00Z',
    status: 'processing',
    statusLabel: 'کنترل کیفیت و بسته‌بندی آتلیه',
    recipientName: 'الناز کریمی',
    recipientPhone: '09351239988',
    shippingAddress: 'اصفهان، خیابان چهارباغ بالا، کوچه نگار، ساختمان ترنج، واحد ۹',
    trackingCode: '',
    carrier: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    estimatedDelivery: '۳ الی ۴ روز کاری',
    totalAmount: 1890000,
    paymentStatus: 'paid',
    timeline: [
      {
        status: 'registered',
        title: 'ثبت و تأیید سفارش',
        description: 'پرداخت با موفقیت انجام شد.',
        timestamp: '۱۴۰۵/۰۷/۱۲ - ۱۹:۴۰',
        location: 'سامانه مرکزی',
        completed: true,
      },
      {
        status: 'processing',
        title: 'بسته‌بندی اختصاصی آتلیه',
        description: 'بسته‌بندی در جعبه پرمیوم با عطر ویژه کراس.',
        timestamp: '۱۴۰۵/۰۷/۱۲ - ۲۰:۱۰',
        location: 'استودیو طراحی تهران',
        completed: true,
      },
    ],
    items: [
      {
        title: 'شال ابریشم تویل کتیبه',
        size: 'Free',
        color: 'زرشکی کهن',
        quantity: 1,
        price: 1890000,
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
])

const orderSearch = ref('')
const orderStatusFilter = ref<string>('all')

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const search = orderSearch.value.trim()
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.recipientName.includes(search) ||
      Boolean(o.recipientPhone && o.recipientPhone.includes(toEn(search)))

    const matchesFilter =
      orderStatusFilter.value === 'all' || o.status === orderStatusFilter.value

    return matchesSearch && matchesFilter
  })
})

// تغییر سریع وضعیت سفارش
const updateOrderStatus = (order: LocalOrder, newStatus: LocalOrder['status']) => {
  order.status = newStatus
  const labels: Record<string, string> = {
    registered: 'ثبت و تایید شده',
    processing: 'در حال بسته‌بندی',
    handed_over: 'تحویل به پست پیشتاز',
    delivered: 'تحویل نهایی به خریدار',
    cancelled: 'لغو شده',
  }
  order.statusLabel = labels[newStatus] || newStatus
  toast.success(`وضعیت سفارش ${order.orderNumber} به «${order.statusLabel}» تغییر یافت.`)
}

// مودال تخصیص بارکد ۲۴ رقمی پست پیشتاز
const isBarcodeModalOpen = ref(false)
const selectedOrder = ref<LocalOrder | null>(null)
const barcodeInput = ref('')
const barcodeError = ref('')

const openBarcodeModal = (order: LocalOrder) => {
  selectedOrder.value = order
  barcodeInput.value = order.trackingCode || ''
  barcodeError.value = ''
  isBarcodeModalOpen.value = true
}

const generateSampleBarcode = () => {
  // ساخت بارکد نمونه ۲۴ رقمی پست ایران
  const prefix = '98234'
  const randomDigits = Math.floor(1000000000000000000 + Math.random() * 9000000000000000000).toString()
  barcodeInput.value = `${prefix}${randomDigits}`.slice(0, 24)
  barcodeError.value = ''
}

const handleSaveBarcode = () => {
  const cleanBarcode = toEn(barcodeInput.value.trim())
  if (!cleanBarcode || cleanBarcode.length !== 24 || !/^\d{24}$/.test(cleanBarcode)) {
    barcodeError.value = 'بارکد پست پیشتاز باید دقیقاً ۲۴ رقم باشد.'
    return
  }

  if (selectedOrder.value) {
    selectedOrder.value.trackingCode = cleanBarcode
    selectedOrder.value.status = 'handed_over'
    selectedOrder.value.statusLabel = 'تحویل به شرکت ملی پست'
    toast.success(`بارکد ۲۴ رقمی پستی برای سفارش ${selectedOrder.value.orderNumber} با موفقیت ثبت شد.`)
    isBarcodeModalOpen.value = false
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('کد رهگیری پستی در کلیپ‌بورد کپی شد.')
}

// -------------------------------------------------------------
// ۳. انبارداری و ماتریس سایز (Variant & Size Stock Matrix)
// -------------------------------------------------------------
interface ProductStockMatrix {
  id: number
  sku: string
  title: string
  category: string
  thumbnail: string
  stockS: number
  stockM: number
  stockL: number
  stockFree: number
}

const stockMatrix = ref<ProductStockMatrix[]>([
  {
    id: 1,
    sku: 'KRS-BL-101',
    title: 'شومیز اسلپ لینن کارن',
    category: 'شومیز و پیراهن',
    thumbnail: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=300&q=80',
    stockS: 2, // Low stock!
    stockM: 8,
    stockL: 5,
    stockFree: 0,
  },
  {
    id: 2,
    sku: 'KRS-CT-204',
    title: 'ترنچ‌کت پشمی دبل‌برست مرینو',
    category: 'کت و ترنچ‌کت',
    thumbnail: 'https://images.unsplash.com/photo-1544022613-e87ce7526edb?auto=format&fit=crop&w=300&q=80',
    stockS: 1, // Critical!
    stockM: 4,
    stockL: 2, // Low stock!
    stockFree: 0,
  },
  {
    id: 3,
    sku: 'KRS-KN-305',
    title: 'پلیور یقه اسکی کشمیر آلپاین',
    category: 'بافت و پلیور',
    thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80',
    stockS: 6,
    stockM: 9,
    stockL: 7,
    stockFree: 0,
  },
  {
    id: 4,
    sku: 'KRS-PT-402',
    title: 'شلوار واید لگ پشمی زارا فیت',
    category: 'شلوار و دامن',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
    stockS: 3, // Low stock!
    stockM: 6,
    stockL: 4,
    stockFree: 0,
  },
  {
    id: 5,
    sku: 'KRS-SC-501',
    title: 'شال ابریشم تویل کتیبه',
    category: 'اکسسوری',
    thumbnail: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=300&q=80',
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockFree: 3, // Low stock!
  },
  {
    id: 6,
    sku: 'KRS-BD-602',
    title: 'باندانا مینی ابریشمی نقوش فلورال',
    category: 'اکسسوری',
    thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    stockS: 0,
    stockM: 0,
    stockL: 0,
    stockFree: 14,
  },
])

const adjustStock = (item: ProductStockMatrix, sizeKey: 'stockS' | 'stockM' | 'stockL' | 'stockFree', delta: number) => {
  const current = item[sizeKey]
  if (current + delta < 0) return
  item[sizeKey] = current + delta
  toast.info(`موجودی SKU ${item.sku} به روز شد (${toFa(item[sizeKey])} عدد).`)
}

// -------------------------------------------------------------
// ۴. مدیریت کوپن‌ها و کدهای تخفیف (Discount Engine)
// -------------------------------------------------------------
interface VoucherItem {
  id: string
  code: string
  discountPercent: number
  usedCount: number
  maxUses: number
  isActive: boolean
  expiresAt: string
}

const vouchers = ref<VoucherItem[]>([
  {
    id: 'v_1',
    code: 'KERAS-PRO',
    discountPercent: 10,
    usedCount: 42,
    maxUses: 100,
    isActive: true,
    expiresAt: '۱۴۰۵/۰۸/۳۰',
  },
  {
    id: 'v_2',
    code: 'FALL1405',
    discountPercent: 15,
    usedCount: 128,
    maxUses: 500,
    isActive: true,
    expiresAt: '۱۴۰۵/۰۸/۱۵',
  },
  {
    id: 'v_3',
    code: 'VIP-GOLD',
    discountPercent: 20,
    usedCount: 18,
    maxUses: 50,
    isActive: true,
    expiresAt: '۱۴۰۵/۰۹/۳۰',
  },
  {
    id: 'v_4',
    code: 'ATELIER-DROP',
    discountPercent: 25,
    usedCount: 50,
    maxUses: 50,
    isActive: false,
    expiresAt: '۱۴۰۵/۰۷/۱۰ (منقضی شده)',
  },
])

const isNewVoucherModalOpen = ref(false)
const newVoucherCode = ref('')
const newVoucherDiscount = ref(10)
const newVoucherMaxUses = ref(100)

const handleCreateVoucher = () => {
  if (!newVoucherCode.value.trim()) {
    toast.error('لطفاً عنوان کد تخفیف را وارد کنید.')
    return
  }

  vouchers.value.unshift({
    id: `v_${Date.now()}`,
    code: newVoucherCode.value.trim().toUpperCase(),
    discountPercent: newVoucherDiscount.value,
    usedCount: 0,
    maxUses: newVoucherMaxUses.value,
    isActive: true,
    expiresAt: '۱۴۰۵/۰۹/۳۰',
  })

  toast.success(`کد تخفیف ${newVoucherCode.value.toUpperCase()} با موفقیت ایجاد گردید.`)
  newVoucherCode.value = ''
  isNewVoucherModalOpen.value = false
}

// -------------------------------------------------------------
// ۵. باشگاه مشتریان و CRM (Loyalty & VIP Customers)
// -------------------------------------------------------------
const vipCustomers = [
  { name: 'سارا رادمنش', phone: '09121112233', tier: 'الماس سیاه', ordersCount: 3, totalSpend: 9800000, lastOrder: '۲ روز پیش' },
  { name: 'نیلوفر صادقی', phone: '09123344556', tier: 'پلاتین آتلیه', ordersCount: 2, totalSpend: 6400000, lastOrder: '۴ روز پیش' },
  { name: 'مهسا یوسفی', phone: '09128899001', tier: 'طلایی کراس', ordersCount: 1, totalSpend: 3200000, lastOrder: '۱ هفته پیش' },
  { name: 'کیمیا شمس', phone: '09351112233', tier: 'طلایی کراس', ordersCount: 2, totalSpend: 4100000, lastOrder: '۲ هفته پیش' },
]
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- تب‌های بالای بوم برای سوییچ آسان نماها در هر اندازه صفحه -->
    <div class="flex items-center justify-between border-b border-ops-border pb-4 overflow-x-auto gap-2">
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          data-testid="tab-view-analytics"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          :class="currentView === 'analytics' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'bg-slate-900 text-slate-400 hover:text-white'"
          @click="switchView('analytics')"
        >
          <TrendingUp class="w-3.5 h-3.5" />
          <span>دیده‌بان مالی</span>
        </button>

        <button
          type="button"
          data-testid="tab-view-fulfillment"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          :class="currentView === 'fulfillment' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'bg-slate-900 text-slate-400 hover:text-white'"
          @click="switchView('fulfillment')"
        >
          <Truck class="w-3.5 h-3.5" />
          <span>میز سفارش‌ها و پست</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300">
            {{ toFa(orders.length) }}
          </span>
        </button>

        <button
          type="button"
          data-testid="tab-view-inventory"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          :class="currentView === 'inventory' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'bg-slate-900 text-slate-400 hover:text-white'"
          @click="switchView('inventory')"
        >
          <Boxes class="w-3.5 h-3.5" />
          <span>ماتریس موجودی</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-rose/20 text-rose font-bold">
            ۳ کسری
          </span>
        </button>

        <button
          type="button"
          data-testid="tab-view-vouchers"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          :class="currentView === 'vouchers' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'bg-slate-900 text-slate-400 hover:text-white'"
          @click="switchView('vouchers')"
        >
          <TicketPercent class="w-3.5 h-3.5" />
          <span>کدهای تخفیف</span>
        </button>

        <button
          type="button"
          data-testid="tab-view-crm"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          :class="currentView === 'crm' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'bg-slate-900 text-slate-400 hover:text-white'"
          @click="switchView('crm')"
        >
          <Users class="w-3.5 h-3.5" />
          <span>باشگاه مشتریان</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- ۱. بخش تحلیل مالی و دیدهبان کل (Analytics View) -->
    <!-- ========================================================= -->
    <section v-if="currentView === 'analytics'" class="space-y-8" data-testid="nexus-analytics-view">
      <!-- ۴ کارت شاخص کلیدی مالی -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="(kpi, index) in kpis"
          :key="index"
          class="rounded-3xl border border-ops-border bg-ops-surface p-5 shadow-2xs space-y-4 relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">{{ kpi.title }}</span>
            <div class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              <component :is="kpi.icon" class="w-4 h-4" />
            </div>
          </div>

          <div>
            <div class="text-2xl font-black text-white font-mono tracking-tight">
              <template v-if="kpi.amount">
                {{ formatToman(kpi.amount) }}
              </template>
              <template v-else>
                {{ kpi.amountText }}
              </template>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">{{ kpi.unit }}</p>
          </div>

          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span class="text-emerald-400 font-bold font-mono">{{ kpi.growth }}</span>
            <span class="text-slate-500 text-[10px]">{{ kpi.subtitle }}</span>
          </div>
        </div>
      </div>

      <!-- شبکه تفکیک درآمدی کالکشن‌ها و تراکنش‌های زنده شاپرک -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- نمودار سهم فروش کالکشن‌ها -->
        <div class="lg:col-span-6 rounded-3xl border border-ops-border bg-ops-surface p-6 space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal class="w-4 h-4 text-amber-400" />
              <span>ترکیب سهم فروش بر اساس دسته‌بندی</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">پاییز ۱۴۰۵</span>
          </div>

          <div class="space-y-4">
            <div class="space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-slate-300">پوشاک اصلی و ترنچ‌کت‌ها (Apparel)</span>
                <span class="font-bold text-white font-mono">۶۸٪ • ۲۹,۱۳۸,۰۰۰ تومان</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full" style="width: 68%" />
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-slate-300">اکسسوری، شال ابریشم و کلاچ (Accessories)</span>
                <span class="font-bold text-white font-mono">۲۶٪ • ۱۱,۱۴۱,۰۰۰ تومان</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div class="h-full bg-rose rounded-full" style="width: 26%" />
              </div>
            </div>

            <div class="space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-slate-300">خدمات بسته‌بندی هدیه و اکسپرس</span>
                <span class="font-bold text-white font-mono">۶٪ • ۲,۵۷۱,۰۰۰ تومان</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full" style="width: 6%" />
              </div>
            </div>
          </div>
        </div>

        <!-- آخرین تراکنش‌های موفق شاپرک -->
        <div class="lg:col-span-6 rounded-3xl border border-ops-border bg-ops-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard class="w-4 h-4 text-emerald-400" />
              <span>جریان تراکنش‌های برخط درگاه شاپرک</span>
            </h3>
            <span class="text-xs text-emerald-400 font-bold">۱۰۰٪ پایدار</span>
          </div>

          <div class="divide-y divide-slate-800/80">
            <div
              v-for="txn in recentTransactions"
              :key="txn.id"
              class="py-3 flex items-center justify-between text-xs"
            >
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-white">{{ txn.user }}</span>
                  <span class="text-[10px] font-mono text-slate-400">#{{ txn.id }}</span>
                </div>
                <p class="text-[10px] text-slate-400">{{ txn.gateway }} • {{ txn.time }}</p>
              </div>

              <div class="text-end space-y-0.5">
                <span class="font-mono font-bold text-amber-300 block">
                  {{ formatToman(txn.amount) }}
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                  {{ txn.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- ۲. میز مدیریت سفارش‌ها و توزیع پستی (Order Fulfillment Desk) -->
    <!-- ========================================================= -->
    <section v-if="currentView === 'fulfillment'" class="space-y-6" data-testid="nexus-fulfillment-view">
      <!-- نوار فیلتر و جستجوی سفارش‌ها -->
      <div class="rounded-3xl border border-ops-border bg-ops-surface p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="orderSearch"
            type="text"
            placeholder="جستجوی کد سفارش، خریدار یا شماره..."
            class="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 ps-10 pe-4 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          >
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            v-for="st in [
              { id: 'all', label: 'همه' },
              { id: 'registered', label: 'ثبت جدید' },
              { id: 'processing', label: 'بسته‌بندی' },
              { id: 'handed_over', label: 'تحویل پست' },
              { id: 'delivered', label: 'تحویل شده' },
            ]"
            :key="st.id"
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
            :class="orderStatusFilter === st.id ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 hover:text-white'"
            @click="orderStatusFilter = st.id"
          >
            {{ st.label }}
          </button>
        </div>
      </div>

      <!-- جدول سفارش‌ها -->
      <div class="rounded-3xl border border-ops-border bg-ops-surface overflow-hidden shadow-2xs">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-ops-border font-bold">
              <tr>
                <th class="p-4 text-start">کد سفارش</th>
                <th class="p-4 text-start">خریدار و نشانی</th>
                <th class="p-4 text-start">مبلغ فاکتور</th>
                <th class="p-4 text-start">وضعیت سفارش</th>
                <th class="p-4 text-start">بارکد ۲۴ رقمی پست</th>
                <th class="p-4 text-start">اقدام سریع</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-200">
              <tr
                v-for="order in filteredOrders"
                :key="order.orderNumber"
                class="hover:bg-slate-900/40 transition-colors"
              >
                <!-- کد سفارش -->
                <td class="p-4 font-mono font-bold text-amber-300">
                  {{ order.orderNumber }}
                </td>

                <!-- اطلاعات خریدار -->
                <td class="p-4 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-white">{{ order.recipientName }}</span>
                    <span class="text-[11px] text-slate-400 font-mono">{{ toFa(order.recipientPhone || '') }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{{ order.shippingAddress }}</p>
                </td>

                <!-- مبلغ فاکتور -->
                <td class="p-4 font-mono font-bold text-white">
                  {{ formatToman(order.totalAmount) }}
                </td>

                <!-- وضعیت سفارش -->
                <td class="p-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold inline-block"
                    :class="{
                      'bg-amber-500/15 text-amber-300 border border-amber-500/30': order.status === 'registered',
                      'bg-sky-500/15 text-sky-300 border border-sky-500/30': order.status === 'processing',
                      'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30': order.status === 'handed_over',
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30': order.status === 'delivered',
                    }"
                  >
                    {{ order.statusLabel }}
                  </span>
                </td>

                <!-- بارکد پستی -->
                <td class="p-4">
                  <div v-if="order.trackingCode" class="flex items-center gap-1.5">
                    <span class="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {{ order.trackingCode.slice(0, 8) }}...{{ order.trackingCode.slice(-4) }}
                    </span>
                    <button
                      type="button"
                      class="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      title="کپی بارکد"
                      @click="copyToClipboard(order.trackingCode)"
                    >
                      <Copy class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span v-else class="text-slate-500 text-[11px]">صادر نشده</span>
                </td>

                <!-- اقدام‌ها -->
                <td class="p-4">
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-testid="assign-barcode-btn"
                      class="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                      @click="openBarcodeModal(order)"
                    >
                      <Truck class="w-3 h-3" />
                      <span>تخصیص بارکد</span>
                    </button>

                    <!-- دکمه پیشرفت وضعیت ۱-کلیک -->
                    <button
                      v-if="order.status === 'registered'"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                      @click="updateOrderStatus(order, 'processing')"
                    >
                      بسته‌بندی
                    </button>
                    <button
                      v-else-if="order.status === 'processing'"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[11px] cursor-pointer"
                      @click="updateOrderStatus(order, 'handed_over')"
                    >
                      تحویل پست
                    </button>
                    <button
                      v-else-if="order.status === 'handed_over'"
                      type="button"
                      class="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[11px] cursor-pointer"
                      @click="updateOrderStatus(order, 'delivered')"
                    >
                      تحویل شد
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- ۳. انبارداری و ماتریس موجودی سایز (Inventory Matrix) -->
    <!-- ========================================================= -->
    <section v-if="currentView === 'inventory'" class="space-y-6" data-testid="nexus-inventory-view">
      <!-- بنر هشدار کسری بحرانی موجودی -->
      <div class="rounded-3xl border border-rose/30 bg-rose/10 p-5 flex items-center justify-between text-xs">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-rose/20 text-rose flex items-center justify-center font-bold">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-white">۳ ردیف از محصولات پاییز در آستانه اتمام موجودی هستند</h4>
            <p class="text-slate-400 mt-0.5">موجودی سایزهای S و M ترنچ‌کت و شومیز اسلپ زیر حد مجاز ۳ عدد قرار دارد.</p>
          </div>
        </div>

        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-rose text-white font-bold text-xs hover:bg-rose/90 transition-all cursor-pointer"
          @click="toast.info('درخواست دوخت فوری به کارگاه خیاطی آتلیه ارسال شد.')"
        >
          دستور دوخت فوری کارگاه
        </button>
      </div>

      <!-- جدول ماتریس موجودی -->
      <div class="rounded-3xl border border-ops-border bg-ops-surface overflow-hidden shadow-2xs">
        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-ops-border font-bold">
              <tr>
                <th class="p-4 text-start">مشخصات محصول</th>
                <th class="p-4 text-start">کد SKU</th>
                <th class="p-4 text-center">سایز Small</th>
                <th class="p-4 text-center">سایز Medium</th>
                <th class="p-4 text-center">سایز Large</th>
                <th class="p-4 text-center">سایز Free</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80 text-slate-200">
              <tr
                v-for="item in stockMatrix"
                :key="item.id"
                class="hover:bg-slate-900/40 transition-colors"
              >
                <!-- محصول -->
                <td class="p-4 flex items-center gap-3">
                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-10 h-12 rounded-lg object-cover border border-slate-800"
                  >
                  <div>
                    <h5 class="font-bold text-white text-xs">{{ item.title }}</h5>
                    <p class="text-[10px] text-slate-400">{{ item.category }}</p>
                  </div>
                </td>

                <!-- SKU -->
                <td class="p-4 font-mono font-bold text-slate-300">
                  {{ item.sku }}
                </td>

                <!-- سایز Small -->
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockS', -1)"
                    >-</button>
                    <span class="font-mono font-bold text-sm w-6 text-center" :class="{ 'text-rose': item.stockS <= 3 }">
                      {{ toFa(item.stockS) }}
                    </span>
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockS', 1)"
                    >+</button>
                  </div>
                  <div v-if="item.stockS > 0 && item.stockS <= 3" class="mt-1">
                    <span class="px-1.5 py-0.5 rounded text-[9px] bg-rose/15 text-rose border border-rose/30 font-bold inline-block">
                      کسری انبار
                    </span>
                  </div>
                </td>

                <!-- سایز Medium -->
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockM', -1)"
                    >-</button>
                    <span class="font-mono font-bold text-sm w-6 text-center" :class="{ 'text-rose': item.stockM <= 3 }">
                      {{ toFa(item.stockM) }}
                    </span>
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockM', 1)"
                    >+</button>
                  </div>
                </td>

                <!-- سایز Large -->
                <td class="p-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockL', -1)"
                    >-</button>
                    <span class="font-mono font-bold text-sm w-6 text-center" :class="{ 'text-rose': item.stockL <= 3 }">
                      {{ toFa(item.stockL) }}
                    </span>
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockL', 1)"
                    >+</button>
                  </div>
                  <div v-if="item.stockL > 0 && item.stockL <= 3" class="mt-1">
                    <span class="px-1.5 py-0.5 rounded text-[9px] bg-rose/15 text-rose border border-rose/30 font-bold inline-block">
                      کسری انبار
                    </span>
                  </div>
                </td>

                <!-- سایز Free -->
                <td class="p-4 text-center">
                  <div v-if="item.category === 'اکسسوری'" class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockFree', -1)"
                    >-</button>
                    <span class="font-mono font-bold text-sm w-6 text-center" :class="{ 'text-rose': item.stockFree <= 3 }">
                      {{ toFa(item.stockFree) }}
                    </span>
                    <button
                      type="button"
                      class="w-6 h-6 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
                      @click="adjustStock(item, 'stockFree', 1)"
                    >+</button>
                  </div>
                  <span v-else class="text-slate-600">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- ۴. کمپین‌ها و کدهای تخفیف (Discount Vouchers Engine) -->
    <!-- ========================================================= -->
    <section v-if="currentView === 'vouchers'" class="space-y-6" data-testid="nexus-vouchers-view">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-white">مدیریت موتور کدهای تخفیف و پروموشن‌ها</h3>
          <p class="text-xs text-slate-400 mt-1">ایجاد کوپن، پایش سقف استفاده و فعال‌سازی فوری در سبد خرید.</p>
        </div>

        <button
          type="button"
          data-testid="create-voucher-btn"
          class="h-10 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          @click="isNewVoucherModalOpen = true"
        >
          <Plus class="w-4 h-4" />
          <span>کد تخفیف جدید</span>
        </button>
      </div>

      <!-- جدول کدهای تخفیف -->
      <div class="rounded-3xl border border-ops-border bg-ops-surface overflow-hidden shadow-2xs">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-ops-border font-bold">
            <tr>
              <th class="p-4 text-start">کد تخفیف</th>
              <th class="p-4 text-start">میزان تخفیف</th>
              <th class="p-4 text-start">دفعات مصرف شده / سقف</th>
              <th class="p-4 text-start">تاریخ انقضا</th>
              <th class="p-4 text-start">وضعیت فعال</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-200">
            <tr
              v-for="v in vouchers"
              :key="v.id"
              class="hover:bg-slate-900/40 transition-colors"
            >
              <td class="p-4 font-mono font-black text-amber-300 text-sm">
                {{ v.code }}
              </td>
              <td class="p-4 font-bold text-white font-mono">
                {{ toFa(v.discountPercent) }}٪
              </td>
              <td class="p-4 space-y-1">
                <div class="flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span>{{ toFa(v.usedCount) }} از {{ toFa(v.maxUses) }}</span>
                  <span>{{ toFa(Math.round((v.usedCount / v.maxUses) * 100)) }}٪</span>
                </div>
                <div class="w-32 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    class="h-full bg-amber-500 rounded-full"
                    :style="{ width: `${(v.usedCount / v.maxUses) * 100}%` }"
                  />
                </div>
              </td>
              <td class="p-4 text-slate-400 font-mono text-[11px]">
                {{ v.expiresAt }}
              </td>
              <td class="p-4">
                <button
                  type="button"
                  class="px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer"
                  :class="v.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-500 border border-slate-800'"
                  @click="v.isActive = !v.isActive; toast.info(`وضعیت کوپن ${v.code} به‌روز شد.`)"
                >
                  {{ v.isActive ? 'فعال' : 'غیرفعال' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- ۵. باشگاه مشتریان و CRM (Customer Loyalty View) -->
    <!-- ========================================================= -->
    <section v-if="currentView === 'crm'" class="space-y-6" data-testid="nexus-crm-view">
      <div>
        <h3 class="text-base font-bold text-white">باشگاه مشتریان و سطوح وفاداری کراس</h3>
        <p class="text-xs text-slate-400 mt-1">مدیریت مشتریان VIP و تسهیلات دراپ‌های اختصاصی آتلیه.</p>
      </div>

      <!-- کارت‌های سطح باشگاه -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-3xl border border-ops-border bg-ops-surface space-y-2">
          <span class="text-[11px] font-bold text-amber-400 block">سطح ۱ • الماس سیاه</span>
          <p class="text-xs text-slate-300">خریدهای بالای ۲۰ میلیون تومان</p>
          <p class="text-[11px] text-slate-500">تخفیف دائم ۲۰٪ + ارسال VIP اختصاصی</p>
        </div>
        <div class="p-5 rounded-3xl border border-ops-border bg-ops-surface space-y-2">
          <span class="text-[11px] font-bold text-slate-200 block">سطح ۲ • پلاتین آتلیه</span>
          <p class="text-xs text-slate-300">خریدهای بین ۱۰ تا ۲۰ میلیون</p>
          <p class="text-[11px] text-slate-500">تخفیف دائم ۱۵٪ + بسته‌بندی هدیه</p>
        </div>
        <div class="p-5 rounded-3xl border border-ops-border bg-ops-surface space-y-2">
          <span class="text-[11px] font-bold text-amber-500 block">سطح ۳ • طلایی کراس</span>
          <p class="text-xs text-slate-300">خریدهای بین ۳ تا ۱۰ میلیون</p>
          <p class="text-[11px] text-slate-500">تخفیف دائم ۱۰٪ + ارسال رایگان</p>
        </div>
        <div class="p-5 rounded-3xl border border-ops-border bg-ops-surface space-y-2">
          <span class="text-[11px] font-bold text-slate-400 block">سطح ۴ • نقره‌ای پایه</span>
          <p class="text-xs text-slate-300">ورود و عضویت رسمی</p>
          <p class="text-[11px] text-slate-500">کوپن ۱۰٪ خوش‌آمدگویی</p>
        </div>
      </div>

      <!-- جدول مشتریان VIP -->
      <div class="rounded-3xl border border-ops-border bg-ops-surface overflow-hidden shadow-2xs">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-ops-border font-bold">
            <tr>
              <th class="p-4 text-start">نام مشتری</th>
              <th class="p-4 text-start">شماره تماس</th>
              <th class="p-4 text-start">سطح عضویت</th>
              <th class="p-4 text-start">تعداد سفارش‌ها</th>
              <th class="p-4 text-start">مجموع خرید (LTV)</th>
              <th class="p-4 text-start">آخرین فعالیت</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/80 text-slate-200">
            <tr
              v-for="c in vipCustomers"
              :key="c.phone"
              class="hover:bg-slate-900/40 transition-colors"
            >
              <td class="p-4 font-bold text-white">
                {{ c.name }}
              </td>
              <td class="p-4 font-mono text-slate-400">
                {{ toFa(c.phone) }}
              </td>
              <td class="p-4">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {{ c.tier }}
                </span>
              </td>
              <td class="p-4 font-mono font-bold">
                {{ toFa(c.ordersCount) }}
              </td>
              <td class="p-4 font-mono font-bold text-amber-300">
                {{ formatToman(c.totalSpend) }}
              </td>
              <td class="p-4 text-slate-400">
                {{ c.lastOrder }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- دیالوگ تخصیص بارکد ۲۴ رقمی پست پیشتاز -->
    <Dialog :open="isBarcodeModalOpen" @update:open="(val: boolean) => !val && (isBarcodeModalOpen = false)">
      <DialogContent class="max-w-md rounded-3xl border border-ops-border bg-ops-surface p-6 text-slate-100 shadow-2xl" dir="rtl">
        <DialogHeader class="space-y-2 text-start">
          <DialogTitle class="text-base font-bold text-white flex items-center gap-2">
            <Truck class="w-4 h-4 text-amber-400" />
            <span>تخصیص بارکد ۲۴ رقمی شرکت ملی پست</span>
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-400 leading-relaxed">
            برای سفارش <span class="font-mono text-amber-300 font-bold">{{ selectedOrder?.orderNumber }}</span> بارکد رسمی پست پیشتاز را درج نمایید.
          </DialogDescription>
        </DialogHeader>

        <div class="mt-4 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>بارکد ۲۴ رقمی پست</span>
              <span class="text-[10px] text-slate-500 font-mono">طول استاندارد: ۲۴ رقم</span>
            </label>
            <input
              v-model="barcodeInput"
              type="text"
              maxlength="24"
              dir="ltr"
              placeholder="982341908234123456789012"
              class="w-full h-11 rounded-xl bg-slate-900 border border-slate-800 px-3.5 text-sm font-mono text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none text-start"
            >
            <p v-if="barcodeError" class="text-[11px] text-rose font-medium pt-1">
              {{ barcodeError }}
            </p>
          </div>

          <!-- دکمه تولید بارکد تستی -->
          <button
            type="button"
            class="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            @click="generateSampleBarcode"
          >
            <RefreshCw class="w-3.5 h-3.5" />
            <span>تولید بارکد ۲۴ رقمی نمونه برای تست</span>
          </button>

          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              @click="isBarcodeModalOpen = false"
            >
              انصراف
            </button>

            <button
              type="button"
              data-testid="submit-barcode-btn"
              class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
              @click="handleSaveBarcode"
            >
              <Check class="w-4 h-4" />
              <span>ثبت و تحویل به باجه پست</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- دیالوگ ایجاد کد تخفیف جدید -->
    <Dialog :open="isNewVoucherModalOpen" @update:open="(val: boolean) => !val && (isNewVoucherModalOpen = false)">
      <DialogContent class="max-w-md rounded-3xl border border-ops-border bg-ops-surface p-6 text-slate-100 shadow-2xl" dir="rtl">
        <DialogHeader class="space-y-2 text-start">
          <DialogTitle class="text-base font-bold text-white flex items-center gap-2">
            <TicketPercent class="w-4 h-4 text-amber-400" />
            <span>ایجاد کد تخفیف و کمپین جدید</span>
          </DialogTitle>
          <DialogDescription class="text-xs text-slate-400">
            مشخصات کد تخفیف و درصد اعمال روی سبد خرید را تعیین کنید.
          </DialogDescription>
        </DialogHeader>

        <form class="mt-4 space-y-4" @submit.prevent="handleCreateVoucher">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">عنوان کد تخفیف (لاتین)</label>
            <input
              v-model="newVoucherCode"
              type="text"
              placeholder="مثال: WINTER-VIP"
              dir="ltr"
              class="w-full h-11 rounded-xl bg-slate-900 border border-slate-800 px-3.5 text-sm font-mono text-white placeholder:text-slate-600 focus:border-amber-500 focus:outline-none uppercase text-start"
            >
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">درصد تخفیف</label>
              <input
                v-model.number="newVoucherDiscount"
                type="number"
                min="1"
                max="90"
                class="w-full h-11 rounded-xl bg-slate-900 border border-slate-800 px-3.5 text-sm font-mono text-white focus:border-amber-500 focus:outline-none text-start"
              >
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">سقف مجاز مصرف</label>
              <input
                v-model.number="newVoucherMaxUses"
                type="number"
                min="1"
                class="w-full h-11 rounded-xl bg-slate-900 border border-slate-800 px-3.5 text-sm font-mono text-white focus:border-amber-500 focus:outline-none text-start"
              >
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              @click="isNewVoucherModalOpen = false"
            >
              انصراف
            </button>

            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <Send class="w-4 h-4" />
              <span>ایجاد و فعال‌سازی فوری</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
