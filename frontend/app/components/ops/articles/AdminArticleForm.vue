<!-- frontend/app/components/ops/articles/AdminArticleForm.vue -->
<script setup lang="ts">
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Clock,
  User,
  Quote,
  FileText,
  ShoppingBag,
  Check,
  Send,
  Save,
  Wand2,
  UploadCloud,
  Search,
  X,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import type { ArticleCategory, LinkedGarment, ProductListItem } from '~/types/domain'

const props = defineProps<{
  mode: 'new' | 'edit'
  articleId?: number
}>()

const router = useRouter()
const { getArticleById, createArticle, updateArticle } = useAdminArticles()
const { getProducts } = useProducts()
const isSidebarCollapsed = useState('ops_sidebar_collapsed', () => false)
const availableProducts = ref<ProductListItem[]>([])

onMounted(async () => {
  availableProducts.value = await getProducts()
})

// متغیرهای فرم
const title = ref('')
const slug = ref('')
const category = ref<ArticleCategory>('style-guide')
const authorName = ref('')
const authorRole = ref('')
const readTimeMinutes = ref(0)
const coverImage = ref('')
const excerpt = ref('')
const content = ref('')
const pullQuote = ref('')
const selectedProductIds = ref<(number | string)[]>([])
const isSaving = ref(false)

// جستجوی زنده محصولات با دیبانس ۳۰۰ میلی‌ثانیه
const productSearchQuery = ref('')
const debouncedProductSearch = ref('')
let productSearchTimer: ReturnType<typeof setTimeout> | null = null

watch(productSearchQuery, (val) => {
  if (productSearchTimer) clearTimeout(productSearchTimer)
  productSearchTimer = setTimeout(() => {
    debouncedProductSearch.value = val.trim().toLowerCase()
  }, 300)
})

onUnmounted(() => {
  if (productSearchTimer) clearTimeout(productSearchTimer)
})

// کالاهای انتخاب‌شده برای چیپ‌های بالا
const selectedGarments = computed(() => {
  return availableProducts.value
    .filter(p => selectedProductIds.value.includes(p.id))
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price ?? p.base_price,
      image: p.images[0]?.url || '',
      badge: p.badge,
    }))
})

// کالاهای فیلترشده جستجو (حداکثر ۸ مورد برای روان ماندن رندرینگ DOM)
const searchedProducts = computed(() => {
  const q = debouncedProductSearch.value
  let list = availableProducts.value
  if (q) {
    list = list.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        String(p.id).includes(q)
    )
  }
  return list.slice(0, 8)
})

const coverFileInput = ref<HTMLInputElement | null>(null)
const isDraggingCover = ref(false)

const handleCoverFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری معتبر انتخاب کنید.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      coverImage.value = reader.result as string
      toast.success('تصویر کاور مقاله با موفقیت بارگذاری شد.')
    }
    reader.readAsDataURL(file)
  }
}

