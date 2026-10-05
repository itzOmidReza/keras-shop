// frontend/app/composables/ops/useOpsFulfillmentDesk.ts
import { toast } from 'vue-sonner'
import { useOpsOrders } from '~/composables/ops/useOpsOrders'
import { CARRIER_CONFIGS, type CarrierType, type FreightPaymentMode } from '~/composables/ops/useOpsShippingManifest'
import type { TrackOrderResponse } from '~/types/domain'

export type FulfillmentStage = 'registered' | 'picking' | 'packing' | 'shipped' | 'delivered'
export type DispatchShift = 'morning' | 'evening'

export interface FulfillmentItem {
  id?: number | string
  sku: string
  barcode: string
  title: string
  color: string
  colorHex?: string
  size: string
  quantity: number
  price: number
  image: string
  scanned?: boolean
  qcPassed?: boolean
}

export interface SizeExchangeEntry {
  id: string
  requestedAt: string
  originalItem: string
  oldSize: string
  newSize: string
  status: 'requested' | 'inspected' | 'dispatched'
  exchangeTrackingCode?: string
  note?: string
}

export interface FulfillmentOrder extends Omit<TrackOrderResponse, 'items'> {
  stage: FulfillmentStage
  carrierType: CarrierType
  freightMode: FreightPaymentMode
  shift: DispatchShift
  weightGrams: number
  postalCode?: string
  isDelayed?: boolean
  delayedDays?: number
  items: FulfillmentItem[]
  exchangeHistory?: SizeExchangeEntry[]
  qcChecklist?: {
    fabricClean: boolean
    seamsIntact: boolean
    hangtagSealed: boolean
  }
}

export interface WavePickingRow {
  key: string
  title: string
  color: string
  size: string
  sku: string
  image: string
  totalQuantity: number
  orderNumbers: string[]
  pickedQuantity: number
  isCompleted: boolean
}

// وضعیت اشتراکی میز پردازش سفارش‌ها
const viewMode = ref<'table' | 'kanban'>('table')
const activeStatusTab = ref<string>('all')
const selectedShift = ref<'all' | 'morning' | 'evening'>('all')
const selectedCarrierFilter = ref<string>('all')
const deskSearchQuery = ref('')

// مدیریت چندانتخابی سفارش‌ها (Multi-Selection)
const selectedOrderIds = ref<string[]>([])

// دراور و مودال‌های میز پردازش
const isDrawerOpen = ref(false)
const selectedOrderForDrawer = ref<FulfillmentOrder | null>(null)

const isWavePickingOpen = ref(false)
const isScanToPackOpen = ref(false)
const isExchangeModalOpen = ref(false)
const selectedItemForExchange = ref<{ order: FulfillmentOrder, item: FulfillmentItem } | null>(null)

