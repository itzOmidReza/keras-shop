<!-- frontend/app/pages/privacy.vue -->
<script setup lang="ts">
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Clock,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from '@lucide/vue'

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/privacy',
    },
  ],
})

useSeoMeta({
  title: 'سیاست حفظ حریم خصوصی | کراس',
  description: 'تعهدات کراس در زمینه حفاظت از داده‌های شخصی، ورود امن پیامکی OTP، امنیت پرداخت و حقوق کاربران',
  ogTitle: 'سیاست حفظ حریم خصوصی | کراس',
  ogDescription: 'تعهدات کراس در زمینه حفاظت از داده‌های شخصی، ورود امن پیامکی OTP، امنیت پرداخت و حقوق کاربران',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
  twitterCard: 'summary_large_image',
})

const privacyPillars = [
  {
    icon: Lock,
    title: 'رمزنگاری کامل ارتباطات',
    desc: 'تمامی تبادلات داده بین مرورگر شما و سرورهای کراس با استفاده از پروتکل‌های امنیتی روز (TLS/HTTPS) رمزنگاری می‌شوند.',
  },
  {
    icon: EyeOff,
    title: 'عدم افشا به اشخاص ثالث',
    desc: 'اطلاعات هویتی و شماره تماس شما تحت هیچ شرایطی فروخته نشده و در اختیار آژانس‌های تبلیغاتی قرار نخواهد گرفت.',
  },
  {
    icon: UserCheck,
    title: 'کنترل کامل کاربر بر داده‌ها',
    desc: 'شما در هر لحظه می‌توانید اطلاعات تماس، آدرس‌ها و تاریخچه سفارش‌های خود را در پنل کاربری ویرایش یا حذف نمایید.',
  },
]

