// server/api/user/profile.get.ts
import type { User } from '~/types/domain';
import { mockCurrentUser, mockSuperAdminUser } from '../../mock/users';

export default defineEventHandler(async (event): Promise<User> => {
  const authHeader = getHeader(event, 'authorization');
  const token = authHeader || getCookie(event, 'auth_token') || getCookie(event, 'keras_auth_token');
  const userCookie = getCookie(event, 'auth_user') || getCookie(event, 'keras_user_data');

  if (
    token?.includes('super_admin') ||
    (typeof userCookie === 'string' && userCookie.includes('super_admin'))
  ) {
    return mockSuperAdminUser;
  }

  return mockCurrentUser;
});
