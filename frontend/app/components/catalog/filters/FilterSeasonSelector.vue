<script setup lang="ts">
import { useTaxonomyStore } from '~/stores/taxonomy'
import type { ProductSeason } from '~/types/domain'

defineProps<{
  modelValue: ProductSeason | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: ProductSeason | null): void
}>()

const taxonomyStore = useTaxonomyStore()

function toggleSeason(seasonSlug: string, current: ProductSeason | null) {
  emit('update:modelValue', current === (seasonSlug as ProductSeason) ? null : (seasonSlug as ProductSeason))
}
</script>

<template>
  <div class="space-y-2.5">
    <h4 class="text-xs font-bold text-ink">
      فصل و کالکشن
    </h4>
    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="s in taxonomyStore.activeSeasons"
        :key="s.id || s.slug"
        type="button"
        class="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition-all cursor-pointer border"
        :class="[
          modelValue === s.slug
            ? 'border-rose bg-rose text-white shadow-xs'
            : 'border-sand bg-white text-ink hover:bg-sand/20',
        ]"
        @click="toggleSeason(s.slug, modelValue)"
      >
        <span>{{ s.name }}</span>
        <span
          v-if="s.isCurrentDrop"
          class="text-[9px] px-1.5 py-0.2 rounded-full"
          :class="modelValue === s.slug ? 'bg-white/20 text-white' : 'bg-rose/10 text-rose'"
        >
          جاری
        </span>
      </button>
    </div>
  </div>
</template>
