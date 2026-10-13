from typing import Optional
from sqlalchemy import String, Text, Integer, Boolean, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ProductReview(Base):
    __tablename__ = "product_reviews"

    product_slug: Mapped[str] = mapped_column(String(220), index=True, nullable=False)
    product_title: Mapped[str] = mapped_column(String(200), nullable=False)
    product_thumbnail: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    author_name: Mapped[str] = mapped_column(String(100), nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    date: Mapped[str] = mapped_column(String(50), nullable=False)  # Jalali date string e.g. '۱۴۰۵/۰۶/۲۰'
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    fit_feedback: Mapped[Optional[str]] = mapped_column(String(50), default="true_to_size", nullable=True)  # true_to_size | runs_small | runs_large
    is_verified_buyer: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True, nullable=False)  # pending | approved | rejected
    size_purchased: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    reply: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # {"text": str, "date": str, "author": str}

