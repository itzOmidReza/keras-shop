<!-- frontend/app/components/home/CategoryStories.vue -->
<script setup lang="ts">
interface CategoryStory {
  id: string
  title: string
  href: string
  image: string
  hasBadge?: boolean
  badgeText?: string
}

const stories: CategoryStory[] = [
  {
    id: 'sale',
    title: 'آفرهای داغ 🔥',
    href: '/shop?badge=sale',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    hasBadge: true,
    badgeText: 'ویژه',
  },
  {
    id: 'leggings',
    title: 'لگ و ساپورت',
    href: '/shop?category=leggings',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'bras',
    title: 'نیم‌تنه و کراپ',
    href: '/shop?category=bras',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sets',
    title: 'ست‌های ورزشی',
    href: '/shop?category=sets',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tops',
    title: 'تیشرت و تاپ',
    href: '/shop?category=tops',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'accessories',
    title: 'اکسسوری',
    href: '/shop?category=accessories',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
  },
]
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
    <!-- کانتینر اسکرول افقی اسنپ (Native CSS Scroll Snap) -->
    <div
      class="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <NuxtLink
        v-for="story in stories"
        :key="story.id"
        :to="story.href"
        class="group flex flex-col items-center gap-2 shrink-0 snap-start text-center cursor-pointer transition-transform active:scale-95"
      >
        <!-- آواتار دایره‌ای با رینگ گرادیانتی و افکت هاور -->
        <div class="relative p-1 rounded-full ring-2 ring-rose/50 group-hover:ring-rose group-hover:shadow-xs transition-all duration-300">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-sand/40 border-2 border-white">
            <NuxtImg
              :src="story.image"
              :alt="story.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <!-- بج متحرک برای آفرهای داغ -->
          <div
            v-if="story.hasBadge"
            class="absolute -top-1 -inset-e-1 flex items-center justify-center"
          >
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
              <span class="relative inline-flex rounded-full h-3 w-3 bg-rose border border-white" />
            </span>
          </div>
        </div>

        <!-- عنوان استوری -->
        <span class="text-xs sm:text-xs font-bold text-ink group-hover:text-rose transition-colors max-w-[80px] sm:max-w-[90px] truncate">
          {{ story.title }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
