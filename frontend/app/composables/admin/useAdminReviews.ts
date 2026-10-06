// app/composables/admin/useAdminReviews.ts
import type { ProductReview, ReviewStatus } from '~/types/domain'
import { toast } from 'vue-sonner'

export function useAdminReviews() {
  const reviews = useState<ProductReview[]>('admin_reviews_list', () => [])
  const activeTabFilter = useState<'all' | ReviewStatus>('admin_reviews_tab', () => 'all')
  const searchQuery = useState<string>('admin_reviews_search', () => '')
  const selectedRating = useState<number | null>('admin_reviews_rating', () => null)
  const isLoading = useState<boolean>('admin_reviews_loading', () => false)
  const isInitialized = useState<boolean>('admin_reviews_init', () => false)

  const pendingCount = computed(() => reviews.value.filter((r) => r.status === 'pending').length)
  const approvedCount = computed(() => reviews.value.filter((r) => r.status === 'approved').length)
  const rejectedCount = computed(() => reviews.value.filter((r) => r.status === 'rejected').length)
  const allCount = computed(() => reviews.value.length)

  const counts = computed(() => ({
    all: allCount.value,
    pending: pendingCount.value,
    approved: approvedCount.value,
    rejected: rejectedCount.value,
  }))

  const filteredReviews = computed(() => {
    return reviews.value.filter((r) => {
      // فیلتر بر اساس تب وضعیت
      if (activeTabFilter.value !== 'all' && r.status !== activeTabFilter.value) {
        return false
      }

      // فیلتر بر اساس امتیاز ستاره‌ای
      if (selectedRating.value !== null && Math.round(r.rating) !== selectedRating.value) {
        return false
      }

      // فیلتر متنی جستجو
      if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        const matchesAuthor = r.authorName?.toLowerCase().includes(q)
        const matchesComment = r.comment?.toLowerCase().includes(q)
        const matchesProduct = r.productTitle?.toLowerCase().includes(q)
        const matchesSlug = r.productSlug?.toLowerCase().includes(q)
        if (!matchesAuthor && !matchesComment && !matchesProduct && !matchesSlug) {
          return false
        }
      }

      return true
    })
  })

  async function fetchReviews(force = false) {
    if (isInitialized.value && !force && reviews.value.length > 0) {
      return
    }

    try {
      isLoading.value = true
      const data = await $fetch<{
        reviews: ProductReview[]
        total: number
        pendingCount: number
        approvedCount: number
        rejectedCount: number
        allCount: number
      }>('/api/reviews')

      reviews.value = data.reviews || []
      isInitialized.value = true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در واکشی نظرات'
      toast.error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function approveReview(id: string | number) {
    try {
      await $fetch(`/api/reviews/${id}/status`, {
        method: 'PUT',
        body: { status: 'approved' },
      })

      const target = reviews.value.find((r) => String(r.id) === String(id))
      if (target) {
        target.status = 'approved'
      }

      toast.success('دیدگاه با موفقیت تایید و در ویترین فروشگاه منتشر شد.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در تایید دیدگاه'
      toast.error(msg)
    }
  }

  async function rejectReview(id: string | number) {
    try {
      await $fetch(`/api/reviews/${id}/status`, {
        method: 'PUT',
        body: { status: 'rejected' },
      })

      const target = reviews.value.find((r) => String(r.id) === String(id))
      if (target) {
        target.status = 'rejected'
      }

      toast.info('دیدگاه رد شد و از ویترین مخفی گردید.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در رد دیدگاه'
      toast.error(msg)
    }
  }

  async function replyToReview(id: string | number, replyText: string) {
    const text = replyText.trim()
    if (!text) {
      toast.error('متن پاسخ نمی‌تواند خالی باشد.')
      return
    }

    try {
      const data = await $fetch<{ success: boolean; review: ProductReview }>(`/api/reviews/${id}/reply`, {
        method: 'POST',
        body: { replyText: text },
      })

      const target = reviews.value.find((r) => String(r.id) === String(id))
      if (target && data.review?.reply) {
        target.reply = data.review.reply
      }

      toast.success('پاسخ رسمی آتلیه با موفقیت ثبت و پیوست شد.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در ثبت پاسخ'
      toast.error(msg)
    }
  }

  async function deleteReview(id: string | number) {
    try {
      await $fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      })

      reviews.value = reviews.value.filter((r) => String(r.id) !== String(id))
      toast.success('دیدگاه با موفقیت حذف شد.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطا در حذف دیدگاه'
      toast.error(msg)
    }
  }

  // اگر هنوز واکشی نشده، واکشی اولیه انجام شود
  if (!isInitialized.value) {
    fetchReviews()
  }

  return {
    reviews,
    filteredReviews,
    pendingCount,
    approvedCount,
    rejectedCount,
    allCount,
    counts,
    activeTabFilter,
    searchQuery,
    selectedRating,
    isLoading,
    fetchReviews,
    approveReview,
    rejectReview,
    replyToReview,
    deleteReview,
  }
}
