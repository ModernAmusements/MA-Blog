import Link from 'next/link';
import styles from './page.module.scss';
import { getProjectPosts, getAllTags } from '@/lib/mdx';

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function ProjectsPage(props: Props) {
  const searchParams = await props.searchParams;
  const projects = getProjectPosts();
  const allTags = getAllTags(projects);
  const selectedTag = searchParams.tag;

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <div className={styles.projects}>
      <h1>Projects</h1>
      <p className={styles.description}>A collection of things I've built.</p>

      {allTags.length > 0 && (
        <div className={styles.tags}>
          <Link href="/projects" className={`${styles.tag} ${!selectedTag ? styles.active : ''}`}>
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tag=${encodeURIComponent(tag)}`}
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
            <div className={styles.cardContent}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={styles.links}>
              <Link href={`/projects/${project.slug}`}>View Details</Link>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo →</a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">GitHub →</a>
              )}
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <p className={styles.empty}>No projects found.</p>
        )}
      </div>
    </div>
  );
}