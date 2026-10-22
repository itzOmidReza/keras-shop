--
-- PostgreSQL database dump
--

\restrict VGg0DKdNUdsiCRpAGnjIXUaRuagRKUVvbLXjwGjp8f3W8bz51vpxXldbkMXWJgx

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: discount_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.discount_type_enum AS ENUM (
    'PERCENTAGE',
    'FIXED_TOMAN'
);


--
-- Name: fulfillment_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.fulfillment_type_enum AS ENUM (
    'EXPRESS',
    'STANDARD',
    'PRE_ORDER'
);


--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status_enum AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


--
-- Name: payment_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_provider_enum AS ENUM (
    'ZARINPAL',
    'sep',
    'SEP',
    'SHAPARAK',
    'shaparak',
    'zarinpal'
);


--
-- Name: payment_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status_enum AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    user_id uuid NOT NULL,
    title character varying(50) NOT NULL,
    receiver_name character varying(100) NOT NULL,
    receiver_phone character varying(15) NOT NULL,
    province character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    postal_address character varying(500) NOT NULL,
    postal_code character varying(10) NOT NULL,
    is_default boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    building_number character varying(20),
    unit character varying(20),
    notes character varying(255)
);


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: campaign_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_categories (
    campaign_id uuid NOT NULL,
    category_id uuid NOT NULL
);


