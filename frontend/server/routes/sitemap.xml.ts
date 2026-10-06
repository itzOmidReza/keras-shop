// server/routes/sitemap.xml.ts
import { mockProducts } from '../mock/products';
import { mockArticles } from '../mock/articles';

export default defineEventHandler((event) => {
  const reqHost = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || `${protocol}://${reqHost}`;
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

  const productUrls = mockProducts.map((p) => ({
    loc: `/products/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const articleUrls = mockArticles
    .filter((a) => a.status === 'published')
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

