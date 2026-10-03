<script setup lang="ts">
import { AVAILABLE_SEASONS } from '~/composables/catalog/useCatalogFilters'
import type { ProductSeason } from '~/types/domain'

defineProps<{
  modelValue: ProductSeason | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: ProductSeason | null): void
}>()

function toggleSeason(seasonId: ProductSeason, current: ProductSeason | null) {
  emit('update:modelValue', current === seasonId ? null : seasonId)
}
</script>

<template>
  <div class="space-y-2.5">
    <h4 class="text-xs font-bold text-ink">
      فصل و کالکشن
    </h4>
    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="s in AVAILABLE_SEASONS"
        :key="s.id"
        type="button"
        class="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-all cursor-pointer border"
        :class="[
          modelValue === s.id
            ? 'border-rose bg-rose text-white shadow-xs'
            : 'border-sand bg-white text-ink hover:bg-sand/20',
        ]"
        @click="toggleSeason(s.id, modelValue)"
      >
        <span>{{ s.label }}</span>
        <span
          v-if="s.badge"
          class="text-[9px] px-1.5 py-0.2 rounded-full"
          :class="modelValue === s.id ? 'bg-white/20 text-white' : 'bg-rose/10 text-rose'"
        >
          {{ s.badge }}
        </span>
      </button>
    </div>
  </div>
</template>
