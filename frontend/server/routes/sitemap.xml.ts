// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  const reqHost = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const config = useRuntimeConfig(event);
  const siteUrl = config.public?.siteUrl || process.env.NUXT_PUBLIC_SITE_URL || `${protocol}://${reqHost}`;
  const targetBase = (config.backendUrl || process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/shop', priority: '0.9', changefreq: 'daily' },
    { loc: '/journal', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
    { loc: '/size-guide', priority: '0.6', changefreq: 'monthly' },
    { loc: '/tracking', priority: '0.5', changefreq: 'monthly' },
  ];

  let productList: { slug: string }[] = [];
  try {
    const res = await $fetch<{ slug: string }[]>(`${targetBase}/api/products`);
    if (Array.isArray(res)) productList = res;
  } catch {
    // continue with static urls
  }

  let articleList: { slug: string; status?: string }[] = [];
  try {
    const res = await $fetch<{ slug: string; status?: string }[]>(`${targetBase}/api/articles`);
    if (Array.isArray(res)) articleList = res;
  } catch {
    // continue with static urls
  }

  const productUrls = productList.map((p) => ({
    loc: `/products/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const articleUrls = articleList
    .filter((a) => !a.status || a.status === 'published')
    .map((a) => ({
      loc: `/journal/${a.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    }));

  const allUrls = [...staticUrls, ...productUrls, ...articleUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${siteUrl}${item.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  return sitemapXml;
});

