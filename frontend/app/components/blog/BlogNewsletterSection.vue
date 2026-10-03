<script setup lang="ts">
import { Sparkles } from '@lucide/vue'

const email = defineModel<string>('email', { default: '' })

const emit = defineEmits<{
  (e: 'subscribe'): void
}>()
</script>

<template>
  <section class="container mx-auto max-w-4xl px-4 mt-12">
    <div class="rounded-3xl border border-sand bg-sand/30 p-8 sm:p-12 text-center space-y-4">
      <Sparkles class="w-8 h-8 text-rose mx-auto" />
      <h2 class="text-xl sm:text-2xl font-bold text-ink">
        اشتراک در خبرنامه دانش ورزشی کراس
      </h2>
      <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        جدیدترین پژوهش‌های بیومکانیک، علم تغذیه و راهنماهای تمرینی را دو بار در ماه بدون هرزنامه دریافت فرمایید.
      </p>

      <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2" @submit.prevent="emit('subscribe')">
        <input
          v-model="email"
          type="email"
          placeholder="ایمیل خود را وارد فرمایید..."
          class="flex-1 rounded-xl border border-sand bg-white py-3 px-4 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose shadow-2xs"
          required
        >
        <button
          type="submit"
          class="py-3 px-6 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
        >
          عضویت در خبرنامه
        </button>
      </form>
    </div>
  </section>
</template>
