<script setup lang="ts">
import { User, Clock } from '@lucide/vue'
import type { Article } from '~/composables/blog/useBlogArticles'

defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  (e: 'select', article: Article): void
}>()
</script>

<template>
  <section class="container mx-auto max-w-6xl px-4 py-12">
    <div
      class="rounded-3xl border border-sand/80 bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-center cursor-pointer group"
      @click="emit('select', article)"
    >
      <div class="lg:col-span-7 aspect-16/10 lg:aspect-auto h-full overflow-hidden bg-sand/30">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div class="lg:col-span-5 p-6 sm:p-10 space-y-4">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose/10 text-rose">
            مقاله شاخص سردبیر
          </span>
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sand/50 text-ink">
            {{ article.categoryLabel }}
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-bold text-ink group-hover:text-rose transition-colors leading-snug">
          {{ article.title }}
        </h2>

        <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {{ article.excerpt }}
        </p>

        <div class="pt-4 border-t border-sand/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <div class="flex items-center gap-1.5">
            <User class="w-3.5 h-3.5 text-rose" />
            <span>{{ article.author.name }}</span>
          </div>

          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3 text-sage" />
              {{ article.readTime }}
            </span>
            <span>{{ article.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
