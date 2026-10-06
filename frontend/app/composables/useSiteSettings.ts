// app/composables/useSiteSettings.ts
import { useSettingsStore } from '~/stores/settings'

export function useSiteSettings() {
  const store = useSettingsStore()

  const settings = computed(() => store.settings)
  const branding = computed(() => store.settings.branding)
  const contact = computed(() => store.settings.contact)
  const shipping = computed(() => store.settings.shipping)
  const checkoutRules = computed(() => store.settings.checkoutRules)
  const social = computed(() => store.settings.social)
  const integrations = computed(() => store.settings.integrations)

  // دسترسی سریع به متغیرهای پراستفاده
  const freeShippingThreshold = computed(() => store.settings.shipping.freeShippingThreshold)
  const flatShippingFee = computed(() => store.settings.shipping.flatShippingFee)
  const estimatedDispatchText = computed(() => store.settings.shipping.estimatedDispatchText)
  const announcementBarText = computed(() => store.settings.shipping.announcementBarText)
  const announcementBarHighlight = computed(() => store.settings.shipping.announcementBarHighlight)
  const isAnnouncementVisible = computed(() => store.settings.shipping.announcementBarVisible)
  const brandNameFa = computed(() => store.settings.branding.brandNameFa)
  const brandNameEn = computed(() => store.settings.branding.brandNameEn)
  const isHolidayMode = computed(() => store.settings.checkoutRules.holidayModeEnabled)
  const holidayNoticeText = computed(() => store.settings.checkoutRules.holidayNoticeText)
  const returnPolicyDays = computed(() => store.settings.checkoutRules.returnPolicyDays)
  const minCartTotal = computed(() => store.settings.checkoutRules.minCartTotal)
  const maxItemQuantity = computed(() => store.settings.checkoutRules.maxItemQuantityPerCart)

  return {
    settings,
    branding,
    contact,
    shipping,
    checkoutRules,
    social,
    integrations,
    freeShippingThreshold,
    flatShippingFee,
    estimatedDispatchText,
    announcementBarText,
    announcementBarHighlight,
    isAnnouncementVisible,
    brandNameFa,
    brandNameEn,
    isHolidayMode,
    holidayNoticeText,
    returnPolicyDays,
    minCartTotal,
    maxItemQuantity,
    isLoading: computed(() => store.isLoading),
    isSaving: computed(() => store.isSaving),
    fetchSettings: store.fetchSettings,
    updateSettings: store.updateSettings,
    resetSettings: store.resetSettings,
  }
}

export default useSiteSettings

