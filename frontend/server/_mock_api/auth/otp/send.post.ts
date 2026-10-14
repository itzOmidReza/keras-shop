// server/api/auth/otp/send.post.ts
import type { OtpSendRequest, OtpSendResponse } from '~/types/domain';

export default defineEventHandler(async (event): Promise<OtpSendResponse> => {
  const body = await readBody<OtpSendRequest>(event);

  if (!body || !body.phoneNumber) {
    throw createError({
      statusCode: 422,
      statusMessage: 'شماره تلفن همراه الزامی است.',
    });
  }

  const cleanPhone = body.phoneNumber.trim();
  const iranianMobileRegex = /^09\d{9}$/;

  if (!iranianMobileRegex.test(cleanPhone)) {
    throw createError({
      statusCode: 422,
      statusMessage: 'شماره موبایل نامعتبر است. شماره باید ۱۱ رقم و با ۰۹ شروع شود.',
    });
  }

  // شبیه‌سازی تاخیر ارسال پیامک توسط پنل کاوه‌نگار / مگفا
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    expiresIn: 120,
    message: 'کد تایید ۵ رقمی با موفقیت ارسال شد (کد تستی: ۱۲۳۴۵).',
  };
});
