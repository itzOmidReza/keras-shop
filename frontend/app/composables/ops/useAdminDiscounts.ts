// frontend/app/composables/ops/useAdminDiscounts.ts
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

export interface AdminDiscountCoupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrder: number
  maxDiscount: number
  expiresAt: string
  usedCount: number
  limit: number
  isActive: boolean
}

const discountsList = ref<AdminDiscountCoupon[]>([
  {
    id: 'c-1',
    code: 'KERAS-PRO',
    type: 'percent',
    value: 20,
    minOrder: 2000000,
    maxDiscount: 800000,
    expiresAt: '۱۴۰۵/۰۸/۳۰',
    usedCount: 42,
    limit: 100,
    isActive: true,
  },
  {
    id: 'c-2',
    code: 'SUMMER1405',
    type: 'percent',
    value: 15,
    minOrder: 1500000,
    maxDiscount: 600000,
    expiresAt: '۱۴۰۵/۰۷/۱۵',
    usedCount: 88,
    limit: 150,
    isActive: true,
  },
  {
    id: 'c-3',
    code: 'VIP-ATELIER',
    type: 'fixed',
    value: 500000,
    minOrder: 4000000,
    maxDiscount: 500000,
    expiresAt: '۱۴۰۵/۰۹/۳۰',
    usedCount: 15,
    limit: 50,
    isActive: true,
  },
  {
    id: 'c-4',
    code: 'WELCOME-KERAS',
    type: 'percent',
    value: 10,
    minOrder: 1000000,
    maxDiscount: 300000,
    expiresAt: '۱۴۰۵/۱۲/۲۹',
    usedCount: 230,
    limit: 500,
    isActive: true,
  },
])

const isCreateModalOpen = ref(false)
const searchQuery = ref('')

export function useAdminDiscounts() {
  const filteredDiscounts = computed(() => {
    const q = searchQuery.value.trim().toUpperCase()
    if (!q) return discountsList.value
    return discountsList.value.filter((d) => d.code.includes(q))
  })

  const toggleDiscount = (coupon: AdminDiscountCoupon) => {
    coupon.isActive = !coupon.isActive
    toast.info(
      coupon.isActive
        ? `کد تخفیف ${coupon.code} فعال گردید.`
        : `کد تخفیف ${coupon.code} غیرفعال شد.`,
    )
  }

  const deleteDiscount = (id: string) => {
    const idx = discountsList.value.findIndex((d) => d.id === id)
    if (idx !== -1) {
      const removed = discountsList.value.splice(idx, 1)[0]
      toast.success(`کد تخفیف «${removed?.code}» با موفقیت حذف گردید.`)
      return true
    }
    return false
  }

  const createDiscount = (data: Partial<AdminDiscountCoupon>) => {
    if (!data.code) {
      toast.error('کد کوپن الزامی است.')
      return null
    }

    const code = data.code.trim().toUpperCase()
    if (discountsList.value.some((d) => d.code === code)) {
      toast.error('این کد تخفیف قبلاً ایجاد شده است.')
      return null
    }

    const newCoupon: AdminDiscountCoupon = {
      id: `c-${Date.now().toString().slice(-4)}`,
      code,
      type: data.type || 'percent',
      value: Number(data.value) || 15,
      minOrder: Number(data.minOrder) || 1000000,
      maxDiscount: Number(data.maxDiscount) || 500000,
      expiresAt: data.expiresAt || '۱۴۰۵/۰۹/۳۰',
      usedCount: 0,
      limit: Number(data.limit) || 100,
      isActive: true,
    }

    discountsList.value.unshift(newCoupon)
    isCreateModalOpen.value = false
    toast.success(`کد تخفیف جدید «${code}» با موفقیت ایجاد گردید.`)
    return newCoupon
  }

  return {
    discountsList,
    filteredDiscounts,
    searchQuery,
    isCreateModalOpen,
    toggleDiscount,
    deleteDiscount,
    createDiscount,
  }
}
