<script setup lang="ts">
import { PackageSearch, Search, X } from '@lucide/vue'
import { TEST_PILLS } from '~/composables/tracking/useOrderTracking'

defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'search' | 'clear'): void
  (e: 'applyPill', code: string): void
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })
</script>

<template>
  <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-20">
    <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
        <PackageSearch class="w-3.5 h-3.5" />
        <span>شفافیت و رهگیری زنده مرسولات</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
        پیگیری لحظه‌ای سفارش و بارکد پستی
      </h1>

      <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        جهت مشاهده آخرین وضعیت آماده‌سازی، بسته‌بندی در انبار مرکزی یا دریافت کد رهگیری ۲۴ رقمی شرکت ملی پست، شماره سفارش یا شماره همراه خود را وارد کنید.
      </p>

      <!-- فرم جستجوی سفارش -->
      <div class="max-w-xl mx-auto pt-4">
        <form
          class="relative flex items-center shadow-xs rounded-2xl bg-white border border-sand focus-within:border-rose/60 focus-within:ring-2 focus-within:ring-rose/20 transition-all p-1.5"
          @submit.prevent="emit('search')"
        >
          <div class="ps-3.5 text-muted-foreground">
            <Search class="w-5 h-5 text-rose/70" />
          </div>

          <input
            v-model="searchQuery"
            type="text"
            dir="auto"
            placeholder="شماره سفارش (مثال: KERAS-208314) یا شماره همراه..."
            class="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted-foreground/60 focus:outline-none"
          >

          <button
            v-if="searchQuery"
            type="button"
            class="p-1.5 text-muted-foreground hover:text-ink me-1 transition-colors rounded-lg hover:bg-sand/30"
            @click="emit('clear')"
          >
            <X class="w-4 h-4" />
          </button>

          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-2.5 rounded-xl bg-ink text-sand hover:bg-ink/90 font-bold text-xs sm:text-sm shrink-0 transition-colors disabled:opacity-50"
          >
            <span v-if="isLoading">در حال استعلام...</span>
            <span v-else>رهگیری</span>
          </button>
        </form>

        <!-- چیپ‌های تست سریع -->
        <div class="flex flex-wrap items-center justify-center gap-2 pt-4">
          <span class="text-2xs text-muted-foreground">نمونه‌های تستی:</span>
          <button
            v-for="pill in TEST_PILLS"
            :key="pill.code"
            type="button"
            class="text-2xs px-2.5 py-1 rounded-full bg-white border border-sand hover:border-rose/50 hover:text-rose transition-colors font-mono"
            @click="emit('applyPill', pill.code)"
          >
            {{ pill.label }}: {{ pill.code }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
