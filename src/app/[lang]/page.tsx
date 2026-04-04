import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import { getBlogPosts, getProjectPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { TerminalFrame } from '@/components/TerminalFrame';
import { TUIHero } from '@/components/TUIHero';

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
      <TUIHero />

      {projects.length > 0 && (
        <TerminalFrame title={t.featuredProjects}>
          <div id="projects" className={styles.sectionHeader}>
            <h2><span className={styles.prompt}>~ &gt;</span> [{t.featuredProjects}]</h2>
            <Link href={`/${lang}/projects`}>{t.viewAll} →</Link>
          </div>
          <div className={styles.section}>
            {projects.map((project) => (
              <Link key={project.slug} href={`/${lang}/projects/${project.slug}`} className={styles.projectCard}>
                <div className={styles.cardInner}>
                  {project.thumbnail && (
                    <div className={styles.cardImage}>
                      <Image src={project.thumbnail} alt={project.title} width={200} height={112} style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles.tags}>
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TerminalFrame>
      )}

      {posts.length > 0 && (
        <TerminalFrame title={t.latestPosts}>
          <div className={styles.sectionHeader}>
            <h2><span className={styles.prompt}>~ &gt;</span> [{t.latestPosts}]</h2>
            <Link href={`/${lang}/blog`}>{t.viewAll} →</Link>
          </div>
          <div className={styles.section}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className={styles.projectCard}>
                {post.image && (
                  <div className={styles.cardImage}>
                    <Image src={post.image} alt={post.title} width={400} height={225} style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                )}
                <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </Link>
            ))}
          </div>
        </TerminalFrame>
      )}
    </div>
  );
}