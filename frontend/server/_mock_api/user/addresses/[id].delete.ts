// server/api/user/addresses/[id].delete.ts
import { mockAddresses } from '../../../mock/users';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'شناسه نشانی نامعتبر است.',
    });
  }

  const index = mockAddresses.findIndex((addr) => addr.id === id);
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'نشانی مورد نظر یافت نشد.',
    });
  }

  mockAddresses.splice(index, 1);

  return {
    success: true,
    message: 'نشانی با موفقیت حذف شد.',
  };
});
