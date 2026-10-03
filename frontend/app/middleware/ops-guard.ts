// frontend/app/middleware/ops-guard.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // خطای ۴۰۴ امنیتی برای مخفی نگه داشتن کامل اندپوینت از اسکنرها و کاربران عادی
  if (!authStore.isAuthenticated || authStore.user?.role !== 'super_admin') {
    throw createError({
      statusCode: 404,
      statusMessage: 'صفحه مورد نظر یافت نشد',
      fatal: true,
    })
  }
})
