import { getBlogPosts, getProjectPosts } from '@/lib/mdx';

const baseUrl = 'https://modern-amusements.vercel.app';

export async function GET() {
  const posts = getBlogPosts();
  const projects = getProjectPosts();

  const staticUrls = [
    { loc: '/en', changefreq: 'weekly', priority: 1.0, lastmod: '2026-04-15' },
    { loc: '/de', changefreq: 'weekly', priority: 1.0, lastmod: '2026-04-15' },
    { loc: '/en/about', changefreq: 'monthly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/de/about', changefreq: 'monthly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/en/blog', changefreq: 'weekly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/de/blog', changefreq: 'weekly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/en/projects', changefreq: 'weekly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/de/projects', changefreq: 'weekly', priority: 0.8, lastmod: '2026-04-15' },
    { loc: '/en/contact', changefreq: 'monthly', priority: 0.7, lastmod: '2026-04-15' },
    { loc: '/de/contact', changefreq: 'monthly', priority: 0.7, lastmod: '2026-04-15' },
  ];

  const blogUrls = posts
    .filter(p => !p.slug.endsWith('.de'))
    .flatMap((post) => {
      const date = post.date || '2026-04-15';
      return [
        { loc: `/en/blog/${post.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: date },
        { loc: `/de/blog/${post.slug}.de`, changefreq: 'weekly', priority: 0.7, lastmod: date },
      ];
    });

  const projectUrls = projects
    .filter(p => !p.slug.endsWith('.de'))
    .flatMap((project) => {
      const date = project.date || '2026-04-15';
      return [
        { loc: `/en/projects/${project.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: date },
        { loc: `/de/projects/${project.slug}.de`, changefreq: 'weekly', priority: 0.7, lastmod: date },
      ];
    });

  const allUrls = [...staticUrls, ...blogUrls, ...projectUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map((url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
