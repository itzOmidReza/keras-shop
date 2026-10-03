import { toast } from 'vue-sonner'

export interface Article {
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

export type BlogCategoryFilter = 'all' | 'training' | 'recovery' | 'science'

export const BLOG_ARTICLES: Article[] = [
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

export function useBlogArticles() {
  const activeCategory = ref<BlogCategoryFilter>('all')
  const searchQuery = ref('')
  const selectedArticle = ref<Article | null>(null)
  const newsletterEmail = ref('')

  const filteredArticles = computed(() => {
    let list = BLOG_ARTICLES
    if (activeCategory.value !== 'all') {
      list = list.filter(a => a.category === activeCategory.value)
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      list = list.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q),
      )
    }
    return list
  })

  const featuredArticle = computed(() => {
    return BLOG_ARTICLES.find(a => a.featured) || BLOG_ARTICLES[0]!
  })

  const handleSubscribe = () => {
    if (!newsletterEmail.value) return
    toast.success('عضویت شما در خبرنامه علمی کراس با موفقیت ثبت شد.')
    newsletterEmail.value = ''
  }

  const selectArticle = (article: Article) => {
    selectedArticle.value = article
  }

  const closeArticleModal = () => {
    selectedArticle.value = null
  }

  return {
    activeCategory,
    searchQuery,
    selectedArticle,
    newsletterEmail,
    filteredArticles,
    featuredArticle,
    handleSubscribe,
    selectArticle,
    closeArticleModal,
  }
}
