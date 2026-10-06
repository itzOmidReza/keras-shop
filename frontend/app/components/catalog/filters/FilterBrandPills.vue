<script setup lang="ts">
import { useTaxonomyStore } from '~/stores/taxonomy'

defineProps<{
  modelValue?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | null): void
}>()

const taxonomyStore = useTaxonomyStore()

function toggleBrand(slug: string, current?: string | null) {
  emit('update:modelValue', current === slug ? null : slug)
}
</script>

<template>
  <div class="space-y-2.5 border-t border-sand/60 pt-4">
    <div class="flex items-center justify-between">
      <h4 class="text-xs font-bold text-ink">
        برندهای همکار و آتلیه
      </h4>
      <span
        v-if="modelValue"
        class="text-[10px] text-rose font-medium cursor-pointer"
        @click="emit('update:modelValue', null)"
      >
        حذف فیلتر برند
      </span>
    </div>
    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="b in taxonomyStore.brands"
        :key="b.id || b.slug"
        type="button"
        class="flex flex-col items-start rounded-xl px-2.5 py-2 text-start transition-all cursor-pointer border"
        :class="[
          modelValue === b.slug
            ? 'border-rose bg-rose text-white shadow-xs font-bold'
            : 'border-sand bg-white text-ink hover:border-sand/80 hover:bg-sand/20',
        ]"
        @click="toggleBrand(b.slug, modelValue)"
      >
        <span class="text-xs font-bold">{{ b.name }}</span>
        <span
          class="text-[10px] tracking-wider transition-colors font-mono"
          :class="modelValue === b.slug ? 'text-white/80' : 'text-muted-foreground'"
        >
          {{ b.slug }}
        </span>
      </button>
    </div>
  </div>
</template>
