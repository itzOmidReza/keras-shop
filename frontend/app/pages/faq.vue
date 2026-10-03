<!-- frontend/app/pages/faq.vue -->
<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import {
  HelpCircle,
  Truck,
  Ruler,
  RotateCcw,
  Sparkles,
  Search,
  MessageCircle,
  ArrowLeft,
} from '@lucide/vue'

useSeoMeta({
  title: 'پرسش‌های متداول | کراس',
  description: 'پاسخ به پرسش‌های رایج در خصوص شیوه‌های ارسال، راهنمای سایزبندی، رویه تعویض ۷ روزه و نحوه نگهداری از پوشاک ورزشی کراس',
})

type FaqCategory = 'all' | 'shipping' | 'sizing' | 'returns' | 'care'

const activeCategory = ref<FaqCategory>('all')
const searchQuery = ref('')

const categories = [
  { id: 'all' as FaqCategory, label: 'همه پرسش‌ها', icon: Sparkles },
  { id: 'shipping' as FaqCategory, label: 'ارسال و تحویل', icon: Truck },
  { id: 'sizing' as FaqCategory, label: 'سایزبندی و تناسب', icon: Ruler },
  { id: 'returns' as FaqCategory, label: 'تعویض و مرجوعی', icon: RotateCcw },
  { id: 'care' as FaqCategory, label: 'شست‌وشو و نگهداری', icon: HelpCircle },
]

interface FaqItem {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  // ارسال و تحویل
  {
    id: 'ship-1',
    category: 'shipping',
    question: 'سفارش‌ها چه زمانی و با چه روشی ارسال می‌شوند؟',
    answer: 'سفارش‌های شهر تهران در صورت ثبت تا ساعت ۱۴، همان روز کاری توسط پیک فوری اختصاصی تحویل داده می‌شوند. برای سراسر کشور، بسته‌ها از طریق پست پیشتاز ظرف ۲ تا ۴ روز کاری با کد رهگیری اختصاصی پیامک‌شده به دست شما خواهند رسید.',
  },
  {
    id: 'ship-2',
    category: 'shipping',
    question: 'شرایط ارسال رایگان در فروشگاه کراس چگونه است؟',
    answer: 'برای تمامی خریدهای بالاتر از ۱٬۵۰۰٬۰۰۰ تومان در سراسر کشور، هزینه ارسال کاملاً رایگان است. برای مبالغ کمتر، هزینه پست پیشتاز ثابت ۶۵٬۰۰۰ تومان و پیک فوری تهران ۱۲۰٬۰۰۰ تومان محاسبه می‌گردد.',
  },
  {
    id: 'ship-3',
    category: 'shipping',
    question: 'چگونه می‌توانم وضعیت بسته خود را رهگیری کنم؟',
    answer: 'بلافاصله پس از تحویل مرسوله به مرکز توزیع، کد رهگیری از طریق پیامک ارسال می‌شود. همچنین در صفحه «پیگیری سفارش» با درج شماره سفارش (KRS-XXXXXX)، می‌توانید مرحله آماده‌سازی و کد پستی بارنامه را مشاهده نمایید.',
  },

