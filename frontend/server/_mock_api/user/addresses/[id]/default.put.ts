// server/api/user/addresses/[id]/default.put.ts
import { mockAddresses } from '../../../../mock/users';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'شناسه نشانی نامعتبر است.' });
  }

  const found = mockAddresses.some((addr) => addr.id === id);
  if (!found) {
    throw createError({ statusCode: 404, statusMessage: 'نشانی مورد نظر یافت نشد.' });
  }

  mockAddresses.forEach((addr) => {
    addr.isDefault = addr.id === id;
  });

  return { success: true };
});
