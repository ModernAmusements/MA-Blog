import Link from 'next/link';
import styles from './page.module.scss';
import { getBlogPosts, getAllTags } from '@/lib/mdx';

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage(props: Props) {
  const searchParams = await props.searchParams;
  const posts = getBlogPosts();
  const allTags = getAllTags(posts);
  const selectedTag = searchParams.tag;

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  return (
    <div className={styles.blog}>
      <h1>Blog</h1>
      <p className={styles.description}>Thoughts on development, design, and everything in between.</p>

      <div className={styles.tags}>
        <Link href="/blog" className={`${styles.tag} ${!selectedTag ? styles.active : ''}`}>
          All
        </Link>
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${encodeURIComponent(tag)}`}
            className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
          >
            {tag}
          </Link>
        ))}
      </div>

      <div className={styles.posts}>
        {filteredPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
            <span className={styles.date}>{String(post.date)}</span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className={styles.postTags}>
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
        {filteredPosts.length === 0 && (
          <p className={styles.empty}>No posts found.</p>
        )}
      </div>
    </div>
  );
}