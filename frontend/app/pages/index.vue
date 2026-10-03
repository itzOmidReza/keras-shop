<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
import { siteConfig } from '~/data'
import HeroPromoBanner from '~/components/home/HeroPromoBanner.vue'
import CategoryStories from '~/components/home/CategoryStories.vue'
import FlashDealsRow from '~/components/home/FlashDealsRow.vue'
import ShopByActivity from '~/components/home/ShopByActivity.vue'
import ShopTheLook from '~/components/home/ShopTheLook.vue'
import CatalogDiscoveryTabs from '~/components/home/CatalogDiscoveryTabs.vue'
import StorefrontTrustBar from '~/components/home/StorefrontTrustBar.vue'

useSeoMeta({
  title: `${siteConfig.name} | پوشاک ورزشی تخصصی و طراحی مینیمال`,
  description: 'فروشگاه تخصصی پوشاک ورزشی و اتلژر کراس؛ بافت‌های فشرده‌ساز ۳۰۰ گرمی ضد دید، فناوری بدون درز و حس پوست دوم.',
  ogTitle: `${siteConfig.name} | پوشاک ورزشی تخصصی و طراحی مینیمال`,
  ogDescription: 'فروشگاه تخصصی پوشاک ورزشی و اتلژر کراس؛ بافت‌های فشرده‌ساز ۳۰۰ گرمی ضد دید، فناوری بدون درز و حس پوست دوم.',
})

const { getProducts } = useProducts()

// دریافت محصولات برگزیده و کاتالوگ با کش SWR از لایه Mock API
const { data: featuredProducts } = await useAsyncData(
  'home-featured-products',
  () => getProducts(),
)
</script>

<template>
  <div class="space-y-6 sm:space-y-10 pb-16 overflow-hidden">
    <!-- بخش ۱: هیرو ادیتوریال و انگیزاننده فوری خرید (Hero & Immediate Incentive) -->
    <HeroPromoBanner />

    <!-- بخش ۲: استوری‌های دایره‌ای دسته‌بندی با اسنپ اسکرول (Category Stories) -->
    <CategoryStories />

    <!-- بخش ۳: حراج شتابان و دسترسی سریع به سایزها (Flash Sale with Quick-Add) -->
    <FlashDealsRow :products="featuredProducts || []" />

    <!-- بخش ۴: انتخاب بر اساس فعالیت فیزیولوژیک و نوع تمرین (Shop By Activity) -->
    <ShopByActivity />

    <!-- بخش ۵: استایل تن مدل با هات‌اسپات‌های تعاملی و تخفیف باندل (Shop The Look) -->
    <ShopTheLook />

    <!-- بخش ۶: تب‌های کاتالوگ هوشمند (Catalog Discovery Tabs) -->
    <CatalogDiscoveryTabs :initial-products="featuredProducts || []" />

    <!-- بخش ۷: شاخص‌های اعتماد، ضمانت تعویض و ارسال (Storefront Trust Bar) -->
    <StorefrontTrustBar />
  </div>
</template>