  // سایزبندی و تناسب
  {
    id: 'size-1',
    category: 'sizing',
    question: 'چگونه سایز دقیق مناسب خود را در کراس انتخاب کنم؟',
    answer: 'تمامی ابعاد در جدول سایز کراس بر اساس واحد سانتی‌متر (CM) و کیلوگرم (KG) کالیبره شده‌اند. شما می‌توانید با استفاده از «محاسبه‌گر هوشمند سایز» در صفحه هر محصول، با وارد کردن قد، وزن و دور کمر، سایز بهینه خود را برای دو حالت فیت جذب (Snug) یا آزاد (Relaxed) به دست آورید.',
  },
  {
    id: 'size-2',
    category: 'sizing',
    question: 'تفاوت ایستایی محصولات خط Move با خط Calm در چیست؟',
    answer: 'محصولات خط Move دارای ساختار فشردگی و کامپرشن بالا با الاستین ۲۵٪ هستند و فرم اندام را به طور محکم تثبیت می‌کنند. در مقابل، خط Calm به عنوان پوست دوم طراحی شده و حس رهایی، لطافت و کشسانی کاملاً ملایم بدون هیچ‌گونه فشار موضعی ارائه می‌دهد.',
  },
  {
    id: 'size-3',
    category: 'sizing',
    question: 'آیا لگ‌های ورزشی کراس آزمون اسکات (Squat-Proof) را پاس کرده‌اند؟',
    answer: 'بله، تمامی لگ‌های ورزشی خط Move با گرماژ ۳۰۰ گرم بر متر مربع و تراکم میکروفیلامنت بافته شده‌اند و در کشش‌های شدید بدنسازی و اسکات ۱۰۰٪ کدر و بدون هیچ‌گونه سایه‌اندازی هستند.',
  },

  // تعویض و مرجوعی
  {
    id: 'return-1',
    category: 'returns',
    question: 'مهلت و شرایط بازگشت یا تعویض کالا چقدر است؟',
    answer: 'شما تا ۷ روز تقویمی پس از تحویل سفارش، امکان تعویض سایز یا عودت کالا بدون قید و شرط را دارید. شرط پذیرش، جدا نشدن اتیکت‌ها، استفاده نشدن در تمرین و سلامت بسته‌بندی است.',
  },
  {
    id: 'return-2',
    category: 'returns',
    question: 'وجه پرداختی برای کالای مرجوع‌شده چگونه بازگردانده می‌شود؟',
    answer: 'پس از دریافت مرسوله توسط کارشناسان کیفیت کراس و تایید سلامت آن، مبلغ سفارش ظرف ۲۴ الی ۴۸ ساعت کاری از طریق حواله پایا به شماره شبای ثبت‌شده در حساب شما واریز می‌گردد.',
  },
  {
    id: 'return-3',
    category: 'returns',
    question: 'آیا هزینه مرجوعی به عهده مشتری است؟',
    answer: 'در مواردی که کالا دارای نقص فنی، مغایرت سایز ارسالی از طرف فروشگاه یا آسیب‌دیدگی باشد، کلیه هزینه‌های بازگشت بر عهده کراس است. در موارد سلیقه‌ای یا تغییر سایز، هزینه بازگشت بر عهده خریدار خواهد بود.',
  },

  // شست‌وشو و نگهداری
  {
    id: 'care-1',
    category: 'care',
    question: 'بهترین شیوه شست‌وشوی لگ و نیم‌تنه‌های الاستین چیست؟',
    answer: 'پوشاک ورزشی کراس را ترجیحاً با آب سرد (حداکثر دمای ۳۰ درجه سانتی‌گراد) و با شوینده‌های مایع ملایم بدون آنزیم بشویید. توصیه می‌شود لباس‌ها را قبل از شست‌وشو پشت و رو کنید.',
  },
  {
    id: 'care-2',
    category: 'care',
    question: 'آیا می‌توان برای نرمی بیشتر از نرم‌کننده لباس استفاده کرد؟',
    answer: 'خیر. استفاده از نرم‌کننده‌های غلیظ باعث مسدود شدن منافذ میکروسکوپی الیاف تنفس‌پذیر Quick-Dry شده و خاصیت کشسانی و دفع رطوبت پارچه‌های ورزشی را در درازمدت کاهش می‌دهد.',
  },
  {
    id: 'care-3',
    category: 'care',
    question: 'چگونه از تغییر فرم و پرزدهی پارچه‌ها جلوگیری کنیم؟',
    answer: 'از اتوکشی با حرارت بالا و استفاده از خشک‌کن‌های دور بالا (Tumble Dryer) خودداری نمایید. الیاف کراس به دلیل ماهیت خشک‌شوندگی سریع، در دمای محیط و روی سطح صاف به سرعت خشک می‌شوند.',
  },
]