export function useOpsFulfillmentDesk() {
  const { ordersList } = useOpsOrders()

  // تضمین وجود مقادیر غنی لجستیکی روی تک‌تک سفارش‌ها
  const enrichOrder = (order: TrackOrderResponse, index: number): FulfillmentOrder => {
    const raw = order as unknown as FulfillmentOrder

    // نگاشت وضعیت خام به استیج لجستیک
    let defaultStage: FulfillmentStage = 'registered'
    if (order.status === 'registered') defaultStage = 'registered'
    else if (order.status === 'processing') defaultStage = index % 2 === 0 ? 'picking' : 'packing'
    else if (order.status === 'handed_over') defaultStage = 'shipped'
    else if (order.status === 'delivered') defaultStage = 'delivered'

    if (!raw.stage) raw.stage = defaultStage
    if (!raw.carrierType) raw.carrierType = index % 3 === 0 ? 'tipax' : index % 4 === 0 ? 'courier' : 'post'
    if (!raw.freightMode) raw.freightMode = index % 3 === 0 ? 'cod' : 'prepaid'
    if (!raw.shift) raw.shift = index % 2 === 0 ? 'morning' : 'evening'
    if (!raw.weightGrams) raw.weightGrams = 450 + (index * 120) % 800
    if (!raw.postalCode) raw.postalCode = `19659${Math.floor(10000 + Math.random() * 90000)}`

    // سفارش‌های نمونه با تاخیر بیش از ۴ روز برای سنتینل تاخیر
    if (raw.isDelayed === undefined) {
      raw.isDelayed = index === 1 // سفارش دوم را دارای تاخیر ۴ روزه قرار می‌دهیم
      raw.delayedDays = raw.isDelayed ? 5 : 0
    }

    if (!raw.items) raw.items = []
    raw.items = raw.items.map((item, itemIdx) => ({
      ...item,
      sku: item.sku || `KERAS-${order.orderNumber.replace(/\D/g, '') || 'ITEM'}-${item.size}-${itemIdx + 1}`,
      barcode: item.barcode || `62600${Math.floor(10000000 + Math.random() * 90000000)}`,
      color: item.color || 'مشکی زغالی',
      scanned: item.scanned || false,
      qcPassed: item.qcPassed || false,
    }))

    if (!raw.qcChecklist) {
      raw.qcChecklist = {
        fabricClean: raw.stage === 'shipped' || raw.stage === 'delivered',
        seamsIntact: raw.stage === 'shipped' || raw.stage === 'delivered',
        hangtagSealed: raw.stage === 'shipped' || raw.stage === 'delivered',
      }
    }

    return raw
  }

  // فهرست غنی‌شده سفارش‌های میز
  const enrichedOrders = computed<FulfillmentOrder[]>(() => {
    return ordersList.value.map((o, idx) => enrichOrder(o, idx))
  })

  // فیلتر چندمعیاره سفارش‌ها
  const filteredDeskOrders = computed<FulfillmentOrder[]>(() => {
    const q = deskSearchQuery.value.trim().toLowerCase()
    return enrichedOrders.value.filter((order) => {
      // جستجوی متنی
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.recipientName.toLowerCase().includes(q) ||
        (order.recipientPhone && order.recipientPhone.includes(q)) ||
        (order.trackingCode && order.trackingCode.toLowerCase().includes(q)) ||
        order.items.some((i) => i.title.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))

      // فیلتر نوبت توزیع
      const matchesShift = selectedShift.value === 'all' || order.shift === selectedShift.value

      // فیلتر شرکت حمل
      const matchesCarrier = selectedCarrierFilter.value === 'all' || order.carrierType === selectedCarrierFilter.value

      // فیلتر وضعیت / تاخیر
      const matchesStatus =
        activeStatusTab.value === 'all'
          ? true
          : activeStatusTab.value === 'delayed'
            ? Boolean(order.isDelayed)
            : order.stage === activeStatusTab.value

      return matchesSearch && matchesShift && matchesCarrier && matchesStatus
    })
  })

  // ستون‌های ۵گانه بورد کانبان
  const kanbanColumns = computed(() => {
    const list = filteredDeskOrders.value
    return {
      registered: {
        id: 'registered',
        title: 'ثبت جدید',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        orders: list.filter((o) => o.stage === 'registered'),
      },
      picking: {
        id: 'picking',
        title: 'در حال انبارداری',
        badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
        orders: list.filter((o) => o.stage === 'picking'),
      },
      packing: {
        id: 'packing',
        title: 'بسته‌بندی و QC',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        orders: list.filter((o) => o.stage === 'packing'),
      },
      shipped: {
        id: 'shipped',
        title: 'تحویل به پست/پیک',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        orders: list.filter((o) => o.stage === 'shipped'),
      },
      delivered: {
        id: 'delivered',
        title: 'تحویل نهایی',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        orders: list.filter((o) => o.stage === 'delivered'),
      },
    }
  })

  // تولید لیست تجمیعی گردآوری موجی (Wave Picking)
  const wavePickingRows = computed<WavePickingRow[]>(() => {
    // اگر سفارش‌هایی تیک خورده باشند فقط آن‌ها، در غیر این صورت سفارش‌های مرحله registered و picking
    const targetOrders = selectedOrderIds.value.length > 0
      ? enrichedOrders.value.filter((o) => selectedOrderIds.value.includes(o.orderNumber))
      : enrichedOrders.value.filter((o) => o.stage === 'registered' || o.stage === 'picking')

    const map = new Map<string, WavePickingRow>()

    for (const ord of targetOrders) {
      for (const item of ord.items) {
        const key = `${item.title}__${item.color}__${item.size}`
        const existing = map.get(key)
        if (existing) {
          existing.totalQuantity += item.quantity
          if (!existing.orderNumbers.includes(ord.orderNumber)) {
            existing.orderNumbers.push(ord.orderNumber)
          }
        } else {
          map.set(key, {
            key,
            title: item.title,
            color: item.color,
            size: item.size,
            sku: item.sku,
            image: item.image,
            totalQuantity: item.quantity,
            orderNumbers: [ord.orderNumber],
            pickedQuantity: 0,
            isCompleted: false,
          })
        }
      }
    }

    return Array.from(map.values())
  })

  // تغییر وضعیت مرحله سفارش (Transition Stage)
  const transitionOrderStage = (orderNumber: string, nextStage: FulfillmentStage) => {
    const target = enrichedOrders.value.find((o) => o.orderNumber === orderNumber)
    if (!target) return

    target.stage = nextStage

    // همگام‌سازی وضعیت سیستم با TrackOrderResponse
    if (nextStage === 'registered') {
      target.status = 'registered'
      target.statusLabel = 'ثبت و در انتظار بررسی'
    } else if (nextStage === 'picking' || nextStage === 'packing') {
      target.status = 'processing'
      target.statusLabel = nextStage === 'picking' ? 'در حال انبارداری و گردآوری' : 'بسته‌بندی و کنترل کیفیت'
    } else if (nextStage === 'shipped') {
      target.status = 'handed_over'
      target.statusLabel = 'تحویل به شرکت پست / پیک'
      if (!target.trackingCode) {
        target.trackingCode = `18939631110000${Math.floor(1000000000 + Math.random() * 9000000000)}`
      }
    } else if (nextStage === 'delivered') {
      target.status = 'delivered'
      target.statusLabel = 'تحویل نهایی به خریدار'
      target.isDelayed = false
    }

    // افزودن رویداد به جدول تایم‌لاین
    target.timeline.push({
      status: target.status,
      title: target.statusLabel,
      description: `تغییر مرحله به ${nextStage} در میز پردازش سفارش‌ها.`,
      timestamp: 'هم‌اکنون',
      location: 'مرکز لجستیک کراس',
      completed: true,
    })

    toast.success(`سفارش ${orderNumber} به مرحله «${kanbanColumns.value[nextStage]?.title || nextStage}» منتقل شد.`)
  }

  // مدیریت انتخاب سفارش‌ها
  const toggleOrderSelection = (orderNumber: string) => {
    const idx = selectedOrderIds.value.indexOf(orderNumber)
    if (idx > -1) {
      selectedOrderIds.value.splice(idx, 1)
    } else {
      selectedOrderIds.value.push(orderNumber)
    }
  }

  const selectAll = () => {
    selectedOrderIds.value = filteredDeskOrders.value.map((o) => o.orderNumber)
  }

  const clearSelection = () => {
    selectedOrderIds.value = []
  }

  // عملیات گروهی (Batch Actions)
  const batchTransitionStage = (nextStage: FulfillmentStage) => {
    if (selectedOrderIds.value.length === 0) {
      toast.error('هیچ سفارشی انتخاب نشده است')
      return
    }
    const count = selectedOrderIds.value.length
    for (const num of selectedOrderIds.value) {
      transitionOrderStage(num, nextStage)
    }
    toast.success(`${count} سفارش به مرحله «${kanbanColumns.value[nextStage]?.title || nextStage}» به‌روزرسانی شدند.`)
    clearSelection()
  }

  // خروجی اکسل / CSV مأمور توزیع
  const exportDistributionExcel = () => {
    const list = selectedOrderIds.value.length > 0
      ? enrichedOrders.value.filter((o) => selectedOrderIds.value.includes(o.orderNumber))
      : filteredDeskOrders.value

    if (list.length === 0) {
      toast.error('داده‌ای برای خروجی وجود ندارد')
      return
    }

    const headers = ['شماره سفارش', 'نام گیرنده', 'شماره تماس', 'کد پستی', 'نشانی کامل', 'شرکت حمل', 'روش پرداخت کرایه', 'مبلغ کل (تومان)', 'کد رهگیری']
    const rows = list.map((o) => [
      o.orderNumber,
      `"${o.recipientName}"`,
      o.recipientPhone || '',
      o.postalCode || '',
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      CARRIER_CONFIGS[o.carrierType]?.shortName || o.carrier,
      o.freightMode === 'cod' ? 'پس‌کرایه' : 'پرداخت آنلاین',
      o.totalAmount,
      o.trackingCode || '',
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `keras-dispatch-manifest-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('فایل مانیفست مأمور توزیع دانلود شد.')
  }

  // ویرایش اضطراری نشانی پیش از ترخیص
  const updateEmergencyAddress = (
    orderNumber: string,
    newAddress: string,
    newPhone: string,
    newPostalCode: string,
  ) => {
    const order = enrichedOrders.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false
    order.shippingAddress = newAddress
    order.recipientPhone = newPhone
    order.postalCode = newPostalCode
    toast.success(`نشانی و اطلاعات تماس سفارش ${orderNumber} با موفقیت تصحیح شد.`)
    return true
  }

  // ثبت و پردازش تعویض سایز
  const requestSizeExchange = (
    orderNumber: string,
    itemTitle: string,
    oldSize: string,
    newSize: string,
    note?: string,
  ) => {
    const order = enrichedOrders.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return false

    if (!order.exchangeHistory) order.exchangeHistory = []
    const exchangeId = `EXC-${Date.now().toString().slice(-5)}`
    const returnDocket = `RET-${Math.floor(10000000 + Math.random() * 90000000)}`

    order.exchangeHistory.unshift({
      id: exchangeId,
      requestedAt: new Date().toLocaleDateString('fa-IR'),
      originalItem: itemTitle,
      oldSize,
      newSize,
      status: 'requested',
      exchangeTrackingCode: returnDocket,
      note,
    })

    // علامت‌گذاری روی سفارش
    order.stage = 'picking'
    order.statusLabel = 'درخواست تعویض سایز (رزرو کالا)'

    toast.success(`درخواست تعویض سایز ${oldSize} به ${newSize} برای «${itemTitle}» ثبت گردید و موجودی رزرو شد.`)
    return true
  }

  // وب‌هوک شبیه‌سازی وضعیت رهگیری پستی و ارسال پیامک
  const simulateCarrierWebhook = (orderNumber: string, event: 'delayed_hub' | 'delivered') => {
    const order = enrichedOrders.value.find((o) => o.orderNumber === orderNumber)
    if (!order) return

    if (event === 'delayed_hub') {
      order.isDelayed = true
      order.delayedDays = 5
      order.statusLabel = 'در باجه معطله پستی (نیاز به پیگیری)'
      toast.warning(`هشدار: مرسوله ${orderNumber} در باجه معطله گزارش شد.`)
    } else if (event === 'delivered') {
      order.stage = 'delivered'
      order.status = 'delivered'
      order.statusLabel = 'تحویل نهایی به خریدار'
      order.isDelayed = false
      toast.success(`مرسوله ${orderNumber} با موفقیت به گیرنده تحویل شد.`)
    }

    // ارسال پیامک شبیه‌سازی‌شده به کاربر
    const smsMessage = `کراس آتلیه: مرسوله شما به شماره ${orderNumber} در وضعیت «${order.statusLabel}» قرار گرفت. رهگیری مستقیم: keras.ir/t/${orderNumber}`
    toast.info(`پیامک اطلاع‌رسانی پستی ارسال شد: ${smsMessage}`, { duration: 5000 })
  }

  // ثبت ورود کالا به هاب انبار (Returned-to-Hub Inward Desk)
  const processInwardReturnScan = (barcode: string) => {
    const cleanBarcode = barcode.trim().toUpperCase()
    if (!cleanBarcode) return

    const matchedOrder = enrichedOrders.value.find((o) =>
      o.trackingCode === cleanBarcode ||
      o.orderNumber === cleanBarcode ||
      o.items.some((i) => i.barcode === cleanBarcode || i.sku === cleanBarcode),
    )

    if (matchedOrder) {
      matchedOrder.stage = 'registered'
      matchedOrder.status = 'canceled'
      matchedOrder.statusLabel = 'مرجوع‌شده به انبار مرکزی'
      toast.success(`مرسوله سفارش ${matchedOrder.orderNumber} به انبار بازگشت داده شد و آماده بررسی فنی است.`)
    } else {
      toast.error('بارکد مرجوعی در لیست سفارش‌های فعال یافت نشد.')
    }
  }

  const openOrderDetailDrawer = (order: FulfillmentOrder) => {
    selectedOrderForDrawer.value = order
    isDrawerOpen.value = true
  }

  const closeOrderDetailDrawer = () => {
    isDrawerOpen.value = false
    selectedOrderForDrawer.value = null
  }

  return {
    viewMode,
    activeStatusTab,
    selectedShift,
    selectedCarrierFilter,
    deskSearchQuery,
    selectedOrderIds,
    isDrawerOpen,
    selectedOrderForDrawer,
    isWavePickingOpen,
    isScanToPackOpen,
    isExchangeModalOpen,
    selectedItemForExchange,
    enrichedOrders,
    filteredDeskOrders,
    kanbanColumns,
    wavePickingRows,
    transitionOrderStage,
    toggleOrderSelection,
    selectAll,
    clearSelection,
    batchTransitionStage,
    exportDistributionExcel,
    updateEmergencyAddress,
    requestSizeExchange,
    simulateCarrierWebhook,
    processInwardReturnScan,
    openOrderDetailDrawer,
    closeOrderDetailDrawer,
  }
}
