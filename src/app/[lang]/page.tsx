import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.scss';
import { getBlogPosts, getProjectPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { TerminalFrame } from '@/components/TerminalFrame';
import { TUIHero } from '@/components/TUIHero';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
  return (bytes / (1024 * 1024)).toFixed(1) + 'M';
}

interface TUINavItem {
  label: string;
  path: string;
  type: 'dir' | 'file';
  size?: string;
  subItems?: { label: string; path: string; type: 'dir' | 'file'; size?: string }[];
}

function buildNavItems(lang: string): TUINavItem[] {
  const allProjects = getProjectPosts();
  const allPosts = getBlogPosts();
  
  const projects = lang === 'de'
    ? allProjects.filter(p => p.slug.endsWith('.de'))
    : allProjects.filter(p => !p.slug.endsWith('.de'));
  
  const filteredPosts = lang === 'de' 
    ? allPosts.filter(p => p.slug.endsWith('.de'))
    : allPosts.filter(p => !p.slug.endsWith('.de'));
  
  const projectSubItems = projects.map((p) => ({
    label: p.title,
    path: `/${lang}/projects/${p.slug}`,
    type: 'file' as const,
    size: formatFileSize(p.content.length * 2),
  }));
  
  const blogSubItems = filteredPosts.map((p) => ({
    label: p.title,
    path: `/${lang}/blog/${p.slug}`,
    type: 'file' as const,
    size: formatFileSize(p.content.length * 2),
  }));
  
  return [
    { label: 'about', path: '', type: 'dir' as const, subItems: [
      { label: 'about.md', path: '', type: 'file' as const, size: '1.2K' },
    ]},
    { label: 'projects', path: `/${lang}/projects`, type: 'dir' as const, subItems: projectSubItems },
    { label: 'blog', path: `/${lang}/blog`, type: 'dir' as const, subItems: blogSubItems },
    { label: 'contact', path: `/${lang}/contact`, type: 'dir' as const, subItems: [
      { label: 'contact.md', path: `/${lang}/contact`, type: 'file' as const, size: '256B' },
    ]},
  ];
}

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function Home(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].home;
  
  const allPosts = getBlogPosts();
  const allProjects = getProjectPosts();
  
  const posts = lang === 'de'
    ? allPosts.filter(p => p.slug.endsWith('.de')).slice(0, 3)
    : allPosts.filter(p => !p.slug.endsWith('.de')).slice(0, 3);
    
  const projects = lang === 'de'
    ? allProjects.filter(p => p.slug.endsWith('.de')).slice(0, 2)
    : allProjects.filter(p => !p.slug.endsWith('.de')).slice(0, 2);
    
  const navItems = buildNavItems(lang);

  return (
    <div className={styles.home}>
      <TUIHero navItems={navItems} lang={lang} heroText={t.hero} exploreText={t.exploreMyWork} />

      {posts.length > 0 && (
        <TerminalFrame title={t.featuredProjects}>
          <div className={styles.sectionHeader}>
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
    </div>
  );
}