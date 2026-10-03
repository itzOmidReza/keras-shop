<script setup lang="ts">
import { ChevronRight, ChevronLeft } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  currentPage: number
  totalPages: number
  paginationPages: (number | 'ellipsis')[]
}>()

const emit = defineEmits<{
  (e: 'changePage', page: number): void
}>()
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="صفحه‌بندی محصولات"
    class="pt-6 border-t border-sand/70 flex flex-col sm:flex-row items-center justify-between gap-4"
  >
    <div class="text-xs text-muted-foreground font-medium">
      صفحه <strong class="text-ink font-bold">{{ toFa(currentPage) }}</strong> از <strong class="text-ink font-bold">{{ toFa(totalPages) }}</strong>
    </div>

    <div class="flex items-center gap-1.5" dir="rtl">
      <!-- دکمه صفحه قبل: در RTL اشاره به راست دارد -->
      <button
        type="button"
        :disabled="currentPage === 1"
        class="h-10 px-3 rounded-xl border border-sand bg-white text-ink text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/30 hover:border-sand/80 shadow-2xs"
        aria-label="صفحه قبل"
        @click="emit('changePage', currentPage - 1)"
      >
        <ChevronRight class="w-4 h-4" />
        <span class="hidden sm:inline">قبلی</span>
      </button>

      <!-- قرص‌های شماره صفحه -->
      <template v-for="(p, idx) in paginationPages" :key="idx">
        <span
          v-if="p === 'ellipsis'"
          class="px-2 text-xs font-bold text-muted-foreground select-none"
        >
          …
        </span>
        <button
          v-else
          type="button"
          class="w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border shadow-2xs"
          :class="[
            p === currentPage
              ? 'bg-ink text-white border-ink shadow-xs scale-105'
              : 'bg-white text-ink border-sand hover:bg-sand/30 hover:border-sand/80',
          ]"
          :aria-current="p === currentPage ? 'page' : undefined"
          :aria-label="`صفحه ${toFa(p)}`"
          @click="emit('changePage', p)"
        >
          {{ toFa(p) }}
        </button>
      </template>

      <!-- دکمه صفحه بعد: در RTL اشاره به چپ دارد -->
      <button
        type="button"
        :disabled="currentPage === totalPages"
        class="h-10 px-3 rounded-xl border border-sand bg-white text-ink text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sand/30 hover:border-sand/80 shadow-2xs"
        aria-label="صفحه بعد"
        @click="emit('changePage', currentPage + 1)"
      >
        <span class="hidden sm:inline">بعدی</span>
        <ChevronLeft class="w-4 h-4" />
      </button>
    </div>
  </nav>
</template>
