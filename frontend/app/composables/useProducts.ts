// app/composables/useProducts.ts
import { mockProducts } from '~/data/products';
import type { ProductDetail, ProductListItem } from '~/types/domain';

export interface ProductFilters {
  line?: 'move' | 'calm';
  category?: string;
  size?: string;
  color?: string;
  sort?: 'newest' | 'bestseller' | 'price_asc' | 'price_desc';
}

export function useProducts() {
  const loading = ref(false);

  // دریافت لیست محصولات با اعمال فیلتر و مرتب‌سازی
  async function getProducts(
    filters?: ProductFilters,
  ): Promise<ProductListItem[]> {
    loading.value = true;
    // شبیه‌سازی ۲۰۰ میلی‌ثانیه تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 200));

    let result = [...mockProducts];

    if (filters?.line) {
      result = result.filter((p) => p.line === filters.line);
    }

    if (filters?.category) {
      result = result.filter((p) => p.category.slug === filters.category);
    }

    if (filters?.size) {
      result = result.filter((p) => p.available_sizes.includes(filters.size!));
    }

    if (filters?.color) {
      result = result.filter((p) =>
        p.colors.some((c) => c.name === filters.color),
      );
    }

    if (filters?.sort === 'price_asc') {
      result.sort((a, b) => a.base_price - b.base_price);
    } else if (filters?.sort === 'price_desc') {
      result.sort((a, b) => b.base_price - a.base_price);
    } else if (filters?.sort === 'bestseller') {
      result.sort((a, b) => b.rating_count - a.rating_count);
    }

    loading.value = false;
    return result;
  }

  // دریافت تک‌محصول بر اساس slug
  async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 150));
    const product = mockProducts.find((p) => p.slug === slug) || null;
    loading.value = false;
    return product;
  }

  return {
    loading,
    getProducts,
    getProductBySlug,
  };
}
