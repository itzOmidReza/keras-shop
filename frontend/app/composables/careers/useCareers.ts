import { toast } from 'vue-sonner'
import { toEn, isIranMobile } from '~/utils/format'

export interface JobPosition {
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

export interface CulturePillar {
  title: string
  desc: string
}

export interface CareerPerk {
  iconName: 'Award' | 'Heart' | 'Laptop' | 'Target' | 'Compass' | 'Coffee'
  title: string
  desc: string
}

export const CULTURE_PILLARS: CulturePillar[] = [
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

export const CAREER_PERKS: CareerPerk[] = [
  {
    iconName: 'Award',
    title: 'سهمیه فصلی پوشاک ورزشی',
    desc: 'دریافت پک اختصاصی از جدیدترین محصولات لاین‌های حرکت و آرامش در هر فصل.',
  },
  {
    iconName: 'Heart',
    title: 'عضویت در باشگاه و استودیوهای برتر',
    desc: 'تامین هزینه اشتراک ماهانه در برترین باشگاه‌های فیتنس، استودیوهای یوگا و پیلاتس.',
  },
  {
    iconName: 'Laptop',
    title: 'مدل کاری منعطف و هیبرید',
    desc: 'امکان کار ترکیبی حضوری و دورکاری برای موقعیت‌های فنی همراه با تجهیزات ارگونومیک.',
  },
  {
    iconName: 'Target',
    title: 'بودجه یادگیری و توسعه فردی',
    desc: 'کمک‌هزینه سالانه جهت خرید کتب تخصصی، شرکت در ورکشاپ‌ها و دوره‌های بین‌المللی.',
  },
  {
    iconName: 'Compass',
    title: 'بیمه درمان تکمیلی جامع',
    desc: 'پوشش کامل خدمات درمانی، دندان‌پزشکی و مشاوره‌های سلامت روان برای همکاران.',
  },
  {
    iconName: 'Coffee',
    title: 'تغذیه سالم و اتمسفر مینیمال',
    desc: 'صبحانه و میان‌وعده‌های ارگانیک روزانه در استودیوی دلباز و آرام نیاوران تهران.',
  },
]

export const JOB_POSITIONS: JobPosition[] = [
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

export function useCareers() {
  const activeJob = ref<JobPosition | null>(null)
  const expandedJobId = ref<string | null>('nuxt-engineer')
  const isApplying = ref(false)

  const applicantName = ref('')
  const applicantPhone = ref('')
  const applicantEmail = ref('')
  const applicantPortfolio = ref('')
  const applicantCoverNote = ref('')
  const resumeFileName = ref<string | null>(null)
  const formError = ref<string | null>(null)
  const isSubmitting = ref(false)

  const toggleJob = (id: string) => {
    expandedJobId.value = expandedJobId.value === id ? null : id
  }

  const openApplyModal = (job: JobPosition) => {
    activeJob.value = job
    isApplying.value = true
    formError.value = null
  }

  const closeApplyModal = () => {
    isApplying.value = false
  }

  const handleFileSimulate = () => {
    resumeFileName.value = 'Resume_CV_2026.pdf'
  }

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

    await new Promise(resolve => setTimeout(resolve, 600))

    isSubmitting.value = false
    isApplying.value = false
    toast.success('درخواست همکاری شما با موفقیت ثبت شد. تیم منابع انسانی کراس با شما تماس خواهد گرفت.')

    applicantName.value = ''
    applicantPhone.value = ''
    applicantEmail.value = ''
    applicantPortfolio.value = ''
    applicantCoverNote.value = ''
    resumeFileName.value = null
  }

  return {
    activeJob,
    expandedJobId,
    isApplying,
    applicantName,
    applicantPhone,
    applicantEmail,
    applicantPortfolio,
    applicantCoverNote,
    resumeFileName,
    formError,
    isSubmitting,
    toggleJob,
    openApplyModal,
    closeApplyModal,
    handleFileSimulate,
    handleSubmitApplication,
  }
}
