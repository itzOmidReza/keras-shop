// server/api/settings.put.ts
import { currentSiteSettings } from '../mock/settings'
import type { SiteSettings } from '~/types/domain'

export default defineEventHandler(async (event): Promise<SiteSettings> => {
  const body = await readBody<Partial<SiteSettings>>(event)

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'تنظیمات ارسال‌شده نامعتبر است.',
    })
  }

  // ادغام عمیق بخش‌های ارسال‌شده با وضعیت جاری در حافظه سرور
  if (body.branding) {
    currentSiteSettings.branding = {
      ...currentSiteSettings.branding,
      ...body.branding,
    }
  }

  if (body.contact) {
    currentSiteSettings.contact = {
      ...currentSiteSettings.contact,
      ...body.contact,
    }
  }

  if (body.shipping) {
    currentSiteSettings.shipping = {
      ...currentSiteSettings.shipping,
      ...body.shipping,
      freeShippingThreshold: Number(body.shipping.freeShippingThreshold) || currentSiteSettings.shipping.freeShippingThreshold,
      flatShippingFee: Number(body.shipping.flatShippingFee) || currentSiteSettings.shipping.flatShippingFee,
    }
  }

  if (body.checkoutRules) {
    currentSiteSettings.checkoutRules = {
      ...currentSiteSettings.checkoutRules,
      ...body.checkoutRules,
      minCartTotal: Number(body.checkoutRules.minCartTotal) || currentSiteSettings.checkoutRules.minCartTotal,
      maxItemQuantityPerCart: Number(body.checkoutRules.maxItemQuantityPerCart) || currentSiteSettings.checkoutRules.maxItemQuantityPerCart,
      reservationTimeoutMinutes: Number(body.checkoutRules.reservationTimeoutMinutes) || currentSiteSettings.checkoutRules.reservationTimeoutMinutes,
      returnPolicyDays: Number(body.checkoutRules.returnPolicyDays) || currentSiteSettings.checkoutRules.returnPolicyDays,
    }
  }

  if (body.social) {
    currentSiteSettings.social = {
      ...currentSiteSettings.social,
      ...body.social,
    }
  }

  if (body.integrations) {
    currentSiteSettings.integrations = {
      ...currentSiteSettings.integrations,
      ...body.integrations,
      smsProviderBalance: Number(body.integrations.smsProviderBalance) || currentSiteSettings.integrations.smsProviderBalance,
    }
  }

  currentSiteSettings.updatedAt = new Date().toISOString()

  return currentSiteSettings
})
