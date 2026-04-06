import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './page.module.scss';
import { getProjectPosts, getAllTags } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tag?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const t = translations[lang].projects;
  const baseUrl = 'https://modern-amusements.vercel.app';
  
  return {
    title: t.title,
    description: t.description,
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${lang}/projects`,
      siteName: 'ModernAmusement Development',
      title: t.title,
      description: t.description,
      images: [
        {
          url: `${baseUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: 'ModernAmusement Development Projects',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      creator: '@modernamusements',
      images: [`${baseUrl}/og-image.svg`],
    },
  };
}

export default async function ProjectsPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].projects;
  
  const allProjects = getProjectPosts();
  const projects = lang === 'de'
    ? allProjects.filter(p => p.slug.endsWith('.de'))
    : allProjects.filter(p => !p.slug.endsWith('.de'));
    
  const allTags = getAllTags(projects);
  const selectedTag = searchParams.tag;

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <div className={styles.projects}>
      <h1>{t.title}</h1>
      <p className={styles.description}>{t.description}</p>

      {allTags.length > 0 && (
        <div className={styles.tags}>
          <Link href={`/${lang}/projects`} className={`${styles.tag} ${!selectedTag ? styles.active : ''}`}>
            {translations[lang].common.all}
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/${lang}/projects?tag=${encodeURIComponent(tag)}`}
              className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {filteredProjects.map((project) => (
          <div key={project.slug} className={styles.card}>
            <Link href={`/${lang}/projects/${project.slug}`} className={styles.cardInner}>
              <div className={styles.cardContent}>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
            <div className={styles.links}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{t.liveDemo} →</a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">{t.github} →</a>
              )}
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className={styles.empty}>{t.noProjects}</p>
        )}
      </div>
    </div>
  );
}