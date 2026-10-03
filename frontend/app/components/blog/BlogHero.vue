<script setup lang="ts">
import { BookOpen, Search } from '@lucide/vue'
import type { BlogCategoryFilter } from '~/composables/blog/useBlogArticles'

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const activeCategory = defineModel<BlogCategoryFilter>('activeCategory', { default: 'all' })
</script>

<template>
  <section class="border-b border-sand/70 bg-sand/20 py-16 px-4">
    <div class="container mx-auto max-w-5xl text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <BookOpen class="w-4 h-4 text-rose" />
        <span>مرجع علمی استایل ورزشی، تمرین و ریکاوری</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink">
        مجله و دانش‌نامه کراس
      </h1>

      <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        کاوشی عمیق در فیزیولوژی حرکت، مهندسی پیشرفته الیاف ورزشی و روان‌شناسی عملکرد. مقالات نوشته‌شده توسط متخصصین علوم ورزشی و طراحان نساجی کراس.
      </p>

      <!-- نوار جست‌وجو و فیلتر دسته‌بندی -->
      <div class="max-w-2xl mx-auto pt-6 space-y-4">
        <div class="relative">
          <Search class="w-4 h-4 absolute inset-s-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جست‌وجو در عنوان مقالات، مباحث یا نویسندگان..."
            class="w-full rounded-2xl border border-sand bg-white py-3 ps-11 pe-4 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose shadow-2xs"
          >
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="activeCategory === 'all' ? 'bg-ink text-white border-ink shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
            @click="activeCategory = 'all'"
          >
            همه مقالات
          </button>
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="activeCategory === 'training' ? 'bg-rose text-white border-rose shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
            @click="activeCategory = 'training'"
          >
            تمرین و حرکت
          </button>
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="activeCategory === 'recovery' ? 'bg-sage text-white border-sage shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
            @click="activeCategory = 'recovery'"
          >
            ریکاوری و ذهن
          </button>
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
            :class="activeCategory === 'science' ? 'bg-clay text-white border-clay shadow-xs' : 'bg-white text-muted-foreground border-sand hover:text-ink'"
            @click="activeCategory = 'science'"
          >
            علم متریال و الیاف
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
