<!-- frontend/app/components/product/SizeGuideModal.vue -->
<script setup lang="ts">
import {
  Ruler,
  Sparkles,
  Check,
  Info,
  ChevronLeft,
} from '@lucide/vue'
import type { FitPreference } from '~/types/domain'
import {
  STANDARD_MEASUREMENTS,
  METRIC_LIMITS,
  calculateRecommendedSize,
} from '~/utils/fit-calculator'
import { toFa } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    open: boolean
    collection?: 'move' | 'calm'
    currentSize?: string | null
    availableSizes?: string[]
  }>(),
  {
    collection: 'move',
    currentSize: null,
    availableSizes: () => ['XS', 'S', 'M', 'L', 'XL'],
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'select-size': [size: string]
}>()

// مقادیر حالت محاسبه‌گر هوشمند
const heightCm = ref<number>(METRIC_LIMITS.height.default)
const weightKg = ref<number>(METRIC_LIMITS.weight.default)
const fitPreference = ref<FitPreference>('regular')

// محاسبه توصیه هوشمند
const recommendation = computed(() => {
  return calculateRecommendedSize(
    heightCm.value,
    weightKg.value,
    fitPreference.value,
    props.collection,
  )
})

// به‌روزرسانی مقدار اسلایدر قد
const handleHeightSlider = (val: number[] | undefined) => {
  if (val && val[0] !== undefined) {
    heightCm.value = Math.max(
      METRIC_LIMITS.height.min,
      Math.min(METRIC_LIMITS.height.max, val[0]),
    )
  }
}

// به‌روزرسانی مقدار اسلایدر وزن
const handleWeightSlider = (val: number[] | undefined) => {
  if (val && val[0] !== undefined) {
    weightKg.value = Math.max(
      METRIC_LIMITS.weight.min,
      Math.min(METRIC_LIMITS.weight.max, val[0]),
    )
  }
}

// گزینه‌های ترجیح فیت
const preferenceOptions = [
  {
    id: 'snug' as FitPreference,
    label: 'فشرده و محکم',
    desc: 'فرم‌دهی متراکم و نگه‌دارندگی عضلانی',
  },
  {
    id: 'regular' as FitPreference,
    label: 'استاندارد',
    desc: 'تعادل ایده‌آل میان فرم‌دهی و راحتی',
  },
  {
    id: 'relaxed' as FitPreference,
    label: 'آزاد و راحت',
    desc: 'پوشش رها با کمترین میزان فشار',
  },
]

