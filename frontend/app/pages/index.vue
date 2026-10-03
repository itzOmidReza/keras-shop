<!-- frontend/app/pages/index.vue -->
<script setup lang="ts">
import { siteConfig } from '~/data'
import HeroPromoBanner from '~/components/home/HeroPromoBanner.vue'
import CategoryStories from '~/components/home/CategoryStories.vue'
import FlashDealsRow from '~/components/home/FlashDealsRow.vue'
import SeasonalShowcaseGrid from '~/components/home/SeasonalShowcaseGrid.vue'
import ShopTheLook from '~/components/home/ShopTheLook.vue'
import CatalogDiscoveryTabs from '~/components/home/CatalogDiscoveryTabs.vue'
import StorefrontTrustBar from '~/components/home/StorefrontTrustBar.vue'

useSeoMeta({
  title: `${siteConfig.name} | خانه مد و اکسسوری لایف‌استایل چهارفصل`,
  description: 'فروشگاه تخصصی پوشاک چهارفصل و اکسسوری‌های دست‌ساز کراس؛ تلفیق وقار، سادگی و لطافت منسوجات طبیعی لینن، کشمیر و پشم مرینوس.',
  ogTitle: `${siteConfig.name} | خانه مد و اکسسوری لایف‌استایل چهارفصل`,
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
  <div class="space-y-6 sm:space-y-10 pb-16 overflow-hidden">
    <!-- بخش ۱: هیرو ادیتوریال و انگیزاننده فوری خرید (Hero & Immediate Incentive) -->
    <HeroPromoBanner />

    <!-- بخش ۲: استوری‌های دایره‌ای دسته‌بندی با اسنپ اسکرول (Category Stories) -->
    <CategoryStories />

    <!-- بخش ۳: حراج شتابان و دسترسی سریع به سایزها (Flash Sale with Quick-Add) -->
    <FlashDealsRow :products="featuredProducts || []" />

    <!-- بخش ۴: ویترین کالکشن‌های چهارفصل و مانیفست استایل (Seasonal Showcase Grid) -->
    <SeasonalShowcaseGrid />

    <!-- بخش ۵: استایل تن مدل با هات‌اسپات‌های تعاملی و تخفیف باندل (Shop The Look) -->
    <ShopTheLook />

    <!-- بخش ۶: تب‌های کاتالوگ هوشمند (Catalog Discovery Tabs) -->
    <CatalogDiscoveryTabs :initial-products="featuredProducts || []" />

    <!-- بخش ۷: شاخص‌های اعتماد، ضمانت تعویض و ارسال (Storefront Trust Bar) -->
    <StorefrontTrustBar />
  </div>
</template>
