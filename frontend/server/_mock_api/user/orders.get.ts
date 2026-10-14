// server/api/user/orders.get.ts
import type { UserOrderSummary } from '~/types/domain';
import { mockUserOrders } from '../../mock/users';

export default defineEventHandler(async (): Promise<UserOrderSummary[]> => {
  return mockUserOrders;
});
