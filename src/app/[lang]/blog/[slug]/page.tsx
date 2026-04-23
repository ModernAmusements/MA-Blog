import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CollapsibleTOC } from '@/components/CollapsibleTOC';
import styles from '../page.module.scss';
import { getBlogPostByLang, getBlogPosts, extractHeadings } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { createMdxComponents } from '@/lib/mdx-components';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const enPosts = posts.filter(p => !p.slug.endsWith('.de'));
  return enPosts.flatMap((post) => [
    { lang: 'en', slug: post.slug },
    { lang: 'de', slug: `${post.slug}.de` },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const post = getBlogPostByLang(params.slug, params.lang);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/blog/${params.slug}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      authors: ['Shady Nathan Tawfik'],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
      creator: '@modernamusements',
    },
  };
}

const components = createMdxComponents({
  heading2: styles.heading2,
  heading3: styles.heading3,
  heading4: styles.heading4,
  anchor: styles.anchor,
  contentImage: styles.contentImage,
});

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  
  const post = getBlogPostByLang(params.slug, params.lang);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <div className={styles.postPage}>
      <article>
        <header className={styles.header}>
          <h1>{post.title}</h1>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${lang}/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                {tag}
              </Link>
            ))}
          </div>
        </header>
        {headings.length > 0 && (
          <CollapsibleTOC headings={headings} />
        )}
        <div className={styles.content}>
          <MDXRemote source={post.content} components={components} />
        </div>
        <footer className={styles.metaFooter}>
          <div>
            <span className={styles.metaLabel}>Created:</span>
            <br />
            <span className={styles.metaDate}>{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div>
            <span className={styles.metaLabel}>Last Updated:</span>
            <br />
            <span className={styles.metaDate}>{new Date().toLocaleDateString()}</span>
          </div>
        </footer>
      </article>
    </div>
  );
}