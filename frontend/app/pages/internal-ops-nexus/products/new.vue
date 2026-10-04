<!-- frontend/app/pages/internal-ops-nexus/products/new.vue -->
<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import ProductStudioIdentity from '~/components/ops/product-studio/ProductStudioIdentity.vue'
import ProductStudioMedia from '~/components/ops/product-studio/ProductStudioMedia.vue'
import ProductStudioVariants from '~/components/ops/product-studio/ProductStudioVariants.vue'
import ProductStudioSpecs from '~/components/ops/product-studio/ProductStudioSpecs.vue'
import ProductStudioSizeChart from '~/components/ops/product-studio/ProductStudioSizeChart.vue'
import ProductStudioStrategy from '~/components/ops/product-studio/ProductStudioStrategy.vue'
import ProductStudioInspector from '~/components/ops/product-studio/ProductStudioInspector.vue'
import ProductStudioActionBar from '~/components/ops/product-studio/ProductStudioActionBar.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'افزودن محصول جدید به کاتالوگ آتلیه | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const router = useRouter()
const {
  initNewProduct,
  saveStudioProduct,
  isDirty,
} = useOpsProductStudio()

const isSaving = ref(false)

onMounted(() => {
  initNewProduct()
})

onBeforeRouteLeave((_to, _from, next) => {
  if (isDirty.value) {
    const confirmLeave = window.confirm('تغییرات ذخیره‌نشده‌ای در استودیو اثر وجود دارد. آیا از خروج اطمینان دارید؟')
    if (confirmLeave) next()
    else next(false)
  } else {
    next()
  }
})

const handleSave = () => {
  isSaving.value = true
  try {
    const saved = saveStudioProduct()
    if (saved) {
      router.push('/internal-ops-nexus/products')
    }
  } finally {
    isSaving.value = false
  }
}

const handleSaveDraft = () => {
  const saved = saveStudioProduct()
  if (saved) {
    toast.success('پیش‌نویس اثر با موفقیت ذخیره گردید.')
  }
}

const handlePreview = () => {
  toast.info('پیش‌نمایش زنده در پنل ناظر سمت چپ فعال است.')
}

const handlePrintHangtag = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-28 font-sans">
    <!-- هدر صفحه و دکمه بازگشت به کاتالوگ -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-200/80">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/internal-ops-nexus/products"
          class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          title="بازگشت به کاتالوگ محصولات"
        >
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            افزودن محصول جدید به کاتالوگ آتلیه
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            ثبت شناسنامه کامل اثر، کالیته رنگ، ماتریس سایزبندی و استراتژی تجاری
          </p>
        </div>
      </div>
    </div>

    <!-- چیدمان ۲ ستونه آتلیه: ستون فرم اصلی + ستون ناظر چسبان -->
    <div class="grid grid-cols-12 gap-6 items-start">
      <!-- ستون فرم‌های اصلی (۸ ستون) -->
      <div class="col-span-12 xl:col-span-8 space-y-6">
        <ProductStudioIdentity />
        <ProductStudioMedia />
        <ProductStudioVariants />
        <ProductStudioSpecs />
        <ProductStudioSizeChart />
        <ProductStudioStrategy />
      </div>

      <!-- ستون ناظر و پیشرفت چسبان (۴ ستون) -->
      <div class="col-span-12 xl:col-span-4 sticky top-20 self-start">
        <ProductStudioInspector />
      </div>
    </div>

    <!-- نوار چسبان اکشن ذخیره -->
    <ProductStudioActionBar
      :is-saving="isSaving"
      :is-editing="false"
      @save="handleSave"
      @save-draft="handleSaveDraft"
      @preview="handlePreview"
      @print-hangtag="handlePrintHangtag"
    />
  </div>
</template>

