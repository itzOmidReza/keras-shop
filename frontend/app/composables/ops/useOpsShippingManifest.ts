// frontend/app/composables/ops/useOpsShippingManifest.ts
import { toast } from 'vue-sonner'
import type { TrackOrderResponse } from '~/types/domain'

export type CarrierType = 'post' | 'tipax' | 'chapar' | 'courier'
export type FreightPaymentMode = 'prepaid' | 'cod' | 'free'

export interface CarrierConfig {
  id: CarrierType
  name: string
  shortName: string
  barcodePrefix: string
  barcodeLength: number
  estimatedDelivery: string
  color: string
}

export const CARRIER_CONFIGS: Record<CarrierType, CarrierConfig> = {
  post: {
    id: 'post',
    name: 'شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)',
    shortName: 'پست پیشتاز',
    barcodePrefix: '18939',
    barcodeLength: 24,
    estimatedDelivery: '۲ الی ۴ روز کاری',
    color: 'amber',
  },
  tipax: {
    id: 'tipax',
    name: 'تیپاکس اکسپرس سراسری (Tipax)',
    shortName: 'تیپاکس',
    barcodePrefix: 'TPX',
    barcodeLength: 15,
    estimatedDelivery: '۲۴ الی ۴۸ ساعت',
    color: 'blue',
  },
  chapar: {
    id: 'chapar',
    name: 'شرکت خدمات کالارسان چاپار (Chapar)',
    shortName: 'چاپار',
    barcodePrefix: 'CHP',
    barcodeLength: 14,
    estimatedDelivery: '۲۴ الی ۴۸ ساعت',
    color: 'emerald',
  },
  courier: {
    id: 'courier',
    name: 'پیک اختصاصی آتلیه کراس (تهران فوری)',
    shortName: 'پیک کراس',
    barcodePrefix: 'KRS-EXP',
    barcodeLength: 12,
    estimatedDelivery: 'همان روز (۳ ساعته)',
    color: 'purple',
  },
}

export const FREIGHT_PAYMENT_MODES: Record<FreightPaymentMode, { id: FreightPaymentMode, label: string, desc: string }> = {
  prepaid: {
    id: 'prepaid',
    label: 'پرداخت آنلاین (پیش‌کرایه)',
    desc: 'هزینه ارسال به همراه فاکتور آنلاین پرداخت شده است',
  },
  cod: {
    id: 'cod',
    label: 'پس‌کرایه (پرداخت در مقصد)',
    desc: 'کرایه توسط خریدار به مأمور توزیع پرداخت می‌شود',
  },
  free: {
    id: 'free',
    label: 'ارسال رایگان آتلیه',
    desc: 'ارسال با تخفیف ویژه یا سفارش‌های بالای سقف مشخص',
  },
}

export function useOpsShippingManifest() {
  // وضعیت مودال برچسب حرارتی ۱۰×۱۵
  const isThermalLabelOpen = ref(false)
  const selectedOrderForThermal = ref<TrackOrderResponse | null>(null)
  const bulkOrdersForThermal = ref<TrackOrderResponse[]>([])

  // وضعیت مودال مانیفست تحویل به باجه پست
  const isPostManifestOpen = ref(false)
  const selectedManifestCarrier = ref<CarrierType>('post')
  const manifestDate = ref(new Date().toLocaleDateString('fa-IR'))

  const openThermalLabel = (order: TrackOrderResponse) => {
    selectedOrderForThermal.value = order
    bulkOrdersForThermal.value = [order]
    isThermalLabelOpen.value = true
  }

  const openBulkThermalLabels = (orders: TrackOrderResponse[]) => {
    if (orders.length === 0) {
      toast.error('هیچ سفارشی برای چاپ انتخاب نشده است')
      return
    }
    selectedOrderForThermal.value = orders[0] || null
    bulkOrdersForThermal.value = orders
    isThermalLabelOpen.value = true
  }

  const openPostManifest = (carrier: CarrierType = 'post') => {
    selectedManifestCarrier.value = carrier
    isPostManifestOpen.value = true
  }

  const triggerPrintThermalLabel = () => {
    if (import.meta.client && typeof window !== 'undefined') {
      window.print()
    }
  }

  const generateBarcodeForCarrier = (carrier: CarrierType): string => {
    const config = CARRIER_CONFIGS[carrier]
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString()
    if (carrier === 'post') {
      const rest = Math.floor(1000000000 + Math.random() * 9000000000).toString()
      return `${config.barcodePrefix}${randomDigits}${rest}`.slice(0, config.barcodeLength)
    }
    return `${config.barcodePrefix}-${randomDigits}`.slice(0, config.barcodeLength)
  }

  return {
    CARRIER_CONFIGS,
    FREIGHT_PAYMENT_MODES,
    isThermalLabelOpen,
    selectedOrderForThermal,
    bulkOrdersForThermal,
    isPostManifestOpen,
    selectedManifestCarrier,
    manifestDate,
    openThermalLabel,
    openBulkThermalLabels,
    openPostManifest,
    triggerPrintThermalLabel,
    generateBarcodeForCarrier,
  }
}
