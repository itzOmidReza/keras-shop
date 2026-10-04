<!-- frontend/app/components/ops/product-studio/ProductStudioSpecs.vue -->
<script setup lang="ts">
import { Cpu, Check, User, Shirt } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'

const {
  fiberComposition,
  fabricGsm,
  fabricStretch,
  fabricBreathability,
  isNonSheer,
  careChecklist,
  modelMetrics,
  crossSellProductIds,
} = useOpsProductStudio()

const { productsList } = useOpsProducts()

const careOptions = [
  { id: 'cold_wash', label: 'شست‌وشوی ملایم (۳۰ درجه)' },
  { id: 'do_not_bleach', label: 'عدم استفاده از سفیدکننده' },
  { id: 'gentle_iron', label: 'اتوکشی ملایم و بخار' },
  { id: 'dry_clean_safe', label: 'خشک‌شویی تخصصی پوشاک' },
  { id: 'no_tumble_dry', label: 'عدم استفاده از خشک‌کن دورانی' },
]

const toggleCareItem = (id: string) => {
  const idx = careChecklist.value.indexOf(id)
  if (idx > -1) {
    careChecklist.value.splice(idx, 1)
  } else {
    careChecklist.value.push(id)
  }
}

const toggleCrossSell = (prodId: number) => {
  const idx = crossSellProductIds.value.indexOf(prodId)
  if (idx > -1) {
    crossSellProductIds.value.splice(idx, 1)
  } else {
    crossSellProductIds.value.push(prodId)
  }
}
</script>

<template>
  <section class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-5 font-sans">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-sky-50 text-sky-700">
          <Cpu class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            مهندسی پارچه، مشخصات فنی و استایلینگ (Garment Engineering & Specs)
          </h2>
          <p class="text-[11px] text-slate-500">
            ترکیب الیاف، گرماژ پارچه، تنفس‌پذیری، علائم شست‌وشو، ابعاد مدل و استایلینگ
          </p>
        </div>
      </div>
    </div>

    <!-- متریال و گرماژ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">ترکیب درصد الیاف (Fiber Composition)</label>
        <input
          v-model="fiberComposition"
          type="text"
          placeholder="مثال: ۸۰٪ لینن اسلپ ارگانیک، ۲۰٪ ابریشم خام"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink transition-colors"
        >
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">گرماژ وزنی پارچه (GSM)</label>
        <div class="flex items-center gap-2">
          <input
            v-model.number="fabricGsm"
            type="number"
            min="50"
            max="1200"
            class="w-32 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold outline-hidden focus:bg-white focus:border-ink tabular-nums"
          >
          <span class="text-slate-500 font-medium text-[11px]">گرم بر متر مربع (g/m²)</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
            {{ fabricGsm < 150 ? 'سبک و تابستانه' : fabricGsm <= 280 ? 'چهارفصل ادیتوریال' : 'سنگین و زمستانه' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ویژگی‌های مکانیکی پارچه -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">میزان کشسانی پارچه (Stretch)</label>
        <select
          v-model="fabricStretch"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option value="non-stretch">بدون کشسانی (Non-stretch)</option>
          <option value="slight">اندک (Slight Stretch)</option>
          <option value="medium">متوسط (Medium Stretch)</option>
          <option value="high">بالا و منعطف (High Stretch)</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">تنفس‌پذیری و گردش هوا</label>
        <select
          v-model="fabricBreathability"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
        >
          <option value="low">کم (تراکم بافت بالا)</option>
          <option value="medium">متوسط</option>
          <option value="high">بالا (مناسب اقلیم معتدل و گرم)</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">پوشش و ماتی بافت</label>
        <button
          type="button"
          class="w-full h-10 px-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer"
          :class="isNonSheer ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
          @click="isNonSheer = !isNonSheer"
        >
          <span>{{ isNonSheer ? 'مات و بدون بدن‌نمایی (Non-sheer)' : 'نیمه‌شفاف و سبک' }}</span>
          <Check v-if="isNonSheer" class="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>

    <!-- دستورالعمل نگهداری و شست‌وشو -->
    <div class="space-y-2 text-xs">
      <span class="block font-bold text-slate-700">چک‌لیست مراقبت و شست‌وشو (Care & Laundry):</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <button
          v-for="opt in careOptions"
          :key="opt.id"
          type="button"
          class="p-2.5 rounded-xl border flex items-center gap-2 text-start transition-colors cursor-pointer"
          :class="careChecklist.includes(opt.id) ? 'border-ink bg-sand-100/60 text-slate-900 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
          @click="toggleCareItem(opt.id)"
        >
          <div
            class="w-4 h-4 rounded-md border flex items-center justify-center shrink-0"
            :class="careChecklist.includes(opt.id) ? 'bg-ink border-ink text-white' : 'border-slate-300 bg-white'"
          >
            <Check v-if="careChecklist.includes(opt.id)" class="w-3 h-3" />
          </div>
          <span class="text-[11px]">{{ opt.label }}</span>
        </button>
      </div>
    </div>

    <!-- ابعاد و سایز تن مدل آتلیه -->
    <div class="border-t border-slate-100 pt-4 space-y-2 text-xs">
      <div class="flex items-center gap-1.5 font-bold text-slate-800">
        <User class="w-4 h-4 text-slate-500" />
        <span>مشخصات اندام مدل در تصاویر (Model Metrics):</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">قد مدل (سانتی‌متر):</label>
          <input
            v-model.number="modelMetrics.heightCm"
            type="number"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
          >
        </div>
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">وزن مدل (کیلوگرم):</label>
          <input
            v-model.number="modelMetrics.weightKg"
            type="number"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
          >
        </div>
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">سایز پوشیده‌شده در تصویر:</label>
          <input
            v-model="modelMetrics.sizeWorn"
            type="text"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-center outline-hidden focus:bg-white focus:border-ink"
          >
        </div>
      </div>
    </div>

    <!-- استایل کامل و کالاهای مکمل (Cross-Sell / Complete the Look) -->
    <div class="border-t border-slate-100 pt-4 space-y-2 text-xs">
      <div class="flex items-center justify-between font-bold text-slate-800">
        <div class="flex items-center gap-1.5">
          <Shirt class="w-4 h-4 text-indigo-500" />
          <span>تکمیل استایل و پیشنهاد مکمل (Complete the Look):</span>
        </div>
        <span class="text-[11px] text-slate-400 font-mono tabular-nums">
          {{ crossSellProductIds.length }} اثر انتخاب‌شده
        </span>
      </div>

      <div class="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
        <button
          v-for="p in productsList.slice(0, 10)"
          :key="p.id"
          type="button"
          class="px-2.5 py-1.5 rounded-xl border text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          :class="crossSellProductIds.includes(p.id) ? 'border-indigo-400 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
          @click="toggleCrossSell(p.id)"
        >
          <Check v-if="crossSellProductIds.includes(p.id)" class="w-3 h-3 text-indigo-600" />
          <span>{{ p.title }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
