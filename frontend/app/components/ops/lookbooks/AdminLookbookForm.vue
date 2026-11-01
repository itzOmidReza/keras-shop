<!-- frontend/app/components/ops/lookbooks/AdminLookbookForm.vue -->
<script setup lang="ts">
import {
  ArrowRight,
  Save,
  Sparkles,
  UploadCloud,
  Search,
  X,
  MapPin,
  Check,
  Layers,
  Percent,
  Trash2,
  Plus,
  Link2,
  Tag,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { toFa, formatToman } from '~/utils/format'
import type { Product, StyleLookbook } from '~/types/domain'

const props = defineProps<{
  initialLookbook?: StyleLookbook | null
  isEditMode?: boolean
}>()

const router = useRouter()
const { createLookbook, updateLookbook, isLoading: isSaving } = useAdminLookbooks()
const { getProducts } = useProducts()

// Form reactive states
const title = ref(props.initialLookbook?.title || '')
const tagline = ref(props.initialLookbook?.tagline || props.initialLookbook?.subtitle || '')
const description = ref(props.initialLookbook?.description || '')
const coverImage = ref(props.initialLookbook?.cover_image || props.initialLookbook?.image || '')
const coverPreview = ref<string>(coverImage.value)
const discountPercent = ref(props.initialLookbook?.discount_percent ?? 10)
const displayOrder = ref(props.initialLookbook?.display_order ?? 0)
const isActive = ref(props.initialLookbook?.is_active ?? true)

// Linked items: each holds product info + hotspot_x + hotspot_y
interface FormLookItem {
  productId: string | number
  productSlug: string
  title: string
  price: number
  image: string
  hotspot_x: number
  hotspot_y: number
}

const linkedItems = ref<FormLookItem[]>([])

// Populate existing items in edit mode
if (props.initialLookbook?.items) {
  linkedItems.value = props.initialLookbook.items.map(it => ({
    productId: it.id,
    productSlug: it.slug,
    title: it.title,
    price: it.price,
    image: it.image,
    hotspot_x: it.hotspot_x ?? it.hotspot?.right ?? 50,
    hotspot_y: it.hotspot_y ?? it.hotspot?.top ?? 50,
  }))
}

// Active item currently selected / focused
const activePinIndex = ref<number | null>(null)

// Catalog products state
const catalogProducts = ref<Product[]>([])
const searchQuery = ref('')
const debouncedQuery = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedQuery.value = val.trim().toLowerCase()
  }, 300)
})

onMounted(async () => {
  try {
    const prods = await getProducts()
    if (Array.isArray(prods)) {
      catalogProducts.value = prods
    }
  } catch (err) {
    console.error('Failed to load products in lookbook form:', err)
  }
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  if (popoverSearchTimer) clearTimeout(popoverSearchTimer)
})

const filteredCatalog = computed(() => {
  if (!debouncedQuery.value) return catalogProducts.value.slice(0, 8)
  const q = debouncedQuery.value
  return catalogProducts.value
    .filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    )
    .slice(0, 8)
})

const isProductSelected = (productId: number | string, productSlug: string) => {
  return linkedItems.value.some(
    it => String(it.productId) === String(productId) || it.productSlug === productSlug,
  )
}

const toggleProduct = (prod: Product) => {
  const existingIdx = linkedItems.value.findIndex(
    it => String(it.productId) === String(prod.id) || it.productSlug === prod.slug,
  )

  if (existingIdx !== -1) {
    linkedItems.value.splice(existingIdx, 1)
    if (activePinIndex.value === existingIdx) {
      activePinIndex.value = null
    } else if (activePinIndex.value !== null && activePinIndex.value > existingIdx) {
      activePinIndex.value--
    }
  } else {
    if (linkedItems.value.length >= 6) {
      toast.warning('حداکثر ۶ قلم کالا را می‌توانید در یک ست متصل نمایید.')
      return
    }

    const defaultY = Math.min(85, 30 + linkedItems.value.length * 18)
    const defaultX = 50

    linkedItems.value.push({
      productId: prod.id,
      productSlug: prod.slug,
      title: prod.title,
      price: prod.price ?? prod.base_price,
      image: prod.images?.[0]?.url || '',
      hotspot_x: defaultX,
      hotspot_y: defaultY,
    })
    activePinIndex.value = linkedItems.value.length - 1
  }
}

