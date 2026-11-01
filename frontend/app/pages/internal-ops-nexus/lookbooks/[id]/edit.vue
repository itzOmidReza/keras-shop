<!-- frontend/app/pages/internal-ops-nexus/lookbooks/[id]/edit.vue -->
<script setup lang="ts">
import type { StyleLookbook } from '~/types/domain'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({
  title: 'ویرایش ست استایل ادیتوریال | مرکز عملیات کراس',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()
const { getLookbookById } = useAdminLookbooks()

const lookbookId = String(route.params.id)
const currentLookbook = ref<StyleLookbook | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  const lb = await getLookbookById(lookbookId)
  if (lb) {
    currentLookbook.value = lb
  } else {
    router.push('/internal-ops-nexus/lookbooks')
  }
  isLoading.value = false
})
</script>

<template>
  <div class="font-sans" dir="rtl">
    <div v-if="isLoading" class="p-12 text-center text-xs text-slate-500">
      در حال دریافت اطلاعات ست...
    </div>
    <AdminLookbookForm
      v-else-if="currentLookbook"
      :initial-lookbook="currentLookbook"
      :is-edit-mode="true"
    />
  </div>
</template>
