// server/api/user/addresses.post.ts
import type { UserAddress } from '~/types/domain';
import { mockAddresses } from '../../mock/users';

export default defineEventHandler(async (event): Promise<UserAddress> => {
  const body = await readBody<Omit<UserAddress, 'id'>>(event);

  if (
    !body ||
    !body.title ||
    !body.fullName ||
    !body.phoneNumber ||
    !body.province ||
    !body.city ||
    !body.postalCode ||
    !body.exactAddress
  ) {
    throw createError({
      statusCode: 422,
      statusMessage: 'تمام فیلدهای نشانی پستی الزامی هستند.',
    });
  }

  // شبیه‌سازی ایجاد رکورد
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (body.isDefault) {
    mockAddresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  const newAddress: UserAddress = {
    id: `addr_${Date.now()}`,
    title: body.title.trim(),
    fullName: body.fullName.trim(),
    phoneNumber: body.phoneNumber.trim(),
    province: body.province.trim(),
    city: body.city.trim(),
    postalCode: body.postalCode.trim(),
    exactAddress: body.exactAddress.trim(),
    buildingNumber: body.buildingNumber?.trim(),
    unit: body.unit?.trim(),
    isDefault: Boolean(body.isDefault),
  };

  mockAddresses.unshift(newAddress);

  setResponseStatus(event, 201);
  return newAddress;
});
