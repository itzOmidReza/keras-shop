// frontend/app/composables/admin/useAdminArticles.ts
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { sharedJournalArticles } from '~/composables/journal/useJournalArticles'
import type { JournalArticle, ArticleCategory, LinkedGarment } from '~/types/domain'

export const ADMIN_ARTICLE_CATEGORIES: { id: ArticleCategory; label: string }[] = [
  { id: 'style-guide', label: 'راهنمای استایل' },
  { id: 'fabric-care', label: 'نگهداری الیاف لوکس' },
  { id: 'drop-story', label: 'داستان دراپ و کالکشن' },
]

export const PRESET_ARTICLE_COVERS = [
  {
    title: 'استایل ادیتوریال پاییز',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'بافت لوکس و کشمیر',
    url: 'https://images.unsplash.com/photo-1584297091622-af8e5fd053b9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'آتلیه و طراحی لباس',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'اکسسوری و ابریشم',
    url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'ورزش و ریکاوری آرامش',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'کمد کپسولی مینیمال',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  },
]

export function useAdminArticles() {
  const searchQuery = ref('')
  const selectedCategory = ref<string>('all')
  const selectedStatus = ref<'all' | 'published' | 'draft'>('all')

  const filteredArticles = computed(() => {
    let result = sharedJournalArticles.value

    if (selectedCategory.value !== 'all') {
      result = result.filter(a => a.category === selectedCategory.value)
    }

    if (selectedStatus.value !== 'all') {
      result = result.filter(a => a.status === selectedStatus.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.categoryLabel.toLowerCase().includes(q),
      )
    }

    return result
  })

  const stats = computed(() => {
    const all = sharedJournalArticles.value
    return {
      total: all.length,
      published: all.filter(a => a.status === 'published').length,
      drafts: all.filter(a => a.status === 'draft').length,
    }
  })

  const getArticleById = (id: number): JournalArticle | undefined => {
    return sharedJournalArticles.value.find(a => a.id === id)
  }

  const getArticleBySlug = (slug: string): JournalArticle | undefined => {
    return sharedJournalArticles.value.find(a => a.slug === slug)
  }

  const slugify = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
  }

  const createArticle = (payload: {
    title: string
    slug?: string
    category: ArticleCategory
    authorName: string
    authorRole?: string
    readTimeMinutes?: number
    coverImage: string
    excerpt: string
    content: string
    pullQuote?: string
    status: 'published' | 'draft'
    linkedProducts?: LinkedGarment[]
  }): JournalArticle => {
    const nextId =
      sharedJournalArticles.value.length > 0
        ? Math.max(...sharedJournalArticles.value.map(a => a.id)) + 1
        : 1

    const generatedSlug = payload.slug?.trim() || slugify(payload.title) || `article-${nextId}`
    const categoryObj = ADMIN_ARTICLE_CATEGORIES.find(c => c.id === payload.category)
    const categoryLabel = categoryObj ? categoryObj.label : 'راهنمای استایل'

    const newArticle: JournalArticle = {
      id: nextId,
      title: payload.title.trim(),
      slug: generatedSlug,
      category: payload.category,
      categoryLabel,
      readTime: `${payload.readTimeMinutes || 5} دقیقه`,
      date: 'امروز',
      author: {
        name: payload.authorName.trim() || 'ادیتور آتلیه کراس',
        role: payload.authorRole?.trim() || 'تیم تحریریه کراس',
      },
      coverImage:
        payload.coverImage.trim() ||
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      excerpt: payload.excerpt.trim(),
      featured: false,
      status: payload.status,
      sections: [
        {
          heading: 'مقدمه و چشم‌انداز',
          content: payload.content.trim(),
          pullQuote: payload.pullQuote?.trim() || undefined,
        },
      ],
      linkedProducts: payload.linkedProducts || [],
    }

    sharedJournalArticles.value.unshift(newArticle)
    toast.success(
      payload.status === 'published'
        ? 'مقاله با موفقیت منتشر شد.'
        : 'پیش‌نویس مقاله با موفقیت ذخیره گردید.',
    )

    return newArticle
  }

  const updateArticle = (
    id: number,
    payload: {
      title?: string
      slug?: string
      category?: ArticleCategory
      authorName?: string
      authorRole?: string
      readTimeMinutes?: number
      coverImage?: string
      excerpt?: string
      content?: string
      pullQuote?: string
      status?: 'published' | 'draft'
      linkedProducts?: LinkedGarment[]
    },
  ): boolean => {
    const index = sharedJournalArticles.value.findIndex(a => a.id === id)
    if (index === -1) {
      toast.error('مقاله مورد نظر یافت نشد.')
      return false
    }

    const current = sharedJournalArticles.value[index]
    if (!current) {
      toast.error('مقاله مورد نظر یافت نشد.')
      return false
    }

    const updatedCategory = payload.category || current.category
    const categoryObj = ADMIN_ARTICLE_CATEGORIES.find(c => c.id === updatedCategory)

    const updated: JournalArticle = {
      ...current,
      id: current.id,
      title: payload.title !== undefined ? payload.title.trim() : current.title,
      slug: payload.slug !== undefined && payload.slug.trim() ? payload.slug.trim() : current.slug,
      category: updatedCategory,
      categoryLabel: categoryObj ? categoryObj.label : current.categoryLabel,
      readTime:
        payload.readTimeMinutes !== undefined
          ? `${payload.readTimeMinutes} دقیقه`
          : current.readTime,
      coverImage: payload.coverImage !== undefined ? payload.coverImage.trim() : current.coverImage,
      excerpt: payload.excerpt !== undefined ? payload.excerpt.trim() : current.excerpt,
      status: payload.status !== undefined ? payload.status : current.status,
      author: {
        name:
          payload.authorName !== undefined ? payload.authorName.trim() : current.author.name,
        role:
          payload.authorRole !== undefined ? payload.authorRole.trim() : current.author.role,
        avatar: current.author.avatar,
      },
      sections:
        payload.content !== undefined
          ? [
              {
                heading: current.sections[0]?.heading || 'مقدمه و چشم‌انداز',
                content: payload.content.trim(),
                pullQuote:
                  payload.pullQuote !== undefined
                    ? payload.pullQuote.trim()
                    : current.sections[0]?.pullQuote,
              },
            ]
          : current.sections,
      linkedProducts:
        payload.linkedProducts !== undefined ? payload.linkedProducts : current.linkedProducts,
    }

    sharedJournalArticles.value[index] = updated
    toast.success('تغییرات مقاله با موفقیت ذخیره شد.')
    return true
  }

  const deleteArticle = (id: number): boolean => {
    const index = sharedJournalArticles.value.findIndex(a => a.id === id)
    if (index === -1) {
      toast.error('مقاله مورد نظر یافت نشد.')
      return false
    }

    const deleted = sharedJournalArticles.value.splice(index, 1)[0]
    if (deleted) {
      toast.success(`مقاله «${deleted.title}» با موفقیت حذف شد.`)
    }
    return true
  }

  const togglePublishStatus = (id: number): boolean => {
    const article = sharedJournalArticles.value.find(a => a.id === id)
    if (!article) return false

    article.status = article.status === 'published' ? 'draft' : 'published'
    toast.success(
      article.status === 'published'
        ? `مقاله «${article.title}» منتشر شد.`
        : `مقاله «${article.title}» به پیش‌نویس منتقل شد.`,
    )
    return true
  }

  return {
    articles: sharedJournalArticles,
    searchQuery,
    selectedCategory,
    selectedStatus,
    filteredArticles,
    stats,
    getArticleById,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
    togglePublishStatus,
    presetCovers: PRESET_ARTICLE_COVERS,
  }
}
