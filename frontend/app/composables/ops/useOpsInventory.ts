// frontend/app/composables/ops/useOpsInventory.ts
import { toast } from 'vue-sonner'

export interface VariantRow {
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

export interface VoucherItem {
  id: number
  code: string
  discount: string
  maxDiscount: string
  minOrder: string
  usedCount: number
  limit: number
  expiresAt: string
  active: boolean
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

const vouchers = ref<VoucherItem[]>([
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

export function useOpsInventory() {
  const toggleVoucher = (v: VoucherItem) => {
    v.active = !v.active
    toast.success(
      `وضعیت کد تخفیف ${v.code} به ${v.active ? 'فعال' : 'غیرفعال'} تغییر یافت.`,
    )
  }

  return {
    variantInventory,
    vouchers,
    toggleVoucher,
  }
}
