<!-- frontend/app/components/ops/lookbooks/AdminLookbookForm.vue -->
<script setup lang="ts">
import {
  ArrowRight,
  Save,
  Sparkles,
  Upload,
  Search,
  X,
  MapPin,
  Check,
  Layers,
  Percent,
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
  linkedItems.value = props.initialLookbook.items.map((it) => ({
    productId: it.id,
    productSlug: it.slug,
    title: it.title,
    price: it.price,
    image: it.image,
    hotspot_x: it.hotspot_x ?? it.hotspot?.right ?? 50,
    hotspot_y: it.hotspot_y ?? it.hotspot?.top ?? 50,
  }))
}

// Active item currently selected for hotspot positioning
const activePinIndex = ref<number>(0)

// Product catalog search
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
    if (activePinIndex.value >= linkedItems.value.length) {
      activePinIndex.value = Math.max(0, linkedItems.value.length - 1)
    }
  } else {
    if (linkedItems.value.length >= 6) {
      toast.warning('حداکثر ۶ قلم کالا را می‌توانید در یک ست متصل نمایید.')
      return
    }

    const defaultY = 30 + linkedItems.value.length * 20
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
  linkedItems.value.splice(index, 1)
  if (activePinIndex.value >= linkedItems.value.length) {
    activePinIndex.value = Math.max(0, linkedItems.value.length - 1)
  }
}

// Hotspot click handler on cover image
const imageContainerRef = ref<HTMLDivElement | null>(null)

const handleImageClick = (e: MouseEvent) => {
  if (!imageContainerRef.value || linkedItems.value.length === 0) return

  const rect = imageContainerRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  // Percentage from 0 to 100
  const pctX = Math.round(((clickX / rect.width) * 100) * 10) / 10
  const pctY = Math.round(((clickY / rect.height) * 100) * 10) / 10

  const targetIdx = activePinIndex.value
  if (linkedItems.value[targetIdx]) {
    linkedItems.value[targetIdx].hotspot_x = Math.max(2, Math.min(98, pctX))
    linkedItems.value[targetIdx].hotspot_y = Math.max(2, Math.min(98, pctY))
    toast.success(`نقطه «${linkedItems.value[targetIdx].title}» تنظیم شد.`)
  }
}

// Preset cover images
const presetCovers = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
]

