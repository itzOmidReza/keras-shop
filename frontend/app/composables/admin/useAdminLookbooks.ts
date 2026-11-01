// frontend/app/composables/admin/useAdminLookbooks.ts
import { toast } from 'vue-sonner'
import type { StyleLookbook } from '~/types/domain'

export const sharedAdminLookbooks = ref<StyleLookbook[]>([])

export function useAdminLookbooks() {
  const authStore = useAuthStore()
  const searchQuery = ref('')
  const selectedStatus = ref<'all' | 'active' | 'inactive'>('all')
  const isLoading = ref(false)

  const fetchAdminLookbooks = async (force = false) => {
    if (sharedAdminLookbooks.value.length > 0 && !force) return
    isLoading.value = true
    try {
      const data = await $fetch<StyleLookbook[]>('/api/admin/lookbooks', {
        headers: authStore.getAuthHeaders(),
      })
      if (Array.isArray(data)) {
        sharedAdminLookbooks.value = data
      }
    } catch (err) {
      console.error('Failed to fetch admin lookbooks:', err)
      toast.error('خطا در دریافت لیست ست‌ها و استایل‌ها.')
    } finally {
      isLoading.value = false
    }
  }

  const filteredLookbooks = computed(() => {
    let result = sharedAdminLookbooks.value

    if (selectedStatus.value === 'active') {
      result = result.filter(lb => lb.is_active !== false)
    } else if (selectedStatus.value === 'inactive') {
      result = result.filter(lb => lb.is_active === false)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        lb =>
          lb.title.toLowerCase().includes(q) ||
          (lb.tagline && lb.tagline.toLowerCase().includes(q)) ||
          (lb.description && lb.description.toLowerCase().includes(q)),
      )
    }

    return result
  })

  const stats = computed(() => {
    const all = sharedAdminLookbooks.value
    return {
      total: all.length,
      active: all.filter(lb => lb.is_active !== false).length,
      inactive: all.filter(lb => lb.is_active === false).length,
    }
  })

  const getLookbookById = async (id: string): Promise<StyleLookbook | undefined> => {
    const existing = sharedAdminLookbooks.value.find(lb => lb.id === id)
    if (existing && existing.items && existing.items.length > 0) {
      return existing
    }
    try {
      const lb = await $fetch<StyleLookbook>(`/api/admin/lookbooks/${id}`, {
        headers: authStore.getAuthHeaders(),
      })
      if (lb) {
        const idx = sharedAdminLookbooks.value.findIndex(l => l.id === id)
        if (idx !== -1) {
          sharedAdminLookbooks.value[idx] = lb
        } else {
          sharedAdminLookbooks.value.push(lb)
        }
        return lb
      }
    } catch (err) {
      console.error(`Failed to fetch lookbook ${id}:`, err)
    }
    return existing
  }

  const createLookbook = async (payload: {
    title: string
    tagline?: string
    description?: string
    cover_image: string
    discount_percent?: number
    is_active?: boolean
    display_order?: number
    items: Array<{
      product_id: string | number
      hotspot_x: number
      hotspot_y: number
    }>
  }): Promise<StyleLookbook | null> => {
    isLoading.value = true
    try {
      const created = await $fetch<StyleLookbook>('/api/admin/lookbooks', {
        method: 'POST',
        headers: authStore.getAuthHeaders(),
        body: payload,
      })
      sharedAdminLookbooks.value.unshift(created)
      refreshNuxtData(['home-style-lookbooks'])
      toast.success(`ست «${created.title}» با موفقیت ثبت شد.`)
      return created
    } catch (err) {
      console.error('Failed to create lookbook:', err)
      toast.error('خطا در ثبت ست جدید. لطفاً ورودی‌ها را بررسی کنید.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateLookbook = async (
    id: string,
    payload: {
      title?: string
      tagline?: string
      description?: string
      cover_image?: string
      discount_percent?: number
      is_active?: boolean
      display_order?: number
      items?: Array<{
        product_id: string | number
        hotspot_x: number
        hotspot_y: number
      }>
    },
  ): Promise<StyleLookbook | null> => {
    isLoading.value = true
    try {
      const updated = await $fetch<StyleLookbook>(`/api/admin/lookbooks/${id}`, {
        method: 'PUT',
        headers: authStore.getAuthHeaders(),
        body: payload,
      })
      const idx = sharedAdminLookbooks.value.findIndex(lb => lb.id === id)
      if (idx !== -1) {
        sharedAdminLookbooks.value[idx] = updated
      }
      refreshNuxtData(['home-style-lookbooks'])
      toast.success(`تغییرات ست «${updated.title}» با موفقیت ذخیره شد.`)
      return updated
    } catch (err) {
      console.error(`Failed to update lookbook ${id}:`, err)
      toast.error('خطا در ویرایش ست.')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteLookbook = async (id: string): Promise<boolean> => {
    isLoading.value = true
    try {
      await $fetch(`/api/admin/lookbooks/${id}`, {
        method: 'DELETE',
        headers: authStore.getAuthHeaders(),
      })
      const idx = sharedAdminLookbooks.value.findIndex(lb => lb.id === id)
      if (idx !== -1) {
        const deleted = sharedAdminLookbooks.value.splice(idx, 1)[0]
        toast.success(`ست «${deleted?.title || id}» حذف شد.`)
      }
      refreshNuxtData(['home-style-lookbooks'])
      return true
    } catch (err) {
      console.error(`Failed to delete lookbook ${id}:`, err)
      toast.error('خطا در حذف ست.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const toggleLookbookStatus = async (id: string): Promise<boolean> => {
    const lb = sharedAdminLookbooks.value.find(l => l.id === id)
    if (!lb) return false

    const newStatus = !lb.is_active
    try {
      await $fetch(`/api/admin/lookbooks/${id}`, {
        method: 'PUT',
        headers: authStore.getAuthHeaders(),
        body: { is_active: newStatus },
      })
      lb.is_active = newStatus
      refreshNuxtData(['home-style-lookbooks'])
      toast.success(
        newStatus ? `ست «${lb.title}» فعال شد.` : `ست «${lb.title}» غیرفعال شد.`,
      )
      return true
    } catch (err) {
      console.error(`Failed to toggle status for lookbook ${id}:`, err)
      toast.error('خطا در تغییر وضعیت ست.')
      return false
    }
  }

  return {
    lookbooks: sharedAdminLookbooks,
    filteredLookbooks,
    stats,
    isLoading,
    searchQuery,
    selectedStatus,
    fetchAdminLookbooks,
    getLookbookById,
    createLookbook,
    updateLookbook,
    deleteLookbook,
    toggleLookbookStatus,
  }
}
