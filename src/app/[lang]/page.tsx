import Link from 'next/link';
import styles from './page.module.scss';
import { getBlogPosts, getProjectPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Home(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].home;
  
  const posts = getBlogPosts().slice(0, 3);
  const projects = getProjectPosts().slice(0, 2);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>{t.hero.title}</h1>
        <p className={styles.bio}>{t.hero.bio}</p>
        <div className={styles.cta}>
          <Link href={`/${lang}/projects`} className={styles.primary}>{t.hero.viewProjects}</Link>
          <Link href={`/${lang}/contact`} className={styles.secondary}>{t.hero.getInTouch}</Link>
        </div>
      </section>

      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t.featuredProjects}</h2>
            <Link href={`/${lang}/projects`}>{t.viewAll} →</Link>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <Link key={project.slug} href={`/${lang}/projects/${project.slug}`} className={styles.projectCard}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>{t.latestPosts}</h2>
            <Link href={`/${lang}/blog`}>{t.viewAll} →</Link>
          </div>
          <div className={styles.postList}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className={styles.postItem}>
                <span className={styles.date}>{String(post.date)}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}