import { toast } from 'vue-sonner'
import { toEn, toFa } from '~/utils/format'
import type { TrackOrderResponse } from '~/types/domain'

export interface TestPill {
  label: string
  code: string
}

export const TEST_PILLS: TestPill[] = [
  { label: 'سفارش در مسیر پست', code: 'KERAS-208314' },
  { label: 'سفارش تحویل‌شده', code: 'KERAS-104921' },
  { label: 'سفارش در حال پردازش', code: 'KERAS-309115' },
]

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return ''
  const clean = toEn(phone).trim()
  if (clean.length === 11) {
    return toFa(`${clean.slice(0, 4)}***${clean.slice(7)}`)
  }
  return toFa(phone)
}

export function useOrderTracking() {
  const route = useRoute()
  const router = useRouter()

  const searchQuery = ref('')
  const isLoading = ref(false)
  const orderData = ref<TrackOrderResponse | null>(null)
  const errorMessage = ref('')
  const hasSearched = ref(false)
  const isCopied = ref(false)

  const handleSearch = async (explicitCode?: string) => {
    const targetQuery = explicitCode !== undefined ? explicitCode : searchQuery.value
    const normalized = toEn(targetQuery).trim()

    if (!normalized) {
      errorMessage.value = 'لطفاً شماره سفارش (مانند KERAS-208314) یا شماره تلفن همراه خود را وارد فرمایید.'
      orderData.value = null
      hasSearched.value = true
      return
    }

    isLoading.value = true
    errorMessage.value = ''
    hasSearched.value = true

    try {
      const res = await $fetch<TrackOrderResponse>('/api/orders/track', {
        method: 'POST',
        body: { query: normalized },
      })

      orderData.value = res
      searchQuery.value = normalized

      router.replace({
        query: { ...route.query, order: normalized },
      })
    } catch (err: unknown) {
      orderData.value = null
      const fetchErr = err as { data?: { statusMessage?: string } }
      errorMessage.value =
        fetchErr?.data?.statusMessage ||
        'سفارشی با این مشخصات یافت نشد. لطفاً از صحت شماره سفارش یا شماره تماس اطمینان حاصل نمایید.'
    } finally {
      isLoading.value = false
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    orderData.value = null
    errorMessage.value = ''
    hasSearched.value = false
    router.replace({ query: {} })
  }

  const applyPill = (code: string) => {
    searchQuery.value = code
    handleSearch(code)
  }

  const copyTrackingCode = async () => {
    if (!orderData.value?.trackingCode) return
    try {
      await navigator.clipboard.writeText(orderData.value.trackingCode)
      isCopied.value = true
      toast.success('کد رهگیری پستی کپی شد.')
      setTimeout(() => {
        isCopied.value = false
      }, 2500)
    } catch {
      toast.error('امکان کپی خودکار فراهم نشد.')
    }
  }

  onMounted(() => {
    const rawParam = route.query.order ?? route.query.q
    const queryParam = Array.isArray(rawParam) ? rawParam[0] : rawParam
    if (queryParam && typeof queryParam === 'string') {
      searchQuery.value = queryParam
      handleSearch(queryParam)
    }
  })

  watch(searchQuery, () => {
    if (errorMessage.value) {
      errorMessage.value = ''
    }
  })

  return {
    searchQuery,
    isLoading,
    orderData,
    errorMessage,
    hasSearched,
    isCopied,
    handleSearch,
    clearSearch,
    applyPill,
    copyTrackingCode,
  }
}
