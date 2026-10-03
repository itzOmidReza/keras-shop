<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import type { JournalCollectionFilter } from '~/composables/journal/useJournalLookbook'

const activeCollection = defineModel<JournalCollectionFilter>('activeCollection', { default: 'all' })
</script>

<template>
  <section class="border-b border-sand/70 bg-sand/20 py-16 lg:py-24 px-4 text-center">
    <div class="container mx-auto max-w-4xl space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5 text-rose" />
        <span>ژورنال کراس • نسخه پاییز و زمستان ۱۴۰۵</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-ink">
        روایت فرم، حرکت و سکوت
      </h1>

      <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        کاوشی تصویری در پیوند الیاف فنی با هندسه بدن انسان. لوک‌بوک فصلی کراس تجسم زیبایی‌شناسی مینیمال و تعهد تزلزل‌ناپذیر به عملکرد ورزشی است.
      </p>

      <!-- فیلترهای کالکشن -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-6">
        <button
          type="button"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
          :class="[
            activeCollection === 'all'
              ? 'bg-ink text-white border-ink shadow-xs'
              : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
          ]"
          @click="activeCollection = 'all'"
        >
          همه فریم‌ها
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
          :class="[
            activeCollection === 'calm'
              ? 'bg-sage text-white border-sage shadow-xs'
              : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
          ]"
          @click="activeCollection = 'calm'"
        >
          کالکشن آرامش (Calm)
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
          :class="[
            activeCollection === 'move'
              ? 'bg-rose text-white border-rose shadow-xs'
              : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
          ]"
          @click="activeCollection = 'move'"
        >
          پرفورمنس حرکت (Move)
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border"
          :class="[
            activeCollection === 'city'
              ? 'bg-sand text-ink border-sand shadow-xs'
              : 'bg-white text-muted-foreground border-sand hover:border-sand/80 hover:text-ink',
          ]"
          @click="activeCollection = 'city'"
        >
          استایل روزمره شهری
        </button>
      </div>
    </div>
  </section>
</template>
