// server/mock/transactions.ts
import type { PaymentSessionInfo } from '~/types/domain';

export interface StoredTransaction extends PaymentSessionInfo {
  callbackUrl: string;
  referenceId?: string;
  transactionId?: string;
  cardNumber?: string;
  paidAt?: string;
  errorMessage?: string;
}

export const mockTransactions = new Map<string, StoredTransaction>();

// توکن‌های نمونه اولیه برای تست مستقیم در محیط توسعه
const seedToken = 'keras_test_token_982301449102';
mockTransactions.set(seedToken, {
  token: seedToken,
  orderNumber: 'KERAS-208314',
  amount: 1450000,
  merchantName: 'فروشگاه اینترنتی پوشاک ورزشی کراس (Keras)',
  callbackUrl: '/checkout/callback',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  status: 'pending',
});

export function createTransaction(params: {
  orderNumber: string;
  amount: number;
  callbackUrl: string;
}): StoredTransaction {
  // ایجاد توکن ۳۲ کاراکتری هگزادسیمال تصادفی
  const token = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // ۱۰ دقیقه اعتبار درگاه شاپرک

  const tx: StoredTransaction = {
    token,
    orderNumber: params.orderNumber,
    amount: params.amount,
    merchantName: 'فروشگاه اینترنتی پوشاک ورزشی کراس (Keras)',
    callbackUrl: params.callbackUrl,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'pending',
  };

  mockTransactions.set(token, tx);
  return tx;
}

export function getTransaction(token: string): StoredTransaction | undefined {
  return mockTransactions.get(token);
}

export function updateTransaction(
  token: string,
  update: Partial<StoredTransaction>,
): StoredTransaction | undefined {
  const tx = mockTransactions.get(token);
  if (!tx) return undefined;
  const updated = { ...tx, ...update };
  mockTransactions.set(token, updated);
  return updated;
}
