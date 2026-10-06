<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <ConfigProvider dir="rtl">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
    <Toaster dir="rtl" position="bottom-center" />
  </ConfigProvider>
</template>
