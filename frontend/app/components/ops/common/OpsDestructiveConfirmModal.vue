<!-- frontend/app/components/ops/common/OpsDestructiveConfirmModal.vue -->
<script setup lang="ts">
import { AlertOctagon, X, Trash2 } from '@lucide/vue'

const props = defineProps<{
  open: boolean
  title: string
  description: string
  confirmPhrase?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'confirmed'): void
}>()

const inputPhrase = ref('')
const requiredPhrase = computed(() => props.confirmPhrase || 'تایید حذف نهایی')
const isMatched = computed(() => inputPhrase.value.trim() === requiredPhrase.value)

const handleConfirm = () => {
  if (!isMatched.value) return
  emit('confirmed')
  emit('update:open', false)
  inputPhrase.value = ''
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-rose/30 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between bg-rose/5">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-rose/10 text-rose flex items-center justify-center">
            <AlertOctagon class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-rose">{{ title }}</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">عملیات غیرقابل‌بازگشت سیستمی</p>
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

      <div class="p-5 space-y-4 text-xs">
        <p class="text-slate-700 leading-relaxed">{{ description }}</p>

        <div class="p-3 bg-rose/5 border border-rose/20 rounded-xl space-y-2">
          <span class="text-2xs text-rose font-bold block">
            جهت تایید نهایی، عبارت «<strong>{{ requiredPhrase }}</strong>» را در کادر زیر بنویسید:
          </span>
          <input
            v-model="inputPhrase"
            type="text"
            :placeholder="requiredPhrase"
            class="w-full h-9 px-3 rounded-xl border border-rose/30 bg-white text-xs font-bold text-ink focus:outline-hidden focus:border-rose"
          >
        </div>
      </div>

      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-3 rounded-xl border border-sand bg-white text-xs font-bold text-ink hover:bg-sand/30 cursor-pointer"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
        <button
          type="button"
          :disabled="!isMatched"
          class="h-9 px-4 rounded-xl bg-rose text-white text-xs font-bold hover:bg-rose/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
          @click="handleConfirm"
        >
          <Trash2 class="w-4 h-4" />
          <span>تایید و اجرای عملیات</span>
        </button>
      </div>
    </div>
  </div>
</template>
