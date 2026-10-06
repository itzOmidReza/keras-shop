<!-- frontend/app/pages/journal/[slug].vue -->
<script setup lang="ts">
import { Clock, Calendar, ArrowRight, Share2, BookOpen } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useJournalArticles } from '~/composables/journal/useJournalArticles'
import JournalShopTheStory from '~/components/journal/JournalShopTheStory.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { getArticleBySlug } = useJournalArticles()

const article = computed(() => getArticleBySlug(slug.value))

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'مقاله مورد نظر در ژورنال کراس یافت نشد.',
  })
}

useSeoMeta({
  title: () => `${article.value?.title || 'مقاله'} | ژورنال ادیتوریال کراس`,
  description: () => article.value?.excerpt || '',
  ogImage: () => article.value?.coverImage,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'صفحه اصلی', item: '/' },
      { name: 'ژورنال', item: '/journal' },
      { name: article.value?.title || '', item: `/journal/${slug.value}` },
    ],
  }),
  defineArticle({
    headline: article.value?.title,
    description: article.value?.excerpt,
    image: article.value?.coverImage,
    datePublished: article.value?.date,
    author: {
      name: article.value?.author?.name,
      jobTitle: article.value?.author?.role,
    },
  }),
])

// نوار پیشرفت مطالعه بالای صفحه
const scrollPercent = ref(0)

const updateScroll = () => {
  if (import.meta.client) {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0) {
      scrollPercent.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScroll, { passive: true })
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', updateScroll)
  }
})

const handleShare = async () => {
  if (import.meta.client) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.value?.title,
          text: article.value?.excerpt,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('پیوند مقاله در حافظه کپی شد.')
      }
    } catch {
      // اشتراک‌گذاری توسط کاربر لغو شد
    }
  }
}
</script>

<template>
  <div v-if="article" class="min-h-screen bg-paper text-ink pb-24 font-sans selection:bg-rose/20 selection:text-ink relative" dir="rtl">
    <!-- نوار افقی پیشرفت مطالعه در بالاترین لایه (Sticky Reading Progress Bar) -->
    <div
      class="fixed top-0 start-0 h-1 bg-rose z-50 transition-all duration-75"
      :style="{ width: `${scrollPercent}%` }"
      data-testid="reading-progress-bar"
    />

    <article class="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      <!-- مسیر ناوبری و دکمه بازگشت -->
      <nav class="flex items-center justify-between gap-4 mb-8 text-xs text-ink/60">
        <NuxtLink
          to="/journal"
          class="inline-flex items-center gap-1.5 font-bold text-ink hover:text-rose transition-colors py-1"
          data-testid="back-to-journal-link"
        >
          <ArrowRight class="w-4 h-4" />
          <span>بازگشت به ژورنال</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2 rounded-full hover:bg-sand/50 text-ink/70 hover:text-ink transition-colors cursor-pointer"
            title="اشتراک‌گذاری مقاله"
            @click="handleShare"
          >
            <Share2 class="w-4 h-4" />
          </button>
        </div>
      </nav>

      <!-- هدر مقاله -->
      <header class="space-y-4 sm:space-y-6 mb-10 text-center sm:text-start">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-sand text-ink">
            {{ article.categoryLabel }}
          </span>
          <span class="inline-flex items-center gap-1 text-xs text-ink/70 font-mono">
            <Clock class="w-3.5 h-3.5 text-rose" />
            {{ article.readTime }}
          </span>
          <span class="text-ink/30">•</span>
          <span class="inline-flex items-center gap-1 text-xs text-ink/70">
            <Calendar class="w-3.5 h-3.5" />
            {{ article.date }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black font-sans leading-tight sm:leading-tight text-ink">
          {{ article.title }}
        </h1>

        <!-- مشخصات نویسنده -->
        <div class="flex items-center justify-center sm:justify-start gap-3.5 pt-2">
          <img
            v-if="article.author.avatar"
            :src="article.author.avatar"
            :alt="article.author.name"
            class="w-11 h-11 rounded-full object-cover ring-2 ring-sand"
          >
          <div class="text-start">
            <span class="text-sm font-bold text-ink block leading-snug">{{ article.author.name }}</span>
            <span class="text-xs text-ink/60 block">{{ article.author.role }}</span>
          </div>
        </div>
      </header>

      <!-- تصویر کاور اصلی ادیتوریال -->
      <figure class="my-8 sm:my-12 overflow-hidden rounded-3xl bg-sand/20 shadow-md">
        <img
          :src="article.coverImage"
          :alt="article.title"
          class="w-full h-[320px] sm:h-[460px] lg:h-[540px] object-cover object-center"
        >
      </figure>

      <!-- بدنه اصلی مقاله با تایپوگرافی شکیل و خطوط فاخر -->
      <div class="max-w-3xl mx-auto space-y-8 font-sans">
        <!-- کادر چکیده و جمع‌بندی اولیه -->
        <div class="p-6 sm:p-7 rounded-2xl bg-sand/30 border-s-4 border-rose text-ink/85 font-medium leading-loose text-sm sm:text-base">
          {{ article.excerpt }}
        </div>

        <!-- بخش‌های محتوا -->
        <div v-for="(section, idx) in article.sections" :key="idx" class="space-y-6">
          <h2 v-if="section.heading" class="text-xl sm:text-2xl font-black font-sans text-ink pt-4">
            {{ section.heading }}
          </h2>

          <p class="text-base sm:text-lg leading-loose text-ink/90 text-justify">
            {{ section.content }}
          </p>

          <!-- نقل‌قول کشیده (Pull-Quote) -->
          <blockquote
            v-if="section.pullQuote"
            class="border-s-4 border-rose ps-6 pe-4 py-4 my-8 bg-sand/20 rounded-e-2xl italic font-bold text-lg sm:text-xl text-ink leading-relaxed"
          >
            {{ section.pullQuote }}
          </blockquote>

          <!-- تصویر درون‌متنی شکسته (Image Break) -->
          <figure v-if="section.image" class="my-8 overflow-hidden rounded-2xl bg-sand/20">
            <img
              :src="section.image"
              :alt="section.imageCaption || section.heading || 'تصویر درون مقاله'"
              class="w-full h-[280px] sm:h-[400px] object-cover object-center"
              loading="lazy"
            >
            <figcaption v-if="section.imageCaption" class="p-3 text-center text-xs text-ink/60 font-sans">
              {{ section.imageCaption }}
            </figcaption>
          </figure>
        </div>
      </div>

      <!-- ویجت «خرید محصولات این استایل» (Shop the Story) -->
      <JournalShopTheStory
        v-if="article.linkedProducts && article.linkedProducts.length > 0"
        :products="article.linkedProducts"
      />

      <!-- پیوند بازگشت به انتهای مقاله -->
      <footer class="mt-16 pt-8 border-t border-sand/60 flex items-center justify-between text-xs sm:text-sm font-bold text-ink">
        <NuxtLink to="/journal" class="inline-flex items-center gap-2 hover:text-rose transition-colors">
          <BookOpen class="w-4 h-4 text-rose" />
          <span>مشاهده سایر روایات ژورنال</span>
        </NuxtLink>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-ink/60 hover:text-ink cursor-pointer"
          @click="handleShare"
        >
          <Share2 class="w-4 h-4" />
          <span>اشتراک‌گذاری</span>
        </button>
      </footer>
    </article>
  </div>
</template>
