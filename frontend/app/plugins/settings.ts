// frontend/app/plugins/settings.ts
export default defineNuxtPlugin(async () => {
  const settingsStore = useSettingsStore()
  if (!settingsStore.isHydrated) {
    await settingsStore.fetchSettings()
    settingsStore.isHydrated = true
  }
})

