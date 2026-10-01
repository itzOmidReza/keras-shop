// app/composables/useProducts.ts
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
  const error = ref<Error | null>(null);

  /**
   * دریافت لیست محصولات بر اساس فیلترها و مرتب‌سازی از سرویس بک‌اند / Mock API
   */
  async function getProducts(
    filters?: ProductFilters,
  ): Promise<ProductListItem[]> {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<ProductListItem[]>('/api/products', {
        query: filters,
      });
      return data || [];
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * دریافت جزئیات کامل یک محصول بر اساس شناسه متنی (slug)
   */
  async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch<ProductDetail>(`/api/products/${slug}`);
      return data;
    } catch (err: unknown) {
      const fetchError = err as { statusCode?: number };
      if (fetchError?.statusCode === 404) {
        return null;
      }
      error.value = err instanceof Error ? err : new Error(String(err));
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getProducts,
    getProductBySlug,
  };
}
