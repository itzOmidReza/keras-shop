<!-- frontend/app/components/layout/MobileNav.vue -->
<script setup lang="ts">
import {
  X,
  ChevronLeft,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  Phone,
} from '@lucide/vue'
import { mobileNavItems, siteConfig } from '~/data'
import { useWishlistStore } from '~/stores/wishlist'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const wishlistStore = useWishlistStore()

const quickLinks = [
  { label: 'علاقه‌مندی‌ها', href: '/wishlist', icon: Heart },
  { label: 'حساب کاربری', href: '/account', icon: User },
  { label: 'سبد خرید', href: '/cart', icon: ShoppingBag },
]
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300"
        @click="emit('close')"
      />

      <aside
        class="fixed inset-y-0 inset-s-0 flex w-full max-w-xs flex-col justify-between bg-paper p-6 shadow-2xl transition-transform duration-300"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-sand pb-4">
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold tracking-tight text-ink">
                {{ siteConfig.name }}
              </span>
              <span class="rounded-full bg-sand/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                Athleisure
              </span>
            </div>

            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand/50 cursor-pointer"
              aria-label="بستن منو"
              @click="emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- لینک‌های داینامیک از data -->
          <nav class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in mobileNavItems"
              :key="item.href"
              :to="item.href"
              class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-sand/40 hover:text-rose"
              @click="emit('close')"
            >
              <div class="flex items-center gap-2">
                <span>{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-rose/10 px-2 py-0.5 text-[10px] font-bold text-rose"
                >
                  {{ item.badge }}
                </span>
              </div>
              <ChevronLeft class="h-4 w-4 text-muted-foreground" />
            </NuxtLink>
          </nav>

          <div class="rounded-2xl border border-sand bg-white/60 p-4">
            <div class="flex items-center gap-2 text-rose">
              <Sparkles class="h-4 w-4" />
              <span class="text-xs font-bold text-ink">۱۰٪ تخفیف اولین خرید</span>
            </div>
            <p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              با عضویت در خبرنامه {{ siteConfig.name }}، کد تخفیف دریافت کنید.
            </p>
          </div>
        </div>

        <div class="space-y-4 border-t border-sand pt-4">
          <div class="grid grid-cols-3 gap-2 text-center">
            <NuxtLink
              v-for="link in quickLinks"
              :key="link.href"
              :to="link.href"
              class="relative flex flex-col items-center gap-1 rounded-xl p-2 text-[11px] font-bold text-ink transition-colors hover:bg-sand/40"
              @click="emit('close')"
            >
              <div class="relative">
                <component
                  :is="link.icon"
                  class="h-4 w-4 text-rose"
                />
                <span
                  v-if="link.href === '/wishlist' && wishlistStore.itemCount > 0"
                  class="absolute -top-1.5 -end-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-rose text-white text-[9px] font-bold flex items-center justify-center"
                >
                  {{ wishlistStore.itemCount }}
                </span>
              </div>
              <span>{{ link.label }}</span>
            </NuxtLink>
          </div>

          <div class="flex items-center justify-between rounded-xl bg-sand/30 px-3 py-2 text-xs text-muted-foreground">
            <div class="flex items-center gap-1.5">
              <Phone class="h-3.5 w-3.5 text-sage" />
              <span>پشتیبانی:</span>
            </div>
            <a
              :href="`tel:${siteConfig.contact.phoneRaw}`"
              class="font-bold text-ink hover:text-rose transition-colors"
            >
              {{ siteConfig.contact.phone }}
            </a>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
