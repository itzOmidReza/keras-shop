// frontend/app/composables/ops/useAdminOrders.ts
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { mockOrders } from '../../../server/mock/orders'
import type { TrackOrderResponse, OrderStatus } from '~/types/domain'

export type AdminOrderStatusTab = 'all' | 'pending' | 'shipped' | 'completed'

const ordersList = ref<TrackOrderResponse[]>(
  JSON.parse(JSON.stringify(mockOrders)),
)

const activeStatusTab = ref<AdminOrderStatusTab>('all')
const searchQuery = ref('')

// دراور جزئیات سفارش
const isDetailDrawerOpen = ref(false)
const selectedOrderForDetail = ref<TrackOrderResponse | null>(null)

// مودال چاپ برگه ارسال (Packing Slip)
const isPackingSlipOpen = ref(false)
const selectedOrderForPackingSlip = ref<TrackOrderResponse | null>(null)

// مودال تخصیص بارکد (پشتیبانی از تست E2E)
const isBarcodeModalOpen = ref(false)
const selectedOrderForBarcode = ref<TrackOrderResponse | null>(null)

// مودال ثبت سفارش دستی
const isManualOrderModalOpen = ref(false)

export function useAdminOrders() {
  const filteredOrders = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return ordersList.value.filter((order) => {
      // فیلتر جستجو
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.recipientName.toLowerCase().includes(q) ||
        (order.recipientPhone && order.recipientPhone.includes(q)) ||
        (order.trackingCode && order.trackingCode.toLowerCase().includes(q))

      // فیلتر ۴ تب وضعیت
      let matchesTab = true
      if (activeStatusTab.value === 'pending') {
        matchesTab = order.status === 'registered' || order.status === 'processing'
      } else if (activeStatusTab.value === 'shipped') {
        matchesTab = order.status === 'handed_over'
      } else if (activeStatusTab.value === 'completed') {
        matchesTab = order.status === 'delivered' || order.status === 'canceled'
      }

      return matchesSearch && matchesTab
    })
  })

  // ارتقای وضعیت ۱ کلیکی
  const advanceOrderStatus = (orderNumber: string): boolean => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    if (order.status === 'registered' || order.status === 'processing') {
      order.status = 'handed_over'
      order.statusLabel = 'ارسال با پست پیشتاز'
      if (!order.trackingCode) {
        order.trackingCode = `18939${Math.floor(1000000000000000000 + Math.random() * 9000000000000000000)}`.slice(0, 24)
      }
      toast.success(`سفارش ${orderNumber} به مرحله ارسال منتقل شد.`)
      return true
    } else if (order.status === 'handed_over') {
      order.status = 'delivered'
      order.statusLabel = 'تحویل شده'
      toast.success(`سفارش ${orderNumber} به عنوان تحویل‌شده علامت‌گذاری شد.`)
      return true
    }
    return false
  }

  // ثبت یا ویرایش کد رهگیری پستی
  const setTrackingCode = (orderNumber: string, trackingCode: string): boolean => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    order.trackingCode = trackingCode.trim()
    order.status = 'handed_over'
    order.statusLabel = 'ارسال با پست پیشتاز'
    toast.success(`کد رهگیری مرسوله ${orderNumber} با موفقیت ثبت شد.`)
    return true
  }

  // تغییر وضعیت مستقیم
  const updateStatus = (orderNumber: string, newStatus: OrderStatus) => {
    const order = ordersList.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return

    order.status = newStatus
    if (newStatus === 'registered') order.statusLabel = 'در انتظار بررسی'
    else if (newStatus === 'processing') order.statusLabel = 'در حال بسته‌بندی'
    else if (newStatus === 'handed_over') order.statusLabel = 'ارسال با پست پیشتاز'
    else if (newStatus === 'delivered') order.statusLabel = 'تحویل شده'
    else if (newStatus === 'canceled') order.statusLabel = 'لغو شده'

    toast.info(`وضعیت سفارش ${orderNumber} تغییر یافت.`)
  }

  // دراور جزئیات
  const openOrderDetail = (order: TrackOrderResponse) => {
    selectedOrderForDetail.value = order
    isDetailDrawerOpen.value = true
  }

  const closeOrderDetail = () => {
    isDetailDrawerOpen.value = false
    selectedOrderForDetail.value = null
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
      shippingAddress: orderData?.shippingAddress || 'تهران، بلوار اندرزگو، خیابان سلیمی شمالی، ساختمان نگین، طبقه ۳',
      postalCode: '1965943211',
      totalAmount: orderData?.totalAmount || 3200000,
      status: 'registered',
      statusLabel: 'در انتظار بررسی',
      paymentMethod: 'کارت به کارت / فیش بانکی',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      trackingCode: '',
      carrier: 'پست پیشتاز سفارشی',
      estimatedDelivery: '۲ الی ۳ روز کاری',
      timeline: [
        {
          status: 'registered',
          title: 'ثبت سفارش دستی',
          description: 'سفارش دستی توسط مدیر سیستم در پنل ثبت گردید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
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
          image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        },
      ],
    }

    ordersList.value.unshift(newOrder)
    isManualOrderModalOpen.value = false
    toast.success(`سفارش دستی جدید به شماره ${newOrder.orderNumber} با موفقیت ثبت شد.`)
    return newOrder
  }

  return {
    ordersList,
    activeStatusTab,
    searchQuery,
    filteredOrders,
    isDetailDrawerOpen,
    selectedOrderForDetail,
    isPackingSlipOpen,
    selectedOrderForPackingSlip,
    isBarcodeModalOpen,
    selectedOrderForBarcode,
    isManualOrderModalOpen,
    advanceOrderStatus,
    setTrackingCode,
    updateStatus,
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
