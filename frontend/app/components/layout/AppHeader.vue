<!-- frontend/app/components/layout/AppHeader.vue -->
<script setup lang="ts">
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Package,
  LogOut,
} from '@lucide/vue'
import { headerNav, announcementBar, siteConfig } from '~/data'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import { useAuthStore } from '~/stores/auth'
import { useSiteSettings } from '~/composables/useSiteSettings'
import { toFa } from '~/utils/format'

defineEmits<{
  openMobileMenu: []
}>()

const isScrolled = ref(false)
const isSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const authStore = useAuthStore()
const { settings, brandNameFa, brandNameEn } = useSiteSettings()


const isLinkActive = (href: string) => {
  if (href.includes('?')) {
    return route.fullPath === href
  }
  return route.path === href
}

const handleScroll = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    isScrolled.value = window.scrollY > 20
  }
}

const handleDocumentClick = (e: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleDocumentClick)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleDocumentClick)
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
    <!-- ۱. تاپ‌بار اعلان داینامیک -->
    <div
      v-if="settings.shipping.announcementBarVisible"
      class="bg-sand/50 border-b border-sand/40 py-1.5 px-4 text-center"
    >
      <div
        class="container mx-auto flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ settings.shipping.announcementBarText || announcementBar.text }}</span>
        <template v-if="settings.shipping.announcementBarHighlight || announcementBar.highlight">
          <span class="inline-block w-1 h-1 rounded-full bg-rose shrink-0" />
          <span class="hidden sm:inline">{{ settings.shipping.announcementBarHighlight || announcementBar.highlight }}</span>
        </template>
      </div>
    </div>

    <!-- بنر وضعیت تعطیلات در صورت فعال بودن -->
    <div
      v-if="settings.checkoutRules.holidayModeEnabled"
      class="bg-clay/15 border-b border-clay/30 py-1.5 px-4 text-center text-xs text-clay font-bold"
    >
      {{ settings.checkoutRules.holidayNoticeText }}
    </div>

    <!-- ۲. نوار اصلی هدر -->
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex h-16 sm:h-20 items-center justify-between gap-4">
        <!-- دکمه منو موبایل + نام برند -->
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="flex items-center justify-center lg:hidden text-ink p-1 -ms-1 hover:text-rose transition-colors cursor-pointer"
            aria-label="باز کردن منو"
            @click="$emit('openMobileMenu')"
          >
            <Menu class="w-6 h-6" />
          </button>

          <NuxtLink to="/" class="flex items-center gap-2 text-ink group">
            <span class="font-bold text-2xl sm:text-3xl tracking-tight transition-colors group-hover:text-rose">
              {{ brandNameFa || siteConfig.name }}
            </span>
            <span class="hidden md:inline-block text-[10px] tracking-widest text-muted-foreground uppercase pt-1">
              {{ brandNameEn || 'Athleisure' }}
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

          <!-- بخش کاربر: مهمان یا لاگین‌شده -->
          <div ref="userMenuRef" class="relative">
            <!-- حالت مهمان: باز کردن مدال ورود -->
            <button
              v-if="!authStore.isAuthenticated"
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors cursor-pointer"
              aria-label="ورود به حساب کاربری"
              title="ورود یا ثبت‌نام"
              @click="authStore.openAuthModal()"
            >
              <User class="w-5 h-5" />
            </button>

            <!-- حالت لاگین: دراپ‌داون حساب کاربری -->
            <div v-else class="relative">
              <button
                type="button"
                class="w-10 h-10 flex items-center justify-center rounded-full text-ink hover:text-rose hover:bg-sand/40 transition-colors cursor-pointer relative"
                aria-label="حساب کاربری"
                :title="authStore.user?.fullName || 'حساب کاربری'"
                @click="isUserMenuOpen = !isUserMenuOpen"
              >
                <User class="w-5 h-5 text-rose" />
                <span class="absolute bottom-1.5 inset-e-1.5 w-2 h-2 rounded-full bg-sage ring-2 ring-paper" />
              </button>

              <!-- منوی کشویی کاربر -->
              <div
                v-if="isUserMenuOpen"
                class="absolute inset-e-0 top-full mt-2 w-56 rounded-2xl border border-sand bg-white p-2 shadow-lg z-50 space-y-1"
                dir="rtl"
              >
                <div class="px-3 py-2 border-b border-sand/60">
                  <p class="text-xs font-bold text-ink truncate">
                    {{ authStore.user?.fullName || 'کاربر گرامی کراس' }}
                  </p>
                  <p class="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {{ toFa(authStore.user?.phoneNumber || '') }}
                  </p>
                </div>

                <NuxtLink
                  to="/account"
                  class="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink hover:bg-sand/30 hover:text-rose transition-colors"
                  @click="isUserMenuOpen = false"
                >
                  <User class="w-4 h-4 text-muted-foreground" />
                  <span>پیشخوان کاربری</span>
                </NuxtLink>

                <NuxtLink
                  to="/account?tab=orders"
                  class="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink hover:bg-sand/30 hover:text-rose transition-colors"
                  @click="isUserMenuOpen = false"
                >
                  <Package class="w-4 h-4 text-muted-foreground" />
                  <span>سفارش‌های من</span>
                </NuxtLink>

                <button
                  type="button"
                  class="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-start"
                  @click="isUserMenuOpen = false; authStore.logout()"
                >
                  <LogOut class="w-4 h-4" />
                  <span>خروج از حساب</span>
                </button>
              </div>
            </div>
          </div>

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

    <!-- کشوی جست‌وجوی زنده همراه با Autocomplete -->
    <div v-if="isSearchOpen" class="border-t border-sand/60 bg-paper/95 px-4 py-3 shadow-inner">
      <div class="container mx-auto max-w-2xl">
        <SearchAutocomplete
          :auto-focus="true"
          :show-close-button="true"
          @close="isSearchOpen = false"
          @select="isSearchOpen = false"
        />
      </div>
    </div>
  </header>
</template>
