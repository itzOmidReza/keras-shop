from typing import Optional, List
from sqlalchemy import String, Text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class JournalArticle(Base):
    __tablename__ = "journal_articles"

    title: Mapped[str] = mapped_column(String(300), nullable=False)
    slug: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # style-guide | fabric-care | drop-story
    category_label: Mapped[str] = mapped_column(String(100), nullable=False)
    read_time: Mapped[str] = mapped_column(String(50), default="۵ دقیقه", nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)  # Jalali date string e.g. '۱۲ مهر ۱۴۰۵'
    author: Mapped[dict] = mapped_column(JSON, nullable=False)  # {"name": str, "role": str, "avatar": str}
    cover_image: Mapped[str] = mapped_column(String(500), nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="published", index=True, nullable=False)  # published | draft
    sections: Mapped[List[dict]] = mapped_column(JSON, default=list, nullable=False)
    linked_product_slugs: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list, nullable=True)

