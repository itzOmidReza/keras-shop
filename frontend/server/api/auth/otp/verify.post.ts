// server/api/auth/otp/verify.post.ts
import type { OtpVerifyRequest, OtpVerifyResponse } from '~/types/domain';
import { mockCurrentUser, updateMockUser } from '../../../mock/users';

export default defineEventHandler(async (event): Promise<OtpVerifyResponse> => {
  const body = await readBody<OtpVerifyRequest>(event);

  if (!body || !body.phoneNumber || !body.code) {
    throw createError({
      statusCode: 422,
      statusMessage: 'شماره تلفن و کد تایید الزامی هستند.',
    });
  }

  const cleanPhone = body.phoneNumber.trim();
  const cleanCode = body.code.trim();

  // کدهای تستی مجاز در محیط توسعه (۱۲۳۴، ۱۲۳۴۵، ۱۲۳۴۵۶)
  const allowedDevCodes = ['1234', '12345', '123456', '1111', '11111'];
  if (!allowedDevCodes.includes(cleanCode)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'کد تایید وارد شده نامعتبر است یا منقضی شده است (کد تستی: ۱۲۳۴ یا ۱۲۳۴۵ یا ۱۲۳۴۵۶).',
    });
  }

  // شبیه‌سازی تاخیر اعتبارسنجی توکن JWT
  await new Promise((resolve) => setTimeout(resolve, 600));

  const updatedUser = updateMockUser({
    phoneNumber: cleanPhone,
    fullName: mockCurrentUser.phoneNumber === cleanPhone ? mockCurrentUser.fullName : 'کاربر گرامی کراس',
  });

  return {
    user: updatedUser,
    tokens: {
      accessToken: `keras_access_jwt_${Date.now()}`,
      tokenType: 'bearer',
      expiresIn: 30 * 24 * 60 * 60, // ۳۰ روز اعتبار
    },
    message: 'ورود با موفقیت انجام شد.',
  };
});
