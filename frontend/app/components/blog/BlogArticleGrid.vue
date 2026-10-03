<script setup lang="ts">
import { Clock, ArrowLeft } from '@lucide/vue'
import type { Article } from '~/composables/blog/useBlogArticles'

defineProps<{
  articles: Article[]
}>()

const emit = defineEmits<{
  (e: 'select', article: Article): void
  (e: 'resetFilters'): void
}>()
</script>

<template>
  <main class="container mx-auto max-w-6xl px-4 py-8">
    <div v-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="article in articles"
        :key="article.id"
        class="rounded-3xl border border-sand/70 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
        @click="emit('select', article)"
      >
        <div>
          <div class="aspect-16/10 overflow-hidden bg-sand/30">
            <NuxtImg
              :src="article.image"
              :alt="article.title"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div class="p-6 space-y-3">
            <div class="flex items-center justify-between text-[10px]">
              <span class="font-bold px-2.5 py-0.5 rounded-full bg-sand/50 text-ink">
                {{ article.categoryLabel }}
              </span>
              <span class="text-muted-foreground flex items-center gap-1">
                <Clock class="w-3 h-3 text-sage" />
                {{ article.readTime }}
              </span>
            </div>

            <h3 class="text-base font-bold text-ink group-hover:text-rose transition-colors leading-snug">
              {{ article.title }}
            </h3>

            <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {{ article.excerpt }}
            </p>
          </div>
        </div>

        <div class="p-6 pt-0 border-t border-sand/40 flex items-center justify-between text-[11px] text-muted-foreground">
          <span class="font-medium text-ink">{{ article.author.name }}</span>
          <span class="text-rose font-bold flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform">
            مطالعه مقاله
            <ArrowLeft class="w-3 h-3" />
          </span>
        </div>
      </article>
    </div>

    <!-- وضعیت عدم یافت مقاله -->
    <div v-else class="text-center py-16 space-y-3">
      <p class="text-base font-bold text-ink">
        مقاله‌ای مطابق با جست‌وجوی شما یافت نشد.
      </p>
      <button
        type="button"
        class="text-xs font-bold text-rose hover:underline cursor-pointer"
        @click="emit('resetFilters')"
      >
        پاک کردن فیلترها و مشاهده همه مقالات
      </button>
    </div>
  </main>
</template>
