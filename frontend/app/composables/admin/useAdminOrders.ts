// frontend/app/composables/admin/useAdminOrders.ts
import { toast } from 'vue-sonner'
import { mockOrders } from '../../../server/mock/orders'
import type {
  TrackOrderResponse,
  OrderStatus,
  CarrierInquiryResult,
} from '~/types/domain'

export type AdminOrderStatusTab = 'all' | 'processing' | 'shipped' | 'delivered' | 'archived'

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClass: string; step: number }
> = {
  pending: {
    label: 'در انتظار بررسی',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    step: 1,
  },
  registered: {
    label: 'در انتظار بررسی',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    step: 1,
  },
  processing: {
    label: 'در حال بسته‌بندی',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    step: 2,
  },
  shipped: {
    label: 'تحویل به پست / تیپاکس',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    step: 3,
  },
  handed_over: {
    label: 'ارسال با پست پیشتاز',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    step: 3,
  },
  delivered: {
    label: 'تحویل نهایی به مشتری',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    step: 4,
  },
  canceled: {
    label: 'لغو شده / انصراف',
    badgeClass: 'bg-rose-50 text-rose border-rose-200',
    step: 0,
  },
  returned: {
    label: 'مرجوعی',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    step: 0,
  },
}

export const PIPELINE_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'در انتظار پرداخت / بررسی' },
  { value: 'processing', label: 'تاییدشده و در حال بسته‌بندی' },
  { value: 'shipped', label: 'تحویل به پست / تیپاکس' },
  { value: 'delivered', label: 'تحویل نهایی به مشتری' },
  { value: 'canceled', label: 'لغو شده / انصراف' },
  { value: 'returned', label: 'مرجوعی' },
]

export const SHIPPING_CARRIERS = [
  { id: 'post', name: 'شرکت ملی پست (پیشتاز)', portalUrl: 'https://tracking.post.ir/?id=' },
  { id: 'tipax', name: 'تیپاکس (Tipax)', portalUrl: 'https://tipaxco.com/tracking?id=' },
  { id: 'courier', name: 'پیک اختصاصی آتلیه', portalUrl: '' },
] as const

const ordersList = ref<TrackOrderResponse[]>(
  JSON.parse(JSON.stringify(mockOrders)),
)

const activeStatusTab = ref<AdminOrderStatusTab>('all')
const searchQuery = ref('')
const carrierFilter = ref<string>('all')

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

