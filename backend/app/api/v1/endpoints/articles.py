from typing import List, Optional, Union
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.article import JournalArticle
from app.schemas.article import (
    JournalArticleResponse,
    ArticleAuthorSchema,
    LinkedGarmentSchema,
    ArticleSectionSchema,
)
from app.core.exceptions import DomainException

router = APIRouter(prefix="/articles", tags=["Journal & Editorial"])


def _map_article(a: JournalArticle) -> JournalArticleResponse:
    sections = [ArticleSectionSchema(**s) for s in (a.sections or [])]
    return JournalArticleResponse(
        id=a.id,
        title=a.title,
        slug=a.slug,
        category=a.category,
        categoryLabel=a.category_label,
        readTime=a.read_time,
        date=a.date,
        author=ArticleAuthorSchema(**a.author),
        coverImage=a.cover_image,
        excerpt=a.excerpt,
        featured=a.featured,
        status=a.status,
        sections=sections,
        linkedProductSlugs=a.linked_product_slugs or [],
        linkedProducts=[],
    )


@router.get(
    "",
    response_model=List[JournalArticleResponse],
    status_code=status.HTTP_200_OK,
    summary="List Journal Articles",
)
async def list_articles(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    q: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(JournalArticle)

    if status_filter and status_filter != "all":
        stmt = stmt.where(JournalArticle.status == status_filter)

    if category and category != "all":
        stmt = stmt.where(JournalArticle.category == category)

    if q:
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(JournalArticle.title.ilike(term), JournalArticle.excerpt.ilike(term)))

    stmt = stmt.order_by(JournalArticle.created_at.desc())
    res = await db.execute(stmt)
    articles = res.scalars().all()
    return [_map_article(a) for a in articles]


@router.get(
    "/{slug}",
    response_model=JournalArticleResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Article Details",
)
async def get_article_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(JournalArticle).where(JournalArticle.slug == slug)
    res = await db.execute(stmt)
    article = res.scalar_one_or_none()

    if not article:
        raise DomainException(message="Article not found", code="ARTICLE_NOT_FOUND", status_code=404)

    return _map_article(article)

