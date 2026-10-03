<!-- frontend/app/components/search/SearchAutocomplete.vue -->
<script setup lang="ts">
import {
  Search,
  X,
  Loader2,
  Tag,
  ArrowLeft,
} from '@lucide/vue'
import type {
  SearchSuggestionsResponse,
  SearchSuggestionItem,
  SearchCategorySuggestion,
} from '~/types/domain'
import { toFa, toEn, formatToman } from '~/utils/format'
import { getCategoryLabel, getSeasonLabel } from '~/data'

interface Props {
  placeholder?: string
  autoFocus?: boolean
  showCloseButton?: boolean
  initialQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'جست‌وجوی استایل و اکسسوری کراس...',
  autoFocus: false,
  showCloseButton: false,
  initialQuery: '',
})

const emit = defineEmits<{
  close: []
  select: [item?: SearchSuggestionItem | SearchCategorySuggestion]
}>()

const query = ref(props.initialQuery)
const isLoading = ref(false)
const isOpen = ref(false)
const suggestions = ref<SearchSuggestionsResponse | null>(null)
const highlightedIndex = ref(-1)

const wrapperRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// واکشی پیشنهادات با دی‌بونس ۳۰۰ میلی‌ثانیه
const fetchSuggestions = async (searchVal: string) => {
  const normalized = toEn(searchVal.trim())
  if (normalized.length < 2) {
    suggestions.value = null
    isLoading.value = false
    isOpen.value = false
    return
  }

  isLoading.value = true
  try {
    const data = await $fetch<SearchSuggestionsResponse>('/api/search/suggestions', {
      query: { q: searchVal.trim() },
    })
    suggestions.value = data
    isOpen.value = true
    highlightedIndex.value = -1
  } catch (err) {
    console.error('Failed to fetch search suggestions:', err)
  } finally {
    isLoading.value = false
  }
}

watch(query, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  if (newVal.trim().length < 2) {
    suggestions.value = null
    isLoading.value = false
    isOpen.value = false
    return
  }

  isLoading.value = true
  debounceTimer = setTimeout(() => {
    fetchSuggestions(newVal)
  }, 300)
})

// پاکسازی ورودی جست‌وجو
const clearQuery = () => {
  query.value = ''
  suggestions.value = null
  isOpen.value = false
  highlightedIndex.value = -1
  inputRef.value?.focus()
}

// ناوبری و انتخاب‌ها
const executeFullSearch = () => {
  if (!query.value.trim()) return
  const q = query.value.trim()
  isOpen.value = false
  emit('select')
  emit('close')
  navigateTo(`/shop?q=${encodeURIComponent(q)}`)
}

const selectCategory = (category: SearchCategorySuggestion) => {
  isOpen.value = false
  emit('select', category)
  emit('close')
  navigateTo(`/shop?category=${encodeURIComponent(category.slug)}`)
}

const selectProduct = (product: SearchSuggestionItem) => {
  isOpen.value = false
  emit('select', product)
  emit('close')
  navigateTo(`/products/${product.slug}`)
}

// هایلایت کردن زیررشته مطابق در عنوان
const highlightMatch = (text: string, searchQuery: string): { text: string; isMatch: boolean }[] => {
  if (!searchQuery.trim() || !text) {
    return [{ text, isMatch: false }]
  }

  const escaped = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  const testRegex = new RegExp(`^${escaped}$`, 'i')

  return parts
    .filter((p) => p.length > 0)
    .map((part) => ({
      text: part,
      isMatch: testRegex.test(part),
    }))
}

// کلیک خارج از کامپوننت برای بستن دراپ‌داون
const handleDocumentClick = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

