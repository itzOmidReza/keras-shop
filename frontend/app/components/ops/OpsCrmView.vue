<script setup lang="ts">
// CRM View - باشگاه مشتریان و اعضای رسمی آتلیه کراس
</script>

<template>
  <section data-testid="nexus-crm-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          باشگاه مشتریان و CRM آتلیه
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          مدیریت اعضای رسمی باشگاه مشتریان کراس، سطح‌بندی و ارزش سبد
        </p>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">نام خریدار</th>
              <th class="p-3.5 text-start">شماره تماس</th>
              <th class="p-3.5 text-start">سطح کاربری</th>
              <th class="p-3.5 text-start">تعداد سفارشات</th>
              <th class="p-3.5 text-start">مجموع خرید</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr class="hover:bg-slate-50/70">
              <td class="p-3.5 font-bold text-slate-900">سارا رادمنش</td>
              <td class="p-3.5 font-mono text-slate-600">09121112233</td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                  پلاتینوم آتلیه
                </span>
              </td>
              <td class="p-3.5 font-mono">۴ سفارش</td>
              <td class="p-3.5 font-mono font-bold text-slate-900">۷,۵۵۰,۰۰۰ تومان</td>
            </tr>
            <tr class="hover:bg-slate-50/70">
              <td class="p-3.5 font-bold text-slate-900">سارا ملکی</td>
              <td class="p-3.5 font-mono text-slate-600">09123456789</td>
              <td class="p-3.5">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                  طلایی
                </span>
              </td>
              <td class="p-3.5 font-mono">۲ سفارش</td>
              <td class="p-3.5 font-mono font-bold text-slate-900">۳,۷۹۰,۰۰۰ تومان</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
