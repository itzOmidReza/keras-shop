// frontend/app/utils/validation.ts
import { z } from 'zod'
import { toEn } from '~/utils/format'

export const iranianMobileRegex = /^09\d{9}$/
export const iranianPostalCodeRegex = /^\d{10}$/

export const IRAN_PROVINCES = [
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'مازندران',
  'گیلان',
  'البرز',
  'خوزستان',
  'کرمان',
  'یزد',
  'هرمزگان',
  'قم',
  'مرکزی',
  'همدان',
  'قزوین',
  'کرمانشاه',
  'کردستان',
  'لرستان',
  'سیستان و بلوچستان',
  'بوشهر',
  'زنجان',
  'گلستان',
  'اردبیل',
  'چهارمحال و بختیاری',
  'سمنان',
  'خراسان جنوبی',
  'خراسان شمالی',
  'کهگیلویه و بویراحمد',
  'ایلام',
] as const

export const shippingAddressSchema = z.object({
  fullName: z
    .string({ required_error: 'نام و نام خانوادگی الزامی است' })
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ حرف باشد'),
  phoneNumber: z
    .string({ required_error: 'شماره موبایل الزامی است' })
    .transform((val) => toEn(val.trim()))
    .pipe(
      z
        .string()
        .regex(
          iranianMobileRegex,
          'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: ۰۹۱۲۳۴۵۶۷۸۹)',
        ),
    ),
  province: z
    .string({ required_error: 'انتخاب استان الزامی است' })
    .min(2, 'لطفاً استان خود را انتخاب کنید'),
  city: z
    .string({ required_error: 'نام شهر الزامی است' })
    .min(2, 'لطفاً نام شهر را وارد کنید'),
  postalCode: z
    .string({ required_error: 'کد پستی الزامی است' })
    .transform((val) => toEn(val.trim()))
    .pipe(z.string().regex(iranianPostalCodeRegex, 'کد پستی باید دقیقاً ۱۰ رقم باشد')),
  exactAddress: z
    .string({ required_error: 'آدرس دقیق الزامی است' })
    .min(10, 'آدرس پستی باید حداقل ۱۰ حرف و شامل جزئیات باشد'),
  buildingNumber: z.string().optional().default(''),
  unit: z.string().optional().default(''),
  notes: z.string().optional().default(''),
})

export const checkoutFormSchema = shippingAddressSchema.extend({
  shippingMethod: z.enum(['standard', 'express'], {
    required_error: 'لطفاً شیوه ارسال را انتخاب کنید',
  }),
  paymentMethod: z.enum(['online_gateway', 'card_to_card'], {
    required_error: 'لطفاً روش پرداخت را انتخاب کنید',
  }),
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
