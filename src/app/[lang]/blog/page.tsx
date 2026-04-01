import Link from 'next/link';
import styles from './page.module.scss';
import { getBlogPosts, getAllTags } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].blog;
  
  const posts = getBlogPosts();
  const allTags = getAllTags(posts);
  const selectedTag = searchParams.tag;

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className={styles.blog}>
      <h1>{t.title}</h1>
      <p className={styles.description}>{t.description}</p>

      <div className={styles.tags}>
        <Link href={`/${lang}/blog`} className={`${styles.tag} ${!selectedTag ? styles.active : ''}`}>
          {translations[lang].common.all}
        </Link>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/${lang}/blog?tag=${encodeURIComponent(tag)}`}
            className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
          >
            {tag}
          </Link>
        ))}
      </div>

      <div className={styles.posts}>
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className={styles.post}>
            <span className={styles.date}>{String(post.date)}</span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className={styles.postTags}>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <p className={styles.empty}>{t.noPosts}</p>
        )}
      </div>
    </div>
  );
}