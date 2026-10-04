<!-- frontend/app/components/ops/product-studio/ProductStudioStrategy.vue -->
<script setup lang="ts">
import { Globe, Printer, Search, CheckCircle, AlertTriangle } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'

const {
  title,
  slug,
  styleCode,
  variants,
  supplyModel,
  makeToOrderDays,
  purchaseLimit,
  scheduledDropDate,
  seoTitle,
  seoDescription,
  serpPreviewTitle,
  serpPreviewDescription,
  seoScore,
} = useOpsProductStudio()

const showHangtagPreview = ref(false)

const triggerPrintHangtag = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-purple-50 text-purple-700">
          <Globe class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            استراتژی تجاری، چاپ بارکد و سئو ادیتوریال (Strategy, Hangtag & SEO)
          </h2>
          <p class="text-[11px] text-slate-500">
            مدل زنجیره تأمین، سقف خرید مشتری، شبیه‌ساز نتایج گوگل و چاپ اتیکت فیزیکی
          </p>
        </div>
      </div>
    </div>

    <!-- استراتژی تأمین و سقف خرید -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">مدل زنجیره تأمین اثر</label>
        <select
          v-model="supplyModel"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option value="in_stock">موجودی آماده تحویل انبار (In Stock)</option>
          <option value="made_to_order">سفارشی‌دوز مزونی (Made to Order)</option>
        </select>
      </div>

      <div v-if="supplyModel === 'made_to_order'">
        <label class="block font-bold text-slate-700 mb-1.5">مدت زمان دوخت و آماده‌سازی</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="makeToOrderDays"
            type="number"
            min="1"
            class="w-24 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
          >
          <span class="text-slate-500 text-[11px]">روز کاری تا تحویل به پست</span>
        </div>
      </div>

      <div v-else>
        <label class="block font-bold text-slate-700 mb-1.5">سقف خرید در هر فاکتور</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="purchaseLimit"
            type="number"
            min="1"
            max="10"
            class="w-24 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
          >
          <span class="text-slate-500 text-[11px]">عدد به ازای هر کاربر</span>
        </div>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">تاریخ دراپ و انتشار در سایت</label>
        <div class="flex items-center gap-1.5">
          <input
            v-model="scheduledDropDate"
            type="text"
            placeholder="۱۴۰۵/۰۷/۱۵"
            class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden focus:bg-white focus:border-ink"
          >
        </div>
      </div>
    </div>

    <!-- چاپ اتیکت فیزیکی آتلیه و بارکد حرارتی (Hangtag & Barcode) -->
    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Printer class="w-4 h-4 text-slate-700" />
          <span class="font-bold text-slate-800">چاپ اتیکت لباس و لیبل حرارتی انبار (Hangtag Printer)</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
            @click="showHangtagPreview = !showHangtagPreview"
          >
            {{ showHangtagPreview ? 'بستن پیش‌نمایش' : 'مشاهده اتیکت آتلیه' }}
          </button>
          <button
            type="button"
            class="h-8 px-3 rounded-xl bg-ink hover:bg-ink/90 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="triggerPrintHangtag"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>چاپ اتیکت استاندارد</span>
          </button>
        </div>
      </div>

      <!-- پیش‌نمایش کارت هانگ‌تگ لوکس کراس -->
      <div
        v-if="showHangtagPreview"
        class="max-w-xs mx-auto p-4 bg-white border border-slate-300 rounded-xl shadow-md text-center space-y-2 font-mono"
      >
        <div class="text-[10px] tracking-widest uppercase font-bold text-slate-400">KERAS ATELIER</div>
        <div class="text-xs font-bold text-slate-900">{{ title || 'کت پشمی دبل‌برست' }}</div>
        <div class="text-[10px] text-slate-500 font-mono">{{ styleCode }}</div>
        <div class="pt-2 border-t border-slate-100">
          <div class="text-[11px] font-bold text-slate-800 tabular-nums">
            {{ variants[0]?.salePrice ? Number(variants[0].salePrice).toLocaleString('fa-IR') + ' تومان' : '۲,۴۵۰,۰۰۰ تومان' }}
          </div>
          <div class="text-[10px] text-slate-400 pt-1">
            بارکد ملی: {{ variants[0]?.barcode || '626918239012' }}
          </div>
        </div>
      </div>
    </div>

    <!-- تنظیمات و تحلیل سئو (SEO Score & SERP Preview) -->
    <div class="border-t border-slate-100 pt-4 space-y-4 text-xs">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Search class="w-4 h-4 text-slate-600" />
          <span class="font-bold text-slate-800">تنظیمات بهینه‌سازی موتورهای جستجو (Google SEO & Meta)</span>
        </div>
        <!-- نشانگر نمره سئو -->
        <div class="flex items-center gap-2">
          <span class="text-slate-500 text-[11px]">امتیاز سئوی کالا:</span>
          <div
            class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1"
            :class="seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : seoScore >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'"
          >
            <CheckCircle v-if="seoScore >= 80" class="w-3.5 h-3.5" />
            <AlertTriangle v-else class="w-3.5 h-3.5" />
            <span class="tabular-nums">{{ seoScore }} / ۱۰۰</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">عنوان متا برای گوگل (Meta Title)</label>
          <input
            v-model="seoTitle"
            type="text"
            :placeholder="title ? `${title} | خرید آنلاین آتلیه کراس` : 'عنوان بهینه‌شده سئو'"
            class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink transition-colors"
          >
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1.5">توضیحات متا در نتایج جستجو (Meta Description)</label>
          <input
            v-model="seoDescription"
            type="text"
            placeholder="خلاصه جذاب و بهینه‌شده برای جذب کلیک در صفحه نتایج موتورهای جستجو..."
            class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink transition-colors"
          >
        </div>
      </div>

      <!-- شبیه‌ساز کارت گوگل (Google SERP Snippet Preview) -->
      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-start font-sans">
        <div class="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono" dir="ltr">
          <span class="text-emerald-700">https://keras-shop.ir</span>
          <span>&rsaquo; shop &rsaquo; products &rsaquo; {{ slug || 'slug' }}</span>
        </div>
        <div class="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
          {{ serpPreviewTitle }}
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ serpPreviewDescription }}
        </p>
      </div>
    </div>
  </section>
</template>
