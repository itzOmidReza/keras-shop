// frontend/app/composables/ops/useOpsArticles.ts
import { toast } from 'vue-sonner'

export interface ArticleItem {
  id: number
  title: string
  slug: string
  category: string
  categoryLabel: string
  readTime: string
  date: string
  author: string
  authorRole: string
  image: string
  excerpt: string
  status: 'published' | 'draft'
}

const articlesList = ref<ArticleItem[]>([
  {
    id: 1,
    title: 'علم فشرده‌سازی عضلانی و بازیابی سریع: چرا پارچه‌های ۳۰۰ گرمی سرنوشت‌سازند؟',
    slug: 'science-of-muscle-compression-300gsm',
    category: 'science',
    categoryLabel: 'علم متریال و الیاف',
    readTime: '۶ دقیقه',
    date: '۱۲ مهر ۱۴۰۵',
    author: 'دکتر مریم رادمنش',
    authorRole: 'متخصص فیزیولوژی ورزش',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    excerpt: 'بررسی بیومکانیک بافت‌های متراکم الاستین بر بهبود بازگشت خون سیاهرگی و کاهش تجمع اسید لاکتیک.',
    status: 'published',
  },
  {
    id: 2,
    title: 'هنر لایه‌بندی ادیتوریال پاییز ۱۴۰۵: از شومیز لینن اسلپ تا کت پشمی اورسایز',
    slug: 'editorial-autumn-layering-guide-1405',
    category: 'styling',
    categoryLabel: 'استایلینگ و ترندها',
    readTime: '۴ دقیقه',
    date: '۰۸ مهر ۱۴۰۵',
    author: 'سپهر رادمنش',
    authorRole: 'مدیر هنری استودیو کراس',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    excerpt: 'چگونه پارچه‌های تنفس‌پذیر تابستانی را با ژاکت‌های پشمی سنگین پاییزی ترکیب کنیم بدون از دست رفتن سبکی فرم.',
    status: 'published',
  },
  {
    id: 3,
    title: 'اصول پایداری الیاف نچرال: تست شفافیت و تراکم نخ در آتلیه مد',
    slug: 'natural-fiber-sustainability-metrics',
    category: 'sustainability',
    categoryLabel: 'پایداری و مراقبت',
    readTime: '۵ دقیقه',
    date: '۰۲ مهر ۱۴۰۵',
    author: 'نیلوفر امینی',
    authorRole: 'سرپرست کنترل کیفی الیاف',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    excerpt: 'استانداردهای بین‌المللی Oeko-Tex و GOTS در فرآیند رنگرزی طبیعی و ثبات رنگ در برابر شست‌وشو.',
    status: 'draft',
  },
])

const isArticleModalOpen = ref(false)
const editingArticle = ref<ArticleItem | null>(null)

const articleForm = ref({
  title: '',
  slug: '',
  category: 'science',
  categoryLabel: 'علم متریال و الیاف',
  author: 'دکتر مریم رادمنش',
  authorRole: 'هیئت علمی آتلیه کراس',
  readTime: '۵ دقیقه',
  image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  excerpt: '',
  content: '',
})

export function useOpsArticles() {
  const openAddArticleModal = () => {
    editingArticle.value = null
    articleForm.value = {
      title: '',
      slug: '',
      category: 'styling',
      categoryLabel: 'استایلینگ و ترندها',
      author: 'سپهر رادمنش',
      authorRole: 'مدیر هنری آتلیه کراس',
      readTime: '۴ دقیقه',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      excerpt: '',
      content: '',
    }
    isArticleModalOpen.value = true
  }

  const saveArticle = (publishNow = false) => {
    if (!articleForm.value.title.trim()) {
      toast.error('عنوان مقاله الزامی است.')
      return
    }

    const slug =
      articleForm.value.slug.trim() ||
      `journal-${Date.now().toString().slice(-4)}`

    if (editingArticle.value) {
      Object.assign(editingArticle.value, {
        title: articleForm.value.title,
        slug,
        category: articleForm.value.category,
        categoryLabel: articleForm.value.categoryLabel,
        author: articleForm.value.author,
        readTime: articleForm.value.readTime,
        image: articleForm.value.image,
        excerpt: articleForm.value.excerpt,
        status: publishNow ? 'published' : editingArticle.value.status,
      })
      toast.success('مقاله با موفقیت به‌روزرسانی شد.')
    } else {
      const newArt: ArticleItem = {
        id: Date.now(),
        title: articleForm.value.title,
        slug,
        category: articleForm.value.category,
        categoryLabel: articleForm.value.categoryLabel,
        readTime: articleForm.value.readTime,
        date: 'امروز',
        author: articleForm.value.author,
        authorRole: articleForm.value.authorRole,
        image: articleForm.value.image,
        excerpt: articleForm.value.excerpt,
        status: publishNow ? 'published' : 'draft',
      }
      articlesList.value.unshift(newArt)
      toast.success(
        publishNow
          ? 'مقاله جدید در ژورنال منتشر شد.'
          : 'پیش‌نویس مقاله با موفقیت ذخیره گردید.',
      )
    }

    isArticleModalOpen.value = false
  }

  const toggleArticleStatus = (art: ArticleItem) => {
    art.status = art.status === 'published' ? 'draft' : 'published'
    toast.success(
      `وضعیت مقاله «${art.title}» به ${art.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'} تغییر یافت.`,
    )
  }

  return {
    articlesList,
    isArticleModalOpen,
    editingArticle,
    articleForm,
    openAddArticleModal,
    saveArticle,
    toggleArticleStatus,
  }
}
