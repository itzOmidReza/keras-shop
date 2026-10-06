<!-- frontend/app/components/ops/products/AdminProductDeleteModal.vue -->
<script setup lang="ts">
import type { ProductDetail } from '~/types/domain'

defineProps<{
  open: boolean
  product: ProductDetail | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans"
      role="dialog"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
        <h3 class="text-sm font-bold text-slate-900">حذف محصول از کاتالوگ</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          آیا از حذف محصول «<strong>{{ product?.title }}</strong>» اطمینان دارید؟ این عمل غیرقابل بازگشت است.
        </p>
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="h-8.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="emit('update:open', false)"
          >
            انصراف
          </button>
          <button
            type="button"
            class="h-8.5 px-4 rounded-xl bg-rose text-white text-xs font-bold cursor-pointer"
            @click="emit('confirm')"
          >
            تایید حذف
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
