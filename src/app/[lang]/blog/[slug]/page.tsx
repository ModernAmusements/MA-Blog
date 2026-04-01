import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from '../page.module.scss';
import { getBlogPost, getBlogPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.flatMap((post) => [
    { lang: 'en', slug: post.slug },
    { lang: 'de', slug: post.slug },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].common;
  
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <div className={styles.postPage}>
      <Link href={`/${lang}/blog`} className={styles.back}>← {t.back}</Link>
      <article>
        <header className={styles.header}>
          <span className={styles.date}>{String(post.date)}</span>
          <h1>{post.title}</h1>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${lang}/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                {tag}
              </Link>
            ))}
          </div>
        </header>
        <div className={styles.content}>
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}