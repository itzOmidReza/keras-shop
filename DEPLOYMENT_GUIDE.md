# راهنمای استقرار پروژه کراس (Keras Atelier) روی سرور لینوکس

این مستند راهنمای مرحله‌به‌مرحله استقرار بک‌اند (FastAPI) و فرانت‌اند (Nuxt 4) به همراه پایگاه داده PostgreSQL بر روی سرور با آی‌پی `89.44.240.122` است.

---

## ۱. مشخصات تغییرات اعمال‌شده در فایل‌های کانفیگ (`.env`)

### ۱.۱. کانفیگ بک‌اند (`backend/.env`)
فایل [backend/.env](file:///home/fardin/Desktop/work%20space/projects/keras/backend/.env) با مقادیر درخواستی شما به‌روزرسانی شد:

```env
ENVIRONMENT=production
FRONTEND_URL=http://89.44.240.122:3000
SECRET_KEY=c1cde20aca7d5923fd77d5ea46ad811bbf79522fd07f50286d44c5f706abccaf

# مجاز بودن هم لوکال‌هاست و هم آی‌پی سرور برای درخواست‌های CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://89.44.240.122:3000,http://89.44.240.122,http://localhost,http://127.0.0.1

# تنظیمات پایگاه داده
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=sage_user
POSTGRES_PASSWORD=kerash#shop
POSTGRES_DB=keras_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# FarazSMS
FARAZSMS_API_KEY=9LG3Nln1T4XoyqpCh6d64nkAfY2Ks9UNTG6o7attn2LLYsRePt
FARAZSMS_ORIGINATOR=90008361
FARAZSMS_PATTERN_CODE=gaNfzD7Sdg
FARAZSMS_CODE_VARIABLE=code

# درگاه پرداخت
SEP_TERMINAL_ID=15793309
USE_MOCK_PAYMENT=false
```

> **نکته فنی مهم:**  
> کاراکتر `#` در پسورد `kerash#shop` یک کاراکتر رزرو شده در پروتکل URL محسوب می‌شود. در فایل [backend/app/core/config.py](file:///home/fardin/Desktop/work%20space/projects/keras/backend/app/core/config.py) مکانیزم خودکار `urllib.parse.quote_plus` قرار داده شد تا پسورد هنگام تشکیل رشته اتصال به شکل استاندارد `kerash%23shop` کدگذاری شود تا هیچ تداخلی در اتصال موتور `asyncpg` یا `Alembic` رخ ندهد.

### ۱.۲. کانفیگ فرانت‌اند (`frontend/.env`)
فایل [frontend/.env](file:///home/fardin/Desktop/work%20space/projects/keras/frontend/.env) نیز برای سرور تنظیم شد:

```env
# اتصال به بک‌اند داخلی روی سرور
BACKEND_URL=http://127.0.0.1:8000

# نشانی عمومی سایت روی سرور
NUXT_PUBLIC_SITE_URL=http://89.44.240.122:3000

PORT=3000
HOST=0.0.0.0
```

---

## ۲. راه‌اندازی پایگاه داده `keras_db` روی سرور

روی سرور لینوکس، اسکریپت آماده [deploy/init_remote_db.sh](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/init_remote_db.sh) را اجرا کنید:

```bash
chmod +x deploy/init_remote_db.sh
./deploy/init_remote_db.sh
```

یا دستورات زیر را مستقیماً در سرور اجرا فرمایید:

```bash
sudo -u postgres psql
```

سپس در کنسول PostgreSQL:

```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'sage_user') THEN
    CREATE ROLE sage_user LOGIN PASSWORD 'kerash#shop';
  ELSE
    ALTER ROLE sage_user WITH PASSWORD 'kerash#shop';
  END IF;
END
$$;

SELECT 'CREATE DATABASE keras_db OWNER sage_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keras_db')\gexec

GRANT ALL PRIVILEGES ON DATABASE keras_db TO sage_user;
\c keras_db
GRANT ALL ON SCHEMA public TO sage_user;
ALTER SCHEMA public OWNER TO sage_user;
\q
```

---

## ۳. بازگردانی داده‌های پیش‌فرض دیتابیس (۲ روش انتخابی)

### روش اول (ساده‌ترین روش - بازگردانی مستقیم دامپ):
یک نسخه کامل از داده‌های کاتالوگ لباس‌ها، دسته‌بندی‌ها، مقالات و کوپن‌ها در فایل [deploy/keras_db_seed_dump.sql](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/keras_db_seed_dump.sql) آماده شده است:

```bash
PGPASSWORD='kerash#shop' psql -U sage_user -h localhost -d keras_db < deploy/keras_db_seed_dump.sql
```

### روش دوم (از طریق Alembic و پایتون):
```bash
cd backend
source venv/bin/activate
alembic upgrade head
python -m app.db.seed
```

---

## ۴. ساخت و اجرای فرانت‌اند (Nuxt 4)

روی سرور برای بیلد پروداکشن:

```bash
cd frontend
bun install # یا npm install
bun run build # یا npm run build
```

پس از اتمام بیلد، سرور مستقل در مسیر `frontend/.output/server/index.mjs` ایجاد می‌شود.

---

## ۵. اجرای پایدار با سرویس‌های لینوکس (systemd)

دو فایل سرویس در مسیر `deploy/systemd/` برای شما ایجاد شد:

۱. فایل سرویس بک‌اند: [deploy/systemd/keras-backend.service](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/systemd/keras-backend.service)  
۲. فایل سرویس فرانت‌اند: [deploy/systemd/keras-frontend.service](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/systemd/keras-frontend.service)

برای فعال‌سازی روی سرور:

```bash
sudo cp deploy/systemd/keras-backend.service /etc/systemd/system/
sudo cp deploy/systemd/keras-frontend.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable --now keras-backend
sudo systemctl enable --now keras-frontend
```

بررسی وضعیت:
```bash
sudo systemctl status keras-backend
sudo systemctl status keras-frontend
```

---

## ۶. تنظیم وب‌سرور Nginx (اختیاری جهت روتینگ روی پورت ۸۰)

فایل کانفیگ آماده Nginx در [deploy/nginx/keras.conf](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/nginx/keras.conf) قرار داده شده است.  
با قرار دادن آن در مسیر `/etc/nginx/sites-available/keras.conf` و ایجاد لینک نمادین در `sites-enabled`، بدون نیاز به ذکر پورت ۳۰۰۰ در آدرس‌بار، سایت روی آی‌پی `http://89.44.240.122` مستقیماً باز می‌شود:

```bash
sudo cp deploy/nginx/keras.conf /etc/nginx/sites-available/keras.conf
sudo ln -s /etc/nginx/sites-available/keras.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

