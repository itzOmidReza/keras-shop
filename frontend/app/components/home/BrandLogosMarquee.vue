<!-- frontend/app/components/home/BrandLogosMarquee.vue -->
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Sparkles, ArrowLeft } from '@lucide/vue'

interface BrandItem {
  id: string
  slug: string
  name: string
  persianName: string
  origin: string
  itemCount: number
}

const brands: BrandItem[] = [
  {
    id: 'keras-atelier',
    slug: 'keras-atelier',
    name: 'KERAS ATELIER',
    persianName: 'کراس آتلیه',
    origin: 'طراحی اختصاصی',
    itemCount: 4,
  },
  {
    id: 'toteme',
    slug: 'toteme',
    name: 'TOTÊME',
    persianName: 'توتِم',
    origin: 'استکهلم',
    itemCount: 4,
  },
  {
    id: 'massimo-dutti',
    slug: 'massimo-dutti',
    name: 'MASSIMO DUTTI',
    persianName: 'ماسیمو دوتی',
    origin: 'میلان',
    itemCount: 4,
  },
  {
    id: 'cos',
    slug: 'cos',
    name: 'COS',
    persianName: 'کاس',
    origin: 'لندن',
    itemCount: 4,
  },
  {
    id: 'zara',
    slug: 'zara',
    name: 'ZARA',
    persianName: 'زارا',
    origin: 'لاکرونیا',
    itemCount: 4,
  },
  {
    id: 'mango',
    slug: 'mango',
    name: 'MANGO',
    persianName: 'منگو',
    origin: 'بارسلونا',
    itemCount: 4,
  },
]
</script>

<template>
  <section class="border-y border-sand/70 bg-sand/15 py-6 sm:py-8 overflow-hidden select-none">
    <div class="container mx-auto px-4 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-rose" />
          <span class="text-xs font-bold text-ink tracking-wide">
            برندها و آتلیه‌های منتخب چهارفصل کراس
          </span>
          <span class="text-[11px] text-muted-foreground hidden sm:inline">
            (روی هر لوگو برای فیلتر هوشمند کاتالوگ کلیک کنید)
          </span>
        </div>

        <NuxtLink
          to="/shop"
          class="text-xs font-bold text-rose hover:text-ink transition-colors flex items-center gap-1"
        >
          <span>مشاهده همه در کاتالوگ</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>

    <div class="w-full">
      <Swiper
        :modules="[Autoplay, FreeMode]"
        :slides-per-view="'auto'"
        :space-between="24"
        :loop="true"
        :free-mode="true"
        :speed="7000"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        dir="rtl"
        class="marquee-swiper w-full !ease-linear"
      >
        <!-- تکرار برای ایجاد چرخش پیوسته و بدون پرش در تمامی نمایشگرها -->
        <SwiperSlide
          v-for="(brand, idx) in [...brands, ...brands, ...brands]"
          :key="`${brand.slug}-${idx}`"
          class="!w-auto flex items-center"
        >
          <NuxtLink
            :to="'/shop?brand=' + brand.slug"
            class="group flex items-center gap-3.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-sand/70 hover:border-rose/30 shadow-2xs hover:shadow-xs transition-all duration-300 cursor-pointer"
            :title="`مشاهده کالکشن ${brand.persianName}`"
          >
            <!-- لوگوتایپ مونوکروم وکتوری اختصاصی هر برند -->
            <div class="text-ink/70 group-hover:text-ink transition-colors duration-200 shrink-0">
              <!-- ۱. لوگوتایپ کراس آتلیه -->
              <svg
                v-if="brand.slug === 'keras-atelier'"
                viewBox="0 0 145 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <path d="M10 4 L18 18 L10 32 L2 18 Z" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M10 9 L15 18 L10 27 L5 18 Z" fill="currentColor" opacity="0.3" />
                <text x="28" y="21" font-family="serif" font-size="16" font-weight="700" letter-spacing="3" fill="currentColor">KERAS</text>
                <text x="29" y="32" font-family="sans-serif" font-size="7.5" font-weight="600" letter-spacing="4" fill="currentColor" opacity="0.65">ATELIER</text>
              </svg>

              <!-- ۲. لوگوتایپ توتِم استکهلم -->
              <svg
                v-else-if="brand.slug === 'toteme'"
                viewBox="0 0 130 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <g transform="translate(1, 7)">
                  <rect x="0" y="0" width="8" height="2" fill="currentColor" />
                  <rect x="3" y="0" width="2" height="10" fill="currentColor" />
                  <rect x="11" y="0" width="8" height="2" fill="currentColor" />
                  <rect x="14" y="0" width="2" height="10" fill="currentColor" />
                  <rect x="0" y="11" width="8" height="2" fill="currentColor" />
                  <rect x="3" y="11" width="2" height="10" fill="currentColor" />
                  <rect x="11" y="11" width="8" height="2" fill="currentColor" />
                  <rect x="14" y="11" width="2" height="10" fill="currentColor" />
                </g>
                <text x="28" y="24" font-family="serif" font-size="17" font-weight="700" letter-spacing="4.5" fill="currentColor">TOTÊME</text>
              </svg>

              <!-- ۳. لوگوتایپ ماسیمو دوتی میلان -->
              <svg
                v-else-if="brand.slug === 'massimo-dutti'"
                viewBox="0 0 160 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <text x="2" y="24" font-family="'Times New Roman', serif" font-size="16" font-weight="600" letter-spacing="1.5" fill="currentColor">Massimo Dutti</text>
              </svg>

              <!-- ۴. لوگوتایپ کاس لندن -->
              <svg
                v-else-if="brand.slug === 'cos'"
                viewBox="0 0 80 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <text x="2" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" letter-spacing="3.5" fill="currentColor">COS</text>
              </svg>

              <!-- ۵. لوگوتایپ زارا اسپانیا -->
              <svg
                v-else-if="brand.slug === 'zara'"
                viewBox="0 0 100 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <text x="2" y="26" font-family="serif" font-size="24" font-weight="900" letter-spacing="-1.2" fill="currentColor">ZARA</text>
              </svg>

              <!-- ۶. لوگوتایپ منگو بارسلونا -->
              <svg
                v-else-if="brand.slug === 'mango'"
                viewBox="0 0 110 36"
                class="h-6 w-auto fill-current"
                aria-hidden="true"
              >
                <text x="2" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="4.5" fill="currentColor">MANGO</text>
              </svg>
            </div>

            <!-- مشخصات و برچسب فارسی برند -->
            <div class="flex flex-col text-start border-s border-sand/80 ps-3">
              <span class="text-xs font-bold text-ink group-hover:text-rose transition-colors">
                {{ brand.persianName }}
              </span>
              <span class="text-[10px] text-muted-foreground">
                {{ brand.origin }} • {{ brand.itemCount }} کالا
              </span>
            </div>
          </NuxtLink>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<style scoped>
:deep(.marquee-swiper .swiper-wrapper) {
  transition-timing-function: linear !important;
}
</style>
