// frontend/app/stores/wishlist.ts
import { defineStore } from 'pinia'
import type {
  ProductDetail,
  ProductListItem,
  WishlistItem,
} from '~/types/domain'
import { toast } from 'vue-sonner'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])
  const isHydrated = ref(false)

  // ۱. هیدراتاسیون ایمن در سمت کلاینت با onNuxtReady جهت جلوگیری از عدم تطابق SSR
  if (import.meta.client) {
    const hydrate = () => {
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          const saved = window.localStorage.getItem('keras_wishlist_items')
          if (saved) {
            items.value = JSON.parse(saved)
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
              window.localStorage.setItem('keras_wishlist_items', JSON.stringify(newItems))
            }
          } catch {
            // نادیده گرفتن محدودیت‌های فضای ذخیره‌سازی
          }
        }
      },
      { deep: true },
    )
  }

  // ۲. گترها (Getters)
  const itemCount = computed(() => (items.value || []).length)

  const isInWishlist = (productId: number): boolean => {
    return items.value.some((item) => item.id === productId)
  }

  // ۳. اکشن‌ها (Actions)
  function toggleWishlist(product: ProductListItem | ProductDetail | WishlistItem) {
    const existingIndex = items.value.findIndex((item) => item.id === product.id)

    if (existingIndex > -1) {
      items.value.splice(existingIndex, 1)
      toast.info(`«${product.title}» از لیست علاقه‌مندی‌ها حذف شد.`)
      return false
    }

    // استخراج تصویر شاخص
    let primaryImage = ''
    if ('primary_image' in product && typeof product.primary_image === 'string') {
      primaryImage = product.primary_image
    } else if ('images' in product && Array.isArray(product.images) && product.images[0]) {
      primaryImage = product.images[0].url
    }

    // استخراج عنوان دسته‌بندی
    let categoryName = ''
    if ('category' in product) {
      if (typeof product.category === 'object' && product.category !== null) {
        categoryName = product.category.title
      } else if (typeof product.category === 'string') {
        categoryName = product.category
      }
    }

    // استخراج قیمت مبنا
    const price = 'base_price' in product ? product.base_price : product.price

    const newItem: WishlistItem = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price,
      compare_at_price: product.compare_at_price,
      primary_image: primaryImage,
      line: product.line,
      category: categoryName,
      addedAt: new Date().toISOString(),
    }

    items.value.push(newItem)
    toast.success(`«${product.title}» به لیست علاقه‌مندی‌ها افزوده شد.`)
    return true
  }

  function removeItem(productId: number) {
    const target = items.value.find((item) => item.id === productId)
    items.value = items.value.filter((item) => item.id !== productId)
    if (target) {
      toast.info(`«${target.title}» از لیست علاقه‌مندی‌ها حذف شد.`)
    }
  }

  function clearWishlist() {
    items.value = []
    toast.info('لیست علاقه‌مندی‌های شما خالی شد.')
  }

  return {
    items,
    isHydrated,
    itemCount,
    isInWishlist,
    toggleWishlist,
    removeItem,
    clearWishlist,
  }
})

export default useWishlistStore
