<!-- frontend/app/components/ops/product-studio/ProductStudioSpecs.vue -->
<script setup lang="ts">
import { Cpu, Check, User, Shirt, Search, X } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import { toFa, formatToman } from '~/utils/format'

const {
  fiberComposition,
  fabricGsm,
  fabricStretch,
  fabricBreathability,
  isNonSheer,
  careChecklist,
  modelMetrics,
  crossSellProductIds,
  silhouette,
  neckline,
  sleeveLength,
  occasion,
  packageWeightGrams,
  markDirty,
} = useOpsProductStudio()

const { productsList } = useOpsProducts()

const isCrossSellModalOpen = ref(false)
const crossSellSearch = ref('')

const careOptions = [
  {
    id: 'cold_wash',
    label: 'شست‌وشوی ملایم (۳۰ درجه)',
    tooltip: 'شست‌وشو در ماشین با چرخش ملایم و دمای حداکثر ۳۰ درجه سانتی‌گراد',
    iconType: 'wash',
  },
  {
    id: 'do_not_bleach',
    label: 'عدم استفاده از سفیدکننده',
    tooltip: 'هرگونه ماده سفیدکننده و کلردار به بافت پارچه آسیب می‌رساند',
    iconType: 'bleach',
  },
  {
    id: 'gentle_iron',
    label: 'اتوکشی ملایم و بخار',
    tooltip: 'اتوکشی در دمای ملایم (حداکثر ۱۱۰ درجه) ترجیحاً با محافظ پارچه یا بخار',
    iconType: 'iron',
  },
  {
    id: 'dry_clean_safe',
    label: 'خشک‌شویی تخصصی پوشاک',
    tooltip: 'خشک‌شویی با تتراکلرواتیلن مجاز است',
    iconType: 'dryclean',
  },
  {
    id: 'no_tumble_dry',
    label: 'عدم استفاده از خشک‌کن دورانی',
    tooltip: 'از خشک‌کن چرخشی استفاده نشود؛ روی بند یا سطح صاف پهن شود',
    iconType: 'tumbledry',
  },
]

const toggleCareItem = (id: string) => {
  markDirty()
  const idx = careChecklist.value.indexOf(id)
  if (idx > -1) {
    careChecklist.value.splice(idx, 1)
  } else {
    careChecklist.value.push(id)
  }
}

const toggleCrossSell = (prodId: number) => {
  markDirty()
  const idx = crossSellProductIds.value.indexOf(prodId)
  if (idx > -1) {
    crossSellProductIds.value.splice(idx, 1)
  } else {
    crossSellProductIds.value.push(prodId)
  }
}

const filteredProducts = computed(() => {
  if (!crossSellSearch.value.trim()) return productsList.value
  const q = crossSellSearch.value.trim().toLowerCase()
  return productsList.value.filter(
    (p) => p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)),
  )
})

const selectedCrossSellProducts = computed(() => {
  return productsList.value.filter((p) => crossSellProductIds.value.includes(p.id))
})
</script>

