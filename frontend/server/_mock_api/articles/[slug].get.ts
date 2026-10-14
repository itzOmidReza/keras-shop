// server/api/articles/[slug].get.ts
import { mockArticles } from '../../mock/articles';
import type { JournalArticle } from '~/types/domain';

export default defineEventHandler((event): JournalArticle => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article slug is required',
    });
  }

  const article = mockArticles.find((a) => a.slug === slug);

  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
    });
  }

  return article;
});
