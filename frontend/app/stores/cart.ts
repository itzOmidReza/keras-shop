// app/stores/cart.ts
import { defineStore } from 'pinia'
import type {
  CartItem,
  CartSummary,
  OrderReceipt,
  ShippingMethod,
} from '~/types/domain'
import { FREE_SHIPPING_THRESHOLD } from '~/data/value-props'
import { toast } from 'vue-sonner'

export interface AppliedCoupon {
  code: string
  discountAmount: number
  discountPercent?: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const isHydrated = ref(false)
  const appliedCoupon = ref<AppliedCoupon | null>(null)
  const selectedShippingMethod = ref<ShippingMethod>('standard')
  const lastOrderReceipt = ref<OrderReceipt | null>(null)

  // ۱. بازیابی و ذخیره‌سازی امن در localStorage/sessionStorage برای جلوگیری از عدم تطابق هیدریشن SSR
  if (import.meta.client) {
    const hydrate = () => {
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          const savedItems = window.localStorage.getItem('keras_cart_items')
          if (savedItems) {
            items.value = JSON.parse(savedItems)
          }
          const savedCoupon = window.localStorage.getItem('keras_cart_coupon')
          if (savedCoupon) {
            appliedCoupon.value = JSON.parse(savedCoupon)
          }
        }
        if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
          const savedReceipt = window.sessionStorage.getItem('keras_last_order')
          if (savedReceipt) {
            lastOrderReceipt.value = JSON.parse(savedReceipt)
          }
        }
      } catch {
        // نادیده گرفتن خطای پارس در صورت دستکاری دیتای لوکال
      }
      isHydrated.value = true
    }

    try {
      onNuxtReady(hydrate)
    } catch {
      hydrate()
    }

    watch(
      items,
      (newItems) => {
        if (isHydrated.value) {
          try {
            if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
              window.localStorage.setItem('keras_cart_items', JSON.stringify(newItems))
            }
          } catch {
            // نادیده گرفتن محدودیت‌های لوکال‌استوریج
          }
        }
      },
      { deep: true },
    )

    watch(
      appliedCoupon,
      (newCoupon) => {
        if (isHydrated.value) {
          try {
            if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
              if (newCoupon) {
                window.localStorage.setItem('keras_cart_coupon', JSON.stringify(newCoupon))
              } else {
                window.localStorage.removeItem('keras_cart_coupon')
              }
            }
          } catch {
            // نادیده گرفتن محدودیت‌های استوریج
          }
        }
      },
      { deep: true },
    )
  }

  // ۲. گترها (Getters)
  const itemCount = computed(() => {
    return (items.value || []).reduce((total, item) => total + (item.quantity || 0), 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )
  })

  const discountTotal = computed(() => {
    return items.value.reduce((total, item) => {
      if (item.compareAtPrice && item.compareAtPrice > item.price) {
        return total + (item.compareAtPrice - item.price) * item.quantity
      }
      return total
    }, 0)
  })

  const couponDiscount = computed(() => appliedCoupon.value?.discountAmount ?? 0)

  const combinedDiscountTotal = computed(() => discountTotal.value + couponDiscount.value)

  const amountNeededForFreeShipping = computed(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal.value)
  })

  const isFreeShipping = computed(() => {
    return subtotal.value >= FREE_SHIPPING_THRESHOLD && subtotal.value > 0
  })

  const freeShippingProgress = computed(() => {
    if (subtotal.value <= 0) return 0
    return Math.min(
      100,
      Math.round((subtotal.value / FREE_SHIPPING_THRESHOLD) * 100),
    )
  })

  const shippingEstimate = computed(() => {
    if (subtotal.value <= 0) return 0
    if (selectedShippingMethod.value === 'express') {
      return 120000 // ۱۲۰,۰۰۰ تومان پیک فوری
    }
    return isFreeShipping.value ? 0 : 65000 // ۶۵,۰۰۰ تومان هزینه ارسال استاندارد کشوری
  })

  const finalTotal = computed(() => {
    return Math.max(0, subtotal.value - couponDiscount.value + shippingEstimate.value)
  })

  const summary = computed((): CartSummary => {
    return {
      subtotal: subtotal.value,
      discountTotal: combinedDiscountTotal.value,
      shippingEstimate: shippingEstimate.value,
      finalTotal: finalTotal.value,
      freeShippingRemaining: amountNeededForFreeShipping.value,
    }
  })

  // ۳. اکشن‌ها (Actions)
  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function addItem(
    newItem: Omit<CartItem, 'quantity' | 'id'>,
    quantity: number = 1,
  ) {
    const compositeId = `${newItem.productId}-${newItem.variantId ?? newItem.size}`
    const existingIndex = items.value.findIndex(
      (item) => item.id === compositeId,
    )
    const maxStock =
      newItem.maxStock !== undefined && newItem.maxStock !== null
        ? newItem.maxStock
        : 10

    if (maxStock <= 0) {
      toast.warning(`متأسفانه موجودی این محصول به اتمام رسیده است.`)
      return
    }

    if (existingIndex > -1) {
      const existing = items.value[existingIndex]!
      if (existing.quantity + quantity > maxStock) {
        existing.quantity = maxStock
        toast.warning(
          `حداکثر موجودی قابل سفارش (${maxStock} عدد) در سبد شما قرار دارد.`,
        )
      } else {
        existing.quantity += quantity
        toast.success(
          `تعداد ${newItem.title} (سایز ${newItem.size}) به ${existing.quantity} افزایش یافت.`,
        )
      }
    } else {
      const addQty = Math.min(quantity, maxStock)
      items.value.push({
        ...newItem,
        id: compositeId,
        quantity: addQty,
      })
      toast.success(
        `${newItem.title} (سایز ${newItem.size}) به سبد خرید افزوده شد.`,
      )
    }

    // باز شدن دراور مینی‌کارت بلافاصله پس از افزودن کالا
    openCart()
  }

  function updateQuantity(id: string, delta: number) {
    const target = items.value.find((item) => item.id === id)
    if (!target) return

    const newQty = target.quantity + delta
    if (newQty <= 0) {
      removeItem(id)
      return
    }

    if (newQty > target.maxStock) {
      toast.warning(
        `متاسفانه موجودی انبار برای این کالا حداکثر ${target.maxStock} عدد است.`,
      )
      return
    }

    target.quantity = newQty
  }

  function removeItem(id: string) {
    const target = items.value.find((item) => item.id === id)
    items.value = items.value.filter((item) => item.id !== id)
    if (target) {
      toast.info(`${target.title} از سبد خرید حذف شد.`)
    }
  }

  function applyCoupon(coupon: AppliedCoupon) {
    appliedCoupon.value = coupon
    toast.success(`کد تخفیف «${coupon.code}» اعمال شد.`)
  }

  function removeCoupon() {
    appliedCoupon.value = null
    toast.info('کد تخفیف حذف شد.')
  }

  function setShippingMethod(method: ShippingMethod) {
    selectedShippingMethod.value = method
  }

  function setLastOrderReceipt(receipt: OrderReceipt) {
    lastOrderReceipt.value = receipt
    if (import.meta.client) {
      try {
        sessionStorage.setItem('keras_last_order', JSON.stringify(receipt))
      } catch {
        // نادیده گرفتن خطا
      }
    }
  }

  function getLastOrderReceipt(): OrderReceipt | null {
    if (lastOrderReceipt.value) return lastOrderReceipt.value
    if (import.meta.client) {
      try {
        const saved = sessionStorage.getItem('keras_last_order')
        if (saved) {
          lastOrderReceipt.value = JSON.parse(saved)
          return lastOrderReceipt.value
        }
      } catch {
        // نادیده گرفتن خطا
      }
    }
    return null
  }

  function clearCart() {
    items.value = []
    appliedCoupon.value = null
    toast.info('سبد خرید شما خالی شد.')
  }

  return {
    items,
    isOpen,
    isHydrated,
    itemCount,
    subtotal,
    discountTotal,
    couponDiscount,
    combinedDiscountTotal,
    appliedCoupon,
    selectedShippingMethod,
    lastOrderReceipt,
    amountNeededForFreeShipping,
    isFreeShipping,
    freeShippingProgress,
    shippingEstimate,
    finalTotal,
    summary,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    setLastOrderReceipt,
    getLastOrderReceipt,
    clearCart,
  }
})

export default useCartStore
