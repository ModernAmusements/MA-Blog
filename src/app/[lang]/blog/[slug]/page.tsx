import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Mermaid } from '@/components/Mermaid';
import { CollapsibleTOC } from '@/components/CollapsibleTOC';
import { CodeBlock } from '@/components/CodeBlock';
import styles from '../page.module.scss';
import { getBlogPost, getBlogPostByLang, getBlogPosts } from '@/lib/mdx';
import { translations } from '@/i18n';
import type { Lang } from '@/i18n';

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  const enPosts = posts.filter(p => !p.slug.endsWith('.de'));
  return enPosts.flatMap((post) => [
    { lang: 'en', slug: post.slug },
    { lang: 'de', slug: `${post.slug}.de` },
  ]);
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const lang = params.lang === 'de' ? 'de' : 'en';
  const post = getBlogPostByLang(params.slug, params.lang);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  const baseUrl = 'https://modern-amusements.vercel.app';
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      locale: lang === 'de' ? 'de_DE' : 'en_US',
      url: `${baseUrl}/${lang}/blog/${params.slug}`,
      siteName: 'ModernAmusement Development',
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      authors: ['Shady Nathan Tawfik'],
      images: [
        {
          url: post.image ? `${baseUrl}${post.image}` : `${baseUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@modernamusements',
      images: post.image ? [`${baseUrl}${post.image}`] : [`${baseUrl}/og-image.svg`],
    },
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
  Mermaid: ({ chart }: { chart: string }) => <Mermaid chart={chart} />,
  CodeBlock: ({ children, className }: { children?: string; className?: string }) => <CodeBlock className={className}>{children}</CodeBlock>,
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const code = String(children).trim();
    const hasMultipleLines = code.split('\n').length > 1;
    const hasLanguage = className && className !== 'text';
    
    if (hasMultipleLines || hasLanguage) {
      return <CodeBlock className={className || 'text'}>{code}</CodeBlock>;
    }
    
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }: { children?: React.ReactNode }) => {
    if (!children) return <pre>{children}</pre>;
    
    let codeContent = '';
    try {
      const child = children as React.ReactElement<any>;
      codeContent = child?.props?.children?.toString() || '';
    } catch {
      codeContent = String(children);
    }
    
    let trimmed = codeContent.trim();
    
    const isMermaidBlock = trimmed.startsWith('```mermaid') || 
      trimmed.startsWith('``` chart') ||
      trimmed.includes('flowchart') ||
      trimmed.includes('sequenceDiagram') ||
      trimmed.includes('classDiagram') ||
      trimmed.includes('stateDiagram') ||
      trimmed.includes('gantt') ||
      trimmed.includes('pie ') ||
      trimmed.startsWith('graph ');
    
    if (isMermaidBlock) {
      trimmed = trimmed.replace(/^```mermaid\s*\n?/, '').replace(/^```\s*\n?/, '').replace(/\n?```$/, '');
      trimmed = trimmed.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      
      let cleanChart = trimmed.replace(/^mermaid\n*---[\s\S]*?---\n*/gm, '');
      cleanChart = cleanChart.replace(/<br\s*\/?>/gi, ' ');
      return <Mermaid chart={cleanChart} />;
    }
    
    return <CodeBlock className="text">{codeContent}</CodeBlock>;
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
  h4: ({ children }: { children?: React.ReactNode }) => {
    const text = children?.toString() || '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return <h4 id={id}><a href={`#${id}`} className={styles.anchor}>#</a>{children}</h4>;
  },
  p: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} className={styles.contentImage} />
  ),
};

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const lang = (params.lang && translations[params.lang as Lang]) ? params.lang as Lang : 'en';
  const t = translations[lang].common;
  
  const post = getBlogPostByLang(params.slug, params.lang);
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <div className={styles.postPage}>
      <article>
        <header className={styles.header}>
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
          <CollapsibleTOC headings={headings} />
        )}
        <div className={styles.content}>
          <MDXRemote source={post.content} components={components} />
        </div>
        <footer className={styles.metaFooter}>
          <div>
            <span className={styles.metaLabel}>Created:</span>
            <br />
            <span className={styles.metaDate}>{new Date(post.date).toLocaleDateString()}</span>
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