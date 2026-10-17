import uuid
from typing import List, Optional, Union, Dict, Any
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


def _is_valid_uuid(val: Any) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, TypeError, AttributeError):
        return False


def _article_lookup_filter(identifier: str):
    conditions = [JournalArticle.slug == identifier]
    if _is_valid_uuid(identifier):
        conditions.append(JournalArticle.id == str(identifier))
    return or_(*conditions)


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


@router.post(
    "",
    response_model=JournalArticleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Journal Article",
)
async def create_article(
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    title = payload.get("title", "").strip()
    if not title:
        raise DomainException(message="عنوان مقاله الزامی است.", code="TITLE_REQUIRED", status_code=400)

    slug = payload.get("slug") or title.lower().replace(" ", "-")
    existing = await db.execute(select(JournalArticle).where(JournalArticle.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    cat = payload.get("category", "style-guide")
    cat_labels = {
        "style-guide": "راهنمای استایل",
        "fabric-care": "نگهداری الیاف لوکس",
        "drop-story": "داستان دراپ و کالکشن",
    }

    author_name = payload.get("authorName") or (payload.get("author", {}) if isinstance(payload.get("author"), dict) else {}).get("name") or "ادیتور آتلیه کراس"
    author_role = payload.get("authorRole") or (payload.get("author", {}) if isinstance(payload.get("author"), dict) else {}).get("role") or "تیم تحریریه کراس"

    article = JournalArticle(
        title=title,
        slug=slug,
        category=cat,
        category_label=cat_labels.get(cat, "راهنمای استایل"),
        read_time=f"{payload.get('readTimeMinutes', 5)} دقیقه" if isinstance(payload.get('readTimeMinutes'), (int, float)) else str(payload.get("readTime", "۵ دقیقه")),
        date=payload.get("date", "امروز"),
        author={"name": author_name, "role": author_role, "avatar": None},
        cover_image=payload.get("coverImage") or "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        excerpt=payload.get("excerpt", "").strip(),
        featured=bool(payload.get("featured", False)),
        status=payload.get("status", "published"),
        sections=payload.get("sections") or [
            {
                "heading": "مقدمه و چشم‌انداز",
                "content": payload.get("content", "").strip(),
                "pullQuote": payload.get("pullQuote"),
            }
        ],
        linked_product_slugs=payload.get("linkedProductSlugs") or [],
    )
    db.add(article)
    await db.commit()
    await db.refresh(article)
    return _map_article(article)


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
    stmt = select(JournalArticle).where(_article_lookup_filter(slug))
    res = await db.execute(stmt)
    article = res.scalar_one_or_none()

    if not article:
        raise DomainException(message="Article not found", code="ARTICLE_NOT_FOUND", status_code=404)

    return _map_article(article)


@router.put(
    "/{id_or_slug}",
    response_model=JournalArticleResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Article Details",
)
async def update_article(
    id_or_slug: str,
    payload: Dict[str, Any],
    db: AsyncSession = Depends(get_db),
):
    stmt = select(JournalArticle).where(_article_lookup_filter(id_or_slug))
    res = await db.execute(stmt)
    article = res.scalar_one_or_none()
    if not article:
        raise DomainException(message="Article not found", code="ARTICLE_NOT_FOUND", status_code=404)

    if "title" in payload:
        article.title = payload["title"]
    if "slug" in payload and payload["slug"]:
        article.slug = payload["slug"]
    if "category" in payload:
        article.category = payload["category"]
        cat_labels = {
            "style-guide": "راهنمای استایل",
            "fabric-care": "نگهداری الیاف لوکس",
            "drop-story": "داستان دراپ و کالکشن",
        }
        article.category_label = cat_labels.get(payload["category"], article.category_label)
    if "coverImage" in payload:
        article.cover_image = payload["coverImage"]
    if "excerpt" in payload:
        article.excerpt = payload["excerpt"]
    if "status" in payload:
        article.status = payload["status"]
    if "readTimeMinutes" in payload:
        article.read_time = f"{payload['readTimeMinutes']} دقیقه"
    if "authorName" in payload or "authorRole" in payload:
        cur_author = dict(article.author or {})
        if "authorName" in payload:
            cur_author["name"] = payload["authorName"]
        if "authorRole" in payload:
            cur_author["role"] = payload["authorRole"]
        article.author = cur_author
    if "content" in payload:
        article.sections = [
            {
                "heading": "مقدمه و چشم‌انداز",
                "content": payload["content"],
                "pullQuote": payload.get("pullQuote"),
            }
        ]
    await db.commit()
    await db.refresh(article)
    return _map_article(article)


@router.delete(
    "/{id_or_slug}",
    status_code=status.HTTP_200_OK,
    summary="Delete Article",
)
async def delete_article(
    id_or_slug: str,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(JournalArticle).where(_article_lookup_filter(id_or_slug))
    res = await db.execute(stmt)
    article = res.scalar_one_or_none()
    if article:
        await db.delete(article)
        await db.commit()
    return {"success": True, "message": "مقاله با موفقیت حذف شد."}

