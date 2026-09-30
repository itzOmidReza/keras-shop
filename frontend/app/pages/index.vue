<!-- app/pages/index.vue -->
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <main class="mx-auto max-w-md space-y-4 p-4">
    <Card>
      <CardHeader>
        <CardTitle>تست راست‌به‌چپ</CardTitle>
      </CardHeader>
      <CardContent class="space-y-3">
        <Input placeholder="نام" />
        <Input dir="ltr" class="text-start" placeholder="09123456789" inputmode="numeric" />
        <Button>به سبد اضافه کن</Button>
      </CardContent>
    </Card>
  </main>
</template>
