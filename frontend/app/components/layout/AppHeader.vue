<!-- frontend/app/components/layout/Header.vue -->
<script setup lang="ts">
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowLeft,
} from '@lucide/vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

// تعداد آیتم‌های سبد و علاقه‌مندی (در صورت اتصال به استور)
const cartCount = ref(2)
const wishlistCount = ref(0)

const navLinks = [
  { label: 'فروشگاه', href: '/shop' },
  { label: 'لاین آرامش (Calm)', href: '/products?line=calm' },
  { label: 'لاین حرکت (Move)', href: '/products?line=move' },
  { label: 'راهنمای سایز', href: '/size-guide' },
  { label: 'مجله کراس', href: '/blog' },
]

const handleScroll = () => {
  if (import.meta.client) {
    isScrolled.value = window.scrollY > 20
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
class="sticky top-0 z-50 w-full transition-all duration-300" :class="[
    isScrolled
      ? 'bg-paper/90 backdrop-blur-md shadow-xs border-b border-sand/70'
      : 'bg-paper border-b border-sand/40',
  ]">
    <!-- ۱. تاپ‌بار اعلان (مشابه رفرنس‌های ادیتوریال) -->
    <div class="bg-sand/50 border-b border-sand/40 py-1.5 px-4 text-center">
      <div
        class="container mx-auto flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground">
        <span>ارسال رایگان برای تمام سفارش‌های بالای ۱٫۵۰۰٫۰۰۰ تومان</span>
        <span class="inline-block w-1 h-1 rounded-full bg-rose shrink-0" />
        <span class="hidden sm:inline">ضمانت تعویض تا ۷ روز کاری</span>
      </div>
    </div>

    <!-- ۲. نوار ناوبری اصلی -->
    <div class="container mx-auto px-4 lg:px-8">
      <div class="flex h-16 sm:h-20 items-center justify-between gap-4">

        <!-- دکمه منو موبایل + نام برند -->
        <div class="flex items-center gap-4">
          <button
type="button"
            class="flex items-center justify-center lg:hidden text-ink p-1 -ms-1 hover:text-rose transition-colors"
            aria-label="باز کردن منو" @click="isMobileMenuOpen = true">
            <Menu class="w-6 h-6" />
          </button>

          <!-- لوگوتایپ کراس -->
          <NuxtLink to="/" class="flex items-center gap-2 text-ink group">
            <span class="font-bold text-2xl sm:text-3xl tracking-tight transition-colors group-hover:text-rose">
              کراس
            </span>
            <span class="hidden md:inline-block text-[10px] tracking-widest text-muted-foreground uppercase pt-1">
              Athleisure
            </span>
          </NuxtLink>
        </div>

        <!-- لینک‌های ناوبری در دسکتاپ (سبک مینیمال بدون شلوغی) -->
        <nav class="hidden lg:flex items-center gap-8">
          <NuxtLink
v-for="link in navLinks" :key="link.href" :to="link.href"
            class="relative text-sm font-medium text-ink/80 hover:text-ink transition-colors py-2 group">
            <span>{{ link.label }}</span>
            <span
              class="absolute inset-x-0 bottom-0 h-0.5 bg-rose scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
          </NuxtLink>
        </nav>

        <!-- آیکون‌های اکشن کاربر (جست‌وجو، کاربری، علاقه‌مندی و سبد خرید) -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- جست‌وجو -->
          <button
type="button"
            class="w-10 h-10 flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
            aria-label="جست‌وجوی محصول" @click="isSearchOpen = !isSearchOpen">
            <Search class="w-5 h-5" />
          </button>

          <!-- علاقه‌مندی‌ها -->
          <NuxtLink
to="/wishlist"
            class="relative w-10 h-10 hidden sm:flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
            aria-label="محصولات مورد علاقه">
            <Heart class="w-5 h-5" />
            <span v-if="wishlistCount > 0" class="absolute top-2 end-2 w-2 h-2 rounded-full bg-rose" />
          </NuxtLink>

          <!-- حساب کاربری -->
          <NuxtLink
to="/account"
            class="w-10 h-10 flex items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-sand/40 transition-colors"
            aria-label="حساب کاربری">
            <User class="w-5 h-5" />
          </NuxtLink>

          <!-- سبد خرید با شمارنده به رنگ رز -->
          <NuxtLink
to="/cart"
            class="relative w-10 h-10 flex items-center justify-center rounded-full text-ink hover:text-rose hover:bg-sand/40 transition-colors"
            aria-label="سبد خرید">
            <ShoppingBag class="w-5 h-5" />
            <span
v-if="cartCount > 0"
              class="absolute top-1 end-1 min-w-4 h-4 px-1 rounded-full bg-rose text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {{ cartCount }}
            </span>
          </NuxtLink>
        </div>

      </div>
    </div>

    <!-- فیلد جست‌وجوی شناور و بازشونده -->
    <div v-if="isSearchOpen" class="border-t border-sand/60 bg-paper px-4 py-3 shadow-inner">
      <div class="container mx-auto max-w-2xl flex items-center gap-3">
        <Search class="w-5 h-5 text-muted-foreground shrink-0" />
        <input
v-model="searchQuery" type="text" placeholder="جست‌وجوی لگ، نیم‌تنه، شورت ورزشی یا جنس پارچه..."
          class="w-full bg-transparent text-sm text-ink placeholder:text-muted-foreground focus:outline-none" autofocus>
        <button
type="button" class="text-xs font-bold text-muted-foreground hover:text-ink"
          @click="isSearchOpen = false">
          بستن
        </button>
      </div>
    </div>

    <!-- منوی کشویی موبایل (Drawer) -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
      <!-- لایه بلور پس‌زمینه -->
      <div class="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" @click="isMobileMenuOpen = false" />

      <!-- پنل منو -->
      <div
        class="fixed inset-y-0 start-0 w-4/5 max-w-sm bg-paper p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
        <div class="space-y-6">
          <!-- هدر منو -->
          <div class="flex items-center justify-between border-b border-sand/60 pb-4">
            <span class="font-bold text-xl text-ink">کراس</span>
            <button type="button" class="p-1 rounded-lg text-ink hover:bg-sand/40" @click="isMobileMenuOpen = false">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- لینک‌ها -->
          <nav class="flex flex-col gap-3">
            <NuxtLink
v-for="link in navLinks" :key="link.href" :to="link.href"
              class="flex items-center justify-between py-2 text-sm font-bold text-ink hover:text-rose transition-colors"
              @click="isMobileMenuOpen = false">
              <span>{{ link.label }}</span>
              <ArrowLeft class="w-4 h-4 text-muted-foreground" />
            </NuxtLink>
          </nav>
        </div>

        <!-- پایین منوی موبایل -->
        <div class="pt-6 border-t border-sand/60 space-y-3 text-xs text-muted-foreground">
          <p class="font-medium text-ink">پشتیبانی و مشاوره تخصصی</p>
          <p>شنبه تا پنجشنبه: ۹ الی ۱۸</p>
          <p class="text-rose font-bold">۰۲۱-۸۸۸۸۴۴۲۲</p>
        </div>
      </div>
    </div>
  </header>
</template>
