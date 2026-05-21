import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import { getBlogPosts, filterByLanguage } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { TerminalFrame } from '@/components/TerminalFrame';
import { TUIHero } from '@/components/TUIHero';
import { HomeHeroContact } from '@/components/HomeHeroContact';
import { HomeContactForm } from '@/components/HomeContactForm';
import { HeroFAQ } from '@/components/HeroFAQ';

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Home(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].home;
  
  const allPosts = getBlogPosts();
  
  const posts = filterByLanguage(allPosts, lang).slice(0, 3);

  return (
    <div className={styles.home}>
      <TUIHero lang={lang} heroText={t.hero} rightPane={<HomeHeroContact lang={lang} />} faqPane={<HeroFAQ lang={lang} />} />

      {posts.length > 0 && (
        <TerminalFrame title={t.featuredProjects}>
          <div id="blog" className={styles.sectionHeader}>
            <h2><span className={styles.prompt}>~ &gt;</span> [{t.featuredProjects}]</h2>
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

      <HomeContactForm lang={lang} />

      {/* Projects section — commented out for future use
      {projects.length > 0 && (
        <TerminalFrame title={t.latestPosts}>
          <div id="projects" className={styles.sectionHeader}>
            <h2><span className={styles.prompt}>~ &gt;</span> [{t.latestPosts}]</h2>
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
      */}
    </div>
  );
}