<template>
  <section
    id="section-specs"
    class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-6 font-sans scroll-mt-20"
  >
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="p-1.5 rounded-lg bg-sky-50 text-sky-700">
          <Cpu class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900">
            مهندسی پارچه و جزئیات دوخت
          </h2>
          <p class="text-[11px] text-slate-500">
            ترکیب الیاف، فرم اندامی، مشخصات آتلیه، علائم شست‌وشوی بین‌المللی و استایلینگ
          </p>
        </div>
      </div>
    </div>

    <!-- متریال و گرماژ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">ترکیب درصد الیاف و بافت</label>
        <input
          v-model="fiberComposition"
          type="text"
          placeholder="مثال: ۸۰٪ لینن اسلپ ارگانیک، ۲۰٪ ابریشم خام"
          class="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink transition-colors"
          @input="markDirty"
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
            @input="markDirty"
          >
          <span class="text-slate-500 font-medium text-[11px]">گرم بر متر مربع</span>
          <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
            {{ fabricGsm < 150 ? 'سبک و تابستانه' : fabricGsm <= 280 ? 'چهارفصل ادیتوریال' : 'سنگین و زمستانه' }}
          </span>
        </div>
      </div>
    </div>

    <!-- مشخصات تخصصی زنانه و مد آتلیه (Atelier Fashion Specs) -->
    <div class="border-t border-slate-100 pt-4 space-y-3 text-xs">
      <span class="block font-bold text-slate-800">الگوسازی و فرم اندامی اثر آتلیه:</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- برش و فرم اندامی -->
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">برش و فرم اندامی</label>
          <select
            v-model="silhouette"
            class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-hidden focus:bg-white focus:border-ink"
            @change="markDirty"
          >
            <option value="relaxed">آزاد و رها</option>
            <option value="straight">راسته کلاسیک</option>
            <option value="oversized">اورسایز ادیتوریال</option>
            <option value="fitted">جذب و کتی</option>
            <option value="flared">کلوش و دراپ</option>
          </select>
        </div>

        <!-- فرم یقه -->
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">فرم و استایل یقه</label>
          <input
            v-model="neckline"
            type="text"
            placeholder="مثال: یقه انگلیسی بلیزری"
            class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-hidden focus:bg-white focus:border-ink"
            @input="markDirty"
          >
        </div>

        <!-- قد و مدل آستین -->
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">قد و مدل آستین</label>
          <input
            v-model="sleeveLength"
            type="text"
            placeholder="مثال: آستین بلند با مچ دکمه‌خور"
            class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-hidden focus:bg-white focus:border-ink"
            @input="markDirty"
          >
        </div>

        <!-- کاربری و موقعیت -->
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">کاربری و موقعیت پوشش</label>
          <select
            v-model="occasion"
            class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-hidden focus:bg-white focus:border-ink"
            @change="markDirty"
          >
            <option value="daily">روزمره و کژوال مدرن</option>
            <option value="evening">ادیتوریال و شب</option>
            <option value="formal">رسمی و جلسات کاری</option>
            <option value="party">کوکتل و رویدادهای هنری</option>
          </select>
        </div>

        <!-- وزن مرسوله و کاور -->
        <div>
          <label class="block text-[11px] text-slate-600 font-medium mb-1">وزن با کاور (گرم)</label>
          <input
            v-model.number="packageWeightGrams"
            type="number"
            min="50"
            max="5000"
            class="w-full h-9 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center text-xs outline-hidden focus:bg-white focus:border-ink tabular-nums"
            @input="markDirty"
          >
        </div>
      </div>
    </div>

    <!-- ویژگی‌های فیزیکی و ماتی بافت -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div>
        <label class="block font-bold text-slate-700 mb-1.5">میزان کشسانی پارچه</label>
        <select
          v-model="fabricStretch"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
          @change="markDirty"
        >
          <option value="non-stretch">بدون کشسانی (فاقد الاستین)</option>
          <option value="slight">اندک و طبیعی</option>
          <option value="medium">متوسط</option>
          <option value="high">بالا و ارتجاعی</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">تنفس‌پذیری و گردش هوا</label>
        <select
          v-model="fabricBreathability"
          class="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden focus:bg-white focus:border-ink"
          @change="markDirty"
        >
          <option value="low">کم (تراکم بافت گرمابخش)</option>
          <option value="medium">متوسط و متعادل</option>
          <option value="high">بالا و خنک (طبیعی)</option>
        </select>
      </div>

      <div>
        <label class="block font-bold text-slate-700 mb-1.5">پوشش و ماتی بافت</label>
        <button
          type="button"
          class="w-full h-10 px-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer"
          :class="isNonSheer ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'"
          @click="isNonSheer = !isNonSheer; markDirty()"
        >
          <span>{{ isNonSheer ? 'مات و بدون بدن‌نمایی' : 'نیمه‌شفاف و سبک' }}</span>
          <Check v-if="isNonSheer" class="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>

    <!-- علائم بین‌المللی مراقبت و شست‌وشو (ISO Care Symbols) -->
    <div class="space-y-2 text-xs border-t border-slate-100 pt-4">
      <span class="block font-bold text-slate-700">دستورالعمل و علائم بین‌المللی شست‌وشو (ISO Care Symbols):</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <button
          v-for="opt in careOptions"
          :key="opt.id"
          type="button"
          :title="opt.tooltip"
          class="p-2.5 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer relative group"
          :class="careChecklist.includes(opt.id) ? 'border-ink bg-sand-100/60 text-slate-900 font-bold shadow-2xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'"
          @click="toggleCareItem(opt.id)"
        >
          <!-- آیکون‌های SVG استاندارد بین‌المللی -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            :class="careChecklist.includes(opt.id) ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'"
          >
            <!-- شست‌وشو -->
            <svg
              v-if="opt.iconType === 'wash'"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18l-2 11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3L3 6z" />
              <path d="M3 10c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
            </svg>

            <!-- سفیدکننده -->
            <svg
              v-else-if="opt.iconType === 'bleach'"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 3 2 20h20L12 3z" />
              <path d="m4 19 16-15" />
            </svg>

            <!-- اتو -->
            <svg
              v-else-if="opt.iconType === 'iron'"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 18h16a1 1 0 0 0 1-1c0-4.5-3.5-7-7-7H7a4 4 0 0 0-4 4v3a1 1 0 0 0 1 1z" />
              <circle cx="12" cy="14" r="0.8" fill="currentColor" />
            </svg>

            <!-- خشک‌شویی -->
            <svg
              v-else-if="opt.iconType === 'dryclean'"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <text x="12" y="16" font-size="11" font-family="sans-serif" text-anchor="middle" fill="currentColor" stroke="none" font-weight="bold">P</text>
            </svg>

            <!-- خشک‌کن چرخشی -->
            <svg
              v-else-if="opt.iconType === 'tumbledry'"
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="12" cy="12" r="6" />
              <line x1="5" y1="5" x2="19" y2="19" />
            </svg>
          </div>

          <span class="text-[10px] leading-tight line-clamp-2">{{ opt.label }}</span>
        </button>
      </div>
    </div>

    <!-- ابعاد و سایز تن مدل آتلیه -->
    <div class="border-t border-slate-100 pt-4 space-y-2 text-xs">
      <div class="flex items-center gap-1.5 font-bold text-slate-800">
        <User class="w-4 h-4 text-slate-500" />
        <span>مشخصات اندام مدل در تصاویر عکاسی:</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">قد مدل (سانتی‌متر):</label>
          <input
            v-model.number="modelMetrics.heightCm"
            type="number"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
            @input="markDirty"
          >
        </div>
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">وزن مدل (کیلوگرم):</label>
          <input
            v-model.number="modelMetrics.weightKg"
            type="number"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-center outline-hidden focus:bg-white focus:border-ink tabular-nums"
            @input="markDirty"
          >
        </div>
        <div>
          <label class="block text-[11px] text-slate-500 mb-1">سایز پوشیده‌شده در تصویر:</label>
          <input
            v-model="modelMetrics.sizeWorn"
            type="text"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-center outline-hidden focus:bg-white focus:border-ink"
            @input="markDirty"
          >
        </div>
      </div>
    </div>

    <!-- استایل کامل و کالاهای مکمل (Cross-Sell / Complete the Look) -->
    <div class="border-t border-slate-100 pt-4 space-y-3 text-xs">
      <div class="flex items-center justify-between font-bold text-slate-800">
        <div class="flex items-center gap-1.5">
          <Shirt class="w-4 h-4 text-indigo-500" />
          <span>تکمیل استایل و پیشنهاد مکمل (Complete the Look):</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[11px] text-slate-500 font-mono tabular-nums">
            {{ toFa(crossSellProductIds.length) }} اثر برگزیده
          </span>
          <button
            type="button"
            class="h-7 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            @click="isCrossSellModalOpen = true"
          >
            <Search class="w-3 h-3" />
            <span>جستجو و انتخاب از کاتالوگ</span>
          </button>
        </div>
      </div>

      <!-- کالاهای برگزیده فعال -->
      <div v-if="selectedCrossSellProducts.length > 0" class="flex flex-wrap gap-2 pt-1">
        <div
          v-for="p in selectedCrossSellProducts"
          :key="p.id"
          class="ps-2.5 pe-1.5 py-1 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2"
        >
          <span class="font-medium truncate max-w-44">{{ p.title }}</span>
          <button
            type="button"
            class="p-0.5 rounded-md hover:bg-indigo-200/60 text-indigo-600 transition-colors cursor-pointer"
            title="حذف از مکمل‌ها"
            @click="toggleCrossSell(p.id)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
      <div v-else class="text-[11px] text-slate-400 italic py-1">
        هنوز کالایی به عنوان پیشنهاد مکمل برای این اثر انتخاب نشده است.
      </div>
    </div>

    <!-- مدال جستجو و انتخاب مکمل‌ها -->
    <div
      v-if="isCrossSellModalOpen"
      class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-5 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <Shirt class="w-4 h-4 text-indigo-600" />
            <h3 class="text-sm font-bold text-slate-900">انتخاب قطعات مکمل استایل (Complete the Look)</h3>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            @click="isCrossSellModalOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- فیلد جستجو -->
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          <input
            v-model="crossSellSearch"
            type="text"
            placeholder="جستجوی عنوان اثر یا دسته‌بندی..."
            class="w-full h-9 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink"
          >
        </div>

        <!-- لیست کالاها -->
        <div class="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
          <div
            v-for="prod in filteredProducts"
            :key="prod.id"
            class="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
            @click="toggleCrossSell(prod.id)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                v-if="prod.images && prod.images[0]?.url"
                :src="prod.images[0].url"
                :alt="prod.title"
                class="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
              >
              <div v-else class="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
              <div class="min-w-0 text-start">
                <span class="text-xs font-bold text-slate-800 truncate block">{{ prod.title }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ formatToman(prod.price) }}</span>
              </div>
            </div>

            <div
              class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0"
              :class="crossSellProductIds.includes(prod.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'"
            >
              <Check v-if="crossSellProductIds.includes(prod.id)" class="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-xs text-slate-500">
            {{ toFa(crossSellProductIds.length) }} اثر انتخاب شده
          </span>
          <button
            type="button"
            class="h-8 px-4 rounded-xl bg-ink text-white text-xs font-bold hover:bg-ink/90 cursor-pointer"
            @click="isCrossSellModalOpen = false"
          >
            تأیید و بستن
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

