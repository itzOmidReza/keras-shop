from typing import Optional
from pydantic import BaseModel, ConfigDict


class SiteBrandingSettings(BaseModel):
    brandNameFa: str = "کراس"
    brandNameEn: str = "Keras"
    tagline: str = "زیبایی در سادگی، آزادی در حرکت"
    subTagline: str = "پوشاک تخصصی تمرین و روزمره زنانه"
    logoUrl: str = "/logo.svg"
    faviconUrl: str = "/favicon.ico"
    metaDescription: str = "پوشاک تخصصی زنانه کراس - بافت‌های بدون درز، راحتی و آزادی حرکت"


class SiteContactSettings(BaseModel):
    supportPhone: str = "۰۲۱-۸۸۸۸۴۴۲۲"
    supportPhoneRaw: str = "02188884422"
    inquiryMobile: str = "09120000000"
    whatsappNumber: str = "09120000000"
    officialEmail: str = "care@kerass.ir"
    atelierAddress: str = "تهران، جردن، خیابان سعیدی، پلاک ۲۴"
    workingHours: str = "شنبه تا پنج‌شنبه: ۹ الی ۱۸"


class SiteShippingSettings(BaseModel):
    freeShippingThreshold: int = 1500000
    flatShippingFee: int = 65000
    estimatedDispatchText: str = "ارسال ۲ تا ۴ روز کاری با پست پیشتاز و تیپاکس"
    announcementBarText: str = "ارسال رایگان برای تمام سفارش‌های بالای ۱٫۵۰۰٫۰۰۰ تومان"
    announcementBarHighlight: str = "ضمانت تعویض تا ۷ روز کاری"
    announcementBarVisible: bool = True


class SiteCheckoutRules(BaseModel):
    minCartTotal: int = 100000
    maxItemQuantityPerCart: int = 5
    reservationTimeoutMinutes: int = 15
    returnPolicyDays: int = 7
    holidayModeEnabled: bool = False
    holidayNoticeText: str = "فروشگاه موقتاً به دلیل تعطیلات ارسال سفارشات را متوقف کرده است."


class SiteSocialSettings(BaseModel):
    instagram: str = "https://instagram.com/keras.brand"
    telegram: str = "https://t.me/kerasbrand"
    pinterest: str = "https://pinterest.com/kerasbrand"
    youtube: str = "https://youtube.com/@kerasbrand"


class SiteIntegrationsSettings(BaseModel):
    googleAnalyticsId: str = "G-KERAS2026"
    googleTagManagerId: str = "GTM-KERAS01"
    enamadCode: str = "12345678"
    samandehiCode: str = "87654321"
    smsProviderSender: str = "30007788"
    smsProviderBalance: int = 125000


class SiteHomeHeroSettings(BaseModel):
    badgeText: str = "طراحی اختصاصی • تیراژ محدود پاییز ۱۴۰۵"
    titlePrefix: str = "استایل منحصربه‌فرد"
    titleHighlight: str = "پاییز"
    titleSuffix: str = "خود را بسازید"
    description: str = "تلفیق پارچه‌های الیاف طبیعی، بافت‌های مرینوس و ابریشم خالص با الگوهای مدرن برای بانوان آگاه."
    primaryCtaText: str = "مشاهده کالکشن پاییز"
    primaryCtaLink: str = "/shop?season=fall-1405"
    secondaryCtaText: str = "اکسسوری و شال‌ها"
    secondaryCtaLink: str = "/shop?division=accessories"
    bottomBadgeText: str = "کالکشن دست‌دوز استودیو کراس • نسخه محدود پاییز ۱۴۰۵"
    imageUrl: str = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
    imageAlt: str = "مدل کالکشن پاییز ۱۴۰۵ کراس با پالتوی پشمی و بافت لوکس"
    imageBadgeLabel: str = "طراحی کپسولی"
    imageBadgeValue: str = "پاییز ۱۴۰۵ • Fall Drop"


class SiteSettingsResponse(BaseModel):
    branding: SiteBrandingSettings = SiteBrandingSettings()
    contact: SiteContactSettings = SiteContactSettings()
    shipping: SiteShippingSettings = SiteShippingSettings()
    checkoutRules: SiteCheckoutRules = SiteCheckoutRules()
    social: SiteSocialSettings = SiteSocialSettings()
    integrations: SiteIntegrationsSettings = SiteIntegrationsSettings()
    homeHero: Optional[SiteHomeHeroSettings] = SiteHomeHeroSettings()
    updatedAt: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

