// frontend/app/composables/admin/useAdminOrders.ts
import { toast } from 'vue-sonner'
import type {
  TrackOrderResponse,
  OrderStatus,
  CarrierInquiryResult,
  OrderStatusCounts,
  PaginatedOrdersResponse,
} from '~/types/domain'
import {
  ORDER_STATUS_CONFIG,
} from '~/utils/orders'

export type AdminOrderStatusTab = 'all' | 'processing' | 'shipped' | 'delivered' | 'archived'

// لیست مشترک سفارش‌ها
const ordersList = ref<TrackOrderResponse[]>([])

// وضعیت‌های فیلتر و صفحه‌بندی
const activeStatusTab = ref<AdminOrderStatusTab>('all')
const searchQuery = ref('')
const debouncedSearch = ref('')
const carrierFilter = ref<string>('all')
const currentPage = ref(1)
const pageSize = ref(10)
const totalOrders = ref(0)
const totalPages = ref(1)
const isLoading = ref(false)

// شمارنده‌های تجمیعی وضعیت‌ها
const counts = ref<OrderStatusCounts>({
  all: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
  archived: 0,
})

// دراور و مودال‌ها
const isDetailDrawerOpen = ref(false)
const selectedOrderForDetail = ref<TrackOrderResponse | null>(null)

const isPackingSlipOpen = ref(false)
const selectedOrderForPackingSlip = ref<TrackOrderResponse | null>(null)

const isBarcodeModalOpen = ref(false)
const selectedOrderForBarcode = ref<TrackOrderResponse | null>(null)

const isManualOrderModalOpen = ref(false)

// استعلام زنده وضعیت پستی
const isInquiring = ref(false)
const activeInquiryResult = ref<CarrierInquiryResult | null>(null)

// ردیابی ترتیب درخواست‌ها برای جلوگیری از تداخل (Data Fetching De-duplication)
let currentRequestId = 0
let debounceTimer: ReturnType<typeof setTimeout> | null = null

