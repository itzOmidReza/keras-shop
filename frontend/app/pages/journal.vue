<!-- frontend/app/pages/journal.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ArrowLeft,
  X,
  Camera,
  Layers,
  ShoppingBag,
  ExternalLink,
  Maximize2,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'

useSeoMeta({
  title: 'ژورنال و لوک‌بوک ادیتوریال | کراس',
  description: 'لوک‌بوک اختصاصی کالکشن‌های پوشاک ورزشی کراس؛ پیوند طراحی مینیمال، هنر عکاسی و عملکرد ورزشی',
})

interface LookbookItem {
  id: number
  collection: 'calm' | 'move' | 'city'
  collectionTitle: string
  title: string
  subtitle: string
  location: string
  credits: {
    photographer: string
    stylist: string
  }
  image: string
  aspectRatio: string
  description: string
  featuredProduct: {
    title: string
    slug: string
    price: number
    badge: string
  }
}

const activeCollection = ref<'all' | 'calm' | 'move' | 'city'>('all')
const selectedFrame = ref<LookbookItem | null>(null)

const lookbookItems: LookbookItem[] = [
  {
    id: 1,
    collection: 'calm',
    collectionTitle: 'کالکشن آرامش پاییز',
    title: 'هارمونی کشسانی و سکوت',
    subtitle: 'آرامش در کشش‌های عمیق صبحگاهی',
    location: 'استودیو نور طبیعی نیاوران',
    credits: {
      photographer: 'سپهر رادمنش',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'تلفیقی از الیاف میکرو مدال تنفس‌پذیر با کمر بلند گنی، طراحی‌شده برای حرکات پیوسته یوگا و ریکاوری بدون احساس تنگی.',
    featuredProduct: {
      title: 'لگ سیم‌لس آرامش',
      slug: 'calm-seamless-leggings-black',
      price: 1450000,
      badge: 'لاین آرامش',
    },
  },
  {
    id: 2,
    collection: 'move',
    collectionTitle: 'پرفورمنس حرکت',
    title: 'انرژی انفجاری در گرگ‌ومیش',
    subtitle: 'آزمون ۳۰۰٪ کشسانی در تمرینات شدید اینتروال',
    location: 'مرکز پرفورمنس اکسیژن',
    credits: {
      photographer: 'آرش علوی',
      stylist: 'سارا کیانی',
    },
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'فشرده‌سازی عضلانی هدفمند با پارچه ۳۰۰ گرمی کاملاً اسکات‌پروف، متمرکز بر ثبات مفاصل در تمرینات جهشی و کراس‌فیت.',
    featuredProduct: {
      title: 'لگ ورزشی موو پرو مشکی',
      slug: 'move-performance-leggings-graphite',
      price: 1680000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 3,
    collection: 'calm',
    collectionTitle: 'کالکشن آرامش پاییز',
    title: 'سایه روشن بافت و لطافت',
    subtitle: 'پوشش دومین پوست بدون خط دوخت آزاردهنده',
    location: 'تراس مینیمال بام ولنجک',
    credits: {
      photographer: 'سپهر رادمنش',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'ایستایی طبیعی و تنفس مداوم الیاف در هوای خنک پاییزی. بدون رنگ‌رفتگی یا پرزدهی حتی پس از شست‌وشوهای مکرر.',
    featuredProduct: {
      title: 'نیم‌تنه ورزشی کامفورت',
      slug: 'calm-comfort-sports-bra-mocha',
      price: 980000,
      badge: 'لاین آرامش',
    },
  },
  {
    id: 4,
    collection: 'city',
    collectionTitle: 'استایل روزمره شهری',
    title: 'گذر از استودیو به خیابان',
    subtitle: 'طراحی کاربردی و لوکس برای زندگی پویا',
    location: 'خیابان ولیعصر، تهران',
    credits: {
      photographer: 'کیوان رحیمی',
      stylist: 'مریم سهرابی',
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'ترکیب کت‌های سبک با ست‌های اسپرت کراس؛ نمایانگر زیبایی‌شناسی مدرن که مرز میان ورزش و مد روزمره را محو می‌سازد.',
    featuredProduct: {
      title: 'تاپ تنفس‌پذیر مسابقه‌ای',
      slug: 'move-aero-tank-rose',
      price: 890000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 5,
    collection: 'move',
    collectionTitle: 'پرفورمنس حرکت',
    title: 'تمرکز مطلق در هر تکرار',
    subtitle: 'تکنولوژی مدیریت رطوبت و تعریق',
    location: 'باشگاه تمرینات قدرتی انقلاب',
    credits: {
      photographer: 'آرش علوی',
      stylist: 'سارا کیانی',
    },
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'خشک‌شوندگی سریع و ضدباکتری طبیعی، طراحی‌شده برای ورزشکارانی که تعهد به تمرین و دقت در ظاهر را هم‌زمان دنبال می‌کنند.',
    featuredProduct: {
      title: 'شلوارک دو لایه فشرده‌ساز',
      slug: 'move-compression-shorts-sage',
      price: 1120000,
      badge: 'لاین حرکت',
    },
  },
  {
    id: 6,
    collection: 'city',
    collectionTitle: 'استایل روزمره شهری',
    title: 'توازن رنگی پالت ارگانیک',
    subtitle: 'رنگ‌های برآمده از طبیعت ایران',
    location: 'گالری هنر معاصر فرشته',
    credits: {
      photographer: 'کیوان رحیمی',
      stylist: 'نیلوفر امینی',
    },
    image: 'https://images.unsplash.com/photo-1552196563-5527e3abbd73?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'aspect-4/5',
    description: 'پالت رنگی خاک رس، سبز مریم‌گلی و مشکی موکا، بازتاب اصالت و سادگی در پوشش مدرن بانوان و آقایان ورزشکار.',
    featuredProduct: {
      title: 'لگ سیم‌لس آرامش',
      slug: 'calm-seamless-leggings-black',
      price: 1450000,
      badge: 'لاین آرامش',
    },
  },
]

const filteredItems = computed(() => {
  if (activeCollection.value === 'all') return lookbookItems
  return lookbookItems.filter((item) => item.collection === activeCollection.value)
})
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر ژورنال ادیتوریال -->
    <section class="border-b border-sand/70 bg-sand/20 py-16 lg:py-24 px-4 text-center">
      <div class="container mx-auto max-w-4xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <Sparkles class="w-3.5 h-3.5 text-rose" />
          <span>ژورنال کراس • نسخه پاییز و زمستان ۱۴۰۵</span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-ink">
          روایت فرم، حرکت و سکوت
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          کاوشی تصویری در پیوند الیاف فنی با هندسه بدن انسان. لوک‌بوک فصلی کراس تجسم زیبایی‌شناسی مینیمال و تعهد تزلزل‌ناپذیر به عملکرد ورزشی است.
        </p>

        <!-- فیلترهای کالکشن -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-6">
          <button
            type="button"
            class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="[
              activeCollection === 'all'
                ? 'bg-ink text-white border-ink shadow-xs'
                : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
            ]"
            @click="activeCollection = 'all'"
          >
            همه فریم‌ها
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="[
              activeCollection === 'calm'
                ? 'bg-sage text-white border-sage shadow-xs'
                : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
            ]"
            @click="activeCollection = 'calm'"
          >
            کالکشن آرامش (Calm)
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="[
              activeCollection === 'move'
                ? 'bg-rose text-white border-rose shadow-xs'
                : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
            ]"
            @click="activeCollection = 'move'"
          >
            پرفورمنس حرکت (Move)
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="[
              activeCollection === 'city'
                ? 'bg-sand text-ink border-sand shadow-xs'
                : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
            ]"
            @click="activeCollection = 'city'"
          >
            استایل روزمره شهری
          </button>
        </div>
      </div>
    </section>

    <!-- گالری لوک‌بوک -->
    <main class="container mx-auto max-w-7xl px-4 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="group rounded-3xl border border-sand/70 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <!-- ظرف تصویر با هاور و دکمه لایت‌باکس -->
          <div class="relative overflow-hidden aspect-4/5 bg-sand/30 cursor-pointer" @click="selectedFrame = item">
            <NuxtImg
              :src="item.image"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            <!-- نشانگر کالکشن -->
            <div class="absolute inset-s-4 top-4">
              <span
                class="text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-xs"
                :class="[
                  item.collection === 'calm'
                    ? 'bg-white/90 text-sage'
                    : item.collection === 'move'
                      ? 'bg-rose text-white'
                      : 'bg-ink text-white',
                ]"
              >
                {{ item.collectionTitle }}
              </span>
            </div>

            <!-- دکمه بزرگ‌نمایی -->
            <button
              type="button"
              class="absolute inset-e-4 bottom-4 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
              aria-label="مشاهده تصویر کامل"
            >
              <Maximize2 class="w-4 h-4" />
            </button>
          </div>

          <!-- اطلاعات تصویر و یادداشت ادیتوریال -->
          <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[11px] text-muted-foreground">
                <span class="flex items-center gap-1">
                  <Camera class="w-3.5 h-3.5 text-rose" />
                  {{ item.location }}
                </span>
                <span>عکس: {{ item.credits.photographer }}</span>
              </div>

              <h2 class="text-lg font-bold text-ink group-hover:text-rose transition-colors">
                {{ item.title }}
              </h2>

              <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {{ item.description }}
              </p>
            </div>

            <!-- پیوند به محصول شاخص فریم -->
            <div class="pt-4 border-t border-sand/50 flex items-center justify-between gap-3">
              <div>
                <div class="text-[10px] text-muted-foreground">
                  محصول شاخص:
                </div>
                <NuxtLink
                  :to="`/products/${item.featuredProduct.slug}`"
                  class="text-xs font-bold text-ink hover:text-rose transition-colors truncate block max-w-[180px]"
                >
                  {{ item.featuredProduct.title }}
                </NuxtLink>
              </div>

              <div class="text-end shrink-0">
                <div class="text-xs font-bold font-mono text-rose">
                  {{ formatToman(item.featuredProduct.price) }}
                </div>
                <NuxtLink
                  :to="`/products/${item.featuredProduct.slug}`"
                  class="text-[10px] font-bold text-muted-foreground hover:text-ink inline-flex items-center gap-0.5 mt-0.5"
                >
                  <span>خرید</span>
                  <ArrowLeft class="w-3 h-3 rtl:-scale-x-100" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- مانیفست ادیتوریال برند در انتهای گالری -->
      <section class="mt-20 rounded-3xl border border-sand bg-sand/30 p-8 sm:p-14 text-center space-y-5">
        <div class="w-12 h-12 rounded-full bg-rose/10 text-rose mx-auto flex items-center justify-center">
          <Layers class="w-6 h-6" />
        </div>

        <blockquote class="text-lg sm:text-2xl font-bold text-ink max-w-3xl mx-auto leading-relaxed">
          «لباس ورزشی مرز میان تمرین و زندگی روزمره نیست؛ بلکه بستر پیوند ذهن، تنفس و هارمونی حرکت است.»
        </blockquote>

        <p class="text-xs sm:text-sm text-muted-foreground">
          — تیم خلاقیت و طراحی منسوجات کراس، تهران ۱۴۰۵
        </p>

        <div class="pt-4">
          <NuxtLink
            to="/shop"
            class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-ink hover:bg-rose text-white text-xs font-bold shadow-xs transition-colors"
          >
            <ShoppingBag class="w-4 h-4" />
            <span>مشاهده و خرید تمامی کالکشن‌ها</span>
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- مدال لایت‌باکس جزئیات فریم (Lookbook Lightbox Modal) -->
    <Teleport to="body">
      <div
        v-if="selectedFrame"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="selectedFrame = null"
      >
        <div
          class="relative w-full max-w-4xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          dir="rtl"
        >
          <!-- دکمه بستن -->
          <button
            type="button"
            class="absolute top-4 inset-e-4 z-10 w-9 h-9 rounded-full bg-white/90 text-ink hover:bg-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
            aria-label="بستن"
            @click="selectedFrame = null"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- تصویر بزرگ -->
          <div class="md:w-3/5 bg-sand/20 aspect-4/5 md:aspect-auto overflow-hidden">
            <NuxtImg
              :src="selectedFrame.image"
              :alt="selectedFrame.title"
              class="w-full h-full object-cover object-center"
            />
          </div>

          <!-- توضیحات و محصول -->
          <div class="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div class="space-y-4">
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-sand/50 text-ink">
                {{ selectedFrame.collectionTitle }}
              </span>

              <h3 class="text-xl font-bold text-ink">
                {{ selectedFrame.title }}
              </h3>

              <p class="text-xs text-muted-foreground leading-relaxed">
                {{ selectedFrame.description }}
              </p>

              <div class="rounded-2xl bg-sand/20 p-4 border border-sand/60 space-y-2 text-xs">
                <div class="flex justify-between text-muted-foreground">
                  <span>لوکیشن عکاسی:</span>
                  <span class="font-bold text-ink">{{ selectedFrame.location }}</span>
                </div>
                <div class="flex justify-between text-muted-foreground">
                  <span>عکاس:</span>
                  <span class="font-bold text-ink">{{ selectedFrame.credits.photographer }}</span>
                </div>
                <div class="flex justify-between text-muted-foreground">
                  <span>استایلیست:</span>
                  <span class="font-bold text-ink">{{ selectedFrame.credits.stylist }}</span>
                </div>
              </div>
            </div>

            <!-- کارت محصول -->
            <div class="rounded-2xl border border-rose/30 bg-rose/5 p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-ink">{{ selectedFrame.featuredProduct.title }}</span>
                <span class="text-xs font-bold font-mono text-rose">{{ formatToman(selectedFrame.featuredProduct.price) }}</span>
              </div>

              <NuxtLink
                :to="`/products/${selectedFrame.featuredProduct.slug}`"
                class="w-full py-2.5 px-4 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                @click="selectedFrame = null"
              >
                <span>مشاهده و افزودن به سبد خرید</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
