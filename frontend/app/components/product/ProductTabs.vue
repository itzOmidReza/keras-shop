<!-- frontend/app/components/product/ProductTabs.vue -->
<script setup lang="ts">
import {
  CheckCircle2,
  Sparkles,
  Shirt,
  Droplets,
  Wind,
  Sun,
  Flame,
} from '@lucide/vue'

interface Props {
  title?: string
  description?: string
  fabric?: {
    stretch?: number
    softness?: number
    opacity?: number
    composition?: string
    gsm?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  title: 'لگ سیم‌لس زنانه کراس',
  description: '',
  fabric: undefined,
})

const displayDescription = computed(() => {
  if (props.description && props.description.trim().length > 0) {
    return props.description
  }
  return 'این لگ ورزشی زنانه با بهره‌گیری از تکنولوژی بافت مدور بدون درز (Circular Seamless Knitting) طراحی شده تا ضمن ایجاد فرم‌دهی متناسب به عضلات پا و کمر، از هرگونه تحریک پوستی و اصطکاک در تمرینات پرتکرار جلوگیری کند.'
})

const highlights = [
  'الیاف تنفس‌پذیر با انتقال حرارت و رطوبت بالا',
  'طراحی بدون درز (Seamless) ضد سایش و اصطکاک',
  'کمر بلند گنی ضد لغزش و لول‌شدن حین تمرین',
  'تست‌شده در ۱۰۰٪ کشش بدون عبور نور (Squat-Proof)',
  'مقاومت در برابر پرزدهی و تغییر رنگ پس از شست‌وشو',
]

const careInstructions = [
  {
    icon: Droplets,
    title: 'دمای شست‌وشو',
    desc: 'حداکثر ۳۰ درجه سانتی‌گراد با دور ملایم ماشین لباس‌شویی.',
  },
  {
    icon: Flame,
    title: 'عدم استفاده از نرم‌کننده',
    desc: 'مواد نرم‌کننده خاصیت تنفس‌پذیری الیاف را کاهش می‌دهند.',
  },
  {
    icon: Wind,
    title: 'خشک‌کردن طبیعی',
    desc: 'پهن کردن در سایه؛ از خشک‌کن حرارتی استفاده نکنید.',
  },
  {
    icon: Sun,
    title: 'اتو کشی',
    desc: 'پارچه چروک‌ناپذیر است؛ نیاز به اتوکشی مستقیم ندارد.',
  },
]
</script>

<template>
  <section class="mt-16 pt-10 border-t border-sand" aria-label="اطلاعات و نقد و بررسی محصول">
    <Tabs default-value="description" class="w-full">
      <!-- منوی تب‌ها با تفکیک کامل توضیحات کلی و مشخصات فنی -->
      <TabsList
        class="bg-transparent border-b border-sand w-full justify-start rounded-none h-auto p-0 gap-6 sm:gap-10 overflow-x-auto scrollbar-none">
        <TabsTrigger
value="description"
          class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none transition-colors shrink-0">
          <h2>بررسی تخصصی و توضیحات</h2>
        </TabsTrigger>
        <TabsTrigger
value="specs"
          class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none transition-colors shrink-0">
          <h2>مشخصات فنی و دوخت</h2>
        </TabsTrigger>
        <TabsTrigger
value="materials"
          class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none transition-colors shrink-0">
          <h2>الیاف و سنجه‌های پارچه</h2>
        </TabsTrigger>
        <TabsTrigger
