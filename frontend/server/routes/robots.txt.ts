// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const reqHost = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || `${protocol}://${reqHost}`;

  const robots = `# robots.txt - Keras Atelier
User-agent: *
Allow: /
Disallow: /internal-ops-nexus/
Disallow: /checkout/
Disallow: /cart
Disallow: /account/
Disallow: /dev/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

  setHeader(event, 'content-type', 'text/plain; charset=utf-8');
  return robots;
});