const filteredFaqs = computed(() => {
  return faqs.filter((item) => {
    const matchCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const matchSearch =
      !searchQuery.value.trim() ||
      item.question.includes(searchQuery.value.trim()) ||
      item.answer.includes(searchQuery.value.trim())
    return matchCategory && matchSearch
  })
})
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- هدر صفحه -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-20">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <HelpCircle class="w-3.5 h-3.5" />
          <span>پاسخگویی به پرسش‌ها</span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          پرسش‌های متداول
        </h1>

        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          پرتکرارترین پرسش‌های همراهان کراس درباره شیوه‌های ارسال، تناسب سایز، تعویض ۷ روزه و استانداردهای پارچه را در اینجا بیابید.
        </p>

        <!-- باکس جست‌وجو در سوالات -->
        <div class="pt-4 max-w-md mx-auto">
          <div class="relative">
            <div class="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جست‌وجو در سوالات متداول..."
              class="w-full h-12 rounded-2xl border border-sand bg-white ps-10 pe-4 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none shadow-2xs transition-all"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- تب‌های دسته‌بندی موضوعی -->
    <section class="container mx-auto px-4 max-w-4xl pt-8 pb-4">
      <div class="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          class="h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          :class="activeCategory === cat.id ? 'bg-rose text-white shadow-xs' : 'bg-white border border-sand text-muted-foreground hover:text-ink'"
          @click="activeCategory = cat.id"
        >
          <component :is="cat.icon" class="w-3.5 h-3.5" />
          <span>{{ cat.label }}</span>
        </button>
      </div>
    </section>

    <!-- بدنه آکاردئون پرسش‌ها -->
    <section class="container mx-auto px-4 max-w-3xl py-6">
      <div v-if="filteredFaqs.length > 0">
        <Accordion type="single" collapsible class="w-full space-y-3">
          <AccordionItem
            v-for="faq in filteredFaqs"
            :key="faq.id"
            :value="faq.id"
            class="rounded-2xl border border-sand bg-white px-5 shadow-2xs"
          >
            <AccordionTrigger class="text-xs sm:text-sm font-bold text-ink hover:text-rose py-4 hover:no-underline text-start">
              {{ faq.question }}
            </AccordionTrigger>
            <AccordionContent class="text-xs text-muted-foreground leading-relaxed pb-4 pt-1 border-t border-sand/40">
              {{ faq.answer }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div v-else class="rounded-3xl border border-sand bg-white p-12 text-center space-y-3">
        <HelpCircle class="w-10 h-10 text-sand mx-auto" />
        <h3 class="text-sm font-bold text-ink">موردی با این عبارت یافت نشد</h3>
        <p class="text-xs text-muted-foreground">می‌توانید مستقیماً با تیم کانسیرژ کراس تماس حاصل فرمایید.</p>
        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline pt-1 cursor-pointer"
          @click="searchQuery = ''; activeCategory = 'all'"
        >
          مشاهده تمام پرسش‌ها
        </button>
      </div>
    </section>

    <!-- کارت تماس کانسیرژ در صورت نیافتن پاسخ -->
    <section class="container mx-auto px-4 max-w-3xl pt-8">
      <div class="rounded-3xl border border-sand bg-sand/30 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 justify-center sm:justify-start text-ink">
            <MessageCircle class="w-5 h-5 text-rose" />
            <h3 class="text-base font-bold">پاسخ پرسش خود را نیافتید؟</h3>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed max-w-md">
            تیم کانسیرژ کراس در تمام روزهای کاری آماده ارائه راهنمایی اختصاصی به شماست.
          </p>
        </div>

        <NuxtLink
          to="/contact"
          class="shrink-0 inline-flex items-center gap-2 rounded-xl bg-rose px-6 py-3 text-xs font-bold text-white hover:bg-rose/90 shadow-xs transition-colors cursor-pointer"
        >
          <span>ارتباط با پشتیبانی</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
