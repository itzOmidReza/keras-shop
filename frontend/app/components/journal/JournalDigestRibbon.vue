<!-- frontend/app/components/journal/JournalDigestRibbon.vue -->
<script setup lang="ts">
import { Mail, Sparkles } from '@lucide/vue'

defineProps<{
  email: string
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  'subscribe': []
}>()

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:email', target.value)
}

const onSubmit = () => {
  emit('subscribe')
}
</script>

<template>
  <section
    class="relative overflow-hidden rounded-3xl bg-sand/30 border border-sand/70 p-6 sm:p-10 my-16 shadow-2xs"
    data-testid="journal-digest-ribbon"
  >
    <div class="relative z-10 max-w-3xl mx-auto text-center space-y-4">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-ink shadow-2xs border border-sand/60">
        <Sparkles class="w-3.5 h-3.5 text-rose" />
        گاهی فراتر از مد، روایتی از هنر و کیفیت
      </div>

      <h3 class="text-xl sm:text-2xl lg:text-3xl font-black font-sans text-ink">
        عضویت در گاهنامه ادیتوریال و روایات آتلیه کراس
      </h3>

      <p class="text-xs sm:text-sm text-ink/70 leading-relaxed font-sans max-w-xl mx-auto">
        اولین نفری باشید که از انتشار دراپ‌های فصلی، تحلیل‌های علمی الیاف ارگانیک و راهنماهای کاربردی استایل پاییز مطلع می‌شوید.
      </p>

      <form class="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-2" @submit.prevent="onSubmit">
        <div class="relative w-full">
          <input
            :value="email"
            type="email"
            placeholder="آدرس ایمیل شما..."
            data-testid="digest-email-input"
            class="w-full bg-white border border-sand focus:border-ink rounded-xl ps-10 pe-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:outline-hidden transition-all shadow-2xs"
            @input="onInput"
          >
          <Mail class="w-4 h-4 text-ink/40 absolute start-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <button
          type="submit"
          data-testid="digest-submit-btn"
          class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          عضویت در گاهنامه
        </button>
      </form>
    </div>
  </section>
</template>
