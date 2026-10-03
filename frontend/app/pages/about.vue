<!-- frontend/app/pages/about.vue -->
<script setup lang="ts">
import {
  Sparkles,
  Zap,
  Feather,
  ShieldCheck,
  Compass,
  HeartHandshake,
  ArrowLeft,
  CheckCircle2,
} from '@lucide/vue'

useSeoMeta({
  title: 'داستان و فلسفه برند | کراس',
  description: 'داستان تولد برند کراس، پیوند مهندسی پیشرفته منسوجات ورزشی و زیبایی‌شناسی مینیمال برای سبک زندگی پویا و آرام',
})

const coreValues = [
  {
    icon: Zap,
    title: 'نوآوری در متریال',
    description: 'توسعه پارچه‌های اختصاصی با گرماژ مهندسی‌شده، کشسانی ۴ جهته و بافت بدون درز برای حذف هرگونه محدودیت حرکتی.',
  },
  {
    icon: Compass,
    title: 'تناسب دقیق آناتومیک',
    description: 'الگوسازی دقیق بر پایه آناتومی بدن ورزشکاران بدون نقاط فشار موضعی یا ساییدگی پوست در طول تمرینات مستمر.',
  },
  {
    icon: ShieldCheck,
    title: 'تولید اخلاقی و مسئولانه',
    description: 'انتخاب الیاف با طول عمر بالا، کنترل دقیق زنجیره تامین و بسته‌بندی‌های کاملاً زیست‌تخریب‌پذیر در احترام به طبیعت.',
  },
]

