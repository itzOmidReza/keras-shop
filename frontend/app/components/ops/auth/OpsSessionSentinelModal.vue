<!-- frontend/app/components/ops/auth/OpsSessionSentinelModal.vue -->
<script setup lang="ts">
import { Laptop, Smartphone, Monitor, ShieldAlert, LogOut, X } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsRbacStore } from '~/stores/ops/authGuard'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const rbacStore = useOpsRbacStore()

const handleRevoke = (id: string, device: string) => {
  rbacStore.revokeSession(id)
  toast.success(`نشست فعال روی ${device} با موفقیت قطع شد`)
}

const getDeviceIcon = (device: string) => {
  if (device.includes('iPad') || device.includes('Phone')) return Smartphone
  if (device.includes('MacBook') || device.includes('Laptop')) return Laptop
  return Monitor
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
            <ShieldAlert class="w-4 h-4 text-rose" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">دیده‌بان نشست‌های فعال و امنیت پایانه</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">پایش و قطع دسترسی نشست‌های متصل به پنل عملیات</p>
          </div>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-ink cursor-pointer p-1"
          @click="emit('update:open', false)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-5 space-y-3 max-h-96 overflow-y-auto">
        <div
          v-for="sess in rbacStore.sessions"
          :key="sess.id"
          class="p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          :class="sess.isCurrent ? 'bg-sand/20 border-sand' : 'bg-white border-sand/70 hover:border-sand'"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              :class="sess.isCurrent ? 'bg-ink text-paper' : 'bg-sand/40 text-ink'"
            >
              <component :is="getDeviceIcon(sess.device)" class="w-4 h-4" />
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-ink">{{ sess.device }}</span>
                <span
                  v-if="sess.isCurrent"
                  class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800"
                >
                  نشست جاری شما
                </span>
              </div>
              <p class="text-2xs text-muted-foreground mt-0.5 font-mono">
                {{ sess.browser }} • IP: {{ sess.ip }}
              </p>
              <div class="text-2xs text-muted-foreground mt-1 flex items-center gap-2">
                <span>{{ sess.location }}</span>
                <span>•</span>
                <span>فعالیت: {{ sess.lastHeartbeat }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 sm:self-center">
            <button
              v-if="!sess.isCurrent"
              type="button"
              class="h-8 px-2.5 rounded-lg border border-rose/30 bg-rose/5 hover:bg-rose/10 text-rose text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              @click="handleRevoke(sess.id, sess.device)"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span>قطع نشست</span>
            </button>
            <span v-else class="text-2xs font-bold text-emerald-600 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>آنلاین</span>
            </span>
          </div>
        </div>
      </div>

      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-between">
        <span class="text-2xs text-muted-foreground">در صورت مشاهده دستگاه ناشناس، فوراً نشست را خاتمه دهید.</span>
        <button
          type="button"
          class="h-8 px-3 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 cursor-pointer"
          @click="emit('update:open', false)"
        >
          بستن دیده‌بان
        </button>
      </div>
    </div>
  </div>
</template>
