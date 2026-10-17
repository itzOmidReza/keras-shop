// frontend/app/composables/journal/useJournalArticles.ts
import { toast } from 'vue-sonner'
import type { JournalArticle } from '~/types/domain'

export const JOURNAL_CATEGORIES = [
  { id: 'all', label: 'همه' },
  { id: 'style-guide', label: 'راهنمای استایل' },
  { id: 'fabric-care', label: 'نگهداری الیاف لوکس' },
  { id: 'drop-story', label: 'داستان دراپ و کالکشن' },
] as const

export type JournalCategoryTab = typeof JOURNAL_CATEGORIES[number]['id']

// حالت اشتراکی مشترک میان ویترین ژورنال و پنل مدیریت
export const sharedJournalArticles = ref<JournalArticle[]>([])

export function useJournalArticles() {
  const activeCategory = ref<JournalCategoryTab>('all')
  const searchQuery = ref('')
  const newsletterEmail = ref('')

  const fetchArticles = async (force = false) => {
    if (sharedJournalArticles.value.length > 0 && !force) return
    try {
      const data = await $fetch<JournalArticle[]>('/api/articles')
      if (Array.isArray(data)) {
        sharedJournalArticles.value = data
      }
    } catch (err) {
      console.error('Failed to fetch journal articles from API:', err)
    }
  }

  if (sharedJournalArticles.value.length === 0) {
    useAsyncData('journal-articles-list', async () => {
      await fetchArticles()
      return sharedJournalArticles.value
    })
  }

  if (import.meta.client) {
    onMounted(() => {
      fetchArticles()
    })
  }

  // فقط مقالات منتشر شده برای ویترین
  const publishedArticles = computed(() => {
    return sharedJournalArticles.value.filter(article => article.status === 'published')
  })

  // مقاله ویژه سرتیتر کاور مجله (اولین مقاله با بج featured یا اولین مقاله منتشر شده)
  const featuredArticle = computed(() => {
    return (
      publishedArticles.value.find(article => article.featured) ||
      publishedArticles.value[0] ||
      null
    )
  })

  // لیست مقالات فیلتر شده بر اساس دسته‌بندی و جست‌وجو
  const filteredArticles = computed(() => {
    let result = publishedArticles.value

    if (activeCategory.value !== 'all') {
      result = result.filter(article => article.category === activeCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      result = result.filter(
        article =>
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.author.name.toLowerCase().includes(q) ||
          article.categoryLabel.toLowerCase().includes(q),
      )
    }

    return result
  })

  const getArticleBySlug = (slug: string): JournalArticle | undefined => {
    return sharedJournalArticles.value.find(article => article.slug === slug)
  }

  const handleSubscribe = () => {
    const email = newsletterEmail.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      toast.error('لطفاً آدرس ایمیل خود را وارد نمایید.')
      return
    }

    if (!emailRegex.test(email)) {
      toast.error('فرمت آدرس ایمیل وارد شده معتبر نمی‌باشد.')
      return
    }

    toast.success('عضویت شما در گاهنامه تحلیلی آتلیه کراس با موفقیت ثبت شد.')
    newsletterEmail.value = ''
  }

  return {
    articles: sharedJournalArticles,
    publishedArticles,
    featuredArticle,
    activeCategory,
    searchQuery,
    newsletterEmail,
    filteredArticles,
    getArticleBySlug,
    handleSubscribe,
  }
}