// مدیریت کلیدهای کیبورد (Escape / ArrowDown / ArrowUp / Enter)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
    emit('close')
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    if (suggestions.value && suggestions.value.products.length > 0 && highlightedIndex.value >= 0) {
      const selected = suggestions.value.products[highlightedIndex.value]
      if (selected) {
        selectProduct(selected)
        return
      }
    }
    executeFullSearch()
    return
  }

  if (e.key === 'ArrowDown') {
    if (!suggestions.value || suggestions.value.products.length === 0) return
    e.preventDefault()
    if (!isOpen.value) {
      isOpen.value = true
    }
    if (highlightedIndex.value < suggestions.value.products.length - 1) {
      highlightedIndex.value++
    } else {
      highlightedIndex.value = 0
    }
    return
  }

  if (e.key === 'ArrowUp') {
    if (!suggestions.value || suggestions.value.products.length === 0) return
    e.preventDefault()
    if (highlightedIndex.value > 0) {
      highlightedIndex.value--
    } else {
      highlightedIndex.value = suggestions.value.products.length - 1
    }
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleDocumentClick)
  }
  if (props.autoFocus && inputRef.value) {
    inputRef.value.focus()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleDocumentClick)
  }
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div ref="wrapperRef" class="relative w-full">
    <!-- ورودی جست‌وجو -->
    <form
      class="relative flex items-center gap-2 rounded-2xl border border-sand bg-white/80 px-3.5 py-2.5 shadow-xs transition-colors focus-within:border-ink/40 focus-within:bg-white"
      @submit.prevent="executeFullSearch"
    >
      <Search class="w-4 h-4 text-muted-foreground shrink-0" />

      <label for="keras-search-autocomplete-input" class="sr-only">
        {{ placeholder }}
      </label>

      <input
        id="keras-search-autocomplete-input"
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        autocomplete="off"
        class="w-full bg-transparent text-sm text-ink placeholder:text-muted-foreground focus:outline-none"
        @focus="isOpen = !!(suggestions && suggestions.totalMatches >= 0)"
        @keydown="handleKeydown"
      >

      <!-- اسپینر لودینگ -->
      <Loader2
        v-if="isLoading"
        class="w-4 h-4 text-rose animate-spin shrink-0"
      />

      <!-- دکمه پاک کردن ورودی -->
      <button
        v-else-if="query.length > 0"
        type="button"
        class="flex items-center justify-center w-5 h-5 rounded-full text-muted-foreground hover:text-ink hover:bg-sand/40 transition-colors cursor-pointer shrink-0"
        aria-label="پاک کردن جست‌وجو"
        @click="clearQuery"
      >
        <X class="w-3.5 h-3.5" />
      </button>

      <!-- دکمه بستن (برای هدر یا دراور) -->
      <button
        v-if="showCloseButton"
        type="button"
        class="text-xs font-bold text-muted-foreground hover:text-ink transition-colors cursor-pointer shrink-0 ps-1 border-s border-sand"
        @click="$emit('close')"
      >
        بستن
      </button>
    </form>

    <!-- دراپ‌داون نتایج شناور (Autocomplete Popover) -->
    <div
      v-if="isOpen && (suggestions || isLoading)"
      class="absolute inset-x-0 top-full mt-2 z-50 rounded-2xl border border-sand/60 bg-paper/95 backdrop-blur-md shadow-xl overflow-hidden max-h-[75vh] flex flex-col"
      dir="rtl"
    >
      <!-- ۱. دسته‌بندی‌های مرتبط -->
      <div
        v-if="suggestions && suggestions.categories && suggestions.categories.length > 0"
        class="p-3 border-b border-sand/40 bg-sand/20"
      >
        <div class="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
          <Tag class="w-3.5 h-3.5 text-rose" />
          <span>دسته‌بندی‌های مرتبط:</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="cat in suggestions.categories"
            :key="cat.slug"
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sand/50 hover:bg-rose/10 hover:text-rose text-ink transition-colors cursor-pointer border border-sand/60"
            @click="selectCategory(cat)"
          >
            <span>{{ cat.name }}</span>
            <span class="text-[10px] text-muted-foreground font-mono">({{ toFa(cat.count) }})</span>
          </button>
        </div>
      </div>

      <!-- ۲. لیست کالاهای پیشنهادی -->
      <div
        v-if="suggestions && suggestions.products && suggestions.products.length > 0"
        class="overflow-y-auto divide-y divide-sand/40 py-1"
      >
        <div
          v-for="(product, idx) in suggestions.products"
          :key="product.id"
          class="flex items-center justify-between gap-3 p-3 transition-colors cursor-pointer group"
          :class="highlightedIndex === idx ? 'bg-sand/40' : 'hover:bg-sand/30'"
          @click="selectProduct(product)"
          @mouseenter="highlightedIndex = idx"
        >
          <!-- تصویر بندانگشتی و عنوان -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative w-12 aspect-4/5 rounded-xl overflow-hidden bg-sand/30 shrink-0 border border-sand/40">
              <NuxtImg
                :src="product.primary_image"
                :alt="product.title"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="text-xs font-bold truncate block"
                >
                  <span
                    v-for="(part, partIdx) in highlightMatch(product.title, query)"
                    :key="partIdx"
                    :class="part.isMatch ? 'text-rose font-bold' : 'text-ink'"
                  >
                    {{ part.text }}
                  </span>
                </span>

                <span
                  class="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                  :class="product.division === 'accessories' ? 'bg-sage/10 text-sage' : 'bg-rose/10 text-rose'"
                >
                  {{ product.division === 'accessories' ? 'اکسسوری' : 'پوشاک' }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{{ getCategoryLabel(product.category) }}</span>
                <span v-if="product.season" class="text-[9px] text-muted-foreground/80">
                  ({{ getSeasonLabel(product.season) }})
                </span>
                <span
                  v-if="!product.inStock"
                  class="text-[9px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.2 rounded-full"
                >
                  ناموجود
                </span>
              </div>
            </div>
          </div>

          <!-- قیمت کالا -->
          <div class="text-end shrink-0 space-y-0.5">
            <div class="text-xs font-bold text-ink">
              {{ formatToman(product.price) }}
            </div>
            <div
              v-if="product.compare_at_price && product.compare_at_price > product.price"
              class="text-[10px] text-muted-foreground line-through"
            >
              {{ formatToman(product.compare_at_price) }}
            </div>
          </div>
        </div>
      </div>

      <!-- ۳. حالت عدم یافت نتیجه (Empty State) -->
      <div
        v-else-if="suggestions && suggestions.products.length === 0 && !isLoading"
        class="p-6 text-center space-y-3"
      >
        <div class="w-10 h-10 rounded-full bg-sand/40 text-muted-foreground mx-auto flex items-center justify-center">
          <Search class="w-5 h-5" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-bold text-ink">
            هیچ محصولی مطابق با جست‌وجوی شما یافت نشد
          </p>
          <p class="text-xs text-muted-foreground">
            املای کلمه را بررسی کنید یا عبارت دیگری مانند «لگ»، «تاپ» یا «نیم‌تنه» را جست‌وجو نمایید.
          </p>
        </div>
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-rose hover:underline pt-1"
          @click="$emit('close')"
        >
          <span>مشاهده همه محصولات فروشگاه</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- ۴. دکمه مشاهده تمامی نتایج در فوتر -->
      <div
        v-if="suggestions && suggestions.totalMatches > 0"
        class="p-2.5 border-t border-sand/40 bg-sand/20"
      >
        <button
          type="button"
          class="w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold text-ink hover:text-rose hover:bg-sand/40 transition-colors cursor-pointer text-start"
          @click="executeFullSearch"
        >
          <span>مشاهده تمام نتایج ({{ toFa(suggestions.totalMatches) }} کالا)</span>
          <ArrowLeft class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
