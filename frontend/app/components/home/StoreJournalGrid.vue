<!-- frontend/app/components/home/StoreJournalGrid.vue -->
<script setup lang="ts">
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowLeft,
  Sparkles,
} from '@lucide/vue'
import type { JournalArticle } from '~/types/domain'

const { publishedArticles, fetchArticles } = useJournalArticles()

const { data: homeArticles } = await useAsyncData(
  'home-journal-articles',
  async () => {
    await fetchArticles()
    return publishedArticles.value.slice(0, 3)
  },
)

const articles = computed<JournalArticle[]>(() => {
  if (homeArticles.value && homeArticles.value.length > 0) {
    return homeArticles.value
  }
  return publishedArticles.value.slice(0, 3)
})

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'style-guide':
      return 'bg-rose/10 text-rose'
    case 'fabric-care':
      return 'bg-sage/10 text-sage'
    case 'drop-story':
      return 'bg-sand/80 text-ink'
    default:
      return 'bg-sand/70 text-ink'
  }
}
</script>

<template>
  <section v-if="articles.length > 0" class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-8 sm:space-y-10">
      <!-- هدر بخش ژورنال ادیتوریال با تیتر و پیوند آرشیو -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <BookOpen class="w-3.5 h-3.5" />
            <span>ژورنال و ادیتوریال مد کراس</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            روایت پارچه‌ها و هنر استایلینگ پاییز ۱۴۰۵
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            کاوش در فلسفه بافت‌های ارگانیک، راهنمای استایل چندلایه و ناگفته‌های مراقبت از الیاف ناب پاییزی.
          </p>
        </div>

        <NuxtLink
          to="/journal"
          class="text-xs sm:text-sm font-bold text-rose hover:text-ink transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>مشاهده همه یادداشت‌های ژورنال</span>
          <ArrowLeft class="w-4 h-4" />
        </NuxtLink>
      </div>

      <!-- شبکه ۳ ستونه کارت‌های ژورنال با طراحی ادیتوریال -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="group rounded-3xl border border-sand/70 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- تصویر شاخص مقاله با زوم روان هاور -->
            <NuxtLink :to="`/journal/${article.slug}`" class="block relative overflow-hidden rounded-2xl aspect-[16/10] bg-sand/30 mb-4">
              <img
                :src="article.coverImage"
                :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              >

              <!-- برچسب دسته‌بندی روی تصویر -->
              <span
                class="absolute top-3 end-3 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-2xs"
                :class="getCategoryColor(article.category)"
              >
                {{ article.categoryLabel }}
              </span>
            </NuxtLink>

            <!-- متادیتای تاریخ و زمان مطالعه -->
            <div class="flex items-center gap-3 text-[11px] text-muted-foreground mb-2.5">
              <div class="flex items-center gap-1">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ article.date }}</span>
              </div>
              <span class="w-1 h-1 rounded-full bg-sand" />
              <div class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5" />
                <span>{{ article.readTime }} مطالعه</span>
              </div>
            </div>

            <!-- عنوان مقاله -->
            <h3 class="text-base sm:text-lg font-bold text-ink group-hover:text-rose transition-colors leading-snug mb-2 text-start">
              <NuxtLink :to="`/journal/${article.slug}`">
                {{ article.title }}
              </NuxtLink>
            </h3>

            <!-- چکیده متن -->
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 text-start">
              {{ article.excerpt }}
            </p>
          </div>

          <!-- دکمه ادامه مطالعه در انتهای کارت -->
          <div class="pt-4 mt-4 border-t border-sand/50 flex items-center justify-between">
            <span class="text-[11px] text-muted-foreground/80 flex items-center gap-1">
              <Sparkles class="w-3 h-3 text-rose" />
              <span>ادیتوریال کراس</span>
            </span>

            <NuxtLink
              :to="`/journal/${article.slug}`"
              class="text-xs font-bold text-ink group-hover:text-rose transition-colors inline-flex items-center gap-1"
            >
              <span>ادامه مطالعه</span>
              <ArrowLeft class="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
