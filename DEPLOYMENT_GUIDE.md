# راهنمای جامع استقرار پروژه کراس (Keras Atelier) روی دامنه `kerass.ir`

این مستند راهنمای مرحله‌به‌مرحله استقرار بک‌اند (FastAPI) و فرانت‌اند (Nuxt 4) به همراه پایگاه داده PostgreSQL و وب‌سرور Nginx بر روی دامنه رسمی **`kerass.ir`** (سرور `89.44.240.122`) است.

---

## ۱. مشخصات پیکربندی‌های اعمال‌شده برای دامنه `kerass.ir`

### ۱.۱. کانفیگ بک‌اند (`backend/.env`)
فایل [backend/.env](file:///home/fardin/Desktop/work%20space/projects/keras/backend/.env) برای دامنه جدید و درگاه‌های پرداخت به‌روزرسانی شد:

```env
ENVIRONMENT=production
FRONTEND_URL=https://kerass.ir
SECRET_KEY=c1cde20aca7d5923fd77d5ea46ad811bbf79522fd07f50286d44c5f706abccaf

# مجاز بودن دامنه رسمی، ساب‌دامین www، آی‌پی سرور و لوکال‌هاست جهت CORS
BACKEND_CORS_ORIGINS=https://kerass.ir,https://www.kerass.ir,http://kerass.ir,http://www.kerass.ir,http://localhost:3000,http://127.0.0.1:3000,http://89.44.240.122:3000,http://89.44.240.122,http://localhost,http://127.0.0.1

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

# درگاه پرداخت سامان کیش (SEP)
SEP_TERMINAL_ID=15793309
USE_MOCK_PAYMENT=false
```

> **نکته درگاه پرداخت:** مقدار `FRONTEND_URL=https://kerass.ir` تضمین می‌کند بازگشت مشتری از درگاه شاپرک/سامان به آدرس امن `https://kerass.ir/payment/callback?order_id=...` هدایت شود.

---

### ۱.۲. کانفیگ فرانت‌اند (`frontend/.env`)
فایل [frontend/.env](file:///home/fardin/Desktop/work%20space/projects/keras/frontend/.env):

```env
# اتصال سرور Nuxt به بک‌اند لوکال داخل سرور
BACKEND_URL=http://127.0.0.1:8000

# نشانی رسمی و عمومی سایت برای سئو و ساخت متاتگ‌های Canonical
NUXT_PUBLIC_SITE_URL=https://kerass.ir

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

یا دستورات زیر را مستقیماً در PostgreSQL سرور اجرا نمایید:

```bash
sudo -u postgres psql <<'EOF'
CREATE USER sage_user WITH PASSWORD 'kerash#shop';
CREATE DATABASE keras_db OWNER sage_user;
GRANT ALL PRIVILEGES ON DATABASE keras_db TO sage_user;
\c keras_db
GRANT ALL ON SCHEMA public TO sage_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO sage_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sage_user;
EOF
```

سپس جداول و داده‌های اولیه را اعمال نمایید:
```bash
cd backend
source venv/bin/activate
alembic upgrade head
python -m app.db.seed
```

---

## ۳. اجرای پایدار با سرویس‌های لینوکس (systemd)

روی سرور، سرویس‌ها را کپی و فعال کنید:

```bash
sudo cp deploy/systemd/keras-backend.service /etc/systemd/system/
sudo cp deploy/systemd/keras-frontend.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl restart keras-backend
sudo systemctl restart keras-frontend
sudo systemctl enable keras-backend keras-frontend
```

بررسی وضعیت:
```bash
sudo systemctl status keras-backend
sudo systemctl status keras-frontend
```

---

## ۴. پیکربندی وب‌سرور Nginx و اتصال به دامنه `kerass.ir`

فایل کانفیگ در [deploy/nginx/keras.conf](file:///home/fardin/Desktop/work%20space/projects/keras/deploy/nginx/keras.conf) برای دامنه‌های `kerass.ir` و `www.kerass.ir` تنظیم شده است.

### ۴.۱. قرار دادن کانفیگ در Nginx:
```bash
sudo cp deploy/nginx/keras.conf /etc/nginx/sites-available/kerass.conf
sudo ln -sf /etc/nginx/sites-available/kerass.conf /etc/nginx/sites-enabled/kerass.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## ۵. فعال‌سازی گواهی رایگان SSL (HTTPS) با Let's Encrypt

برای فعال‌سازی خودکار HTTPS و ریدایرکت امن:

```bash
# نصب Certbot و پلاگین Nginx (در صورت عدم نصب قبلی)
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# دریافت گواهینامه برای دامنه‌های kerass.ir و www.kerass.ir
sudo certbot --nginx -d kerass.ir -d www.kerass.ir
```

سرتبوت به‌طور خودکار:
۱. گواهینامه‌های SSL معتبر را صادر می‌کند.
۲. بلاک `listen 443 ssl` را در Nginx تنظیم می‌کند.
۳. تمام ترافیک `http://` را به `https://kerass.ir` ریدایرکت می‌کند.
۴. تمدید خودکار (Auto-Renewal) را فعال می‌نماید.

---

## ۶. تست و بررسی نهایی دامنه

پس از اجرای مراحل فوق:
1. سایت در مرورگر: `https://kerass.ir`
2. تست مستقیم اندپوینت‌های بک‌اند از طریق روتینگ Nginx:
   ```bash
   curl -I https://kerass.ir/api/v1/products
   curl -I https://kerass.ir/docs
   ```
3. تست درگاه پرداخت:
   در زمان ثبت سفارش، درگاه شاپرک/سامان پس از انجام تراکنش خریدار را مستقیماً به صفحه `https://kerass.ir/payment/callback` هدایت خواهد کرد.
