// frontend/app/composables/account/useAccountDashboard.ts
import { z } from 'zod'
import { iranianMobileRegex, iranianPostalCodeRegex } from '~/utils/validation'
import type { UserOrderSummary } from '~/types/domain'

export type AccountTabType = 'overview' | 'orders' | 'addresses' | 'profile'

export function useAccountDashboard() {
  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()

  const activeTab = ref<AccountTabType>('overview')

  watch(() => route.query.tab, (newTab) => {
    if (newTab && ['overview', 'orders', 'addresses', 'profile'].includes(String(newTab))) {
      activeTab.value = newTab as AccountTabType
    }
  }, { immediate: true })

  const switchTab = (tab: AccountTabType) => {
    activeTab.value = tab
    if (route.query.tab !== tab) {
      router.replace({ query: { ...route.query, tab } })
    }
  }

  const activeTabTitle = computed(() => {
    switch (activeTab.value) {
      case 'orders': return 'سفارش‌های من'
      case 'addresses': return 'دفترچه نشانی‌ها'
      case 'profile': return 'اطلاعات فردی و امنیت'
      default: return 'پیشخوان حساب کاربری'
    }
  })

  const activeTabDescription = computed(() => {
    switch (activeTab.value) {
      case 'orders': return 'مشاهده و پیگیری تمام سفارش‌های ثبت‌شده در استودیو کراس'
      case 'addresses': return 'مدیریت و ثبت آدرس‌های تحویل مرسوله‌های پستی'
      case 'profile': return 'مشخصات هویتی، راه‌های ارتباطی و امنیت حساب کاربری'
      default: return 'خلاصه وضعیت سفارش‌های جاری و نشانی‌های تحویل در آتلیه کراس'
    }
  })

  // فرم ویرایش اطلاعات پروفایل
  const profileForm = reactive({
    fullName: '',
    email: '',
  })

  watch(() => authStore.user, (u) => {
    if (u) {
      profileForm.fullName = u.fullName || ''
      profileForm.email = u.email || ''
    }
  }, { immediate: true })

  const handleSaveProfile = async () => {
    await authStore.updateProfile({
      fullName: profileForm.fullName,
      email: profileForm.email,
    })
  }

  // فرم افزودن نشانی جدید
  const isAddressModalOpen = ref(false)
  const newAddressForm = reactive({
    title: '',
    fullName: '',
    phoneNumber: '',
    province: '',
    city: '',
    postalCode: '',
    exactAddress: '',
    buildingNumber: '',
    unit: '',
    isDefault: false,
  })
  const addressFormError = ref('')

  const openNewAddressModal = () => {
    addressFormError.value = ''
    newAddressForm.title = 'منزل'
    newAddressForm.fullName = authStore.user?.fullName || ''
    newAddressForm.phoneNumber = authStore.user?.phoneNumber || ''
    newAddressForm.province = 'تهران'
    newAddressForm.city = 'تهران'
    newAddressForm.postalCode = ''
    newAddressForm.exactAddress = ''
    newAddressForm.buildingNumber = ''
    newAddressForm.unit = ''
    newAddressForm.isDefault = authStore.addresses.length === 0
    isAddressModalOpen.value = true
  }

  const addressZodSchema = z.object({
    title: z.string().min(1, 'لطفاً عنوان نشانی را مشخص کنید.'),
    fullName: z.string().min(2, 'نام تحویل‌گیرنده الزامی است.'),
    phoneNumber: z.string().regex(iranianMobileRegex, 'شماره موبایل نامعتبر است (فرمت: ۰۹xxxxxxxxx).'),
    province: z.string().min(1, 'استان الزامی است.'),
    city: z.string().min(1, 'شهر الزامی است.'),
    postalCode: z.string().regex(iranianPostalCodeRegex, 'کد پستی باید دقیقاً ۱۰ رقم باشد.'),
    exactAddress: z.string().min(10, 'آدرس پستی باید حداقل ۱۰ حرف و شامل جزئیات باشد.'),
  })

  const handleCreateAddress = async () => {
    addressFormError.value = ''

    const cleanPhone = toEn(newAddressForm.phoneNumber.trim())
    const cleanPostal = toEn(newAddressForm.postalCode.trim())

    const validation = addressZodSchema.safeParse({
      title: newAddressForm.title.trim(),
      fullName: newAddressForm.fullName.trim(),
      phoneNumber: cleanPhone,
      province: newAddressForm.province,
      city: newAddressForm.city.trim(),
      postalCode: cleanPostal,
      exactAddress: newAddressForm.exactAddress.trim(),
    })

    if (!validation.success) {
      addressFormError.value = validation.error.errors[0]?.message || 'اطلاعات وارد شده نامعتبر است.'
      return
    }

    const success = await authStore.addAddress({
      title: newAddressForm.title.trim(),
      fullName: newAddressForm.fullName.trim(),
      phoneNumber: cleanPhone,
      province: newAddressForm.province,
      city: newAddressForm.city.trim(),
      postalCode: cleanPostal,
      exactAddress: newAddressForm.exactAddress.trim(),
      buildingNumber: newAddressForm.buildingNumber.trim() || undefined,
      unit: newAddressForm.unit.trim() || undefined,
      isDefault: newAddressForm.isDefault,
    })

    if (success) {
      isAddressModalOpen.value = false
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm('آیا از حذف این نشانی از حساب خود اطمینان دارید؟')
      if (!confirmed) return
    }
    await authStore.deleteAddress(id)
  }

  // محاسبه آمار پیشخوان
  const activeOrdersCount = computed(() => {
    return authStore.orders.filter((o: UserOrderSummary) => o.status === 'processing').length
  })
  const recentOrder = computed(() => authStore.orders[0] || null)

  return {
    authStore,
    activeTab,
    switchTab,
    activeTabTitle,
    activeTabDescription,
    profileForm,
    handleSaveProfile,
    isAddressModalOpen,
    newAddressForm,
    addressFormError,
    openNewAddressModal,
    handleCreateAddress,
    handleDeleteAddress,
    activeOrdersCount,
    recentOrder,
  }
}