const removeLinkedItem = (index: number) => {
  const item = linkedItems.value[index]
  linkedItems.value.splice(index, 1)
  if (activePinIndex.value === index) {
    activePinIndex.value = null
  } else if (activePinIndex.value !== null && activePinIndex.value > index) {
    activePinIndex.value--
  }
  toast.info(`«${item?.title || 'آیتم'}» از ست حذف شد.`)
}

// ----------------------------------------------------
// 1. Cover Image Native Dropzone & Controls
// ----------------------------------------------------
const coverFileInput = ref<HTMLInputElement | null>(null)
const isDraggingCover = ref(false)
const showUrlInput = ref(false)
const isUploadingCover = ref(false)

const onUrlInput = () => {
  if (coverImage.value.trim()) {
    coverPreview.value = coverImage.value.trim()
  }
}

const handleImageError = () => {
  console.warn('Cover preview image encountered load error, keeping persistent preview state.')
}

const handleCoverFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب نمایید.')
    return
  }

  isUploadingCover.value = true

  // Fast persistent client-side preview via FileReader (base64 Data URL)
  const reader = new FileReader()
  reader.onload = () => {
    coverPreview.value = reader.result as string
    toast.success('تصویر کاور با موفقیت بارگذاری شد.')
  }
  reader.readAsDataURL(file)

  // Background upload to backend if authenticated:
  // sets coverImage quietly without touching coverPreview or unmounting the canvas
  try {
    const authStore = useAuthStore()
    const headers = authStore.getAuthHeaders()
    const formData = new FormData()
    formData.append('file', file)

    const res = await $fetch<{ url: string }>('/api/admin/products/upload', {
      method: 'POST',
      body: formData,
      headers,
    })
    if (res?.url) {
      coverImage.value = res.url
    }
  } catch (err) {
    console.warn('Storage upload endpoint returned error, using local data URL fallback:', err)
  } finally {
    isUploadingCover.value = false
    if (coverFileInput.value) coverFileInput.value.value = ''
  }
}

const handleCoverFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    handleCoverFile(input.files[0])
  }
}

const handleCoverDrop = (e: DragEvent) => {
  isDraggingCover.value = false
  if (e.dataTransfer?.files?.[0]) {
    handleCoverFile(e.dataTransfer.files[0])
  }
}

const removeCoverImage = () => {
  coverPreview.value = ''
  coverImage.value = ''
  if (coverFileInput.value) coverFileInput.value.value = ''
}

// ----------------------------------------------------
// 2. Click-to-Tag Visual Hotspot Workflow
// ----------------------------------------------------
const imageContainerRef = ref<HTMLDivElement | null>(null)
const pendingHotspot = ref<{ x: number; y: number } | null>(null)
const isTaggingModalOpen = ref(false)
const popoverSearchQuery = ref('')
const popoverDebouncedQuery = ref('')
let popoverSearchTimer: ReturnType<typeof setTimeout> | null = null

watch(popoverSearchQuery, (val) => {
  if (popoverSearchTimer) clearTimeout(popoverSearchTimer)
  popoverSearchTimer = setTimeout(() => {
    popoverDebouncedQuery.value = val.trim().toLowerCase()
  }, 300)
})

const popoverFilteredCatalog = computed(() => {
  if (!popoverDebouncedQuery.value) return catalogProducts.value.slice(0, 10)
  const q = popoverDebouncedQuery.value
  return catalogProducts.value
    .filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q),
    )
    .slice(0, 10)
})

const handleCanvasClick = (e: MouseEvent) => {
  if (!imageContainerRef.value || (!coverPreview.value && !coverImage.value)) return

  const rect = imageContainerRef.value.getBoundingClientRect()
  // RTL coordinate: distance from the right edge in percentage
  const clickFromRight = rect.right - e.clientX
  const pctX = Math.round(((clickFromRight / rect.width) * 100) * 10) / 10
  const pctY = Math.round(((e.clientY - rect.top) / rect.height) * 100 * 10) / 10

  const boundedX = Math.max(3, Math.min(97, pctX))
  const boundedY = Math.max(3, Math.min(97, pctY))

  // If a pin is currently active, clicking on canvas repositions that pin
  if (activePinIndex.value !== null) {
    const activeItem = linkedItems.value[activePinIndex.value]
    if (activeItem) {
      activeItem.hotspot_x = boundedX
      activeItem.hotspot_y = boundedY
      toast.success(`موقعیت پین «${activeItem.title}» تغییر یافت.`)
      return
    }
  }

  // Otherwise start a new pending hotspot & open product picker
  pendingHotspot.value = { x: boundedX, y: boundedY }
  popoverSearchQuery.value = ''
  popoverDebouncedQuery.value = ''
  isTaggingModalOpen.value = true
}

