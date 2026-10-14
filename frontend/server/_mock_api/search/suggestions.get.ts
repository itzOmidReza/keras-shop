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

const categoryDisplayNames: Record<string, string> = {
  'shirts-blouses': 'پیراهن و شومیز',
  knitwear: 'بافت و پلیور',
  'coats-jackets': 'پالتو و کاپشن',
  pants: 'شلوار',
  tops: 'تیشرت و تاپ',
  'hair-accessories': 'اکسسوری مو',
  bandanas: 'دستمال سر',
  scarves: 'اسکارف و شال',
};

const divisionDisplayNames: Record<string, string> = {
  apparel: 'پوشاک',
  accessories: 'اکسسوری',
};

const seasonDisplayNames: Record<string, string> = {
  'fall-1405': 'پاییز ۱۴۰۵',
  'winter-1405': 'زمستان ۱۴۰۵',
  'spring-1406': 'بهار ۱۴۰۶',
  'summer-1405': 'تابستان ۱۴۰۵',
};

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
    const catTitle = categoryDisplayNames[product.category] || product.category;
    const normCatTitle = normalize(catTitle);
    const normCatSlug = normalize(product.category);
    const divTitle = divisionDisplayNames[product.division] || product.division;
    const normDivTitle = normalize(divTitle);
    const normDivSlug = normalize(product.division);
    const seaTitle = seasonDisplayNames[product.season] || product.season;
    const normSeaTitle = normalize(seaTitle);
    const normDesc = normalize(product.description || '');
    const normFabric = normalize(product.fabric?.composition || product.fabric_composition || '');

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
    if (normCatTitle.includes(normalizedQuery) || normCatSlug.includes(normalizedQuery)) {
      score += 60;
    }

    // ۴. تطابق با شاخه اصلی (division)
    if (normDivTitle.includes(normalizedQuery) || normDivSlug.includes(normalizedQuery)) {
      score += 50;
    }

    // ۵. تطابق با فصل و کالکشن (season)
    if (normSeaTitle.includes(normalizedQuery) || normalize(product.season).includes(normalizedQuery)) {
      score += 45;
    }

    // ۶. تطابق چند کلمه‌ای و توکن‌ها
    if (queryTokens.length > 1) {
      const allTokensMatch = queryTokens.every(
        (token) =>
          normTitle.includes(token) ||
          normCatTitle.includes(token) ||
          normDivTitle.includes(token) ||
          normSeaTitle.includes(token) ||
          normSlug.includes(token) ||
          normDesc.includes(token),
      );
      if (allTokensMatch) {
        score += 70;
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
    const catSlug = item.product.category;
    if (catSlug) {
      const existing = categoryMap.get(catSlug);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(catSlug, {
          name: categoryDisplayNames[catSlug] || catSlug,
          slug: catSlug,
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
      price: product.price ?? product.base_price,
      compare_at_price: product.compare_at_price,
      primary_image: product.images?.[0]?.url || '',
      division: product.division,
      category: categoryDisplayNames[product.category] || product.category,
      season: product.season,
      line: product.line,
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
