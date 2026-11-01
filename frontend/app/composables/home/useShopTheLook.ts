// frontend/app/composables/home/useShopTheLook.ts
import { toast } from 'vue-sonner'
import type { LookItem, OutfitLook, StyleLookbook } from '~/types/domain'

export type { LookItem, OutfitLook }

export const sharedLookbooks = ref<StyleLookbook[]>([])

export function useShopTheLook() {
  const cartStore = useCartStore()
  const selectedSizes = reactive<Record<string | number, string>>({})
  const activeHotspotId = ref<string | number | null>(null)
  const isLoading = ref(false)

  const fetchLookbooks = async (force = false) => {
    if (sharedLookbooks.value.length > 0 && !force) return
    isLoading.value = true
    try {
      const data = await $fetch<StyleLookbook[]>('/api/lookbooks/public')
      if (Array.isArray(data)) {
        sharedLookbooks.value = data
        for (const look of data) {
          for (const item of look.items) {
            if (!selectedSizes[item.id]) {
              selectedSizes[item.id] = item.sizes[0] || 'Free'
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch style lookbooks:', err)
    } finally {
      isLoading.value = false
    }
  }

  if (sharedLookbooks.value.length === 0) {
    useAsyncData('home-style-lookbooks', async () => {
      await fetchLookbooks()
      return sharedLookbooks.value
    })
  }

  if (import.meta.client) {
    onMounted(() => {
      fetchLookbooks()
    })
  }

  const toggleHotspot = (itemId: string | number) => {
    if (activeHotspotId.value === itemId) {
      activeHotspotId.value = null
    } else {
      activeHotspotId.value = itemId
    }
  }

  const getRegularTotal = (look: OutfitLook): number => {
    return look.bundle_total_price || look.items.reduce((sum, item) => sum + item.price, 0)
  }

  const getBundleTotal = (look: OutfitLook): number => {
    if (look.discounted_price) return look.discounted_price
    const discount = look.discount_percent || 10
    return Math.round((getRegularTotal(look) * (100 - discount)) / 100)
  }

  const addEntireOutfitToCart = (look: OutfitLook) => {
    const discount = look.discount_percent || 10
    const factor = (100 - discount) / 100

    for (const item of look.items) {
      const size = selectedSizes[item.id] || item.sizes[0] || 'Free'
      const bundleDiscountedPrice = Math.round(item.price * factor)
      const numericId = typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10) || 1

      cartStore.addItem(
        {
          productId: numericId,
          title: item.title,
          slug: item.slug,
          size,
          price: bundleDiscountedPrice,
          compareAtPrice: item.price,
          maxStock: 10,
          image: item.image,
          color: 'رنگ ست ادیتوریال',
        },
        1,
      )
    }

    toast.success(
      `ست کامل «${look.title}» با ${discount}٪ تخفیف پکیج به سبد خرید شما افزوده شد!`,
    )
  }

  return {
    looks: sharedLookbooks,
    isLoading,
    selectedSizes,
    activeHotspotId,
    toggleHotspot,
    getRegularTotal,
    getBundleTotal,
    addEntireOutfitToCart,
    fetchLookbooks,
  }
}
