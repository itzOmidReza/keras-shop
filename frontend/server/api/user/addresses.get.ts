// server/api/user/addresses.get.ts
import type { UserAddress } from '~/types/domain';
import { mockAddresses } from '../../mock/users';

export default defineEventHandler(async (): Promise<UserAddress[]> => {
  return mockAddresses;
});
