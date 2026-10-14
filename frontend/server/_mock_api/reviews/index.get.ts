// server/api/reviews/index.get.ts
import { mockReviews } from '../../mock/reviews';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const statusFilter = (query.status as string) || 'all';
  const productSlug = query.productSlug as string | undefined;
  const search = ((query.search as string) || (query.q as string) || '').trim().toLowerCase();
  const ratingFilter = query.rating ? Number(query.rating) : null;

  let result = [...mockReviews];

  if (statusFilter && statusFilter !== 'all') {
    result = result.filter((r) => r.status === statusFilter);
  }

  if (productSlug) {
    result = result.filter((r) => r.productSlug === productSlug);
  }

  if (ratingFilter) {
    result = result.filter((r) => Math.round(r.rating) === ratingFilter);
  }

  if (search) {
    result = result.filter(
      (r) =>
        r.authorName?.toLowerCase().includes(search) ||
        r.comment?.toLowerCase().includes(search) ||
        r.productTitle?.toLowerCase().includes(search) ||
        r.productSlug?.toLowerCase().includes(search),
    );
  }

  const pendingCount = mockReviews.filter((r) => r.status === 'pending').length;
  const approvedCount = mockReviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = mockReviews.filter((r) => r.status === 'rejected').length;

  return {
    reviews: result,
    total: result.length,
    pendingCount,
    approvedCount,
    rejectedCount,
    allCount: mockReviews.length,
  };
});