const selectProductForHotspot = (prod: Product) => {
  if (!pendingHotspot.value) return

  if (linkedItems.value.length >= 6) {
    toast.warning('حداکثر ۶ قلم کالا را می‌توانید در یک ست متصل نمایید.')
    cancelPendingHotspot()
    return
  }

  const existingIdx = linkedItems.value.findIndex(
    it => String(it.productId) === String(prod.id) || it.productSlug === prod.slug,
  )

  if (existingIdx !== -1) {
    const existingItem = linkedItems.value[existingIdx]
    if (existingItem) {
      existingItem.hotspot_x = pendingHotspot.value.x
      existingItem.hotspot_y = pendingHotspot.value.y
      activePinIndex.value = existingIdx
      toast.info(`موقعیت «${prod.title}» روی تصویر به‌روزرسانی شد.`)
    }
  } else {
    linkedItems.value.push({
      productId: prod.id,
      productSlug: prod.slug,
      title: prod.title,
      price: prod.price ?? prod.base_price,
      image: prod.images?.[0]?.url || '',
      hotspot_x: pendingHotspot.value.x,
      hotspot_y: pendingHotspot.value.y,
    })
    activePinIndex.value = linkedItems.value.length - 1
    toast.success(`«${prod.title}» روی تصویر نشانه‌گذاری و به ست افزوده شد.`)
  }

  cancelPendingHotspot()
}

const cancelPendingHotspot = () => {
  pendingHotspot.value = null
  isTaggingModalOpen.value = false
}

const handlePinClick = (idx: number, e: MouseEvent) => {
  e.stopPropagation()
  if (activePinIndex.value === idx) {
    activePinIndex.value = null
  } else {
    activePinIndex.value = idx
  }
}

// ----------------------------------------------------
// 3. Live Pricing Calculations
// ----------------------------------------------------
const bundleTotalPrice = computed(() => {
  return linkedItems.value.reduce((sum, it) => sum + (it.price || 0), 0)
})

const bundleDiscountedPrice = computed(() => {
  const discount = Number(discountPercent.value) || 0
  return Math.round((bundleTotalPrice.value * (100 - discount)) / 100)
})

const bundleDiscountAmount = computed(() => {
  return bundleTotalPrice.value - bundleDiscountedPrice.value
})

