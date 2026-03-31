import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from '../page.module.scss';
import { getProject, getProjectPosts } from '@/lib/mdx';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjectPosts();
  return projects.map((p) => ({ slug: p.slug }));
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

export default async function ProjectPage(props: Props) {
  const params = await props.params;
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <div className={styles.postPage}>
      <Link href="/projects" className={styles.back}>← Back to Projects</Link>
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
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            )}
          </div>
        </header>
        <div className={styles.content}>
          <MDXRemote source={project.content} />
        </div>
      </article>
    </div>
  );
}