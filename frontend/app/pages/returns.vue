<!-- frontend/app/pages/returns.vue -->
<script setup lang="ts">
import {
  RotateCcw,
  ShieldCheck,
  PackageCheck,
  Truck,
  Headphones,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Sparkles,
} from '@lucide/vue'

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/returns',
    },
  ],
})

useSeoMeta({
  title: 'شرایط تعویض و بازگشت کالا | کراس',
  description: 'رویه بازگشت و تعویض ۷ روزه پوشاک ورزشی کراس، شرایط بهداشتی، مراحل گام‌به‌گام و استرداد وجه',
  ogTitle: 'شرایط تعویض و بازگشت کالا | کراس',
  ogDescription: 'رویه بازگشت و تعویض ۷ روزه پوشاک ورزشی کراس، شرایط بهداشتی، مراحل گام‌به‌گام و استرداد وجه',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

const guaranteeFeatures = [
  {
    icon: Clock,
    title: '۷ روز مهلت بررسی',
    desc: 'از لحظه تحویل مرسوله، ۷ روز کاری فرصت دارید محصول را در منزل پرو کرده و از فیت ایده‌آل آن اطمینان حاصل کنید.',
  },
  {
    icon: RotateCcw,
    title: 'اولین تعویض سایز رایگان',
    desc: 'هزینه دریافت و ارسال مجدد برای اولین نوبت تعویض سایز در سراسر کشور به طور کامل بر عهده کراس است.',
  },
  {
    icon: ShieldCheck,
    title: 'استرداد وجه ظرف ۴۸ ساعت',
    desc: 'در صورت انصراف از خرید، وجه پرداختی حداکثر ظرف ۴۸ ساعت کاری پس از تایید واحد فنی کنترل کیفیت به شبا واریز می‌گردد.',
  },
]

const steps = [
  {
    step: '۰۱',
    title: 'ثبت درخواست در کانسیرژ',
    desc: 'از طریق فرم تماس با ما، پنل کاربری یا پیام به پشتیبانی، شناسه سفارش و علت درخواست تعویض یا مرجوعی خود را ثبت فرمایید.',
    icon: Headphones,
  },
  {
    step: '۰۲',
    title: 'بسته‌بندی کالا در جعبه اولیه',
    desc: 'محصول را به همراه کاور محافظ و کارتن اختصاصی کراس بسته‌بندی کنید. اتیکت‌های کالا و بارکد الصاقی نباید جدا شوند.',
    icon: PackageCheck,
  },
  {
    step: '۰۳',
    title: 'تحویل به پیک یا پست',
    desc: 'در تهران هماهنگی تحویل با پیک اختصاصی و در سایر شهرها از طریق باجه‌های پستی یا تیپاکس انجام می‌شود.',
    icon: Truck,
  },
]

const permittedRules = [
  'پرو لباس ورزشی روی لباس زیر پاکیزه',
  'سالم بودن تمامی اتیکت‌های مقوایی، پارچه‌ای و بارکدها',
  'قرار داشتن محصول در جعبه اختصاصی و کاور محافظ اولیه',
  'عدم وجود هرگونه کشیدگی، دررفتگی نخ یا آسیب به بافت',
]

const forbiddenRules = [
  'استفاده از پوشاک در تمرینات ورزشی یا خارج از منزل',
  'استشمام بوی عطر، دئودورانت، لکه تعریق یا مواد شوینده',
  'کنده شدن یا مخدوش شدن اتیکت‌ها و برچسب‌های کنترل کیفی',
  'شستشوی کالا به هر روش دستی یا ماشینی پیش از مرجوعی',
]

const returnFaqs = [
  {
    q: 'آیا برای تعویض سایز هزینه‌ای پرداخت می‌کنم؟',
    a: 'خیر. کراس بر این باور است که تجربه برازندگی لباس ورزشی نباید هزینه اضافی داشته باشد. نخستین تعویض سایز در تمامی سفارش‌ها کاملاً رایگان است.',
  },
  {
    q: 'مبلغ مرجوعی چگونه و چه زمانی واریز می‌شود؟',
    a: 'پس از رسیدن بسته به مرکز لجستیک و بررسی اصالت و موازین بهداشتی توسط کارشناسان، مبلغ کالا ظرف حداکثر ۴۸ ساعت کاری به شماره شبای ثبت‌شده به نام خریدار واریز می‌گردد.',
  },
  {
    q: 'اگر سایز مورد نظر من ناموجود باشد چه اتفاقی می‌افتد؟',
    a: 'کانسیرژ کراس دو گزینه به شما پیشنهاد می‌دهد: تعویض با محصول دیگر هم‌ارزش یا استرداد کامل وجه پرداختی به حساب بانکی شما.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- هیرو سکشن -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-24">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Sparkles class="w-3.5 h-3.5" />
          <span>تعهد اصالت و همراهی</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          رویه شفاف تعویض و بازگشت کالا
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          ما می‌دانیم انتخاب سایز دقیق پوشاک ورزشی نیازمند تست روی اندام است. به همین دلیل تا ۷ روز پس از دریافت سفارش، با آرامش خاطر کامل می‌توانید سایز خود را تغییر داده یا کالا را مرجوع کنید.
        </p>
      </div>
    </section>

    <!-- ۳ کارت اصلی ضمانت -->
    <section class="py-12 sm:py-16 container mx-auto px-4 max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="item in guaranteeFeatures"
          :key="item.title"
          class="rounded-3xl border border-sand bg-white p-7 space-y-4 shadow-2xs hover:border-rose/40 transition-colors"
        >
          <div class="w-12 h-12 rounded-2xl bg-sand/40 text-ink flex items-center justify-center">
            <component :is="item.icon" class="w-6 h-6 text-rose" />
          </div>
          <h3 class="text-base font-bold text-ink">
            {{ item.title }}
          </h3>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- مراحل ۳ گانه بازگشت -->
    <section class="py-12 sm:py-16 border-t border-sand/60 bg-sand/10">
      <div class="container mx-auto px-4 max-w-5xl space-y-12">
        <div class="text-center space-y-3">
          <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">مراحل اجرایی</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink">
            فرآیند گام‌به‌گام تعویض یا عودت
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            ۳ مرحله ساده تا تجربه یک خرید آسوده و بدون اصطکاک در کراس
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="step in steps"
            :key="step.step"
            class="rounded-3xl border border-sand bg-white p-8 space-y-6 relative flex flex-col justify-between shadow-2xs"
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-3xl font-bold text-rose/30 font-mono">
                  {{ step.step }}
                </span>
                <component :is="step.icon" class="w-5 h-5 text-muted-foreground" />
              </div>

              <h3 class="text-lg font-bold text-ink">
                {{ step.title }}
              </h3>

              <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- پروتکل و موازین بهداشتی -->
    <section class="py-16 sm:py-20 container mx-auto px-4 max-w-5xl space-y-12">
      <div class="text-center space-y-3">
        <span class="text-xs font-bold tracking-widest text-muted-foreground uppercase">استانداردهای سلامت</span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          موازین و شیوه‌نامه بهداشتی
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
          به دلیل ارتباط مستقیم پوشاک ورزشی با پوست بدن، رعایت موازین بهداشتی برای حفظ سلامت تمام همراهان کراس الزامی است.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- شرایط پذیرفته‌شده -->
        <div class="rounded-3xl border border-sage/40 bg-white p-8 space-y-6 shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
              <CheckCircle2 class="w-5 h-5 text-sage" />
            </div>
            <div>
              <h3 class="text-base font-bold text-ink">
                شرایط تایید تعویض و عودت
              </h3>
              <p class="text-xs text-muted-foreground">کالاهایی با ویژگی‌های زیر بدون قید و شرط پذیرفته می‌شوند</p>
            </div>
          </div>

          <ul class="space-y-3.5 text-xs sm:text-sm text-ink/80">
            <li v-for="rule in permittedRules" :key="rule" class="flex items-start gap-3">
              <CheckCircle2 class="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <span class="leading-relaxed">{{ rule }}</span>
            </li>
          </ul>
        </div>

        <!-- شرایط غیرقابل عودت -->
        <div class="rounded-3xl border border-rose/30 bg-white p-8 space-y-6 shadow-2xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-rose/15 text-rose flex items-center justify-center shrink-0">
              <XCircle class="w-5 h-5 text-rose" />
            </div>
            <div>
              <h3 class="text-base font-bold text-ink">
                مواردی که مشمول مرجوعی نیستند
              </h3>
              <p class="text-xs text-muted-foreground">به جهت حفظ موازین بهداشتی از پذیرش این موارد معذوریم</p>
            </div>
          </div>

          <ul class="space-y-3.5 text-xs sm:text-sm text-ink/80">
            <li v-for="rule in forbiddenRules" :key="rule" class="flex items-start gap-3">
              <XCircle class="w-4 h-4 text-rose shrink-0 mt-0.5" />
              <span class="leading-relaxed">{{ rule }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- پرسش‌های پرتکرار مرجوعی -->
    <section class="py-12 sm:py-16 border-t border-sand/60 bg-sand/15">
      <div class="container mx-auto px-4 max-w-4xl space-y-8">
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 text-rose text-xs font-bold">
            <HelpCircle class="w-4 h-4" />
            <span>پاسخ به ابهامات رایج</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-ink">
            سوالات متداول پیرامون تعویض و بازگشت
          </h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="faq in returnFaqs"
            :key="faq.q"
            class="rounded-2xl border border-sand bg-white p-6 space-y-2 shadow-2xs"
          >
            <h3 class="text-sm sm:text-base font-bold text-ink">
              {{ faq.q }}
            </h3>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {{ faq.a }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- کال تو اکشن ثبت درخواست -->
    <section class="py-16 sm:py-24 container mx-auto px-4 max-w-3xl text-center space-y-8">
      <div class="space-y-3">
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          آماده ثبت درخواست تعویض یا مرجوعی هستید؟
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
          تیم کانسیرژ کراس در تمامی روزهای هفته آماده ثبت، پیگیری و هماهنگی ارسال کالای شماست.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/contact?subject=return"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ink text-sand hover:bg-ink/90 font-medium text-sm transition-colors shadow-sm"
        >
          <span>ارتباط با کانسیرژ و ثبت درخواست</span>
          <ArrowLeft class="w-4 h-4" />
        </NuxtLink>

        <NuxtLink
          to="/account"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-sand bg-white text-ink hover:bg-sand/20 font-medium text-sm transition-colors"
        >
          <span>مشاهده سفارش‌ها در پنل کاربری</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