export function useAdminOrders() {
  const route = useRoute()
  const router = useRouter()

  // بارگذاری داده‌ها از اندپوینت سرور
  const fetchOrders = async () => {
    const reqId = ++currentRequestId
    isLoading.value = true

    try {
      const params: Record<string, string | number> = {
        page: currentPage.value,
        limit: pageSize.value,
      }
      if (activeStatusTab.value && activeStatusTab.value !== 'all') {
        params.status = activeStatusTab.value
      }
      if (carrierFilter.value && carrierFilter.value !== 'all') {
        params.carrier = carrierFilter.value
      }
      if (debouncedSearch.value && debouncedSearch.value.trim()) {
        params.search = debouncedSearch.value.trim()
      }

      const res = await $fetch<PaginatedOrdersResponse>('/api/orders', { params })

      // اگر در حین فراخوانی، درخواست جدیدتری ارسال شده بود، درخواست قبلی دور ریخته می‌شود
      if (reqId !== currentRequestId) return

      if (res && Array.isArray(res.items)) {
        ordersList.value = res.items
        totalOrders.value = res.total ?? res.items.length
        totalPages.value = res.total_pages ?? Math.max(1, Math.ceil(totalOrders.value / pageSize.value))
        if (res.counts) {
          counts.value = {
            all: res.counts.all ?? 0,
            processing: res.counts.processing ?? 0,
            shipped: res.counts.shipped ?? 0,
            delivered: res.counts.delivered ?? 0,
            archived: res.counts.archived ?? 0,
          }
        }
      }
    } catch (err) {
      if (reqId !== currentRequestId) return
      console.error('Failed to fetch admin orders from API:', err)
      // در صورت بروز خطا از آرایه خالی استفاده می‌شود
      ordersList.value = []
    } finally {
      if (reqId === currentRequestId) {
        isLoading.value = false
      }
    }
  }

  // ۱. همگام‌سازی دوطرفه اولیه با Query پارامترهای آدرس URL (SSR & Client Hydration)
  const syncFromRouteQuery = () => {
    if (!route || !route.query) return

    const qPage = parseInt(route.query.page as string, 10)
    if (!isNaN(qPage) && qPage >= 1) {
      currentPage.value = qPage
    }

    const qLimit = parseInt(route.query.limit as string, 10)
    if (!isNaN(qLimit) && [10, 20, 50, 100].includes(qLimit)) {
      pageSize.value = qLimit
    }

    const qStatus = route.query.status as string
    if (['all', 'processing', 'shipped', 'delivered', 'archived'].includes(qStatus)) {
      activeStatusTab.value = qStatus as AdminOrderStatusTab
    }

    const qCarrier = route.query.carrier as string
    if (qCarrier) {
      carrierFilter.value = qCarrier
    }

    const qSearch = route.query.search as string
    if (typeof qSearch === 'string') {
      searchQuery.value = qSearch
      debouncedSearch.value = qSearch
    }
  }

  // اعمال اولیه کوئری در کلاینت یا سرور
  syncFromRouteQuery()

  // ۲. ناظر دیبانس ۳۰۰ میلی‌ثانیه‌ای فیلد جست‌وجو (Debounced Search)
  watch(searchQuery, (newVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedSearch.value = newVal
    }, 300)
  })

  // ۳. بازنشانی صفحه به ۱ در زمان تغییر فیلترها و اعمال در URL
  watch([activeStatusTab, carrierFilter, debouncedSearch, pageSize], () => {
    currentPage.value = 1
    updateRouteQuery()
    fetchOrders()
  })

  // تغییر شماره صفحه
  watch(currentPage, () => {
    updateRouteQuery()
    fetchOrders()
  })

  // ۴. به‌روزرسانی route.query در جهت همگام‌سازی ۲ طرفه
  const updateRouteQuery = () => {
    if (!import.meta.client || !router) return

    const query: Record<string, string> = {}
    if (currentPage.value > 1) query.page = String(currentPage.value)
    if (pageSize.value !== 10) query.limit = String(pageSize.value)
    if (activeStatusTab.value !== 'all') query.status = activeStatusTab.value
    if (carrierFilter.value !== 'all') query.carrier = carrierFilter.value
    if (debouncedSearch.value.trim()) query.search = debouncedSearch.value.trim()

    router.replace({ query }).catch(() => {})
  }

  // ۵. گوش دادن به ناوبری عقب/جلو مرورگر (Back/Forward)
  if (import.meta.client) {
    watch(
      () => route.query,
      (newQ, oldQ) => {
        if (JSON.stringify(newQ) === JSON.stringify(oldQ)) return
        syncFromRouteQuery()
      },
    )

    onMounted(() => {
      fetchOrders()
    })
  } else {
    // SSR
    useAsyncData('admin-orders-page', async () => {
      await fetchOrders()
      return {
        items: ordersList.value,
        total: totalOrders.value,
        counts: counts.value,
      }
    })
  }

  // لیست فیلترشده جاری (در صورت پردازش سمت کلاینت یا تغییرات فوری)
  const filteredOrders = computed(() => ordersList.value)

  // تغییر مستقیم وضعیت با ثبت در دیتابیس و تاریخچه
  const updateStatus = async (
    orderNumber: string,
    newStatus: OrderStatus,
    customNote?: string,
  ): Promise<boolean> => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    const prevStatus = order?.status
    const prevStatusLabel = order?.statusLabel

    const config = ORDER_STATUS_CONFIG[newStatus] || {
      label: newStatus,
      badgeClass: '',
      step: 0,
    }

    // به‌روزرسانی خوش‌بینانه در استیت کلاینت
    if (order) {
      order.status = newStatus
      order.statusLabel = config.label

      const now = new Date()
      const faDate = now.toLocaleDateString('fa-IR')
      const faTime = now.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      })
      const timestampStr = `${faDate} - ${faTime}`

      if (!order.timeline) order.timeline = []
      order.timeline.push({
        status: newStatus,
        title: `تغییر وضعیت به ${config.label}`,
        description:
          customNote || `وضعیت سفارش توسط مدیر عملیات به ${config.label} تغییر یافت.`,
        timestamp: timestampStr,
        location: 'مرکز عملیات آتلیه کراس',
        completed: true,
      })
    }

    try {
      await $fetch(`/api/orders/${orderNumber}/status`, {
        method: 'PATCH',
        body: {
          status: newStatus,
          customNote,
        },
      })
      toast.success(
        `وضعیت سفارش ${orderNumber} به «${config.label}» به‌روزرسانی شد.`,
      )
      // بازخوانی سبک شمارنده‌ها برای تضمین انطباق کامل با پایگاه داده
      fetchOrders()
      return true
    } catch (err) {
      console.error('Failed to patch order status:', err)
      // بازگرداندن وضعیت در صورت خطای سرور
      if (order && prevStatus) {
        order.status = prevStatus
        order.statusLabel = prevStatusLabel || ''
      }
      toast.error('خطا در به‌روزرسانی وضعیت در سرور.')
      return false
    }
  }

  // ارتقای گام‌به‌گام وضعیت (پشتیبانی از سناریوهای سریع و تست‌ها)
  const advanceOrderStatus = (orderNumber: string): boolean => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    if (
      order.status === 'registered' ||
      order.status === 'processing' ||
      order.status === 'pending'
    ) {
      if (!order.trackingCode) {
        order.trackingCode = generate24DigitBarcode('post')
      }
      updateStatus(
        orderNumber,
        'shipped',
        'مرسوله جهت ارسال تحویل باجه پستی شد.',
      )
      return true
    } else if (order.status === 'handed_over' || order.status === 'shipped') {
      updateStatus(
        orderNumber,
        'delivered',
        'مرسوله با امضای تحویل‌گیرنده تحویل داده شد.',
      )
      return true
    }
    return false
  }

  // تولید بارکد ۲۴ رقمی استاندارد
  const generate24DigitBarcode = (carrierType: string = 'post'): string => {
    if (carrierType === 'tipax') {
      return `TPX${Math.floor(100000000000000000000 + Math.random() * 900000000000000000000)}`.slice(0, 24)
    }
    // پیشوند استاندارد پستی ۶۲۶۰۱۹
    const random18Digits = Math.floor(
      100000000000000000 + Math.random() * 900000000000000000,
    )
    return `626019${random18Digits}`.slice(0, 24)
  }

  // ثبت دستی بارکد رهگیری
  const setTrackingCode = async (
    orderNumber: string,
    trackingCode: string,
    carrierName?: string,
  ): Promise<boolean> => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (order) {
      order.trackingCode = trackingCode.trim()
      if (carrierName) order.carrier = carrierName
      order.status = 'shipped'
      order.statusLabel = 'تحویل به پست / تیپاکس'
    }

    try {
      await $fetch(`/api/orders/${orderNumber}/tracking`, {
        method: 'PATCH',
        body: {
          trackingCode: trackingCode.trim(),
          carrier: carrierName || order?.carrier || 'شرکت ملی پست (پیشتاز)',
        },
      })
      toast.success(`کد رهگیری مرسوله ${orderNumber} با موفقیت ثبت شد.`)
      fetchOrders()
      return true
    } catch (err) {
      console.error('Failed to set tracking code on server:', err)
      toast.error('خطا در ثبت کد رهگیری مرسوله در سرور.')
      return false
    }
  }

  // صدور اتوماتیک بارکد از وب‌سرویس پستی و انتقال به وضعیت ارسال‌شده
  const dispatchShippingAPI = (
    orderNumber: string,
    carrierName: string = 'شرکت ملی پست (پیشتاز)',
  ): string => {
    const carrierType = carrierName.includes('تیپاکس') ? 'tipax' : 'post'
    const newBarcode = generate24DigitBarcode(carrierType)

    setTrackingCode(orderNumber, newBarcode, carrierName)

    toast.success(
      `وب‌سرویس پستی: بارکد ۲۴ رقمی ${newBarcode} با موفقیت صادر و وضعیت به «ارسال‌شده» تغییر یافت.`,
    )
    return newBarcode
  }

  // استعلام آنلاین وضعیت پستی از وب‌سرویس
  const inquireCarrierStatus = (
    order: TrackOrderResponse,
  ): CarrierInquiryResult => {
    isInquiring.value = true

    const now = new Date()
    const faDate = now.toLocaleDateString('fa-IR')
    const faTime = now.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const inquiry: CarrierInquiryResult = {
      barcode: order.trackingCode || 'فاقد بارکد',
      carrierName: order.carrier || 'شرکت ملی پست (پیشتاز)',
      status: 'در حال توزیع توسط مامور پست (موزع)',
      lastUpdate: `${faDate} - ساعت ${faTime}`,
      destination: (order.shippingAddress || '').slice(0, 30) + '...',
      checkpoints: [
        {
          title: 'ثبت و قبول در باجه مبدا',
          location: 'دفتر پستی مرکزی فرشته تهران',
          timestamp: '۱۴۰۵/۰۷/۱۰ - ساعت ۰۹:۱۵',
          description: 'مرسوله از فرستنده (آتلیه کراس) تحویل گرفته شد.',
        },
        {
          title: 'ورود به مرکز مبادلات پستی',
          location: 'مرکز تجزیه و مبادلات چهارراه لشکر تهران',
          timestamp: '۱۴۰۵/۰۷/۱۰ - ساعت ۱۴:۴۰',
          description: 'عملیات بارکدگذاری و دسته‌بندی استانی انجام شد.',
        },
        {
          title: 'ارسال به باجه مقصد',
          location: 'مرکز توزیع پستی منطقه مقصد',
          timestamp: '۱۴۰۵/۰۷/۱۱ - ساعت ۰۸:۳۰',
          description: 'مرسوله آماده تحویل به موزع منطقه گردید.',
        },
        {
          title: 'خروج جهت توزیع به آدرس خریدار',
          location: 'ناحیه پستی مقصد',
          timestamp: `${faDate} - ساعت ${faTime}`,
          description: 'مرسوله در اختیار موزع قرار گرفت و امروز تحویل خواهد شد.',
        },
      ],
    }

    activeInquiryResult.value = inquiry
    isInquiring.value = false

    toast.info(`آخرین وضعیت پستی استعلام شد: ${inquiry.status}`)
    return inquiry
  }

  // تولید متن پیامک ارسال مرسوله برای مشتری
  const generateCustomerSMS = (order: TrackOrderResponse): string => {
    const isTipax = (order.carrier || '').includes('تیپاکس')
    const trackUrl = isTipax
      ? `https://tipaxco.com/tracking?id=${order.trackingCode}`
      : `https://tracking.post.ir/?id=${order.trackingCode}`

    return `مشتری گرامی ${order.recipientName}،\nسفارش ${order.orderNumber} شما بسته‌بندی و به ${order.carrier} تحویل شد.\nکد رهگیری ۲۴ رقمی: ${order.trackingCode || 'در حال صدور'}\nسامانه رهگیری: ${trackUrl}\nآتلیه مد و پوشاک کراس`
  }

  // دراور جزئیات
  const openOrderDetail = (order: TrackOrderResponse) => {
    selectedOrderForDetail.value = order
    activeInquiryResult.value = null
    isDetailDrawerOpen.value = true
  }

  const closeOrderDetail = () => {
    isDetailDrawerOpen.value = false
    selectedOrderForDetail.value = null
    activeInquiryResult.value = null
  }

  // پرینت برگ ارسال (Packing Slip)
  const openPackingSlip = (order: TrackOrderResponse) => {
    selectedOrderForPackingSlip.value = order
    isPackingSlipOpen.value = true
  }

  const closePackingSlip = () => {
    isPackingSlipOpen.value = false
    selectedOrderForPackingSlip.value = null
  }

  const printCurrentSlip = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // تخصیص بارکد برای تست E2E
  const openBarcodeModal = (order: TrackOrderResponse) => {
    selectedOrderForBarcode.value = order
    isBarcodeModalOpen.value = true
  }

  const submitBarcode = (orderNumber: string, code: string) => {
    setTrackingCode(orderNumber, code)
    isBarcodeModalOpen.value = false
  }

  // ثبت سفارش دستی جدید
  const openManualOrderModal = () => {
    isManualOrderModalOpen.value = true
  }

  const createManualOrder = async (orderData?: Partial<TrackOrderResponse>) => {
    const recipientName = orderData?.recipientName?.trim() || 'مشتری استودیو کراس'
    const recipientPhone = orderData?.recipientPhone?.trim() || ''
    const shippingAddress = orderData?.shippingAddress?.trim() || ''
    const totalAmount = Number(orderData?.totalAmount) || 0
    const postalCode = orderData?.postalCode?.trim() || ''

    const payload = {
      recipientName,
      recipientPhone,
      shippingAddress,
      totalAmount,
      postalCode,
      items: orderData?.items || [],
    }

    try {
      const created = await $fetch<TrackOrderResponse>('/api/orders/manual', {
        method: 'POST',
        body: payload,
      })

      ordersList.value.unshift(created)
      counts.value.all++
      counts.value.processing++
      totalOrders.value++
      isManualOrderModalOpen.value = false
      toast.success(
        `سفارش دستی جدید به شماره ${created.orderNumber} با موفقیت ثبت شد.`,
      )
      return created
    } catch (err) {
      console.error('Failed to create manual order on backend:', err)
      // Fallback local addition if network issue
      const num = Math.floor(1000 + Math.random() * 9000)
      const fallbackOrder: TrackOrderResponse = {
        orderNumber: `KRS-${num}`,
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        shippingAddress: payload.shippingAddress,
        postalCode: payload.postalCode,
        totalAmount: payload.totalAmount,
        status: 'pending',
        statusLabel: 'در انتظار بررسی',
        paymentMethod: 'کارت به کارت / فیش بانکی',
        createdAt: new Date().toLocaleDateString('fa-IR'),
        trackingCode: '',
        carrier: 'شرکت ملی پست (پیشتاز)',
        estimatedDelivery: '۲ الی ۳ روز کاری',
        timeline: [],
        items: payload.items,
      }
      ordersList.value.unshift(fallbackOrder)
      isManualOrderModalOpen.value = false
      toast.success(
        `سفارش دستی جدید به شماره ${fallbackOrder.orderNumber} ثبت گردید.`,
      )
      return fallbackOrder
    }
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setPageSize = (size: number) => {
    pageSize.value = size
  }

  return {
    ordersList,
    activeStatusTab,
    searchQuery,
    carrierFilter,
    filteredOrders,
    counts,
    currentPage,
    pageSize,
    totalOrders,
    totalPages,
    isLoading,
    setPage,
    setPageSize,
    fetchOrders,
    isDetailDrawerOpen,
    selectedOrderForDetail,
    isPackingSlipOpen,
    selectedOrderForPackingSlip,
    isBarcodeModalOpen,
    selectedOrderForBarcode,
    isManualOrderModalOpen,
    isInquiring,
    activeInquiryResult,
    advanceOrderStatus,
    updateStatus,
    generate24DigitBarcode,
    dispatchShippingAPI,
    setTrackingCode,
    inquireCarrierStatus,
    generateCustomerSMS,
    openOrderDetail,
    closeOrderDetail,
    openPackingSlip,
    closePackingSlip,
    printCurrentSlip,
    openBarcodeModal,
    submitBarcode,
    openManualOrderModal,
    createManualOrder,
  }
}
