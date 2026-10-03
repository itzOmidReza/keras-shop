<!-- frontend/app/pages/blog.vue -->
<script setup lang="ts">
import {
  BookOpen,
  Clock,
  User,
  ArrowLeft,
  Search,
  Sparkles,
  CheckCircle2,
  X,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'مجله علمی و تخصصی ورزشی | کراس',
  description: 'مقالات مرجع در حوزه فیزیولوژی تمرین، علم الیاف و منسوجات، ذهن‌آگاهی و ریکاوری ورزشکاران کراس',
})

interface Article {
  id: number
  title: string
  slug: string
  category: 'training' | 'recovery' | 'science'
  categoryLabel: string
  readTime: string
  date: string
  author: {
    name: string
    role: string
  }
  image: string
  excerpt: string
  featured?: boolean
  content: string[]
  keyTakeaways: string[]
}

const activeCategory = ref<'all' | 'training' | 'recovery' | 'science'>('all')
const searchQuery = ref('')
const selectedArticle = ref<Article | null>(null)
const newsletterEmail = ref('')

const articles: Article[] = [
  {
    id: 1,
    title: 'علم فشرده‌سازی عضلانی و بازیابی سریع: چرا پارچه‌های ۳۰۰ گرمی سرنوشت‌سازند؟',
    slug: 'science-of-muscle-compression-300gsm',
    category: 'science',
    categoryLabel: 'علم متریال و الیاف',
    readTime: '۶ دقیقه',
    date: '۱۲ مهر ۱۴۰۵',
    author: {
      name: 'دکتر مریم رادمنش',
      role: 'متخصص فیزیولوژی ورزش و بیومکانیک',
    },
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'بررسی بیومکانیک بافت‌های متراکم الاستین بر بهبود بازگشت خون سیاهرگی، تثبیت نوسانات عضلانی حین فرود و کاهش تجمع اسید لاکتیک در تمرینات اسکات سنگین.',
    featured: true,
    content: [
      'هنگامی که عضلات چهارسر و همسترینگ تحت فشار بارهای سنگین قرار می‌گیرند، ریزلرزش‌های مکانیکی مداوم سبب افزایش خستگی عصبی-عضلانی می‌گردد. پارچه‌های با بافت ۳۰۰ گرمی در لاین Move کراس با اعمال فشار حساب‌شده ۲۲ میلی‌متر جیوه، این ارتعاشات غیرضروری را تا ۴۰٪ کاهش می‌دهند.',
      'علاوه بر این، تکنولوژی بافت متقاطع ۴ جهته اجازه می‌دهد تا بدون ایجاد تورنیکه یا مهار گردش مویرگی، بازگشت خون به قلب تسریع شده و دفع مواد زائد حاصل از متابولیسم بی‌هوازی سریع‌تر صورت گیرد.',
    ],
    keyTakeaways: [
      'کاهش لرزش عضلانی حین فرود و کاهش خستگی زودهنگام',
      'تثبیت زاویه مفاصل و بهبود حس عمقی (Proprioception)',
      'ضمانت ۱۰۰٪ پوشش مات در زوایای عمیق اسکات (Squat-Proof)',
    ],
  },
  {
    id: 2,
    title: 'تنفس دیافراگمی و ریکاوری سیستم عصبی پس از تمرینات پرشدت',
    slug: 'diaphragmatic-breathing-autonomic-recovery',
    category: 'recovery',
    categoryLabel: 'ریکاوری و ذهن',
    readTime: '۴ دقیقه',
    date: '۰۸ مهر ۱۴۰۵',
    author: {
      name: 'نیلوفر سمیعی',
      role: 'مدرس بین‌المللی یوگا و تمرینات تنفسی',
    },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'چگونه ۵ دقیقه تنفس شکمی کنترل‌شده پس از تمرین، بدن را از فاز استرس سمپاتیک به آرامش پاراسمپاتیک منتقل کرده و فرآیند ترمیم بافت را فعال می‌کند.',
    content: [
      'سیستم عصبی خودمختار پس از جلسات شدید قدرتی یا HIIT در وضعیت هشداری باقی می‌ماند. فعال‌سازی عصب واگ از طریق تنفس آرام ۴-۷-۸ یا تنفس جعبه‌ای، ضربان قلب را به حالت نرمال بازمی‌گرداند.',
      'پوشش‌های راحت لاین Calm با کمترین فشار بر دیافراگم، به قفسه سینه اجازه انبساط طبیعی و بدون مقاومت فیزیکی می‌دهد.',
    ],
    keyTakeaways: [
      'کاهش سطح کورتیزول سرم در ۲۰ دقیقه ابتدایی پس از تمرین',
      'بهبود تغییرپذیری ضربان قلب (HRV)',
      'بهینه‌سازی کیفیت خواب شبانه برای رشد عضلات',
    ],
  },
  {
    id: 3,
    title: 'پروتکل تمرینی اینتروال با شدت بالا (HIIT) برای افزایش توان هوازی',
    slug: 'hiit-training-protocols-aerobic-capacity',
    category: 'training',
    categoryLabel: 'تمرین و حرکت',
    readTime: '۵ دقیقه',
    date: '۰۲ مهر ۱۴۰۵',
    author: {
      name: 'سامان فکور',
      role: 'مربی ارشد بدنسازی و توان‌بخشی ورزشی',
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'راهنمای طراحی دوره‌های تمرینی تناوبی ۲۰ ثانیه کار / ۱۰ ثانیه استراحت (تاباتا) با حفظ ثبات تنه و جلوگیری از فرسودگی تاندونی.',
    content: [
      'تمرینات HIIT اگر با استراحت‌های فعال و لباس‌های مناسب دفع گرما همراه نباشند، به سرعت منجر به هایپرترمی موضعی می‌شوند.',
      'استفاده از پنل‌های مش تنفس‌پذیر در مناطق با تعریق بالا به ورزشکار اجازه می‌دهد دمای عمقی تنه را در محدوده عملکردی بهینه حفظ کند.',
    ],
    keyTakeaways: [
      'افزایش مصرف اکسیژن پس از تمرین (EPOC)',
      'بهینه‌سازی ترشح هورمون رشد طبیعی',
      'کاهش زمان تمرین با حفظ راندمان متابولیک',
    ],
  },
  {
    id: 4,
    title: 'نقش الیاف میکرو-مدال در تنظیم دمای بدن در هوای متغیر',
    slug: 'micro-modal-thermal-regulation-athleisure',
    category: 'science',
    categoryLabel: 'علم متریال و الیاف',
    readTime: '۴ دقیقه',
    date: '۲۸ شهریور ۱۴۰۵',
    author: {
      name: 'مهندس نوید کاوه',
      role: 'متخصص شیمی نساجی و پلیمرهای پیشرفته',
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'مقایسه رفتار الیاف حاصل از چوب راش اتریشی با پنبه معمولی در مدیریت رطوبت، لطافت ابریشمی و عدم حساسیت‌زایی پوست.',
    content: [
      'میکرو مدال تا ۵۰٪ بیشتر از پنبه رطوبت را به خود جذب کرده و با سرعت دو برابر آن را به هوای آزاد تبخیر می‌نماید.',
      'این خاصیت مانع از خیس ماندن لباس روی پوست و احساس سرمای ناخوشایند پس از اتمام فعالیت بدنی می‌گردد.',
    ],
    keyTakeaways: [
      'لطافت ماندگار بدون نیاز به نرم‌کننده‌های شیمیایی',
      'حفظ فرم پارچه حتی پس از ۱۰۰ بار شست‌وشو در دمای ۳۰ درجه',
      'دوستدار محیط‌زیست و تخریب‌پذیر در طبیعت',
    ],
  },
  {
    id: 5,
    title: 'اصول گرم کردن پویا و پیشگیری از آسیب‌های رباط صلیبی (ACL)',
    slug: 'dynamic-warmup-acl-injury-prevention',
    category: 'training',
    categoryLabel: 'تمرین و حرکت',
    readTime: '۵ دقیقه',
    date: '۲۲ شهریور ۱۴۰۵',
    author: {
      name: 'دکتر مریم رادمنش',
      role: 'متخصص فیزیولوژی ورزش و بیومکانیک',
    },
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'پروتکل ۱۰ دقیقه‌ای فعال‌سازی عضله سرینی میانی و همسترینگ برای حفظ هم‌راستایی زانو در پرش‌ها و تغییر جهت‌های ناگهانی.',
    content: [
      'بیش از ۷۰٪ آسیب‌های رباط زانو در ورزش‌های بدون برخورد رخ می‌دهد و ناشی از ضعف در زنجیره خلفی و نقص در جذب ضربه فرود است.',
      'اجرای حرکات فعال‌سازی با کش‌های مقاومتی قبل از جلسه اصلی، شانس آسیب را تا ۶۰٪ کاهش می‌دهد.',
    ],
    keyTakeaways: [
      'تمرکز بر کنترل والگوس زانو حین اسکات تک‌پا',
      'افزایش دمای درون‌مفصلی سینوویال',
      'آماده‌سازی پیش‌انقباضی عضلات محافظت‌کننده',
    ],
  },
  {
    id: 6,
    title: 'خواب عمیق و ریتم شبانه‌روزی: رکن نامرئی در هایپرتروفی عضلانی',
    slug: 'deep-sleep-circadian-rhythm-muscle-recovery',
    category: 'recovery',
    categoryLabel: 'ریکاوری و ذهن',
    readTime: '۴ دقیقه',
    date: '۱۶ شهریور ۱۴۰۵',
    author: {
      name: 'نیلوفر سمیعی',
      role: 'مدرس بین‌المللی یوگا و تمرینات تنفسی',
    },
    image: 'https://images.unsplash.com/photo-1552196563-5527e3abbd73?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'چرا بدون ۹۰ دقیقه مرحله خواب با امواج آهسته (NREM)، سنتز پروتئین عضلانی و ترشح هورمون رشد به نصف کاهش می‌یابد.',
    content: [
      'خواب تنها زمانی است که بافت‌های میکروسکوپی آسیب‌دیده عضلانی فرصت بازسازی و تقویت پیدا می‌کنند.',
      'استفاده از لباس‌های خواب و راحتی ارگونومیک بدون درزهای برجسته به کاهش بیداری‌های ریز شبانه کمک شایانی می‌کند.',
    ],
    keyTakeaways: [
      'خاموش کردن نورهای آبی ۲ ساعت قبل از خواب',
      'حفظ دمای اتاق خواب روی ۱۸ تا ۲۰ درجه سانتی‌گراد',
      'نقش پوشاک نرم در کاهش اصطکاک پوستی حین استراحت',
    ],
  },
]

const filteredArticles = computed(() => {
  let list = articles
  if (activeCategory.value !== 'all') {
    list = list.filter((a) => a.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q),
    )
  }
  return list
})

const featuredArticle = computed(() => {
  return articles.find((a) => a.featured) || articles[0]!
})

const handleSubscribe = () => {
  if (!newsletterEmail.value) return
  toast.success('عضویت شما در خبرنامه علمی کراس با موفقیت ثبت شد.')
  newsletterEmail.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر مجله -->
    <section class="border-b border-sand/70 bg-sand/20 py-16 px-4">
      <div class="container mx-auto max-w-5xl text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <BookOpen class="w-4 h-4 text-rose" />
          <span>مرجع علمی استایل ورزشی، تمرین و ریکاوری</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink">
          مجله و دانش‌نامه کراس
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          کاوشی عمیق در فیزیولوژی حرکت، مهندسی پیشرفته الیاف ورزشی و روان‌شناسی عملکرد. مقالات نوشته‌شده توسط متخصصین علوم ورزشی و طراحان نساجی کراس.
        </p>

        <!-- نوار جست‌وجو و فیلتر دسته‌بندی -->
        <div class="max-w-2xl mx-auto pt-6 space-y-4">
          <div class="relative">
            <Search class="w-4 h-4 absolute inset-s-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جست‌وجو در عنوان مقالات، مباحث یا نویسندگان..."
              class="w-full rounded-2xl border border-sand bg-white py-3 ps-11 pe-4 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose shadow-2xs"
            >
          </div>

          <div class="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
              :class="activeCategory === 'all' ? 'bg-ink text-white border-ink shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
              @click="activeCategory = 'all'"
            >
              همه مقالات
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
              :class="activeCategory === 'training' ? 'bg-rose text-white border-rose shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
              @click="activeCategory = 'training'"
            >
              تمرین و حرکت
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
              :class="activeCategory === 'recovery' ? 'bg-sage text-white border-sage shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
              @click="activeCategory = 'recovery'"
            >
              ریکاوری و ذهن
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
              :class="activeCategory === 'science' ? 'bg-clay text-white border-clay shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
              @click="activeCategory = 'science'"
            >
              علم متریال و الیاف
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- مقاله برجسته شاخص (Featured Hero Article) -->
    <section v-if="!searchQuery && activeCategory === 'all'" class="container mx-auto max-w-6xl px-4 py-12">
      <div
        class="rounded-3xl border border-sand/80 bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center cursor-pointer group"
        @click="selectedArticle = featuredArticle"
      >
        <div class="lg:col-span-7 aspect-16/10 lg:aspect-auto h-full overflow-hidden bg-sand/30">
          <NuxtImg
            :src="featuredArticle.image"
            :alt="featuredArticle.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div class="lg:col-span-5 p-6 sm:p-10 space-y-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose/10 text-rose">
              مقاله شاخص سردبیر
            </span>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sand/50 text-ink">
              {{ featuredArticle.categoryLabel }}
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-ink group-hover:text-rose transition-colors leading-snug">
            {{ featuredArticle.title }}
          </h2>

          <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {{ featuredArticle.excerpt }}
          </p>

          <div class="pt-4 border-t border-sand/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <div class="flex items-center gap-1.5">
              <User class="w-3.5 h-3.5 text-rose" />
              <span>{{ featuredArticle.author.name }}</span>
            </div>

            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <Clock class="w-3 h-3 text-sage" />
                {{ featuredArticle.readTime }}
              </span>
              <span>{{ featuredArticle.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- شبکه مقالات (Articles Grid) -->
    <main class="container mx-auto max-w-6xl px-4 py-8">
      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          class="rounded-3xl border border-sand/70 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          @click="selectedArticle = article"
        >
          <div>
            <div class="aspect-16/10 overflow-hidden bg-sand/30">
              <NuxtImg
                :src="article.image"
                :alt="article.title"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div class="p-6 space-y-3">
              <div class="flex items-center justify-between text-[10px]">
                <span class="font-bold px-2.5 py-0.5 rounded-full bg-sand/50 text-ink">
                  {{ article.categoryLabel }}
                </span>
                <span class="text-muted-foreground flex items-center gap-1">
                  <Clock class="w-3 h-3 text-sage" />
                  {{ article.readTime }}
                </span>
              </div>

              <h3 class="text-base font-bold text-ink group-hover:text-rose transition-colors leading-snug">
                {{ article.title }}
              </h3>

              <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {{ article.excerpt }}
              </p>
            </div>
          </div>

          <div class="p-6 pt-0 border-t border-sand/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <span class="font-medium text-ink">{{ article.author.name }}</span>
            <span class="text-rose font-bold flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform">
              مطالعه مقاله
              <ArrowLeft class="w-3 h-3" />
            </span>
          </div>
        </article>
      </div>

      <!-- وضعیت عدم یافت مقاله -->
      <div v-else class="text-center py-16 space-y-3">
        <p class="text-base font-bold text-ink">
          مقاله‌ای مطابق با جست‌وجوی شما یافت نشد.
        </p>
        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="searchQuery = ''; activeCategory = 'all'"
        >
          پاک کردن فیلترها و مشاهده همه مقالات
        </button>
      </div>
    </main>

    <!-- مدال مطالعه سریع مقاله (Reader Lightbox) -->
    <Teleport to="body">
      <div
        v-if="selectedArticle"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="selectedArticle = null"
      >
        <div
          class="relative w-full max-w-3xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto space-y-6"
          dir="rtl"
        >
          <!-- هدر مدال -->
          <div class="flex items-center justify-between border-b border-sand/60 pb-4">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-sand/50 text-ink">
              {{ selectedArticle.categoryLabel }}
            </span>

            <button
              type="button"
              class="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 flex items-center justify-center text-ink transition-colors cursor-pointer"
              aria-label="بستن"
              @click="selectedArticle = null"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-3">
            <h2 class="text-xl sm:text-2xl font-bold text-ink leading-snug">
              {{ selectedArticle.title }}
            </h2>

            <div class="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span>نویسنده: {{ selectedArticle.author.name }} ({{ selectedArticle.author.role }})</span>
              <span>•</span>
              <span>زمان مطالعه: {{ selectedArticle.readTime }}</span>
              <span>•</span>
              <span>تاریخ: {{ selectedArticle.date }}</span>
            </div>
          </div>

          <div class="aspect-16/9 rounded-2xl overflow-hidden bg-sand/30">
            <NuxtImg
              :src="selectedArticle.image"
              :alt="selectedArticle.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- بدنه متن -->
          <div class="space-y-4 text-xs sm:text-sm text-ink/90 leading-relaxed">
            <p v-for="(p, pIdx) in selectedArticle.content" :key="pIdx">
              {{ p }}
            </p>
          </div>

          <!-- نکات کلیدی مقاله -->
          <div class="rounded-2xl border border-sage/40 bg-sage/10 p-5 space-y-3">
            <div class="text-xs font-bold text-sage flex items-center gap-1.5">
              <CheckCircle2 class="w-4 h-4" />
              <span>نکات کلیدی و جمع‌بندی کاربردی:</span>
            </div>
            <ul class="space-y-1.5 text-xs text-muted-foreground">
              <li v-for="(k, kIdx) in selectedArticle.keyTakeaways" :key="kIdx" class="flex items-start gap-2">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 mt-1.5" />
                <span>{{ k }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- بخش خبرنامه علمی کراس -->
    <section class="container mx-auto max-w-4xl px-4 mt-12">
      <div class="rounded-3xl border border-sand bg-sand/30 p-8 sm:p-12 text-center space-y-4">
        <Sparkles class="w-8 h-8 text-rose mx-auto" />
        <h2 class="text-xl sm:text-2xl font-bold text-ink">
          اشتراک در خبرنامه دانش ورزشی کراس
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          جدیدترین پژوهش‌های بیومکانیک، علم تغذیه و راهنماهای تمرینی را دو بار در ماه بدون هرزنامه دریافت فرمایید.
        </p>

        <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2" @submit.prevent="handleSubscribe">
          <input
            v-model="newsletterEmail"
            type="email"
            placeholder="ایمیل خود را وارد فرمایید..."
            class="flex-1 rounded-xl border border-sand bg-white py-3 px-4 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose shadow-2xs"
            required
          >
          <button
            type="submit"
            class="py-3 px-6 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            عضویت در خبرنامه
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
