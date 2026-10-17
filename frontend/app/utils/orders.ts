// frontend/app/utils/orders.ts
import type { OrderStatus } from '~/types/domain'

export interface OrderStatusConfigItem {
  label: string
  badgeClass: string
  step: number
}

export const ORDER_STATUS_CONFIG: Record<string, OrderStatusConfigItem> = {
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
  cancelled: {
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

export const getOrderStatusBadge = (status: string | null | undefined): OrderStatusConfigItem => {
  if (!status) {
    return {
      label: 'نامشخص',
      badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
      step: 0,
    }
  }
  const normalized = status.toLowerCase()
  return (
    ORDER_STATUS_CONFIG[normalized] || {
      label: status,
      badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
      step: 0,
    }
  )
}

