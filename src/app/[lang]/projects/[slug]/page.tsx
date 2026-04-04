import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Mermaid } from '@/components/Mermaid';
import Image from 'next/image';
import { CollapsibleTOC } from '@/components/CollapsibleTOC';
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

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string; thema: number; subIndex: number }[] = [];
  let match;
  let themaIndex = 0;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    if (level === 2) {
      themaIndex++;
      headings.push({ level, text, id, thema: themaIndex, subIndex: 0 });
    } else if (level === 3 || level === 4) {
      const lastH2 = headings.filter(h => h.level === 2).pop();
      const subIndex = headings.filter(h => h.thema === lastH2?.thema && h.level > 2).length + 1;
      headings.push({ level, text, id, thema: lastH2?.thema || 0, subIndex });
    }
  }
  return headings;
}

const components = {
  Mermaid: ({ chart, children }: { chart?: string; children?: React.ReactNode }) => {
    const chartContent = chart || (typeof children === 'string' ? children : '');
    return <Mermaid chart={chartContent} />;
  },
  h2: ({ children }: { children?: React.ReactNode }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return <h2 id={id} className={styles.heading2}><a href={`#${id}`} className={styles.anchor}>#</a>{children}</h2>;
  },
  h3: ({ children }: { children?: React.ReactNode }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return <h3 id={id} className={styles.heading3}><a href={`#${id}`} className={styles.anchor}>#</a>{children}</h3>;
  },
  p: ({ children }: { children?: React.ReactNode }) => {
    return <p>{children}</p>;
  },
  img: (props: any) => (
    <Image 
      src={props.src} 
      alt={props.alt || ''} 
      width={800} 
      height={450} 
      className={styles.contentImage}
    />
  ),
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
};

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].common;
  const tProjects = translations[lang].projects;
  
  const project = getProject(params.slug);
  if (!project) notFound();

  const headings = extractHeadings(project.content);

  return (
    <div className={styles.postPage}>
      <Link href={`/${lang}/projects`} className={styles.back}>← {t.back}</Link>
      <article>
        <header className={styles.header}>
          <span className={styles.date}>{new Date(project.date).toLocaleDateString()}</span>
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
      </article>
    </div>
  );
}