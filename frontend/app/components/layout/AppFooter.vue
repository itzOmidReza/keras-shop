<!-- frontend/app/components/layout/AppFooter.vue -->
<script setup lang="ts">
import {
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { footerSections, brandPerks, siteConfig } from '~/data'

const email = ref('')

const handleNewsletter = () => {
  if (!email.value) return
  toast.success('عضویت شما در باشگاه مشتریان کراس با موفقیت ثبت شد.')
  email.value = ''
}

// مپ کردن آیکون‌های پویا
const iconMap = {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
}
</script>

<template>
  <footer class="mt-20 border-t border-sand bg-paper text-ink">
    <!-- ارزش‌های ۴ گانه برند -->
    <div class="border-b border-sand">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div v-for="perk in brandPerks" :key="perk.title" class="space-y-1.5">
            <component :is="iconMap[perk.icon as keyof typeof iconMap]" class="mx-auto h-5 w-5 text-rose" />
            <h4 class="text-xs font-bold text-ink">
              {{ perk.title }}
            </h4>
            <p class="text-[11px] text-muted-foreground">
              {{ perk.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- بدنه اصلی فوتر -->
    <div class="container mx-auto px-4 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <!-- ستون معرفی -->
        <div class="lg:col-span-4 space-y-4">
          <div class="space-y-2">
            <span class="text-2xl font-bold tracking-tight text-ink">
              {{ siteConfig.name }}
            </span>
            <p class="text-xs leading-relaxed text-muted-foreground max-w-sm">
              {{ siteConfig.slogan }}. {{ siteConfig.subSlogan }} با تمرکز بر بافت‌های بدون درز، آزادی حرکت و راحتی
              ماندگار.
            </p>
          </div>

          <div class="space-y-2 pt-2">
            <span class="text-xs font-bold text-ink block">
              عضویت در باشگاه کراس (۱۰٪ تخفیف اولین خرید)
            </span>
            <form class="flex items-center gap-2 max-w-sm" @submit.prevent="handleNewsletter">
              <input
v-model="email" type="email" required placeholder="ایمیل خود را وارد کنید..."
                class="h-10 flex-1 rounded-xl border border-sand bg-white px-3 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:outline-none">
              <button
type="submit"
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose text-white transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                aria-label="عضویت خبرنامه">
                <Send class="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <!-- ستون‌های لینک داینامیک از data -->
        <div
v-for="(sec, key) in footerSections" :key="key" class="space-y-3"
          :class="key === 'brand' ? 'lg:col-span-2' : 'lg:col-span-3'">
          <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
            {{ sec.title }}
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in sec.links" :key="link.href">
              <NuxtLink :to="link.href" class="text-muted-foreground transition-colors hover:text-rose">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- کپی‌رایت -->
    <div class="border-t border-sand/80 py-6">
      <div
        class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <span>© تمامی حقوق متعلق به {{ siteConfig.name }} است.</span>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="hover:text-ink transition-colors">
            حریم خصوصی
          </NuxtLink>
          <NuxtLink to="/terms" class="hover:text-ink transition-colors">
            قوانین و مقررات
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