// ----------------------------------------------------
// 4. Submit handler
// ----------------------------------------------------
const handleSubmit = async () => {
  if (!title.value.trim()) {
    toast.error('لطفاً عنوان ست را وارد نمایید.')
    return
  }

  const finalCover = coverImage.value.trim() || coverPreview.value.trim()
  if (!finalCover) {
    toast.error('لطفاً تصویر کاور ست را بارگذاری نمایید.')
    return
  }

  if (linkedItems.value.length === 0) {
    toast.error('حداقل یک محصول باید به ست متصل گردد.')
    return
  }

  const payload = {
    title: title.value.trim(),
    tagline: tagline.value.trim() || undefined,
    description: description.value.trim(),
    cover_image: finalCover,
    discount_percent: Number(discountPercent.value) || 0,
    display_order: Number(displayOrder.value) || 0,
    is_active: isActive.value,
    items: linkedItems.value.map(it => ({
      product_id: it.productId,
      hotspot_x: it.hotspot_x,
      hotspot_y: it.hotspot_y,
    })),
  }

  if (props.isEditMode && props.initialLookbook?.id) {
    const res = await updateLookbook(props.initialLookbook.id, payload)
    if (res) {
      router.push('/internal-ops-nexus/lookbooks')
    }
  } else {
    const res = await createLookbook(payload)
    if (res) {
      router.push('/internal-ops-nexus/lookbooks')
    }
  }
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-20 font-sans" dir="rtl" data-testid="lookbook-form">
    <!-- هدر فرم با دکمه بازگشت و دکمه ذخیره -->
    <div class="flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/internal-ops-nexus/lookbooks"
          class="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="بازگشت به فهرست ست‌ها"
        >
          <ArrowRight class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-base sm:text-lg font-bold text-slate-900">
            {{ isEditMode ? 'ویرایش ست استایل ادیتوریال' : 'طراحی و ساخت ست جدید' }}
          </h1>
          <p class="text-xs text-slate-500">
            پیکربندی اقلام مکمل، هات‌اسپات‌های تعاملی و درصد تخفیف پکیج
          </p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isSaving"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-98"
        data-testid="save-lookbook-button"
        @click="handleSubmit"
      >
        <Save class="w-4 h-4" />
        <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره ست' }}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- ستون اطلاعات اصلی ست (راست: ۷ ستون) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- کارت مشخصات عمومی -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <span>مشخصات و عنوان استایل</span>
          </h2>

          <!-- عنوان ست -->
          <div class="space-y-1 text-start">
            <label class="text-xs font-bold text-slate-700 block">
              عنوان ست <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="مثال: استایل ادیتوریال پاییزه"
              class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
              data-testid="lookbook-title-input"
            >
          </div>

          <!-- زیرعنوان / تگ لاین -->
          <div class="space-y-1 text-start">
            <label class="text-xs font-bold text-slate-700 block">
              زیرعنوان یا برچسب کالکشن
            </label>
            <input
              v-model="tagline"
              type="text"
              placeholder="مثال: کالکشن جدید — پاییز ۱۴۰۵"
              class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
              data-testid="lookbook-tagline-input"
            >
          </div>

          <!-- توضیحات ادیتوریال -->
          <div class="space-y-1 text-start">
            <label class="text-xs font-bold text-slate-700 block">
              توضیحات ادیتوریال و فلسفه ست
            </label>
            <textarea
              v-model="description"
              rows="3"
              placeholder="توضیحاتی پیرامون هماهنگی بافت‌ها، فرم‌ها و رنگ‌های این ست بنویسید..."
              class="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all leading-relaxed"
              data-testid="lookbook-description-input"
            />
          </div>

          <!-- ردیف درصد تخفیف، ترتیب و وضعیت انتشار -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <!-- درصد تخفیف -->
            <div class="space-y-1 text-start">
              <label class="text-xs font-bold text-slate-700 block">
                تخفیف پکیج (درصد)
              </label>
              <div class="relative">
                <input
                  v-model.number="discountPercent"
                  type="number"
                  min="0"
                  max="90"
                  class="w-full h-10 ps-8 pe-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                  data-testid="lookbook-discount-input"
                >
                <Percent class="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-3.5" />
              </div>
            </div>

            <!-- ترتیب نمایش -->
            <div class="space-y-1 text-start">
              <label class="text-xs font-bold text-slate-700 block">
                ترتیب نمایش
              </label>
              <input
                v-model.number="displayOrder"
                type="number"
                min="0"
                class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                data-testid="lookbook-order-input"
              >
            </div>

            <!-- وضعیت نمایش -->
            <div class="space-y-1 text-start">
              <label class="text-xs font-bold text-slate-700 block">
                وضعیت انتشار
              </label>
              <button
                type="button"
                class="w-full h-10 rounded-xl text-xs font-bold transition-colors border cursor-pointer"
                :class="[
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
                ]"
                data-testid="lookbook-active-toggle"
                @click="isActive = !isActive"
              >
                {{ isActive ? 'فعال در صفحه اصلی' : 'پیش‌نویس / غیرفعال' }}
              </button>
            </div>
          </div>
        </div>

        <!-- کارت آپلود نیتیو دراپ‌زون تصویر کاور ست -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud class="w-4 h-4 text-amber-500" />
              <span>تصویر کاور استایل ادیتوریال</span>
            </h2>
            <div v-if="coverPreview || coverImage" class="flex items-center gap-2">
              <button
                type="button"
                class="text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                @click="coverFileInput?.click()"
              >
                تغییر تصویر
              </button>
              <span class="text-slate-300">|</span>
              <button
                type="button"
                class="text-[11px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                @click="removeCoverImage"
              >
                حذف تصویر
              </button>
            </div>
          </div>

          <!-- ورودی مخفی فایل -->
          <input
            ref="coverFileInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="handleCoverFileChange"
          >

          <!-- ناحیه دراپ‌زون / پیش‌نمایش تصویر کاور -->
          <div
            v-if="!coverPreview && !coverImage"
            class="group relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none"
            :class="[
              isDraggingCover
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-200/90 hover:border-slate-400 bg-slate-50/40 hover:bg-slate-50',
            ]"
            @dragover.prevent="isDraggingCover = true"
            @dragleave.prevent="isDraggingCover = false"
            @drop.prevent="handleCoverDrop"
            @click="coverFileInput?.click()"
          >
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud class="w-6 h-6" />
            </div>
            <p class="text-xs font-bold text-slate-800 mb-1">
              {{ isUploadingCover ? 'در حال بارگذاری فایل...' : 'کلیک کنید یا تصویر مدل استایل را به اینجا بکشید' }}
            </p>
            <p class="text-[11px] text-slate-400">
              فرمت‌های مجاز: JPG, PNG, WebP — ترجیحاً ابعاد عمودی ۴:۵ یا استودیو مد
            </p>
          </div>

          <!-- نمایش تصویر بارگذاری شده به همراه اطلاعات کوچک -->
          <div v-else class="flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <img
              :src="coverPreview || coverImage"
              alt="کاور انتخاب‌شده"
              class="w-14 h-18 rounded-lg object-cover bg-slate-200 border border-slate-300 shrink-0"
              @error="handleImageError"
            >
            <div class="min-w-0 flex-1 space-y-1">
              <span class="text-xs font-bold text-slate-800 block truncate">کاور ادیتوریال فعال شد</span>
              <span class="text-[11px] text-slate-500 block truncate">
                اکنون می‌توانید در کادر سمت چپ مستقیماً روی لباس یا اکسسوری‌ها کلیک کرده و محصول متصل نمایید.
              </span>
            </div>
          </div>

          <!-- تاگل و ورودی آدرس مستقیم URL (در صورت تمایل به وارد کردن لینک اینترنتی) -->
          <div class="pt-1">
            <button
              type="button"
              class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              @click="showUrlInput = !showUrlInput"
            >
              <Link2 class="w-3.5 h-3.5 text-slate-400" />
              <span>یا وارد کردن آدرس مستقیم اینترنتی تصویر</span>
              <ChevronDown v-if="!showUrlInput" class="w-3 h-3 text-slate-400" />
              <ChevronUp v-else class="w-3 h-3 text-slate-400" />
            </button>

            <div v-if="showUrlInput" class="mt-2 space-y-1 text-start animate-in fade-in duration-150">
              <input
                v-model="coverImage"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                class="w-full h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-mono"
                data-testid="lookbook-cover-input"
                @input="onUrlInput"
              >
            </div>
          </div>
        </div>

        <!-- کارت کاتالوگ و محصولات متصل -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers class="w-4 h-4 text-amber-500" />
              <span>محصولات تشکیل‌دهنده ست ({{ toFa(linkedItems.length) }} آیتم)</span>
            </h2>
            <span class="text-[11px] text-slate-500">حداکثر ۶ محصول</span>
          </div>

          <!-- جستجوی زنده کاتالوگ -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جست‌وجوی سریع کالا در کاتالوگ فروشگاه..."
              class="w-full h-10 ps-10 pe-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
              data-testid="lookbook-product-search"
            >
            <Search class="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
          </div>

          <!-- لیست پیشنهادات کاتالوگ جهت اتصال سریع -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/30">
            <button
              v-for="prod in filteredCatalog"
              :key="prod.id"
              type="button"
              class="flex items-center gap-2.5 p-2 rounded-xl text-start border transition-all cursor-pointer"
              :class="[
                isProductSelected(prod.id, prod.slug)
                  ? 'bg-amber-50/80 border-amber-300 text-slate-900 shadow-2xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700',
              ]"
              @click="toggleProduct(prod)"
            >
              <img
                :src="prod.images?.[0]?.url || '/placeholder.jpg'"
                class="w-9 h-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
              >
              <div class="min-w-0 flex-1">
                <span class="text-xs font-bold block truncate">{{ prod.title }}</span>
                <span class="text-[10px] text-amber-700 font-bold block">{{ formatToman(prod.price ?? prod.base_price) }}</span>
              </div>
              <div
                class="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                :class="isProductSelected(prod.id, prod.slug) ? 'bg-amber-500 text-white' : 'border border-slate-300 text-transparent'"
              >
                <Check class="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

        <!-- کارت خلاصه مالی و تخفیف پکیج ست ادیتوریال -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm space-y-3">
          <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div class="flex items-center gap-2 text-xs font-bold">
              <ShoppingBag class="w-4 h-4 text-amber-400" />
              <span>محاسبه بلادرنگ قیمت و تخفیف پکیج</span>
            </div>
            <span class="text-[11px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {{ toFa(discountPercent) }}٪ تخفیف
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <span class="text-[11px] text-slate-400 block mb-1">مجموع قیمت تکی اقلام:</span>
              <span class="font-bold text-slate-200 font-mono">{{ formatToman(bundleTotalPrice) }}</span>
            </div>
            <div class="bg-white/5 rounded-xl p-3 border border-white/5">
              <span class="text-[11px] text-emerald-400 block mb-1">میزان سود خریدار:</span>
              <span class="font-bold text-emerald-400 font-mono">{{ formatToman(bundleDiscountAmount) }}-</span>
            </div>
            <div class="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
              <span class="text-[11px] text-amber-300 block mb-1">قیمت نهایی باندل:</span>
              <span class="font-bold text-white text-sm font-mono">{{ formatToman(bundleDiscountedPrice) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ستون بوم کلیک و نشانه‌گذاری هات‌اسپات (چپ: ۵ ستون) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 sticky top-20">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-amber-500" />
              <span>نشانه‌گذاری قطعات استایل روی تصویر</span>
            </h2>
            <span class="text-[11px] text-slate-500">کلیک روی تصویر</span>
          </div>

          <!-- پیام راهنمای تعاملی -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
            <div class="flex items-center gap-1.5 font-bold text-slate-800">
              <Tag class="w-3.5 h-3.5 text-amber-600" />
              <span>گردش‌کار سریع Instagram / Pinterest:</span>
            </div>
            <p class="leading-relaxed">
              روی هر نقطه‌ای از تصویر مدل کلیک کنید تا پنجره جستجو و اتصال سریع کالا برای آن نقطه باز شود.
            </p>
          </div>

          <!-- کانتینر تعاملی تصویر مدل -->
          <div
            v-if="coverPreview || coverImage"
            ref="imageContainerRef"
            class="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200 cursor-crosshair select-none group shadow-inner"
            title="برای نشانه‌گذاری کالا روی تصویر کلیک کنید"
            data-testid="lookbook-hotspot-canvas"
            @click="handleCanvasClick"
          >
            <img
              :src="coverPreview || coverImage"
              :alt="title"
              class="w-full h-full object-cover pointer-events-none"
              @error="handleImageError"
            >

            <!-- پین‌های هات‌اسپات فعال روی تصویر -->
            <div
              v-for="(it, idx) in linkedItems"
              :key="idx"
              class="absolute z-20 cursor-pointer transition-transform"
              :style="{
                top: `${it.hotspot_y}%`,
                right: `${it.hotspot_x}%`,
                transform: 'translate(50%, -50%)',
              }"
              @click="handlePinClick(idx, $event)"
            >
              <!-- نشانگر پین دایره‌ای با انیمیشن و شماره -->
              <div
                class="relative flex items-center justify-center w-8 h-8 rounded-full text-slate-900 font-mono text-xs font-bold shadow-lg border-2 border-white transition-all active:scale-95"
                :class="[
                  activePinIndex === idx
                    ? 'bg-amber-400 scale-110 ring-4 ring-amber-400/40 text-slate-950'
                    : 'bg-white/95 hover:scale-105 hover:bg-white',
                ]"
              >
                <span>{{ idx + 1 }}</span>
                <span
                  v-if="activePinIndex === idx"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 pointer-events-none"
                />
              </div>
            </div>

            <!-- نشانگر موقت برای نقطه انتخاب‌شده جدید قبل از انتخاب کالا -->
            <div
              v-if="pendingHotspot"
              class="absolute z-25 pointer-events-none"
              :style="{
                top: `${pendingHotspot.y}%`,
                right: `${pendingHotspot.x}%`,
                transform: 'translate(50%, -50%)',
              }"
            >
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold shadow-xl border-2 border-white scale-110">
                <Plus class="w-4 h-4 animate-spin-slow" />
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              </div>
            </div>

            <!-- پاپ‌اور گلس‌مورفیسم جستجو و انتخاب مستقیم کالا برای نقطه کلیک‌شده -->
            <div
              v-if="isTaggingModalOpen"
              class="absolute inset-0 z-30 bg-slate-950/50 backdrop-blur-xs flex flex-col justify-end p-3 animate-in fade-in duration-150"
              @click.stop
            >
              <div class="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 space-y-3 max-h-[85%] flex flex-col">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Tag class="w-4 h-4 text-amber-500" />
                    <span>انتخاب کالا برای این نقطه</span>
                  </div>
                  <button
                    type="button"
                    class="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    @click="cancelPendingHotspot"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>

                <!-- ورودی جستجوی کالا برای هات‌اسپات -->
                <div class="relative">
                  <input
                    v-model="popoverSearchQuery"
                    type="text"
                    autofocus
                    placeholder="جستجوی کالا برای این نقطه..."
                    class="w-full h-9 ps-9 pe-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
                  >
                  <Search class="w-3.5 h-3.5 text-slate-400 absolute start-3 top-2.5" />
                </div>

                <!-- نتایج فیلترشده در پاپ‌اور -->
                <div class="overflow-y-auto space-y-1.5 flex-1 pe-1 max-h-48">
                  <button
                    v-for="prod in popoverFilteredCatalog"
                    :key="prod.id"
                    type="button"
                    class="w-full flex items-center gap-2 p-1.5 rounded-xl border text-start transition-all cursor-pointer hover:bg-amber-50/60 hover:border-amber-200"
                    :class="[
                      isProductSelected(prod.id, prod.slug)
                        ? 'border-amber-300 bg-amber-50/40 text-slate-900'
                        : 'border-slate-100 bg-white text-slate-700',
                    ]"
                    @click="selectProductForHotspot(prod)"
                  >
                    <img
                      :src="prod.images?.[0]?.url || '/placeholder.jpg'"
                      class="w-8 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    >
                    <div class="min-w-0 flex-1">
                      <span class="text-xs font-bold block truncate">{{ prod.title }}</span>
                      <span class="text-[10px] text-amber-700 font-bold block">{{ formatToman(prod.price ?? prod.base_price) }}</span>
                    </div>
                    <span
                      v-if="isProductSelected(prod.id, prod.slug)"
                      class="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-bold"
                    >
                      جابجایی
                    </span>
                    <Plus v-else class="w-4 h-4 text-slate-400 shrink-0" />
                  </button>

                  <div v-if="popoverFilteredCatalog.length === 0" class="py-6 text-center text-xs text-slate-400">
                    کالایی با این عنوان در فروشگاه یافت نشد.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- حالت عدم وجود تصویر -->
          <div
            v-else
            class="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2 cursor-pointer hover:border-slate-300 transition-colors"
            @click="coverFileInput?.click()"
          >
            <UploadCloud class="w-8 h-8 text-slate-300" />
            <span class="text-xs font-bold text-slate-600">تصویر کاور را آپلود کنید</span>
            <span class="text-[10px] text-slate-400">پس از بارگذاری تصویر، بوم تعاملی نشانه‌گذاری قطعات استایل فعال خواهد شد.</span>
          </div>

          <!-- لیست قطعات نشانه‌گذاری شده همراه با مختصات دقیق و دکمه حذف -->
          <div v-if="linkedItems.length > 0" class="space-y-2 pt-2 border-t border-slate-100">
            <label class="text-[11px] font-bold text-slate-600 block text-start">
              قطعات متصل‌شده به تصویر:
            </label>

            <div
              v-for="(it, idx) in linkedItems"
              :key="idx"
              class="flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors"
              :class="[
                activePinIndex === idx
                  ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                  : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50',
              ]"
              @click="activePinIndex = idx"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <img
                  :src="it.image || '/placeholder.jpg'"
                  class="w-7 h-9 rounded-md object-cover bg-slate-200 shrink-0 border border-slate-200"
                >
                <div class="min-w-0">
                  <span class="font-bold text-slate-800 truncate block max-w-[130px]">{{ it.title }}</span>
                  <span class="text-[10px] text-amber-700 font-bold block">{{ formatToman(it.price) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  X: {{ toFa(it.hotspot_x) }}٪ | Y: {{ toFa(it.hotspot_y) }}٪
                </span>
                <button
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="حذف پین و کالا از ست"
                  @click.stop="removeLinkedItem(idx)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
