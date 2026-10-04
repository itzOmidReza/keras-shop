<!-- frontend/app/components/ops/common/OpsTabBar.vue -->
<script setup lang="ts">
import { Pin, X, Plus } from '@lucide/vue'
import type { OpsWorkspaceTab } from '~/composables/ops/useOpsTabs'

defineProps<{
  tabs: OpsWorkspaceTab[]
  activeId: string
}>()

const emit = defineEmits<{
  (e: 'select', tab: OpsWorkspaceTab): void
  (e: 'close' | 'pin', id: string): void
  (e: 'newTab'): void
}>()
</script>

<template>
  <div class="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-sand text-xs select-none">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="group h-8.5 px-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all shrink-0"
      :class="tab.id === activeId ? 'bg-ink text-paper border-ink shadow-2xs font-bold' : 'bg-white border-sand text-slate-700 hover:bg-sand/30'"
      @click="emit('select', tab)"
    >
      <button
        v-if="tab.isPinned"
        type="button"
        title="سنجاق‌شده"
        class="opacity-70 group-hover:opacity-100 transition-opacity"
        @click.stop="emit('pin', tab.id)"
      >
        <Pin class="w-3 h-3 text-rose rotate-45" />
      </button>

      <span>{{ tab.title }}</span>

      <span
        v-if="tab.badge"
        class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
        :class="tab.id === activeId ? 'bg-white/20 text-white' : 'bg-rose/10 text-rose'"
      >
        {{ tab.badge }}
      </span>

      <button
        v-if="tab.isClosable && !tab.isPinned"
        type="button"
        class="opacity-40 hover:opacity-100 p-0.5 rounded transition-opacity"
        @click.stop="emit('close', tab.id)"
      >
        <X class="w-3 h-3" />
      </button>
    </div>

    <button
      type="button"
      title="افزودن تب جدید"
      class="w-7 h-7 rounded-lg border border-sand bg-sand/20 hover:bg-sand/40 text-muted-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors"
      @click="emit('newTab')"
    >
      <Plus class="w-3.5 h-3.5" />
    </button>
  </div>
</template>