// Submit handler
const handleSubmit = async () => {
  if (!title.value.trim()) {
    toast.error('لطفاً عنوان ست را وارد نمایید.')
    return
  }

  if (!coverImage.value.trim()) {
    toast.error('لطفاً آدرس یا تصویر کاور ست را انتخاب نمایید.')
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
    cover_image: coverImage.value.trim(),
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
  <div class="space-y-6 max-w-5xl mx-auto pb-20" dir="rtl" data-testid="lookbook-form">
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
            {{ isEditMode ? 'ویرایش ست استایل ادیتوریال' : 'طراحی و ساخت ست جدید (Lookbook)' }}
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
      <!-- ستون اطلاعات اصلی ست (راست) -->
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
              class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
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
              class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
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
              class="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all leading-relaxed"
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
                  class="w-full h-10 ps-8 pe-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
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
                class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
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

        <!-- کارت تصویر کاور ست -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Upload class="w-4 h-4 text-amber-500" />
            <span>تصویر کاور استایل ادیتوریال</span>
          </h2>

          <div class="space-y-1 text-start">
            <label class="text-xs font-bold text-slate-700 block">
              آدرس مستقیم تصویر کاور <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="coverImage"
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              class="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-mono"
              data-testid="lookbook-cover-input"
            >
          </div>

          <!-- کاورهای پیشنهادی فوری -->
          <div class="space-y-1.5 text-start">
            <span class="text-[11px] text-slate-500 block">تصاویر پیشنهادی پیش‌فرض:</span>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(img, idx) in presetCovers"
                :key="idx"
                type="button"
                class="rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer relative"
                :class="coverImage === img ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'"
                @click="coverImage = img"
              >
                <img :src="img" class="w-full h-full object-cover">
              </button>
            </div>
          </div>
        </div>

        <!-- کارت انتخاب و اتصال محصولات کاتالوگ -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers class="w-4 h-4 text-amber-500" />
              <span>انتخاب محصولات تشکیل‌دهنده ست ({{ toFa(linkedItems.length) }} آیتم)</span>
            </h2>
            <span class="text-[11px] text-slate-500">بین ۲ تا ۴ کالا پیشنهاد می‌شود</span>
          </div>

          <!-- جستجوی زنده کاتالوگ -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جست‌وجوی کالا در کاتالوگ فروشگاه..."
              class="w-full h-10 ps-10 pe-3 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
              data-testid="lookbook-product-search"
            >
            <Search class="w-4 h-4 text-slate-400 absolute start-3.5 top-3" />
          </div>

          <!-- لیست پیشنهادات کاتالوگ -->
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
      </div>

      <!-- ستون پیش‌نمایش تصویر و تنظیم هات‌اسپات‌ها (چپ) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 sticky top-20">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin class="w-4 h-4 text-amber-500" />
              <span>موقعیت‌یابی هات‌اسپات‌ها (Interactive Pins)</span>
            </h2>
            <span class="text-[11px] text-slate-500">برای نشاندن پین، روی عکس بزنید</span>
          </div>

          <!-- انتخاب محصول فعال برای پین‌گذاری -->
          <div v-if="linkedItems.length > 0" class="space-y-1.5">
            <label class="text-[11px] font-bold text-slate-600 block text-start">
              محصول هدف برای نشانه‌گذاری:
            </label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(it, idx) in linkedItems"
                :key="idx"
                type="button"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                :class="[
                  activePinIndex === idx
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ]"
                @click="activePinIndex = idx"
              >
                <span class="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] flex items-center justify-center font-mono">
                  {{ idx + 1 }}
                </span>
                <span class="truncate max-w-[120px]">{{ it.title }}</span>
              </button>
            </div>
          </div>

          <!-- کانتینر تعاملی تصویر کاور جهت کلیک و پین‌گذاری -->
          <div
            v-if="coverImage"
            ref="imageContainerRef"
            class="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200 cursor-crosshair select-none group shadow-inner"
            title="برای تغییر موقعیت پین محصول انتخاب‌شده کلیک کنید"
            data-testid="lookbook-hotspot-canvas"
            @click="handleImageClick"
          >
            <img
              :src="coverImage"
              :alt="title"
              class="w-full h-full object-cover pointer-events-none"
            >

            <!-- پین‌های هات‌اسپات فعال روی تصویر -->
            <div
              v-for="(it, idx) in linkedItems"
              :key="idx"
              class="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-150"
              :style="{ left: `${it.hotspot_x}%`, top: `${it.hotspot_y}%` }"
            >
              <div
                class="relative flex items-center justify-center w-7 h-7 rounded-full text-slate-900 font-mono text-xs font-bold shadow-lg border-2 border-white transition-transform"
                :class="activePinIndex === idx ? 'bg-amber-400 scale-125 ring-4 ring-amber-400/40' : 'bg-white/95 scale-100'"
              >
                <span>{{ idx + 1 }}</span>
              </div>
            </div>

            <!-- راهنمای بالای تصویر -->
            <div class="absolute top-2.5 inset-x-2.5 z-10 px-2.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] text-center pointer-events-none">
              محصول شماره {{ activePinIndex + 1 }} فعال است. روی تصویر بزنید تا پین در آنجا قرار گیرد.
            </div>
          </div>

          <div v-else class="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
            <Upload class="w-8 h-8" />
            <span class="text-xs font-medium">تصویر کاور را وارد کنید تا پیش‌نمایش هات‌اسپات فعال گردد.</span>
          </div>

          <!-- لیست محصولات متصل با مختصات و دکمه حذف -->
          <div v-if="linkedItems.length > 0" class="space-y-2 pt-2 border-t border-slate-100">
            <div
              v-for="(it, idx) in linkedItems"
              :key="idx"
              class="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-slate-50/60 text-xs"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <span class="font-bold text-slate-800 truncate block max-w-[140px]">{{ it.title }}</span>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  X: {{ toFa(it.hotspot_x) }}٪ | Y: {{ toFa(it.hotspot_y) }}٪
                </span>
                <button
                  type="button"
                  class="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="حذف از ست"
                  @click="removeLinkedItem(idx)"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
