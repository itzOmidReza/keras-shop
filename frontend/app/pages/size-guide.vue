<!-- frontend/app/pages/size-guide.vue -->
<script setup lang="ts">
import {
  Ruler,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Activity,
  Heart,
} from '@lucide/vue'
import { toFa } from '~/utils/format'
import {
  STANDARD_MEASUREMENTS,
  METRIC_LIMITS,
  calculateRecommendedSize,
} from '~/utils/fit-calculator'
import type { FitPreference } from '~/types/domain'

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/size-guide',
    },
  ],
})

useSeoMeta({
  title: 'راهنمای جامع سایزبندی و ابعاد متریک | کراس',
  description: 'راهنمای تخصصی تعیین سایز بر حسب سانتی‌متر و کیلوگرم برای پوشاک ورزشی لاین حرکت و آرامش کراس',
  ogTitle: 'راهنمای جامع سایزبندی و ابعاد متریک | کراس',
  ogDescription: 'راهنمای تخصصی تعیین سایز بر حسب سانتی‌متر و کیلوگرم برای پوشاک ورزشی لاین حرکت و آرامش کراس',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

// تب جدول‌های فعال: زنانه یا مردانه
const activeGenderTab = ref<'women' | 'men'>('women')

// متغیرهای محاسبه‌گر هوشمند
const heightCm = ref<number>(METRIC_LIMITS.height.default)
const weightKg = ref<number>(METRIC_LIMITS.weight.default)
const selectedCollection = ref<'move' | 'calm'>('move')
const selectedPreference = ref<FitPreference>('regular')

// ترجیحات تنخور
const preferenceOptions = [
  {
    id: 'snug' as FitPreference,
    label: 'فشرده و فرم‌دهنده (Snug)',
    desc: 'بیشترین میزان ساپورت عضلانی و فرم‌دهی متمرکز',
  },
  {
    id: 'regular' as FitPreference,
    label: 'استاندارد (True to Size)',
    desc: 'تعادل ارگونومیک میان فرم‌دهی و راحتی حرکتی',
  },
  {
    id: 'relaxed' as FitPreference,
    label: 'آزاد و رها (Relaxed)',
    desc: 'کمترین میزان فشار جانبی جهت تنفس آزاد الیاف',
  },
]

// نتیجه پیشنهاد هوشمند
const recommendation = computed(() => {
  return calculateRecommendedSize(
    heightCm.value,
    weightKg.value,
    selectedPreference.value,
    selectedCollection.value,
  )
})

// جدول‌های سایزبندی مردانه (ابعاد متریک به سانتی‌متر)
const menMeasurements = [
  { size: 'S', chest: 94, waist: 78, hip: 94, inseam: 76 },
  { size: 'M', chest: 100, waist: 84, hip: 100, inseam: 77 },
  { size: 'L', chest: 106, waist: 90, hip: 106, inseam: 78 },
  { size: 'XL', chest: 112, waist: 96, hip: 112, inseam: 79 },
  { size: '2XL', chest: 118, waist: 102, hip: 118, inseam: 80 },
]

// راهنمای تصویری نقاط اندازه‌گیری
const measurementSteps = [
  {
    step: '۰۱',
    title: 'دور سینه (Chest / Bust)',
    desc: 'متر خیاطی را به صورت افقی و موازی با زمین، دور برجسته‌ترین قسمت سینه و زیر بغل قرار دهید. تنفس عادی داشته باشید.',
    unit: 'سانتی‌متر (CM)',
  },
  {
    step: '۰۲',
    title: 'دور کمر طبیعی (Natural Waist)',
    desc: 'باریک‌ترین بخش تنه (حدود ۲ تا ۳ سانتی‌متر بالاتر از ناف) را بدون کشیدن بیش از حد متر اندازه‌گیری کنید.',
    unit: 'سانتی‌متر (CM)',
  },
  {
    step: '۰۳',
    title: 'دور باسن (Hips)',
    desc: 'بایستید و پاها را به هم بچسبانید. پهن‌ترین و برجسته‌ترین بخش لگن و باسن را اندازه بگیرید.',
    unit: 'سانتی‌متر (CM)',
  },
  {
    step: '۰۴',
    title: 'قد داخل پا (Inseam)',
    desc: 'از بالاترین نقطه فاق شلوار تا قوزک پا را در حالت ایستاده و کشیده اندازه بزنید.',
    unit: 'سانتی‌متر (CM)',
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر معرفی و روایت برند -->
    <section class="border-b border-sand/70 bg-sand/20 py-12 lg:py-20 px-4">
      <div class="container mx-auto max-w-5xl text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/60 border border-sand text-xs font-bold text-ink">
          <Ruler class="w-4 h-4 text-rose" />
          <span>راهنمای جامع اندازه‌گیری و تطابق متریک (CM / KG)</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink">
          تنخور بی‌نقص؛ بدون تردید در انتخاب سایز
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          پوشاک ورزشی کراس بر اساس آناتومی دقیق بدن و رفتار کشسانی ۴ جهته الیاف الگوبرداری شده است. با وارد کردن قد و وزن، سایز استاندارد خود را در چند ثانیه محاسبه کنید.
        </p>

        <!-- مقایسه فلسفه فیت لاین‌ها -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-6 text-start">
          <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-rose flex items-center gap-1.5">
                <Activity class="w-4 h-4" />
                لاین حرکت (Move Line)
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose/10 text-rose">
                تراکم ۳۰۰ گرمی
              </span>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              نگه‌دارندگی حداکثری و فشرده‌سازی عضلانی (Athletic Compression). الیاف اسپندکس با ریکاوری بالا که برای تمرینات پرفشار و اسکات طراحی شده‌اند.
            </p>
          </div>

          <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-sage flex items-center gap-1.5">
                <Heart class="w-4 h-4" />
                لاین آرامش (Calm Line)
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage/15 text-sage">
                تراکم ۲۲۰ گرمی
              </span>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              بافت مخملی و بسیار لطیف همچون پوست دوم (Second-Skin Feel). کشسانی سبک و نرم بدون کوچک‌ترین فشار، ایده‌آل برای یوگا، پیلاتس و ریکاوری.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- بخش محاسبه‌گر هوشمند سایز (Smart Fit Calculator) -->
    <section class="container mx-auto max-w-5xl px-4 py-12 lg:py-16">
      <div class="rounded-3xl border border-sand/80 bg-white p-6 sm:p-10 shadow-xs space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/60 pb-6">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-rose" />
              <h2 class="text-xl sm:text-2xl font-bold text-ink">
                محاسبه‌گر هوشمند سایز
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-muted-foreground">
              ابعاد فیزیکی خود را وارد کنید تا بهترین سایز متناسب با تنخور مورد نظرتان پیشنهاد شود.
            </p>
          </div>

          <!-- انتخاب لاین کالا -->
          <div class="inline-flex rounded-xl bg-sand/30 p-1 border border-sand self-start sm:self-auto">
            <button
              type="button"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              :class="selectedCollection === 'move' ? 'bg-rose text-white shadow-xs' : 'text-ink hover:text-rose'"
              @click="selectedCollection = 'move'"
            >
              کالکشن حرکت (Move)
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              :class="selectedCollection === 'calm' ? 'bg-sage text-white shadow-xs' : 'text-ink hover:text-sage'"
              @click="selectedCollection = 'calm'"
            >
              کالکشن آرامش (Calm)
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- اسلایدرها و ورودی‌ها (۷ ستون) -->
          <div class="lg:col-span-7 space-y-6">
            <!-- قد -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-ink">قد شما:</span>
                <span class="font-mono text-rose text-sm bg-rose/10 px-2.5 py-0.5 rounded-lg">
                  {{ toFa(heightCm) }} سانتی‌متر (CM)
                </span>
              </div>
              <input
                v-model.number="heightCm"
                type="range"
                :min="METRIC_LIMITS.height.min"
                :max="METRIC_LIMITS.height.max"
                class="w-full accent-rose cursor-pointer"
              >
              <div class="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{{ toFa(METRIC_LIMITS.height.min) }} CM</span>
                <span>{{ toFa(METRIC_LIMITS.height.max) }} CM</span>
              </div>
            </div>

            <!-- وزن -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-ink">وزن شما:</span>
                <span class="font-mono text-rose text-sm bg-rose/10 px-2.5 py-0.5 rounded-lg">
                  {{ toFa(weightKg) }} کیلوگرم (KG)
                </span>
              </div>
              <input
                v-model.number="weightKg"
                type="range"
                :min="METRIC_LIMITS.weight.min"
                :max="METRIC_LIMITS.weight.max"
                class="w-full accent-rose cursor-pointer"
              >
              <div class="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{{ toFa(METRIC_LIMITS.weight.min) }} KG</span>
                <span>{{ toFa(METRIC_LIMITS.weight.max) }} KG</span>
              </div>
            </div>

            <!-- سلیقه در تنخور -->
            <div class="space-y-2 pt-2">
              <label class="text-xs font-bold text-ink block">
                ترجیح شما در میزان جذب بودن لباس:
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  v-for="opt in preferenceOptions"
                  :key="opt.id"
                  type="button"
                  class="p-3 rounded-xl border text-start transition-all cursor-pointer space-y-1"
                  :class="[
                    selectedPreference === opt.id
                      ? 'border-rose bg-rose/5 ring-1 ring-rose shadow-2xs'
                      : 'border-sand bg-white hover:border-sand/80',
                  ]"
                  @click="selectedPreference = opt.id"
                >
                  <div class="text-xs font-bold text-ink">
                    {{ opt.label }}
                  </div>
                  <div class="text-[10px] text-muted-foreground leading-relaxed">
                    {{ opt.desc }}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- کارت نتیجه پیشنهاد (۵ ستون) -->
          <div class="lg:col-span-5 bg-sand/20 border border-sand/70 rounded-2xl p-6 text-center space-y-5">
            <div class="space-y-2">
              <span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                سایز پیشنهادی هوشمند کراس
              </span>
              <div class="w-20 h-20 rounded-2xl bg-rose text-white mx-auto flex items-center justify-center font-bold text-3xl shadow-sm">
                {{ recommendation.recommendedSize }}
              </div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/15 text-sage text-xs font-bold">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>دقت تطابق: {{ toFa(recommendation.confidence) }}٪</span>
              </div>
            </div>

            <div class="rounded-xl bg-white p-4 border border-sand/50 text-start space-y-2">
              <div class="text-xs font-bold text-ink flex items-center gap-1.5">
                <Info class="w-3.5 h-3.5 text-rose" />
                <span>تحلیل آناتومیک:</span>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">
                {{ recommendation.fitNote }}
              </p>
            </div>

            <NuxtLink
              to="/shop"
              class="w-full py-3 px-6 rounded-xl bg-ink hover:bg-rose text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>مشاهده کالکشن با سایز {{ recommendation.recommendedSize }}</span>
              <ArrowLeft class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- جدول‌های مقادیر استاندارد متریک -->
    <section class="container mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-ink">
            جدول دقیق ابعاد متریک لباس
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
            تمامی اندازه‌ها بر حسب سانتی‌متر (CM) و بر مبنای دور تا دور بدن سنجیده شده‌اند.
          </p>
        </div>

        <!-- سوییچ زنانه / مردانه -->
        <div class="inline-flex rounded-xl bg-sand/40 p-1 border border-sand">
          <button
            type="button"
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            :class="activeGenderTab === 'women' ? 'bg-white text-ink shadow-xs' : 'text-muted-foreground hover:text-ink'"
            @click="activeGenderTab = 'women'"
          >
            پوشاک زنانه
          </button>
          <button
            type="button"
            class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            :class="activeGenderTab === 'men' ? 'bg-white text-ink shadow-xs' : 'text-muted-foreground hover:text-ink'"
            @click="activeGenderTab = 'men'"
          >
            پوشاک مردانه
          </button>
        </div>
      </div>

      <!-- جدول زنانه -->
      <div v-if="activeGenderTab === 'women'" class="rounded-2xl border border-sand overflow-hidden bg-white shadow-2xs">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-start">
            <thead class="bg-sand/30 border-b border-sand text-ink font-bold">
              <tr>
                <th class="p-3.5 text-start">سایز</th>
                <th class="p-3.5 text-center">دور سینه (CM)</th>
                <th class="p-3.5 text-center">دور کمر (CM)</th>
                <th class="p-3.5 text-center">دور باسن (CM)</th>
                <th class="p-3.5 text-center">قد داخل پا (Inseam)</th>
                <th class="p-3.5 text-center">سایز معادل اروپایی (EU)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand/40 font-mono">
              <tr v-for="row in STANDARD_MEASUREMENTS" :key="row.size" class="hover:bg-sand/10 transition-colors">
                <td class="p-3.5 font-bold font-sans text-rose text-start">{{ row.size }}</td>
                <td class="p-3.5 text-center">{{ toFa(row.bust || 0) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.waist) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.hips) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.inseam || 0) }} سانتی‌متر</td>
                <td class="p-3.5 text-center font-sans text-muted-foreground">
                  {{ row.size === 'XS' ? '34' : row.size === 'S' ? '36 - 38' : row.size === 'M' ? '40' : row.size === 'L' ? '42' : '44' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- جدول مردانه -->
      <div v-else class="rounded-2xl border border-sand overflow-hidden bg-white shadow-2xs">
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-start">
            <thead class="bg-sand/30 border-b border-sand text-ink font-bold">
              <tr>
                <th class="p-3.5 text-start">سایز</th>
                <th class="p-3.5 text-center">دور سینه (CM)</th>
                <th class="p-3.5 text-center">دور کمر (CM)</th>
                <th class="p-3.5 text-center">دور باسن (CM)</th>
                <th class="p-3.5 text-center">قد داخل پا (CM)</th>
                <th class="p-3.5 text-center">سایز معادل اروپایی (EU)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand/40 font-mono">
              <tr v-for="row in menMeasurements" :key="row.size" class="hover:bg-sand/10 transition-colors">
                <td class="p-3.5 font-bold font-sans text-rose text-start">{{ row.size }}</td>
                <td class="p-3.5 text-center">{{ toFa(row.chest) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.waist) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.hip) }} سانتی‌متر</td>
                <td class="p-3.5 text-center">{{ toFa(row.inseam) }} سانتی‌متر</td>
                <td class="p-3.5 text-center font-sans text-muted-foreground">
                  {{ row.size === 'S' ? '46 - 48' : row.size === 'M' ? '50' : row.size === 'L' ? '52' : row.size === 'XL' ? '54' : '56' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- راهنمای گام‌به‌گام نحوه اندازه‌گیری با متر -->
    <section class="container mx-auto max-w-5xl px-4 py-8">
      <div class="rounded-3xl border border-sand bg-white p-6 sm:p-10 space-y-8">
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-bold text-ink">
            چگونه ابعاد بدن خود را با متر خیاطی اندازه بگیریم؟
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground">
            برای دستیابی به دقیق‌ترین نتیجه، متر را به آرامی بدون فشردن بافت پوست روی خطوط آناتومیک قرار دهید.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="item in measurementSteps"
            :key="item.step"
            class="rounded-2xl border border-sand bg-paper p-5 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold font-mono text-rose">{{ item.step }}</span>
              <span class="text-[10px] font-bold text-muted-foreground bg-sand/60 px-2 py-0.5 rounded-full">
                {{ item.unit }}
              </span>
            </div>
            <h3 class="text-xs font-bold text-ink">
              {{ item.title }}
            </h3>
            <p class="text-[11px] text-muted-foreground leading-relaxed">
              {{ item.desc }}
            </p>
          </div>
        </div>

        <!-- بنر ضمانت تعویض سایز رایگان ۷ روزه -->
        <div class="rounded-2xl border border-sage/40 bg-sage/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sage/20 text-sage flex items-center justify-center shrink-0">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <div class="text-xs font-bold text-ink">
                ضمانت ۷ روزه تعویض رایگان سایز در کراس
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                اگر سایز دریافتی کاملاً متناسب نبود، بدون هزینه ارسال مجدد تا ۷ روز تعویض فرمایید.
              </p>
            </div>
          </div>

          <NuxtLink
            to="/returns"
            class="text-xs font-bold text-sage hover:underline shrink-0"
          >
            مطالعه قوانین بازگشت کالا
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