const handleCoverDrop = (e: DragEvent) => {
  e.preventDefault()
  isDraggingCover.value = false
  if (e.dataTransfer?.files?.[0]) {
    const file = e.dataTransfer.files[0]
    if (!file.type.startsWith('image/')) {
      toast.error('لطفاً یک فایل تصویری معتبر انتخاب کنید.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      coverImage.value = reader.result as string
      toast.success('تصویر کاور مقاله با موفقیت بارگذاری شد.')
    }
    reader.readAsDataURL(file)
  }
}

// بارگذاری داده‌ها در حالت ویرایش
onMounted(() => {
  if (props.mode === 'edit' && props.articleId) {
    const existing = getArticleById(props.articleId)
    if (existing) {
      title.value = existing.title
      slug.value = existing.slug
      category.value = existing.category
      authorName.value = existing.author.name
      authorRole.value = existing.author.role
      // استخراج عدد دقیقه از رشته مثلاً "۵ دقیقه"
      const matchMin = existing.readTime.match(/\d+/)
      readTimeMinutes.value = matchMin ? Number(matchMin[0]) : 5
      coverImage.value = existing.coverImage
      excerpt.value = existing.excerpt
      content.value = existing.sections.map(s => s.content).join('\n\n')
      pullQuote.value = existing.sections.find(s => s.pullQuote)?.pullQuote || ''

      if (existing.linkedProducts) {
        selectedProductIds.value = existing.linkedProducts.map(p => p.id)
      }
    } else {
      toast.error('مقاله مورد نظر جهت ویرایش یافت نشد.')
      router.push('/internal-ops-nexus/articles')
    }
  }
})

// تولید خودکار اسلاگ از عنوان
const autoGenerateSlug = () => {
  if (!title.value.trim()) {
    toast.warning('ابتدا عنوان مقاله را وارد نمایید.')
    return
  }
  slug.value = title.value
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
}

// ضمیمه یا لغو انتخاب کالای فروشگاه
const toggleProductLink = (productId: number | string) => {
  if (selectedProductIds.value.includes(productId)) {
    selectedProductIds.value = selectedProductIds.value.filter(id => id !== productId)
  } else {
    selectedProductIds.value.push(productId)
  }
}

// ساخت لیست کالاهای متصل جهت ذخیره
const getLinkedGarments = (): LinkedGarment[] => {
  return availableProducts.value
    .filter(p => selectedProductIds.value.includes(p.id))
    .map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price ?? p.base_price,
      image: p.images[0]?.url || '',
      badge: p.badge,
    }))
}

// ذخیره فرم به عنوان پیش‌نویس یا انتشار قطعی
const handleSave = async (targetStatus: 'published' | 'draft') => {
  if (!title.value.trim()) {
    toast.error('لطفاً عنوان مقاله را وارد فرمایید.')
    return
  }

  if (!excerpt.value.trim()) {
    toast.error('لطفاً خلاصه و چکیده مقاله را وارد فرمایید.')
    return
  }

  if (!content.value.trim()) {
    toast.error('لطفاً متن اصلی مقاله را درج فرمایید.')
    return
  }

  isSaving.value = true

  const linkedGarments = getLinkedGarments()

  if (props.mode === 'new') {
    await createArticle({
      title: title.value,
      slug: slug.value,
      category: category.value,
      authorName: authorName.value,
      authorRole: authorRole.value,
      readTimeMinutes: readTimeMinutes.value,
      coverImage: coverImage.value,
      excerpt: excerpt.value,
      content: content.value,
      pullQuote: pullQuote.value,
      status: targetStatus,
      linkedProducts: linkedGarments,
    })
    router.push('/internal-ops-nexus/articles')
  } else if (props.mode === 'edit' && props.articleId) {
    await updateArticle(props.articleId, {
      title: title.value,
      slug: slug.value,
      category: category.value,
      authorName: authorName.value,
      authorRole: authorRole.value,
      readTimeMinutes: readTimeMinutes.value,
      coverImage: coverImage.value,
      excerpt: excerpt.value,
      content: content.value,
      pullQuote: pullQuote.value,
      status: targetStatus,
      linkedProducts: linkedGarments,
    })
    router.push('/internal-ops-nexus/articles')
  }

  isSaving.value = false
}
</script>