export function useAdminOrders() {
  // فیلتر سفارش‌ها
  const filteredOrders = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const c = carrierFilter.value

    return ordersList.value.filter((order) => {
      // جستجو در فیلدهای مختلف
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.recipientName.toLowerCase().includes(q) ||
        (order.recipientPhone && order.recipientPhone.includes(q)) ||
        (order.trackingCode && order.trackingCode.toLowerCase().includes(q))

      // فیلتر تب وضعیت
      let matchesTab = true
      if (activeStatusTab.value === 'processing') {
        matchesTab =
          order.status === 'registered' ||
          order.status === 'processing' ||
          order.status === 'pending'
      } else if (activeStatusTab.value === 'shipped') {
        matchesTab = order.status === 'handed_over' || order.status === 'shipped'
      } else if (activeStatusTab.value === 'delivered') {
        matchesTab = order.status === 'delivered'
      } else if (activeStatusTab.value === 'archived') {
        matchesTab = order.status === 'canceled' || order.status === 'returned'
      }

      // فیلتر شرکت حمل
      let matchesCarrier = true
      if (c !== 'all') {
        if (c === 'post') {
          matchesCarrier = order.carrier.includes('پست')
        } else if (c === 'tipax') {
          matchesCarrier = order.carrier.toLowerCase().includes('تیپاکس') || order.carrier.toLowerCase().includes('tipax')
        } else if (c === 'courier') {
          matchesCarrier = order.carrier.includes('پیک')
        }
      }

      return matchesSearch && matchesTab && matchesCarrier
    })
  })

  // شمارنده‌های داینامیک تب‌ها
  const counts = computed(() => {
    let processing = 0
    let shipped = 0
    let delivered = 0
    let archived = 0

    for (const order of ordersList.value) {
      if (
        order.status === 'registered' ||
        order.status === 'processing' ||
        order.status === 'pending'
      ) {
        processing++
      } else if (order.status === 'handed_over' || order.status === 'shipped') {
        shipped++
      } else if (order.status === 'delivered') {
        delivered++
      } else if (order.status === 'canceled' || order.status === 'returned') {
        archived++
      }
    }

    return {
      all: ordersList.value.length,
      processing,
      shipped,
      delivered,
      archived,
    }
  })

  // تغییر مستقیم وضعیت با ثبت تاریخچه
  const updateStatus = (
    orderNumber: string,
    newStatus: OrderStatus,
    customNote?: string,
  ): boolean => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    order.status = newStatus
    const config = ORDER_STATUS_CONFIG[newStatus] || {
      label: newStatus,
      badgeClass: '',
      step: 0,
    }
    order.statusLabel = config.label

    const now = new Date()
    const faDate = now.toLocaleDateString('fa-IR')
    const faTime = now.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const timestampStr = `${faDate} - ${faTime}`

    // ثبت در تاریخچه سفارش
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

    toast.success(
      `وضعیت سفارش ${orderNumber} به «${config.label}» به‌روزرسانی شد.`,
    )
    return true
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
      return updateStatus(
        orderNumber,
        'shipped',
        'مرسوله جهت ارسال تحویل باجه پستی شد.',
      )
    } else if (order.status === 'handed_over' || order.status === 'shipped') {
      return updateStatus(
        orderNumber,
        'delivered',
        'مرسوله با امضای تحویل‌گیرنده تحویل داده شد.',
      )
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

  // صدور اتوماتیک بارکد از وب‌سرویس پستی و انتقال به وضعیت ارسال‌شده
  const dispatchShippingAPI = (
    orderNumber: string,
    carrierName: string = 'شرکت ملی پست (پیشتاز)',
  ): string => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return ''

    const carrierType = carrierName.includes('تیپاکس') ? 'tipax' : 'post'
    const newBarcode = generate24DigitBarcode(carrierType)

    order.trackingCode = newBarcode
    order.carrier = carrierName

    updateStatus(
      orderNumber,
      'shipped',
      `بارکد ۲۴ رقمی ${newBarcode} از وب‌سرویس پستی صادر و مرسوله به مامور جمع‌آوری تحویل شد.`,
    )

    toast.success(
      `وب‌سرویس پستی: بارکد ۲۴ رقمی ${newBarcode} با موفقیت صادر و وضعیت به «ارسال‌شده» تغییر یافت.`,
    )
    return newBarcode
  }

  // ثبت دستی بارکد رهگیری
  const setTrackingCode = (
    orderNumber: string,
    trackingCode: string,
    carrierName?: string,
  ): boolean => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    order.trackingCode = trackingCode.trim()
    if (carrierName) order.carrier = carrierName

    updateStatus(
      orderNumber,
      'shipped',
      `کد رهگیری مرسوله ثبت و سفارش به وضعیت ارسال‌شده منتقل شد.`,
    )

    toast.success(`کد رهگیری مرسوله ${orderNumber} با موفقیت ثبت شد.`)
    return true
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
      destination: order.shippingAddress.slice(0, 30) + '...',
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

    toast.info(
      `آخرین وضعیت پستی استعلام شد: ${inquiry.status}`,
    )
    return inquiry
  }

  // تولید متن پیامک ارسال مرسوله برای مشتری
  const generateCustomerSMS = (order: TrackOrderResponse): string => {
    const isTipax = order.carrier.includes('تیپاکس')
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

  const createManualOrder = (orderData?: Partial<TrackOrderResponse>) => {
    const num = Math.floor(1000 + Math.random() * 9000)
    const newOrder: TrackOrderResponse = {
      orderNumber: `KRS-${num}`,
      recipientName: orderData?.recipientName || 'سارا رادمنش',
      recipientPhone: orderData?.recipientPhone || '09121112233',
      shippingAddress:
        orderData?.shippingAddress ||
        'تهران، بلوار اندرزگو، خیابان سلیمی شمالی، ساختمان نگین، طبقه ۳',
      postalCode: '1965943211',
      totalAmount: orderData?.totalAmount || 3200000,
      status: 'pending',
      statusLabel: 'در انتظار بررسی',
      paymentMethod: 'کارت به کارت / فیش بانکی',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      trackingCode: '',
      carrier: 'شرکت ملی پست (پیشتاز)',
      estimatedDelivery: '۲ الی ۳ روز کاری',
      timeline: [
        {
          status: 'pending',
          title: 'ثبت سفارش دستی',
          description: 'سفارش دستی توسط مدیر سیستم در پنل ثبت گردید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: 'مرکز عملیات آتلیه کراس',
          completed: true,
        },
      ],
      items: orderData?.items || [
        {
          title: 'پالتو کشمیر لیمیتد آتلیه',
          size: 'M',
          color: 'مشکی زغالی',
          quantity: 1,
          price: 3200000,
          image:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        },
      ],
    }

    ordersList.value.unshift(newOrder)
    isManualOrderModalOpen.value = false
    toast.success(
      `سفارش دستی جدید به شماره ${newOrder.orderNumber} با موفقیت ثبت شد.`,
    )
    return newOrder
  }

  return {
    ordersList,
    activeStatusTab,
    searchQuery,
    carrierFilter,
    filteredOrders,
    counts,
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
