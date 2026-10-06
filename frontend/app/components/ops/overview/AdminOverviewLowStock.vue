<!-- frontend/app/components/ops/overview/AdminOverviewLowStock.vue -->
<script setup lang="ts">
import { ChevronLeft, Shirt } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  items: {
    title: string
    size: string
    color: string
    stock: number
    image?: string
  }[]
}>()
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-rose" />
        <h2 class="text-sm font-bold text-slate-900">
          هشدار شارژ موجودی انبار
        </h2>
      </div>
      <NuxtLink
        to="/internal-ops-nexus/products"
        class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
      >
        <span>کاتالوگ کالاها</span>
        <ChevronLeft class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>

    <div v-if="items.length === 0" class="p-8 text-center text-slate-400 text-xs">
      تمام کالاها دارای موجودی کافی هستند.
    </div>

    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="(item, idx) in items.slice(0, 5)"
        :key="idx"
        class="py-2.5 flex items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="w-9 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
          >
          <div v-else class="w-9 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Shirt class="w-4 h-4 text-slate-400" />
          </div>

          <div class="min-w-0">
            <h4 class="font-bold text-slate-900 truncate text-[11px]">{{ item.title }}</h4>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
              <span>سایز: <strong>{{ item.size }}</strong></span>
              <span>•</span>
              <span>{{ item.color }}</span>
            </div>
          </div>
        </div>

        <div class="shrink-0 text-end">
          <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-50 text-rose border border-rose-200">
            {{ toFa(item.stock) }} عدد
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