<template>
  <div class="space-y-6 pb-32 font-sans" dir="rtl" data-testid="admin-article-form">
    <!-- هدر استودیوی نگارش مقاله -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/internal-ops-nexus/articles"
          class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          title="بازگشت به فهرست مقالات"
        >
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
        <div>
          <h1 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-amber-500" />
            <span>{{ mode === 'new' ? 'نگارش روایت و مقاله جدید' : 'ویرایش مقاله ادیتوریال' }}</span>
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            انتشار محتوای مجله، اتصال استایل‌ها و پیوند مستقیم به کاتالوگ فروشگاه
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/internal-ops-nexus/articles"
          class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          انصراف
        </NuxtLink>
      </div>
    </div>

    <!-- فرم دو ستونه ارگونومیک -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- ستون اصلی فرم (۸ ستون) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- بلوک ۱: شناسنامه و مشخصات پایه مقاله -->
        <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText class="w-4 h-4 text-amber-500" />
            <span>مشخصات اصلی مقاله</span>
          </h2>

          <div class="space-y-4">
            <!-- عنوان مقاله -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                عنوان مقاله <span class="text-rose">*</span>
              </label>
              <input
                v-model="title"
                type="text"
                data-testid="article-title-input"
                placeholder="مثال: هنر چیدمان استایل چندلایه در پاییز ۱۴۰۵..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden transition-all"
              >
            </div>

            <!-- اسلاگ یکتا و دکمه تولید خودکار -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700">
                  شناسه آدرس (Slug)
                </label>
                <button
                  type="button"
                  class="text-[11px] font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 cursor-pointer"
                  @click="autoGenerateSlug"
                >
                  <Wand2 class="w-3 h-3" />
                  <span>تولید از عنوان</span>
                </button>
              </div>
              <input
                v-model="slug"
                type="text"
                data-testid="article-slug-input"
                placeholder="autumn-layering-guide"
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-hidden transition-all text-start"
                dir="ltr"
              >
              <p class="text-[11px] text-slate-400 mt-1">
                آدرس صفحه در سایت: /journal/{{ slug || 'slug-name' }}
              </p>
            </div>

            <!-- دسته‌بندی موضوعی و تخمین زمان مطالعه -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  دسته‌بندی موضوعی
                </label>
                <select
                  v-model="category"
                  data-testid="article-category-select"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden transition-all"
                >
                  <option
                    v-for="cat in ADMIN_ARTICLE_CATEGORIES"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  تخمین زمان مطالعه (دقیقه)
                </label>
                <div class="relative">
                  <input
                    v-model.number="readTimeMinutes"
                    type="number"
                    min="1"
                    max="60"
                    data-testid="article-readtime-input"
                    class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl ps-9 pe-3 py-2.5 text-xs text-slate-800 font-mono focus:outline-hidden transition-all"
                  >
                  <Clock class="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- بلوک ۲: خلاصه و متن اصلی مقاله -->
        <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Quote class="w-4 h-4 text-amber-500" />
            <span>محتوا و نگارش روایت</span>
          </h2>

          <div class="space-y-4">
            <!-- خلاصه و چکیده -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                خلاصه و چکیده کوتاه (برای کارت مجله و سئو) <span class="text-rose">*</span>
              </label>
              <textarea
                v-model="excerpt"
                rows="3"
                data-testid="article-excerpt-input"
                placeholder="چکیده‌ای مختصر از اهمیت این استایل و نکات برجسته..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-800 focus:outline-hidden transition-all"
              />
            </div>

            <!-- نقل‌قول برجسته سردبیر (Pull Quote) -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                نقل‌قول طلایی / مانیفست ادیتور (اختیاری)
              </label>
              <input
                v-model="pullQuote"
                type="text"
                data-testid="article-pullquote-input"
                placeholder="مثال: «استایل چندلایه نوعی معماری متحرک بر قامت انسان است.»"
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden transition-all"
              >
            </div>

            <!-- متن اصلی مقاله -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                متن کامل مقاله <span class="text-rose">*</span>
              </label>
              <textarea
                v-model="content"
                rows="10"
                data-testid="article-content-input"
                placeholder="پاراگراف‌های مقاله، تحلیل‌ها، و جزئیات استایلینگ را در اینجا وارد نمایید..."
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm leading-loose text-slate-800 focus:outline-hidden transition-all font-sans"
              />
            </div>
          </div>
        </section>

        <!-- بلوک ۳: انتخابگر کالاهای متصل به استایل (Linked Garments) -->
        <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-amber-500" />
              <span>محصولات متصل به استایل</span>
            </h2>
            <span class="text-xs font-mono font-bold text-slate-500">
              {{ toFa(selectedProductIds.length) }} آیتم انتخاب‌شده
            </span>
          </div>

          <p class="text-xs text-slate-500 leading-relaxed">
            با الصاق لباس‌های زیر، ویجت تعاملی خرید آیتم‌های این استایل در انتهای مقاله برای خوانندگان فعال می‌گردد.
          </p>

          <!-- چیپ‌های محصولات انتخاب‌شده در بالای انتخابگر -->
          <div v-if="selectedGarments.length > 0" class="space-y-1.5 pb-2">
            <span class="text-[11px] font-bold text-slate-600 block">لباس‌های پیوست‌شده به این مقاله:</span>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="garment in selectedGarments"
                :key="garment.id"
                class="inline-flex items-center gap-2 ps-1 pe-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-bold text-slate-800 shadow-2xs animate-in fade-in zoom-in-95 duration-150"
              >
                <img
                  v-if="garment.image"
                  :src="garment.image"
                  :alt="garment.title"
                  class="w-6 h-6 rounded-lg object-cover bg-white border border-amber-200"
                >
                <span class="max-w-44 truncate">{{ garment.title }}</span>
                <button
                  type="button"
                  class="w-4 h-4 rounded-full hover:bg-amber-200/70 text-slate-500 hover:text-slate-800 inline-flex items-center justify-center transition-colors cursor-pointer"
                  :title="`حذف ${garment.title}`"
                  @click="toggleProductLink(garment.id)"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- نوار جستجوی کالا با دیبانس ۳۰۰ میلی‌ثانیه -->
          <div class="relative">
            <input
              v-model="productSearchQuery"
              type="text"
              placeholder="جستجو در کاتالوگ لباس‌ها با نام یا کد کالا..."
              class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl ps-9 pe-9 py-2.5 text-xs text-slate-800 focus:outline-hidden transition-all placeholder:text-slate-400"
            >
            <Search class="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <button
              v-if="productSearchQuery"
              type="button"
              class="w-5 h-5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 absolute end-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
              @click="productSearchQuery = ''"
            >
              <X class="w-3 h-3" />
            </button>
          </div>

          <!-- لیست نتایج کاتالوگ (محدود به ۸ قلم جهت بهینگی رندر DOM) -->
          <div class="space-y-1.5" data-testid="linked-products-picker">
            <div
              v-if="searchedProducts.length === 0"
              class="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200"
            >
              محصولی متناسب با عبارت جستجو در کاتالوگ یافت نشد.
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-1 scroll-smooth"
            >
              <div
                v-for="product in searchedProducts"
                :key="product.id"
                class="flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-start active:scale-[0.99]"
                :class="[
                  selectedProductIds.includes(product.id)
                    ? 'border-amber-400 bg-amber-50/60 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70',
                ]"
                @click="toggleProductLink(product.id)"
              >
                <img
                  :src="product.images[0]?.url"
                  :alt="product.title"
                  class="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200/80 bg-white"
                >
                <div class="flex-1 min-w-0">
                  <span class="text-xs font-bold text-slate-800 block truncate">{{ product.title }}</span>
                  <span class="text-[11px] text-slate-500 font-mono block mt-0.5">{{ formatToman(product.price ?? product.base_price) }}</span>
                </div>
                <div
                  class="w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0"
                  :class="[
                    selectedProductIds.includes(product.id)
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-300 bg-white text-transparent',
                  ]"
                >
                  <Check class="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ستون کناری فرم (۴ ستون) -->
      <div class="lg:col-span-4 space-y-6">
        <!-- تصویر کاور و پیش‌نمایش -->
        <section class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ImageIcon class="w-4 h-4 text-amber-500" />
            <span>تصویر کاور مقاله</span>
          </h2>

          <!-- پیش‌نمایش و دراگ اند دراپ تصویر کاور -->
          <div
            class="overflow-hidden rounded-xl aspect-4/5 bg-slate-100 relative border-2 transition-all cursor-pointer group"
            :class="[
              isDraggingCover
                ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-500/10 scale-[1.01]'
                : 'border-slate-200 hover:border-slate-400',
            ]"
            @dragover.prevent="isDraggingCover = true"
            @dragleave.prevent="isDraggingCover = false"
            @drop="handleCoverDrop"
            @click="coverFileInput?.click()"
          >
            <input
              ref="coverFileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleCoverFileChange"
            >

            <img
              v-if="coverImage"
              :src="coverImage"
              alt="پیش‌نمایش کاور"
              class="w-full h-full object-cover"
            >
            <div v-else class="flex flex-col items-center justify-center h-full text-slate-400 text-xs p-4 text-center space-y-2">
              <UploadCloud class="w-8 h-8 text-slate-300" />
              <p class="font-bold text-slate-600">برای بارگذاری تصویر کاور کلیک کنید</p>
              <p class="text-[10px] text-slate-400">یا فایل را به اینجا بکشید و رها کنید</p>
            </div>

            <!-- دکمه هاور برای تعویض تصویر -->
            <div
              v-if="coverImage"
              class="absolute inset-0 bg-black/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5"
            >
              <UploadCloud class="w-6 h-6" />
              <span>کلیک برای تغییر تصویر کاور</span>
            </div>
          </div>

          <!-- دکمه‌های اقدام و فیلد آدرس عکس -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700">
                آدرس URL تصویر:
              </label>
              <div class="flex items-center gap-2">
                <button
                  v-if="coverImage"
                  type="button"
                  class="text-[11px] font-bold text-rose hover:underline cursor-pointer"
                  @click="coverImage = ''"
                >
                  حذف تصویر
                </button>
                <button
                  type="button"
                  class="text-[11px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  @click="coverFileInput?.click()"
                >
                  انتخاب از دستگاه
                </button>
              </div>
            </div>
            <input
              v-model="coverImage"
              type="text"
              data-testid="article-cover-input"
              placeholder="https://example.com/cover.webp"
              class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden font-mono text-start placeholder:text-slate-400"
              dir="ltr"
            >
          </div>
        </section>

        <!-- مشخصات نویسنده و ادیتور -->
        <section class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <User class="w-4 h-4 text-amber-500" />
            <span>مشخصات نویسنده</span>
          </h2>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                نام نویسنده
              </label>
              <input
                v-model="authorName"
                type="text"
                placeholder="مثال: سارا کیانی"
                data-testid="article-author-input"
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                عنوان و نقش
              </label>
              <input
                v-model="authorRole"
                type="text"
                placeholder="مثال: سرپرست استایلینگ آتلیه کراس"
                class="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
              >
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- نوار ذخیره شناور پایین صفحه (Sticky Action Bar) -->
    <div
      class="fixed bottom-14 lg:bottom-0 start-0 end-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 px-4 sm:px-8 z-30 shadow-lg transition-all duration-200"
      :class="isSidebarCollapsed ? 'lg:start-[72px]' : 'lg:start-60'"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-xs text-slate-500 hidden sm:flex">
          <Sparkles class="w-4 h-4 text-amber-500" />
          <span>آماده ذخیره و انتشار در ویترین مجله</span>
        </div>

        <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            data-testid="save-draft-btn"
            :disabled="isSaving"
            class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            @click="handleSave('draft')"
          >
            <Save class="w-4 h-4 text-slate-500" />
            <span>ذخیره به عنوان پیش‌نویس</span>
          </button>

          <button
            type="button"
            data-testid="publish-article-btn"
            :disabled="isSaving"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-ink hover:bg-ink/90 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            @click="handleSave('published')"
          >
            <Send class="w-4 h-4 text-amber-300" />
            <span>انتشار در سایت</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
