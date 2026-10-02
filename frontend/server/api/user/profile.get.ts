// server/api/user/profile.get.ts
import type { User } from '~/types/domain';
import { mockCurrentUser } from '../../mock/users';

export default defineEventHandler(async (): Promise<User> => {
  return mockCurrentUser;
});
