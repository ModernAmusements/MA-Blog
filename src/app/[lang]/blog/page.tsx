import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import { getBlogPosts, getAllTags, filterByLanguage } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const t = translations[lang].blog;

  return {
    title: t.title,
    description: t.description,
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/blog`,
      siteName: SITE_NAME,
      title: t.title,
      description: t.description,
      images: [
        {
          url: `${SITE_URL}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Blog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      creator: '@modernamusements',
      images: [`${SITE_URL}/og-image.svg`],
    },
  };
}

export default async function BlogPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].blog;

  const allPosts = getBlogPosts();
  const posts = filterByLanguage(allPosts, lang);

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
            {post.image && (
              <div className={styles.postImage}>
                <Image src={post.image} alt={post.title} width={200} height={112} style={{ objectFit: 'cover' }} unoptimized />
              </div>
            )}
            <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
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