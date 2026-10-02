// frontend/app/stores/auth.ts
import { defineStore } from 'pinia';
import type {
  OtpSendResponse,
  OtpVerifyResponse,
  User,
  UserAddress,
  UserOrderSummary,
  UserProfileUpdateRequest,
} from '~/types/domain';
import { toast } from 'vue-sonner';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const addresses = ref<UserAddress[]>([]);
  const orders = ref<UserOrderSummary[]>([]);
  const isAuthModalOpen = ref(false);
  const isHydrated = ref(false);
  const isLoading = ref(false);

  // ۱. هیدراتاسیون ایمن در کلاینت برای جلوگیری از خطای عدم تطابق SSR
  if (import.meta.client) {
    const hydrate = () => {
      try {
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          const savedToken = window.localStorage.getItem('keras_auth_token');
          const savedUser = window.localStorage.getItem('keras_user_data');
          if (savedToken && savedUser) {
            token.value = savedToken;
            user.value = JSON.parse(savedUser);
            // بارگذاری پس‌زمینه آدرس‌ها و سفارش‌ها
            fetchAddresses();
            fetchOrders();
          }
        }
      } catch {
        // نادیده گرفتن خطای پارس در صورت دستکاری دیتای محلی
      }
      isHydrated.value = true;
    };

    try {
      onNuxtReady(hydrate);
    } catch {
      hydrate();
    }

    watch([user, token], ([newUser, newToken]) => {
      if (isHydrated.value && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
          if (newToken && newUser) {
            window.localStorage.setItem('keras_auth_token', newToken);
            window.localStorage.setItem('keras_user_data', JSON.stringify(newUser));
          } else {
            window.localStorage.removeItem('keras_auth_token');
            window.localStorage.removeItem('keras_user_data');
          }
        } catch {
          // نادیده گرفتن خطای فضای ذخیره‌سازی
        }
      }
    }, { deep: true });
  }

  // ۲. گترها (Getters)
  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const defaultAddress = computed(() => {
    return addresses.value.find((addr) => addr.isDefault) || addresses.value[0] || null;
  });

  // ۳. کنترل وضعیت مودال
  function openAuthModal() {
    isAuthModalOpen.value = true;
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false;
  }

  // ۴. اکشن‌های ورود پیامکی OTP
  async function sendOtp(phoneNumber: string): Promise<OtpSendResponse> {
    isLoading.value = true;
    try {
      const response = await $fetch<OtpSendResponse>('/api/auth/otp/send', {
        method: 'POST',
        body: { phoneNumber },
      });
      toast.success(response.message || 'کد تایید با موفقیت ارسال شد.');
      return response;
    } catch (err: unknown) {
      const fetchErr = err as { data?: { statusMessage?: string } };
      const msg = fetchErr?.data?.statusMessage || 'خطا در ارسال کد تایید. لطفاً شماره را بررسی فرمایید.';
      toast.error(msg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    isLoading.value = true;
    try {
      const response = await $fetch<OtpVerifyResponse>('/api/auth/otp/verify', {
        method: 'POST',
        body: { phoneNumber, code },
      });

      token.value = response.tokens.accessToken;
      user.value = response.user;
      closeAuthModal();

      await Promise.all([fetchAddresses(), fetchOrders()]);

      toast.success(`خوش آمدید! ورود شما به حساب کاربری کراس با موفقیت انجام شد.`);
      return true;
    } catch (err: unknown) {
      const fetchErr = err as { data?: { statusMessage?: string } };
      const msg = fetchErr?.data?.statusMessage || 'کد تایید وارد شده نامعتبر است.';
      toast.error(msg);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    addresses.value = [];
    orders.value = [];

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.removeItem('keras_auth_token');
      window.localStorage.removeItem('keras_user_data');
    }

    toast.info('از حساب کاربری خود خارج شدید.');

    if (import.meta.client) {
      if (window.location.pathname.startsWith('/account')) {
        navigateTo('/');
      }
    }
  }

  // ۵. اکشن‌های پروفایل و اطلاعات کاربر
  async function fetchProfile(): Promise<void> {
    if (!token.value) return;
    try {
      const profile = await $fetch<User>('/api/user/profile');
      if (profile) {
        user.value = profile;
      }
    } catch {
      // استفاده از سشن ذخیره‌شده محلی
    }
  }

  async function updateProfile(payload: UserProfileUpdateRequest): Promise<boolean> {
    isLoading.value = true;
    try {
      const updated = await $fetch<User>('/api/user/profile', {
        method: 'PUT',
        body: payload,
      });
      user.value = updated;
      toast.success('اطلاعات حساب کاربری شما با موفقیت به‌روزرسانی شد.');
      return true;
    } catch {
      toast.error('خطا در ذخیره‌سازی اطلاعات حساب کاربری.');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // ۶. اکشن‌های دفترچه نشانی‌ها
  async function fetchAddresses(): Promise<void> {
    try {
      const list = await $fetch<UserAddress[]>('/api/user/addresses');
      addresses.value = list || [];
    } catch {
      addresses.value = [];
    }
  }

  async function addAddress(address: Omit<UserAddress, 'id'>): Promise<boolean> {
    isLoading.value = true;
    try {
      const created = await $fetch<UserAddress>('/api/user/addresses', {
        method: 'POST',
        body: address,
      });
      if (created.isDefault) {
        addresses.value.forEach((a) => {
          a.isDefault = false;
        });
      }
      addresses.value.unshift(created);
      toast.success('نشانی جدید به دفترچه آدرس‌های شما افزوده شد.');
      return true;
    } catch {
      toast.error('خطا در افزودن نشانی جدید.');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAddress(id: string): Promise<boolean> {
    try {
      await $fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      addresses.value = addresses.value.filter((a) => a.id !== id);
      toast.info('نشانی با موفقیت حذف شد.');
      return true;
    } catch {
      toast.error('خطا در حذف نشانی.');
      return false;
    }
  }

  async function setDefaultAddress(id: string): Promise<void> {
    addresses.value.forEach((a) => {
      a.isDefault = a.id === id;
    });
    try {
      await $fetch(`/api/user/addresses/${id}/default`, { method: 'PUT' });
    } catch {
      // استفاده از داده‌های محلی استور در صورت خطای شبکه
    }
    toast.success('نشانی پیش‌فرض تحویل سفارش تنظیم شد.');
  }

  // ۷. اکشن‌های سوابق سفارش‌ها
  async function fetchOrders(): Promise<void> {
    try {
      const list = await $fetch<UserOrderSummary[]>('/api/user/orders');
      orders.value = list || [];
    } catch {
      orders.value = [];
    }
  }

  return {
    user,
    token,
    addresses,
    orders,
    isAuthModalOpen,
    isHydrated,
    isLoading,
    isAuthenticated,
    defaultAddress,
    openAuthModal,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    logout,
    fetchProfile,
    updateProfile,
    fetchAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    fetchOrders,
  };
});

export default useAuthStore;
