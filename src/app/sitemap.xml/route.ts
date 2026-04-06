import { getBlogPosts, getProjectPosts } from '@/lib/mdx';

const baseUrl = 'https://modern-amusements.vercel.app';

export async function GET() {
  const posts = getBlogPosts();
  const projects = getProjectPosts();

  const staticUrls = [
    { loc: '/en', changefreq: 'weekly', priority: 1.0 },
    { loc: '/de', changefreq: 'weekly', priority: 1.0 },
    { loc: '/en/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/de/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/en/blog', changefreq: 'weekly', priority: 0.8 },
    { loc: '/de/blog', changefreq: 'weekly', priority: 0.8 },
    { loc: '/en/projects', changefreq: 'weekly', priority: 0.8 },
    { loc: '/de/projects', changefreq: 'weekly', priority: 0.8 },
    { loc: '/en/contact', changefreq: 'monthly', priority: 0.7 },
    { loc: '/de/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  const blogUrls = posts
    .filter(p => !p.slug.endsWith('.de'))
    .flatMap((post) => [
      { loc: `/en/blog/${post.slug}`, changefreq: 'weekly', priority: 0.7 },
      { loc: `/de/blog/${post.slug}.de`, changefreq: 'weekly', priority: 0.7 },
    ]);

  const projectUrls = projects
    .filter(p => !p.slug.endsWith('.de'))
    .flatMap((project) => [
      { loc: `/en/projects/${project.slug}`, changefreq: 'weekly', priority: 0.7 },
      { loc: `/de/projects/${project.slug}.de`, changefreq: 'weekly', priority: 0.7 },
    ]);

  const allUrls = [...staticUrls, ...blogUrls, ...projectUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map((url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
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
