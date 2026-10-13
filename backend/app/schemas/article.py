from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, ConfigDict


class ArticleAuthorSchema(BaseModel):
    name: str
    role: str
    avatar: Optional[str] = None


class LinkedGarmentSchema(BaseModel):
    id: Union[int, str]
    title: str
    slug: str
    price: int
    image: str
    badge: Optional[str] = None


class ArticleSectionSchema(BaseModel):
    heading: Optional[str] = None
    content: str
    pullQuote: Optional[str] = None
    image: Optional[str] = None
    imageCaption: Optional[str] = None


class JournalArticleResponse(BaseModel):
    id: Union[int, str]
    title: str
    slug: str
    category: str
    categoryLabel: str
    readTime: str
    date: str
    author: ArticleAuthorSchema
    coverImage: str
    excerpt: str
    featured: bool = False
    status: str = "published"
    sections: List[ArticleSectionSchema] = []
    linkedProductSlugs: Optional[List[str]] = []
    linkedProducts: Optional[List[LinkedGarmentSchema]] = []

    model_config = ConfigDict(from_attributes=True)

