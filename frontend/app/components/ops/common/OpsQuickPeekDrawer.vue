<!-- frontend/app/components/ops/common/OpsQuickPeekDrawer.vue -->
<script setup lang="ts">
import { X, Package, User, ShoppingBag } from '@lucide/vue'

interface QuickPeekData {
  type: 'order' | 'product' | 'customer'
  id: string
  title: string
  subtitle: string
  details: { label: string; value: string }[]
  tags?: string[]
}

defineProps<{
  open: boolean
  data?: QuickPeekData | null
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()
</script>

<template>
  <div v-if="open && data" class="fixed inset-0 z-50 overflow-hidden">
    <!-- پس‌زمینه شفاف -->
    <div
      class="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
      @click="emit('update:open', false)"
    />

    <div class="fixed inset-y-0 end-0 max-w-full flex ps-10">
      <div class="w-screen max-w-md bg-white border-s border-sand shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        <!-- هدر دراور -->
        <div class="p-5 border-b border-sand flex items-center justify-between bg-paper">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-ink text-paper flex items-center justify-center shrink-0">
              <ShoppingBag v-if="data.type === 'order'" class="w-4 h-4" />
              <Package v-else-if="data.type === 'product'" class="w-4 h-4" />
              <User v-else class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-ink">{{ data.title }}</h3>
              <p class="text-2xs text-muted-foreground font-mono mt-0.5">{{ data.subtitle }}</p>
            </div>
          </div>
          <button
            type="button"
            class="p-1 rounded-lg text-muted-foreground hover:text-ink cursor-pointer"
            @click="emit('update:open', false)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- محتوای دراور -->
        <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          <!-- برچسب‌ها -->
          <div v-if="data.tags && data.tags.length > 0" class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in data.tags"
              :key="tag"
              class="px-2 py-0.5 rounded-full text-2xs font-bold bg-sand/40 text-ink"
            >
              {{ tag }}
            </span>
          </div>

          <!-- فهرست مشخصات -->
          <div class="space-y-3 p-4 bg-sand/10 rounded-xl border border-sand/60">
            <div
              v-for="(item, idx) in data.details"
              :key="idx"
              class="flex items-center justify-between pb-2 border-b border-sand/40 last:border-b-0 last:pb-0"
            >
              <span class="text-muted-foreground text-2xs">{{ item.label }}:</span>
              <span class="font-bold text-ink font-mono">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- فوتر -->
        <div class="p-4 border-t border-sand bg-sand/20 flex items-center justify-between">
          <span class="text-2xs text-muted-foreground">مشاهده سریع داده‌ها بدون ترک صفحه</span>
          <button
            type="button"
            class="h-8 px-3 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 cursor-pointer"
            @click="emit('update:open', false)"
          >
            بستن پیش‌نمایش
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
