<!-- frontend/app/components/ops/orders/AdminOrdersTableSkeleton.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
  }>(),
  {
    rows: 5,
  },
)
</script>

<template>
  <tbody class="divide-y divide-slate-100 animate-pulse">
    <tr v-for="i in rows" :key="i" class="bg-white">
      <!-- کد سفارش و تاریخ -->
      <td class="p-3.5 space-y-2">
        <div class="h-4 w-20 bg-slate-200 rounded-md" />
        <div class="h-3 w-16 bg-slate-100 rounded-md" />
      </td>

      <!-- خریدار و نشانی -->
      <td class="p-3.5 space-y-2">
        <div class="h-4 w-28 bg-slate-200 rounded-md" />
        <div class="h-3 w-36 bg-slate-100 rounded-md" />
      </td>

      <!-- اقلام بسته -->
      <td class="p-3.5 space-y-1.5">
        <div class="h-4 w-32 bg-slate-200 rounded-md" />
        <div class="h-3 w-20 bg-slate-100 rounded-md" />
      </td>

      <!-- شرکت حمل و بارکد -->
      <td class="p-3.5 space-y-2">
        <div class="h-4 w-24 bg-slate-200 rounded-md" />
        <div class="h-3 w-32 bg-slate-100 rounded-md" />
      </td>

      <!-- مبلغ کل -->
      <td class="p-3.5">
        <div class="h-4 w-20 bg-slate-200 rounded-md" />
      </td>

      <!-- سلکتور وضعیت -->
      <td class="p-3.5">
        <div class="h-8 w-36 bg-slate-100 rounded-lg" />
      </td>

      <!-- عملیات -->
      <td class="p-3.5 text-end">
        <div class="flex items-center justify-end gap-1.5">
          <div class="w-7 h-7 bg-slate-200 rounded-lg" />
          <div class="w-7 h-7 bg-slate-200 rounded-lg" />
          <div class="w-7 h-7 bg-slate-200 rounded-lg" />
        </div>
      </td>
    </tr>
  </tbody>
</template>