const articles = [
  {
    number: 'بخش اول',
    title: 'چه اطلاعاتی را جمع‌آوری می‌کنیم و چرا؟',
    items: [
      'شماره تلفن همراه: جهت احراز هویت بدون رمز عبور (SMS OTP)، ارسال اعلان‌های رهگیری بسته و صدور شناسه خرید.',
      'نام، نام خانوادگی و کد ملی (اختیاری): جهت صدور فاکتور رسمی و ثبت مالکیت سفارش در سامانه‌های قانونی.',
      'نشانی پستی، کد پستی ده‌رقمی و پلاک: صرفاً به منظور تحویل فیزیکی مرسوله توسط ناوگان اختصاصی یا شرکت ملی پست.',
      'اطلاعات فنی نشست: آدرس IP و نوع دستگاه برای جلوگیری از رفتارهای مخرب سایبری و ارتقای سرعت بارگذاری وب‌سایت.',
    ],
  },
  {
    number: 'بخش دوم',
    title: 'امنیت تراکنش‌های مالی و کارت‌های بانکی',
    items: [
      'پرداخت وجه سفارش‌ها تماماً در بستر امن شبکه شاپرک (بانک مرکزی جمهوری اسلامی ایران) صورت می‌پذیرد.',
      'وب‌سایت کراس هیچ‌گونه دسترسی به اطلاعات کارت بانکی، شماره کارت، CVV2، تاریخ انقضا یا رمز دوم کاربران ندارد و این اطلاعات هرگز ذخیره نمی‌شوند.',
      'تمامی تاییدهای بانکی از طریق پروتکل‌های معتبر وب‌سرویس مستقیم تایید تراکنش (IPG Webhooks) استعلام می‌گردند.',
    ],
  },
  {
    number: 'بخش سوم',
    title: 'سیاست استفاده از کوکی‌ها و حافظه محلی',
    items: [
      'کراس صرفاً از کوکی‌ها و حافظه مرورگر برای حفظ وضعیت ورود شما (Session) و نگهداری سبد خرید و فهرست علاقه‌مندی‌ها استفاده می‌کند.',
      'ما از هیچ‌گونه ردیاب شخص ثالث جاسوسی یا تبلیغات ریتارگتینگ مزاحم در فضای اینترنت استفاده نمی‌کنیم.',
      'شما می‌توانید در تنظیمات مرورگر خود ذخیره کوکی‌ها را محدود کنید، هرچند ممکن است ادامه کار با سبد خرید مختل گردد.',
    ],
  },
  {
    number: 'بخش چهارم',
    title: 'حقوق و دسترسی شما به داده‌های شخصی',
    items: [
      'مشاهده و ویرایش: در هر زمان می‌توانید با ورود به حساب کاربری، نشانی‌ها و مشخصات خود را اصلاح کنید.',
      'عدم دریافت پیامک‌های اطلاع‌رسانی: می‌توانید با یک پیام ساده به کانسیرژ، ارسال پیامک‌های معرفی محصولات جدید را لغو کنید (پیامک‌های وضعیت سفارش کماکان ارسال خواهند شد).',
      'درخواست پاکسازی داده‌ها: برای حذف کامل حساب و پیشینه داده‌ای خود، کافی است درخواستی به ایمیل حریم خصوصی ارسال فرمایید.',
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
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>امنیت داده‌ها و حریم شخصی</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          سیاست حفظ و صیانت از حریم خصوصی
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          اعتماد شما باارزش‌ترین سرمایه برند کراس است. ما اطلاعات شخصی شما را مانند حریم خصوصی خودمان محترم دانسته و با بالاترین استانداردهای امنیتی از آن محافظت می‌کنیم.
        </p>

        <div class="inline-flex items-center gap-2 text-2xs text-muted-foreground bg-white/70 px-4 py-1.5 rounded-full border border-sand/50">
          <Clock class="w-3 h-3 text-rose" />
          <span>آخرین به‌روزرسانی: مهر ۱۴۰۳</span>
        </div>
      </div>
    </section>

    <!-- ۳ اصل بنیادین امنیت -->
    <section class="py-12 sm:py-16 container mx-auto px-4 max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="item in privacyPillars"
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

    <!-- بندهای تفصیلی حریم خصوصی -->
    <section class="py-12 sm:py-16 container mx-auto px-4 max-w-4xl space-y-8">
      <div
        v-for="article in articles"
        :key="article.number"
        class="rounded-3xl border border-sand bg-white p-7 sm:p-9 space-y-5 shadow-2xs hover:border-sand/80 transition-colors"
      >
        <div class="flex items-center gap-3 border-b border-sand/40 pb-4">
          <span class="px-2.5 py-1 rounded-lg bg-sand/40 text-rose font-bold text-xs font-mono">
            {{ article.number }}
          </span>
          <h2 class="text-base sm:text-lg font-bold text-ink">
            {{ article.title }}
          </h2>
        </div>

        <ul class="space-y-3.5 text-xs sm:text-sm text-ink/85">
          <li
            v-for="(item, idx) in article.items"
            :key="idx"
            class="flex items-start gap-3"
          >
            <CheckCircle2 class="w-4 h-4 text-sage shrink-0 mt-0.5" />
            <span class="leading-relaxed">{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- اطلاعات تماس با واحد حریم خصوصی -->
    <section class="py-12 sm:py-16 border-t border-sand/60 bg-sand/15">
      <div class="container mx-auto px-4 max-w-3xl text-center space-y-6">
        <div class="w-12 h-12 rounded-2xl bg-white border border-sand flex items-center justify-center mx-auto text-rose shadow-2xs">
          <Mail class="w-6 h-6" />
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-ink">
          ارتباط با مسئول حفاظت از داده‌ها
        </h3>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          در صورت تمایل به دریافت گزارش داده‌ها، تصحیح یا درخواست حذف اطلاعات، می‌توانید مستقیماً با ما مکاتبه فرمایید.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/contact"
            class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ink text-sand hover:bg-ink/90 font-medium text-sm transition-colors shadow-sm"
          >
            <span>ارسال پیام به کانسیرژ</span>
            <ArrowLeft class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
