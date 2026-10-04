<!-- frontend/app/pages/internal-ops-nexus/products/new.vue -->
<script setup lang="ts">
import { ArrowRight, Check, Sparkles, Layers, Image as ImageIcon, Ruler } from '@lucide/vue'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'افزودن لباس جدید | کاتالوگ آتلیه کراس', robots: 'noindex, nofollow' })

const router = useRouter()
const {
  productForm,
  autoDiscountPercent,
  saveProduct,
  initFormForNew,
} = useOpsProducts()

onMounted(() => {
  initFormForNew()
})

const isSaving = ref(false)

const handleSave = () => {
  if (!productForm.value.title.trim()) {
    toast.error('لطفاً عنوان کالا را وارد نمایید.')
    return
  }
  isSaving.value = true
  try {
    saveProduct()
    router.push('/internal-ops-nexus/products')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-20 font-sans">
    <!-- هدر صفحه و دکمه بازگشت -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-200/80">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/internal-ops-nexus/products"
          class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          title="بازگشت به کاتالوگ"
        >
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            افزودن محصول جدید به کاتالوگ آتلیه
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            ثبت شناسنامه اثر، قیمت‌گذاری و ماتریس موجودی انبار برای کالکشن
          </p>
        </div>
      </div>
    </div>

    <!-- فرم چندبخشی ساخت محصول -->
    <div class="space-y-6">
      <!-- ۱. اطلاعات پایه و شناسنامه -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <Layers class="w-4 h-4 text-slate-500" />
          <span>اطلاعات پایه، شناسنامه و دسته‌بندی</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">عنوان فارسی لباس</label>
            <input
              v-model="productForm.title"
              type="text"
              placeholder="مثال: کت پشمی دبل‌برست پاییزه"
              class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
            >
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">شناسه یکتا (Slug)</label>
            <input
              v-model="productForm.slug"
              type="text"
              placeholder="double-breasted-wool-coat"
              class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">بخش محصول</label>
            <select
              v-model="productForm.division"
              class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="apparel">پوشاک (Apparel)</option>
              <option value="accessories">اکسسوری (Accessories)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">دسته‌بندی</label>
            <select
              v-model="productForm.category"
              class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="shirts-blouses">شومیز و پیراهن</option>
              <option value="knitwear">بافت و پلیور</option>
              <option value="coats-jackets">پالتو و بارانی</option>
              <option value="pants">شلوار</option>
              <option value="scarves">شال و روسری</option>
              <option value="hair-accessories">اکسسوری مو</option>
              <option value="bandanas">باندانا</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">فصل و کالکشن</label>
            <select
              v-model="productForm.season"
              class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-ink outline-hidden"
            >
              <option value="fall-1405">پاییز ۱۴۰۵</option>
              <option value="winter-1405">زمستان ۱۴۰۵</option>
              <option value="spring-1406">بهار ۱۴۰۶</option>
              <option value="four-season">چهار فصل</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">بج نمایش (Badge)</label>
            <input
              v-model="productForm.badge"
              type="text"
              placeholder="جدید، لیمیتد، پرفروش..."
              class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-ink outline-hidden"
            >
          </div>
        </div>
      </section>

      <!-- ۲. قیمت‌گذاری و تخفیف -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <span>قیمت‌گذاری و تخفیف</span>
          </div>
          <span
            v-if="autoDiscountPercent > 0"
            class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose border border-rose/30"
          >
            {{ autoDiscountPercent }}٪ تخفیف
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">قیمت پایه (تومان)</label>
            <input
              v-model.number="productForm.basePrice"
              type="number"
              class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono tabular-nums outline-hidden focus:bg-white focus:border-ink"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">قیمت فروش نقدی (تومان)</label>
            <input
              v-model.number="productForm.salePrice"
              type="number"
              class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono tabular-nums outline-hidden focus:bg-white focus:border-ink"
            >
          </div>
        </div>
      </section>

      <!-- ۳. ماتریس موجودی انبار -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <Ruler class="w-4 h-4 text-slate-500" />
          <span>جدول موجودی انبار (۶ سایز استاندارد)</span>
        </div>

        <div v-if="productForm.division === 'accessories'" class="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <label class="block font-bold text-slate-700 mb-1 text-xs">موجودی سایز آزاد (Free Size)</label>
          <input
            v-model.number="productForm.stockFree"
            type="number"
            min="0"
            class="w-32 h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono tabular-nums text-xs outline-hidden focus:border-ink"
          >
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div
            v-for="sz in [
              { key: 'stockXS', label: 'XS (۳۴)' },
              { key: 'stockS', label: 'S (۳۶)' },
              { key: 'stockM', label: 'M (۳۸)' },
              { key: 'stockL', label: 'L (۴۰)' },
              { key: 'stockXL', label: 'XL (۴۲)' },
            ]"
            :key="sz.key"
            class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center"
          >
            <span class="font-bold text-slate-700 block mb-1.5">{{ sz.label }}</span>
            <input
              v-model.number="(productForm as any)[sz.key]"
              type="number"
              min="0"
              class="w-full h-9 px-2 rounded-lg bg-white border border-slate-200 text-center font-mono tabular-nums text-slate-900 outline-hidden focus:border-ink"
            >
          </div>
        </div>
      </section>

      <!-- ۴. تصاویر و مشخصات فنی پارچه -->
      <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div class="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <ImageIcon class="w-4 h-4 text-slate-500" />
          <span>گالری تصاویر و مشخصات فنی متریال</span>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">آدرس تصویر شاخص (URL)</label>
            <input
              v-model="productForm.mainImage"
              type="text"
              class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink"
            >
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">تصاویر تکمیلی گالری (هر سطر یک URL)</label>
            <textarea
              v-model="productForm.galleryImages"
              rows="3"
              class="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-start outline-hidden focus:bg-white focus:border-ink"
              placeholder="https://...&#10;https://..."
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">گرماژ پارچه (GSM)</label>
              <input
                v-model.number="productForm.fabricGsm"
                type="number"
                class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono tabular-nums outline-hidden focus:border-ink"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">ترکیب الیاف</label>
              <input
                v-model="productForm.fabricComposition"
                type="text"
                class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-ink"
              >
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">دستورالعمل شست‌وشو</label>
              <input
                v-model="productForm.fabricCare"
                type="text"
                class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:border-ink"
              >
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- نوار چسبان پایین برای ذخیره (Sticky Bottom Action Bar) -->
    <div class="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-6 z-30 shadow-lg">
      <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <span class="text-xs text-slate-500 hidden sm:inline">
          اطلاعات با تایید ناظر کنترل کیفیت در کاتالوگ منتشر خواهد شد.
        </span>

        <div class="flex items-center gap-2.5 ms-auto">
          <NuxtLink
            to="/internal-ops-nexus/products"
            class="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            انصراف
          </NuxtLink>

          <button
            type="button"
            data-testid="save-product-btn"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            :disabled="isSaving"
            @click="handleSave"
          >
            <Check class="w-4 h-4" />
            <span>{{ isSaving ? 'در حال ثبت اثر...' : 'ذخیره و انتشار در کاتالوگ' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
