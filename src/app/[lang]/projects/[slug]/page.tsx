import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CollapsibleTOC } from '@/components/CollapsibleTOC';
import styles from '../page.module.scss';
import { getProjectByLang, getProjectPosts, extractHeadings } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { createMdxComponents } from '@/lib/mdx-components';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjectPosts();
  const enProjects = projects.filter(p => !p.slug.endsWith('.de'));
  return enProjects.flatMap((p) => [
    { lang: 'en', slug: p.slug },
    { lang: 'de', slug: `${p.slug}.de` },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const project = getProjectByLang(params.slug, params.lang);
  if (!project) {
    return {
      title: 'Project Not Found',
      description: '',
      excerpt: '',
    };
  }

  return {
    title: project.title,
    description: project.description,
    excerpt: project.description,
    openGraph: {
      type: 'website',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${SITE_URL}/${lang}/projects/${params.slug}`,
      siteName: SITE_NAME,
      title: project.title,
      description: project.description,
      publishedTime: project.date,
      tags: project.tags,
      images: [
        {
          url: `${SITE_URL}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      creator: '@modernamusements',
      images: [`${SITE_URL}/og-image.svg`],
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

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const tProjects = translations[lang].projects;
  
  const project = getProjectByLang(params.slug, params.lang);
  if (!project) notFound();

  const headings = extractHeadings(project.content);

  return (
    <div className={styles.postPage}>
      <article>
        <header className={styles.header}>
          <h1>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.links}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">{tProjects.liveDemo}</a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">{tProjects.github}</a>
            )}
          </div>
        </header>
        {headings.length > 0 && (
          <CollapsibleTOC headings={headings} />
        )}
        <div className={styles.content}>
          <MDXRemote source={project.content} components={components} />
        </div>
        <footer className={styles.metaFooter}>
          <div>
            <span className={styles.metaLabel}>Created:</span>
            <br />
            <span className={styles.metaDate}>{new Date(project.date).toLocaleDateString()}</span>
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