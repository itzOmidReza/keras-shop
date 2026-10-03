<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
import { siteConfig } from '~/data'
import HeroBoutique from '~/components/home/HeroBoutique.vue'
import FlashDealsCarousel from '~/components/home/FlashDealsCarousel.vue'
import BentoCategoryGrid from '~/components/home/BentoCategoryGrid.vue'
import AccessoriesCarousel from '~/components/home/AccessoriesCarousel.vue'
import TrendingCarousel from '~/components/home/TrendingCarousel.vue'
import ShopTheLookSlider from '~/components/home/ShopTheLookSlider.vue'
import BrandLogosMarquee from '~/components/home/BrandLogosMarquee.vue'
import StoreJournalGrid from '~/components/home/StoreJournalGrid.vue'
import StorefrontTrustBar from '~/components/home/StorefrontTrustBar.vue'

useSeoMeta({
  title: `${siteConfig.name} | خانه مد و اکسسوری لایف‌استایل پاییز ۱۴۰۵`,
  description: 'فروشگاه تخصصی پوشاک چهارفصل و اکسسوری‌های دست‌ساز کراس؛ تلفیق وقار، سادگی و لطافت منسوجات طبیعی لینن، کشمیر و پشم مرینوس.',
  ogTitle: `${siteConfig.name} | خانه مد و اکسسوری لایف‌استایل پاییز ۱۴۰۵`,
  ogDescription: 'فروشگاه تخصصی پوشاک چهارفصل و اکسسوری‌های دست‌ساز کراس؛ تلفیق وقار، سادگی و لطافت منسوجات طبیعی لینن، کشمیر و پشم مرینوس.',
})

const { getProducts } = useProducts()

// دریافت محصولات برگزیده و کاتالوگ با کش SWR از لایه Mock API
const { data: featuredProducts } = await useAsyncData(
  'home-featured-products',
  () => getProducts(),
)
</script>

<template>
  <div class="space-y-16 lg:space-y-24 pb-16 overflow-hidden">
    <!-- بخش ۱: هیرو ادیتوریال بوتیک با سوشال پروف و نوار اعتماد (Hero Boutique) -->
    <HeroBoutique />

    <!-- بخش ۲: کاروسل تک‌ردیفه روان تخفیف‌های شتابان با Swiper.js (Flash Deals Carousel) — ایجاد تنفس بصری بین هیرو و بنتو -->
    <FlashDealsCarousel :products="featuredProducts || []" />

    <!-- بخش ۳: شبکه بنتو دسته‌بندی‌های بصری کالکشن (Visual Bento Category Grid) -->
    <BentoCategoryGrid />

    <!-- بخش ۴: کاروسل اختصاصی اکسسوری و شال پاییزه (Dedicated Accessories Carousel) — جایگاه ارتقایافته در میانه بالا -->
    <AccessoriesCarousel :products="featuredProducts || []" />

    <!-- بخش ۵: کاروسل ترندهای برتر سال با فیلترهای تب (Trending Products Carousel) -->
    <TrendingCarousel :products="featuredProducts || []" />

    <!-- بخش ۶: اسلایدر اتوپلی لوک‌های تن مدل با هات‌اسپات‌های تعاملی (Shop-The-Look Slider) -->
    <ShopTheLookSlider />

    <!-- بخش ۷: مارکی بی‌نهایت لوگوتایپ‌های مونوکروم برندهای همکار با فیلتر اختصاصی کاتالوگ (Brand Logos Marquee) -->
    <BrandLogosMarquee />

    <!-- بخش ۸: شبکه ۳ ستونه مجله و ژورنال ادیتوریال مد (Editorial Store Journal Grid) -->
    <StoreJournalGrid />

    <!-- بخش ۹: نوار شاخص‌های اعتماد و ضمانت خرید (Footer Trust Guarantee Bar) -->
    <StorefrontTrustBar />
  </div>
</template>
