<!-- frontend/app/components/catalog/CatalogSkeleton.vue -->
<template>
  <div class="flex flex-col overflow-hidden">
    <!-- تصویر شاخص با نسبت ۴:۵ -->
    <div class="aspect-4/5 w-full rounded-2xl bg-sand/45 animate-pulse" />

    <!-- اطلاعات متنی عنوان و قیمت -->
    <div class="mt-3 flex flex-col gap-2 px-1">
      <div class="h-3.5 w-3/4 rounded-md bg-sand/60 animate-pulse" />
      <div class="flex items-center justify-between pt-1">
        <div class="h-3.5 w-1/3 rounded-md bg-sand/50 animate-pulse" />
        <div class="flex items-center gap-1">
          <div class="w-2.5 h-2.5 rounded-full bg-sand/60 animate-pulse" />
          <div class="w-2.5 h-2.5 rounded-full bg-sand/60 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>
