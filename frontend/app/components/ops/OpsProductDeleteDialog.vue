<script setup lang="ts">
const {
  isDeleteProductDialogOpen,
  productToDelete,
  confirmDeleteProduct,
} = useOpsProducts()
</script>

<template>
  <!-- دیالوگ تایید حذف محصول -->
  <Dialog :open="isDeleteProductDialogOpen" @update:open="isDeleteProductDialogOpen = $event">
    <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-xl">
      <DialogHeader>
        <DialogTitle class="text-base font-black text-rose">
          تایید حذف کالا از کاتالوگ
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-600">
          آیا از حذف محصول «{{ productToDelete?.title }}» اطمینان دارید؟ این عمل کالا را از ویترین فروشگاه خارج می‌سازد.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center justify-end gap-2 pt-4">
        <button
          type="button"
          class="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          @click="isDeleteProductDialogOpen = false"
        >
          انصراف
        </button>
        <button
          type="button"
          data-testid="confirm-delete-product-btn"
          class="h-9 px-5 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold cursor-pointer"
          @click="confirmDeleteProduct"
        >
          بله، حذف شود
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
