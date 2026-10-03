<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
import { siteConfig } from '~/data'
import HeroBoutique from '~/components/home/HeroBoutique.vue'
import BentoCategoryGrid from '~/components/home/BentoCategoryGrid.vue'
import FlashDealsCarousel from '~/components/home/FlashDealsCarousel.vue'
import PromoBannerOne from '~/components/home/PromoBannerOne.vue'
import ShopTheLookSlider from '~/components/home/ShopTheLookSlider.vue'
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

    <!-- بخش ۲: شبکه بنتو دسته‌بندی‌های بصری (Visual Bento Category Grid) -->
    <BentoCategoryGrid />

    <!-- بخش ۳: کاروسل تک‌ردیفه حراج شتابان با تایمر زنده (Single-Row Flash Deals Carousel) -->
    <FlashDealsCarousel :products="featuredProducts || []" />

    <!-- بخش ۴: بنر کمپین ویژه تخفیف ۱۵٪ اولین خرید (Mid-Page Campaign Banner 1) -->
    <PromoBannerOne />

    <!-- بخش ۵: کاروسل سوایپ‌پذیر استایل تن مدل با هات‌اسپات (Swipeable Shop-The-Look Slider) -->
    <ShopTheLookSlider />

    <!-- بخش ۶: کاروسل ترندهای برتر سال با فیلترهای تب (Trending Products Carousel) -->
    <TrendingCarousel :products="featuredProducts || []" />

    <!-- بخش ۷: بنر لوک‌بوک استاندارد الیاف و دوخت (Mid-Page Lookbook Banner 2) -->
    <PromoBannerTwo />

    <!-- بخش ۸: نوار شاخص‌های اعتماد و ضمانت خرید (Footer Trust Guarantee Bar) -->
    <StorefrontTrustBar />
  </div>
</template>
