// frontend/app/composables/useAuth.ts

/**
 * کامپوزبل اختصاصی احراز هویت و دسترسی به متدهای استور auth
 */
export function useAuth() {
  const store = useAuthStore();
  return store;
}

export default useAuth;
