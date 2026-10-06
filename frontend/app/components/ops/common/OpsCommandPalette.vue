<!-- frontend/app/components/ops/common/OpsCommandPalette.vue -->
<script setup lang="ts">
import { Search, Plus, Package, Truck, CreditCard, BookOpen, ArrowLeft } from '@lucide/vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'navigate' | 'triggerAction', payload: string): void
}>()

const query = ref('')

const shortcuts = [
  { id: 'nav_dashboard', title: 'پیشخوان و آمار فروش', icon: Package, group: 'بخش‌ها', path: '/internal-ops-nexus' },
  { id: 'nav_products', title: 'مدیریت محصولات و لباس‌ها', icon: Package, group: 'بخش‌ها', path: '/internal-ops-nexus/products' },
  { id: 'nav_orders', title: 'سفارش‌ها و ارسال مرسولات', icon: Truck, group: 'بخش‌ها', path: '/internal-ops-nexus/orders' },
  { id: 'nav_discounts', title: 'تخفیف‌ها و کدهای پروموشن', icon: CreditCard, group: 'بخش‌ها', path: '/internal-ops-nexus/discounts' },
  { id: 'nav_articles', title: 'مجله، مقالات و روایات ادیتوریال', icon: BookOpen, group: 'بخش‌ها', path: '/internal-ops-nexus/articles' },
  { id: 'act_new_product', title: 'افزودن محصول جدید به کاتالوگ', icon: Plus, group: 'عملیات سریع', path: '/internal-ops-nexus/products/new' },
  { id: 'act_new_article', title: 'نگارش مقاله جدید برای ژورنال', icon: Plus, group: 'عملیات سریع', path: '/internal-ops-nexus/articles/new' },
]

const filteredShortcuts = computed(() => {
  if (!query.value.trim()) return shortcuts
  const q = query.value.trim().toLowerCase()
  return shortcuts.filter(s => s.title.toLowerCase().includes(q) || s.group.includes(q))
})

const handleSelect = (item: (typeof shortcuts)[0]) => {
  emit('update:open', false)
  query.value = ''
  if (item.path) {
    emit('navigate', item.path)
  }
}

// گوش‌به‌زنگ میانبر کیبورد Ctrl+K / Cmd+K
onMounted(() => {
  const onKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      emit('update:open', !props.open)
    } else if (e.key === 'Escape' && props.open) {
      emit('update:open', false)
    }
  }
  window.addEventListener('keydown', onKeydown)
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    @click.self="emit('update:open', false)"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- ورودی دستور -->
      <div class="p-3.5 border-b border-sand flex items-center gap-3 bg-paper">
        <Search class="w-5 h-5 text-rose shrink-0" />
        <input
          v-model="query"
          type="text"
          placeholder="دستور یا کلمه مورد نظر را بنویسید (مثال: محصول، سفارش، مالی)..."
          class="flex-1 bg-transparent text-sm text-ink placeholder:text-muted-foreground focus:outline-hidden"
          autofocus
        >
        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-sand/60 text-muted-foreground">ESC</span>
      </div>

      <!-- فهرست نتایج -->
      <div class="max-h-80 overflow-y-auto p-2 space-y-1">
        <button
          v-for="item in filteredShortcuts"
          :key="item.id"
          type="button"
          class="w-full p-2.5 rounded-xl hover:bg-sand/30 flex items-center justify-between text-xs text-start transition-colors cursor-pointer group"
          @click="handleSelect(item)"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-lg bg-sand/40 group-hover:bg-ink group-hover:text-paper text-ink flex items-center justify-center transition-colors">
              <component :is="item.icon" class="w-3.5 h-3.5" />
            </div>
            <div>
              <span class="font-bold text-ink block">{{ item.title }}</span>
              <span class="text-2xs text-muted-foreground">{{ item.group }}</span>
            </div>
          </div>
          <ArrowLeft class="w-3.5 h-3.5 text-muted-foreground group-hover:text-ink transition-transform group-hover:-translate-x-1" />
        </button>

        <div v-if="filteredShortcuts.length === 0" class="p-6 text-center text-xs text-muted-foreground">
          دستور یا موردی مطابق با جست‌وجوی شما یافت نشد.
        </div>
      </div>

      <!-- راهنمای کلیدها -->
      <div class="p-2.5 bg-sand/20 border-t border-sand flex items-center justify-between text-[11px] text-muted-foreground px-4">
        <span>برای اجرای هر دستور، روی آن کلیک کنید یا اینتر بزنید.</span>
        <span class="font-mono">میانبر: ⌘K / Ctrl+K</span>
      </div>
    </div>
  </div>
</template>
