<!-- frontend/app/pages/careers.vue -->
<script setup lang="ts">
import {
  Briefcase,
  Sparkles,
  Heart,
  Target,
  Compass,
  Award,
  Coffee,
  Laptop,
  CheckCircle2,
  ChevronDown,
  X,
  Upload,
  Send,
  Building,
  MapPin,
  Clock,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { toEn, isIranMobile } from '~/utils/format'

useSeoMeta({
  title: 'فرصت‌های شغلی و فرهنگ سازمانی | کراس',
  description: 'همکاری با تیم طراحی، مهندسی و نوآوری پوشاک ورزشی لوکس کراس؛ محیطی پویا، مینیمال و رشد‌محور',
})

interface JobPosition {
  id: string
  title: string
  enTitle: string
  department: string
  location: string
  type: string
  experience: string
  overview: string
  responsibilities: string[]
  requirements: string[]
}

const activeJob = ref<JobPosition | null>(null)
const expandedJobId = ref<string | null>('nuxt-engineer')
const isApplying = ref(false)

// فیلدهای فرم ارسال رزومه
const applicantName = ref('')
const applicantPhone = ref('')
const applicantEmail = ref('')
const applicantPortfolio = ref('')
const applicantCoverNote = ref('')
const resumeFileName = ref<string | null>(null)
const formError = ref<string | null>(null)
const isSubmitting = ref(false)

const positions: JobPosition[] = [
  {
    id: 'nuxt-engineer',
    title: 'مهندس ارشد فرانت‌اند Nuxt و Vue',
    enTitle: 'Senior Nuxt / Vue Frontend Engineer',
    department: 'فناوری و محصول دیجیتال',
    location: 'تهران (هیبریدی / امکان دورکاری)',
    type: 'تمام‌وقت',
    experience: '+۴ سال سابقه کار تخصصی',
    overview: 'توسعه و بهینه‌سازی استورفرانت مدرن کراس با تمرکز بر Nuxt 4، معماری تمیز کامپوننت‌ها، تایپ‌اسکریپت، عملکرد برق‌آسای Core Web Vitals و استانداردهای طراحی ادیتوریال.',
    responsibilities: [
      'پیاده‌سازی فیچرهای پیشرفته پلتفرم فروشگاهی با Nuxt 4، Tailwind CSS v4 و Pinia',
      'بهینه‌سازی کارایی رندرینگ SSR، کشینگ SWR و هیدریشن کلاینت بدون فلیکر',
      'حفظ و توسعه دیزاین سیستم ادیتوریال کراس با تمرکز بر تعاملات راست‌چین (RTL)',
      'همکاری نزدیک با تیم محصول و طراحی جهت خلق روان‌ترین تجربه خرید آنلاین در ایران',
    ],
    requirements: [
      'تسلط عمیق بر اکوسیستم Vue 3 (Composition API)، Nuxt 3/4 و Vite',
      'تخصص کامل در TypeScript، تایپ‌های دامنه و استیت منیجمنت پینیا',
      'آشنایی عملی با اصول UI/UX لوکس، میکرواینترکشن‌ها و استانداردهای دسترسی‌پذیری',
      'روحیه حل مسئله، کنجکاوی فنی و تعهد به کدنویسی تمیز و تست‌پذیر',
    ],
  },
  {
    id: 'textile-designer',
    title: 'طراح ارشد متریال و منسوجات ورزشی',
    enTitle: 'Senior Athletic Textile Designer',
    department: 'طراحی محصول و نوآوری الیاف',
    location: 'استودیو مرکزی تهران (نیاوران)',
    type: 'تمام‌وقت',
    experience: '+۵ سال سابقه در صنعت مد ورزشی',
    overview: 'هدایت فرآیند انتخاب، مهندسی و تست بافت پارچه‌های فنی لاین‌های حرکت و آرامش؛ تحقیق بر روی الاستین‌های مدرن و الیاف سازگار با محیط زیست.',
    responsibilities: [
      'توسعه الگوها و بافت‌های اختصاصی کشسانی ۴ جهته مقاوم در برابر سایش و پرزدهی',
      'نظارت بر پروتکل‌های آزمایشگاهی اسکات‌پروف (Squat-Proof) و ثبات رنگ در شست‌وشو',
      'انتخاب پالت‌های رنگی الهام‌گرفته از اقلیم ایران و تطابق آن با الیاف میکرو-مدال',
      'ارتباط مستمر با کارخانجات نساجی پیشرفته جهت ارتقای استانداردهای تولید',
    ],
    requirements: [
      'مدرک دانشگاهی در رشته طراحی پارچه و لباس، مهندسی نساجی یا رشته‌های مرتبط',
      'شناخت جامع از رفتار الیاف پلی‌آمید، اسپندکس، تنسیل و بافت‌های بدون درز (Seamless)',
      'تسلط بر نرم‌افزارهای طراحی تخصصی نساجی و بسته‌های ادوبی',
      'علاقه جدی به فیتنس، یوگا و درک نیازهای حرکتی بدن ورزشکاران',
    ],
  },
  {
    id: 'concierge-lead',
    title: 'مدیر کانسیرژ و تجربه مشتریان لوکس',
    enTitle: 'Luxury Customer Concierge Lead',
    department: 'عملیات و ارتباط با مشتریان',
    location: 'تهران (حضوری)',
    type: 'تمام‌وقت',
    experience: '+۳ سال تجربه در برندهای پریمیوم',
    overview: 'ارائه تجربه پشتیبانی شخصی‌سازی‌شده و در کلاس جهانی به خریداران کراس؛ از مشاوره تخصصی سایز و استایل تا مدیریت تحویل اختصاصی.',
    responsibilities: [
      'پاسخ‌گویی همدلانه و حرفه‌ای به درخواست‌های خریداران از کانال‌های تلفنی، ایمیل و واتس‌اپ',
      'راهنمایی آناتومیک مراجعین در انتخاب سایز و تبادل سریع سفارش‌ها در بازه ۷ روزه',
      'جمع‌آوری و انتقال بازخوردهای کیفی مشتریان به تیم‌های طراحی و تولید',
      'آموزش و سرپرستی کارشناسان پشتیبانی و تقویت لحن برند در تعاملات',
    ],
    requirements: [
      'فن بیان استثنایی، مهارت‌های ارتباطی قوی و تسلط بر ادبیات رسمی و محترمانه فارسی',
      'سابقه درخشان در حوزه خدمات مشتریان در برندهای مد، مهمان‌نوازی لوکس یا ایکامرس',
      'آشنایی با سیستم‌های مدرن تیکتینگ و CRM',
      'صبر، مسئولیت‌پذیری بالا و اشتیاق به جلب رضایت کامل مشتری',
    ],
  },
  {
    id: 'visual-director',
    title: 'مدیر خلاقیت و هویت بصری برند',
    enTitle: 'Brand Visual & Art Director',
    department: 'برندینگ و رسانه',
    location: 'استودیو مرکزی تهران',
    type: 'تمام‌وقت',
    experience: '+۴ سال در مدیریت هنری و کمپین‌ها',
    overview: 'خلق داستان‌سرایی بصری، هدایت فتوشوت‌های فصلی و لوک‌بوک‌ها، و صیانت از زیبایی‌شناسی مینیمال و اصیل کراس در تمامی نقاط تماس با مخاطب.',
    responsibilities: [
      'تدوین کانسپت و هدایت هنری پروژه‌های عکاسی لوک‌بوک و ویدیوهای کمپین',
      'نظارت بر تولید محتوای شبکه‌های اجتماعی، وب‌سایت و بسته‌بندی محصولات',
      'همکاری با عکاسان، مدل‌ها و استایلیست‌های طراز اول حوزه مد ورزشی',
      'حفظ هویت بصری مینیمال و هارمونی پالت رنگی اختصاصی برند',
    ],
    requirements: [
      'پورتفولیوی قدرتمند در زمینه آرت‌دایرکشن مد و فشن ادیتوریال',
      'دید عکاسی ممتاز، درک نورپردازی، رنگ‌بندی و تایپوگرافی معاصر',
      'تسلط کامل بر نرم‌افزارهای ادوبی (Photoshop, Illustrator, Premiere/InDesign)',
      'توانایی رهبری تیم‌های خلاق و اجرای خروجی‌های دقیق در زمان‌بندی مشخص',
    ],
  },
]

// مزایا و ارزش‌های همکاری با کراس
const perks = [
  {
    icon: Award,
    title: 'سهمیه فصلی پوشاک ورزشی',
    desc: 'دریافت پک اختصاصی از جدیدترین محصولات لاین‌های حرکت و آرامش در هر فصل.',
  },
  {
    icon: Heart,
    title: 'عضویت در باشگاه و استودیوهای برتر',
    desc: 'تامین هزینه اشتراک ماهانه در برترین باشگاه‌های فیتنس، استودیوهای یوگا و پیلاتس.',
  },
  {
    icon: Laptop,
    title: 'مدل کاری منعطف و هیبرید',
    desc: 'امکان کار ترکیبی حضوری و دورکاری برای موقعیت‌های فنی همراه با تجهیزات ارگونومیک.',
  },
  {
    icon: Target,
    title: 'بودجه یادگیری و توسعه فردی',
    desc: 'کمک‌هزینه سالانه جهت خرید کتب تخصصی، شرکت در ورکشاپ‌ها و دوره‌های بین‌المللی.',
  },
  {
    icon: Compass,
    title: 'بیمه درمان تکمیلی جامع',
    desc: 'پوشش کامل خدمات درمانی، دندان‌پزشکی و مشاوره‌های سلامت روان برای همکاران.',
  },
  {
    icon: Coffee,
    title: 'تغذیه سالم و اتمسفر مینیمال',
    desc: 'صبحانه و میان‌وعده‌های ارگانیک روزانه در استودیوی دلباز و آرام نیاوران تهران.',
  },
]

// فرهنگ و ارکان تیمی کراس
const culturePillars = [
  {
    title: 'وسواس در جزئیات مهندسی',
    desc: 'هیچ کوک یا میلی‌متری اتفاقی نیست. ما برای دستیابی به بالاترین استاندارد، بارها نمونه‌سازی و آزمایش می‌کنیم.',
  },
  {
    title: 'ورزشکاری آگاهانه (Mindful Athleticism)',
    desc: 'ورزش را نه تنها در محصول، بلکه در ریتم کاریمان جاری می‌سازیم. تعادل میان تحرک پرانرژی و آرامش ذهنی.',
  },
  {
    title: 'شفافیت رادیکال و اخلاق',
    desc: 'تعهد تزلزل‌ناپذیر به زنجیره تولید پاک، احترام به کرامت انسانی و الیاف پایدار دوستدار محیط زیست.',
  },
]

// باز و بسته کردن جزئیات موقعیت شغلی
const toggleJob = (id: string) => {
  expandedJobId.value = expandedJobId.value === id ? null : id
}

// باز کردن مدال درخواست همکاری
const openApplyModal = (job: JobPosition) => {
  activeJob.value = job
  isApplying.value = true
  formError.value = null
}

// شبیه‌سازی انتخاب فایل رزومه
const handleFileSimulate = () => {
  resumeFileName.value = 'Resume_CV_2026.pdf'
}

// ارسال فرم استخدام
const handleSubmitApplication = async () => {
  if (!applicantName.value.trim()) {
    formError.value = 'لطفاً نام و نام خانوادگی خود را وارد فرمایید.'
    return
  }
  const phone = toEn(applicantPhone.value.trim())
  if (!isIranMobile(phone)) {
    formError.value = 'لطفاً شماره موبایل معتبر ایران (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.'
    return
  }
  if (!applicantEmail.value.includes('@')) {
    formError.value = 'لطفاً آدرس ایمیل معتبر وارد فرمایید.'
    return
  }

  isSubmitting.value = true
  formError.value = null

  // شبیه‌سازی تاخیر ارسال
  await new Promise((resolve) => setTimeout(resolve, 600))

  isSubmitting.value = false
  isApplying.value = false
  toast.success('درخواست همکاری شما با موفقیت ثبت شد. تیم منابع انسانی کراس با شما تماس خواهد گرفت.')

  // پاکسازی فرم
  applicantName.value = ''
  applicantPhone.value = ''
  applicantEmail.value = ''
  applicantPortfolio.value = ''
  applicantCoverNote.value = ''
  resumeFileName.value = null
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر فرصت‌های شغلی -->
    <section class="border-b border-sand/70 bg-sand/20 py-16 lg:py-24 px-4 text-center">
      <div class="container mx-auto max-w-4xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <Briefcase class="w-3.5 h-3.5 text-rose" />
          <span>پیوستن به تیم نوآوری کراس • تهران ۱۴۰۵</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight">
          خلق استانداردی نو در مهندسی پوشاک ورزشی
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ما در کراس باور داریم که لباس ورزشی باید هم‌زمان شاهکار علم نساجی و اثر هنری مینیمال باشد. اگر مشتاق خلق کیفیتی فراتر از معمول هستید، جای شما در کنار ما خالی است.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-bold text-muted-foreground">
          <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
            <Building class="w-3.5 h-3.5 text-rose" />
            استودیو مرکزی تهران (نیاوران)
          </span>
          <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
            <Laptop class="w-3.5 h-3.5 text-sage" />
            مدل کاری هیبریدی و انعطاف‌پذیر
          </span>
          <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
            <Sparkles class="w-3.5 h-3.5 text-clay" />
            تیم چابک، پیشرو و خودمختار
          </span>
        </div>
      </div>
    </section>

    <!-- ارکان فرهنگ سازمانی (Culture Pillars) -->
    <section class="container mx-auto max-w-6xl px-4 py-16">
      <div class="text-center max-w-xl mx-auto space-y-2 mb-12">
        <span class="text-xs font-bold text-rose uppercase tracking-widest">
          باورها و فرهنگ ما
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          چگونه در کراس می‌اندیشیم و می‌سازیم
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(pillar, idx) in culturePillars"
          :key="idx"
          class="rounded-3xl border border-sand bg-white p-8 space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
        >
          <div class="w-10 h-10 rounded-xl bg-sand/40 text-rose flex items-center justify-center font-mono font-bold text-sm">
            {{ `۰${idx + 1}` }}
          </div>
          <h3 class="text-base font-bold text-ink">
            {{ pillar.title }}
          </h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            {{ pillar.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- مزایا و امکانات همکاری (Perks & Benefits) -->
    <section class="border-y border-sand/70 bg-sand/15 py-16 px-4">
      <div class="container mx-auto max-w-6xl space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs font-bold text-sage uppercase tracking-widest">
            پشتیبانی از تندرستی و انگیزه شما
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink">
            مزایا و تسهیلات همراهی با کراس
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(perk, idx) in perks"
            :key="idx"
            class="rounded-2xl border border-sand/80 bg-white p-6 space-y-3 shadow-2xs"
          >
            <div class="w-11 h-11 rounded-xl bg-sand/40 text-rose flex items-center justify-center">
              <component :is="perk.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-ink">
              {{ perk.title }}
            </h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ perk.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- لیست موقعیت‌های شغلی فعال (Open Positions) -->
    <main class="container mx-auto max-w-5xl px-4 py-16 space-y-8">
      <div class="text-center max-w-xl mx-auto space-y-2">
        <span class="text-xs font-bold text-rose uppercase tracking-widest">
          فرصت‌های استخدام
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          موقعیت‌های شغلی فعال
        </h2>
        <p class="text-xs text-muted-foreground">
          نقش مورد علاقه خود را انتخاب کرده و رزومه کاری خود را برای بررسی مستقیم تیم رهبری ارسال فرمایید.
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="job in positions"
          :key="job.id"
          class="rounded-3xl border border-sand bg-white overflow-hidden shadow-2xs transition-all"
        >
          <!-- هدر موقعیت شغلی -->
          <div
            class="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-sand/10 transition-colors"
            @click="toggleJob(job.id)"
          >
            <div class="space-y-2">
              <div class="flex items-center gap-2 flex-wrap text-[11px]">
                <span class="font-bold px-2.5 py-0.5 rounded-full bg-sand/50 text-ink">
                  {{ job.department }}
                </span>
                <span class="text-muted-foreground flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-rose" />
                  {{ job.location }}
                </span>
                <span class="text-muted-foreground flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5 text-sage" />
                  {{ job.type }}
                </span>
              </div>

              <h3 class="text-lg sm:text-xl font-bold text-ink">
                {{ job.title }}
              </h3>
              <p class="text-xs text-muted-foreground font-mono dir-ltr text-end sm:text-start">
                {{ job.enTitle }}
              </p>
            </div>

            <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl bg-ink hover:bg-rose text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                @click.stop="openApplyModal(job)"
              >
                ارسال رزومه
              </button>

              <button
                type="button"
                class="w-9 h-9 rounded-xl border border-sand flex items-center justify-center text-muted-foreground hover:text-ink transition-transform cursor-pointer"
                :class="{ 'rotate-180': expandedJobId === job.id }"
                aria-label="نمایش جزئیات"
              >
                <ChevronDown class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- بدنه قابل گسترش توضیحات شغل -->
          <div
            v-if="expandedJobId === job.id"
            class="p-6 sm:p-8 pt-0 border-t border-sand/40 space-y-6 text-xs bg-sand/5"
          >
            <p class="text-muted-foreground leading-relaxed pt-4 text-xs sm:text-sm">
              {{ job.overview }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- مسئولیت‌ها -->
              <div class="space-y-3">
                <h4 class="font-bold text-ink flex items-center gap-1.5 text-xs">
                  <Target class="w-4 h-4 text-rose" />
                  مسئولیت‌های کلیدی این نقش:
                </h4>
                <ul class="space-y-2 text-muted-foreground">
                  <li v-for="(resp, rIdx) in job.responsibilities" :key="rIdx" class="flex items-start gap-2">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose shrink-0 mt-1.5" />
                    <span class="leading-relaxed">{{ resp }}</span>
                  </li>
                </ul>
              </div>

              <!-- مهارت‌ها -->
              <div class="space-y-3">
                <h4 class="font-bold text-ink flex items-center gap-1.5 text-xs">
                  <CheckCircle2 class="w-4 h-4 text-sage" />
                  شرایط و تخصص‌های مورد انتظار:
                </h4>
                <ul class="space-y-2 text-muted-foreground">
                  <li v-for="(req, qIdx) in job.requirements" :key="qIdx" class="flex items-start gap-2">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 mt-1.5" />
                    <span class="leading-relaxed">{{ req }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                type="button"
                class="px-6 py-2.5 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                @click="openApplyModal(job)"
              >
                درخواست برای موقعیت {{ job.title }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- مدال فرم ارسال رزومه (Application Drawer / Modal) -->
    <Teleport to="body">
      <div
        v-if="isApplying && activeJob"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="isApplying = false"
      >
        <div
          class="relative w-full max-w-xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
          dir="rtl"
        >
          <!-- هدر مدال -->
          <div class="flex items-center justify-between border-b border-sand/60 pb-4">
            <div>
              <span class="text-[11px] font-bold text-rose">
                ثبت درخواست همکاری
              </span>
              <h3 class="text-lg font-bold text-ink">
                {{ activeJob.title }}
              </h3>
            </div>

            <button
              type="button"
              class="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 flex items-center justify-center text-ink transition-colors cursor-pointer"
              aria-label="بستن"
              @click="isApplying = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- هشدار خطا -->
          <div
            v-if="formError"
            class="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium"
          >
            {{ formError }}
          </div>

          <!-- فرم -->
          <form class="space-y-4" @submit.prevent="handleSubmitApplication">
            <div class="space-y-1">
              <label for="careers-fullname" class="text-xs font-bold text-ink">
                نام و نام خانوادگی:
              </label>
              <input
                id="careers-fullname"
                v-model="applicantName"
                type="text"
                placeholder="مثال: سارا کیانی"
                class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose"
                required
              >
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="careers-phone" class="text-xs font-bold text-ink">
                  شماره موبایل:
                </label>
                <input
                  id="careers-phone"
                  v-model="applicantPhone"
                  type="text"
                  dir="ltr"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
                  required
                >
              </div>

              <div class="space-y-1">
                <label for="careers-email" class="text-xs font-bold text-ink">
                  آدرس ایمیل:
                </label>
                <input
                  id="careers-email"
                  v-model="applicantEmail"
                  type="email"
                  dir="ltr"
                  placeholder="name@example.com"
                  class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
                  required
                >
              </div>
            </div>

            <div class="space-y-1">
              <label for="careers-portfolio" class="text-xs font-bold text-ink">
                لینک رزومه آنلاین، گیت‌هاب یا لینکدین:
              </label>
              <input
                id="careers-portfolio"
                v-model="applicantPortfolio"
                type="text"
                dir="ltr"
                placeholder="https://linkedin.com/in/... یا github.com/..."
                class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
              >
            </div>

            <!-- پیوست رزومه -->
            <div class="space-y-1">
              <label class="text-xs font-bold text-ink block">
                فایل رزومه (PDF):
              </label>
              <div
                class="rounded-2xl border-2 border-dashed border-sand bg-sand/15 p-4 text-center cursor-pointer hover:bg-sand/25 transition-colors"
                @click="handleFileSimulate"
              >
                <Upload class="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <span class="text-xs font-bold text-ink block">
                  {{ resumeFileName || 'کلیک برای انتخاب فایل رزومه (PDF)' }}
                </span>
                <span class="text-[10px] text-muted-foreground">
                  حداکثر حجم ۱۰ مگابایت
                </span>
              </div>
            </div>

            <div class="space-y-1">
              <label for="careers-covernote" class="text-xs font-bold text-ink">
                یادداشت کوتاه یا معرفی تجربیات:
              </label>
              <textarea
                id="careers-covernote"
                v-model="applicantCoverNote"
                rows="3"
                placeholder="توضیح مختصری از سوابق و دلایل علاقه‌مندی به همکاری با کراس..."
                class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose resize-none"
              />
            </div>

            <div class="pt-2 flex justify-end gap-3">
              <button
                type="button"
                class="py-2.5 px-4 rounded-xl border border-sand bg-white text-muted-foreground hover:text-ink text-xs font-bold cursor-pointer transition-colors"
                @click="isApplying = false"
              >
                انصراف
              </button>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="py-2.5 px-6 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send class="w-4 h-4" />
                <span>{{ isSubmitting ? 'در حال ارسال رزومه...' : 'ثبت نهایی درخواست' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