value="care"
          class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none transition-colors shrink-0">
          <h2>دستورالعمل نگهداری</h2>
        </TabsTrigger>
      </TabsList>

      <!-- تب ۱: توضیحات متنی عمیق برای SEO و معرفی جامع -->
      <TabsContent value="description" class="pt-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <article class="lg:col-span-8 space-y-6 text-ink leading-relaxed">
            <header class="space-y-2">
              <h3 class="text-lg font-bold text-ink">
                آزادی کامل در حرکت؛ متولد شده برای تمرینات پیوسته
              </h3>
              <p class="text-xs text-muted-foreground font-medium">
                بررسی جزئیات مهندسی دوخت و متریال در استودیو طراحی کراس
              </p>
            </header>

            <div class="text-sm text-muted-foreground space-y-4 leading-loose">
              <p>
                {{ displayDescription }}
              </p>
              <p>
                ساختار الیاف الاستومری مات به کار رفته در این محصول به گونه‌ای فرآوری شده که حتی در بیشترین زاویه کشش
                حین حرکات اسکات، یوگا و پیلاتس، پوشش کاملاً ضد دید (Squat-Proof) را تضمین می‌نماید. تراکم سطحی
                محاسبه‌شده مانع از تعریق موضعی شده و گردش هوای آزاد را روی پوست فراهم می‌کند.
              </p>
            </div>

            <!-- فیچرهای تیک‌دار -->
            <div class="pt-4 border-t border-sand/70">
              <h4 class="text-xs font-bold text-ink uppercase tracking-wider mb-3">
                ویژگی‌های کلیدی و مزایا
              </h4>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <li
v-for="point in highlights" :key="point"
                  class="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 class="w-4 h-4 text-rose shrink-0" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
          </article>

          <!-- کادر استایلینگ -->
          <aside class="lg:col-span-4 rounded-2xl border border-sand/80 bg-sand/30 p-6 space-y-4">
            <div class="flex items-center gap-2 text-rose">
              <Shirt class="w-4 h-4" />
              <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
                پیشنهاد استایلینگ کراس
              </h4>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground">
              برای ایجاد بهترین هارمونی بصری و عملکرد ورزشی، ترکیب این لگ را با نیم‌‌‌‌تنه‌های تخصصی <strong
                class="text-ink font-bold">لاین Move</strong> یا تاپ‌های ابریشمی <strong class="text-ink font-bold">لاین
                Calm</strong> پیشنهاد می‌کنیم.
            </p>
            <div class="pt-2 border-t border-sand/80">
              <NuxtLink to="/shop" class="inline-flex items-center gap-1 text-xs font-bold text-rose hover:underline">
                <span>مشاهده محصولات مکمل</span>
                <span>←</span>
              </NuxtLink>
            </div>
          </aside>
        </div>
      </TabsContent>

      <!-- تب ۲: مشخصات فنی و دوخت (کارت‌های ارگونومیک) -->
      <!-- تب ۲: مشخصات فنی و دوخت (جدول اسکن سریع و مینیمال UX-Friendly) -->
      <TabsContent value="specs" class="pt-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- جدول ساختاریافته مشخصات -->
          <div class="lg:col-span-8 overflow-hidden rounded-2xl border border-sand bg-white/80 shadow-2xs">
            <div class="border-b border-sand bg-sand/30 px-6 py-3.5 flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-ink">
                جدول مشخصات مهندسی و دوخت
              </h3>
              <span class="text-[11px] font-medium text-muted-foreground">
                استاندارد استودیو کراس
              </span>
            </div>

            <dl class="divide-y divide-sand/60 text-xs">
              <div class="grid grid-cols-3 px-6 py-3.5 hover:bg-sand/15 transition-colors">
                <dt class="font-bold text-ink">تکنولوژی بافت</dt>
                <dd class="col-span-2 text-muted-foreground">مدور بدون درز (Circular Seamless Knitting) جهت حذف اصطکاک
                  جانبی</dd>
              </div>

              <div class="grid grid-cols-3 px-6 py-3.5 bg-sand/10 hover:bg-sand/20 transition-colors">
                <dt class="font-bold text-ink">طراحی فاق</dt>
                <dd class="col-span-2 text-muted-foreground">فاق گست (Gusset دوتکه الماسی) جهت آزادی ۱۰۰٪ در حرکات کششی
                </dd>
              </div>

              <div class="grid grid-cols-3 px-6 py-3.5 hover:bg-sand/15 transition-colors">
                <dt class="font-bold text-ink">نوع کمر</dt>
                <dd class="col-span-2 text-muted-foreground">کمر گنی پهن (High-Rise) دولایه با نگه‌دارندگی مطلوب بدون
                  لول‌شدن</dd>
              </div>

              <div class="grid grid-cols-3 px-6 py-3.5 bg-sand/10 hover:bg-sand/20 transition-colors">
                <dt class="font-bold text-ink">نوع دوخت لبه‌ها</dt>
                <dd class="col-span-2 text-muted-foreground">دوخت فلت‌لاک چهارسوزنه فوق‌العاده نرم (Flatlock Stitching)
                </dd>
              </div>

              <div class="grid grid-cols-3 px-6 py-3.5 hover:bg-sand/15 transition-colors">
                <dt class="font-bold text-ink">قد شلوار</dt>
                <dd class="col-span-2 text-muted-foreground">قد کامل تا مچ پا (7/8 یا Ankle-Length متناسب با سایز)</dd>
              </div>

              <div class="grid grid-cols-3 px-6 py-3.5 bg-sand/10 hover:bg-sand/20 transition-colors">
                <dt class="font-bold text-ink">سطح فشردگی (Compression)</dt>
                <dd class="col-span-2 flex items-center gap-2">
                  <span class="text-muted-foreground">متوسط رو به بالا (فرم‌دهی ملایم عضلات)</span>
                  <span class="rounded-full bg-rose/10 px-2 py-0.5 text-[10px] font-bold text-rose">Medium-Firm</span>
                </dd>
              </div>
            </dl>
          </div>

          <!-- سایدبار کوتاه توصیه‌های استایلینگ و نگهداری سریع -->
          <aside class="lg:col-span-4 rounded-2xl border border-sand bg-sand/30 p-6 space-y-4">
            <div class="flex items-center gap-2 text-rose">
              <Sparkles class="w-4 h-4" />
              <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
                نکته تخصصی فیت
              </h4>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground">
              به دلیل کشسانی ۴ جهته و بافت سیم‌لس، این مدل حس پوست دوم ایجاد می‌کند. اگر بین دو سایز تردید دارید، برای
              فرم‌دهی بیشتر سایز کوچک‌تر و برای راحتی روزمره سایز بزرگ‌تر را انتخاب کنید.
            </p>
            <div class="pt-2 border-t border-sand/70">
              <NuxtLink