--
-- Name: campaign_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_products (
    campaign_id uuid NOT NULL,
    product_id uuid NOT NULL
);


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    title character varying(150) NOT NULL,
    slug character varying(160) NOT NULL,
    description character varying(500),
    banner_url character varying(255),
    discount_type public.discount_type_enum NOT NULL,
    discount_value bigint NOT NULL,
    is_active boolean NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    title character varying(100) NOT NULL,
    slug character varying(120) NOT NULL,
    description text,
    icon character varying(255),
    parent_id uuid,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    code character varying(30) NOT NULL,
    discount_type public.discount_type_enum NOT NULL,
    discount_value bigint NOT NULL,
    min_purchase_amount_rial bigint NOT NULL,
    max_discount_amount_rial bigint,
    usage_limit integer,
    times_used integer NOT NULL,
    is_active boolean NOT NULL,
    valid_from timestamp with time zone,
    valid_until timestamp with time zone,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: journal_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_articles (
    title character varying(300) NOT NULL,
    slug character varying(320) NOT NULL,
    category character varying(50) NOT NULL,
    category_label character varying(100) NOT NULL,
    read_time character varying(50) NOT NULL,
    date character varying(50) NOT NULL,
    author json NOT NULL,
    cover_image character varying(500) NOT NULL,
    excerpt text NOT NULL,
    featured boolean NOT NULL,
    status character varying(20) NOT NULL,
    sections json NOT NULL,
    linked_product_slugs json,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    order_id uuid NOT NULL,
    variant_id uuid,
    product_title character varying(200) NOT NULL,
    variant_title character varying(100) NOT NULL,
    quantity integer NOT NULL,
    unit_price_rial bigint NOT NULL,
    total_price_rial bigint NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    product_id integer,
    product_slug character varying(220),
    size character varying(50),
    color character varying(50),
    image character varying(500)
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_number character varying(30) NOT NULL,
    user_id uuid NOT NULL,
    customer_name character varying(100) NOT NULL,
    phone_number character varying(15) NOT NULL,
    province character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    postal_address character varying(500) NOT NULL,
    postal_code character varying(10) NOT NULL,
    subtotal_amount_rial bigint NOT NULL,
    discount_amount_rial bigint NOT NULL,
    shipping_cost_rial bigint NOT NULL,
    total_amount_rial bigint NOT NULL,
    status public.order_status_enum NOT NULL,
    shipping_method character varying(50) NOT NULL,
    zarinpal_authority character varying(100),
    zarinpal_ref_id character varying(100),
    tracking_code character varying(100),
    shipping_provider character varying(100),
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    building_number character varying(20),
    unit character varying(20),
    notes character varying(255),
    status_label character varying(100),
    payment_method character varying(50) DEFAULT 'online_gateway'::character varying,
    estimated_delivery character varying(100),
    timeline json DEFAULT '[]'::json
);


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id uuid NOT NULL,
    phone character varying(20) NOT NULL,
    code_hash character varying(255) NOT NULL,
    attempts integer NOT NULL,
    is_used boolean NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_transactions (
    order_id uuid NOT NULL,
    provider public.payment_provider_enum NOT NULL,
    amount_rial bigint NOT NULL,
    status public.payment_status_enum NOT NULL,
    authority character varying(100) NOT NULL,
    ref_id character varying(100),
    card_pan character varying(20),
    raw_response text,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    expires_at character varying(100),
    callback_url character varying(500)
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    product_slug character varying(220) NOT NULL,
    product_title character varying(200) NOT NULL,
    product_thumbnail character varying(500),
    author_name character varying(100) NOT NULL,
    rating double precision NOT NULL,
    date character varying(50) NOT NULL,
    comment text NOT NULL,
    fit_feedback character varying(50),
    is_verified_buyer boolean NOT NULL,
    status character varying(20) NOT NULL,
    size_purchased character varying(20),
    reply json,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_variants (
    product_id uuid NOT NULL,
    title character varying(100) NOT NULL,
    sku character varying(50) NOT NULL,
    price_rial bigint NOT NULL,
    compare_at_price_rial bigint,
    stock integer NOT NULL,
    is_active boolean NOT NULL,
    attributes json,
    fulfillment_type character varying(20),
    supplier_id character varying(36),
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    numeric_id integer,
    color character varying(50),
    color_hex character varying(20),
    size character varying(20),
    reserved integer DEFAULT 0,
    CONSTRAINT check_stock_non_negative CHECK ((stock >= 0))
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    title character varying(200) NOT NULL,
    slug character varying(220) NOT NULL,
    description text NOT NULL,
    category_id uuid,
    images text NOT NULL,
    base_price_rial bigint NOT NULL,
    is_active boolean NOT NULL,
    fulfillment_type public.fulfillment_type_enum NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    numeric_id integer,
    brand character varying(100) DEFAULT 'keras-atelier'::character varying,
    division character varying(50) DEFAULT 'apparel'::character varying,
    season character varying(50) DEFAULT 'fall-1405'::character varying,
    badge character varying(50),
    line character varying(20),
    fit_note text,
    fabric json,
    fabric_composition character varying(255),
    fabric_gsm integer,
    stretch integer,
    softness integer,
    opacity integer,
    has_transparency_test boolean DEFAULT false,
    rating_avg double precision DEFAULT 5.0,
    rating_count integer DEFAULT 0,
    sizes json DEFAULT '[]'::json,
    available_sizes json DEFAULT '[]'::json,
    colors json DEFAULT '[]'::json,
    size_chart json,
    activities json DEFAULT '[]'::json,
    compare_at_price_rial bigint
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    key character varying(100) NOT NULL,
    value json NOT NULL,
    description text,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: taxonomy_brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxonomy_brands (
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    logo_svg character varying(255),
    is_featured boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: taxonomy_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxonomy_categories (
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    division character varying(50) NOT NULL,
    icon_name character varying(100),
    is_active boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: taxonomy_colors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxonomy_colors (
    name character varying(100) NOT NULL,
    hex character varying(20) NOT NULL,
    slug character varying(100) NOT NULL,
    is_system_default boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: taxonomy_seasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxonomy_seasons (
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    is_current_drop boolean NOT NULL,
    is_active boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: taxonomy_sizes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxonomy_sizes (
    name character varying(50) NOT NULL,
    "group" character varying(50) NOT NULL,
    "order" integer NOT NULL,
    is_system_default boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    phone character varying(15) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(120),
    full_name character varying(100),
    role public.user_role_enum NOT NULL,
    is_active boolean NOT NULL,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    birth_date date
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (user_id, title, receiver_name, receiver_phone, province, city, postal_address, postal_code, is_default, id, created_at, updated_at, building_number, unit, notes) FROM stdin;
d8a628ed-155f-407c-9ecf-2573f62a732d	خانه	فردین بیروزی	09185621567	کرمانشاه	کرمانشاه	شهرک امام	0123456789	f	bde066a6-6880-4c8b-a128-c3ce05e84af8	2026-09-06 15:03:59.323324+03:30	2026-09-06 15:03:59.323328+03:30	\N	\N	\N
d8a628ed-155f-407c-9ecf-2573f62a732d	خانه	هستی هشمتی	09185621567	کرمانشاه	کرمانشاه	فرهنگیان فاز ۲	0123456789	t	a75dd168-92d4-4fcf-8066-03db38bf05e3	2026-09-06 15:03:34.644332+03:30	2026-09-06 15:04:42.762956+03:30	\N	\N	\N
c68f46bd-e81f-486f-9ddf-519ba42da975	منزل	سارا احمدی	09123456789	تهران	تهران	خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶	1433714521	t	f5c7f458-7936-476f-8226-77c96f60fac3	2026-09-06 15:18:35.667055+03:30	2026-09-06 15:18:35.66706+03:30	\N	\N	\N
7e042d39-33a5-4e16-b92b-f7a0d431e97d	منزل	سارا رادمنش	09121112233	تهران	تهران	زعفرانیه، خیابان مقدس اردبیلی، پلاک ۲۴، واحد ۶	1983963111	t	63a77161-5be4-42f3-b4c6-0968fb95dfc8	2026-10-13 01:11:51.030362+03:30	2026-10-13 01:11:51.030365+03:30	۲۴	۶	\N
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
e1f2a3b4c5d6
\.


--
-- Data for Name: campaign_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaign_categories (campaign_id, category_id) FROM stdin;
\.


--
-- Data for Name: campaign_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaign_products (campaign_id, product_id) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaigns (title, slug, description, banner_url, discount_type, discount_value, is_active, start_date, end_date, id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (title, slug, description, icon, parent_id, id, created_at, updated_at) FROM stdin;
شومیز و پیراهن	shirts-blouses	کالکشن تخصصی شومیز و پیراهن	\N	\N	d854aace-8451-47e8-9014-f5f808392016	2026-10-13 01:18:49.09401+03:30	2026-10-13 01:18:49.094013+03:30
بافت و پلیور	knitwear	کالکشن تخصصی بافت و پلیور	\N	\N	ad00774e-41e2-452f-bde1-249edf7bfdd5	2026-10-13 01:18:49.107259+03:30	2026-10-13 01:18:49.107262+03:30
پالتو و بارانی	coats-jackets	کالکشن تخصصی پالتو و بارانی	\N	\N	f4f795b3-44e9-4499-a40a-1cda2a9daacc	2026-10-13 01:18:49.111204+03:30	2026-10-13 01:18:49.111206+03:30
شلوار و لگ	pants	کالکشن تخصصی شلوار و لگ	\N	\N	80c0f0d2-4490-4a14-a4c7-cb0909bfa91e	2026-10-13 01:18:49.113699+03:30	2026-10-13 01:18:49.113701+03:30
تاپ و تیشرت	tops	کالکشن تخصصی تاپ و تیشرت	\N	\N	e127ee50-17ed-4758-83cb-373031d6af1d	2026-10-13 01:18:49.116167+03:30	2026-10-13 01:18:49.11617+03:30
اسکارف و شال	scarves	کالکشن تخصصی اسکارف و شال	\N	\N	f99978d8-007a-4107-9f49-233f8a270f57	2026-10-13 01:18:49.118708+03:30	2026-10-13 01:18:49.11871+03:30
اکسسوری مو	hair-accessories	کالکشن تخصصی اکسسوری مو	\N	\N	215e21de-ddc4-4026-83d5-96e69fd834d1	2026-10-13 01:18:49.121207+03:30	2026-10-13 01:18:49.12121+03:30
دستمال سر	bandanas	کالکشن تخصصی دستمال سر	\N	\N	a0b99b31-338e-4b12-9ebf-c01c34e877d9	2026-10-13 01:18:49.123587+03:30	2026-10-13 01:18:49.123589+03:30
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (code, discount_type, discount_value, min_purchase_amount_rial, max_discount_amount_rial, usage_limit, times_used, is_active, valid_from, valid_until, id, created_at, updated_at) FROM stdin;
KERAS-PRO	PERCENTAGE	20	20000000	8000000	100	42	t	\N	\N	42324cd7-8f91-4efe-ba59-541b018e6902	2026-10-17 22:44:04.227736+03:30	2026-10-17 22:44:04.227741+03:30
SUMMER1405	PERCENTAGE	15	15000000	6000000	150	88	t	\N	\N	34bae9b2-c262-479d-ad01-0a969b7cf1b4	2026-10-17 22:44:04.227753+03:30	2026-10-17 22:44:04.227754+03:30
VIP-ATELIER	FIXED_TOMAN	5000000	40000000	5000000	50	15	t	\N	\N	3dddfcb7-16fc-4386-8e98-5cec3da396ce	2026-10-17 22:44:04.227762+03:30	2026-10-17 22:44:04.227763+03:30
WELCOME-KERAS	PERCENTAGE	10	10000000	3000000	500	230	t	\N	\N	1c5c3e29-28c0-4b01-afb5-892a614924a8	2026-10-17 22:44:04.227769+03:30	2026-10-17 22:44:04.22777+03:30
\.


--
-- Data for Name: journal_articles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.journal_articles (title, slug, category, category_label, read_time, date, author, cover_image, excerpt, featured, status, sections, linked_product_slugs, id, created_at, updated_at) FROM stdin;
راهنمای جامع استایل چندلایه پاییز: تلفیق هوشمندانه گرما و وقار	the-art-of-autumn-layering	style-guide	راهنمای استایل	۵ دقیقه	۱۲ مهر ۱۴۰۵	{"name": "\\u0633\\u0627\\u0631\\u0627 \\u06a9\\u06cc\\u0627\\u0646\\u06cc", "role": "\\u0633\\u0631\\u067e\\u0631\\u0633\\u062a \\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644\\u06cc\\u0646\\u06af \\u0622\\u062a\\u0644\\u06cc\\u0647 \\u06a9\\u0631\\u0627\\u0633", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80	هنر چیدمان لایه‌های پاییزی با ترکیب دقیق شومیز لینن اسلپ، بافت یقه اسکی آلپاکا و پالتوی فوتر پشمی برای خلق سیلوئتی کشیده، اصیل و متناسب.	t	published	[{"heading": "\\u0641\\u0644\\u0633\\u0641\\u0647 \\u0644\\u0627\\u06cc\\u0647\\u200c\\u0628\\u0646\\u062f\\u06cc \\u062f\\u0631 \\u0632\\u06cc\\u0628\\u0627\\u06cc\\u06cc\\u200c\\u0634\\u0646\\u0627\\u0633\\u06cc \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u0647", "content": "\\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644 \\u0686\\u0646\\u062f\\u0644\\u0627\\u06cc\\u0647 (Layering) \\u0635\\u0631\\u0641\\u0627\\u064b \\u062a\\u0644\\u0627\\u0634\\u06cc \\u0628\\u0631\\u0627\\u06cc \\u0645\\u0635\\u0648\\u0646 \\u0645\\u0627\\u0646\\u062f\\u0646 \\u0627\\u0632 \\u0646\\u0633\\u06cc\\u0645 \\u0633\\u0631\\u062f \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u0646\\u06cc\\u0633\\u062a\\u061b \\u0627\\u06cc\\u0646 \\u0647\\u0646\\u0631\\u060c \\u0632\\u0628\\u0627\\u0646\\u06cc \\u0628\\u0635\\u0631\\u06cc \\u0628\\u0631\\u0627\\u06cc \\u0628\\u06cc\\u0627\\u0646 \\u062a\\u0646\\u0627\\u0633\\u0628\\u060c \\u0648\\u0632\\u0646 \\u0648 \\u062a\\u0646\\u0648\\u0639 \\u0628\\u0627\\u0641\\u062a\\u200c\\u0647\\u0627 \\u062f\\u0631 \\u06a9\\u0646\\u0627\\u0631 \\u06cc\\u06a9\\u062f\\u06cc\\u06af\\u0631 \\u0627\\u0633\\u062a. \\u0647\\u0646\\u06af\\u0627\\u0645\\u06cc \\u06a9\\u0647 \\u06cc\\u06a9 \\u0634\\u0648\\u0645\\u06cc\\u0632 \\u0644\\u06cc\\u0646\\u0646 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0628\\u0627 \\u0628\\u0627\\u0641\\u062a \\u0646\\u0627\\u0645\\u0646\\u0638\\u0645 \\u062f\\u0631 \\u0632\\u06cc\\u0631 \\u06cc\\u06a9 \\u067e\\u0644\\u06cc\\u0648\\u0631 \\u067e\\u0634\\u0645\\u06cc \\u06a9\\u0634\\u0645\\u06cc\\u0631\\u06cc \\u0628\\u0627\\u0641\\u062a\\u0647\\u200c\\u0634\\u062f\\u0647 \\u0642\\u0631\\u0627\\u0631 \\u0645\\u06cc\\u200c\\u06af\\u06cc\\u0631\\u062f\\u060c \\u062a\\u0636\\u0627\\u062f \\u0645\\u06cc\\u0627\\u0646 \\u0645\\u0627\\u062a\\u06cc \\u067e\\u0627\\u0631\\u0686\\u0647 \\u0648 \\u0646\\u0631\\u0645\\u06cc \\u06a9\\u0631\\u06a9\\u06cc \\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u0686\\u0634\\u0645 \\u0631\\u0627 \\u0628\\u0647 \\u0628\\u0627\\u0632\\u06cc \\u0639\\u0645\\u0642 \\u062f\\u0639\\u0648\\u062a \\u0645\\u06cc\\u200c\\u06a9\\u0646\\u062f.", "pullQuote": "\\u00ab\\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644 \\u0686\\u0646\\u062f\\u0644\\u0627\\u06cc\\u0647 \\u0646\\u0648\\u0639\\u06cc \\u0645\\u0639\\u0645\\u0627\\u0631\\u06cc \\u0645\\u062a\\u062d\\u0631\\u06a9 \\u0627\\u0633\\u062a\\u061b \\u0647\\u0631 \\u0644\\u0627\\u06cc\\u0647 \\u0628\\u0627\\u06cc\\u062f \\u0628\\u0647 \\u062a\\u0646\\u0647\\u0627\\u06cc\\u06cc \\u06a9\\u0627\\u0645\\u0644 \\u0628\\u0627\\u0634\\u062f \\u0627\\u0645\\u0627 \\u062f\\u0631 \\u0645\\u062c\\u0627\\u0648\\u0631\\u062a \\u0644\\u0627\\u06cc\\u0647 \\u062f\\u06cc\\u06af\\u0631 \\u0628\\u0647 \\u0634\\u06a9\\u0648\\u0647 \\u0628\\u0631\\u0633\\u062f.\\u00bb"}, {"heading": "\\u0642\\u0627\\u0639\\u062f\\u0647 \\u06f3 \\u0644\\u0627\\u06cc\\u0647 \\u0637\\u0644\\u0627\\u06cc\\u06cc: \\u067e\\u0627\\u06cc\\u0647\\u060c \\u0639\\u0627\\u06cc\\u0642 \\u0648 \\u067e\\u0648\\u0634\\u0634 \\u0628\\u06cc\\u0631\\u0648\\u0646\\u06cc", "content": "\\u0628\\u0631\\u0627\\u06cc \\u0631\\u0633\\u06cc\\u062f\\u0646 \\u0628\\u0647 \\u0638\\u0627\\u0647\\u0631\\u06cc \\u067e\\u0627\\u0644\\u0648\\u062f\\u0647 \\u0648 \\u0639\\u0627\\u0631\\u06cc \\u0627\\u0632 \\u067e\\u0641 \\u063a\\u06cc\\u0631\\u0636\\u0631\\u0648\\u0631\\u06cc\\u060c \\u062d\\u0641\\u0638 \\u062a\\u0639\\u0627\\u062f\\u0644 \\u0645\\u06cc\\u0627\\u0646 \\u0648\\u0632\\u0646 \\u0645\\u0646\\u0633\\u0648\\u062c\\u0627\\u062a \\u062d\\u06cc\\u0627\\u062a\\u06cc \\u0627\\u0633\\u062a. \\u0644\\u0627\\u06cc\\u0647 \\u0646\\u062e\\u0633\\u062a \\u0628\\u0627\\u06cc\\u062f \\u0633\\u0628\\u06a9 \\u0648 \\u062a\\u0646\\u0641\\u0633\\u200c\\u067e\\u0630\\u06cc\\u0631 \\u0628\\u0627\\u0634\\u062f (\\u0646\\u0638\\u06cc\\u0631 \\u0634\\u0648\\u0645\\u06cc\\u0632 \\u0644\\u06cc\\u0646\\u0646 \\u0627\\u0633\\u0644\\u067e \\u06a9\\u0627\\u0631\\u0646). \\u0644\\u0627\\u06cc\\u0647 \\u0645\\u06cc\\u0627\\u0646\\u06cc \\u0646\\u0642\\u0634 \\u0639\\u0627\\u06cc\\u0642 \\u062d\\u0631\\u0627\\u0631\\u062a\\u06cc \\u0628\\u0627 \\u062d\\u0641\\u0638 \\u0622\\u0632\\u0627\\u062f\\u06cc \\u062d\\u0631\\u06a9\\u062a \\u0631\\u0627 \\u062f\\u0627\\u0631\\u062f (\\u067e\\u0644\\u06cc\\u0648\\u0631 \\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u06cc\\u0627 \\u0628\\u0627\\u0641\\u062a \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633). \\u062f\\u0631 \\u0646\\u0647\\u0627\\u06cc\\u062a\\u060c \\u0644\\u0627\\u06cc\\u0647 \\u0631\\u0648\\u06cc\\u06cc\\u0646 \\u0645\\u0627\\u0646\\u0646\\u062f \\u062a\\u0631\\u0646\\u0686\\u200c\\u06a9\\u062a \\u067e\\u0634\\u0645\\u06cc \\u062e\\u0637\\u0648\\u0637 \\u0633\\u0627\\u062e\\u062a\\u0627\\u0631\\u06cc \\u0648 \\u0633\\u06cc\\u0644\\u0648\\u0626\\u062a \\u06a9\\u0634\\u06cc\\u062f\\u0647 \\u0634\\u0645\\u0627 \\u0631\\u0627 \\u062a\\u0639\\u0631\\u06cc\\u0641 \\u0645\\u06cc\\u200c\\u06a9\\u0646\\u062f.", "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80", "imageCaption": "\\u062a\\u0631\\u06a9\\u06cc\\u0628 \\u0644\\u0627\\u06cc\\u0647\\u200c\\u0628\\u0646\\u062f\\u06cc \\u0631\\u0646\\u06af\\u200c\\u0647\\u0627\\u06cc \\u0645\\u0648\\u0646\\u0648\\u06a9\\u0631\\u0648\\u0645 \\u062e\\u0646\\u062b\\u06cc \\u0628\\u0627 \\u062a\\u0631\\u0646\\u0686\\u200c\\u06a9\\u062a \\u0648 \\u0628\\u0627\\u0641\\u062a \\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u062f\\u0631 \\u0646\\u0648\\u0631 \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc"}, {"heading": "\\u062a\\u0648\\u0627\\u0632\\u0646 \\u067e\\u0627\\u0644\\u062a \\u0631\\u0646\\u06af\\u200c\\u0647\\u0627\\u06cc \\u0632\\u0645\\u06cc\\u0646 \\u0648 \\u0637\\u0628\\u06cc\\u0639\\u062a", "content": "\\u062f\\u0631 \\u0622\\u062a\\u0644\\u06cc\\u0647 \\u06a9\\u0631\\u0627\\u0633\\u060c \\u0645\\u0627 \\u067e\\u0627\\u0644\\u062a \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc \\u0631\\u0627 \\u0627\\u0632 \\u062f\\u0644 \\u062e\\u0627\\u06a9 \\u0648 \\u0635\\u062e\\u0631\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0632\\u0627\\u06af\\u0631\\u0633 \\u0628\\u0631\\u06af\\u0632\\u06cc\\u062f\\u0647\\u200c\\u0627\\u06cc\\u0645. \\u062a\\u0644\\u0641\\u06cc\\u0642 \\u06a9\\u0631\\u0645 \\u0634\\u0646\\u06cc\\u060c \\u0634\\u062a\\u0631\\u06cc \\u0627\\u0639\\u0644\\u0627 \\u0648 \\u0642\\u0647\\u0648\\u0647\\u200c\\u0627\\u06cc \\u0645\\u0648\\u06a9\\u0627 \\u0628\\u0627 \\u0644\\u0645\\u0633\\u06cc \\u0627\\u0632 \\u0645\\u0634\\u06a9\\u06cc \\u0632\\u063a\\u0627\\u0644\\u06cc \\u0628\\u0647 \\u0647\\u0631 \\u062d\\u0631\\u06a9\\u062a\\u06cc \\u0637\\u0645\\u0623\\u0646\\u06cc\\u0646\\u0647 \\u0645\\u06cc\\u200c\\u0628\\u062e\\u0634\\u062f. \\u067e\\u0648\\u0634\\u06cc\\u062f\\u0646 \\u0631\\u0646\\u06af\\u200c\\u0647\\u0627\\u06cc \\u0645\\u0648\\u0646\\u0648\\u06a9\\u0631\\u0648\\u0645 \\u0628\\u0627 \\u062a\\u0646\\u0627\\u0698\\u0647\\u0627\\u06cc \\u0646\\u0632\\u062f\\u06cc\\u06a9 \\u0628\\u0647 \\u0647\\u0645 \\u0633\\u0628\\u0628 \\u0645\\u06cc\\u200c\\u0634\\u0648\\u062f \\u0642\\u0627\\u0645\\u062a \\u0628\\u0644\\u0646\\u062f\\u062a\\u0631 \\u0648 \\u06cc\\u06a9\\u067e\\u0627\\u0631\\u0686\\u0647\\u200c\\u062a\\u0631 \\u0628\\u0647 \\u0646\\u0638\\u0631 \\u0628\\u0631\\u0633\\u062f."}]	["karen-slub-linen-blouse", "fluffy-turtleneck-knit-sweater", "long-lined-wool-fouter-coat"]	a28d8ccd-fcf1-4068-89e8-e55d4df81bbf	2026-10-13 01:18:49.245001+03:30	2026-10-13 01:18:49.245005+03:30
اصالت الیاف لوکس: راهنمای نگهداری ابدی کشمیر و پشم مرینوس	cashmere-and-merino-care-guide	fabric-care	نگهداری الیاف لوکس	۴ دقیقه	۰۸ مهر ۱۴۰۵	{"name": "\\u0645\\u0647\\u0646\\u062f\\u0633 \\u0646\\u0648\\u06cc\\u062f \\u06a9\\u0627\\u0648\\u0647", "role": "\\u0645\\u062a\\u062e\\u0635\\u0635 \\u0646\\u0633\\u0627\\u062c\\u06cc \\u0648 \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80	راز لطافت ابریشمی و ماندگاری دهه‌ها در شست‌وشوی دستی با آب سرد، خشک کردن افقی با دانه‌های چوب سدر و حفظ بافت طبیعی و متراکم منسوجات دست‌بافت.	f	published	[{"heading": "\\u0686\\u0631\\u0627 \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u062d\\u06cc\\u0627\\u062a\\u06cc \\u0646\\u06cc\\u0627\\u0632\\u0645\\u0646\\u062f \\u0645\\u0631\\u0627\\u0642\\u0628\\u062a \\u0627\\u062e\\u062a\\u0635\\u0627\\u0635\\u06cc \\u0647\\u0633\\u062a\\u0646\\u062f\\u061f", "content": "\\u067e\\u0634\\u0645 \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633 \\u0648 \\u06a9\\u0631\\u06a9\\u200c\\u0647\\u0627\\u06cc \\u0644\\u0637\\u06cc\\u0641 \\u0632\\u06cc\\u0631\\u06cc\\u0646 \\u0628\\u0632 \\u06a9\\u0634\\u0645\\u06cc\\u0631\\u060c \\u062a\\u0627\\u0631\\u0647\\u0627\\u06cc \\u0632\\u0646\\u062f\\u0647\\u200c\\u0627\\u06cc \\u0647\\u0633\\u062a\\u0646\\u062f \\u06a9\\u0647 \\u062f\\u0631 \\u0633\\u0627\\u062e\\u062a\\u0627\\u0631 \\u0645\\u06cc\\u06a9\\u0631\\u0648\\u0633\\u06a9\\u0648\\u067e\\u06cc \\u062e\\u0648\\u062f \\u062d\\u0627\\u0648\\u06cc \\u0641\\u0644\\u0633\\u200c\\u0647\\u0627\\u06cc \\u0645\\u062d\\u0627\\u0641\\u0638 \\u0648 \\u0644\\u0627\\u0646\\u0648\\u0644\\u06cc\\u0646 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0645\\u06cc\\u200c\\u0628\\u0627\\u0634\\u0646\\u062f. \\u0634\\u0648\\u06cc\\u0646\\u062f\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0634\\u06cc\\u0645\\u06cc\\u0627\\u06cc\\u06cc \\u0642\\u0648\\u06cc \\u06cc\\u0627 \\u062f\\u0645\\u0627\\u06cc \\u0622\\u0628 \\u0628\\u0627\\u0644\\u0627\\u06cc \\u06f3\\u06f0 \\u062f\\u0631\\u062c\\u0647 \\u0641\\u0644\\u0633\\u200c\\u0647\\u0627\\u06cc \\u067e\\u0634\\u0645 \\u0631\\u0627 \\u0645\\u0646\\u0642\\u0628\\u0636 \\u06a9\\u0631\\u062f\\u0647 \\u0648 \\u0645\\u0648\\u062c\\u0628 \\u0646\\u0645\\u062f\\u06cc \\u0634\\u062f\\u0646 (Felting) \\u0648 \\u0627\\u0632 \\u0628\\u06cc\\u0646 \\u0631\\u0641\\u062a\\u0646 \\u0627\\u0646\\u0639\\u0637\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0622\\u0646 \\u0645\\u06cc\\u200c\\u06af\\u0631\\u062f\\u062f.", "pullQuote": "\\u00ab\\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u0628\\u0627 \\u0647\\u0631 \\u0628\\u0627\\u0631 \\u0644\\u0645\\u0633 \\u0648 \\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0627\\u0635\\u0648\\u0644\\u06cc\\u060c \\u0644\\u0637\\u06cc\\u0641\\u200c\\u062a\\u0631 \\u0648 \\u0627\\u0635\\u06cc\\u0644\\u200c\\u062a\\u0631 \\u0645\\u06cc\\u200c\\u0634\\u0648\\u062f\\u061b \\u0646\\u0647 \\u06a9\\u0647\\u0646\\u0647\\u200c\\u062a\\u0631.\\u00bb"}, {"heading": "\\u0622\\u062f\\u0627\\u0628 \\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0634\\u0627\\u0645\\u067e\\u0648\\u06cc \\u0645\\u062e\\u0635\\u0648\\u0635", "content": "\\u067e\\u0648\\u0634\\u0627\\u06a9 \\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u0631\\u0627 \\u062f\\u0631 \\u062a\\u0634\\u062a \\u0622\\u0628 \\u0648\\u0644\\u0631\\u0645 \\u0645\\u062a\\u0645\\u0627\\u06cc\\u0644 \\u0628\\u0647 \\u0633\\u0631\\u062f \\u0647\\u0645\\u0631\\u0627\\u0647 \\u0628\\u0627 \\u0645\\u0642\\u062f\\u0627\\u0631 \\u0627\\u0646\\u062f\\u06a9\\u06cc \\u0634\\u0627\\u0645\\u067e\\u0648\\u06cc \\u06a9\\u0631\\u0627\\u062a\\u06cc\\u0646\\u0647 \\u06cc\\u0627 \\u0634\\u0648\\u06cc\\u0646\\u062f\\u0647 \\u0628\\u062f\\u0648\\u0646 \\u0622\\u0646\\u0632\\u06cc\\u0645 \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0642\\u0631\\u0627\\u0631 \\u062f\\u0647\\u06cc\\u062f. \\u0628\\u0647 \\u0645\\u062f\\u062a \\u06f5 \\u062f\\u0642\\u06cc\\u0642\\u0647 \\u0628\\u0647 \\u0622\\u0631\\u0627\\u0645\\u06cc \\u0645\\u0627\\u0633\\u0627\\u0698 \\u062f\\u0647\\u06cc\\u062f \\u0648 \\u0647\\u0631\\u06af\\u0632 \\u0622\\u0646 \\u0631\\u0627 \\u0646\\u0686\\u0644\\u0627\\u0646\\u06cc\\u062f. \\u0628\\u0631\\u0627\\u06cc \\u0622\\u0628\\u06a9\\u0634\\u06cc\\u060c \\u0644\\u0628\\u0627\\u0633 \\u0631\\u0627 \\u0645\\u06cc\\u0627\\u0646 \\u06cc\\u06a9 \\u062d\\u0648\\u0644\\u0647 \\u067e\\u0646\\u0628\\u0647\\u200c\\u0627\\u06cc \\u0636\\u062e\\u06cc\\u0645 \\u0644\\u0648\\u0644\\u0647 \\u06a9\\u0646\\u06cc\\u062f \\u062a\\u0627 \\u0631\\u0637\\u0648\\u0628\\u062a \\u0627\\u0636\\u0627\\u0641\\u0647 \\u062c\\u0630\\u0628 \\u0634\\u0648\\u062f.", "image": "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=1200&q=80", "imageCaption": "\\u062e\\u0634\\u06a9 \\u06a9\\u0631\\u062f\\u0646 \\u0627\\u0641\\u0642\\u06cc \\u0631\\u0648\\u06cc \\u0633\\u0637\\u062d \\u062a\\u0648\\u0631\\u06cc \\u062f\\u0631 \\u0633\\u0627\\u06cc\\u0647 \\u0628\\u0631\\u0627\\u06cc \\u067e\\u06cc\\u0634\\u06af\\u06cc\\u0631\\u06cc \\u0627\\u0632 \\u062a\\u063a\\u06cc\\u06cc\\u0631 \\u0634\\u06a9\\u0644 \\u0642\\u0648\\u0627\\u0631\\u0647"}, {"heading": "\\u0646\\u06af\\u0647\\u062f\\u0627\\u0631\\u06cc \\u062e\\u0627\\u0631\\u062c \\u0627\\u0632 \\u0641\\u0635\\u0644 \\u0648 \\u0645\\u0628\\u0627\\u0631\\u0632\\u0647 \\u0628\\u0627 \\u0628\\u06cc\\u062f", "content": "\\u0647\\u0631\\u06af\\u0632 \\u0628\\u0627\\u0641\\u062a\\u200c\\u0647\\u0627\\u06cc \\u067e\\u0634\\u0645\\u06cc \\u0631\\u0627 \\u0631\\u0648\\u06cc \\u0686\\u0648\\u0628\\u200c\\u0644\\u0628\\u0627\\u0633\\u06cc \\u0622\\u0648\\u06cc\\u0632\\u0627\\u0646 \\u0646\\u06a9\\u0646\\u06cc\\u062f \\u0632\\u06cc\\u0631\\u0627 \\u0648\\u0632\\u0646 \\u0644\\u0628\\u0627\\u0633 \\u0641\\u0631\\u0645 \\u0634\\u0627\\u0646\\u0647\\u200c\\u0647\\u0627 \\u0631\\u0627 \\u0628\\u0631\\u0647\\u0645 \\u0645\\u06cc\\u200c\\u0632\\u0646\\u062f. \\u062f\\u0631 \\u067e\\u0627\\u06cc\\u0627\\u0646 \\u0641\\u0635\\u0644\\u060c \\u0644\\u0628\\u0627\\u0633\\u200c\\u0647\\u0627 \\u0631\\u0627 \\u062a\\u0645\\u06cc\\u0632 \\u0634\\u0633\\u062a\\u0647\\u060c \\u0628\\u0647 \\u0635\\u0648\\u0631\\u062a \\u062a\\u062e\\u062a \\u062a\\u0627 \\u06a9\\u0631\\u062f\\u0647 \\u0648 \\u0628\\u0647 \\u0647\\u0645\\u0631\\u0627\\u0647 \\u062d\\u0644\\u0642\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0686\\u0648\\u0628 \\u0633\\u062f\\u0631 \\u0633\\u0631\\u062e \\u062f\\u0631\\u0648\\u0646 \\u06a9\\u0627\\u0648\\u0631\\u0647\\u0627\\u06cc \\u062a\\u0646\\u0641\\u0633\\u200c\\u067e\\u0630\\u06cc\\u0631 \\u067e\\u0646\\u0628\\u0647\\u200c\\u0627\\u06cc \\u0646\\u06af\\u0647\\u062f\\u0627\\u0631\\u06cc \\u0641\\u0631\\u0645\\u0627\\u06cc\\u06cc\\u062f."}]	["fluffy-turtleneck-knit-sweater", "cashmere-open-front-cardigan"]	25341766-a19e-4a35-856c-0ec65c3d0256	2026-10-13 01:18:49.245014+03:30	2026-10-13 01:18:49.245014+03:30
روایت دراپ پاییزی ۱۴۰۵: از خطوط بیومکانیک تا توازن فرم و سکوت	autumn-drop-1405-story	drop-story	داستان دراپ و کالکشن	۶ دقیقه	۰۴ مهر ۱۴۰۵	{"name": "\\u0628\\u0647\\u0631\\u0627\\u0645 \\u0634\\u0645\\u0633", "role": "\\u0645\\u062f\\u06cc\\u0631 \\u0627\\u0631\\u0634\\u062f \\u062e\\u0644\\u0627\\u0642\\u06cc\\u062a \\u06a9\\u0631\\u0627\\u0633", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80	چگونه تیم طراحی کراس پس از شش ماه مطالعه آناتومی و تنفس الیاف، فرم‌هایی خلق کرد که بدون ایجاد محدودیت فیزیکی، وقار آتلیه‌ای را به خیابان می‌آورند.	f	published	[{"heading": "\\u0627\\u06cc\\u062f\\u0647\\u200c\\u067e\\u0631\\u062f\\u0627\\u0632\\u06cc \\u062f\\u0631 \\u062a\\u0644\\u0627\\u0642\\u06cc \\u0627\\u0633\\u062a\\u0648\\u062f\\u06cc\\u0648 \\u0648 \\u062a\\u062d\\u0631\\u06a9 \\u0634\\u0647\\u0631\\u06cc", "content": "\\u062f\\u0631\\u0627\\u067e \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5 \\u0628\\u0627 \\u0627\\u06cc\\u0646 \\u067e\\u0631\\u0633\\u0634 \\u0622\\u063a\\u0627\\u0632 \\u0634\\u062f: \\u0686\\u06af\\u0648\\u0646\\u0647 \\u0645\\u06cc\\u200c\\u062a\\u0648\\u0627\\u0646 \\u067e\\u0648\\u0634\\u0634\\u06cc \\u0637\\u0631\\u0627\\u062d\\u06cc \\u06a9\\u0631\\u062f \\u06a9\\u0647 \\u0647\\u0645 \\u062f\\u0631 \\u062c\\u0644\\u0633\\u0627\\u062a \\u0627\\u062f\\u06cc\\u062a\\u0648\\u0631\\u06cc\\u0627\\u0644 \\u0648 \\u0645\\u062d\\u06cc\\u0637\\u200c\\u0647\\u0627\\u06cc \\u0631\\u0633\\u0645\\u06cc \\u0628\\u062f\\u0631\\u062e\\u0634\\u062f \\u0648 \\u0647\\u0645 \\u062f\\u0631 \\u06af\\u0627\\u0645\\u200c\\u0647\\u0627\\u06cc \\u062a\\u0646\\u062f \\u0639\\u0635\\u0631\\u06af\\u0627\\u0647\\u06cc \\u062d\\u0633 \\u0631\\u0647\\u0627\\u06cc\\u06cc \\u06a9\\u0627\\u0645\\u0644 \\u0628\\u0628\\u062e\\u0634\\u062f\\u061f \\u067e\\u0627\\u0633\\u062e \\u0645\\u0627 \\u062f\\u0631 \\u0633\\u0627\\u062e\\u062a\\u0627\\u0631 \\u062f\\u0648\\u06af\\u0627\\u0646\\u0647 \\u00ab\\u062d\\u0631\\u06a9\\u062a \\u0648 \\u0633\\u06a9\\u0648\\u062a\\u00bb \\u0646\\u0647\\u0641\\u062a\\u0647 \\u0628\\u0648\\u062f.", "pullQuote": "\\u00ab\\u0644\\u0628\\u0627\\u0633 \\u0646\\u0628\\u0627\\u06cc\\u062f \\u0628\\u0647 \\u0628\\u062f\\u0646 \\u062a\\u062d\\u0645\\u06cc\\u0644 \\u0634\\u0648\\u062f\\u061b \\u0644\\u0628\\u0627\\u0633 \\u0628\\u0627\\u06cc\\u062f \\u0627\\u062f\\u0627\\u0645\\u0647 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u062a\\u0646\\u0641\\u0633 \\u0648 \\u0627\\u0631\\u0627\\u062f\\u0647 \\u0627\\u0646\\u0633\\u0627\\u0646 \\u0628\\u0627\\u0634\\u062f.\\u00bb"}, {"heading": "\\u062a\\u0648\\u0633\\u0639\\u0647 \\u067e\\u0627\\u0631\\u0686\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0627\\u062e\\u062a\\u0635\\u0627\\u0635\\u06cc \\u0627\\u0633\\u0644\\u067e \\u0648 \\u0645\\u06cc\\u06a9\\u0631\\u0648-\\u0645\\u062f\\u0627\\u0644", "content": "\\u0645\\u0627 \\u0628\\u0627 \\u0647\\u0645\\u06a9\\u0627\\u0631\\u06cc \\u06a9\\u0627\\u0631\\u06af\\u0627\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0646\\u0633\\u0627\\u062c\\u06cc \\u0628\\u0648\\u0645\\u06cc\\u060c \\u0641\\u0631\\u0645\\u0648\\u0644\\u0627\\u0633\\u06cc\\u0648\\u0646 \\u0627\\u062e\\u062a\\u0635\\u0627\\u0635\\u06cc \\u0627\\u0632 \\u0644\\u06cc\\u0646\\u0646 \\u0633\\u0646\\u06af\\u06cc\\u0646\\u200c\\u0628\\u0627\\u0641\\u062a \\u0628\\u0627 \\u0646\\u062e\\u200c\\u0647\\u0627\\u06cc \\u0627\\u0633\\u0644\\u067e \\u0628\\u0627\\u0641\\u062a \\u0646\\u0627\\u0645\\u062a\\u0642\\u0627\\u0631\\u0646 \\u062a\\u0648\\u0644\\u06cc\\u062f \\u06a9\\u0631\\u062f\\u06cc\\u0645. \\u0627\\u06cc\\u0646 \\u0628\\u0627\\u0641\\u062a \\u062f\\u0631 \\u0639\\u06cc\\u0646 \\u0627\\u06cc\\u0633\\u062a\\u0627\\u06cc\\u06cc \\u0645\\u062c\\u0644\\u0644\\u060c \\u062c\\u0631\\u06cc\\u0627\\u0646 \\u0622\\u0632\\u0627\\u062f \\u0647\\u0648\\u0627\\u06cc \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc \\u0631\\u0627 \\u062a\\u0636\\u0645\\u06cc\\u0646 \\u0645\\u06cc\\u200c\\u06a9\\u0646\\u062f \\u0648 \\u0686\\u0631\\u0648\\u06a9\\u200c\\u067e\\u0630\\u06cc\\u0631\\u06cc \\u0645\\u0647\\u0627\\u0631\\u0634\\u062f\\u0647\\u200c\\u0627\\u06cc \\u062f\\u0627\\u0631\\u062f \\u06a9\\u0647 \\u0628\\u0647 \\u0648\\u0642\\u0627\\u0631 \\u0622\\u0646 \\u0645\\u06cc\\u200c\\u0627\\u0641\\u0632\\u0627\\u06cc\\u062f.", "image": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80", "imageCaption": "\\u0641\\u0631\\u0622\\u06cc\\u0646\\u062f \\u0628\\u0631\\u0634 \\u062f\\u0633\\u062a\\u06cc \\u0627\\u0644\\u06af\\u0648\\u0647\\u0627 \\u062f\\u0631 \\u0627\\u0633\\u062a\\u0648\\u062f\\u06cc\\u0648\\u06cc \\u0645\\u0631\\u06a9\\u0632\\u06cc \\u06a9\\u0631\\u0627\\u0633"}, {"heading": "\\u0633\\u06cc\\u0644\\u0648\\u0626\\u062a\\u200c\\u0647\\u0627\\u06cc \\u0631\\u0647\\u0627 \\u0648 \\u062c\\u0632\\u0626\\u06cc\\u0627\\u062a \\u062f\\u0633\\u062a\\u200c\\u062f\\u0648\\u0632", "content": "\\u062f\\u0631 \\u062a\\u0645\\u0627\\u0645\\u06cc \\u062a\\u06a9\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0627\\u06cc\\u0646 \\u06a9\\u0627\\u0644\\u06a9\\u0634\\u0646\\u060c \\u062f\\u0648\\u062e\\u062a\\u200c\\u0647\\u0627\\u06cc \\u06a9\\u0648\\u0631 \\u0648 \\u0644\\u0628\\u0647\\u200c\\u062f\\u0648\\u0632\\u06cc\\u200c\\u0647\\u0627\\u06cc \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645\\u06cc \\u0628\\u0647 \\u06a9\\u0627\\u0631 \\u0631\\u0641\\u062a\\u0647 \\u0627\\u0633\\u062a \\u062a\\u0627 \\u0647\\u06cc\\u0686 \\u062e\\u0637 \\u0627\\u062a\\u0635\\u0627\\u0644\\u06cc \\u067e\\u0648\\u0633\\u062a \\u0631\\u0627 \\u0622\\u0632\\u0627\\u0631 \\u0646\\u062f\\u0647\\u062f. \\u062f\\u0631\\u0627\\u067e \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5 \\u06af\\u0627\\u0645\\u06cc \\u0645\\u062d\\u06a9\\u0645 \\u062f\\u0631 \\u062a\\u062d\\u0642\\u0642 \\u0645\\u0627\\u0646\\u06cc\\u0641\\u0633\\u062a \\u0645\\u062f \\u067e\\u0627\\u06cc\\u062f\\u0627\\u0631 \\u0648 \\u0627\\u0635\\u06cc\\u0644 \\u06a9\\u0631\\u0627\\u0633 \\u0627\\u0633\\u062a."}]	["karen-slub-linen-blouse", "oversized-washed-cotton-shirt"]	97b5227e-7bb3-4405-bc54-de5140798ccc	2026-10-13 01:18:49.24502+03:30	2026-10-13 01:18:49.245021+03:30
مانیفست اسکارف و باندانا: لمس جادویی در استایل مینیمال	silk-scarf-minimalist-styling	style-guide	راهنمای استایل	۳ دقیقه	۲۸ شهریور ۱۴۰۵	{"name": "\\u0646\\u06cc\\u0644\\u0648\\u0641\\u0631 \\u0627\\u0645\\u06cc\\u0646\\u06cc", "role": "\\u0627\\u062f\\u06cc\\u062a\\u0648\\u0631 \\u0627\\u06a9\\u0633\\u0633\\u0648\\u0631\\u06cc \\u0648 \\u0645\\u062f \\u06a9\\u0631\\u0627\\u0633", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80	تکنیک‌های جذاب گره زدن اسکارف تویل ابریشمی، استایل کردن دستمال سر ژاکارد و اکسسوری مو برای روح بخشیدن به آرام‌ترین ست‌های تک‌رنگ مونوکروم.	f	published	[{"heading": "\\u0686\\u06af\\u0648\\u0646\\u0647 \\u06cc\\u06a9 \\u0627\\u06a9\\u0633\\u0633\\u0648\\u0631\\u06cc \\u06a9\\u0648\\u0686\\u06a9 \\u067e\\u0627\\u0644\\u062a \\u06a9\\u0644 \\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644 \\u0631\\u0627 \\u062f\\u06af\\u0631\\u06af\\u0648\\u0646 \\u0645\\u06cc\\u200c\\u06a9\\u0646\\u062f", "content": "\\u062f\\u0631 \\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644\\u200c\\u0647\\u0627\\u06cc \\u0645\\u06cc\\u0646\\u06cc\\u0645\\u0627\\u0644 \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc \\u06a9\\u0647 \\u0628\\u0631 \\u067e\\u0627\\u06cc\\u0647 \\u0631\\u0646\\u06af\\u200c\\u0647\\u0627\\u06cc \\u062e\\u0627\\u06a9\\u0633\\u062a\\u0631\\u06cc\\u060c \\u06a9\\u0631\\u0645 \\u0648 \\u0645\\u0634\\u06a9\\u06cc \\u0634\\u06a9\\u0644 \\u0645\\u06cc\\u200c\\u06af\\u06cc\\u0631\\u0646\\u062f\\u060c \\u062d\\u0636\\u0648\\u0631 \\u06cc\\u06a9 \\u0627\\u0633\\u06a9\\u0627\\u0631\\u0641 \\u062a\\u0648\\u06cc\\u0644 \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645\\u06cc \\u0628\\u0627 \\u0686\\u0627\\u067e\\u200c\\u0647\\u0627\\u06cc \\u0647\\u0646\\u062f\\u0633\\u06cc \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0645\\u0627\\u0646\\u0646\\u062f \\u06cc\\u06a9 \\u0646\\u0642\\u0637\\u0647 \\u0639\\u0637\\u0641 \\u0628\\u0635\\u0631\\u06cc \\u0639\\u0645\\u0644 \\u0645\\u06cc\\u200c\\u06a9\\u0646\\u062f. \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u0628\\u0627 \\u062f\\u0631\\u062e\\u0634\\u0634 \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0645\\u0627\\u062a \\u062e\\u0648\\u062f \\u0646\\u0648\\u0631\\u06cc \\u0638\\u0631\\u06cc\\u0641 \\u0628\\u0647 \\u0686\\u0647\\u0631\\u0647 \\u0645\\u06cc\\u200c\\u062a\\u0627\\u0628\\u0627\\u0646\\u062f.", "pullQuote": "\\u00ab\\u0627\\u06a9\\u0633\\u0633\\u0648\\u0631\\u06cc \\u062f\\u0631 \\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644 \\u0645\\u06cc\\u0646\\u06cc\\u0645\\u0627\\u0644\\u060c \\u0641\\u0631\\u06cc\\u0627\\u062f \\u0646\\u0645\\u06cc\\u200c\\u0632\\u0646\\u062f\\u061b \\u0628\\u0644\\u06a9\\u0647 \\u0632\\u0645\\u0632\\u0645\\u0647\\u200c\\u0627\\u06cc \\u0647\\u0648\\u0634\\u0645\\u0646\\u062f\\u0627\\u0646\\u0647 \\u0627\\u0632 \\u0633\\u0644\\u06cc\\u0642\\u0647 \\u0646\\u0627\\u0628 \\u0635\\u0627\\u062d\\u0628 \\u0622\\u0646 \\u0627\\u0633\\u062a.\\u00bb"}, {"heading": "\\u0633\\u0647 \\u06af\\u0631\\u0647 \\u067e\\u0631\\u06a9\\u0627\\u0631\\u0628\\u0631\\u062f \\u0628\\u0631\\u0627\\u06cc \\u06cc\\u0642\\u0647 \\u067e\\u0627\\u0644\\u062a\\u0648 \\u0648 \\u0628\\u0627\\u0641\\u062a", "content": "\\u06af\\u0631\\u0647 \\u0641\\u0631\\u0627\\u0646\\u0633\\u0648\\u06cc \\u06a9\\u0644\\u0627\\u0633\\u06cc\\u06a9 \\u062f\\u0631 \\u06af\\u0648\\u062f\\u06cc \\u06af\\u0631\\u062f\\u0646\\u060c \\u06af\\u0631\\u0647 \\u0645\\u062b\\u0644\\u062b\\u06cc \\u0631\\u0647\\u0627 \\u0631\\u0648\\u06cc \\u0633\\u06cc\\u0646\\u0647 \\u0628\\u0631\\u0627\\u06cc \\u0631\\u0648\\u0632\\u0647\\u0627\\u06cc \\u062e\\u0646\\u06a9\\u060c \\u0648 \\u0628\\u0633\\u062a\\u0646 \\u0631\\u0648\\u06cc \\u062f\\u0633\\u062a\\u0647 \\u06a9\\u06cc\\u0641 \\u0686\\u0631\\u0645\\u06cc \\u0627\\u0632 \\u0645\\u062d\\u0628\\u0648\\u0628\\u200c\\u062a\\u0631\\u06cc\\u0646 \\u0645\\u062a\\u062f\\u0647\\u0627\\u06cc \\u0631\\u0648\\u0632 \\u062f\\u0646\\u06cc\\u0627 \\u0628\\u0631\\u0627\\u06cc \\u0627\\u0633\\u062a\\u0641\\u0627\\u062f\\u0647 \\u0686\\u0646\\u062f\\u0645\\u0646\\u0638\\u0648\\u0631\\u0647 \\u0627\\u0632 \\u0627\\u0633\\u06a9\\u0627\\u0631\\u0641\\u200c\\u0647\\u0627\\u06cc \\u0642\\u0648\\u0627\\u0631\\u0647 \\u06f7\\u06f0 \\u062f\\u0631 \\u06f7\\u06f0 \\u0633\\u0627\\u0646\\u062a\\u06cc\\u0645\\u062a\\u0631 \\u0627\\u0633\\u062a."}]	["hand-rolled-silk-mini-scarf"]	a7c5adb5-ce25-4f11-8fe9-70fa67970123	2026-10-13 01:18:49.245027+03:30	2026-10-13 01:18:49.245027+03:30
راز ماندگاری الیاف میکرو-مدال: لطافت ابریشمی بدون فرسایش بافت	micro-modal-longevity-secrets	fabric-care	نگهداری الیاف لوکس	۴ دقیقه	۲۲ شهریور ۱۴۰۵	{"name": "\\u0645\\u0647\\u0646\\u062f\\u0633 \\u0646\\u0648\\u06cc\\u062f \\u06a9\\u0627\\u0648\\u0647", "role": "\\u0645\\u062a\\u062e\\u0635\\u0635 \\u0646\\u0633\\u0627\\u062c\\u06cc \\u0648 \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80	بررسی علمی ساختار الیاف استحصال‌شده از درخت راش اتریشی؛ چرا منسوجات لاین Calm پس از صدها بار پوشش همچنان درخشندگی و لطافت اولیه را حفظ می‌کنند.	f	published	[{"heading": "\\u062a\\u0641\\u0627\\u0648\\u062a\\u200c\\u0647\\u0627\\u06cc \\u0633\\u0627\\u062e\\u062a\\u0627\\u0631\\u06cc \\u0645\\u062f\\u0627\\u0644 \\u0628\\u0627 \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0633\\u0644\\u0648\\u0644\\u0632\\u06cc \\u0633\\u0646\\u062a\\u06cc", "content": "\\u0645\\u06cc\\u06a9\\u0631\\u0648-\\u0645\\u062f\\u0627\\u0644 \\u062f\\u0627\\u0631\\u0627\\u06cc \\u0633\\u0627\\u062e\\u062a\\u0627\\u0631 \\u0645\\u0648\\u0644\\u06a9\\u0648\\u0644\\u06cc \\u06cc\\u06a9\\u0646\\u0648\\u0627\\u062e\\u062a\\u200c\\u062a\\u0631\\u06cc \\u0646\\u0633\\u0628\\u062a \\u0628\\u0647 \\u067e\\u0646\\u0628\\u0647 \\u0645\\u0639\\u0645\\u0648\\u0644\\u06cc \\u0627\\u0633\\u062a. \\u0633\\u0637\\u062d \\u0635\\u0627\\u0641 \\u0641\\u06cc\\u0628\\u0631 \\u0645\\u0627\\u0646\\u0639 \\u0627\\u0632 \\u06af\\u06cc\\u0631 \\u0627\\u0641\\u062a\\u0627\\u062f\\u0646 \\u0630\\u0631\\u0627\\u062a \\u0645\\u0648\\u0627\\u062f \\u0634\\u0648\\u06cc\\u0646\\u062f\\u0647 \\u062f\\u0631 \\u0645\\u0646\\u0627\\u0641\\u0630 \\u067e\\u0627\\u0631\\u0686\\u0647 \\u0645\\u06cc\\u200c\\u0634\\u0648\\u062f \\u0648 \\u062f\\u0631 \\u0646\\u062a\\u06cc\\u062c\\u0647\\u060c \\u0633\\u062e\\u062a\\u06cc \\u0648 \\u067e\\u0631\\u0632\\u062f\\u0647\\u06cc \\u067e\\u0633 \\u0627\\u0632 \\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648 \\u0631\\u062e \\u0646\\u0645\\u06cc\\u200c\\u062f\\u0647\\u062f."}]	["karen-slub-linen-blouse"]	dc664c3a-6517-471d-a88c-d2d3e8565540	2026-10-13 01:18:49.245033+03:30	2026-10-13 01:18:49.245034+03:30
کمد کپسولی پاییزه: خلق ۳۰ استایل متمایز تنها با ۸ قطعه لباس کلیدی	capsule-wardrobe-autumn-guide	style-guide	راهنمای استایل	۵ دقیقه	۱۵ شهریور ۱۴۰۵	{"name": "\\u0633\\u0627\\u0631\\u0627 \\u06a9\\u06cc\\u0627\\u0646\\u06cc", "role": "\\u0633\\u0631\\u067e\\u0631\\u0633\\u062a \\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644\\u06cc\\u0646\\u06af \\u0622\\u062a\\u0644\\u06cc\\u0647 \\u06a9\\u0631\\u0627\\u0633", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}	https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80	چگونه با حذف شلوغی‌های بصری کمد و سرمایه‌گذاری بر روی برش‌های بی‌زمان و پارچه‌های اعلا، همیشه آراسته، خلاق و متمایز به نظر برسیم.	f	draft	[{"heading": "\\u0645\\u0642\\u062f\\u0645\\u0647: \\u0631\\u0647\\u0627\\u06cc\\u06cc \\u0627\\u0632 \\u0641\\u0644\\u062c \\u0627\\u0646\\u062a\\u062e\\u0627\\u0628 \\u0631\\u0648\\u0632\\u0645\\u0631\\u0647", "content": "\\u06a9\\u0645\\u062f \\u06a9\\u067e\\u0633\\u0648\\u0644\\u06cc \\u062a\\u0631\\u0648\\u06cc\\u062c \\u06cc\\u06a9\\u0646\\u0648\\u0627\\u062e\\u062a\\u06cc \\u0646\\u06cc\\u0633\\u062a\\u061b \\u0628\\u0644\\u06a9\\u0647 \\u0628\\u06cc\\u0627\\u0646\\u06cc\\u0647\\u200c\\u0627\\u06cc \\u0639\\u0644\\u06cc\\u0647 \\u0645\\u062f \\u0633\\u0631\\u06cc\\u0639 (Fast Fashion) \\u0648 \\u0645\\u0635\\u0631\\u0641\\u200c\\u06af\\u0631\\u0627\\u06cc\\u06cc \\u06a9\\u0648\\u0631\\u06a9\\u0648\\u0631\\u0627\\u0646\\u0647 \\u0627\\u0633\\u062a. \\u0647\\u0646\\u06af\\u0627\\u0645\\u06cc \\u06a9\\u0647 \\u067e\\u0627\\u06cc\\u0647\\u200c\\u0647\\u0627\\u06cc \\u06a9\\u0645\\u062f \\u0627\\u0632 \\u06a9\\u06cc\\u0641\\u06cc\\u062a\\u06cc \\u063a\\u06cc\\u0631\\u0642\\u0627\\u0628\\u0644 \\u0627\\u0646\\u06a9\\u0627\\u0631 \\u0628\\u0631\\u062e\\u0648\\u0631\\u062f\\u0627\\u0631 \\u0628\\u0627\\u0634\\u0646\\u062f\\u060c \\u0647\\u0631 \\u062a\\u0631\\u06a9\\u06cc\\u0628\\u06cc \\u0634\\u0627\\u0647\\u06a9\\u0627\\u0631\\u06cc \\u0647\\u0645\\u0627\\u0647\\u0646\\u06af \\u062e\\u0648\\u0627\\u0647\\u062f \\u0628\\u0648\\u062f."}]	["oversized-washed-cotton-shirt", "karen-slub-linen-blouse"]	8602f2ec-e32e-49f1-b9a6-9d653d52d143	2026-10-13 01:18:49.245039+03:30	2026-10-13 01:18:49.24504+03:30
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (order_id, variant_id, product_title, variant_title, quantity, unit_price_rial, total_price_rial, id, created_at, updated_at, product_id, product_slug, size, color, image) FROM stdin;
2d1021a0-5242-484e-bb84-cc5037317188	\N	شومیز لینن اسلپ مدل کارن	S	1	18500000	18500000	331f4f7d-4206-488c-be9f-965d24632992	2026-10-13 01:21:03.705222+03:30	2026-10-13 01:21:03.705225+03:30	1	karen-slub-linen-blouse	S	\N	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80
e075a623-55f0-4caf-8434-18ed59753edb	\N	شومیز لینن اسلپ مدل کارن	S	1	18500000	18500000	2f54885a-0ce6-4129-bcb7-c64dd22640d3	2026-10-13 01:23:18.421437+03:30	2026-10-13 01:23:18.42144+03:30	1	karen-slub-linen-blouse	S	\N	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80
e050ec60-d067-496b-8bab-7da6443913c0	\N	شال بلند پشمی بافت ضخیم	طوسی ملانژ / Free Size	1	13500000	13500000	08e317fd-6c21-4250-b7cb-727b56086493	2026-10-14 00:53:10.480108+03:30	2026-10-14 00:53:10.480111+03:30	24	thick-knit-wool-long-scarf	Free Size	طوسی ملانژ	https://images.unsplash.com/photo-1608256246200-53e635b5b65f
b9b6bc4e-a1ac-4f88-81f2-e305580efe58	\N	شال بلند پشمی بافت ضخیم	مشکی / Free	1	13500000	13500000	98ca314c-4113-4e1e-9c94-f56b669b60b5	2026-10-17 22:19:42.548375+03:30	2026-10-17 22:19:42.548378+03:30	24	thick-knit-wool-long-scarf	Free	مشکی	https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800
a3675e12-4bf1-4fcc-bd08-6a0f9655e981	\N	شال بلند پشمی بافت ضخیم	مشکی / Free	1	13500000	13500000	1d55e726-f47d-4040-8bfe-4584852a48cd	2026-10-17 22:20:25.934635+03:30	2026-10-17 22:20:25.934638+03:30	24	thick-knit-wool-long-scarf	Free	مشکی	https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800
224c21e7-fbb0-40f4-93e0-a96128ae2c29	\N	شال بلند پشمی بافت ضخیم	مشکی / Free	1	13500000	13500000	5c555a4c-e424-4d36-b167-8a3c0bf34948	2026-10-17 22:41:16.688843+03:30	2026-10-17 22:41:16.688847+03:30	24	thick-knit-wool-long-scarf	Free	مشکی	https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800
fc187056-443a-4766-bb42-75084524d81d	\N	دستمال سر ژاکارد نخ پنبه	سبز مریم‌گلی / Free	1	5200000	5200000	20b9c3e2-4612-44a0-9117-6bb6889235b6	2026-10-17 22:59:51.475281+03:30	2026-10-17 22:59:51.475284+03:30	20	cotton-jacquard-bandana	Free	سبز مریم‌گلی	https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (order_number, user_id, customer_name, phone_number, province, city, postal_address, postal_code, subtotal_amount_rial, discount_amount_rial, shipping_cost_rial, total_amount_rial, status, shipping_method, zarinpal_authority, zarinpal_ref_id, tracking_code, shipping_provider, id, created_at, updated_at, building_number, unit, notes, status_label, payment_method, estimated_delivery, timeline) FROM stdin;
ORD-140509-102	c68f46bd-e81f-486f-9ddf-519ba42da975	سارا احمدی	09123456789	تهران	تهران	خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶	1433714521	17800000	0	450000	18250000	PROCESSING	پست پیشتاز	\N	\N	\N	\N	79b5ee50-b642-45cb-bfe7-d39e707844e8	2026-09-05 21:18:35.718899+03:30	2026-09-06 15:18:35.719504+03:30	\N	\N	\N	\N	online_gateway	\N	[]
ORD-140509-103	c68f46bd-e81f-486f-9ddf-519ba42da975	سارا احمدی	09123456789	تهران	تهران	خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶	1433714521	9200000	0	450000	9650000	DELIVERED	پست پیشتاز	\N	\N	\N	\N	a291950f-33f6-46d5-9d2a-5b4ca51f08fb	2026-09-03 15:18:35.725192+03:30	2026-09-06 15:18:35.725708+03:30	\N	\N	\N	\N	online_gateway	\N	[]
KERAS-104774	7e042d39-33a5-4e16-b92b-f7a0d431e97d	سارا رادمنش	09121112233	تهران	تهران	زعفرانیه، خیابان مقدس اردبیلی	1983963111	18500000	0	0	18500000	CANCELLED	standard	\N	\N	TRK-225661138680	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	2d1021a0-5242-484e-bb84-cc5037317188	2026-10-13 01:21:03.694556+03:30	2026-10-17 22:25:13.76504+03:30	\N	\N	\N	در انتظار پرداخت	online_gateway	\N	[]
KERAS-329219	7e042d39-33a5-4e16-b92b-f7a0d431e97d	سارا رادمنش	09121112233	تهران	تهران	زعفرانیه، خیابان مقدس اردبیلی	1983963111	18500000	0	0	18500000	PROCESSING	standard	\N	\N	TRK-188069739690	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	e075a623-55f0-4caf-8434-18ed59753edb	2026-10-13 01:23:18.413178+03:30	2026-10-13 01:23:18.471+03:30	\N	\N	\N	پرداخت موفق، در حال آماده‌سازی و بسته‌بندی	online_gateway	\N	[]
KERAS-164506	7e042d39-33a5-4e16-b92b-f7a0d431e97d	سارا رادمنش	09121112233	تهران	تهران	زعفرانیه، خیابان مقدس اردبیلی، پلاک ۲۴، واحد ۶	1983963111	13500000	0	650000	14150000	PROCESSING	standard	\N	\N	TRK-165386865459	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	e050ec60-d067-496b-8bab-7da6443913c0	2026-10-14 00:53:10.470803+03:30	2026-10-14 00:54:00.901805+03:30	\N	\N	\N	پرداخت موفق، در حال آماده‌سازی و بسته‌بندی	online_gateway	\N	[]
KERAS-116239	c5455d6b-2f5e-45c3-bc94-b4f32f5951dd	آرزو قنبری	09127778899	تهران	تهران	ونک، خیابان ملاصدرا، پلاک ۵	1999988888	13500000	0	650000	14150000	PROCESSING	standard	\N	\N	TRK-267175426514	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	b9b6bc4e-a1ac-4f88-81f2-e305580efe58	2026-10-17 22:19:42.544192+03:30	2026-10-17 22:19:42.592874+03:30	\N	\N	\N	پرداخت موفق، در حال آماده‌سازی و بسته‌بندی	online_gateway	\N	[]
KERAS-324075	c5455d6b-2f5e-45c3-bc94-b4f32f5951dd	آرزو قنبری	09127778899	تهران	تهران	ونک، خیابان ملاصدرا، پلاک ۵	1999988888	13500000	0	650000	14150000	PROCESSING	standard	\N	\N	TRK-145109377922	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	a3675e12-4bf1-4fcc-bd08-6a0f9655e981	2026-10-17 22:20:25.93139+03:30	2026-10-17 22:20:25.975242+03:30	\N	\N	\N	پرداخت موفق، در حال آماده‌سازی و بسته‌بندی	online_gateway	\N	[]
ORD-140509-101	c68f46bd-e81f-486f-9ddf-519ba42da975	سارا احمدی	09123456789	تهران	تهران	خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶	1433714521	8900000	0	450000	9350000	CANCELLED	پست پیشتاز	\N	\N	\N	\N	48a71b4a-b405-480c-93f2-05a03468ac6e	2026-09-06 11:18:35.714694+03:30	2026-10-17 22:25:13.765045+03:30	\N	\N	\N	\N	online_gateway	\N	[]
ORD-140509-104	c68f46bd-e81f-486f-9ddf-519ba42da975	سارا احمدی	09123456789	تهران	تهران	خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۶	1433714521	8900000	0	450000	9350000	CANCELLED	پست پیشتاز	\N	\N	12345678901234567890134	Iran Post	a66d656c-389e-4827-8554-00cdab09f886	2026-09-06 14:18:35.728066+03:30	2026-10-17 22:25:13.765046+03:30	\N	\N	\N	\N	online_gateway	\N	[]
KERAS-335746	c5455d6b-2f5e-45c3-bc94-b4f32f5951dd	آرزو قنبری	09127778899	تهران	تهران	ونک، خیابان ملاصدرا، پلاک ۵	1999988888	13500000	0	650000	14150000	PROCESSING	standard	\N	\N	TRK-325830914631	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	224c21e7-fbb0-40f4-93e0-a96128ae2c29	2026-10-17 22:41:16.685796+03:30	2026-10-17 22:41:16.727289+03:30	\N	\N	\N	پرداخت موفق، در حال آماده‌سازی و بسته‌بندی	online_gateway	\N	[]
KERAS-223130	d8a628ed-155f-407c-9ecf-2573f62a732d	هستی هشمتی	09185621567	کرمانشاه	کرمانشاه	فرهنگیان فاز ۲	0123456789	5200000	0	650000	5850000	PENDING	standard	\N	\N	TRK-763919420975	شرکت ملی پست جمهوری اسلامی ایران (پست پیشتاز)	fc187056-443a-4766-bb42-75084524d81d	2026-10-17 22:59:51.467748+03:30	2026-10-17 22:59:51.467752+03:30	\N	\N	\N	در انتظار پرداخت	online_gateway	\N	[]
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_codes (id, phone, code_hash, attempts, is_used, expires_at, created_at, updated_at) FROM stdin;
b6ba4e2a-01f5-4463-802e-bbfa91b1f703	09185621567	fd4c47981a3e9840882fbb8eb74d4c3c86e76f9c7fa8b92ae7e101dcf011af03	0	t	2026-09-07 21:31:07.297255+03:30	2026-09-07 21:29:07.297255+03:30	2026-09-07 21:31:31.036898+03:30
8bd29c00-0447-47ee-862f-c02fb840dcb4	09185621567	b1e02fdad3bd33a1d972b5686633668efd69e68c94ca72c24dccd0f5bd92d47e	0	t	2026-09-07 21:33:30.945212+03:30	2026-09-07 21:31:30.945212+03:30	2026-09-07 21:34:07.540148+03:30
213b20a8-d3e1-4435-98c9-60aba964a540	09185621567	123151937f354a3bbda77a94baf3055cba632bc7af1068a65aa61554aa685070	0	t	2026-09-07 21:36:07.455732+03:30	2026-09-07 21:34:07.455732+03:30	2026-09-07 21:34:52.501229+03:30
0da5677f-2044-4829-b6ca-0c4a9988a0e6	09185621567	87e0ac63783c950ee831f0ae6c672b9516b6f03962e82ecf22802e15b098650a	0	t	2026-09-08 18:13:54.042518+03:30	2026-09-08 18:11:54.042518+03:30	2026-09-08 18:12:11.49986+03:30
be0ccbf1-11ec-4c38-b1f9-33e3c78b9190	09185621567	0f1b13709b469150bfdb55fda2f5c62e7a83abc05fc5889764ceacc372f6038f	0	t	2026-09-17 10:17:45.431043+03:30	2026-09-17 10:15:45.431043+03:30	2026-09-17 10:16:08.157703+03:30
0c6cbbc7-bdb1-4043-a3c6-d2aa6a2a9be4	09185621567	d5d96dc27311874346dec881834e22c1f60ac36bc31781cf6dcfbc9020440fff	0	t	2026-10-04 21:13:44.251565+03:30	2026-10-04 21:11:44.251565+03:30	2026-10-04 21:11:57.229111+03:30
e1c518c3-5a88-4a2f-b558-adb859022f4b	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-13 01:23:03.665163+03:30	2026-10-13 01:21:03.665163+03:30	2026-10-13 01:23:18.104307+03:30
64ae58c7-99d8-435d-bc14-f9145d91bc2a	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-13 01:25:18.098493+03:30	2026-10-13 01:23:18.098493+03:30	2026-10-14 00:41:18.291629+03:30
49fc02f9-eda5-41a9-bca4-9e86a28ceab7	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-14 00:43:18.28575+03:30	2026-10-14 00:41:18.28575+03:30	2026-10-14 00:46:15.887671+03:30
c9127f42-2e80-415c-b54d-418acba3db7c	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-14 00:48:15.882402+03:30	2026-10-14 00:46:15.882402+03:30	2026-10-14 00:47:41.187578+03:30
ce0d59ed-7d8d-4a84-a21d-5be41328693e	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-14 00:49:41.184382+03:30	2026-10-14 00:47:41.184382+03:30	2026-10-17 22:19:42.438503+03:30
d2148b26-eb09-4682-81f8-196aeb5ac070	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-17 22:21:42.428841+03:30	2026-10-17 22:19:42.428841+03:30	2026-10-17 22:20:25.869262+03:30
cb7779ac-be7f-4f49-bf41-68ff21b043ad	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	t	2026-10-17 22:22:25.861859+03:30	2026-10-17 22:20:25.861859+03:30	2026-10-17 22:41:16.555075+03:30
4bcefff4-ca6e-41d3-a80e-25dacd6cc422	09121112233	c872c5d3c006a2722b1b204445c10dcb59b2ec7734ad778743dbd3b64e6cb8cf	0	f	2026-10-17 22:43:16.548613+03:30	2026-10-17 22:41:16.548613+03:30	2026-10-17 22:41:16.557715+03:30
\.


--
-- Data for Name: payment_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_transactions (order_id, provider, amount_rial, status, authority, ref_id, card_pan, raw_response, id, created_at, updated_at, expires_at, callback_url) FROM stdin;
e075a623-55f0-4caf-8434-18ed59753edb	SEP	18500000	PAID	keras_pay_8b0d4b08bf9f4df48e0fca76b3690da9	716531529162	6037-9911-2233-4455	\N	90b6b1bf-6993-4e3a-aa1f-79a539da6492	2026-10-13 01:23:18.448047+03:30	2026-10-13 01:23:18.472691+03:30	\N	/checkout/callback
e050ec60-d067-496b-8bab-7da6443913c0	SEP	14150000	PAID	keras_pay_9b39a8287f41468ab4505bece817b96a	227080809939	6037-99**-****-1234	\N	fe1b89c1-dd74-486d-b384-3d0380a8cf5d	2026-10-14 00:53:46.064604+03:30	2026-10-14 00:54:00.903321+03:30	\N	/checkout/callback
b9b6bc4e-a1ac-4f88-81f2-e305580efe58	SEP	14150000	PAID	keras_pay_061d1c0a2ad241d996bc88d3a67cb479	253522854763	۶۰۳۷۹۹******۱۱۱۲	\N	f8c914d7-1832-4b0e-bd41-1744816fcd07	2026-10-17 22:19:42.567274+03:30	2026-10-17 22:19:42.594719+03:30	\N	/checkout/callback
a3675e12-4bf1-4fcc-bd08-6a0f9655e981	SEP	14150000	PAID	keras_pay_6844794ce1ec4859b96d326b49a5b041	337254394119	۶۰۳۷۹۹******۱۱۱۲	\N	81b52939-03d5-4ef8-8232-6b3a33f4b943	2026-10-17 22:20:25.95079+03:30	2026-10-17 22:20:25.976878+03:30	\N	/checkout/callback
224c21e7-fbb0-40f4-93e0-a96128ae2c29	SEP	14150000	PAID	keras_pay_3f269c6d13e0449e91be1b10a71883ff	126585057126	۶۰۳۷۹۹******۱۱۱۲	\N	28c071fc-e1f1-4ab0-968e-b53ade376170	2026-10-17 22:41:16.703854+03:30	2026-10-17 22:41:16.728732+03:30	\N	/checkout/callback
fc187056-443a-4766-bb42-75084524d81d	SEP	5850000	PENDING	keras_pay_627d02dac78f412a88d5b021e0f9afee	\N	\N	\N	bab3c24c-1ed0-4646-b7fb-2e5fbeab58b4	2026-10-17 22:59:51.502981+03:30	2026-10-17 22:59:51.502985+03:30	\N	/checkout/callback
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_reviews (product_slug, product_title, product_thumbnail, author_name, rating, date, comment, fit_feedback, is_verified_buyer, status, size_purchased, reply, id, created_at, updated_at) FROM stdin;
karen-slub-linen-blouse	شومیز لنین اسلپ کارن	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800	سارا ملکی	5	۱۴۰۵/۰۶/۲۰	کیفیت الیاف لنین فوق‌العاده‌ست! ریزش پارچه و تن‌خور کار بی‌نظیره و اصلاً بعد شست‌وشو آبرفت نداشت.	true_to_size	t	approved	M	{"text": "\\u0633\\u0627\\u0631\\u0627 \\u0639\\u0632\\u06cc\\u0632\\u060c \\u062e\\u0648\\u0634\\u062d\\u0627\\u0644\\u06cc\\u0645 \\u06a9\\u0647 \\u0627\\u0632 \\u0627\\u06cc\\u0633\\u062a\\u0627\\u06cc\\u06cc \\u0648 \\u06a9\\u06cc\\u0641\\u06cc\\u062a \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0634\\u0648\\u0645\\u06cc\\u0632 \\u06a9\\u0627\\u0631\\u0646 \\u0631\\u0636\\u0627\\u06cc\\u062a \\u062f\\u0627\\u0631\\u06cc\\u062f. \\u067e\\u0648\\u0634\\u06cc\\u062f\\u0646 \\u0622\\u0646 \\u062f\\u0631 \\u0631\\u0648\\u0632\\u0647\\u0627\\u06cc \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc \\u0647\\u0645\\u0631\\u0627\\u0647 \\u0634\\u0645\\u0627\\u0633\\u062a.", "date": "\\u06f1\\u06f4\\u06f0\\u06f5/\\u06f0\\u06f6/\\u06f2\\u06f1", "author": "\\u0622\\u062a\\u0644\\u06cc\\u0647 \\u06a9\\u0631\\u0627\\u0633"}	d7009e00-e855-4886-9d9c-2aa5d2104604	2026-10-13 01:18:49.232592+03:30	2026-10-13 01:18:49.232596+03:30
karen-slub-linen-blouse	شومیز لنین اسلپ کارن	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800	نگار رادمهر	5	۱۴۰۵/۰۶/۲۸	دوخت بسیار تمیز و دکمه‌های صدفی باکیفیت. رنگ کرم ماسه‌ای دقیقاً شبیه عکس‌های آتلیه بود.	true_to_size	t	approved	S	null	e732f58a-b780-40b4-995c-e60371e4d0d3	2026-10-13 01:18:49.232605+03:30	2026-10-13 01:18:49.232606+03:30
karen-slub-linen-blouse	شومیز لنین اسلپ کارن	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800	مهسا کاظمی	4	۱۴۰۵/۰۷/۰۱	تن‌خور کار خیلی قشنگه فقط آستین‌هاش کمی بلندتر از حد معموله که برای استایل کژوال با تا زدن عالی میشه.	runs_large	t	approved	M	null	58db8fdc-dc00-48e1-bac5-7741866fb88e	2026-10-13 01:18:49.232612+03:30	2026-10-13 01:18:49.232613+03:30
karen-slub-linen-blouse	شومیز لنین اسلپ کارن	https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=800	پریا دادخواه	5	۱۴۰۵/۰۷/۰۴	آیا رنگ زیتونی این کار دوباره شارژ میشه؟ کار قبلی رو خریدم و خیلی راضی بودم.	true_to_size	f	pending	\N	null	3e0f4c30-5f21-49f1-87e8-4c5d9cbd88f3	2026-10-13 01:18:49.232619+03:30	2026-10-13 01:18:49.23262+03:30
oversized-washed-cotton-shirt	پیراهن نخ پنبه واش‌شده اورسایز	https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=800	شیدا انوری	5	۱۴۰۵/۰۶/۲۵	پارچه پنبه‌ای بسیار خنک و لطیف. برای پاییز زیر ژاکت یا به تنهایی استایل فوق‌العاده‌ای داره.	true_to_size	t	approved	L	{"text": "\\u0634\\u06cc\\u062f\\u0627 \\u0639\\u0632\\u06cc\\u0632\\u060c \\u0633\\u067e\\u0627\\u0633 \\u0627\\u0632 \\u062b\\u0628\\u062a \\u062f\\u06cc\\u062f\\u06af\\u0627\\u0647 \\u0634\\u0645\\u0627. \\u067e\\u06cc\\u0631\\u0627\\u0647\\u0646 \\u0627\\u0648\\u0631\\u0633\\u0627\\u06cc\\u0632 \\u0648\\u0627\\u0634\\u200c\\u0634\\u062f\\u0647 \\u0627\\u0632 \\u067e\\u0631\\u0637\\u0631\\u0641\\u062f\\u0627\\u0631\\u062a\\u0631\\u06cc\\u0646 \\u0637\\u0631\\u0627\\u062d\\u06cc\\u200c\\u0647\\u0627\\u06cc \\u06a9\\u067e\\u0633\\u0648\\u0644 \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u06cc \\u0645\\u0627\\u0633\\u062a.", "date": "\\u06f1\\u06f4\\u06f0\\u06f5/\\u06f0\\u06f6/\\u06f2\\u06f6", "author": "\\u0622\\u062a\\u0644\\u06cc\\u0647 \\u06a9\\u0631\\u0627\\u0633"}	47e132b8-d509-4ae2-add6-733a11d5b9df	2026-10-13 01:18:49.232625+03:30	2026-10-13 01:18:49.232626+03:30
oversized-washed-cotton-shirt	پیراهن نخ پنبه واش‌شده اورسایز	https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=800	الهام توکلی	3	۱۴۰۵/۰۷/۰۲	قواره لباس بسیار بزرگ‌تر از چیزی هست که فکر می‌کردم، حتماً یک سایز کوچک‌تر انتخاب کنید.	runs_large	t	pending	M	null	5ac345c2-a86c-4b65-8c31-1c40fce97702	2026-10-13 01:18:49.232632+03:30	2026-10-13 01:18:49.232632+03:30
fluffy-turtleneck-knit-sweater	پلیور یقه اسکی بافت موهر	https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800	کیمیا افشار	5	۱۴۰۵/۰۶/۱۵	تراکم بافت موهر عالیه و اصلاً ایجاد خارش پوستی نمیکنه. رنگ شیری ملایم بسیار شیک است.	true_to_size	t	approved	S	null	7390a879-4575-4b07-92b1-fe4dbf024461	2026-10-13 01:18:49.232638+03:30	2026-10-13 01:18:49.232638+03:30
fluffy-turtleneck-knit-sweater	پلیور یقه اسکی بافت موهر	https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800	مریم بهرامی	2	۱۴۰۵/۰۷/۰۵	لطفاً متن نامربوط حذف شود... تبلیغات سایت دیگر.	true_to_size	f	rejected	\N	null	a017627a-9fe7-4faa-8437-ac716ce028a0	2026-10-13 01:18:49.232644+03:30	2026-10-13 01:18:49.232644+03:30
cashmere-open-front-cardigan	کاردیگان جلوباز پشمی با کشمیر	https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800	نازنین صفوی	5	۱۴۰۵/۰۷/۰۳	گرما و سبکی بی‌نظیر. لمس بافت کشمیر واقعاً حس لوکس بودن رو منتقل میکنه.	true_to_size	t	pending	Free	null	c421e59e-7aa1-44da-ae9b-3881e102e63f	2026-10-13 01:18:49.23265+03:30	2026-10-13 01:18:49.232651+03:30
calm-seamless-leggings-black	لگینگ ورزشی سیم‌لس مشکی کالم	https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800	سمیرا نادری	5	۱۴۰۵/۰۶/۱۰	واقعاً تست اسکات‌پروف رو پاس کرد! حین تمرینات کششی یوگا اصلاً بدن‌نما نیست و کمرش لول نمیشه.	true_to_size	t	approved	M	null	1f1f7d0a-7fd3-4c82-bf88-d021a1ea93bf	2026-10-13 01:18:49.232656+03:30	2026-10-13 01:18:49.232657+03:30
calm-seamless-leggings-black	لگینگ ورزشی سیم‌لس مشکی کالم	https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800	رویا قاسم‌پور	4	۱۴۰۵/۰۷/۰۶	کشسانی خوبی داره و فیت جذب و راحتی داره. سایزبندی کاملاً درسته.	true_to_size	t	pending	S	null	26b30fcb-a6ce-4add-8da6-e02b03eeeb42	2026-10-13 01:18:49.232662+03:30	2026-10-17 22:45:06.286265+03:30
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (product_id, title, sku, price_rial, compare_at_price_rial, stock, is_active, attributes, fulfillment_type, supplier_id, id, created_at, updated_at, numeric_id, color, color_hex, size, reserved) FROM stdin;
5e203b2e-8e9b-4994-abfb-628a49cd4047	شنی نچرال / XS	KRN-SND-XS	18500000	\N	5	t	\N	\N	\N	ef011d12-6309-423e-9029-cadd120138cb	2026-10-13 01:18:49.146684+03:30	2026-10-13 01:18:49.146686+03:30	1001	شنی نچرال	#F1E7DC	XS	0
5e203b2e-8e9b-4994-abfb-628a49cd4047	شنی نچرال / S	KRN-SND-S	18500000	\N	8	t	\N	\N	\N	4799ef5a-3aa3-4cb8-b1ad-11774d0f129f	2026-10-13 01:18:49.146695+03:30	2026-10-13 01:18:49.146695+03:30	1002	شنی نچرال	#F1E7DC	S	1
5e203b2e-8e9b-4994-abfb-628a49cd4047	شنی نچرال / M	KRN-SND-M	18500000	\N	12	t	\N	\N	\N	3e7c266d-f082-4b9f-a311-c9d6ed289753	2026-10-13 01:18:49.146701+03:30	2026-10-13 01:18:49.146702+03:30	1003	شنی نچرال	#F1E7DC	M	2
5e203b2e-8e9b-4994-abfb-628a49cd4047	شنی نچرال / L	KRN-SND-L	18500000	\N	6	t	\N	\N	\N	2094358f-7378-4cfd-95d3-9956a9e39ec3	2026-10-13 01:18:49.146709+03:30	2026-10-13 01:18:49.146709+03:30	1004	شنی نچرال	#F1E7DC	L	0
5e203b2e-8e9b-4994-abfb-628a49cd4047	مشکی موکا / S	KRN-INK-S	18500000	\N	7	t	\N	\N	\N	72fc9c22-2b40-45b6-8be0-38c6ce96a7de	2026-10-13 01:18:49.146715+03:30	2026-10-13 01:18:49.146715+03:30	1005	مشکی موکا	#3B2F2C	S	0
5e203b2e-8e9b-4994-abfb-628a49cd4047	مشکی موکا / M	KRN-INK-M	18500000	\N	9	t	\N	\N	\N	a615737a-0c97-4252-b4e5-57b77d6bda92	2026-10-13 01:18:49.146721+03:30	2026-10-13 01:18:49.146722+03:30	1006	مشکی موکا	#3B2F2C	M	1
99c72dfb-d4a0-4f0c-906a-9f8643e9b3d2	سبز مریم‌گلی / S	OVS-SGE-S	16800000	\N	6	t	\N	\N	\N	cad67f19-5df8-4a0c-9ec9-ace51ed37b78	2026-10-13 01:18:49.151907+03:30	2026-10-13 01:18:49.151909+03:30	2001	سبز مریم‌گلی	#56705B	S	0
99c72dfb-d4a0-4f0c-906a-9f8643e9b3d2	سبز مریم‌گلی / M	OVS-SGE-M	16800000	\N	8	t	\N	\N	\N	b33dc029-274a-49cb-bca1-35bca4bdb91f	2026-10-13 01:18:49.151917+03:30	2026-10-13 01:18:49.151918+03:30	2002	سبز مریم‌گلی	#56705B	M	1
99c72dfb-d4a0-4f0c-906a-9f8643e9b3d2	سبز مریم‌گلی / L	OVS-SGE-L	16800000	\N	4	t	\N	\N	\N	cc8331f1-9525-40c4-8195-9b4cb97aabf6	2026-10-13 01:18:49.151924+03:30	2026-10-13 01:18:49.151925+03:30	2003	سبز مریم‌گلی	#56705B	L	0
7898e84e-acb8-4691-aac2-f0594b0f204c	رز کراس / S	BLS-ROS-S	19500000	\N	5	t	\N	\N	\N	ccca1c90-3dce-4651-8616-8729e04dede1	2026-10-13 01:18:49.155742+03:30	2026-10-13 01:18:49.155744+03:30	3001	رز کراس	#B8475F	S	0
7898e84e-acb8-4691-aac2-f0594b0f204c	رز کراس / M	BLS-ROS-M	19500000	\N	7	t	\N	\N	\N	206cea0e-33cf-4bbf-b6f5-d46cf22dec0f	2026-10-13 01:18:49.155752+03:30	2026-10-13 01:18:49.155753+03:30	3002	رز کراس	#B8475F	M	1
7898e84e-acb8-4691-aac2-f0594b0f204c	مشکی موکا / S	BLS-INK-S	19500000	\N	4	t	\N	\N	\N	9d3fc93e-5b6f-4282-b762-16c14fd506f9	2026-10-13 01:18:49.155759+03:30	2026-10-13 01:18:49.155759+03:30	3003	مشکی موکا	#3B2F2C	S	0
58907f12-c90e-422e-a39b-d815ae92c259	عاجی روشن / S	BTN-IVR-S	13900000	\N	4	t	\N	\N	\N	76e37d0a-fe9d-48f3-9b8e-d7ba6b86b7e3	2026-10-13 01:18:49.158812+03:30	2026-10-13 01:18:49.158813+03:30	4001	عاجی روشن	#FBF6F1	S	0
58907f12-c90e-422e-a39b-d815ae92c259	عاجی روشن / M	BTN-IVR-M	13900000	\N	5	t	\N	\N	\N	d19a6fc8-bd36-421d-884c-08419d39fb33	2026-10-13 01:18:49.158822+03:30	2026-10-13 01:18:49.158823+03:30	4002	عاجی روشن	#FBF6F1	M	0
7d633fc9-dffa-4de3-978c-27c856d0ace2	عاجی روشن / S	FLF-IVR-S	24500000	\N	6	t	\N	\N	\N	e80c2c62-81a0-4119-b30c-ec97b7458721	2026-10-13 01:18:49.162096+03:30	2026-10-13 01:18:49.162098+03:30	5001	عاجی روشن	#FBF6F1	S	0
7d633fc9-dffa-4de3-978c-27c856d0ace2	عاجی روشن / M	FLF-IVR-M	24500000	\N	10	t	\N	\N	\N	65b55933-884a-4e35-bcfc-450ac40a20d1	2026-10-13 01:18:49.162106+03:30	2026-10-13 01:18:49.162108+03:30	5002	عاجی روشن	#FBF6F1	M	1
7d633fc9-dffa-4de3-978c-27c856d0ace2	خاک رس / M	FLF-CLY-M	24500000	\N	4	t	\N	\N	\N	8cbe70e2-2c51-4d22-a968-3d1517d5dac0	2026-10-13 01:18:49.162114+03:30	2026-10-13 01:18:49.162115+03:30	5003	خاک رس	#C98F78	M	0
19d0140a-b3a6-4762-b493-98212f012859	شنی نچرال / S	CSH-SND-S	29800000	\N	5	t	\N	\N	\N	3a076d6d-f2ca-4e94-a2ec-c1a76366a814	2026-10-13 01:18:49.165047+03:30	2026-10-13 01:18:49.165049+03:30	6001	شنی نچرال	#F1E7DC	S	0
19d0140a-b3a6-4762-b493-98212f012859	شنی نچرال / M	CSH-SND-M	29800000	\N	7	t	\N	\N	\N	3c129d47-ca22-4991-920d-bff6b4f50201	2026-10-13 01:18:49.165057+03:30	2026-10-13 01:18:49.165058+03:30	6002	شنی نچرال	#F1E7DC	M	2
19d0140a-b3a6-4762-b493-98212f012859	رز کراس / M	CSH-ROS-M	29800000	\N	3	t	\N	\N	\N	e814343c-7756-4747-a605-612ee1e69612	2026-10-13 01:18:49.165064+03:30	2026-10-13 01:18:49.165065+03:30	6003	رز کراس	#B8475F	M	0
a63eba73-3991-4e6d-aabd-00c64f9b42f6	خاک رس / S	BOC-CLY-S	22800000	\N	4	t	\N	\N	\N	3098e431-a08a-403d-9f2e-beb415e23144	2026-10-13 01:18:49.168064+03:30	2026-10-13 01:18:49.168066+03:30	7001	خاک رس	#C98F78	S	0
a63eba73-3991-4e6d-aabd-00c64f9b42f6	خاک رس / M	BOC-CLY-M	22800000	\N	6	t	\N	\N	\N	2800aabf-e235-4d2c-b3b9-114b37c20229	2026-10-13 01:18:49.168074+03:30	2026-10-13 01:18:49.168075+03:30	7002	خاک رس	#C98F78	M	1
0bdefa77-526b-4ef7-8368-36d1e36e411d	رز کراس / S	CRP-ROS-S	17200000	\N	5	t	\N	\N	\N	a5863460-1d5c-4f2c-835c-575252276251	2026-10-13 01:18:49.171043+03:30	2026-10-13 01:18:49.171045+03:30	8001	رز کراس	#B8475F	S	0
0bdefa77-526b-4ef7-8368-36d1e36e411d	رز کراس / M	CRP-ROS-M	17200000	\N	8	t	\N	\N	\N	66184b13-601e-419a-85f3-d94df817de6d	2026-10-13 01:18:49.171053+03:30	2026-10-13 01:18:49.171054+03:30	8002	رز کراس	#B8475F	M	0
0bdefa77-526b-4ef7-8368-36d1e36e411d	مشکی موکا / S	CRP-INK-S	17200000	\N	4	t	\N	\N	\N	087b7dcd-db77-4f69-b258-da36a1dd937b	2026-10-13 01:18:49.171061+03:30	2026-10-13 01:18:49.171061+03:30	8003	مشکی موکا	#3B2F2C	S	1
1723d77e-09ad-4856-8142-aac3950cb094	مشکی موکا / S	FTR-INK-S	46500000	\N	4	t	\N	\N	\N	e062a20c-9e78-4e7e-bcf2-d0c6d195656d	2026-10-13 01:18:49.1741+03:30	2026-10-13 01:18:49.174102+03:30	9001	مشکی موکا	#3B2F2C	S	0
1723d77e-09ad-4856-8142-aac3950cb094	مشکی موکا / M	FTR-INK-M	46500000	\N	6	t	\N	\N	\N	b3b5a940-51b1-4cc7-be16-f40f6622a321	2026-10-13 01:18:49.174111+03:30	2026-10-13 01:18:49.174111+03:30	9002	مشکی موکا	#3B2F2C	M	1
1723d77e-09ad-4856-8142-aac3950cb094	شنی نچرال / M	FTR-SND-M	46500000	\N	5	t	\N	\N	\N	9b9e36b2-0d43-4b38-800f-afb1c8998c24	2026-10-13 01:18:49.174118+03:30	2026-10-13 01:18:49.174119+03:30	9003	شنی نچرال	#F1E7DC	M	0
6f69c1fb-a76f-4b76-beb5-14b12a443a99	سبز مریم‌گلی / S	WND-SGE-S	32500000	\N	5	t	\N	\N	\N	9daf0711-0ab2-49c4-81d9-cfe2796eaf73	2026-10-13 01:18:49.177062+03:30	2026-10-13 01:18:49.177064+03:30	10001	سبز مریم‌گلی	#56705B	S	0
6f69c1fb-a76f-4b76-beb5-14b12a443a99	سبز مریم‌گلی / M	WND-SGE-M	32500000	\N	8	t	\N	\N	\N	234ea511-7dde-4791-ac10-fbd454dc7701	2026-10-13 01:18:49.177072+03:30	2026-10-13 01:18:49.177073+03:30	10002	سبز مریم‌گلی	#56705B	M	1
6f69c1fb-a76f-4b76-beb5-14b12a443a99	مشکی موکا / M	WND-INK-M	32500000	\N	6	t	\N	\N	\N	55a31a04-64bf-4850-abaf-071d20964ce8	2026-10-13 01:18:49.177079+03:30	2026-10-13 01:18:49.17708+03:30	10003	مشکی موکا	#3B2F2C	M	0
deeedbb9-f3d1-4421-9508-67de417fd1e0	شنی نچرال / S	TRN-SND-S	39500000	\N	4	t	\N	\N	\N	bac0535f-3426-40a9-838d-bcecaaf29c32	2026-10-13 01:18:49.179932+03:30	2026-10-13 01:18:49.179934+03:30	11001	شنی نچرال	#F1E7DC	S	0
deeedbb9-f3d1-4421-9508-67de417fd1e0	شنی نچرال / M	TRN-SND-M	39500000	\N	7	t	\N	\N	\N	4f10fe1a-2dec-41a7-ba56-4fafb222144e	2026-10-13 01:18:49.179942+03:30	2026-10-13 01:18:49.179943+03:30	11002	شنی نچرال	#F1E7DC	M	1
deeedbb9-f3d1-4421-9508-67de417fd1e0	مشکی موکا / L	TRN-INK-L	39500000	\N	3	t	\N	\N	\N	1b87f009-9c87-4f56-8127-0fbe1c11daec	2026-10-13 01:18:49.179949+03:30	2026-10-13 01:18:49.179949+03:30	11003	مشکی موکا	#3B2F2C	L	0
53e9878c-42ca-40d6-977d-2c2edee9caee	شنی نچرال / S	WID-SND-S	18900000	\N	6	t	\N	\N	\N	41cdb054-4e34-4df7-8871-4f965718a58c	2026-10-13 01:18:49.182805+03:30	2026-10-13 01:18:49.182808+03:30	12001	شنی نچرال	#F1E7DC	S	0
53e9878c-42ca-40d6-977d-2c2edee9caee	شنی نچرال / M	WID-SND-M	18900000	\N	9	t	\N	\N	\N	8e2dea3f-54e2-4588-bda5-2f6c357ff184	2026-10-13 01:18:49.18282+03:30	2026-10-13 01:18:49.182821+03:30	12002	شنی نچرال	#F1E7DC	M	1
53e9878c-42ca-40d6-977d-2c2edee9caee	مشکی موکا / M	WID-INK-M	18900000	\N	5	t	\N	\N	\N	65ab1e39-551b-4b8e-a636-3e69f39b952c	2026-10-13 01:18:49.182831+03:30	2026-10-13 01:18:49.182832+03:30	12003	مشکی موکا	#3B2F2C	M	0
5387d20a-7dec-445d-9862-b8f544d944b2	مشکی موکا / S	STR-INK-S	23500000	\N	4	t	\N	\N	\N	11022447-2202-4207-8491-d6397119092f	2026-10-13 01:18:49.185591+03:30	2026-10-13 01:18:49.185593+03:30	13001	مشکی موکا	#3B2F2C	S	0
5387d20a-7dec-445d-9862-b8f544d944b2	مشکی موکا / M	STR-INK-M	23500000	\N	7	t	\N	\N	\N	01e0d4d7-3ae7-4fb4-b407-cffb949a59d1	2026-10-13 01:18:49.185602+03:30	2026-10-13 01:18:49.185603+03:30	13002	مشکی موکا	#3B2F2C	M	1
5bf8f886-c048-47f3-903e-2667e9929a40	خاک رس / S	JGR-CLY-S	15800000	\N	6	t	\N	\N	\N	1504d53c-ff8e-4d1d-b00a-3a955f4b328d	2026-10-13 01:18:49.188298+03:30	2026-10-13 01:18:49.1883+03:30	14001	خاک رس	#C98F78	S	0
5bf8f886-c048-47f3-903e-2667e9929a40	خاک رس / M	JGR-CLY-M	15800000	\N	8	t	\N	\N	\N	2e5bce51-ef27-4296-b156-1670f20a21a6	2026-10-13 01:18:49.188308+03:30	2026-10-13 01:18:49.188309+03:30	14002	خاک رس	#C98F78	M	1
5bf8f886-c048-47f3-903e-2667e9929a40	مشکی موکا / M	JGR-INK-M	15800000	\N	5	t	\N	\N	\N	7e26d8df-3672-4af9-905f-87aaa441241d	2026-10-13 01:18:49.188315+03:30	2026-10-13 01:18:49.188315+03:30	14003	مشکی موکا	#3B2F2C	M	0
aa4d61ac-be05-4008-9d72-bbfa9ee36f3f	عاجی روشن / S	TEE-IVR-S	8900000	\N	12	t	\N	\N	\N	93575413-1f04-4f2e-a95c-5cb9f665435b	2026-10-13 01:18:49.191376+03:30	2026-10-13 01:18:49.191377+03:30	15001	عاجی روشن	#FBF6F1	S	0
aa4d61ac-be05-4008-9d72-bbfa9ee36f3f	عاجی روشن / M	TEE-IVR-M	8900000	\N	15	t	\N	\N	\N	c0378799-a340-49cf-b5ad-b6d2dad8116c	2026-10-13 01:18:49.191386+03:30	2026-10-13 01:18:49.191387+03:30	15002	عاجی روشن	#FBF6F1	M	2
aa4d61ac-be05-4008-9d72-bbfa9ee36f3f	مشکی موکا / M	TEE-INK-M	8900000	\N	10	t	\N	\N	\N	e356b23e-6f0a-4feb-954d-d3f318bd7578	2026-10-13 01:18:49.191393+03:30	2026-10-13 01:18:49.191394+03:30	15003	مشکی موکا	#3B2F2C	M	1
37d8ec2a-4394-479b-aa57-9b88b15f2210	خاک رس / S	BDY-CLY-S	11800000	\N	6	t	\N	\N	\N	8308b859-0077-4232-a825-e1e73f3b2ae5	2026-10-13 01:18:49.194562+03:30	2026-10-13 01:18:49.194564+03:30	16001	خاک رس	#C98F78	S	0
37d8ec2a-4394-479b-aa57-9b88b15f2210	خاک رس / M	BDY-CLY-M	11800000	\N	8	t	\N	\N	\N	4b652f9d-a841-4f0e-8b9d-fb5f34be5650	2026-10-13 01:18:49.194572+03:30	2026-10-13 01:18:49.194573+03:30	16002	خاک رس	#C98F78	M	1
37d8ec2a-4394-479b-aa57-9b88b15f2210	سبز مریم‌گلی / M	BDY-SGE-M	11800000	\N	5	t	\N	\N	\N	a5b3f5da-0236-41c3-931d-b50021676899	2026-10-13 01:18:49.19458+03:30	2026-10-13 01:18:49.194581+03:30	16003	سبز مریم‌گلی	#56705B	M	0
b50c60f2-13fa-456d-a628-2a6c98ffc7bd	رز کراس / Free	SCR-ROS-FR	3800000	\N	15	t	\N	\N	\N	012dce6f-d92e-4d43-8279-9d22c14a71a6	2026-10-13 01:18:49.197807+03:30	2026-10-13 01:18:49.197809+03:30	17001	رز کراس	#B8475F	Free	1
b50c60f2-13fa-456d-a628-2a6c98ffc7bd	خاک رس / Free	SCR-CLY-FR	3800000	\N	12	t	\N	\N	\N	baf89109-4b37-46a0-9429-b8b7d94d52d4	2026-10-13 01:18:49.197818+03:30	2026-10-13 01:18:49.197819+03:30	17002	خاک رس	#C98F78	Free	0
b50c60f2-13fa-456d-a628-2a6c98ffc7bd	شنی نچرال / Free	SCR-SND-FR	3800000	\N	18	t	\N	\N	\N	8cc83696-c66e-4ab4-8e86-e6aa3f2f4636	2026-10-13 01:18:49.197826+03:30	2026-10-13 01:18:49.197827+03:30	17003	شنی نچرال	#F1E7DC	Free	0
4d7c2827-df69-4084-976f-4534700ea4f7	شنی نچرال / Free	CLP-SND-FR	4900000	\N	10	t	\N	\N	\N	c5a13014-a382-41b8-aaea-fba3adc5c0ad	2026-10-13 01:18:49.200818+03:30	2026-10-13 01:18:49.20082+03:30	18001	شنی نچرال	#F1E7DC	Free	0
4d7c2827-df69-4084-976f-4534700ea4f7	مشکی موکا / Free	CLP-INK-FR	4900000	\N	14	t	\N	\N	\N	a1eff6fa-44e9-4689-9ccf-0f2fe66329f3	2026-10-13 01:18:49.200828+03:30	2026-10-13 01:18:49.200829+03:30	18002	مشکی موکا	#3B2F2C	Free	2
6e80fb33-4e1b-4880-af52-eb519c0078be	خاک رس / Free	WLT-SET-FR	4200000	\N	12	t	\N	\N	\N	8253ef9c-b500-4f52-ae0e-4b14c23dc254	2026-10-13 01:18:49.204234+03:30	2026-10-13 01:18:49.204236+03:30	19001	خاک رس	#C98F78	Free	0
d597440c-95b2-4b50-bf7a-6ea1b8c9ceaa	سبز مریم‌گلی / Free	BAN-SGE-FR	5200000	\N	15	t	\N	\N	\N	83755deb-7e44-4cb3-93db-5e49c7a7700a	2026-10-13 01:18:49.20731+03:30	2026-10-13 01:18:49.207312+03:30	20001	سبز مریم‌گلی	#56705B	Free	0
d597440c-95b2-4b50-bf7a-6ea1b8c9ceaa	شنی نچرال / Free	BAN-SND-FR	5200000	\N	12	t	\N	\N	\N	82cb4d16-721c-4e5e-81eb-84fde17e4954	2026-10-13 01:18:49.20732+03:30	2026-10-13 01:18:49.207321+03:30	20002	شنی نچرال	#F1E7DC	Free	1
f1857321-82ff-4b7a-84a1-90a06fd69d62	رز کراس / Free	GEO-ROS-FR	4600000	\N	10	t	\N	\N	\N	65fc33f1-eafd-4b83-93ab-769cd6996560	2026-10-13 01:18:49.210065+03:30	2026-10-13 01:18:49.210067+03:30	21001	رز کراس	#B8475F	Free	0
f1857321-82ff-4b7a-84a1-90a06fd69d62	مشکی موکا / Free	GEO-INK-FR	4600000	\N	8	t	\N	\N	\N	f7708ce8-21af-4837-99e1-bcedbafabb07	2026-10-13 01:18:49.210075+03:30	2026-10-13 01:18:49.210076+03:30	21002	مشکی موکا	#3B2F2C	Free	0
40edf940-a806-4eed-abe6-c883ed3b4d73	شنی نچرال / Free	PAT-SND-FR	4400000	\N	14	t	\N	\N	\N	0a0aa924-7c7b-4357-ac57-a362b521a63c	2026-10-13 01:18:49.212936+03:30	2026-10-13 01:18:49.212938+03:30	22001	شنی نچرال	#F1E7DC	Free	0
40edf940-a806-4eed-abe6-c883ed3b4d73	خاک رس / Free	PAT-CLY-FR	4400000	\N	9	t	\N	\N	\N	ae0c0f2f-57f6-4b40-9f86-884134ec48cb	2026-10-13 01:18:49.212947+03:30	2026-10-13 01:18:49.212947+03:30	22002	خاک رس	#C98F78	Free	0
5a35b5ab-84dd-41c4-8d6a-60e74f9bc698	عاجی روشن / Free	SLK-IVR-FR	8900000	\N	8	t	\N	\N	\N	7933d978-e291-4874-a8c3-123809ab958a	2026-10-13 01:18:49.215707+03:30	2026-10-13 01:18:49.215709+03:30	23001	عاجی روشن	#FBF6F1	Free	0
5a35b5ab-84dd-41c4-8d6a-60e74f9bc698	رز کراس / Free	SLK-ROS-FR	8900000	\N	11	t	\N	\N	\N	ba6feb2d-29a9-47ed-80bd-c74e4bf37309	2026-10-13 01:18:49.215718+03:30	2026-10-13 01:18:49.215719+03:30	23002	رز کراس	#B8475F	Free	1
d34eb3d3-4ae8-4f2f-aaa6-a9ed7b9af933	مشکی موکا / Free	WLS-INK-FR	13500000	\N	12	t	\N	\N	\N	6f6bb92e-0b11-48f3-ac16-3cb2f7cca848	2026-10-13 01:18:49.216978+03:30	2026-10-13 01:18:49.21698+03:30	24001	مشکی موکا	#3B2F2C	Free	0
d34eb3d3-4ae8-4f2f-aaa6-a9ed7b9af933	شنی نچرال / Free	WLS-SND-FR	13500000	\N	16	t	\N	\N	\N	d7a6be6a-7a0a-4511-b174-eea40ae4b604	2026-10-13 01:18:49.216989+03:30	2026-10-13 01:18:49.21699+03:30	24002	شنی نچرال	#F1E7DC	Free	1
d34eb3d3-4ae8-4f2f-aaa6-a9ed7b9af933	خاک رس / Free	WLS-CLY-FR	13500000	\N	7	t	\N	\N	\N	67f6a494-54d7-4ce6-9b8d-b75ce10deeac	2026-10-13 01:18:49.216997+03:30	2026-10-13 01:18:49.216998+03:30	24003	خاک رس	#C98F78	Free	0
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (title, slug, description, category_id, images, base_price_rial, is_active, fulfillment_type, id, created_at, updated_at, numeric_id, brand, division, season, badge, line, fit_note, fabric, fabric_composition, fabric_gsm, stretch, softness, opacity, has_transparency_test, rating_avg, rating_count, sizes, available_sizes, colors, size_chart, activities, compare_at_price_rial) FROM stdin;
شومیز لینن اسلپ مدل کارن	karen-slub-linen-blouse	شومیز ادیتوریال پاییزه دوخته‌شده از لینن اسلپ تنفس‌پذیر با بافت نامنظم طبیعی. طراحی اورسایز متعادل با سرآستین‌های کشیده و دکمه‌های صدفی طبیعی که برای استایل چندلایه پاییزی خلق شده است.	d854aace-8451-47e8-9014-f5f808392016	[{"id": 101, "url": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80", "alt": "شومیز لینن اسلپ مدل کارن رنگ شنی نچرال نمای روبرو", "kind": "photo", "position": 1}, {"id": 102, "url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80", "alt": "شومیز کارن در استایل خیابانی پاییزه", "kind": "motion", "position": 2}]	18500000	t	STANDARD	5e203b2e-8e9b-4994-abfb-628a49cd4047	2026-10-13 01:18:49.140725+03:30	2026-10-13 01:18:49.140729+03:30	1	keras-atelier	apparel	fall-1405	جدید	calm	قواره آزاد و ادیتوریال؛ برای تن‌خور جذب، یک سایز کوچک‌تر پیشنهاد می‌شود.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0644\\u06cc\\u0646\\u0646 \\u0627\\u0633\\u0644\\u067e \\u0627\\u0631\\u06af\\u0627\\u0646\\u06cc\\u06a9", "gsm": 210, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u06cc\\u0627 \\u062f\\u0648\\u0631 \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0628\\u0627 \\u0622\\u0628 \\u06f3\\u06f0 \\u062f\\u0631\\u062c\\u0647\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u062f\\u0631 \\u062d\\u0627\\u0644\\u062a \\u0646\\u06cc\\u0645\\u0647\\u200c\\u0645\\u0631\\u0637\\u0648\\u0628"}	۱۰۰٪ الیاف طبیعی لینن اسلپ ارگانیک	210	2	5	5	t	4.9	38	["XS", "S", "M", "L", "XL"]	["XS", "S", "M", "L", "XL"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	21500000
پیراهن اورسایز کتان شسته	oversized-washed-cotton-shirt	پیراهن مدرن کژوال با فرآیند سنگشور آنزیمی جهت ایجاد زیردست ابریشمی و حس راحتی روزمره. دارای جیب پاکتی نامتقارن روی سینه و یقه انگلیسی شیک برای استایل چندکاربردی بهاره.	d854aace-8451-47e8-9014-f5f808392016	[{"id": 201, "url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", "alt": "پیراهن اورسایز کتان شسته سبز مریم‌گلی", "kind": "photo", "position": 1}]	16800000	t	STANDARD	99c72dfb-d4a0-4f0c-906a-9f8643e9b3d2	2026-10-13 01:18:49.144495+03:30	2026-10-13 01:18:49.144498+03:30	2	massimo-dutti	apparel	spring-1406	پیش‌نمایش	calm	برش اورسایز کژوال؛ در قد پشت بلندتر از پیش برای زیبایی استایل.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u067e\\u0646\\u0628\\u0647 \\u06a9\\u062a\\u0627\\u0646 \\u0634\\u0633\\u062a\\u0647 \\u0634\\u062f\\u0647 \\u0628\\u0627 \\u0633\\u0646\\u06af\\u200c\\u0634\\u0648\\u0631 \\u0622\\u0646\\u0632\\u06cc\\u0645\\u06cc", "gsm": 190, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648 \\u062f\\u0631 \\u0645\\u0627\\u0634\\u06cc\\u0646 \\u0628\\u0627 \\u062f\\u0648\\u0631 \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0648 \\u0634\\u0648\\u06cc\\u0646\\u062f\\u0647 \\u0641\\u0627\\u0642\\u062f \\u0633\\u0641\\u06cc\\u062f\\u06a9\\u0646\\u0646\\u062f\\u0647"}	۱۰۰٪ پنبه کتان شسته شده با سنگ‌شور آنزیمی	190	2	5	5	f	4.8	22	["S", "M", "L", "XL"]	["S", "M", "L", "XL"]	[{"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	19800000
شومیز کرپ حریر پاییزی	autumn-crepe-chiffon-blouse	شومیز فاخر مجلسی با ریزش بی‌نظیر کرپ حریر ابریشمی. دکمه‌های مخفی جلو و پنس‌های ارگونومیک، ظاهری بسیار شیک و آراسته برای مهمانی‌ها و جلسات رسمی پاییزی فراهم می‌آورند.	d854aace-8451-47e8-9014-f5f808392016	[{"id": 301, "url": "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80", "alt": "شومیز کرپ حریر پاییزی رز کراس", "kind": "photo", "position": 1}]	19500000	t	STANDARD	7898e84e-acb8-4691-aac2-f0594b0f204c	2026-10-13 01:18:49.150921+03:30	2026-10-13 01:18:49.150924+03:30	3	mango	apparel	fall-1405	\N	move	فیت کلاسیک و افتاده؛ مناسب پوشیدن به همراه شلوار راسته یا زیر ترنچ کت.	{"composition": "\\u06f7\\u06f0\\u066a \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u0633\\u0646\\u062a\\u062a\\u06cc\\u06a9\\u060c \\u06f3\\u06f0\\u066a \\u06a9\\u0631\\u067e \\u062f\\u0648\\u0634\\u06cc\\u0646 \\u0641\\u0631\\u0627\\u0646\\u0633\\u0648\\u06cc", "gsm": 180, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u0628\\u062f\\u0648\\u0646 \\u0641\\u0634\\u0631\\u062f\\u0646 \\u0648 \\u0622\\u0648\\u06cc\\u0632\\u0627\\u0646 \\u06a9\\u0631\\u062f\\u0646 \\u0631\\u0648\\u06cc \\u0686\\u0648\\u0628\\u200c\\u0644\\u0628\\u0627\\u0633\\u06cc \\u0627\\u0628\\u0631\\u06cc"}	۷۰٪ الیاف ابریشم سنتتیک، ۳۰٪ کرپ دوشین فرانسوی	180	1	5	4	f	4.7	19	["XS", "S", "M", "L"]	["XS", "S", "M", "L"]	[{"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	23000000
پیراهن دکمه‌دار مینیمال	minimal-button-down-shirt	پیراهن دکمه‌دار خنک از آرشیو تابستان با برش‌های ژئومتریک مینیمال. پارچه پوپلین تنفس‌پذیر ضد تعریق، انتخابی ایده‌آل برای استایل خنک کژوال و سفرهای تابستانی.	d854aace-8451-47e8-9014-f5f808392016	[{"id": 401, "url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", "alt": "پیراهن دکمه‌دار مینیمال عاجی روشن", "kind": "photo", "position": 1}]	13900000	t	STANDARD	58907f12-c90e-422e-a39b-d815ae92c259	2026-10-13 01:18:49.154878+03:30	2026-10-13 01:18:49.15488+03:30	4	cos	apparel	summer-1405	حراج	calm	فیت نرمال و راحت؛ مناسب ست کردن با شلوار واید لینن.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u067e\\u0648\\u067e\\u0644\\u06cc\\u0646 \\u067e\\u0646\\u0628\\u0647 \\u0634\\u0627\\u0646\\u0647 \\u0634\\u062f\\u0647 \\u0641\\u0648\\u0642 \\u0633\\u0628\\u06a9", "gsm": 140, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0645\\u0627\\u0634\\u06cc\\u0646\\u06cc \\u062f\\u0631 \\u0622\\u0628 \\u0633\\u0631\\u062f\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u0628\\u0627 \\u062f\\u0645\\u0627\\u06cc \\u0645\\u062a\\u0648\\u0633\\u0637"}	۱۰۰٪ پوپلین پنبه شانه شده فوق سبک	140	1	4	5	f	4.6	31	["S", "M", "L"]	["S", "M", "L"]	[{"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	17500000
پلیور بافت کرکی یقه اسکی	fluffy-turtleneck-knit-sweater	پلیور بافت ضخیم زمستانه با بافت کرکی پف‌دار از الیاف مرینوس و آلپاکا. یقه اسکی ایستاده دوبل بدون ایجاد حساسیت پوستی، حس گرما و راحتی عمیقی را در روزهای برفی ایجاد می‌کند.	ad00774e-41e2-452f-bde1-249edf7bfdd5	[{"id": 501, "url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80", "alt": "پلیور بافت کرکی یقه اسکی عاجی روشن", "kind": "photo", "position": 1}]	24500000	t	STANDARD	7d633fc9-dffa-4de3-978c-27c856d0ace2	2026-10-13 01:18:49.157868+03:30	2026-10-13 01:18:49.15787+03:30	5	toteme	apparel	winter-1405	\N	calm	تن‌خور نرمال و بسیار گرم؛ برای استایل چندلایه عالی است.	{"composition": "\\u06f5\\u06f5\\u066a \\u067e\\u0634\\u0645 \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633\\u060c \\u06f2\\u06f5\\u066a \\u0622\\u0644\\u067e\\u0627\\u06a9\\u0627 \\u0644\\u0637\\u06cc\\u0641\\u060c \\u06f2\\u06f0\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0622\\u0645\\u06cc\\u062f \\u0639\\u0627\\u06cc\\u0642", "gsm": 360, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0634\\u0648\\u06cc\\u0646\\u062f\\u0647 \\u0645\\u062e\\u0635\\u0648\\u0635 \\u067e\\u0634\\u0645 \\u0648 \\u0622\\u0628 \\u0648\\u0644\\u0631\\u0645\\u060c \\u067e\\u0647\\u0646 \\u06a9\\u0631\\u062f\\u0646 \\u0627\\u0641\\u0642\\u06cc \\u0628\\u0631\\u0627\\u06cc \\u062e\\u0634\\u06a9 \\u0634\\u062f\\u0646"}	۵۵٪ پشم مرینوس، ۲۵٪ آلپاکا لطیف، ۲۰٪ پلی‌آمید عایق	360	4	5	5	f	4.9	45	["XS", "S", "M", "L"]	["XS", "S", "M", "L"]	[{"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	28500000
ژاکت جلو باز بافت کشمیر	cashmere-open-front-cardigan	کاردیگان جلو باز لوکس بافته‌شده از پشم کشمیر سبک و دستچین مغولستان. بافت متراکم ریز و آستین‌های افتاده کلوش که به‌زیبایی روی بدن می‌نشیند و انتخابی همیشگی برای پاییز است.	ad00774e-41e2-452f-bde1-249edf7bfdd5	[{"id": 601, "url": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80", "alt": "ژاکت جلو باز بافت کشمیر شنی نچرال", "kind": "photo", "position": 1}]	29800000	t	STANDARD	19d0140a-b3a6-4762-b493-98212f012859	2026-10-13 01:18:49.161273+03:30	2026-10-13 01:18:49.161275+03:30	6	massimo-dutti	apparel	fall-1405	جدید	calm	جلوباز و بدون دکمه؛ مناسب استایل روی شومیز کارن و تاپ‌های بیسیک.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u06a9\\u0634\\u0645\\u06cc\\u0631 \\u0627\\u0635\\u06cc\\u0644 \\u06af\\u0631\\u06cc\\u062f A", "gsm": 290, "care": "\\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u062e\\u0635\\u0635\\u06cc\\u061b \\u0646\\u06af\\u0647\\u062f\\u0627\\u0631\\u06cc \\u062f\\u0631 \\u06a9\\u0627\\u0648\\u0631 \\u067e\\u0627\\u0631\\u0686\\u0647\\u200c\\u0627\\u06cc \\u0628\\u0627 \\u0633\\u062f\\u0631 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0636\\u062f \\u0628\\u06cc\\u062f"}	۱۰۰٪ کشمیر اصیل گرید A	290	4	5	5	f	5	29	["S", "M", "L", "XL"]	["S", "M", "L", "XL"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	34500000
پلیور بافت ژاکارد بوکله	boucle-jacquard-knit-pullover	پلیور بافت با تکنیک ژاکارد و نخ‌های گره‌دار بوکله که حسی سه‌بعدی و بافتی غنی به محصول بخشیده‌اند. لبه‌های یقه و آستین با کشباف پهن ۵ سانتی‌متری برای ایستایی شکیل‌تر.	ad00774e-41e2-452f-bde1-249edf7bfdd5	[{"id": 701, "url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", "alt": "پلیور بافت ژاکارد بوکله خاک رس", "kind": "photo", "position": 1}]	22800000	t	STANDARD	a63eba73-3991-4e6d-aabd-00c64f9b42f6	2026-10-13 01:18:49.164261+03:30	2026-10-13 01:18:49.164263+03:30	7	keras-atelier	apparel	winter-1405	\N	move	سیلوئت فرم‌دار و محکم؛ گرمای بسیار بالا مناسب هوای سرد زمستان.	{"composition": "\\u06f6\\u06f0\\u066a \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u067e\\u0634\\u0645 \\u062a\\u0631\\u06a9\\u06cc\\u0628\\u06cc \\u0628\\u0648\\u06a9\\u0644\\u0647\\u060c \\u06f3\\u06f0\\u066a \\u0627\\u06a9\\u0631\\u06cc\\u0644\\u06cc\\u06a9 \\u067e\\u0631\\u06cc\\u0645\\u06cc\\u0648\\u0645\\u060c \\u06f1\\u06f0\\u066a \\u0646\\u062e \\u0648\\u06cc\\u0633\\u06a9\\u0648\\u0632", "gsm": 380, "care": "\\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u0648\\u0635\\u06cc\\u0647 \\u0645\\u06cc\\u200c\\u0634\\u0648\\u062f\\u061b \\u062f\\u0648\\u0631 \\u0627\\u0632 \\u0627\\u0634\\u0639\\u0647 \\u0645\\u0633\\u062a\\u0642\\u06cc\\u0645 \\u062e\\u0648\\u0631\\u0634\\u06cc\\u062f \\u062e\\u0634\\u06a9 \\u0634\\u0648\\u062f"}	۶۰٪ الیاف پشم ترکیبی بوکله، ۳۰٪ اکریلیک پریمیوم، ۱۰٪ نخ ویسکوز	380	3	4	5	f	4.8	16	["S", "M", "L"]	["S", "M", "L"]	[{"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	26500000
کراپ بافت پاییزه	autumn-cropped-knit-sweater	کراپ پلیور سبک مناسب روزهای خنک اوایل پاییز. دارای یقه گرد کلاسیک و بافت جناغی متراکم که همگام با دامن یا شلوارهای فاق بلند، ترکیب مدرن و کشیده‌ای ایجاد می‌کند.	ad00774e-41e2-452f-bde1-249edf7bfdd5	[{"id": 801, "url": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80", "alt": "کراپ بافت پاییزه رز کراس", "kind": "photo", "position": 1}]	17200000	t	STANDARD	0bdefa77-526b-4ef7-8368-36d1e36e411d	2026-10-13 01:18:49.167231+03:30	2026-10-13 01:18:49.167234+03:30	8	zara	apparel	fall-1405	\N	move	قد کراپ تا خط ناف؛ تن‌خور اندامی و متناسب.	{"composition": "\\u06f7\\u06f0\\u066a \\u0646\\u062e \\u067e\\u0646\\u0628\\u0647 \\u0627\\u0631\\u06af\\u0627\\u0646\\u06cc\\u06a9 \\u062a\\u0646\\u0641\\u0633\\u200c\\u067e\\u0630\\u06cc\\u0631\\u060c \\u06f3\\u06f0\\u066a \\u067e\\u0634\\u0645 \\u067e\\u0648\\u0644\\u06cc\\u0634\\u200c\\u0634\\u062f\\u0647 \\u0633\\u0628\\u06a9", "gsm": 260, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648 \\u062f\\u0631 \\u0645\\u0627\\u0634\\u06cc\\u0646 \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u062f\\u0648\\u0631 \\u067e\\u0634\\u0645\\u060c \\u0628\\u062f\\u0648\\u0646 \\u0686\\u0644\\u0627\\u0646\\u062f\\u0646"}	۷۰٪ نخ پنبه ارگانیک تنفس‌پذیر، ۳۰٪ پشم پولیش‌شده سبک	260	4	5	5	f	4.7	28	["XS", "S", "M", "L"]	["XS", "S", "M", "L"]	[{"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	19800000
پالتو فوتر پشمی بلند آستردار	long-lined-wool-fouter-coat	شاهکار زمستانه کاتالوگ کراس با پارچه فوتر مرینوس ضخیم کوبیده‌شده ایتالیایی. آسترکشی کامل با ساتن ابریشمی اعلا، یقه‌های بلیزر پهن و کمربند پهن فوتر همرنگ که زیبایی بی‌نقصی به اندام می‌بخشد.	f4f795b3-44e9-4499-a40a-1cda2a9daacc	[{"id": 901, "url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80", "alt": "پالتو فوتر پشمی بلند آستردار مشکی موکا", "kind": "photo", "position": 1}]	46500000	t	STANDARD	1723d77e-09ad-4856-8142-aac3950cb094	2026-10-13 01:18:49.170229+03:30	2026-10-13 01:18:49.170232+03:30	9	toteme	apparel	winter-1405	\N	move	قد ماکسی تا زیر زانو؛ الگوسازی ارگونومیک با آستین‌های افتاده شیک.	{"composition": "\\u06f8\\u06f0\\u066a \\u067e\\u0634\\u0645 \\u0641\\u0648\\u062a\\u0631 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633\\u060c \\u06f2\\u06f0\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0622\\u0645\\u06cc\\u062f \\u062a\\u0642\\u0648\\u06cc\\u062a\\u06cc \\u0636\\u062f \\u067e\\u0631\\u0632\\u062f\\u0647\\u06cc", "gsm": 520, "care": "\\u0641\\u0642\\u0637 \\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u062e\\u0635\\u0635\\u06cc \\u0628\\u0627 \\u0628\\u062e\\u0627\\u0631 \\u0633\\u0631\\u062f\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u0641\\u0642\\u0637 \\u0627\\u0632 \\u067e\\u0634\\u062a \\u0628\\u0627 \\u067e\\u0627\\u0631\\u0686\\u0647 \\u0645\\u062d\\u0627\\u0641\\u0638"}	۸۰٪ پشم فوتر طبیعی مرینوس، ۲۰٪ پلی‌آمید تقویتی ضد پرزدهی	520	1	4	5	f	5	52	["S", "M", "L", "XL"]	["S", "M", "L", "XL"]	[{"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	52000000
کاپشن کراپ اورسایز بادگیر	cropped-oversized-windbreaker-jacket	کاپشن مدرن سبک با روکش مات نایلون آبگریز و لایه‌بندی پفکی ضد باد. گت کشسان در لبه پایینی برای تنظیم حجم کاپشن، زیپ‌های دندانه درشت فلزی و جیب‌های فلیس‌دار گرم برای روزهای بارانی پاییز.	f4f795b3-44e9-4499-a40a-1cda2a9daacc	[{"id": 1001, "url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", "alt": "کاپشن کراپ اورسایز بادگیر سبز مریم‌گلی", "kind": "photo", "position": 1}]	32500000	t	STANDARD	6f69c1fb-a76f-4b76-beb5-14b12a443a99	2026-10-13 01:18:49.173277+03:30	2026-10-13 01:18:49.17328+03:30	10	zara	apparel	fall-1405	جدید	move	کراپ اورسایز حجیم؛ ظاهری اسپرت و های‌استریت بسیار جوان‌پسند.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0622\\u0645\\u06cc\\u062f \\u0622\\u0628\\u06af\\u0631\\u06cc\\u0632 \\u0628\\u0627 \\u063a\\u0634\\u0627\\u06cc \\u062a\\u0646\\u0641\\u0633\\u200c\\u067e\\u0630\\u06cc\\u0631 \\u062a\\u0646\\u0647\\u200c\\u067e\\u0648\\u0634 \\u0648 \\u067e\\u0631 \\u0645\\u0635\\u0646\\u0648\\u0639\\u06cc \\u0639\\u0627\\u06cc\\u0642", "gsm": 310, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0645\\u0627\\u0634\\u06cc\\u0646\\u06cc \\u062f\\u0631 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u0628\\u062f\\u0648\\u0646 \\u0646\\u0631\\u0645\\u200c\\u06a9\\u0646\\u0646\\u062f\\u0647\\u060c \\u062e\\u0634\\u06a9 \\u0634\\u062f\\u0646 \\u062f\\u0648\\u0631 \\u0627\\u0632 \\u062d\\u0631\\u0627\\u0631\\u062a \\u0645\\u0633\\u062a\\u0642\\u06cc\\u0645"}	۱۰۰٪ پلی‌آمید آبگریز با غشای تنفس‌پذیر تنه‌پوش و پر مصنوعی عایق	310	1	4	5	f	4.8	34	["XS", "S", "M", "L"]	["XS", "S", "M", "L"]	[{"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	37500000
ترنچ کت بارانی پاییزه دو ردیف دکمه	double-breasted-autumn-trench-coat	ترنچ کت کلاسیک بارانی با دو ردیف دکمه شاخی اصیل و کمربند سگک‌دار. دوخته‌شده از گاباردین کتان مقاوم در برابر باران همراه با چاک بلند پشت برای وقار و راحتی گام برداشتن در خیابان‌های باران‌خورده پاییز.	f4f795b3-44e9-4499-a40a-1cda2a9daacc	[{"id": 1101, "url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80", "alt": "ترنچ کت بارانی پاییزه دو ردیف دکمه شنی نچرال", "kind": "photo", "position": 1}]	39500000	t	STANDARD	deeedbb9-f3d1-4421-9508-67de417fd1e0	2026-10-13 01:18:49.176286+03:30	2026-10-13 01:18:49.176289+03:30	11	massimo-dutti	apparel	fall-1405	\N	calm	برش بلند کلاسیک تا ساق پا؛ قابلیت تنظیم فرم با کمربند.	{"composition": "\\u06f6\\u06f5\\u066a \\u06af\\u0627\\u0628\\u0627\\u0631\\u062f\\u06cc\\u0646 \\u067e\\u0646\\u0628\\u0647 \\u06a9\\u062a\\u0627\\u0646 \\u0636\\u062f\\u0622\\u0628\\u060c \\u06f3\\u06f5\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0627\\u0633\\u062a\\u0631 \\u0645\\u0642\\u0627\\u0648\\u0645 \\u062f\\u0631 \\u0628\\u0631\\u0627\\u0628\\u0631 \\u0686\\u0631\\u0648\\u06a9", "gsm": 340, "care": "\\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u062e\\u0635\\u0635\\u06cc \\u06a9\\u062a \\u0648 \\u0628\\u0627\\u0631\\u0627\\u0646\\u06cc\\u061b \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u0628\\u062e\\u0627\\u0631 \\u063a\\u06cc\\u0631\\u0645\\u0633\\u062a\\u0642\\u06cc\\u0645"}	۶۵٪ گاباردین پنبه کتان ضدآب، ۳۵٪ پلی‌استر مقاوم در برابر چروک	340	1	4	5	f	4.9	41	["S", "M", "L", "XL"]	["S", "M", "L", "XL"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	45000000
شلوار واید لینن پاییزه	autumn-wide-leg-linen-pants	شلوار واید بگ شیک با فاق بلند ارگونومیک و پیلی‌های دوبل جلوی کمر. بافته‌شده از لینن سنگین پاییزی با ریزش سنگین و ایستایی بی‌نظیر که هم با کفش لوفر و هم با بوت‌های پاییزی هماهنگی کامل دارد.	80c0f0d2-4490-4a14-a4c7-cb0909bfa91e	[{"id": 1201, "url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80", "alt": "شلوار واید لینن پاییزه شنی نچرال", "kind": "photo", "position": 1}]	18900000	t	STANDARD	53e9878c-42ca-40d6-977d-2c2edee9caee	2026-10-13 01:18:49.179166+03:30	2026-10-13 01:18:49.179168+03:30	12	keras-atelier	apparel	fall-1405	جدید	calm	فاق بلند و دمپا گشاد؛ قد بلند جهت نمایش بهتر فرم بدن.	{"composition": "\\u06f8\\u06f5\\u066a \\u0644\\u06cc\\u0646\\u0646 \\u06af\\u0631\\u06cc\\u062f \\u06cc\\u06a9 \\u067e\\u0627\\u06cc\\u06cc\\u0632\\u0647\\u060c \\u06f1\\u06f5\\u066a \\u0648\\u06cc\\u0633\\u06a9\\u0648\\u0632 \\u0636\\u062f \\u0686\\u0631\\u0648\\u06a9", "gsm": 270, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u062f\\u0631 \\u062d\\u0627\\u0644\\u062a \\u0645\\u0631\\u0637\\u0648\\u0628 \\u0628\\u0627 \\u0628\\u062e\\u0627\\u0631"}	۸۵٪ لینن گرید یک پاییزه، ۱۵٪ ویسکوز ضد چروک	270	2	4	5	t	4.8	37	["XS", "S", "M", "L", "XL"]	["XS", "S", "M", "L", "XL"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	22000000
شلوار راسته فاستونی پشمی	wool-worsted-straight-trousers	شلوار رسمی راسته دوخته‌شده از پارچه فاستونی پشمی با خط اتوی دائمی استخوان‌دار. دارای آسترکشی ضد خارش در قسمت ران و زانو برای تضمین راحتی بی‌پایان در تمام طول ساعات کاری زمستانه.	80c0f0d2-4490-4a14-a4c7-cb0909bfa91e	[{"id": 1301, "url": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80", "alt": "شلوار راسته فاستونی پشمی مشکی موکا", "kind": "photo", "position": 1}]	23500000	t	STANDARD	5387d20a-7dec-445d-9862-b8f544d944b2	2026-10-13 01:18:49.181997+03:30	2026-10-13 01:18:49.181999+03:30	13	cos	apparel	winter-1405	\N	move	راسته کلاسیک؛ خط اتوی کشیده که قد پاها را بلندتر نشان می‌دهد.	{"composition": "\\u06f7\\u06f0\\u066a \\u067e\\u0634\\u0645 \\u062e\\u0627\\u0644\\u0635 \\u0641\\u0627\\u0633\\u062a\\u0648\\u0646\\u06cc \\u0638\\u0631\\u06cc\\u0641\\u060c \\u06f2\\u06f8\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0627\\u0633\\u062a\\u0631 \\u0636\\u062f \\u0686\\u0631\\u0648\\u06a9\\u060c \\u06f2\\u066a \\u0644\\u0627\\u06cc\\u06a9\\u0631\\u0627", "gsm": 320, "care": "\\u0641\\u0642\\u0637 \\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u062e\\u0635\\u0635\\u06cc \\u0634\\u0644\\u0648\\u0627\\u0631 \\u0627\\u062f\\u0627\\u0631\\u06cc"}	۷۰٪ پشم خالص فاستونی ظریف، ۲۸٪ پلی‌استر ضد چروک، ۲٪ لایکرا	320	2	4	5	f	4.9	26	["S", "M", "L", "XL"]	["S", "M", "L", "XL"]	[{"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}]	{"S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	27000000
شلوار جاگر پنبه‌ای سنگشور	stonewashed-cotton-jogger-pants	جاگر راحت و لوکس طراحی‌شده از دورس پنبه‌ای دو نخ با افکت سنگشور وینتیج. دارای کمر کشباف عریض و بند تنظیم کتان ضخیم، ایده‌آل برای استایل اسمارکت‌کژوال و سفرهای هوایی.	80c0f0d2-4490-4a14-a4c7-cb0909bfa91e	[{"id": 1401, "url": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80", "alt": "شلوار جاگر پنبه‌ای سنگشور خاک رس", "kind": "photo", "position": 1}]	15800000	t	STANDARD	5bf8f886-c048-47f3-903e-2667e9929a40	2026-10-13 01:18:49.184853+03:30	2026-10-13 01:18:49.184855+03:30	14	mango	apparel	spring-1406	پیش‌نمایش	calm	تن‌خور نرمال و ریلکس؛ دمپای کشباف نرم بدون رد انداختن روی مچ.	{"composition": "\\u06f9\\u06f5\\u066a \\u067e\\u0646\\u0628\\u0647 \\u062f\\u0648\\u0631\\u0633 \\u0633\\u0646\\u06af\\u0634\\u0648\\u0631 \\u0627\\u0631\\u06af\\u0627\\u0646\\u06cc\\u06a9\\u060c \\u06f5\\u066a \\u0627\\u0644\\u0627\\u0633\\u062a\\u06cc\\u0646 \\u06a9\\u0634\\u0633\\u0627\\u0646\\u06cc", "gsm": 290, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0645\\u0627\\u0634\\u06cc\\u0646\\u06cc \\u062f\\u0631 \\u0622\\u0628 \\u0648\\u0644\\u0631\\u0645 \\u06f3\\u06f0 \\u062f\\u0631\\u062c\\u0647 \\u0628\\u0627 \\u0645\\u0627\\u06cc\\u0639 \\u0644\\u0628\\u0627\\u0633\\u200c\\u0647\\u0627\\u06cc \\u062a\\u06cc\\u0631\\u0647"}	۹۵٪ پنبه دورس سنگشور ارگانیک، ۵٪ الاستین کشسانی	290	4	5	5	f	4.8	30	["XS", "S", "M", "L", "XL"]	["XS", "S", "M", "L", "XL"]	[{"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	18500000
تیشرت نخی پنبه سوپر شانه	super-combed-cotton-minimal-tee	تیشرت بیسیک ادیتوریال تهیه شده از الیاف پنبه شانه شده ۱۰۰٪ خالص. یقه گرد تقویت‌شده که پس از بارها شست‌وشو دفرمه نمی‌شود و تراکم عالی که حس سبکی و لطافت بدون پرزدهی به همراه دارد.	e127ee50-17ed-4758-83cb-373031d6af1d	[{"id": 1501, "url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80", "alt": "تیشرت نخی پنبه سوپر شانه عاجی روشن", "kind": "photo", "position": 1}]	8900000	t	STANDARD	aa4d61ac-be05-4008-9d72-bbfa9ee36f3f	2026-10-13 01:18:49.187564+03:30	2026-10-13 01:18:49.187566+03:30	15	cos	apparel	summer-1405	حراج	calm	فیت ریلکس استاندارد؛ طراحی شده برای تمام فصول.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u067e\\u0646\\u0628\\u0647 \\u0633\\u0648\\u067e\\u0631 \\u0634\\u0627\\u0646\\u0647 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u06a9\\u0627\\u0645\\u0628 \\u0628\\u0627 \\u0641\\u0631\\u0622\\u06cc\\u0646\\u062f \\u0633\\u06cc\\u0644\\u06cc\\u06a9\\u0648\\u0646\\u06cc", "gsm": 180, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0645\\u0639\\u0645\\u0648\\u0644\\u06cc \\u062f\\u0631 \\u0645\\u0627\\u0634\\u06cc\\u0646 \\u062a\\u0627 \\u06f4\\u06f0 \\u062f\\u0631\\u062c\\u0647\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u0622\\u0633\\u0627\\u0646"}	۱۰۰٪ پنبه سوپر شانه طبیعی کامب با فرآیند سیلیکونی	180	3	5	5	f	4.9	48	["XS", "S", "M", "L", "XL"]	["XS", "S", "M", "L", "XL"]	[{"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}, "XL": {"height": [168, 182], "weight": [75, 88], "waist": [83, 94], "hip": [108, 118]}}	["yoga", "daily"]	11500000
بادی کبریتی آستین بلند	long-sleeve-ribbed-contour-body	بادی آستین‌بلند فرم‌دهنده با بافت ریزکبریتی کشسان. دارای قفل دو دکمه مقاوم زیر فاق و برش ارگونومیک گردن که به عنوان لایه اول (Base Layer) زیر کت، پالتو یا کاردیگان عملکرد فوق‌العاده‌ای دارد.	e127ee50-17ed-4758-83cb-373031d6af1d	[{"id": 1601, "url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80", "alt": "بادی کبریتی آستین بلند خاک رس", "kind": "photo", "position": 1}]	11800000	t	STANDARD	37d8ec2a-4394-479b-aa57-9b88b15f2210	2026-10-13 01:18:49.190539+03:30	2026-10-13 01:18:49.190542+03:30	16	zara	apparel	spring-1406	پیش‌نمایش	move	کاملاً جذب و کانتورینگ؛ فرم بدن را به صورت یکدست جمع می‌کند.	{"composition": "\\u06f9\\u06f2\\u066a \\u0648\\u06cc\\u0633\\u06a9\\u0648\\u0632 \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u06af\\u06cc\\u0627\\u0647\\u06cc\\u060c \\u06f8\\u066a \\u0627\\u0644\\u0627\\u0633\\u062a\\u06cc\\u0646 \\u0628\\u0627 \\u06a9\\u0634\\u0633\\u0627\\u0646\\u06cc \\u06f4 \\u062c\\u0647\\u062a\\u0647", "gsm": 230, "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648 \\u062f\\u0631 \\u0645\\u0627\\u0634\\u06cc\\u0646 \\u0628\\u0627 \\u06a9\\u06cc\\u0633\\u0647 \\u0645\\u062d\\u0627\\u0641\\u0638 \\u0644\\u0628\\u0627\\u0633 \\u0632\\u06cc\\u0631 \\u062f\\u0631 \\u062f\\u0645\\u0627\\u06cc \\u06f3\\u06f0 \\u062f\\u0631\\u062c\\u0647"}	۹۲٪ ویسکوز الیاف طبیعی گیاهی، ۸٪ الاستین با کشسانی ۴ جهته	230	5	5	5	f	4.8	39	["XS", "S", "M", "L"]	["XS", "S", "M", "L"]	[{"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	{"XS": {"height": [155, 165], "weight": [45, 52], "waist": [60, 66], "hip": [86, 92]}, "S": {"height": [158, 168], "weight": [50, 60], "waist": [65, 72], "hip": [90, 98]}, "M": {"height": [162, 174], "weight": [58, 68], "waist": [70, 78], "hip": [96, 104]}, "L": {"height": [165, 178], "weight": [66, 78], "waist": [76, 85], "hip": [102, 110]}}	["yoga", "daily"]	13800000
اسکرانچی ابریشم طبیعی پالت پاییزه	natural-silk-autumn-scrunchie	اسکرانچی بسیار لطیف دوخته‌شده از ۱۰۰٪ ابریشم خالص مالبری ۲۲ مام. کش الاستیک بادوام داخلی بدون کشیدگی و شکستگی موها، با رنگ‌بندی گرم پاییزی که مکمل هر استایلی است.	215e21de-ddc4-4026-83d5-96e69fd834d1	[{"id": 1701, "url": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80", "alt": "اسکرانچی ابریشم طبیعی پالت پاییزه رز کراس", "kind": "photo", "position": 1}]	3800000	t	STANDARD	b50c60f2-13fa-456d-a628-2a6c98ffc7bd	2026-10-13 01:18:49.193648+03:30	2026-10-13 01:18:49.193651+03:30	17	keras-atelier	accessories	fall-1405	جدید	calm	سایز استاندارد بزرگ (قطر ۱۲ سانتی‌متر)؛ مناسب تمام حجم‌های مو.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u062a\\u0648\\u062a \\u0645\\u0627\\u0644\\u0628\\u0631\\u06cc \\u06af\\u0631\\u06cc\\u062f 6A \\u0628\\u0627 \\u0636\\u062e\\u0627\\u0645\\u062a \\u06f2\\u06f2 \\u0645\\u0627\\u0645", "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u0648 \\u0634\\u0627\\u0645\\u067e\\u0648\\u06cc \\u0645\\u0644\\u0627\\u06cc\\u0645 \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645"}	۱۰۰٪ ابریشم طبیعی توت مالبری گرید 6A با ضخامت ۲۲ مام	\N	5	5	5	f	5	42	["Free"]	["Free"]	[{"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}]	null	["yoga", "daily"]	4500000
گیره مو ارگانیک سلولز مدل لونا	luna-organic-cellulose-hair-clip	گیره پنجه‌ای باوقار ساخته شده از استات سلولز طبیعی و زیست‌تخریب‌پذیر فرانسوی. لولای استیل فنری با چسبندگی قوی که بدون سنگینی روی سر، موها را در تمام طول روز محکم نگه می‌دارد.	215e21de-ddc4-4026-83d5-96e69fd834d1	[{"id": 1801, "url": "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80", "alt": "گیره مو ارگانیک سلولز مدل لونا شنی نچرال", "kind": "photo", "position": 1}]	4900000	t	STANDARD	4d7c2827-df69-4084-976f-4534700ea4f7	2026-10-13 01:18:49.197004+03:30	2026-10-13 01:18:49.197007+03:30	18	mango	accessories	spring-1406	\N	move	طول ۱۰ سانتی‌متر؛ مناسب بستن کامل یا نیمه‌باز مو.	{"composition": "\\u0627\\u0633\\u062a\\u0627\\u062a \\u0633\\u0644\\u0648\\u0644\\u0632 \\u06af\\u06cc\\u0627\\u0647\\u06cc \\u0637\\u0628\\u06cc\\u0639\\u06cc \\u0628\\u0627 \\u0644\\u0648\\u0644\\u0627\\u06cc \\u0627\\u0633\\u062a\\u06cc\\u0644 \\u0641\\u0646\\u0631\\u06cc \\u0636\\u062f \\u0632\\u0646\\u06af", "care": "\\u067e\\u0627\\u06a9 \\u06a9\\u0631\\u062f\\u0646 \\u0628\\u0627 \\u062f\\u0633\\u062a\\u0645\\u0627\\u0644 \\u0645\\u06cc\\u06a9\\u0631\\u0648\\u0641\\u06cc\\u0628\\u0631 \\u0646\\u0631\\u0645 \\u0646\\u0645\\u200c\\u062f\\u0627\\u0631\\u061b \\u062f\\u0648\\u0631 \\u0627\\u0632 \\u062d\\u0631\\u0627\\u0631\\u062a \\u0645\\u0633\\u062a\\u0642\\u06cc\\u0645"}	استات سلولز گیاهی طبیعی با لولای استیل فنری ضد زنگ	\N	1	4	5	f	4.8	27	["Free"]	["Free"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}]	null	["yoga", "daily"]	5800000
کش موی بافت پشمی ست	wool-knit-hair-tie-trio-set	ست سه‌تایی کش موی بافت پشمی دست‌دوز با پالت زمستانه کراس. ساخته‌شده از الیاف نرم مرینوس با کش داخلی دوبل که موها را گرم و منسجم در استایل‌های زمستانی در بر می‌گیرد.	215e21de-ddc4-4026-83d5-96e69fd834d1	[{"id": 1901, "url": "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80", "alt": "کش موی بافت پشمی ست خاک رس و عاجی", "kind": "photo", "position": 1}]	4200000	t	STANDARD	6e80fb33-4e1b-4880-af52-eb519c0078be	2026-10-13 01:18:49.20004+03:30	2026-10-13 01:18:49.200042+03:30	19	toteme	accessories	winter-1405	\N	calm	ست ۳ عددی در بسته‌بندی هدیه دوستدار محیط‌زیست.	{"composition": "\\u06f8\\u06f0\\u066a \\u067e\\u0634\\u0645 \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633 \\u0627\\u0631\\u06af\\u0627\\u0646\\u06cc\\u06a9\\u060c \\u06f2\\u06f0\\u066a \\u06a9\\u0634 \\u0627\\u0644\\u0627\\u0633\\u062a\\u06cc\\u06a9 \\u062a\\u0642\\u0648\\u06cc\\u062a\\u06cc", "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u0628\\u062f\\u0648\\u0646 \\u0686\\u0644\\u0627\\u0646\\u062f\\u0646"}	۸۰٪ پشم مرینوس ارگانیک، ۲۰٪ کش الاستیک تقویتی	\N	4	5	5	f	4.7	18	["Free"]	["Free"]	[{"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}, {"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	null	["yoga", "daily"]	4900000
دستمال سر ژاکارد نخ پنبه	cotton-jacquard-bandana	دستمال سر چهارگوش ۵۵×۵۵ سانتی‌متر با بافت ژاکارد اختصاصی نقوش انتزاعی طبیعت. دوخته‌شده از نخ پنبه خالص با حاشیه دست‌دوز دور که هم به عنوان دستمال گردن و هم به عنوان باندانا کاربرد دارد.	a0b99b31-338e-4b12-9ebf-c01c34e877d9	[{"id": 2001, "url": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80", "alt": "دستمال سر ژاکارد نخ پنبه سبز مریم‌گلی", "kind": "photo", "position": 1}]	5200000	t	STANDARD	d597440c-95b2-4b50-bf7a-6ea1b8c9ceaa	2026-10-13 01:18:49.202974+03:30	2026-10-13 01:18:49.202976+03:30	20	zara	accessories	fall-1405	جدید	calm	ابعاد ۵۵ در ۵۵ سانتی‌متر؛ امکان گره‌زدن در استایل‌های متنوع سر و گردن.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0646\\u062e \\u067e\\u0646\\u0628\\u0647 \\u0627\\u0631\\u06af\\u0627\\u0646\\u06cc\\u06a9 \\u0698\\u0627\\u06a9\\u0627\\u0631\\u062f \\u0628\\u0627 \\u0631\\u0646\\u06af\\u0631\\u0632\\u06cc \\u06af\\u06cc\\u0627\\u0647\\u06cc \\u067e\\u0627\\u06cc\\u062f\\u0627\\u0631", "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u0645\\u0644\\u0627\\u06cc\\u0645"}	۱۰۰٪ نخ پنبه ارگانیک ژاکارد با رنگرزی گیاهی پایدار	\N	1	5	5	f	4.9	33	["Free"]	["Free"]	[{"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}]	null	["yoga", "daily"]	6200000
باندانا ساتن طرح ژئومتریک	geometric-satin-bandana	باندانا ساتن براق مات با الگوهای هندسی مینیمال الهام‌گرفته از معماری مدرن. سطح ابریشمی بدون سرخوردن روی موها با لبه‌های لول‌شده دست‌دوز که اکسسوری تمام‌عیار کژوال است.	a0b99b31-338e-4b12-9ebf-c01c34e877d9	[{"id": 2101, "url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80", "alt": "باندانا ساتن طرح ژئومتریک رز کراس", "kind": "photo", "position": 1}]	4600000	t	STANDARD	f1857321-82ff-4b7a-84a1-90a06fd69d62	2026-10-13 01:18:49.20654+03:30	2026-10-13 01:18:49.206542+03:30	21	mango	accessories	summer-1405	حراج	move	ابعاد ۶۰ در ۶۰ سانتی‌متر؛ درخشش ملایم زیر نور خورشید.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0633\\u0627\\u062a\\u0646 \\u067e\\u0644\\u06cc\\u200c\\u0627\\u0633\\u062a\\u0631 \\u0645\\u06cc\\u06a9\\u0631\\u0648\\u0641\\u06cc\\u0628\\u0631 \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645\\u06cc \\u0628\\u0633\\u06cc\\u0627\\u0631 \\u0644\\u063a\\u0632\\u0627\\u0646 \\u0648 \\u0644\\u0637\\u06cc\\u0641", "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f \\u0628\\u062f\\u0648\\u0646 \\u067e\\u06cc\\u0686\\u0634\\u060c \\u0627\\u062a\\u0648\\u06a9\\u0634\\u06cc \\u067e\\u0634\\u062a \\u067e\\u0627\\u0631\\u0686\\u0647"}	۱۰۰٪ ساتن پلی‌استر میکروفیبر ابریشمی بسیار لغزان و لطیف	\N	1	5	5	f	4.6	24	["Free"]	["Free"]	[{"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}]	null	["yoga", "daily"]	5900000
دستمال سر طرح‌دار خنثی	neutral-patterned-cotton-bandana	دستمال سر سبک پنبه‌ای چاپ چوب با رنگدانه‌های گیاهی و پالت خنثی شنی و رسی. بسیار خنک و سبک که می‌تواند دور مو، دور مچ دست یا دور بند کیف بسته شود.	a0b99b31-338e-4b12-9ebf-c01c34e877d9	[{"id": 2201, "url": "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=800&q=80", "alt": "دستمال سر طرح‌دار خنثی شنی نچرال", "kind": "photo", "position": 1}]	4400000	t	STANDARD	40edf940-a806-4eed-abe6-c883ed3b4d73	2026-10-13 01:18:49.209356+03:30	2026-10-13 01:18:49.209358+03:30	22	cos	accessories	summer-1405	حراج	calm	ابعاد ۵۰ در ۵۰ سانتی‌متر؛ استایل بوهو مینیمال.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0686\\u06cc\\u062a \\u067e\\u0646\\u0628\\u0647 \\u0647\\u0646\\u062f\\u06cc \\u0641\\u0648\\u0642 \\u0633\\u0628\\u06a9 \\u0648 \\u062a\\u0646\\u0641\\u0633\\u200c\\u067e\\u0630\\u06cc\\u0631", "care": "\\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0622\\u0628 \\u062e\\u0646\\u06a9 \\u0648 \\u0635\\u0627\\u0628\\u0648\\u0646 \\u0632\\u06cc\\u062a\\u0648\\u0646"}	۱۰۰٪ چیت پنبه هندی فوق سبک و تنفس‌پذیر	\N	1	5	4	f	4.7	20	["Free"]	["Free"]	[{"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}]	null	["yoga", "daily"]	5500000
اسکارف مینی ابریشمی دور دست‌دوز	hand-rolled-silk-mini-scarf	اسکارف مینی فاخر فرانسوی دوخته‌شده از ابریشم خالص توییل ۱۴ مام با حاشیه‌های اصیل رول‌شده دست‌دوز (Hand-rolled hem). مناسب گره زدن فرانسوی دور گردن یا تزیین مو در روزهای دلپذیر بهار.	f99978d8-007a-4107-9f49-233f8a270f57	[{"id": 2301, "url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80", "alt": "اسکارف مینی ابریشمی دور دست‌دوز عاجی روشن", "kind": "photo", "position": 1}]	8900000	t	STANDARD	5a35b5ab-84dd-41c4-8d6a-60e74f9bc698	2026-10-13 01:18:49.212203+03:30	2026-10-13 01:18:49.212205+03:30	23	toteme	accessories	spring-1406	پیش‌نمایش	move	ابعاد ۷۰ در ۷۰ سانتی‌متر؛ افتادگی برازنده و شیک دور گردن.	{"composition": "\\u06f1\\u06f0\\u06f0\\u066a \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u062a\\u0648\\u06cc\\u06cc\\u0644 \\u062e\\u0627\\u0644\\u0635 \\u0628\\u0627 \\u067e\\u0631\\u062f\\u0627\\u062e\\u062a \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645\\u06cc \\u06a9\\u0644\\u0627\\u0633\\u06cc\\u06a9", "care": "\\u0641\\u0642\\u0637 \\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u062a\\u062e\\u0635\\u0635\\u06cc \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u06cc\\u0627 \\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u0641\\u0648\\u0642 \\u062d\\u0633\\u0627\\u0633 \\u0628\\u0627 \\u0622\\u0628 \\u0633\\u0631\\u062f"}	۱۰۰٪ ابریشم توییل خالص با پرداخت ابریشمی کلاسیک	\N	1	5	5	f	5	36	["Free"]	["Free"]	[{"name": "\\u0639\\u0627\\u062c\\u06cc \\u0631\\u0648\\u0634\\u0646", "hex": "#FBF6F1"}, {"name": "\\u0631\\u0632 \\u06a9\\u0631\\u0627\\u0633", "hex": "#B8475F"}, {"name": "\\u0633\\u0628\\u0632 \\u0645\\u0631\\u06cc\\u0645\\u200c\\u06af\\u0644\\u06cc", "hex": "#56705B"}]	null	["yoga", "daily"]	10500000
شال بلند پشمی بافت ضخیم	thick-knit-wool-long-scarf	شال پشمی قواره بزرگ ۲۰۰×۴۰ سانتی‌متر با بافت حجیم تیغ‌ماهی و ریشه‌های بلند تابیده شده. عایق بسیار قوی در برابر باد و سرمای استخوان‌سوز زمستان که گرمابخش‌ترین همسفر پالتوهای فوتر است.	f99978d8-007a-4107-9f49-233f8a270f57	[{"id": 2401, "url": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80", "alt": "شال بلند پشمی بافت ضخیم مشکی موکا", "kind": "photo", "position": 1}]	13500000	t	STANDARD	d34eb3d3-4ae8-4f2f-aaa6-a9ed7b9af933	2026-10-13 01:18:49.214969+03:30	2026-10-13 01:18:49.214971+03:30	24	massimo-dutti	accessories	winter-1405	\N	calm	طول ۲ متر در عرض ۴۰ سانتی‌متر؛ امکان چند دور پیچیدن دور گردن.	{"composition": "\\u06f8\\u06f5\\u066a \\u067e\\u0634\\u0645 \\u0628\\u0631\\u0647 \\u0646\\u0631\\u0645 \\u06a9\\u0648\\u0647\\u0633\\u062a\\u0627\\u0646\\u06cc\\u060c \\u06f1\\u06f5\\u066a \\u067e\\u0644\\u06cc\\u200c\\u0622\\u0645\\u06cc\\u062f \\u0639\\u0627\\u06cc\\u0642 \\u0636\\u062f \\u0627\\u0641\\u062a\\u0627\\u062f\\u06af\\u06cc", "care": "\\u062e\\u0634\\u06a9\\u200c\\u0634\\u0648\\u06cc\\u06cc \\u06cc\\u0627 \\u0634\\u0633\\u062a\\u200c\\u0648\\u0634\\u0648\\u06cc \\u062f\\u0633\\u062a\\u06cc \\u0628\\u0627 \\u0634\\u0627\\u0645\\u067e\\u0648\\u06cc \\u067e\\u0634\\u0645 \\u0648 \\u0622\\u0628 \\u06f2\\u06f0 \\u062f\\u0631\\u062c\\u0647"}	۸۵٪ پشم بره نرم کوهستانی، ۱۵٪ پلی‌آمید عایق ضد افتادگی	\N	3	5	5	f	4.9	47	["Free"]	["Free"]	[{"name": "\\u0645\\u0634\\u06a9\\u06cc \\u0645\\u0648\\u06a9\\u0627", "hex": "#3B2F2C"}, {"name": "\\u0634\\u0646\\u06cc \\u0646\\u0686\\u0631\\u0627\\u0644", "hex": "#F1E7DC"}, {"name": "\\u062e\\u0627\\u06a9 \\u0631\\u0633", "hex": "#C98F78"}]	null	["yoga", "daily"]	15800000
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (key, value, description, id, created_at, updated_at) FROM stdin;
branding	{"brandNameFa": "\\u06a9\\u0631\\u0627\\u0633", "brandNameEn": "Keras", "tagline": "\\u0632\\u06cc\\u0628\\u0627\\u06cc\\u06cc \\u062f\\u0631 \\u0633\\u0627\\u062f\\u06af\\u06cc\\u060c \\u0622\\u0632\\u0627\\u062f\\u06cc \\u062f\\u0631 \\u062d\\u0631\\u06a9\\u062a", "subTagline": "\\u067e\\u0648\\u0634\\u0627\\u06a9 \\u062a\\u062e\\u0635\\u0635\\u06cc \\u062a\\u0645\\u0631\\u06cc\\u0646 \\u0648 \\u0631\\u0648\\u0632\\u0645\\u0631\\u0647 \\u0632\\u0646\\u0627\\u0646\\u0647", "logoUrl": "/logo.svg", "faviconUrl": "/favicon.ico", "metaDescription": "\\u067e\\u0648\\u0634\\u0627\\u06a9 \\u062a\\u062e\\u0635\\u0635\\u06cc \\u0632\\u0646\\u0627\\u0646\\u0647 \\u06a9\\u0631\\u0627\\u0633 - \\u0628\\u0627\\u0641\\u062a\\u200c\\u0647\\u0627\\u06cc \\u0628\\u062f\\u0648\\u0646 \\u062f\\u0631\\u0632\\u060c \\u0631\\u0627\\u062d\\u062a\\u06cc \\u0648 \\u0622\\u0632\\u0627\\u062f\\u06cc \\u062d\\u0631\\u06a9\\u062a"}	\N	48c4ade5-e1c3-40ed-bd2f-378b632e3eeb	2026-10-13 01:18:49.060011+03:30	2026-10-13 01:18:49.060015+03:30
contact	{"supportPhone": "\\u06f0\\u06f2\\u06f1-\\u06f8\\u06f8\\u06f8\\u06f8\\u06f4\\u06f4\\u06f2\\u06f2", "supportPhoneRaw": "02188884422", "inquiryMobile": "09120000000", "whatsappNumber": "09120000000", "officialEmail": "care@keras.ir", "atelierAddress": "\\u062a\\u0647\\u0631\\u0627\\u0646\\u060c \\u062c\\u0631\\u062f\\u0646\\u060c \\u062e\\u06cc\\u0627\\u0628\\u0627\\u0646 \\u0633\\u0639\\u06cc\\u062f\\u06cc\\u060c \\u067e\\u0644\\u0627\\u06a9 \\u06f2\\u06f4", "workingHours": "\\u0634\\u0646\\u0628\\u0647 \\u062a\\u0627 \\u067e\\u0646\\u062c\\u200c\\u0634\\u0646\\u0628\\u0647: \\u06f9 \\u0627\\u0644\\u06cc \\u06f1\\u06f8"}	\N	fdbae806-0e5b-4e28-b19d-d68b8a424c0d	2026-10-13 01:18:49.060028+03:30	2026-10-13 01:18:49.060029+03:30
shipping	{"freeShippingThreshold": 1500000, "flatShippingFee": 65000, "estimatedDispatchText": "\\u0627\\u0631\\u0633\\u0627\\u0644 \\u06f2 \\u062a\\u0627 \\u06f4 \\u0631\\u0648\\u0632 \\u06a9\\u0627\\u0631\\u06cc \\u0628\\u0627 \\u067e\\u0633\\u062a \\u067e\\u06cc\\u0634\\u062a\\u0627\\u0632 \\u0648 \\u062a\\u06cc\\u067e\\u0627\\u06a9\\u0633", "announcementBarText": "\\u0627\\u0631\\u0633\\u0627\\u0644 \\u0631\\u0627\\u06cc\\u06af\\u0627\\u0646 \\u0628\\u0631\\u0627\\u06cc \\u062a\\u0645\\u0627\\u0645 \\u0633\\u0641\\u0627\\u0631\\u0634\\u200c\\u0647\\u0627\\u06cc \\u0628\\u0627\\u0644\\u0627\\u06cc \\u06f1\\u066b\\u06f5\\u06f0\\u06f0\\u066b\\u06f0\\u06f0\\u06f0 \\u062a\\u0648\\u0645\\u0627\\u0646", "announcementBarHighlight": "\\u0636\\u0645\\u0627\\u0646\\u062a \\u062a\\u0639\\u0648\\u06cc\\u0636 \\u062a\\u0627 \\u06f7 \\u0631\\u0648\\u0632 \\u06a9\\u0627\\u0631\\u06cc", "announcementBarVisible": true}	\N	6b1f6e7b-6f5f-4531-ae62-4bff76de26c6	2026-10-13 01:18:49.060036+03:30	2026-10-13 01:18:49.060037+03:30
checkoutRules	{"minCartTotal": 100000, "maxItemQuantityPerCart": 5, "reservationTimeoutMinutes": 15, "returnPolicyDays": 7, "holidayModeEnabled": false, "holidayNoticeText": "\\u0641\\u0631\\u0648\\u0634\\u06af\\u0627\\u0647 \\u0645\\u0648\\u0642\\u062a\\u0627\\u064b \\u0628\\u0647 \\u062f\\u0644\\u06cc\\u0644 \\u062a\\u0639\\u0637\\u06cc\\u0644\\u0627\\u062a \\u0627\\u0631\\u0633\\u0627\\u0644 \\u0633\\u0641\\u0627\\u0631\\u0634\\u0627\\u062a \\u0631\\u0627 \\u0645\\u062a\\u0648\\u0642\\u0641 \\u06a9\\u0631\\u062f\\u0647 \\u0627\\u0633\\u062a."}	\N	1cf032b3-8eb5-4424-bece-e25d3eef3003	2026-10-13 01:18:49.060043+03:30	2026-10-13 01:18:49.060044+03:30
social	{"instagram": "https://instagram.com/keras.brand", "telegram": "https://t.me/kerasbrand", "pinterest": "https://pinterest.com/kerasbrand", "youtube": "https://youtube.com/@kerasbrand"}	\N	f92d9924-5851-4c7e-8502-209c643cef84	2026-10-13 01:18:49.060049+03:30	2026-10-13 01:18:49.06005+03:30
integrations	{"googleAnalyticsId": "G-KERAS2026", "googleTagManagerId": "GTM-KERAS01", "enamadCode": "12345678", "samandehiCode": "87654321", "smsProviderSender": "30007788", "smsProviderBalance": 125000}	\N	82aa0b29-6847-4d28-a97e-12275c48a1c2	2026-10-13 01:18:49.060056+03:30	2026-10-13 01:18:49.060056+03:30
homeHero	{"badgeText": "\\u0637\\u0631\\u0627\\u062d\\u06cc \\u0627\\u062e\\u062a\\u0635\\u0627\\u0635\\u06cc \\u2022 \\u062a\\u06cc\\u0631\\u0627\\u0698 \\u0645\\u062d\\u062f\\u0648\\u062f \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5", "titlePrefix": "\\u0627\\u0633\\u062a\\u0627\\u06cc\\u0644 \\u0645\\u0646\\u062d\\u0635\\u0631\\u0628\\u0647\\u200c\\u0641\\u0631\\u062f", "titleHighlight": "\\u067e\\u0627\\u06cc\\u06cc\\u0632", "titleSuffix": "\\u062e\\u0648\\u062f \\u0631\\u0627 \\u0628\\u0633\\u0627\\u0632\\u06cc\\u062f", "description": "\\u062a\\u0644\\u0641\\u06cc\\u0642 \\u067e\\u0627\\u0631\\u0686\\u0647\\u200c\\u0647\\u0627\\u06cc \\u0627\\u0644\\u06cc\\u0627\\u0641 \\u0637\\u0628\\u06cc\\u0639\\u06cc\\u060c \\u0628\\u0627\\u0641\\u062a\\u200c\\u0647\\u0627\\u06cc \\u0645\\u0631\\u06cc\\u0646\\u0648\\u0633 \\u0648 \\u0627\\u0628\\u0631\\u06cc\\u0634\\u0645 \\u062e\\u0627\\u0644\\u0635 \\u0628\\u0627 \\u0627\\u0644\\u06af\\u0648\\u0647\\u0627\\u06cc \\u0645\\u062f\\u0631\\u0646 \\u0628\\u0631\\u0627\\u06cc \\u0628\\u0627\\u0646\\u0648\\u0627\\u0646 \\u0622\\u06af\\u0627\\u0647.", "primaryCtaText": "\\u0645\\u0634\\u0627\\u0647\\u062f\\u0647 \\u06a9\\u0627\\u0644\\u06a9\\u0634\\u0646 \\u067e\\u0627\\u06cc\\u06cc\\u0632", "primaryCtaLink": "/shop?season=fall-1405", "secondaryCtaText": "\\u0627\\u06a9\\u0633\\u0633\\u0648\\u0631\\u06cc \\u0648 \\u0634\\u0627\\u0644\\u200c\\u0647\\u0627", "secondaryCtaLink": "/shop?division=accessories", "bottomBadgeText": "\\u06a9\\u0627\\u0644\\u06a9\\u0634\\u0646 \\u062f\\u0633\\u062a\\u200c\\u062f\\u0648\\u0632 \\u0627\\u0633\\u062a\\u0648\\u062f\\u06cc\\u0648 \\u06a9\\u0631\\u0627\\u0633 \\u2022 \\u0646\\u0633\\u062e\\u0647 \\u0645\\u062d\\u062f\\u0648\\u062f \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5", "imageUrl": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80", "imageAlt": "\\u0645\\u062f\\u0644 \\u06a9\\u0627\\u0644\\u06a9\\u0634\\u0646 \\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5 \\u06a9\\u0631\\u0627\\u0633 \\u0628\\u0627 \\u067e\\u0627\\u0644\\u062a\\u0648\\u06cc \\u067e\\u0634\\u0645\\u06cc \\u0648 \\u0628\\u0627\\u0641\\u062a \\u0644\\u0648\\u06a9\\u0633", "imageBadgeLabel": "\\u0637\\u0631\\u0627\\u062d\\u06cc \\u06a9\\u067e\\u0633\\u0648\\u0644\\u06cc", "imageBadgeValue": "\\u067e\\u0627\\u06cc\\u06cc\\u0632 \\u06f1\\u06f4\\u06f0\\u06f5 \\u2022 Fall Drop"}	\N	bfd0b1e3-24aa-4be8-b4eb-4689700ee4d7	2026-10-13 01:18:49.060062+03:30	2026-10-13 01:18:49.060062+03:30
\.


--
-- Data for Name: taxonomy_brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.taxonomy_brands (name, slug, logo_svg, is_featured, id, created_at, updated_at) FROM stdin;
Keras Atelier	keras-atelier	\N	t	6dcf848b-572f-4376-bcbd-d478df44a220	2026-10-13 01:18:49.100305+03:30	2026-10-13 01:18:49.100308+03:30
Totême	toteme	\N	t	c3e8bc47-a0a6-4474-9915-723511d0b056	2026-10-13 01:18:49.100316+03:30	2026-10-13 01:18:49.100317+03:30
Massimo Dutti	massimo-dutti	\N	t	e70912b2-e800-4483-8684-3344d8b983e6	2026-10-13 01:18:49.100323+03:30	2026-10-13 01:18:49.100324+03:30
COS	cos	\N	t	025ad6f3-d60a-4f52-ad53-5c21a3951349	2026-10-13 01:18:49.10033+03:30	2026-10-13 01:18:49.10033+03:30
Zara	zara	\N	t	28081a80-2796-4fcd-8420-dceeb95fd509	2026-10-13 01:18:49.100336+03:30	2026-10-13 01:18:49.100337+03:30
Mango	mango	\N	t	19470be5-5a23-4718-af77-56df51a4faf0	2026-10-13 01:18:49.100342+03:30	2026-10-13 01:18:49.100343+03:30
\.


--
-- Data for Name: taxonomy_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.taxonomy_categories (name, slug, division, icon_name, is_active, id, created_at, updated_at) FROM stdin;
شومیز و پیراهن	shirts-blouses	apparel	Shirt	t	0c5d2c01-5c7f-4bd1-81f3-1f5cccac80d8	2026-10-13 01:18:49.108495+03:30	2026-10-13 01:18:49.108497+03:30
بافت و پلیور	knitwear	apparel	Sparkles	t	7ebcb752-c17f-4eb3-a970-131225b27384	2026-10-13 01:18:49.111683+03:30	2026-10-13 01:18:49.111684+03:30
پالتو و بارانی	coats-jackets	apparel	Layers	t	2b528eac-f0f1-4275-a899-a3a4299872ce	2026-10-13 01:18:49.114173+03:30	2026-10-13 01:18:49.114175+03:30
شلوار و لگ	pants	apparel	Scissors	t	1ecccbc4-3dd0-4fe5-8d74-54fdac933f28	2026-10-13 01:18:49.116639+03:30	2026-10-13 01:18:49.116641+03:30
تاپ و تیشرت	tops	apparel	Sun	t	74a8c699-5551-4eba-bb57-0650a8500529	2026-10-13 01:18:49.119197+03:30	2026-10-13 01:18:49.119199+03:30
اسکارف و شال	scarves	accessories	Wind	t	82972e89-e0f1-4b47-8b00-43c9deacd4e4	2026-10-13 01:18:49.121656+03:30	2026-10-13 01:18:49.121658+03:30
اکسسوری مو	hair-accessories	accessories	Heart	t	b4778450-7f4e-4b96-91e5-46887ff714ca	2026-10-13 01:18:49.124039+03:30	2026-10-13 01:18:49.124041+03:30
دستمال سر	bandanas	accessories	Sparkles	t	7f284b14-78b0-4924-8a5a-ce7e881445d4	2026-10-13 01:18:49.125284+03:30	2026-10-13 01:18:49.125286+03:30
\.


--
-- Data for Name: taxonomy_colors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.taxonomy_colors (name, hex, slug, is_system_default, id, created_at, updated_at) FROM stdin;
مشکی ذغالی	#1C1917	charcoal-black	t	ea8502c0-be59-4f57-a275-d7ed7a5f0257	2026-10-13 01:18:49.09583+03:30	2026-10-13 01:18:49.095833+03:30
کرم ماسه‌ای	#E7E2D7	sand-cream	t	b0beb00c-f614-4742-a081-edc51f31771c	2026-10-13 01:18:49.095841+03:30	2026-10-13 01:18:49.095842+03:30
طوسی ملانژ	#94A3B8	melange-grey	t	e7ff228f-ea7c-4885-88f4-3ac3236a6286	2026-10-13 01:18:49.095848+03:30	2026-10-13 01:18:49.095849+03:30
یشمی کدر	#4D5D53	muted-jade	t	9c71918a-0fe8-434a-90c7-c98ac59a16a4	2026-10-13 01:18:49.095856+03:30	2026-10-13 01:18:49.095856+03:30
شتری عسلی	#C2A68C	honey-camel	t	f173d11f-0a39-4cee-bc50-12416300bd5e	2026-10-13 01:18:49.095862+03:30	2026-10-13 01:18:49.095863+03:30
سفید عاجی	#F8FAFC	ivory-white	t	2475a03a-17b7-41db-8669-534c0bc76c50	2026-10-13 01:18:49.095868+03:30	2026-10-13 01:18:49.095869+03:30
سرمه‌ای عمیق	#1E293B	deep-navy	t	1ad8f3a3-4507-429e-92fc-b6ad6c3cadd8	2026-10-13 01:18:49.095874+03:30	2026-10-13 01:18:49.095875+03:30
omidi	#1C1917	omidi	f	817aee6f-91b8-492f-a084-0acd45cf99bc	2026-10-14 09:33:48.377192+03:30	2026-10-14 09:33:48.377203+03:30
\.


--
-- Data for Name: taxonomy_seasons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.taxonomy_seasons (name, slug, is_current_drop, is_active, id, created_at, updated_at) FROM stdin;
پاییز ۱۴۰۵	fall-1405	t	t	bf849c08-c698-4667-8b88-42231946c754	2026-10-13 01:18:49.102279+03:30	2026-10-13 01:18:49.102282+03:30
زمستان ۱۴۰۵	winter-1405	f	t	2ed65f87-f185-439d-af0c-b84f345830f1	2026-10-13 01:18:49.10229+03:30	2026-10-13 01:18:49.102291+03:30
بهار ۱۴۰۶	spring-1406	f	t	e423071e-046d-4bb1-90ab-9de6cf8592a7	2026-10-13 01:18:49.102297+03:30	2026-10-13 01:18:49.102298+03:30
تابستان ۱۴۰۵	summer-1405	f	t	586622eb-56d2-4309-932a-9b99417c3a29	2026-10-13 01:18:49.102304+03:30	2026-10-13 01:18:49.102304+03:30
\.


--
-- Data for Name: taxonomy_sizes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.taxonomy_sizes (name, "group", "order", is_system_default, id, created_at, updated_at) FROM stdin;
XS	alpha	1	t	ab10a8f4-f32f-40f8-b941-b1117aa6f1f5	2026-10-13 01:18:49.098113+03:30	2026-10-13 01:18:49.098115+03:30
S	alpha	2	t	1b2a9165-baf0-48cf-a264-32db5da22dac	2026-10-13 01:18:49.098124+03:30	2026-10-13 01:18:49.098125+03:30
M	alpha	3	t	9d06f5a1-7174-42c3-9884-7160c4e0f925	2026-10-13 01:18:49.098134+03:30	2026-10-13 01:18:49.098135+03:30
L	alpha	4	t	a159a60d-4612-4515-8d51-aa59cd45935c	2026-10-13 01:18:49.098141+03:30	2026-10-13 01:18:49.098141+03:30
XL	alpha	5	t	07699e04-82ef-4952-a686-b25e2cd1ee71	2026-10-13 01:18:49.098147+03:30	2026-10-13 01:18:49.098148+03:30
36	numeric	6	t	9387350a-197d-4533-84be-189df5d79698	2026-10-13 01:18:49.098154+03:30	2026-10-13 01:18:49.098154+03:30
38	numeric	7	t	8f2a9a4a-4d91-4d7d-bc48-91fc90ff4baf	2026-10-13 01:18:49.09816+03:30	2026-10-13 01:18:49.09816+03:30
40	numeric	8	t	c0d0d56f-5d73-438d-b497-248cf730a429	2026-10-13 01:18:49.098166+03:30	2026-10-13 01:18:49.098167+03:30
42	numeric	9	t	1048b9f1-210f-41db-a16a-21de8a818146	2026-10-13 01:18:49.098172+03:30	2026-10-13 01:18:49.098173+03:30
44	numeric	10	t	9ef9a3a7-8c62-4dab-bd3c-411ad49e89f9	2026-10-13 01:18:49.098178+03:30	2026-10-13 01:18:49.098179+03:30
Free Size	free	11	t	b58e7b97-3c9c-4d02-b304-49c987bd96df	2026-10-13 01:18:49.098184+03:30	2026-10-13 01:18:49.098185+03:30
Standard	accessory	12	f	a3e14a35-0db0-406f-af35-c6b7aaa146a5	2026-10-13 01:18:49.098191+03:30	2026-10-13 01:18:49.098192+03:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (phone, first_name, last_name, email, full_name, role, is_active, id, created_at, updated_at, birth_date) FROM stdin;
09185621567	فردین	بیروزی	fardinpoyan81@gmail.com	فردین بیروزی	ADMIN	t	d8a628ed-155f-407c-9ecf-2573f62a732d	2026-09-06 07:54:02.184602+03:30	2026-09-06 14:57:57.951851+03:30	\N
09120000001	مدیر	سیستم	admin@sagedesign.ir	مدیر سیستم	ADMIN	t	a41e42f5-3219-4c3d-839e-e8e243a7f88d	2026-09-06 15:18:35.661951+03:30	2026-09-06 15:18:35.661956+03:30	1990-05-15
09123456789	سارا	احمدی	sara@example.com	سارا احمدی	CUSTOMER	t	c68f46bd-e81f-486f-9ddf-519ba42da975	2026-09-06 15:18:35.661957+03:30	2026-09-06 15:18:35.661958+03:30	1996-08-20
09129990000	مدیریت	کراس	\N	مدیریت ارشد آتلیه کراس	ADMIN	t	df1c8115-4bc4-4b84-93c3-4c7b4ee41600	2026-10-13 01:11:51.027258+03:30	2026-10-13 01:11:51.027262+03:30	\N
09121112233	سارا	رادمنش	sara.rad@example.com	سارا رادمنش	CUSTOMER	t	7e042d39-33a5-4e16-b92b-f7a0d431e97d	2026-10-13 01:11:51.027274+03:30	2026-10-13 01:11:51.027275+03:30	\N
09127778899	\N	\N	\N	آرزو قنبری	CUSTOMER	t	c5455d6b-2f5e-45c3-bc94-b4f32f5951dd	2026-10-17 22:19:42.535945+03:30	2026-10-17 22:19:42.535948+03:30	\N
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: campaign_categories campaign_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_categories
    ADD CONSTRAINT campaign_categories_pkey PRIMARY KEY (campaign_id, category_id);


--
-- Name: campaign_products campaign_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_pkey PRIMARY KEY (campaign_id, product_id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: journal_articles journal_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_articles
    ADD CONSTRAINT journal_articles_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: taxonomy_brands taxonomy_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxonomy_brands
    ADD CONSTRAINT taxonomy_brands_pkey PRIMARY KEY (id);


--
-- Name: taxonomy_categories taxonomy_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxonomy_categories
    ADD CONSTRAINT taxonomy_categories_pkey PRIMARY KEY (id);


--
-- Name: taxonomy_colors taxonomy_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxonomy_colors
    ADD CONSTRAINT taxonomy_colors_pkey PRIMARY KEY (id);


--
-- Name: taxonomy_seasons taxonomy_seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxonomy_seasons
    ADD CONSTRAINT taxonomy_seasons_pkey PRIMARY KEY (id);


--
-- Name: taxonomy_sizes taxonomy_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxonomy_sizes
    ADD CONSTRAINT taxonomy_sizes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_addresses_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_addresses_id ON public.addresses USING btree (id);


--
-- Name: ix_addresses_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_addresses_user_id ON public.addresses USING btree (user_id);


--
-- Name: ix_campaign_categories_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_campaign_categories_category_id ON public.campaign_categories USING btree (category_id);


--
-- Name: ix_campaign_products_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_campaign_products_product_id ON public.campaign_products USING btree (product_id);


--
-- Name: ix_campaigns_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_campaigns_id ON public.campaigns USING btree (id);


--
-- Name: ix_campaigns_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_campaigns_slug ON public.campaigns USING btree (slug);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_categories_slug ON public.categories USING btree (slug);


--
-- Name: ix_coupons_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_coupons_code ON public.coupons USING btree (code);


--
-- Name: ix_coupons_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_coupons_id ON public.coupons USING btree (id);


--
-- Name: ix_journal_articles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_journal_articles_id ON public.journal_articles USING btree (id);


--
-- Name: ix_journal_articles_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_journal_articles_slug ON public.journal_articles USING btree (slug);


--
-- Name: ix_journal_articles_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_journal_articles_status ON public.journal_articles USING btree (status);


--
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- Name: ix_order_items_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_order_items_order_id ON public.order_items USING btree (order_id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_orders_order_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_orders_order_number ON public.orders USING btree (order_number);


--
-- Name: ix_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_orders_status ON public.orders USING btree (status);


--
-- Name: ix_orders_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_orders_user_id ON public.orders USING btree (user_id);


--
-- Name: ix_orders_zarinpal_authority; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_orders_zarinpal_authority ON public.orders USING btree (zarinpal_authority);


--
-- Name: ix_otp_codes_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_otp_codes_phone ON public.otp_codes USING btree (phone);


--
-- Name: ix_payment_transactions_authority; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_payment_transactions_authority ON public.payment_transactions USING btree (authority);


--
-- Name: ix_payment_transactions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_payment_transactions_id ON public.payment_transactions USING btree (id);


--
-- Name: ix_payment_transactions_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_payment_transactions_order_id ON public.payment_transactions USING btree (order_id);


--
-- Name: ix_product_reviews_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_product_reviews_id ON public.product_reviews USING btree (id);


--
-- Name: ix_product_reviews_product_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_product_reviews_product_slug ON public.product_reviews USING btree (product_slug);


--
-- Name: ix_product_reviews_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_product_reviews_status ON public.product_reviews USING btree (status);


--
-- Name: ix_product_variants_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_product_variants_id ON public.product_variants USING btree (id);


--
-- Name: ix_product_variants_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_product_variants_product_id ON public.product_variants USING btree (product_id);


--
-- Name: ix_product_variants_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_product_variants_sku ON public.product_variants USING btree (sku);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_products_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_products_slug ON public.products USING btree (slug);


--
-- Name: ix_products_title; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_products_title ON public.products USING btree (title);


--
-- Name: ix_site_settings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_site_settings_id ON public.site_settings USING btree (id);


--
-- Name: ix_site_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_site_settings_key ON public.site_settings USING btree (key);


--
-- Name: ix_taxonomy_brands_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_taxonomy_brands_id ON public.taxonomy_brands USING btree (id);


--
-- Name: ix_taxonomy_brands_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_taxonomy_brands_slug ON public.taxonomy_brands USING btree (slug);


--
-- Name: ix_taxonomy_categories_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_taxonomy_categories_id ON public.taxonomy_categories USING btree (id);


--
-- Name: ix_taxonomy_categories_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_taxonomy_categories_slug ON public.taxonomy_categories USING btree (slug);


--
-- Name: ix_taxonomy_colors_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_taxonomy_colors_id ON public.taxonomy_colors USING btree (id);


--
-- Name: ix_taxonomy_colors_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_taxonomy_colors_slug ON public.taxonomy_colors USING btree (slug);


--
-- Name: ix_taxonomy_seasons_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_taxonomy_seasons_id ON public.taxonomy_seasons USING btree (id);


--
-- Name: ix_taxonomy_seasons_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_taxonomy_seasons_slug ON public.taxonomy_seasons USING btree (slug);


--
-- Name: ix_taxonomy_sizes_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_taxonomy_sizes_id ON public.taxonomy_sizes USING btree (id);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_phone ON public.users USING btree (phone);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: campaign_categories campaign_categories_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_categories
    ADD CONSTRAINT campaign_categories_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_categories campaign_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_categories
    ADD CONSTRAINT campaign_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: campaign_products campaign_products_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;


--
-- Name: campaign_products campaign_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_products
    ADD CONSTRAINT campaign_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: payment_transactions payment_transactions_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE RESTRICT;


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict VGg0DKdNUdsiCRpAGnjIXUaRuagRKUVvbLXjwGjp8f3W8bz51vpxXldbkMXWJgx