const milestones = [
  { value: '۲ خط تخصصی', label: 'طراحی متمایز بر اساس نیاز فیزیولوژیک (Move & Calm)' },
  { value: '۱۰۰٪ آزمون اسکات', label: 'تست عدم شفافیت و پوشش کامل در حداکثر کشش' },
  { value: '۷ روز مهلت بررسی', label: 'ضمانت تعویض و بازگشت بی قید و شرط برای آسودگی خیال' },
  { value: 'الیاف ضد حساسیت', label: 'بافت تنفس‌پذیر با گواهی سلامت و استانداردهای بهداشتی' },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- بخش معرفی و هیرو -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-24">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Sparkles class="w-3.5 h-3.5" />
          <span>هویت و فلسفه کراس</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          تلاقی مهندسی پیشرفته پارچه و ظرافت مینیمال
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          برند پوشاک ورزشی کراس (Keras)، زاده‌ی باوری عمیق است: لباس ورزشی نباید بین عملکرد پرفشار و زیبایی مینیمال مرزی قائل شود. ما منسوجاتی خلق می‌کنیم که از سنگین‌ترین تمرینات تا آرام‌ترین لحظات ریکاوری، پوست دوم شما باشند.
        </p>
      </div>
    </section>

    <!-- بخش مانیفست دو خط هویتی Move و Calm -->
    <section class="py-16 sm:py-24 container mx-auto px-4 max-w-5xl">
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">دوگانگی مکمل</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          فلسفه دوگانه: پویایی در حرکت، سکون در آرامش
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          بدن انسان در چرخه‌ای مداوم از فعالیت پرفشار و بازسازی آرام سیر می‌کند. کالکشن‌های کراس بر اساس این دو نیاز بنیادین شکل گرفته‌اند.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <!-- کارت خط Move -->
        <div class="rounded-3xl border border-sand bg-white p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-rose/40 transition-colors">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold font-mono">
                MOVE LINE
              </span>
              <Zap class="w-5 h-5 text-rose" />
            </div>

            <h3 class="text-xl font-bold text-ink">
              پویایی، فشردگی و تمرکز بالا
            </h3>

            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              طراحی‌شده برای تمرینات اینتروال شدید، کراس‌فیت، دویدن و وزنه‌برداری. الیاف متراکم با گرماژ ۳۰۰ گرم بر متر مربع حمایت کامل عضلانی فراهم کرده و از لغزش یا جابه‌جایی لباس هنگام حرکات انفجاری جلوگیری می‌کنند.
            </p>

            <ul class="space-y-2.5 pt-2 text-xs text-ink/80 font-medium">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-rose shrink-0" />
                <span>فشردگی متوسط رو به بالا برای تثبیت عضلات فعال</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-rose shrink-0" />
                <span>۱۰۰٪ کدر در آزمون‌های کشش و خمیدگی اسکات</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-rose shrink-0" />
                <span>فناوری Quick-Dry جهت تبخیر سریع تعریق</span>
              </li>
            </ul>
          </div>

          <div class="pt-6 border-t border-sand/60">
            <NuxtLink
              to="/shop?line=move"
              class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
            >
              <span>مشاهده محصولات خط Move</span>
              <ArrowLeft class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>

        <!-- کارت خط Calm -->
        <div class="rounded-3xl border border-sand bg-white p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-2xs relative overflow-hidden group hover:border-sage/40 transition-colors">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full bg-sage/15 text-sage text-xs font-bold font-mono">
                CALM LINE
              </span>
              <Feather class="w-5 h-5 text-sage" />
            </div>

            <h3 class="text-xl font-bold text-ink">
              رهایی، لطافت و جریان سیال
            </h3>

            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              خلق‌شده برای یوگا، پیلاتس، تن‌آرامی و روزمرگی هوشمندانه. بافت سبک ۲۲۰ گرمی با لمس هلو و الیاف نرم ابریشمی که احساس رهایی مطلق و عدم حضور هرگونه مانع پارچه‌ای را القا می‌کند.
            </p>

            <ul class="space-y-2.5 pt-2 text-xs text-ink/80 font-medium">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-sage shrink-0" />
                <span>لمس بسیار لطیف پوست دوم (Second-Skin Feel)</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-sage shrink-0" />
                <span>تنفس‌پذیری فوق‌العاده برای جریان طبیعی هوا</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-sage shrink-0" />
                <span>کمر پهن کشسان بدون ایجاد ردی بر روی پوست</span>
              </li>
            </ul>
          </div>

          <div class="pt-6 border-t border-sand/60">
            <NuxtLink
              to="/shop?line=calm"
              class="inline-flex items-center gap-2 text-xs font-bold text-sage hover:underline"
            >
              <span>مشاهده محصولات خط Calm</span>
              <ArrowLeft class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- نقل‌قول مانیفست ادیتوریال -->
    <section class="border-y border-sand/60 bg-sand/30 py-16">
      <div class="container mx-auto px-4 max-w-3xl text-center space-y-4">
        <HeartHandshake class="w-8 h-8 text-rose mx-auto" />
        <blockquote class="text-lg sm:text-xl font-bold text-ink leading-relaxed tracking-tight">
          «ما بر این باوریم که پوشاک ورزشی نباید ابزاری موقت باشد؛ بلکه همراهی وفادار در مسیر مراقبت از تن و روان است. به همین دلیل در هر سانتی‌متر از پارچه و دوخت، کمال‌گرایی را دیکته می‌کنیم.»
        </blockquote>
        <p class="text-xs text-muted-foreground font-medium pt-2">
          تیم طراحی و مهندسی منسوجات کراس
        </p>
      </div>
    </section>

    <!-- سه ارزش محوری -->
    <section class="py-16 sm:py-24 container mx-auto px-4 max-w-5xl">
      <div class="text-center space-y-3 mb-12">
        <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">تعهد به کیفیت</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          ارزش‌های بنیادین در ساخت هر قطعه
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="val in coreValues"
          :key="val.title"
          class="rounded-3xl border border-sand bg-white p-7 space-y-4 shadow-2xs"
        >
          <div class="w-12 h-12 rounded-2xl bg-sand/40 text-rose flex items-center justify-center">
            <component :is="val.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-ink">{{ val.title }}</h3>
          <p class="text-xs text-muted-foreground leading-relaxed">{{ val.description }}</p>
        </div>
      </div>
    </section>

    <!-- آمار و شاخص‌های کلیدی -->
    <section class="container mx-auto px-4 max-w-5xl pb-8">
      <div class="rounded-3xl border border-sand bg-white p-8 sm:p-12 shadow-2xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-for="item in milestones" :key="item.value" class="space-y-2">
            <span class="text-xl sm:text-2xl font-bold font-mono text-ink block">{{ item.value }}</span>
            <p class="text-xs text-muted-foreground leading-relaxed">{{ item.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- دعوت به عمل پایانی -->
    <section class="container mx-auto px-4 max-w-4xl pt-8 text-center space-y-5">
      <h2 class="text-xl sm:text-2xl font-bold text-ink">
        حس متفاوت پوشاک ورزشی کراس را تجربه کنید
      </h2>
      <div>
        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-2 rounded-xl bg-rose px-8 py-3.5 text-xs font-bold text-white hover:bg-rose/90 shadow-xs transition-colors cursor-pointer"
        >
          <span>مشاهده تمامی کالکشن‌ها</span>
          <ArrowLeft class="w-4 h-4" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
