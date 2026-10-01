<!-- frontend/app/components/product/ProductGallery.vue -->
<script setup lang="ts">
import type { ProductImage } from '~/types/domain'
import { Eye } from '@lucide/vue'

const props = defineProps<{
  images: ProductImage[]
  title: string
  line?: string
}>()

const activeIndex = ref(0)
const currentImage = computed(() => props.images[activeIndex.value]?.url || props.images[0]?.url || '/placeholder.jpg')
</script>

<template>
  <div class="flex flex-col-reverse md:flex-row gap-4">
    <!-- تامب‌نیل‌های عمودی دسکتاپ و افقی موبایل -->
    <div
      v-if="images.length > 1"
      class="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0 scrollbar-none"
    >
      <button
        v-for="(img, idx) in images"
        :key="img.id || idx"
        type="button"
        class="relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-sand/30 shrink-0"
        :class="activeIndex === idx ? 'border-rose ring-2 ring-rose/20' : 'border-transparent opacity-70 hover:opacity-100'"
        @click="activeIndex = idx"
      >
        <NuxtImg
          :src="img.url"
          :alt="img.alt || title"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <span
          v-if="img.kind === 'transparency_test'"
          class="absolute top-1.5 inset-s-1.5 h-2 w-2 rounded-full bg-rose"
        />
      </button>
    </div>

    <!-- تصویر اصلی بزرگ ادیتوریال -->
    <div class="relative flex-1 aspect-3/4 md:aspect-4/5 rounded-2xl overflow-hidden bg-sand/20 border border-sand/60">
      <NuxtImg
        :src="currentImage"
        :alt="title"
        priority
        class="w-full h-full object-cover object-center transition-all duration-300"
      />

      <!-- بج لاین -->
      <span
        v-if="line"
        class="absolute top-4 inset-s-4 bg-paper/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-ink shadow-xs border border-sand/50"
      >
        لاین {{ line.toUpperCase() }}
      </span>

      <!-- برچسب تست شفافیت -->
      <div
        v-if="images[activeIndex]?.kind === 'transparency_test'"
        class="absolute bottom-4 inset-s-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-paper shadow-md backdrop-blur-sm"
      >
        <Eye class="h-4 w-4 text-rose" />
        <span>تست عدم عبور نور (Squat-Proof)</span>
      </div>
    </div>
  </div>
</template>