// server/api/articles/index.get.ts
import { mockArticles } from '../../mock/articles';
import type { JournalArticle, ArticleCategory } from '~/types/domain';

export default defineEventHandler((event): JournalArticle[] => {
  const query = getQuery(event);

  let items = [...mockArticles];

  // فیلتر وضعیت (status: published / draft / all)
  if (query.status && typeof query.status === 'string') {
    if (query.status !== 'all') {
      items = items.filter((a) => a.status === query.status);
    }
  }

  // فیلتر دسته‌بندی موضوعی (category)
  if (query.category && typeof query.category === 'string' && query.category !== 'all') {
    const targetCategory = query.category.toLowerCase().trim() as ArticleCategory;
    items = items.filter((a) => a.category === targetCategory);
  }

  // جست‌وجوی متنی (q)
  if (query.q && typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.author.name.toLowerCase().includes(term) ||
        a.categoryLabel.toLowerCase().includes(term),
    );
  }

  // فیلتر ویژه (featured)
  if (query.featured === 'true' || query.featured === true) {
    items = items.filter((a) => a.featured);
  }

  return items;
});
