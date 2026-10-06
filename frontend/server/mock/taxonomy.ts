// server/mock/taxonomy.ts
import type { StoreTaxonomy } from '~/types/domain'

export const defaultStoreTaxonomy: StoreTaxonomy = {
  colors: [
    { id: 'col-1', name: 'مشکی ذغالی', hex: '#1C1917', slug: 'charcoal-black', isSystemDefault: true },
    { id: 'col-2', name: 'کرم ماسه‌ای', hex: '#E7E2D7', slug: 'sand-cream', isSystemDefault: true },
    { id: 'col-3', name: 'طوسی ملانژ', hex: '#94A3B8', slug: 'melange-grey', isSystemDefault: true },
    { id: 'col-4', name: 'یشمی کدر', hex: '#4D5D53', slug: 'muted-jade', isSystemDefault: true },
    { id: 'col-5', name: 'شتری عسلی', hex: '#C2A68C', slug: 'honey-camel', isSystemDefault: true },
    { id: 'col-6', name: 'سفید عاجی', hex: '#F8FAFC', slug: 'ivory-white', isSystemDefault: true },
    { id: 'col-7', name: 'سرمه‌ای عمیق', hex: '#1E293B', slug: 'deep-navy', isSystemDefault: true },
  ],
  sizes: [
    { id: 'sz-1', name: 'XS', group: 'alpha', order: 1, isSystemDefault: true },
    { id: 'sz-2', name: 'S', group: 'alpha', order: 2, isSystemDefault: true },
    { id: 'sz-3', name: 'M', group: 'alpha', order: 3, isSystemDefault: true },
    { id: 'sz-4', name: 'L', group: 'alpha', order: 4, isSystemDefault: true },
    { id: 'sz-5', name: 'XL', group: 'alpha', order: 5, isSystemDefault: true },
    { id: 'sz-6', name: '36', group: 'numeric', order: 6, isSystemDefault: true },
    { id: 'sz-7', name: '38', group: 'numeric', order: 7, isSystemDefault: true },
    { id: 'sz-8', name: '40', group: 'numeric', order: 8, isSystemDefault: true },
    { id: 'sz-9', name: '42', group: 'numeric', order: 9, isSystemDefault: true },
    { id: 'sz-10', name: '44', group: 'numeric', order: 10, isSystemDefault: true },
    { id: 'sz-11', name: 'Free Size', group: 'free', order: 11, isSystemDefault: true },
    { id: 'sz-12', name: 'Standard', group: 'accessory', order: 12, isSystemDefault: false },
  ],
  categories: [
    { id: 'cat-1', name: 'شومیز و پیراهن', slug: 'shirts-blouses', division: 'apparel', iconName: 'Shirt', isActive: true },
    { id: 'cat-2', name: 'بافت و پلیور', slug: 'knitwear', division: 'apparel', iconName: 'Sparkles', isActive: true },
    { id: 'cat-3', name: 'پالتو و بارانی', slug: 'coats-jackets', division: 'apparel', iconName: 'Layers', isActive: true },
    { id: 'cat-4', name: 'شلوار و لگ', slug: 'pants', division: 'apparel', iconName: 'Scissors', isActive: true },
    { id: 'cat-5', name: 'تاپ و تیشرت', slug: 'tops', division: 'apparel', iconName: 'Sun', isActive: true },
    { id: 'cat-6', name: 'اسکارف و شال', slug: 'scarves', division: 'accessories', iconName: 'Wind', isActive: true },
    { id: 'cat-7', name: 'اکسسوری مو', slug: 'hair-accessories', division: 'accessories', iconName: 'Heart', isActive: true },
    { id: 'cat-8', name: 'دستمال سر', slug: 'bandanas', division: 'accessories', iconName: 'Sparkles', isActive: true },
  ],
  brands: [
    { id: 'br-1', name: 'Keras Atelier', slug: 'keras-atelier', isFeatured: true },
    { id: 'br-2', name: 'Totême', slug: 'toteme', isFeatured: true },
    { id: 'br-3', name: 'Massimo Dutti', slug: 'massimo-dutti', isFeatured: true },
    { id: 'br-4', name: 'COS', slug: 'cos', isFeatured: true },
    { id: 'br-5', name: 'Zara', slug: 'zara', isFeatured: true },
    { id: 'br-6', name: 'Mango', slug: 'mango', isFeatured: true },
  ],
  seasons: [
    { id: 'sea-1', name: 'پاییز ۱۴۰۵', slug: 'fall-1405', isCurrentDrop: true, isActive: true },
    { id: 'sea-2', name: 'زمستان ۱۴۰۵', slug: 'winter-1405', isCurrentDrop: false, isActive: true },
    { id: 'sea-3', name: 'بهار ۱۴۰۶', slug: 'spring-1406', isCurrentDrop: false, isActive: true },
    { id: 'sea-4', name: 'تابستان ۱۴۰۵', slug: 'summer-1405', isCurrentDrop: false, isActive: true },
  ],
}

export const currentStoreTaxonomy: StoreTaxonomy = JSON.parse(
  JSON.stringify(defaultStoreTaxonomy),
)

