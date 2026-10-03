<script setup lang="ts">
import { X, CheckCircle2 } from '@lucide/vue'
import type { Article } from '~/composables/blog/useBlogArticles'

defineProps<{
  article: Article | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="article"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-3xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto space-y-6"
        dir="rtl"
      >
        <!-- هدر مدال -->
        <div class="flex items-center justify-between border-b border-sand/60 pb-4">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-sand/50 text-ink">
            {{ article.categoryLabel }}
          </span>

          <button
            type="button"
            class="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 flex items-center justify-center text-ink transition-colors cursor-pointer"
            aria-label="بستن"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-3">
          <h2 class="text-xl sm:text-2xl font-bold text-ink leading-snug">
            {{ article.title }}
          </h2>

          <div class="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span>نویسنده: {{ article.author.name }} ({{ article.author.role }})</span>
            <span>•</span>
            <span>زمان مطالعه: {{ article.readTime }}</span>
            <span>•</span>
            <span>تاریخ: {{ article.date }}</span>
          </div>
        </div>

        <div class="aspect-16/9 rounded-2xl overflow-hidden bg-sand/30">
          <NuxtImg
            :src="article.image"
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- بدنه متن -->
        <div class="space-y-4 text-xs sm:text-sm text-ink/90 leading-relaxed">
          <p v-for="(p, pIdx) in article.content" :key="pIdx">
            {{ p }}
          </p>
        </div>

        <!-- نکات کلیدی مقاله -->
        <div class="rounded-2xl border border-sage/40 bg-sage/10 p-5 space-y-3">
          <div class="text-xs font-bold text-sage flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4" />
            <span>نکات کلیدی و جمع‌بندی کاربردی:</span>
          </div>
          <ul class="space-y-1.5 text-xs text-muted-foreground">
            <li v-for="(k, kIdx) in article.keyTakeaways" :key="kIdx" class="flex items-start gap-2">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 mt-1.5" />
              <span>{{ k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>
