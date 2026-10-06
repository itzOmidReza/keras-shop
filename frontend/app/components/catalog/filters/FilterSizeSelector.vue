<script setup lang="ts">

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const taxonomyStore = useTaxonomyStore()

function toggleSize(size: string) {
  const current = [...props.modelValue]
  const idx = current.indexOf(size)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(size)
  }
  emit('update:modelValue', current)
}
</script>

<template>
  <div class="space-y-2.5 border-t border-sand/60 pt-4">
    <h4 class="text-xs font-bold text-ink">
      سایزبندی
    </h4>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="size in taxonomyStore.sizes"
        :key="size.id || size.name"
        type="button"
        class="h-9 min-w-9 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center shadow-2xs"
        :class="[
          modelValue.includes(size.name)
            ? 'border-rose bg-rose text-white shadow-xs'
            : 'border-sand bg-white text-ink hover:border-sand/80 hover:bg-sand/20',
        ]"
        @click="toggleSize(size.name)"
      >
        {{ size.name }}
      </button>
    </div>
  </div>
</template>
