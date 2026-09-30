<script setup lang="ts">
import { ConfigProvider } from 'reka-ui'
</script>
<template>
  <ConfigProvider dir="rtl">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>
