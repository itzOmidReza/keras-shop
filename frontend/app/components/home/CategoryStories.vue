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
    id: 'fall-drop',
    title: 'دراپ پاییز ۱۴۰۵ 🍂',
    href: '/shop?season=fall-1405',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    hasBadge: true,
    badgeText: 'جدید',
  },
  {
    id: 'shirts-blouses',
    title: 'پیراهن و شومیز',
    href: '/shop?category=shirts-blouses',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'knitwear',
    title: 'بافت و پلیور',
    href: '/shop?category=knitwear',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'coats-jackets',
    title: 'پالتو و کاپشن',
    href: '/shop?category=coats-jackets',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pants',
    title: 'شلوار',
    href: '/shop?category=pants',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'scarves',
    title: 'شال و اسکارف',
    href: '/shop?category=scarves',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hair-accessories',
    title: 'اکسسوری مو',
    href: '/shop?category=hair-accessories',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80',
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
        <!-- آواتار دایره‌ای با رینگ گرادیانتی و افکت هاور ادیتوریال -->
        <div class="relative p-0.5 rounded-full bg-gradient-to-tr from-rose via-clay to-sand group-hover:from-rose group-hover:to-rose shadow-2xs group-hover:shadow-xs transition-all duration-300">
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-sand/30 border-2 border-paper">
            <NuxtImg
              :src="story.image"
              :alt="story.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <!-- بج متحرک برای دراپ جدید -->
          <div
            v-if="story.hasBadge"
            class="absolute -top-1 -inset-e-1 flex items-center justify-center"
          >
            <span class="relative flex h-3.5 w-3.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-75" />
              <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose border-2 border-paper" />
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
