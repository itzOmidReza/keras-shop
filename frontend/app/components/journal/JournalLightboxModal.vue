<script setup lang="ts">
import { X, ExternalLink } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import type { LookbookItem } from '~/composables/journal/useJournalLookbook'

defineProps<{
  item: LookbookItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="item"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-4xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        dir="rtl"
      >
        <!-- دکمه بستن -->
        <button
          type="button"
          class="absolute top-4 inset-e-4 z-10 w-9 h-9 rounded-full bg-white/90 text-ink hover:bg-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
          aria-label="بستن"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- تصویر بزرگ -->
        <div class="md:w-3/5 bg-sand/20 aspect-4/5 md:aspect-auto overflow-hidden">
          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover object-center"
          />
        </div>

        <!-- توضیحات و محصول -->
        <div class="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
          <div class="space-y-4">
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-sand/50 text-ink">
              {{ item.collectionTitle }}
            </span>

            <h3 class="text-xl font-bold text-ink">
              {{ item.title }}
            </h3>

            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ item.description }}
            </p>

            <div class="rounded-2xl bg-sand/20 p-4 border border-sand/60 space-y-2 text-xs">
              <div class="flex justify-between text-muted-foreground">
                <span>لوکیشن عکاسی:</span>
                <span class="font-bold text-ink">{{ item.location }}</span>
              </div>
              <div class="flex justify-between text-muted-foreground">
                <span>عکاس:</span>
                <span class="font-bold text-ink">{{ item.credits.photographer }}</span>
              </div>
              <div class="flex justify-between text-muted-foreground">
                <span>استایلیست:</span>
                <span class="font-bold text-ink">{{ item.credits.stylist }}</span>
              </div>
            </div>
          </div>

          <!-- کارت محصول -->
          <div class="rounded-2xl border border-rose/30 bg-rose/5 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-ink">{{ item.featuredProduct.title }}</span>
              <span class="text-xs font-bold font-mono text-rose">{{ formatToman(item.featuredProduct.price) }}</span>
            </div>

            <NuxtLink
              :to="`/products/${item.featuredProduct.slug}`"
              class="w-full py-2.5 px-4 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
              @click="emit('close')"
            >
              <span>مشاهده و افزودن به سبد خرید</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
