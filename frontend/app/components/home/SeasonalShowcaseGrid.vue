<!-- frontend/app/components/home/SeasonalShowcaseGrid.vue -->
<script setup lang="ts">
import { ArrowLeft, Sparkles, Wind, Sun, Layers } from '@lucide/vue'

interface SeasonCard {
  id: string
  seasonLabel: string
  title: string
  description: string
  badge: string
  href: string
  image: string
  icon: typeof Sparkles
}

const seasons: SeasonCard[] = [
  {
    id: 'fall-1405',
    seasonLabel: 'دراپ فعال پاییز ۱۴۰۵',
    title: 'پاییز ۱۴۰۵: پالت رنگ‌های گرم زمین و پارچه‌های فوتر',
    description: 'ترکیب پالتوهای پشمی آستردار، شومیزهای اسلپ و بارانی‌های دو ردیف دکمه برای روزهای خنک.',
    badge: 'دراپ جدید',
    href: '/shop?season=fall-1405',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    icon: Sparkles,
  },
  {
    id: 'winter-1405',
    seasonLabel: 'کالکشن زمستان ۱۴۰۵',
    title: 'زمستان ۱۴۰۵: بافت‌های متراکم کشمیر و کاپشن‌های اورسایز',
    description: 'پلیورهای متراکم یقه اسکی، ژاکارد بوکله و کاپشن‌های بادگیر مقاوم برای محافظت در برابر سرما.',
    badge: 'گرم و ساختاریافته',
    href: '/shop?season=winter-1405',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    icon: Wind,
  },
  {
    id: 'spring-1406',
    seasonLabel: 'پیش‌نمایش بهار ۱۴۰۶',
    title: 'بهار ۱۴۰۶: لینن‌های تنفس‌پذیر و الیاف سبک',
    description: 'سیلوئت‌های آزاد، پارچه‌های کتان شسته و رنگ‌های ملایم شکوفه برای هوای معتدل بهاری.',
    badge: 'پیش‌نمایش',
    href: '/shop?season=spring-1406',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
    icon: Sun,
  },
  {
    id: 'accessories-capsule',
    seasonLabel: 'اکسسوری‌های کپسولی',
    title: 'اکسسوری‌های کپسولی: لمس نهایی ظرافت با ابریشم و دستمال سر',
    description: 'اسکرانچی‌های ابریشم طبیعی، دستمال سرهای ژاکارد و شال‌های دست‌دوز برای تکمیل هر استایل.',
    badge: 'دست‌ساز',
    href: '/shop?division=accessories',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    icon: Layers,
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-8">
      <!-- هدر ادیتوریال بخش کالکشن‌های چهارفصل -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>هارمونی چهارفصل کراس</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            کشف کالکشن‌ها بر اساس فصل و سبک استایل
          </h2>
        </div>

        <p class="text-xs sm:text-sm text-muted-foreground max-w-md text-start leading-relaxed">
          تلفیق پارچه‌های الیاف طبیعی، دوخت دقیق مزونی و اکسسوری‌های مکمل برای هر فصل از تقویم استایل شما.
        </p>
      </div>

      <!-- شبکه ۴ تایی کارت‌های فصول -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <NuxtLink
          v-for="season in seasons"
          :key="season.id"
          :to="season.href"
          class="group relative h-[390px] sm:h-[430px] rounded-3xl overflow-hidden border border-sand/60 shadow-xs flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-md cursor-pointer"
        >
          <!-- تصویر پس‌زمینه با افکت زوم هاور -->
          <NuxtImg
            :src="season.image"
            :alt="season.title"
            class="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          <!-- گرادیان عمودی برای تضمین خوانایی متن در حالت RTL -->
          <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

          <!-- محتوای کارت روی تصویر -->
          <div class="relative z-10 space-y-3 text-start">
            <!-- بج فصل -->
            <div class="inline-flex items-center gap-1.5 rounded-full bg-paper/20 backdrop-blur-md px-3 py-1 border border-paper/30 text-[10px] font-bold text-paper">
              <component :is="season.icon" class="w-3.5 h-3.5 text-rose" />
              <span>{{ season.badge }}</span>
            </div>

            <!-- عنوان فصل و مانیفست استایل -->
            <h3 class="text-base sm:text-lg font-bold text-paper leading-snug group-hover:text-rose transition-colors">
              {{ season.title }}
            </h3>

            <!-- توضیح کوتاه -->
            <p class="text-xs text-sand/80 leading-relaxed line-clamp-2">
              {{ season.description }}
            </p>

            <!-- لینک و پیکان اقدام -->
            <div class="pt-1 flex items-center gap-1.5 text-xs font-bold text-paper group-hover:text-rose transition-colors">
              <span>مشاهده کالکشن</span>
              <ArrowLeft class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
