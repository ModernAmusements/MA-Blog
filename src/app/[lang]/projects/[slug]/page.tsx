import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Mermaid } from '@/components/Mermaid';
import Image from 'next/image';
import styles from '../page.module.scss';
import { getProject, getProjectPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjectPosts();
  return projects.flatMap((p) => [
    { lang: 'en', slug: p.slug },
    { lang: 'de', slug: p.slug },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const project = getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.description,
  };
}

const components = {
  Mermaid: ({ chart, children }: { chart?: string; children?: React.ReactNode }) => {
    const chartContent = chart || (typeof children === 'string' ? children : '');
    return <Mermaid chart={chartContent} />;
  },
  pre: ({ children }: { children?: React.ReactNode }) => {
    if (!children) return <pre>{children}</pre>;
    const child = children as React.ReactElement<any>;
    const codeContent = child?.props?.children?.toString() || '';
    
    const mermaidKeywords = ['graph TD', 'graph LR', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'pie', 'gantt', 'subgraph', 'direction'];
    const startsWithMermaid = mermaidKeywords.some(kw => codeContent.trim().startsWith(kw));
    
    if (startsWithMermaid) {
      return <Mermaid chart={codeContent} />;
    }
    
    return <pre>{children}</pre>;
  },
  img: (props: any) => (
    <Image 
      src={props.src} 
      alt={props.alt || ''} 
      width={800} 
      height={450} 
      style={{ borderRadius: '8px', margin: '1rem 0', maxWidth: '100%', height: 'auto' }}
    />
  ),
};

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].common;
  const tProjects = translations[lang].projects;
  
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <div className={styles.postPage}>
      <Link href={`/${lang}/projects`} className={styles.back}>← {t.back}</Link>
      <article>
        <header className={styles.header}>
          <span className={styles.date}>{String(project.date)}</span>
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
        <div className={styles.content}>
          <MDXRemote source={project.content} components={components} />
        </div>
      </article>
    </div>
  );
}