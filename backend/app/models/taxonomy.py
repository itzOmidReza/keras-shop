from typing import Optional
from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class CustomColor(Base):
    __tablename__ = "taxonomy_colors"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    hex: Mapped[str] = mapped_column(String(20), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    is_system_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class CustomSize(Base):
    __tablename__ = "taxonomy_sizes"

    name: Mapped[str] = mapped_column(String(50), nullable=False)
    group: Mapped[str] = mapped_column(String(50), default="alpha", nullable=False)  # alpha | numeric | accessory | free
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_system_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class TaxonomyCategory(Base):
    __tablename__ = "taxonomy_categories"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    division: Mapped[str] = mapped_column(String(50), default="apparel", nullable=False)  # apparel | accessories
    icon_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class TaxonomyBrand(Base):
    __tablename__ = "taxonomy_brands"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    logo_svg: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class TaxonomySeason(Base):
    __tablename__ = "taxonomy_seasons"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    is_current_drop: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

