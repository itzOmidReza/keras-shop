// server/api/coupons/validate.post.ts
import type { CouponValidationResponse } from '~/types/domain';

interface CouponRequestBody {
  code: string;
  subtotal: number;
}

export default defineEventHandler(async (event): Promise<CouponValidationResponse> => {
  const body = await readBody<CouponRequestBody>(event);

  if (!body || !body.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'لطفاً کد تخفیف را وارد کنید.',
    });
  }

  const normalizedCode = body.code.trim().toUpperCase();
  const subtotal = Number(body.subtotal) || 0;

  if (subtotal <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'سبد خرید شما خالی است.',
    });
  }

  switch (normalizedCode) {
    case 'KERAS10': {
      const discountAmount = Math.round(subtotal * 0.1);
      return {
        valid: true,
        code: 'KERAS10',
        discountAmount,
        discountPercent: 10,
        message: 'کد تخفیف ۱۰ درصدی باشگاه کراس با موفقیت اعمال شد.',
      };
    }

    case 'WELCOME': {
      const minOrder = 500000;
      if (subtotal < minOrder) {
        throw createError({
          statusCode: 400,
          statusMessage: 'حداقل مبلغ خرید برای کد تخفیف خوش‌آمدگویی ۵۰۰,۰۰۰ تومان است.',
        });
      }
      return {
        valid: true,
        code: 'WELCOME',
        discountAmount: 100000,
        message: 'تخفیف ۱۰۰,۰۰۰ تومانی خوش‌آمدگویی اعمال شد.',
      };
    }

    case 'KERAS20': {
      const minOrder = 2000000;
      if (subtotal < minOrder) {
        throw createError({
          statusCode: 400,
          statusMessage: 'حداقل مبلغ خرید برای کد تخفیف ۲۰ درصدی ۲,۰۰۰,۰۰۰ تومان است.',
        });
      }
      const discountAmount = Math.round(subtotal * 0.2);
      return {
        valid: true,
        code: 'KERAS20',
        discountAmount,
        discountPercent: 20,
        message: 'کد تخفیف ویژه ۲۰ درصدی با موفقیت اعمال شد.',
      };
    }

    default:
      throw createError({
        statusCode: 400,
        statusMessage: 'کد تخفیف وارد شده معتبر نمی‌باشد یا منقضی شده است.',
      });
  }
});
