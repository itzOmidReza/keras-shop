<!-- frontend/app/components/home/BrandLogosMarquee.vue -->
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode } from 'swiper/modules'

interface BrandItem {
  id: string
  slug: string
  name: string
}

const defaultBrands: BrandItem[] = [
  {
    id: 'toteme',
    slug: 'toteme',
    name: 'TOTÊME',
  },
  {
    id: 'massimo-dutti',
    slug: 'massimo-dutti',
    name: 'MASSIMO DUTTI',
  },
  {
    id: 'cos',
    slug: 'cos',
    name: 'COS',
  },
  {
    id: 'zara',
    slug: 'zara',
    name: 'ZARA',
  },
  {
    id: 'mango',
    slug: 'mango',
    name: 'MANGO',
  },
  {
    id: 'keras-atelier',
    slug: 'keras-atelier',
    name: 'KERAS ATELIER',
  },
]

const taxonomyStore = useTaxonomyStore()

const displayBrands = computed(() => {
  const featured = taxonomyStore.featuredBrands
  if (featured && featured.length > 0) {
    return featured
  }
  if (taxonomyStore.brands && taxonomyStore.brands.length > 0) {
    return taxonomyStore.brands
  }
  return defaultBrands
})
</script>

<template>
  <section class="border-y border-sand/60 bg-sand/20 py-6 sm:py-8 overflow-hidden select-none">
    <div class="w-full">
      <Swiper
        :modules="[Autoplay, FreeMode]"
        :slides-per-view="'auto'"
        :space-between="48"
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
        <!-- تکرار برای ایجاد چرخش پیوسته و روان در تمامی رزولوشن‌ها -->
        <SwiperSlide
          v-for="(brand, idx) in [...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands]"
          :key="`${brand.slug}-${idx}`"
          class="!w-auto flex items-center"
        >
          <NuxtLink
            :to="'/shop?brand=' + brand.slug"
            class="px-6 sm:px-10 py-2.5 text-ink/45 hover:text-ink opacity-70 hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
            :title="`مشاهده کالکشن ${brand.name}`"
          >
            <!-- ۱. لوگوتایپ توتِم استکهلم -->
            <svg
              v-if="brand.slug === 'toteme'"
              viewBox="0 0 135 36"
              class="h-6 sm:h-7 w-auto fill-current"
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

            <!-- ۲. لوگوتایپ ماسیمو دوتی میلان -->
            <svg
              v-else-if="brand.slug === 'massimo-dutti'"
              viewBox="0 0 165 36"
              class="h-6 sm:h-7 w-auto fill-current"
              aria-hidden="true"
            >
              <text x="2" y="24" font-family="'Times New Roman', serif" font-size="16" font-weight="600" letter-spacing="1.5" fill="currentColor">Massimo Dutti</text>
            </svg>

            <!-- ۳. لوگوتایپ کاس لندن -->
            <svg
              v-else-if="brand.slug === 'cos'"
              viewBox="0 0 85 36"
              class="h-6 sm:h-7 w-auto fill-current"
              aria-hidden="true"
            >
              <text x="2" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="25" font-weight="900" letter-spacing="4" fill="currentColor">COS</text>
            </svg>

            <!-- ۴. لوگوتایپ زارا اسپانیا -->
            <svg
              v-else-if="brand.slug === 'zara'"
              viewBox="0 0 105 36"
              class="h-6 sm:h-7 w-auto fill-current"
              aria-hidden="true"
            >
              <text x="2" y="26" font-family="serif" font-size="25" font-weight="900" letter-spacing="-1.5" fill="currentColor">ZARA</text>
            </svg>

            <!-- ۵. لوگوتایپ منگو بارسلونا -->
            <svg
              v-else-if="brand.slug === 'mango'"
              viewBox="0 0 115 36"
              class="h-6 sm:h-7 w-auto fill-current"
              aria-hidden="true"
            >
              <text x="2" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="4.5" fill="currentColor">MANGO</text>
            </svg>

            <!-- ۶. لوگوتایپ کراس آتلیه -->
            <svg
              v-else-if="brand.slug === 'keras-atelier'"
              viewBox="0 0 150 36"
              class="h-6 sm:h-7 w-auto fill-current"
              aria-hidden="true"
            >
              <path d="M10 4 L18 18 L10 32 L2 18 Z" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M10 9 L15 18 L10 27 L5 18 Z" fill="currentColor" opacity="0.3" />
              <text x="28" y="21" font-family="serif" font-size="16" font-weight="700" letter-spacing="3" fill="currentColor">KERAS</text>
              <text x="29" y="32" font-family="sans-serif" font-size="7.5" font-weight="600" letter-spacing="4" fill="currentColor" opacity="0.75">ATELIER</text>
            </svg>

            <!-- فال‌بک برندهای سفارشی ایجاد شده در ادمین -->
            <span
              v-else
              class="text-sm sm:text-base font-serif font-black tracking-widest uppercase text-ink"
            >
              {{ brand.name }}
            </span>
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
