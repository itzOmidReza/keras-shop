<!-- frontend/app/components/home/BrandLogosMarquee.vue -->
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Award, ShieldCheck, Sparkles, Feather, Leaf } from '@lucide/vue'

const partners = [
  {
    name: 'VOGUE SCANDINAVIA',
    subtitle: 'ادیتوریال استایل لایف‌استایل',
    icon: Sparkles,
  },
  {
    name: 'LORO PIANA MILLS',
    subtitle: 'تامین پشم مرینوس و کشمیر',
    icon: Feather,
  },
  {
    name: 'OEKO-TEX® 100',
    subtitle: 'استاندارد جهانی سلامت الیاف',
    icon: ShieldCheck,
  },
  {
    name: 'GOTS CERTIFIED',
    subtitle: 'لینن و نخ‌پنبه ارگانیک',
    icon: Leaf,
  },
  {
    name: 'KERAS ATELIER',
    subtitle: 'آتلیه طراحی پاییز و زمستان ۱۴۰۵',
    icon: Award,
  },
  {
    name: 'MILANO TESSUTI',
    subtitle: 'منسوجات دست‌بافت با کیفیت',
    icon: Sparkles,
  },
]
</script>

<template>
  <section class="border-y border-sand/60 bg-sand/15 py-4 sm:py-5 overflow-hidden select-none">
    <div class="container mx-auto px-4">
      <Swiper
        :modules="[Autoplay, FreeMode]"
        :slides-per-view="'auto'"
        :space-between="32"
        :loop="true"
        :free-mode="true"
        :speed="6000"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        dir="rtl"
        class="marquee-swiper w-full !ease-linear"
      >
        <!-- تکرار برای پیوستگی بی‌نهایت در رزولوشن‌های عریض -->
        <SwiperSlide
          v-for="(partner, idx) in [...partners, ...partners]"
          :key="`${partner.name}-${idx}`"
          class="!w-auto flex items-center"
        >
          <div class="group flex items-center gap-3 px-3 py-1 rounded-full hover:bg-sand/30 transition-colors cursor-default">
            <div class="w-7 h-7 rounded-full bg-sand/50 text-muted-foreground group-hover:text-rose group-hover:bg-rose/10 flex items-center justify-center shrink-0 transition-colors">
              <component :is="partner.icon" class="w-3.5 h-3.5" />
            </div>

            <div class="flex flex-col text-start">
              <span class="font-mono text-xs font-bold tracking-wider text-muted-foreground group-hover:text-ink transition-colors uppercase">
                {{ partner.name }}
              </span>
              <span class="text-[10px] text-muted-foreground/80 font-medium">
                {{ partner.subtitle }}
              </span>
            </div>

            <!-- جداکننده ظریف بین برندها -->
            <span class="ms-4 w-1 h-1 rounded-full bg-sand/80 shrink-0" />
          </div>
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
