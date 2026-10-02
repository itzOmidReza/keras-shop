// server/api/search/suggestions.get.ts
import { mockProducts } from '../../mock/products';
import type {
  SearchSuggestionsResponse,
  SearchSuggestionItem,
  SearchCategorySuggestion,
} from '~/types/domain';

const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

function normalize(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\u200c|\u200d|\u200e|\u200f/g, ' ')
    .replace(/[ي]/g, 'ی')
    .replace(/[ك]/g, 'ک')
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)))
    .trim();
}

export default defineEventHandler(async (event): Promise<SearchSuggestionsResponse> => {
  const query = getQuery(event);
  const rawQ = typeof query.q === 'string' ? query.q : '';
  const trimmedQ = rawQ.trim();

  // شبیه‌سازی تأخیر شبکه (۱۵۰ میلی‌ثانیه)
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (trimmedQ.length < 2) {
    return {
      query: trimmedQ,
      products: [],
      categories: [],
      totalMatches: 0,
    };
  }

  const normalizedQuery = normalize(trimmedQ);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  interface ScoredProduct {
    score: number;
    product: (typeof mockProducts)[0];
  }

  const scoredList: ScoredProduct[] = [];

  for (const product of mockProducts) {
    if (!product.is_active) continue;

    const normTitle = normalize(product.title);
    const normSlug = normalize(product.slug);
    const normCategoryTitle = normalize(product.category?.title || '');
    const normCategorySlug = normalize(product.category?.slug || '');
    const normLine = normalize(product.line);
    const normDesc = normalize(product.description || '');
    const normFabric = normalize(product.fabric_composition || '');

    let score = 0;

    // ۱. تطابق دقیق با عنوان
    if (normTitle === normalizedQuery) {
      score += 150;
    } else if (normTitle.startsWith(normalizedQuery)) {
      score += 100;
    } else if (normTitle.includes(normalizedQuery)) {
      score += 80;
    }

    // ۲. تطابق با اسلاگ کالا
    if (normSlug.includes(normalizedQuery)) {
      score += 40;
    }

    // ۳. تطابق با دسته‌بندی
    if (normCategoryTitle.includes(normalizedQuery) || normCategorySlug.includes(normalizedQuery)) {
      score += 50;
    }

    // ۴. تطابق با لاین برند
    if (normLine === normalizedQuery || normLine.includes(normalizedQuery)) {
      score += 35;
    }

    // ۵. تطابق چند کلمه‌ای
    if (queryTokens.length > 1) {
      const allTokensMatch = queryTokens.every(
        (token) =>
          normTitle.includes(token) ||
          normCategoryTitle.includes(token) ||
          normSlug.includes(token) ||
          normDesc.includes(token),
      );
      if (allTokensMatch) {
        score += 60;
      }
    } else if (score === 0) {
      if (normDesc.includes(normalizedQuery) || normFabric.includes(normalizedQuery)) {
        score += 20;
      }
    }

    if (score > 0) {
      scoredList.push({ score, product });
    }
  }

  // مرتب‌سازی بر اساس ارتباط و امتیاز نزولی
  scoredList.sort((a, b) => b.score - a.score);

  const totalMatches = scoredList.length;

  // استخراج دسته‌بندی‌های مرتبط با کالاهای یافته‌شده
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const item of scoredList) {
    const cat = item.product.category;
    if (cat && cat.slug) {
      const existing = categoryMap.get(cat.slug);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(cat.slug, {
          name: cat.title,
          slug: cat.slug,
          count: 1,
        });
      }
    }
  }

  // حداکثر ۳ دسته‌بندی برتر با بیشترین کالا
  const matchedCategories: SearchCategorySuggestion[] = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // استخراج ۵ محصول اول برای نمایش در پیشنهادات
  const topProducts: SearchSuggestionItem[] = scoredList.slice(0, 5).map(({ product }) => {
    const inStock =
      product.variants && product.variants.length > 0
        ? product.variants.some((v) => v.stock > 0)
        : true;

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.base_price,
      compare_at_price: product.compare_at_price,
      primary_image: product.images?.[0]?.url || '',
      line: product.line,
      category: product.category?.title || '',
      inStock,
    };
  });

  return {
    query: trimmedQ,
    products: topProducts,
    categories: matchedCategories,
    totalMatches,
  };
});
