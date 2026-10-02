// server/mock/users.ts
import type {
  User,
  UserAddress,
  UserOrderSummary,
} from '~/types/domain';

export const mockCurrentUser: User = {
  id: 'usr_keras_001',
  phoneNumber: '09123456789',
  fullName: 'سارا ملکی',
  email: 'sara.maleki@example.com',
  createdAt: '2026-01-15T09:00:00Z',
};

export const updateMockUser = (partial: Partial<User>) => {
  Object.assign(mockCurrentUser, partial);
  return mockCurrentUser;
};

export const mockAddresses: UserAddress[] = [
  {
    id: 'addr_1',
    title: 'منزل (تهران)',
    fullName: 'سارا ملکی',
    phoneNumber: '09123456789',
    province: 'تهران',
    city: 'تهران',
    postalCode: '1985912345',
    exactAddress: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مریم، پلاک ۱۲',
    buildingNumber: '۱۲',
    unit: '۴',
    isDefault: true,
  },
  {
    id: 'addr_2',
    title: 'محل کار (استودیو یوگا)',
    fullName: 'سارا ملکی',
    phoneNumber: '09123456789',
    province: 'تهران',
    city: 'تهران',
    postalCode: '1415698765',
    exactAddress: 'بلوار اندرزگو، خیابان سلیمی شمالی، ساختمان اداری نگین، طبقه ۳',
    buildingNumber: '۲۴',
    unit: '۸',
    isDefault: false,
  },
];

export const mockUserOrders: UserOrderSummary[] = [
  {
    orderNumber: 'KRS-842190',
    createdAt: '2026-03-24T14:30:00Z',
    status: 'delivered',
    statusLabel: 'تحویل داده شده',
    finalTotal: 2340000,
    itemCount: 2,
    trackingCode: 'POST-IR-982341908234',
    shippingAddress: {
      fullName: 'سارا ملکی',
      phoneNumber: '09123456789',
      province: 'تهران',
      city: 'تهران',
      postalCode: '1985912345',
      exactAddress: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مریم، پلاک ۱۲',
    },
    items: [
      {
        id: '1-M',
        productId: 1,
        title: 'لگ سیم‌لس آرامش',
        slug: 'calm-seamless-leggings-black',
        size: 'M',
        price: 1450000,
        compareAtPrice: 1750000,
        quantity: 1,
        maxStock: 10,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2-S',
        productId: 2,
        title: 'نیم‌تنه تمرینی حرکت',
        slug: 'move-performance-sports-bra-clay',
        size: 'S',
        price: 890000,
        quantity: 1,
        maxStock: 10,
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    orderNumber: 'KRS-918234',
    createdAt: '2026-04-01T11:15:00Z',
    status: 'processing',
    statusLabel: 'در حال پردازش در انبار',
    finalTotal: 1450000,
    itemCount: 1,
    trackingCode: 'POST-IR-124987239841',
    shippingAddress: {
      fullName: 'سارا ملکی',
      phoneNumber: '09123456789',
      province: 'تهران',
      city: 'تهران',
      postalCode: '1985912345',
      exactAddress: 'خیابان ولیعصر، بالاتر از پارک وی، کوچه مریم، پلاک ۱۲',
    },
    items: [
      {
        id: '1-S',
        productId: 1,
        title: 'لگ سیم‌لس آرامش',
        slug: 'calm-seamless-leggings-black',
        size: 'S',
        price: 1450000,
        compareAtPrice: 1750000,
        quantity: 1,
        maxStock: 10,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];
