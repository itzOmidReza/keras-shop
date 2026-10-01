<!-- app/pages/index.vue -->
<script setup lang="ts">
import { heroContent, brandPerks, siteConfig } from '~/data'
import { ArrowLeft, Sparkles, Truck, RotateCcw, ShieldCheck } from '@lucide/vue'

useSeoMeta({
  title: `${siteConfig.name} | ${siteConfig.slogan}`,
  description: siteConfig.subSlogan,
})

const { getProducts } = useProducts()

const { data: featuredProducts } = await useAsyncData(
  'home-featured-products',
  () => getProducts({ sort: 'bestseller' }),
)

const perkIcons = {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
}
</script>

<template>
  <div class="space-y-16 lg:space-y-24 pb-16">
    <!-- بخش Hero با داده‌های استاتیک از ~/data -->
    <section class="relative overflow-hidden bg-sand/30 border-b border-sand/60 py-16 sm:py-24">
      <div class="container mx-auto px-4 max-w-5xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 border border-sand shadow-2xs">
          <Sparkles class="h-4 w-4 text-rose" />
          <span class="text-xs font-bold text-ink">{{ heroContent.badge }}</span>
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-tight">
          {{ heroContent.title }}
        </h1>

        <p class="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
          {{ heroContent.subtitle }}
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button as-child size="lg" class="bg-rose text-white hover:bg-rose/90 rounded-xl font-bold h-12 px-6">
            <NuxtLink :to="heroContent.primaryCta.href">
              <span>{{ heroContent.primaryCta.label }}</span>
              <ArrowLeft class="h-4 w-4 me-1 rtl:-scale-x-100" />
            </NuxtLink>
          </Button>

          <Button as-child variant="outline" size="lg" class="border-sand bg-white hover:bg-sand/40 rounded-xl font-bold h-12 px-6 text-ink">
            <NuxtLink :to="heroContent.secondaryCta.href">
              <span>{{ heroContent.secondaryCta.label }}</span>
            </NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- بخش مزایای برند کراس -->
    <section class="container mx-auto px-4 max-w-6xl">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="perk in brandPerks"
          :key="perk.title"
          class="rounded-2xl border border-sand bg-white/60 p-5 text-center space-y-2 shadow-2xs"
        >
          <component
            :is="perkIcons[perk.icon as keyof typeof perkIcons]"
            class="mx-auto h-5 w-5 text-rose"
          />
          <h3 class="text-xs font-bold text-ink">
            {{ perk.title }}
          </h3>
          <p class="text-[11px] text-muted-foreground leading-relaxed">
            {{ perk.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- بخش محصولات برگزیده متصل به Mock Service Layer -->
    <section v-if="featuredProducts && featuredProducts.length > 0" class="container mx-auto px-4 max-w-6xl space-y-8">
      <div class="flex items-end justify-between border-b border-sand pb-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            انتخاب ورزشکاران
          </span>
          <h2 class="text-2xl font-bold text-ink tracking-tight mt-1">
            محبوب‌ترین محصولات کراس
          </h2>
        </div>

        <NuxtLink
          to="/shop"
          class="inline-flex items-center gap-1 text-xs font-bold text-rose hover:underline"
        >
          <span>مشاهده همه</span>
          <span>←</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <ProductCard
          v-for="(product, idx) in featuredProducts.slice(0, 4)"
          :key="product.id"
          :product="product"
          :priority="idx < 2"
        />
      </div>
    </section>
  </div>
</template>
