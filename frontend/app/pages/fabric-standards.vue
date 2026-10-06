<!-- frontend/app/pages/fabric-standards.vue -->
<script setup lang="ts">
import {
  Layers,
  ShieldCheck,
  Zap,
  Feather,
  Droplets,
  Sun,
  Flame,
  CheckCircle2,
  ArrowLeft,
  Activity,
  Wind,
} from '@lucide/vue'

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/fabric-standards',
    },
  ],
})

useSeoMeta({
  title: 'استاندارد الیاف و آزمون شفافیت | کراس',
  description: 'مشخصات فنی الیاف Move و Calm، گرماژ پارچه، آزمون اسکات ۱۰۰٪ پوشاننده و شیوه‌نامه مراقبت از منسوجات کراس',
  ogTitle: 'استاندارد الیاف و آزمون شفافیت | کراس',
  ogDescription: 'مشخصات فنی الیاف Move و Calm، گرماژ پارچه، آزمون اسکات ۱۰۰٪ پوشاننده و شیوه‌نامه مراقبت از منسوجات کراس',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

const moveSpecs = {
  name: 'Move Performance Interlock',
  tag: 'خط پرفشار و قدرتی',
  weight: '۳۰۰ گرم بر متر مربع (GSM)',
  blend: '۷۵٪ پلی‌آمید میکروفیلامنت با تراکم بالا + ۲۵٪ الاستین اکستریم',
  feel: 'فشرده، منسجم، مات و نگهدارنده ساختار عضلانی',
  idealFor: 'تمرینات پرفشار HIIT، کراس‌فیت، وزنه‌برداری، دوندگی سرعت',
  highlights: [
    'فشردگی هدفمند برای کاهش لرزش عضلانی حین فعالیت‌های سنگین',
    'آزمون اسکات ۱۰۰٪ بدون عبور نور در حداکثر کشیدگی مکانیکی',
    'فناوری دفع سریع رطوبت و انتقال عرق به لایه‌های بیرونی',
    'مقاومت بالا در برابر پرزدهی ناشی از اصطکاک هالتر یا کفپوش',
  ],
}

const calmSpecs = {
  name: 'Calm Peached CloudKnit',
  tag: 'خط آرامش و ریکاوری',
  weight: '۲۲۰ گرم بر متر مربع (GSM)',
  blend: '۸۰٪ نایلون پیچی‌شده (Micro-Peached) + ۲۰٪ لایکرا الترا سافت',
  feel: 'فوق‌العاده لطیف، حس پوست دوم، بافتی مخملی و سبک',
  idealFor: 'یوگا، پیلاتس، مدیتیشن، باراسل و سبک زندگی روزمره',
  highlights: [
    'کشش نامحدود ۴ جهته بدون ایجاد کوچک‌ترین فشار بر مفاصل',
    'تنفس‌پذیری پیوسته برای ایجاد تهویه طبیعی جریان هوا',
    'لمس لطیف مشابه پوست هلو بدون ایجاد الکتریسیته ساکن',
    'تثبیت فرم لباس بدون شل‌شدگی در استفاده طولانی‌مدت',
  ],
}

const comparisonMetrics = [
  {
    name: 'فشردگی و حمایت عضلانی',
    moveVal: 95,
    calmVal: 60,
    desc: 'میزان پایداری بافت در برابر حرکات ارتعاشی عضلات',
  },
  {
    name: 'حس سبکی و پوست دوم',
    moveVal: 75,
    calmVal: 98,
    desc: 'میزان لطافت و احساس نامحسوس بودن پارچه روی تن',
  },
  {
    name: 'تنفس‌پذیری و تهویه هوا',
    moveVal: 88,
    calmVal: 95,
    desc: 'سرعت عبور جریان هوا از بافت ریزساختار الیاف',
  },
  {
    name: 'مقاومت در برابر سایش و اصطکاک',
    moveVal: 96,
    calmVal: 75,
    desc: 'مقاومت تار و پود در برابر سایش مداوم و اصطکاک فیزیکی',
  },
]

const testProtocols = [
  {
    icon: Activity,
    title: 'آزمون کشش مکانیکی ۳۰۰ درصدی',
    desc: 'نمونه پارچه‌ها در ۳ جهت طولی، عرضی و مورب تا سقف ۳ برابر ابعاد عادی کشیده شده و بازگشت کشسانی اولیه آنها سنجیده می‌شود.',
  },
  {
    icon: ShieldCheck,
    title: 'آزمون اسکات ۱۰۰٪ (Squat-Proof)',
    desc: 'سنجش نفوذ نور با دستگاه طیف‌سنج نوری در حداکثر کشش ارگونومیک، عدم نمایان شدن لباس زیر یا خطوط بدن را تضمین می‌کند.',
  },
  {
    icon: Droplets,
    title: 'تست مدیریت تعریق و رطوبت',
    desc: 'آزمایش سرعت جذب و تبخیر قطرات آب روی سطح خارجی پارچه بدون ایجاد لکه مرئی روی الیاف در حین تمرین شدید.',
  },
]

const careInstructions = [
  {
    icon: Droplets,
    title: 'شستشو با آب سرد (حداکثر ۳۰ درجه سانتی‌گراد)',
    desc: 'دمای بالای آب ساختار رشته‌های الاستین را تضعیف می‌کند. چرخه شستشوی ملایم ماشین لباسشویی بهترین گزینه است.',
  },
  {
    icon: Flame,
    title: 'عدم استفاده از نرم‌کننده‌های شیمیایی',
    desc: 'نرم‌کننده‌ها منافذ میکروسکوپی پارچه را مسدود کرده و قابلیت تنفس‌پذیری و دفع سریع عرق را به شدت کاهش می‌دهند.',
  },
  {
    icon: Sun,
    title: 'خشک کردن در سایه بدون حرارت مستقیم',
    desc: 'از قرار دادن لباس در خشک‌کن‌های چرخشی داغ یا زیر نور مستقیم آفتاب پرهیز کنید. پارچه‌های کراس بسیار سریع در هوای آزاد خشک می‌شوند.',
  },
  {
    icon: Wind,
    title: 'بدون نیاز به اتوکشی',
    desc: 'منسوجات کراس دارای حافظه شکلی بوده و ذاتاً ضد چروک هستند؛ حرارت مستقیم اتو به رشته‌های کشسان آسیب می‌زند.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- هیرو سکشن -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-24">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Layers class="w-3.5 h-3.5" />
          <span>مهندسی نساجی و استانداردهای فنی</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          استاندارد الیاف و آزمون شفافیت (Squat-Proof)
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          در کراس، کیفیت یک ادعا نیست؛ حاصل تست‌های دقیق آزمایشگاهی و محاسبه گرماژ نساجی است تا آسودگی و وقار شما در هر حرکت ورزشی حفظ شود.
        </p>
      </div>
    </section>

    <!-- معرفی عمیق دو خط الیاف Move و Calm -->
    <section class="py-16 sm:py-20 container mx-auto px-4 max-w-5xl space-y-12">
      <div class="text-center space-y-3">
        <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">دوگانگی پارچه‌ها</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          مقایسه تخصصی الیاف Move در برابر Calm
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          هر تمرین، پاسخ فیزیولوژیک متفاوتی از لباس ورزشی می‌طلبد. مشخصات فنی هر دو خط منسوجات ما را بررسی کنید.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <!-- کارت مشخصات Move -->
        <div class="rounded-3xl border border-sand bg-white p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xs hover:border-rose/40 transition-colors">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-sand/60 pb-4">
              <div>
                <span class="text-xs font-bold text-rose uppercase tracking-wider font-mono">
                  {{ moveSpecs.tag }}
                </span>
                <h3 class="text-xl font-bold text-ink mt-1">
                  {{ moveSpecs.name }}
                </h3>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-rose/10 text-rose flex items-center justify-center shrink-0">
                <Zap class="w-5 h-5" />
              </div>
            </div>

            <!-- مشخصات ساختاری -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3.5 rounded-2xl bg-sand/20 border border-sand/40 space-y-1">
                <span class="text-muted-foreground block">گرماژ اختصاصی (GSM)</span>
                <span class="font-bold text-ink">{{ moveSpecs.weight }}</span>
              </div>
              <div class="p-3.5 rounded-2xl bg-sand/20 border border-sand/40 space-y-1">
                <span class="text-muted-foreground block">حس روی پوست</span>
                <span class="font-bold text-ink">{{ moveSpecs.feel }}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <span class="text-muted-foreground block font-medium">ترکیب الیاف:</span>
              <p class="font-medium text-ink bg-paper p-3 rounded-xl border border-sand/50 leading-relaxed">
                {{ moveSpecs.blend }}
              </p>
            </div>

            <!-- نکات کلیدی -->
            <ul class="space-y-2.5 text-xs text-ink/80 pt-2">
              <li v-for="h in moveSpecs.highlights" :key="h" class="flex items-start gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-rose shrink-0 mt-0.5" />
                <span class="leading-relaxed">{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- کارت مشخصات Calm -->
        <div class="rounded-3xl border border-sand bg-white p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xs hover:border-sage/40 transition-colors">
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-sand/60 pb-4">
              <div>
                <span class="text-xs font-bold text-sage uppercase tracking-wider font-mono">
                  {{ calmSpecs.tag }}
                </span>
                <h3 class="text-xl font-bold text-ink mt-1">
                  {{ calmSpecs.name }}
                </h3>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-sage/10 text-sage flex items-center justify-center shrink-0">
                <Feather class="w-5 h-5" />
              </div>
            </div>

            <!-- مشخصات ساختاری -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3.5 rounded-2xl bg-sand/20 border border-sand/40 space-y-1">
                <span class="text-muted-foreground block">گرماژ اختصاصی (GSM)</span>
                <span class="font-bold text-ink">{{ calmSpecs.weight }}</span>
              </div>
              <div class="p-3.5 rounded-2xl bg-sand/20 border border-sand/40 space-y-1">
                <span class="text-muted-foreground block">حس روی پوست</span>
                <span class="font-bold text-ink">{{ calmSpecs.feel }}</span>
              </div>
            </div>

            <div class="space-y-2 text-xs">
              <span class="text-muted-foreground block font-medium">ترکیب الیاف:</span>
              <p class="font-medium text-ink bg-paper p-3 rounded-xl border border-sand/50 leading-relaxed">
                {{ calmSpecs.blend }}
              </p>
            </div>

            <!-- نکات کلیدی -->
            <ul class="space-y-2.5 text-xs text-ink/80 pt-2">
              <li v-for="h in calmSpecs.highlights" :key="h" class="flex items-start gap-2.5">
                <CheckCircle2 class="w-4 h-4 text-sage shrink-0 mt-0.5" />
                <span class="leading-relaxed">{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- نمودارهای نواری مقایسه سنجه‌ها -->
    <section class="py-16 sm:py-20 border-t border-sand/60 bg-sand/15">
      <div class="container mx-auto px-4 max-w-4xl space-y-12">
        <div class="text-center space-y-3">
          <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">ماتریس عملکردی</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink">
            شاخص‌های عملکردی دو نوع بافت
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            مقایسه شاخص‌های کلیدی برای انتخاب متناسب‌ترین محصول بر اساس تمرین شما
          </p>
        </div>

        <div class="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-sand shadow-2xs">
          <!-- راهنمای رنگ‌ها -->
          <div class="flex items-center justify-center gap-8 text-xs font-bold">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-md bg-rose inline-block" />
              <span>سری پرفشار MOVE (قرمز عقیق)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 rounded-md bg-sage inline-block" />
              <span>سری آرامش CALM (سبز مریم‌گلی)</span>
            </div>
          </div>

          <div class="space-y-6 pt-2">
            <div
              v-for="metric in comparisonMetrics"
              :key="metric.name"
              class="space-y-2 pb-5 border-b border-sand/40 last:border-b-0 last:pb-0"
            >
              <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-ink">
                <span>{{ metric.name }}</span>
                <span class="text-xs text-muted-foreground font-normal">{{ metric.desc }}</span>
              </div>

              <!-- نوار Move -->
              <div class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-2xs text-muted-foreground">
                  <span>MOVE</span>
                  <span>{{ metric.moveVal }}٪</span>
                </div>
                <div class="w-full bg-sand/30 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="bg-rose h-2.5 rounded-full transition-all duration-500"
                    :style="{ width: `${metric.moveVal}%` }"
                  />
                </div>
              </div>

              <!-- نوار Calm -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-2xs text-muted-foreground">
                  <span>CALM</span>
                  <span>{{ metric.calmVal }}٪</span>
                </div>
                <div class="w-full bg-sand/30 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="bg-sage h-2.5 rounded-full transition-all duration-500"
                    :style="{ width: `${metric.calmVal}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- آزمون‌های آزمایشگاهی و Squat-Proof -->
    <section class="py-16 sm:py-20 container mx-auto px-4 max-w-5xl space-y-12">
      <div class="text-center space-y-3">
        <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">پروتکل تضمین کیفیت</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          آزمون شفافیت و پوشش اسکات (Squat-Proof)
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
          یکی از اصلی‌ترین دغدغه‌های ورزشکاران، شفاف شدن لگینگ‌ها یا تاپ‌های ورزشی در حین حرکات کششی عمیق است. پروتکل‌های ما تضمین می‌کنند که پوشاک کراس هرگز بدن‌نما نخواهد شد.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="protocol in testProtocols"
          :key="protocol.title"
          class="rounded-3xl border border-sand bg-white p-7 space-y-4 shadow-2xs"
        >
          <div class="w-12 h-12 rounded-2xl bg-sand/40 text-ink flex items-center justify-center">
            <component :is="protocol.icon" class="w-6 h-6 text-rose" />
          </div>
          <h3 class="text-base font-bold text-ink">
            {{ protocol.title }}
          </h3>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {{ protocol.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- راهنمای نگهداری و شستشو -->
    <section class="py-16 sm:py-20 border-t border-sand/60 bg-sand/10">
      <div class="container mx-auto px-4 max-w-5xl space-y-12">
        <div class="text-center space-y-3">
          <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">ماندگاری طولانی‌مدت</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink">
            شیوه‌نامه شستشو و مراقبت از پوشاک کراس
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            با رعایت چند نکته ساده، الیاف هوشمند کراس سال‌ها با همان کیفیت و کشسانی روز اول همراه شما خواهند بود.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="care in careInstructions"
            :key="care.title"
            class="rounded-3xl border border-sand bg-white p-7 space-y-3 shadow-2xs"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sand/40 text-rose flex items-center justify-center shrink-0">
                <component :is="care.icon" class="w-5 h-5" />
              </div>
              <h3 class="text-sm sm:text-base font-bold text-ink">
                {{ care.title }}
              </h3>
            </div>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {{ care.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- کال تو اکشن مشاهده محصولات -->
    <section class="py-16 sm:py-24 container mx-auto px-4 max-w-3xl text-center space-y-8">
      <div class="space-y-3">
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          تجربه لمس متریال مهندسی‌شده کراس
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          محصولات خط Move و Calm را در کاتالوگ فروشگاه مقایسه کنید و لباس متناسب با نوع تمرین خود را انتخاب فرمایید.
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ink text-sand hover:bg-ink/90 font-medium text-sm transition-colors shadow-sm"
      >
        <span>مشاهده کاتالوگ و محصولات</span>
        <ArrowLeft class="w-4 h-4" />
      </NuxtLink>
    </section>
  </div>
</template>
