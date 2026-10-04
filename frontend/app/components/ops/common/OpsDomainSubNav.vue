<!-- frontend/app/components/ops/common/OpsDomainSubNav.vue -->
<script setup lang="ts">
import type { Component } from 'vue'

export interface DomainTabItem {
  id: string
  label: string
  icon?: Component
  badge?: string | number
  testId?: string
}

defineProps<{
  tabs: DomainTabItem[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void
}>()
</script>

<template>
  <div class="h-11 border-b border-slate-200/80 bg-white px-3 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-2xs font-sans text-xs select-none">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      :data-testid="tab.testId || `subnav-tab-${tab.id}`"
      class="h-8 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
      :class="modelValue === tab.id ? 'bg-ink text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
      @click="emit('update:modelValue', tab.id)"
    >
      <component :is="tab.icon" v-if="tab.icon" class="w-3.5 h-3.5 shrink-0" />
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.badge"
        class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold"
        :class="modelValue === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'"
      >
        {{ tab.badge }}
      </span>
    </button>
  </div>
</template>
