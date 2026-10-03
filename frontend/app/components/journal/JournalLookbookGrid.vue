<script setup lang="ts">
import { Maximize2, Camera, ArrowLeft } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import type { LookbookItem } from '~/composables/journal/useJournalLookbook'

defineProps<{
  items: LookbookItem[]
}>()

const emit = defineEmits<{
  (e: 'select', item: LookbookItem): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <article
      v-for="item in items"
      :key="item.id"
      class="group rounded-3xl border border-sand/70 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <!-- ظرف تصویر با هاور و دکمه لایت‌باکس -->
      <div class="relative overflow-hidden aspect-4/5 bg-sand/30 cursor-pointer" @click="emit('select', item)">
        <NuxtImg
          :src="item.image"
          :alt="item.title"
          loading="lazy"
          class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        <!-- نشانگر کالکشن -->
        <div class="absolute inset-s-4 top-4">
          <span
            class="text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-xs"
            :class="[
              item.collection === 'calm'
                ? 'bg-white/90 text-sage'
                : item.collection === 'move'
                  ? 'bg-rose text-white'
                  : 'bg-ink text-white',
            ]"
          >
            {{ item.collectionTitle }}
          </span>
        </div>

        <!-- دکمه بزرگ‌نمایی -->
        <button
          type="button"
          class="absolute inset-e-4 bottom-4 w-9 h-9 rounded-full bg-white/90 text-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white cursor-pointer"
          aria-label="مشاهده تصویر کامل"
        >
          <Maximize2 class="w-4 h-4" />
        </button>
      </div>

      <!-- اطلاعات تصویر و یادداشت ادیتوریال -->
      <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] text-muted-foreground">
            <span class="flex items-center gap-1">
              <Camera class="w-3.5 h-3.5 text-rose" />
              {{ item.location }}
            </span>
            <span>عکس: {{ item.credits.photographer }}</span>
          </div>

          <h2 class="text-lg font-bold text-ink group-hover:text-rose transition-colors">
            {{ item.title }}
          </h2>

          <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {{ item.description }}
          </p>
        </div>

        <!-- پیوند به محصول شاخص فریم -->
        <div class="pt-4 border-t border-sand/50 flex items-center justify-between gap-3">
          <div>
            <div class="text-[10px] text-muted-foreground">
              محصول شاخص:
            </div>
            <NuxtLink
              :to="`/products/${item.featuredProduct.slug}`"
              class="text-xs font-bold text-ink hover:text-rose transition-colors truncate block max-w-[180px]"
            >
              {{ item.featuredProduct.title }}
            </NuxtLink>
          </div>

          <div class="text-end shrink-0">
            <div class="text-xs font-bold font-mono text-rose">
              {{ formatToman(item.featuredProduct.price) }}
            </div>
            <NuxtLink
              :to="`/products/${item.featuredProduct.slug}`"
              class="text-[10px] font-bold text-muted-foreground hover:text-ink inline-flex items-center gap-0.5 mt-0.5"
            >
              <span>خرید</span>
              <ArrowLeft class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
