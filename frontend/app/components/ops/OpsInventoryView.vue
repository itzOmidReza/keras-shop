<script setup lang="ts">
const { variantInventory } = useOpsInventory()
</script>

<template>
  <section data-testid="nexus-inventory-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          ماتریس موجودی انبار و متغیرهای سایز
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          کنترل متمرکز موجودی‌های S, M, L و هشدارهای اتوماتیک کسری انبار
        </p>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">کالا و رنگ</th>
              <th class="p-3.5 text-center">XS</th>
              <th class="p-3.5 text-center">S</th>
              <th class="p-3.5 text-center">M</th>
              <th class="p-3.5 text-center">L</th>
              <th class="p-3.5 text-center">XL</th>
              <th class="p-3.5 text-center">Free</th>
              <th class="p-3.5 text-start">رزرو شده</th>
              <th class="p-3.5 text-end">وضعیت کسری</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr
              v-for="(row, idx) in variantInventory"
              :key="idx"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="p-3.5 font-sans">
                <div class="flex items-center gap-2">
                  <span class="w-3.5 h-3.5 rounded-full inline-block shrink-0" :class="row.colorClass" />
                  <div>
                    <span class="font-bold text-slate-900 block">{{ row.productTitle }}</span>
                    <span class="text-[10px] text-slate-500 block mt-0.5">{{ row.color }}</span>
                  </div>
                </div>
              </td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockXS }}</td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockS }}</td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockM }}</td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockL }}</td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockXL }}</td>
              <td class="p-3.5 text-center font-bold text-slate-700">{{ row.stockFree }}</td>
              <td class="p-3.5 text-slate-500">{{ row.reserved }} عدد</td>
              <td class="p-3.5 text-end font-sans">
                <span
                  v-if="row.isUrgentLow"
                  class="px-2 py-0.5 rounded-md font-bold text-[11px] bg-rose-50 text-rose border border-rose/30"
                >
                  کسری انبار
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  مطلوب
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
