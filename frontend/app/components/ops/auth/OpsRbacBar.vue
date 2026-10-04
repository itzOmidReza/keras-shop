<!-- frontend/app/components/ops/auth/OpsRbacBar.vue -->
<script setup lang="ts">
import { Shield, Key, Laptop, History, CheckCircle2 } from '@lucide/vue'
import { useOpsRbacStore, type OpsRole } from '~/stores/ops/authGuard'
import { toFa } from '~/utils/format'

const rbacStore = useOpsRbacStore()

const emit = defineEmits<{
  (e: 'open2fa' | 'openSessions' | 'openAudit'): void
}>()

const rolesList: { id: OpsRole; title: string; badge: string }[] = [
  { id: 'super_admin', title: 'مدیر ارشد آتلیه', badge: 'دسترسی کامل' },
  { id: 'warehouse_manager', title: 'سرپرست لجستیک و انبار', badge: 'انبار و ارسال' },
  { id: 'accountant', title: 'حسابدار ارشد', badge: 'مالی و گزارش' },
  { id: 'support_agent', title: 'کارشناس امور مشتریان', badge: 'پشتیبانی و مرجوعی' },
]
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-4 shadow-2xs space-y-3">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <!-- اطلاعات اپراتور جاری -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-ink text-paper font-black flex items-center justify-center text-sm shadow-2xs shrink-0">
          {{ rbacStore.currentOperator.avatar }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-ink">{{ rbacStore.currentOperator.name }}</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand/60 text-ink">
              <Shield class="w-3 h-3 text-rose" />
              <span>نقش فعال</span>
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-0.5 font-mono">
            {{ rbacStore.currentOperator.ip }} • آخرین ورود: {{ rbacStore.currentOperator.lastLogin }}
          </p>
        </div>
      </div>

      <!-- کنترل‌های سریع امنیتی -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- دکمه احراز هویت دو مرحله‌ای (2FA) -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg border border-sand bg-paper hover:bg-sand/30 text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="emit('open2fa')"
        >
          <Key class="w-3.5 h-3.5 text-rose" />
          <span>امنیت 2FA</span>
          <span
            class="w-2 h-2 rounded-full"
            :class="rbacStore.currentOperator.is2FaEnabled ? 'bg-emerald-500' : 'bg-amber-500'"
          />
        </button>

        <!-- دیده‌بان نشست‌های فعال -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg border border-sand bg-paper hover:bg-sand/30 text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="emit('openSessions')"
        >
          <Laptop class="w-3.5 h-3.5 text-slate-600" />
          <span>نشست‌ها ({{ toFa(rbacStore.sessions.length) }})</span>
        </button>

        <!-- دفتر رخدادها و ممیزی -->
        <button
          type="button"
          class="h-8 px-2.5 rounded-lg border border-sand bg-paper hover:bg-sand/30 text-ink text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="emit('openAudit')"
        >
          <History class="w-3.5 h-3.5 text-slate-600" />
          <span>دفتر ممیزی</span>
        </button>

        <!-- انتخابگر سریع نقش (جهت تست و شبیه‌سازی RBAC) -->
        <div class="flex items-center gap-1 ps-2 border-s border-sand">
          <span class="text-2xs text-muted-foreground">شبیه‌سازی:</span>
          <select
            :value="rbacStore.currentRole"
            class="h-8 text-xs font-bold bg-sand/30 border border-sand rounded-lg px-2 text-ink cursor-pointer focus:outline-hidden"
            @change="rbacStore.switchRole(($event.target as HTMLSelectElement).value as OpsRole)"
          >
            <option v-for="r in rolesList" :key="r.id" :value="r.id">
              {{ r.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- نوار دسترسی‌های فعال نقش -->
    <div class="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-sand/50 text-2xs text-muted-foreground">
      <span class="font-bold text-ink shrink-0">مجوزهای فعال نقش:</span>
      <span
        v-for="perm in rbacStore.permissions"
        :key="perm"
        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sand/20 text-ink font-mono shrink-0"
      >
        <CheckCircle2 class="w-2.5 h-2.5 text-emerald-600" />
        <span>{{ perm }}</span>
      </span>
    </div>
  </div>
</template>
