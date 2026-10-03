// frontend/app/composables/ops/useOpsOrders.ts
import { toast } from 'vue-sonner'
import { mockOrders } from '../../../server/mock/orders'
import { mockProducts } from '../../../server/mock/products'
import type { TrackOrderResponse } from '~/types/domain'

export interface ManualOrderItem {
  productId: number
  title: string
  size: string
  quantity: number
  price: number
  image: string
}

// وضعیت اشتراکی سفارش‌ها
const ordersList = ref<TrackOrderResponse[]>(
  JSON.parse(JSON.stringify(mockOrders)),
)

const orderStatusFilter = ref<
  'all' | 'registered' | 'processing' | 'handed_over' | 'delivered' | 'canceled'
>('all')
const orderSearchQuery = ref('')

// مودال بارکد پست
const isBarcodeModalOpen = ref(false)
const selectedOrderForBarcode = ref<TrackOrderResponse | null>(null)
const barcodeInput = ref('')

// مودال سفارش دستی
const isManualOrderModalOpen = ref(false)
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

// مودال برگ ارسال مرسوله پستی
const isPackingSlipModalOpen = ref(false)
const selectedSlipOrder = ref<TrackOrderResponse | null>(null)

export function useOpsOrders() {
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

  const addManualItem = (products?: { id: number; title: string; price: number; images?: { url: string }[] }[]) => {
    const list = Array.isArray(products) ? products : mockProducts
    const prod = list.find(
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

  const openManualOrderModal = (_firstProduct?: unknown) => {
    const p = mockProducts[0]
    if (p) {
      manualOrderItems.value = [
        {
          productId: p.id,
          title: p.title,
          size: 'M',
          quantity: 1,
          price: p.price,
          image: p.images?.[0]?.url || '',
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

  const openPackingSlip = (order: TrackOrderResponse) => {
    selectedSlipOrder.value = order
    isPackingSlipModalOpen.value = true
  }

  const triggerPrintSlip = () => {
    if (import.meta.client) {
      window.print()
    }
  }

  return {
    ordersList,
    orderStatusFilter,
    orderSearchQuery,
    filteredOrders,
    getStatusBadge,
    updateOrderStatus,
    isBarcodeModalOpen,
    selectedOrderForBarcode,
    barcodeInput,
    openBarcodeModal,
    generateSampleBarcode,
    submitBarcode,
    isManualOrderModalOpen,
    manualOrderCustomerMode,
    manualCustomerName,
    manualCustomerPhone,
    manualCustomerProvince,
    manualCustomerCity,
    manualCustomerAddress,
    manualPaymentMethod,
    manualOrderItems,
    manualSelectedProductId,
    manualSelectedSize,
    manualSelectedQty,
    addManualItem,
    removeManualItem,
    manualOrderTotal,
    openManualOrderModal,
    copyToClipboard,
    submitManualOrder,
    isPackingSlipModalOpen,
    selectedSlipOrder,
    openPackingSlip,
    triggerPrintSlip,
  }
}
