// frontend/app/composables/checkout/useCheckoutFunnel.ts
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { shippingAddressSchema } from '~/utils/validation'
import type { ShippingMethod, PaymentMethod, OrderReceipt, UserAddress } from '~/types/domain'
import { toast } from 'vue-sonner'

export function useCheckoutFunnel() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const router = useRouter()

  const currentStep = ref<1 | 2>(1)
  const isSubmittingOrder = ref(false)
  const acceptTerms = ref(true)
  const termsError = ref('')
  const isInlineOtpOpen = ref(false)

  // فرم اعتبارسنجی مشخصات با Vee-Validate و Zod
  const { defineField, errors, handleSubmit, values, validate, setValues } = useForm({
    validationSchema: toTypedSchema(shippingAddressSchema),
    initialValues: {
      fullName: '',
      phoneNumber: '',
      province: 'تهران',
      city: 'تهران',
      postalCode: '',
      exactAddress: '',
      buildingNumber: '',
      unit: '',
      notes: '',
    },
  })

  const selectedSavedAddressId = ref<string | null>(null)

  const applySavedAddress = (addr: UserAddress) => {
    selectedSavedAddressId.value = addr.id
    setValues({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      province: addr.province,
      city: addr.city,
      postalCode: addr.postalCode,
      exactAddress: addr.exactAddress,
      buildingNumber: addr.buildingNumber || '',
      unit: addr.unit || '',
      notes: values.notes || '',
    })
  }

  // بارگذاری خودکار آدرس پیش‌فرض در صورت احراز هویت
  watch(
    [() => authStore.isHydrated, () => authStore.isAuthenticated, () => authStore.defaultAddress],
    ([hydrated, isAuth, defAddr]) => {
      if (hydrated && isAuth) {
        if (defAddr && !values.fullName && !values.phoneNumber) {
          applySavedAddress(defAddr)
        } else if (authStore.user && !values.phoneNumber) {
          setValues({
            ...values,
            fullName: values.fullName || authStore.user.fullName || '',
            phoneNumber: authStore.user.phoneNumber,
          })
        }
      }
    },
    { immediate: true },
  )

  const [fullName] = defineField('fullName')
  const [phoneNumber] = defineField('phoneNumber')
  const [province] = defineField('province')
  const [city] = defineField('city')
  const [postalCode] = defineField('postalCode')
  const [exactAddress] = defineField('exactAddress')
  const [buildingNumber] = defineField('buildingNumber')
  const [unit] = defineField('unit')
  const [notes] = defineField('notes')

  // شیوه‌های ارسال و پرداخت
  const selectedShipping = ref<ShippingMethod>('standard')
  const selectedPayment = ref<PaymentMethod>('online_gateway')

  const handleShippingChange = (method: ShippingMethod) => {
    selectedShipping.value = method
    cartStore.setShippingMethod(method)
  }

  const goToStep2 = handleSubmit(() => {
    if (!acceptTerms.value) {
      termsError.value = 'پذیرش شرایط و قوانین جهت ثبت سفارش در کراس الزامی است.'
      return
    }
    termsError.value = ''
    currentStep.value = 2
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  const goToStep1 = () => {
    currentStep.value = 1
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const executeOrderCreation = async () => {
    isSubmittingOrder.value = true
    try {
      const receipt = await $fetch<OrderReceipt>('/api/orders/create', {
        method: 'POST',
        body: {
          items: cartStore.items,
          shippingAddress: {
            fullName: values.fullName || '',
            phoneNumber: toEn((values.phoneNumber || '').trim()),
            province: values.province || '',
            city: values.city || '',
            postalCode: toEn((values.postalCode || '').trim()),
            exactAddress: values.exactAddress || '',
            buildingNumber: values.buildingNumber || undefined,
            unit: values.unit || undefined,
            notes: values.notes || undefined,
          },
          shippingMethod: selectedShipping.value,
          paymentMethod: selectedPayment.value,
          couponCode: cartStore.appliedCoupon?.code,
          couponDiscount: cartStore.couponDiscount,
        },
      })

      cartStore.setLastOrderReceipt(receipt)

      // در صورت انتخاب پرداخت آنلاین شتابی، هدایت به درگاه پرداخت شاپرک
      if (selectedPayment.value === 'online_gateway') {
        try {
          const paymentRes = await $fetch<{ paymentToken: string; gatewayUrl: string }>(
            '/api/checkout/payment/initiate',
            {
              method: 'POST',
              body: {
                orderNumber: receipt.orderNumber,
                amount: receipt.finalTotal,
                callbackUrl: '/checkout/callback',
              },
            },
          )
          toast.info('در حال انتقال به درگاه پرداخت اینترنتی شاپرک...')
          router.push(paymentRes.gatewayUrl)
          return
        } catch (payErr) {
          console.error('Failed to initiate payment gateway:', payErr)
        }
      }

      // سایر روش‌ها (پرداخت در محل یا پرداخت مستقیم)
      cartStore.clearCart()
      if (authStore.isAuthenticated) {
        authStore.fetchOrders()
      }
      toast.success('سفارش شما با موفقیت ثبت شد!')
      router.push('/checkout/success')
    } catch (err: unknown) {
      const errorObj = err as { data?: { statusMessage?: string }; message?: string }
      const message =
        errorObj.data?.statusMessage || errorObj.message || 'خطا در ثبت سفارش. لطفاً مجدداً تلاش کنید.'
      toast.error(message)
    } finally {
      isSubmittingOrder.value = false
    }
  }

  // ثبت نهایی سفارش
  const handleFinalSubmit = async () => {
    const result = await validate()
    if (!result.valid) {
      currentStep.value = 1
      toast.error('لطفاً خطاهای آدرس و مشخصات تحویل‌گیرنده را برطرف کنید.')
      return
    }

    if (!acceptTerms.value) {
      currentStep.value = 1
      termsError.value = 'پذیرش شرایط و قوانین جهت ثبت سفارش در کراس الزامی است.'
      toast.error(termsError.value)
      return
    }

    // در صورت عدم احراز هویت، فعال‌سازی مدال تایید شماره همراه درون‌برنامه‌ای (OTP)
    if (!authStore.isAuthenticated) {
      isInlineOtpOpen.value = true
      return
    }

    await executeOrderCreation()
  }

  // پس از تایید موفقیت‌آمیز شماره همراه مهمان
  const onInlineOtpSuccess = async () => {
    if (authStore.isAuthenticated && authStore.addresses.length === 0 && values.exactAddress) {
      try {
        await authStore.addAddress({
          title: 'منزل',
          fullName: values.fullName || authStore.user?.fullName || '',
          phoneNumber: toEn((values.phoneNumber || authStore.user?.phoneNumber || '').trim()),
          province: values.province || 'تهران',
          city: values.city || 'تهران',
          postalCode: toEn((values.postalCode || '').trim()),
          exactAddress: values.exactAddress || '',
          buildingNumber: values.buildingNumber || undefined,
          unit: values.unit || undefined,
          isDefault: true,
        })
      } catch {
        // نادیده گرفتن خطای ذخیره جانبی
      }
    }

    await executeOrderCreation()
  }

  return {
    cartStore,
    authStore,
    currentStep,
    isSubmittingOrder,
    acceptTerms,
    termsError,
    isInlineOtpOpen,
    errors,
    values,
    fullName,
    phoneNumber,
    province,
    city,
    postalCode,
    exactAddress,
    buildingNumber,
    unit,
    notes,
    selectedSavedAddressId,
    applySavedAddress,
    selectedShipping,
    selectedPayment,
    handleShippingChange,
    goToStep1,
    goToStep2,
    handleFinalSubmit,
    onInlineOtpSuccess,
  }
}
