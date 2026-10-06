<!-- frontend/app/pages/internal-ops-nexus/settings/index.vue -->
<script setup lang="ts">
import {
  Truck,
  Phone,
  Sparkles,
  Cpu,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from '@lucide/vue'
import type { SiteSettings } from '~/types/domain'

definePageMeta({ layout: 'ops', middleware: ['ops-guard'] })
useSeoMeta({ title: 'تنظیمات فروشگاه | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const settingsStore = useSettingsStore()
const currentTab = ref('shipping')
const form = ref<SiteSettings>(JSON.parse(JSON.stringify(settingsStore.settings)))

watch(() => settingsStore.settings, (val) => {
  form.value = JSON.parse(JSON.stringify(val))
}, { deep: true })

const isDirty = computed(() => JSON.stringify(form.value) !== JSON.stringify(settingsStore.settings))

const tabs = [
  { id: 'shipping', label: 'ارسال و قوانین تسویه', icon: Truck, color: 'text-rose' },
  { id: 'contact', label: 'ارتباطات و آتلیه', icon: Phone, color: 'text-sage' },
  { id: 'branding', label: 'برندینگ و نمادها', icon: Sparkles, color: 'text-rose' },
  { id: 'integrations', label: 'سئو و ابزارها', icon: Cpu, color: 'text-clay' },
]

const handleSave = () => settingsStore.updateSettings(form.value)
const handleReset = async () => {
  await settingsStore.resetSettings()
  form.value = JSON.parse(JSON.stringify(settingsStore.settings))
}
</script>

<template>
  <div class="space-y-6 font-sans pb-24" dir="rtl" data-testid="ops-settings-workspace">
    <!-- هدر صفحه و دکمه‌های اقدام -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand pb-5">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">پیکربندی متغیرهای فروشگاه</h1>
        <p class="text-xs sm:text-sm text-muted-foreground mt-1">مدیریت متمرکز سیاست‌های حمل‌ونقل، هویت بصری، تماس و ابزارهای متصل</p>
      </div>

      <div class="flex items-center gap-3">
        <Button variant="outline" size="sm" class="h-9 px-3 text-xs font-bold rounded-xl border-sand text-muted-foreground hover:text-ink cursor-pointer flex items-center gap-1.5" :disabled="settingsStore.isSaving" @click="handleReset">
          <RotateCcw class="w-3.5 h-3.5" />
          <span>بازنشانی پیش‌فرض</span>
        </Button>
        <Button size="sm" data-testid="ops-settings-save-btn" class="h-9 px-4 text-xs font-bold rounded-xl bg-rose text-white hover:bg-rose/90 shadow-xs cursor-pointer flex items-center gap-2" :disabled="settingsStore.isSaving" @click="handleSave">
          <Loader2 v-if="settingsStore.isSaving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          <span>{{ settingsStore.isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}</span>
        </Button>
      </div>
    </header>

    <!-- تب‌های افقی ناوبری و بوم تنظیمات -->
    <Tabs v-model="currentTab" class="w-full space-y-6">
      <TabsList class="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-sand/35 rounded-2xl border border-sand">
        <TabsTrigger v-for="tab in tabs" :key="tab.id" :value="tab.id" class="py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-xs transition-all flex items-center justify-center gap-2">
          <component :is="tab.icon" class="w-4 h-4" :class="tab.color" />
          <span>{{ tab.label }}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="shipping">
        <AdminSettingsShippingTab v-model:shipping="form.shipping" v-model:checkout-rules="form.checkoutRules" />
      </TabsContent>
      <TabsContent value="contact">
        <AdminSettingsContactTab v-model:contact="form.contact" v-model:social="form.social" />
      </TabsContent>
      <TabsContent value="branding">
        <AdminSettingsBrandingTab
          v-model:branding="form.branding"
          v-model:integrations="form.integrations"
          v-model:home-hero="form.homeHero"
        />
      </TabsContent>
      <TabsContent value="integrations">
        <AdminSettingsIntegrationsTab v-model:branding="form.branding" v-model:integrations="form.integrations" />
      </TabsContent>
    </Tabs>

    <!-- داک چسبان وضعیت و ذخیره نهایی -->
    <aside class="fixed bottom-0 start-0 end-0 z-30 bg-paper/95 backdrop-blur-md border-t border-sand px-4 sm:px-8 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs">
        <template v-if="isDirty">
          <AlertCircle class="w-4 h-4 text-clay" />
          <span class="text-clay font-bold">تغییرات ذخیره‌نشده دارید.</span>
        </template>
        <template v-else>
          <CheckCircle2 class="w-4 h-4 text-sage" />
          <span class="text-muted-foreground">تمام متغیرها با سرور همگام است.</span>
        </template>
      </div>

      <Button size="sm" class="h-9 px-5 text-xs font-bold rounded-xl bg-rose text-white hover:bg-rose/90 shadow-xs cursor-pointer flex items-center gap-2" :disabled="settingsStore.isSaving" @click="handleSave">
        <Loader2 v-if="settingsStore.isSaving" class="w-4 h-4 animate-spin" />
        <Save v-else class="w-4 h-4" />
        <span>{{ settingsStore.isSaving ? 'در حال ذخیره...' : 'ذخیره نهایی' }}</span>
      </Button>
    </aside>
  </div>
</template>