to="/guide/size"
                class="inline-flex items-center gap-1 text-xs font-bold text-rose hover:underline">
                <span>مشاهده جدول دقیق اندازه‌گیری دور کمر و باسن</span>
                <span>←</span>
              </NuxtLink>
            </div>
          </aside>
        </div>
      </TabsContent>

      <!-- تب ۳: سنجه‌ها و الیاف پارچه -->
      <TabsContent value="materials" class="pt-8">
        <div class="max-w-2xl">
          <FabricMeters
:stretch="fabric?.stretch ?? 5" :softness="fabric?.softness ?? 5"
            :opacity="fabric?.opacity ?? 5"
            :composition="fabric?.composition ?? '۸۵٪ پلی‌آمید تنفس‌پذیر، ۱۵٪ الاستین میکروفیبر'"
            :gsm="fabric?.gsm ?? 280" />
        </div>
      </TabsContent>

      <!-- تب ۴: راهنمای نگهداری -->
      <TabsContent value="care" class="pt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
v-for="care in careInstructions" :key="care.title"
            class="rounded-2xl border border-sand bg-white/50 p-5 space-y-2.5">
            <div class="w-9 h-9 rounded-xl bg-sand/30 flex items-center justify-center text-sage">
              <component :is="care.icon" class="w-4 h-4" />
            </div>
            <h4 class="text-xs font-bold text-ink">
              {{ care.title }}
            </h4>
            <p class="text-[11px] leading-relaxed text-muted-foreground">
              {{ care.desc }}
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>
