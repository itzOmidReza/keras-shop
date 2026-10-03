<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
import { siteConfig } from '~/data'
import HeroBoutique from '~/components/home/HeroBoutique.vue'
import FlashDealsCarousel from '~/components/home/FlashDealsCarousel.vue'
import BentoCategoryGrid from '~/components/home/BentoCategoryGrid.vue'
import ShopTheLookSlider from '~/components/home/ShopTheLookSlider.vue'
import PromoBannerOne from '~/components/home/PromoBannerOne.vue'
import TrendingCarousel from '~/components/home/TrendingCarousel.vue'
import PromoBannerTwo from '~/components/home/PromoBannerTwo.vue'
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
  <div class="space-y-6 sm:space-y-12 pb-16 overflow-hidden">
    <!-- بخش ۱: هیرو ادیتوریال بوتیک با سوشال پروف و نوار اعتماد (Hero Boutique with Social Proof) -->
    <HeroBoutique />

    <!-- بخش ۲: کاروسل تک‌ردیفه روان تخفیف‌های شتابان پاییزه با Swiper.js (Fluid Swiper Flash Deals) -->
    <FlashDealsCarousel :products="featuredProducts || []" />

    <!-- بخش ۳: شبکه بنتو دسته‌بندی‌های بصری کالکشن (Visual Bento Category Grid) -->
    <BentoCategoryGrid />

    <!-- بخش ۴: اسلایدر اتوپلی لوک‌های تن مدل با هات‌اسپات‌های تعاملی (Autoplay Swiper Shop-The-Look) -->
    <ShopTheLookSlider />

    <!-- بخش ۵: نوار باریک ادیتوریال کوپن تخفیف خرید اول (Compact Editorial Promo Ribbon) -->
    <PromoBannerOne />

    <!-- بخش ۶: کاروسل ترندهای برتر سال با فیلترهای تب (Trending Products Carousel with Swiper) -->
    <TrendingCarousel :products="featuredProducts || []" />

    <!-- بخش ۷: بنر لوک‌بوک استاندارد الیاف و دوخت (Mid-Page Lookbook Banner) -->
    <PromoBannerTwo />

    <!-- بخش ۸: نوار شاخص‌های اعتماد و ضمانت خرید (Footer Trust Guarantee Bar) -->
    <StorefrontTrustBar />
  </div>
</template>
