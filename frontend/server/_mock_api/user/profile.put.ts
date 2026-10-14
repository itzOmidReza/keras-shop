// server/api/user/profile.put.ts
import type { User, UserProfileUpdateRequest } from '~/types/domain';
import { updateMockUser } from '../../mock/users';

export default defineEventHandler(async (event): Promise<User> => {
  const body = await readBody<UserProfileUpdateRequest>(event);

  if (!body) {
    throw createError({
      statusCode: 422,
      statusMessage: 'داده‌های ارسال‌شده برای به‌روزرسانی معتبر نیستند.',
    });
  }

  // شبیه‌سازی ذخیره اطلاعات در دیتابیس
  await new Promise((resolve) => setTimeout(resolve, 300));

  const updated = updateMockUser({
    fullName: body.fullName?.trim() || undefined,
    email: body.email?.trim() || undefined,
  });

  return updated;
});
