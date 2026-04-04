import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Mermaid } from '@/components/Mermaid';
import styles from '../page.module.scss';
import { getBlogPost, getBlogPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.flatMap((post) => [
    { lang: 'en', slug: post.slug },
    { lang: 'de', slug: post.slug },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const post = getBlogPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.description,
  };
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, id });
  }
  return headings;
}

const components = {
  Mermaid: ({ chart }: { chart: string }) => <Mermaid chart={chart} />,
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
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <figure className={styles.figure}>
      <img src={src} alt={alt} />
      {alt && <figcaption>{alt}</figcaption>}
    </figure>
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

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].common;
  
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <div className={styles.postPage}>
      <Link href={`/${lang}/blog`} className={styles.back}>← {t.back}</Link>
      <article>
        <header className={styles.header}>
          <span className={styles.date}>{new Date(post.date).toLocaleDateString()}</span>
          <h1>{post.title}</h1>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/${lang}/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                {tag}
              </Link>
            ))}
          </div>
        </header>
        {headings.length > 0 && (
          <nav className={styles.toc}>
            <h4>Contents</h4>
            <ul>
              {headings.map((heading, i) => (
                <li key={i} className={styles[`tocLevel${heading.level}`]}>
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className={styles.content}>
          <MDXRemote source={post.content} components={components} />
        </div>
      </article>
    </div>
  );
}