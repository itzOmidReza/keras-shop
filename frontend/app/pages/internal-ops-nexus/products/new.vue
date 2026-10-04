<!-- frontend/app/pages/internal-ops-nexus/products/new.vue -->
<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import ProductStudioIdentity from '~/components/ops/product-studio/ProductStudioIdentity.vue'
import ProductStudioMedia from '~/components/ops/product-studio/ProductStudioMedia.vue'
import ProductStudioVariants from '~/components/ops/product-studio/ProductStudioVariants.vue'
import ProductStudioSpecs from '~/components/ops/product-studio/ProductStudioSpecs.vue'
import ProductStudioSizeChart from '~/components/ops/product-studio/ProductStudioSizeChart.vue'
import ProductStudioStrategy from '~/components/ops/product-studio/ProductStudioStrategy.vue'
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
} = useOpsProductStudio()

const isSaving = ref(false)

onMounted(() => {
  initNewProduct()
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
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-28 font-sans">
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

    <!-- بلوک‌های ۶ گانه استودیو طراحی محصول -->
    <div class="space-y-6">
      <ProductStudioIdentity />
      <ProductStudioMedia />
      <ProductStudioVariants />
      <ProductStudioSpecs />
      <ProductStudioSizeChart />
      <ProductStudioStrategy />
    </div>

    <!-- نوار چسبان اکشن ذخیره -->
    <ProductStudioActionBar
      :is-saving="isSaving"
      :is-editing="false"
      @save="handleSave"
    />
  </div>
</template>
