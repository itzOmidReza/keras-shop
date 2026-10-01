<!-- frontend/app/components/layout/AppHeader.vue -->
<script setup lang="ts">
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
} from '@lucide/vue'
import { headerNav, announcementBar, siteConfig } from '~/data'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

defineEmits<{
  openMobileMenu: []
}>()

const isScrolled = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isLinkActive = (href: string) => {
  if (href.includes('?')) {
    return route.fullPath === href
  }
  return route.path === href
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  const q = searchQuery.value.trim()
  isSearchOpen.value = false
  searchQuery.value = ''
  router.push(`/shop?q=${encodeURIComponent(q)}`)
}

const handleScroll = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <header
class="sticky top-0 z-40 w-full transition-all duration-300" :class="[
    isScrolled
      ? 'bg-paper/90 backdrop-blur-md shadow-xs border-b border-sand/70'
      : 'bg-paper border-b border-sand/40',
  ]">
    <!-- ۱. تاپ‌بار اعلان از لایه data -->
    <div class="bg-sand/50 border-b border-sand/40 py-1.5 px-4 text-center">
      <div
        class="container mx-auto flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground">
        <span>{{ announcementBar.text }}</span>
        <span class="inline-block w-1 h-1 rounded-full bg-rose shrink-0" />
        <span class="hidden sm:inline">{{ announcementBar.highlight }}</span>
      </div>
    </div>

    <!-- ۲. نوار اصلی هدر -->
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex h-16 sm:h-20 items-center justify-between gap-4">
        <!-- دکمه منو موبایل + نام برند -->
        <div class="flex items-center gap-4">
          <button
type="button"
            class="flex items-center justify-center lg:hidden text-ink p-1 -ms-1 hover:text-rose transition-colors cursor-pointer"
            aria-label="باز کردن منو" @click="$emit('openMobileMenu')">
            <Menu class="w-6 h-6" />
          </button>

          <NuxtLink to="/" class="flex items-center gap-2 text-ink group">
            <span class="font-bold text-2xl sm:text-3xl tracking-tight transition-colors group-hover:text-rose">
              {{ siteConfig.name }}
            </span>
            <span class="hidden md:inline-block text-[10px] tracking-widest text-muted-foreground uppercase pt-1">
              Athleisure
            </span>
          </NuxtLink>
        </div>

        <!-- منوی دستکتاپ از لایه data -->
        <nav class="hidden lg:flex items-center gap-8">
          <NuxtLink
            v-for="link in headerNav"
            :key="link.href"
            :to="link.href"
            class="relative text-sm font-medium transition-colors py-2 group"
            :class="isLinkActive(link.href) ? 'text-ink font-bold' : 'text-ink/80 hover:text-ink'"
          >
            <span>{{ link.label }}</span>
            <span
              class="absolute inset-x-0 bottom-0 h-0.5 bg-rose transition-transform duration-200 origin-center"
              :class="isLinkActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
            />
          </NuxtLink>
        </nav>

        <!-- آیکون‌ها -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            class="w-10 h-10 flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors cursor-pointer"
            aria-label="جست‌وجو"
            @click="isSearchOpen = !isSearchOpen"
          >
            <Search class="w-5 h-5" />
          </button>

          <NuxtLink
            to="/wishlist"
            class="relative w-10 h-10 hidden sm:flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart class="w-5 h-5" />
            <span
              v-if="(wishlistStore?.itemCount ?? 0) > 0"
              class="absolute top-1 inset-e-1 min-w-4 h-4 px-1 rounded-full bg-rose text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
            >
              {{ wishlistStore?.itemCount ?? 0 }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/account"
            class="w-10 h-10 flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
            aria-label="حساب کاربری"
          >
            <User class="w-5 h-5" />
          </NuxtLink>

          <button
            type="button"
            class="relative w-10 h-10 flex items-center justify-center rounded-full text-ink hover:text-rose hover:bg-sand/40 transition-colors cursor-pointer"
            aria-label="سبد خرید"
            @click="cartStore.openCart()"
          >
            <ShoppingBag class="w-5 h-5" />
            <span
              v-if="(cartStore?.itemCount ?? 0) > 0"
              class="absolute top-1 inset-e-1 min-w-4 h-4 px-1 rounded-full bg-rose text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
            >
              {{ cartStore?.itemCount ?? 0 }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- فرم جست‌وجو کشویی -->
    <div v-if="isSearchOpen" class="border-t border-sand/60 bg-paper px-4 py-3 shadow-inner">
      <form class="container mx-auto max-w-2xl flex items-center gap-3" @submit.prevent="handleSearch">
        <Search class="w-5 h-5 text-muted-foreground shrink-0" />
        <label for="header-search-input" class="sr-only">جست‌وجوی کالا</label>
        <input
          id="header-search-input"
          v-model="searchQuery"
          type="text"
          placeholder="جست‌وجوی محصولات ورزشی کراس..."
          class="w-full bg-transparent text-sm text-ink placeholder:text-muted-foreground focus:outline-none"
          autofocus
        >
        <button
          type="button"
          class="text-xs font-bold text-muted-foreground hover:text-ink cursor-pointer"
          @click="isSearchOpen = false"
        >
          بستن
        </button>
      </form>
    </div>
  </header>
</template>
