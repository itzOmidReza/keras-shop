<!-- frontend/app/pages/terms.vue -->
<script setup lang="ts">
import {
  Scale,
  ArrowLeft,
  Clock,
  CheckCircle2,
} from '@lucide/vue'

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/terms',
    },
  ],
})

useSeoMeta({
  title: 'قوانین و مقررات خرید | کراس',
  description: 'شرایط، ضوابط خرید آنلاین، تعهدات متقابل، احراز هویت پیامکی و حقوق مصرف‌کننده در فروشگاه کراس',
  ogTitle: 'قوانین و مقررات خرید | کراس',
  ogDescription: 'شرایط، ضوابط خرید آنلاین، تعهدات متقابل، احراز هویت پیامکی و حقوق مصرف‌کننده در فروشگاه کراس',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

const sections = [
  {
    number: 'ماده ۱',
    title: 'تعاریف و اصطلاحات',
    content: [
      'فروشگاه: وب‌سایت رسمی برند پوشاک ورزشی کراس (Keras) به عنوان ارائه‌دهنده و عرضه‌کننده مستقیم محصولات.',
      'کاربر / خریدار: هر شخص حقیقی یا حقوقی که با ثبت شماره همراه و تایید کد پیامکی (OTP)، اقدام به ایجاد حساب کاربری، مرور محصولات یا ثبت سفارش می‌نماید.',
      'سفارش: ثبت نهایی یک یا چند قلم کالا از میان محصولات کاتالوگ در سبد خرید به همراه تعیین آدرس تحویل و پرداخت مبلغ از طریق درگاه پرداخت اینترنتی.',
      'کانسیرژ: واحد پشتیبانی، راهنمایی سایز و خدمات اختصاصی مشتریان کراس.',
    ],
  },
  {
    number: 'ماده ۲',
    title: 'احراز هویت و حساب کاربری',
    content: [
      'احراز هویت در کراس با استفاده از شماره تلفن همراه معتبر منطبق با پیش‌شماره‌های مخابراتی ایران (09...) و ارسال رمز یکبار مصرف پیامکی (OTP) صورت می‌گیرد.',
      'کاربر مسئول مستقیم صحت اطلاعات ثبت‌شده از جمله نام، نام خانوادگی، کد پستی ده‌رقمی و آدرس دقیق تحویل مرسوله است. هرگونه تاخیر ناشی از ثبت نشانی اشتباه بر عهده خریدار خواهد بود.',
      'حفظ امنیت تلفن همراه و کدهای پیامکی دریافتی بر عهده کاربر بوده و تمامی سفارش‌های ثبت‌شده با شماره کاربر، معتبر تلقی می‌شوند.',
    ],
  },
  {
    number: 'ماده ۳',
    title: 'قیمت‌گذاری و پرداخت',
    content: [
      'کلیه قیمت‌های مندرج در وب‌سایت به واحد پولی تومان بوده و به‌صورت شفاف و نهایی نمایش داده می‌شوند.',
      'پس از ثبت نهایی سفارش و دریافت تاییدیه پرداخت در درگاه بانکی شاپرک، قیمت کالا قطعی بوده و مشمول هیچ‌گونه نوسان، افزایش یا تغییر بعدی نخواهد شد.',
      'در صورت استفاده از کدهای تخفیف، اعمال آنها صرفاً در بازه زمانی معتبر و پیش از پرداخت نهایی امکان‌پذیر است و امکان اعمال تخفیف پس از تسویه وجود ندارد.',
    ],
  },
  {
    number: 'ماده ۴',
    title: 'پردازش، بسته‌بندی و ارسال سفارش‌ها',
    content: [
      'سفارش‌های ثبت‌شده در روزهای کاری بلافاصله وارد فرآیند کنترل کیفی نهایی و بسته‌بندی در جعبه‌های اختصاصی کراس می‌شوند.',
      'ارسال در شهر تهران از طریق پیک اختصاصی و در سایر شهرستان‌ها از طریق شرکت ملی پست یا تیپاکس صورت می‌پذیرد.',
      'تمامی بسته‌های ارسالی کراس تحت پوشش بیمه کامل مرسولات پستی قرار دارند تا در صورت آسیب فیزیکی احتمالی در حین حمل، خسارت بلافاصله جبران شود.',
    ],
  },
  {
    number: 'ماده ۵',
    title: 'ضمانت تعویض و بازگشت کالا (مهلت ۷ روزه)',
    content: [
      'خریدار حق دارد طبق رویه تعویض و مرجوعی، ظرف ۷ روز کاری پس از دریافت کالا نسبت به درخواست تعویض سایز یا عودت کالا اقدام نماید.',
      'نخستین تعویض سایز در تمامی سفارش‌ها به‌صورت کاملاً رایگان توسط کراس پوشش داده می‌شود.',
      'با توجه به ماهیت پوشاک ورزشی و الزامات بهداشتی، کالا نباید مورد استفاده ورزشی قرار گرفته باشد، اتیکت‌ها نباید جدا شوند و محصول باید فاقد هرگونه بوی عطر یا آثار لکه باشد.',
      'در صورت عودت، وجه پرداختی حداکثر ظرف ۴۸ ساعت کاری پس از تایید واحد فنی کنترل کیفیت به شماره شبای بانکی خریدار واریز می‌گردد.',
    ],
  },
  {
    number: 'ماده ۶',
    title: 'مالکیت فکری و حقوق مادی و معنوی',
    content: [
      'کلیه محتواهای تولیدشده در وب‌سایت کراس شامل متون، نشان‌های تجاری، لوگوتایپ، تصاویر عکاسی اختصاصی، ویدیوها، الگوهای طراحی منسوجات و رابط کاربری متعلق به برند کراس است.',
      'هرگونه کپی‌برداری تجاری یا بازنشر بدون اجازه کتبی، پیگرد قانونی طبق قوانین حمایت از حقوق پدیدآورندگان و علائم تجاری را در پی خواهد داشت.',
    ],
  },
  {
    number: 'ماده ۷',
    title: 'قوه قهریه و حل و فصل اختلافات',
    content: [
      'در صورت بروز رویدادهای خارج از اراده (فورس ماژور) نظیر قطعی سراسری ارتباطات یا بحران‌های غیرمترقبه، تعهدات کراس تا رفع شرایط موقتاً به حالت تعلیق درمی‌آید.',
      'هرگونه ابهام یا اختلاف ابتدا از طریق گفت‌وگوی دوستانه در واحد کانسیرژ کراس رسیدگی می‌شود. در صورت عدم حصول توافق، مراجع قضایی صالح شهر تهران مرجع رسیدگی نهایی خواهند بود.',
    ],
  },
]
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- هیرو سکشن -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-24">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Scale class="w-3.5 h-3.5" />
          <span>چارچوب حقوقی و تعهدات متقابل</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          قوانین، ضوابط و شرایط خرید از کراس
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          شفافیت در حقوق خریدار و فروشنده، پایه و اساس رابطه‌ای پایدار است. مطالعه این موارد تجربه خریدی مطمئن، سریع و رضایت‌بخش را برای شما تضمین می‌کند.
        </p>

        <div class="inline-flex items-center gap-2 text-2xs text-muted-foreground bg-white/70 px-4 py-1.5 rounded-full border border-sand/50">
          <Clock class="w-3 h-3 text-rose" />
          <span>آخرین به‌روزرسانی: مهر ۱۴۰۳</span>
        </div>
      </div>
    </section>

    <!-- محتوای مواد قانونی -->
    <section class="py-16 sm:py-20 container mx-auto px-4 max-w-4xl space-y-8">
      <div
        v-for="section in sections"
        :key="section.number"
        class="rounded-3xl border border-sand bg-white p-7 sm:p-9 space-y-5 shadow-2xs hover:border-sand/80 transition-colors"
      >
        <div class="flex items-center gap-3 border-b border-sand/40 pb-4">
          <span class="px-2.5 py-1 rounded-lg bg-sand/40 text-rose font-bold text-xs font-mono">
            {{ section.number }}
          </span>
          <h2 class="text-base sm:text-lg font-bold text-ink">
            {{ section.title }}
          </h2>
        </div>

        <ul class="space-y-3.5 text-xs sm:text-sm text-ink/85">
          <li
            v-for="(item, idx) in section.content"
            :key="idx"
            class="flex items-start gap-3"
          >
            <CheckCircle2 class="w-4 h-4 text-sage shrink-0 mt-0.5" />
            <span class="leading-relaxed">{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- تماس و راهنمایی حقوقی -->
    <section class="py-12 sm:py-16 border-t border-sand/60 bg-sand/15">
      <div class="container mx-auto px-4 max-w-3xl text-center space-y-6">
        <h3 class="text-xl sm:text-2xl font-bold text-ink">
          پرسشی پیرامون قوانین یا سفارش خود دارید؟
        </h3>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          تیم کانسیرژ کراس برای شفاف‌سازی هرگونه بند قانونی یا پیگیری وضعیت سفارش همواره در دسترس شماست.
        </p>
        <div class="flex justify-center">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ink text-sand hover:bg-ink/90 font-medium text-sm transition-colors shadow-sm"
          >
            <span>تماس با کانسیرژ و پشتیبانی</span>
            <ArrowLeft class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
