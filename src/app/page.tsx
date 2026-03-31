import Link from 'next/link';
import styles from './page.module.scss';
import { getBlogPosts, getProjectPosts } from '@/lib/mdx';

export default function Home() {
  const posts = getBlogPosts().slice(0, 3);
  const projects = getProjectPosts().slice(0, 2);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Hi, I'm a developer.</h1>
        <p className={styles.bio}>
          I build accessible, performant web applications and write about my experiences.
        </p>
        <div className={styles.cta}>
          <Link href="/projects" className={styles.primary}>View Projects</Link>
          <Link href="/contact" className={styles.secondary}>Get in Touch</Link>
        </div>
      </section>

      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Featured Projects</h2>
            <Link href="/projects">View all →</Link>
          </div>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.projectCard}>
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
            <h2>Latest Posts</h2>
            <Link href="/blog">View all →</Link>
          </div>
          <div className={styles.postList}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postItem}>
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