// اعمال سایز پیشنهادی به صفحه محصول
const applyRecommendedSize = (size: string) => {
  emit('select-size', size)
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
    <DialogContent
      class="max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border-sand p-5 sm:p-7 shadow-2xl rounded-2xl text-start"
    >
      <!-- ۱. هدر ادیتوریال مدال -->
      <DialogHeader class="text-start border-b border-sand pb-4">
        <div class="flex items-center gap-2 text-rose">
          <Ruler class="w-5 h-5" />
          <DialogTitle class="text-lg sm:text-xl font-bold text-ink">
            راهنمای سایز و تنخور تخصصی کراس
          </DialogTitle>
        </div>
        <DialogDescription class="text-xs text-muted-foreground mt-1">
          تمام ابعاد و محاسبات به صورت دقیق و اختصاصی بر حسب سانتی‌متر (CM) و کیلوگرم (KG) تنظیم شده‌اند.
        </DialogDescription>
      </DialogHeader>

      <!-- ۲. ناوبری تب‌های مدال -->
      <Tabs default-value="table" class="w-full space-y-6 pt-2">
        <TabsList class="grid grid-cols-2 w-full h-11 p-1 rounded-xl bg-sand/40 border border-sand">
          <TabsTrigger
            value="table"
            class="rounded-lg text-xs font-bold text-ink data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-xs transition-all cursor-pointer"
          >
            جدول ابعاد استاندارد (سانتی‌متر)
          </TabsTrigger>
          <TabsTrigger
            value="calculator"
            class="rounded-lg text-xs font-bold text-ink data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>محاسبه‌گر هوشمند فیت</span>
          </TabsTrigger>
        </TabsList>

        <!-- تب اول: جدول ابعاد استاندارد متریک -->
        <TabsContent value="table" class="space-y-6 focus-visible:outline-none">
          <!-- جدول اندازه‌ها -->
          <div class="overflow-x-auto rounded-xl border border-sand bg-white shadow-2xs">
            <table class="w-full text-center text-xs">
              <thead class="bg-sand/30 border-b border-sand text-ink font-bold">
                <tr>
                  <th class="py-3 px-3 text-start ps-4">سایز</th>
                  <th class="py-3 px-3">دور کمر (CM)</th>
                  <th class="py-3 px-3">دور باسن (CM)</th>
                  <th class="py-3 px-3">دور سینه (CM)</th>
                  <th class="py-3 px-3 pe-4">قد داخل پا (CM)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-sand/40 font-medium">
                <tr
                  v-for="item in STANDARD_MEASUREMENTS"
                  :key="item.size"
                  class="transition-colors hover:bg-sand/20"
                  :class="[
                    currentSize === item.size ? 'bg-rose/5 font-bold' : '',
                  ]"
                >
                  <td class="py-3 px-3 text-start ps-4 font-bold text-ink flex items-center gap-1.5">
                    <span>{{ item.size }}</span>
                    <span
                      v-if="currentSize === item.size"
                      class="text-[10px] text-rose bg-rose/10 px-1.5 py-0.2 rounded-full"
                    >
                      انتخاب فعلی
                    </span>
                  </td>
                  <td class="py-3 px-3 text-ink">
                    {{ toFa(item.waist) }}
                  </td>
                  <td class="py-3 px-3 text-ink">
                    {{ toFa(item.hips) }}
                  </td>
                  <td class="py-3 px-3 text-ink">
                    {{ item.bust ? toFa(item.bust) : '—' }}
                  </td>
                  <td class="py-3 px-3 pe-4 text-ink">
                    {{ item.inseam ? toFa(item.inseam) : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- باکس راهنمای اندازه‌گیری دقیق با متر -->
          <div class="rounded-xl border border-sand bg-sand/20 p-4 space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold text-ink">
              <Info class="w-4 h-4 text-rose shrink-0" />
              <span>راهنمای اندازه‌گیری صحیح با متر نواری (CM)</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-muted-foreground leading-relaxed">
              <div class="space-y-1">
                <span class="font-bold text-ink block">۱. دور کمر (Waist):</span>
                <p>متر را دور باریک‌ترین بخش بالاتنه (حدود ۲ سانتی‌متر بالای ناف) بدون فشردن قرار دهید.</p>
              </div>
              <div class="space-y-1">
                <span class="font-bold text-ink block">۲. دور باسن (Hips):</span>
                <p>پاها را جفت کنید و برجسته‌ترین بخش باسن را با متر افقی اندازه بگیرید.</p>
              </div>
              <div class="space-y-1">
                <span class="font-bold text-ink block">۳. قد داخل پا (Inseam):</span>
                <p>از بالاترین نقطه داخلی فاق شلوار تا قوزک مچ پا را به صورت عمودی بسنجید.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- تب دوم: محاسبه‌گر هوشمند فیت بر اساس قد و وزن -->
        <TabsContent value="calculator" class="space-y-6 focus-visible:outline-none">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- ۱. اسلایدر و ورودی قد (CM) -->
            <div class="rounded-xl border border-sand bg-white p-4 space-y-3 shadow-2xs">
              <div class="flex items-center justify-between text-xs">
                <label for="height-input" class="font-bold text-ink">
                  قد شما (سانتی‌متر)
                </label>
                <div class="flex items-center gap-1">
                  <input
                    id="height-input"
                    v-model.number="heightCm"
                    type="number"
                    :min="METRIC_LIMITS.height.min"
                    :max="METRIC_LIMITS.height.max"
                    class="w-14 h-7 text-center rounded-lg border border-sand bg-sand/15 text-xs font-bold text-ink focus:border-rose focus:outline-none"
                  >
                  <span class="text-[11px] text-muted-foreground">CM</span>
                </div>
              </div>

              <Slider
                :model-value="[heightCm]"
                :min="METRIC_LIMITS.height.min"
                :max="METRIC_LIMITS.height.max"
                :step="METRIC_LIMITS.height.step"
                @update:model-value="handleHeightSlider"
              />

              <div class="flex justify-between text-[10px] text-muted-foreground">
                <span>{{ toFa(METRIC_LIMITS.height.min) }} CM</span>
                <span>{{ toFa(METRIC_LIMITS.height.max) }} CM</span>
              </div>
            </div>

            <!-- ۲. اسلایدر و ورودی وزن (KG) -->
            <div class="rounded-xl border border-sand bg-white p-4 space-y-3 shadow-2xs">
              <div class="flex items-center justify-between text-xs">
                <label for="weight-input" class="font-bold text-ink">
                  وزن شما (کیلوگرم)
                </label>
                <div class="flex items-center gap-1">
                  <input
                    id="weight-input"
                    v-model.number="weightKg"
                    type="number"
                    :min="METRIC_LIMITS.weight.min"
                    :max="METRIC_LIMITS.weight.max"
                    class="w-14 h-7 text-center rounded-lg border border-sand bg-sand/15 text-xs font-bold text-ink focus:border-rose focus:outline-none"
                  >
                  <span class="text-[11px] text-muted-foreground">KG</span>
                </div>
              </div>

              <Slider
                :model-value="[weightKg]"
                :min="METRIC_LIMITS.weight.min"
                :max="METRIC_LIMITS.weight.max"
                :step="METRIC_LIMITS.weight.step"
                @update:model-value="handleWeightSlider"
              />

              <div class="flex justify-between text-[10px] text-muted-foreground">
                <span>{{ toFa(METRIC_LIMITS.weight.min) }} KG</span>
                <span>{{ toFa(METRIC_LIMITS.weight.max) }} KG</span>
              </div>
            </div>
          </div>

          <!-- ۳. انتخاب ترجیح تنخور (Fit Preference) -->
          <div class="space-y-2.5">
            <span class="text-xs font-bold text-ink block">
              احساس تنخور مورد نظر شما:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                v-for="pref in preferenceOptions"
                :key="pref.id"
                type="button"
                class="rounded-xl border p-3 text-start transition-all cursor-pointer shadow-2xs"
                :class="[
                  fitPreference === pref.id
                    ? 'border-rose bg-rose/5 ring-1 ring-rose text-ink'
                    : 'border-sand bg-white text-muted-foreground hover:border-sand/80 hover:bg-sand/20',
                ]"
                @click="fitPreference = pref.id"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-ink">{{ pref.label }}</span>
                  <div
                    class="w-4 h-4 rounded-full border flex items-center justify-center"
                    :class="[
                      fitPreference === pref.id
                        ? 'border-rose bg-rose text-white'
                        : 'border-sand bg-white',
                    ]"
                  >
                    <Check v-if="fitPreference === pref.id" class="w-2.5 h-2.5 stroke-3" />
                  </div>
                </div>
                <p class="text-[10px] mt-1 text-muted-foreground leading-relaxed">
                  {{ pref.desc }}
                </p>
              </button>
            </div>
          </div>

          <!-- ۴. کارت پیشنهاد زنده (Live Recommendation Card) -->
          <div class="rounded-2xl border border-sand bg-sand/30 p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-sand/70 pb-3">
              <div class="flex items-center gap-2 text-xs font-bold text-ink">
                <Sparkles class="w-4 h-4 text-rose" />
                <span>
                  سایز پیشنهادی برای لاین {{ collection === 'move' ? 'حرکت (Move)' : 'آرامش (Calm)' }}
                </span>
              </div>
              <span class="rounded-full bg-sage/15 border border-sage/25 px-2.5 py-0.5 text-[10px] font-bold text-sage">
                {{ toFa(recommendation.confidence) }}٪ ضریب تطابق
              </span>
            </div>

            <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div class="text-center sm:text-start space-y-1.5 flex-1">
                <div class="flex items-center justify-center sm:justify-start gap-3">
                  <span class="text-4xl sm:text-5xl font-extrabold text-rose tracking-tight">
                    {{ recommendation.recommendedSize }}
                  </span>
                  <span class="text-xs text-muted-foreground font-medium">
                    (مناسب قد {{ toFa(heightCm) }} cm و وزن {{ toFa(weightKg) }} kg)
                  </span>
                </div>
                <p class="text-xs text-ink/80 leading-relaxed max-w-lg">
                  {{ recommendation.fitNote }}
                </p>
              </div>

              <!-- دکمه تایید و اعمال مستقیم -->
              <Button
                type="button"
                size="lg"
                class="w-full sm:w-auto h-11 px-6 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
                @click="applyRecommendedSize(recommendation.recommendedSize)"
              >
                <span>انتخاب سایز {{ recommendation.recommendedSize }} و اعمال</span>
                <ChevronLeft class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
