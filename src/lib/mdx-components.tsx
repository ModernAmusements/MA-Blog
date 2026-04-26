import React from 'react';
import { Mermaid } from '@/components/Mermaid';
import { CodeBlock } from '@/components/CodeBlock';
import Image from 'next/image';
import { getChildContent, slugify } from './mdx-types';

interface SharedStyles {
  heading2?: string;
  heading3?: string;
  heading4?: string;
  anchor?: string;
  contentImage?: string;
}

const MERMAID_PATTERNS = [
  'flowchart', 'sequencediagram', 'classdiagram', 'statediagram',
  'erdiagram', 'gantt', 'pie ', 'graph ', 'subgraph ', 'mermaid'
];

function isMermaidContent(content: string): boolean {
  const trimmed = content.trim().toLowerCase();
  return MERMAID_PATTERNS.some(pattern => trimmed.startsWith(pattern));
}

function extractMermaidChart(content: string): string {
  const clean = content
    .replace(/^```mermaid\s*/g, '')
    .replace(/^```\s*/g, '')
    .replace(/\n?```$/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/^mermaid\n*---[\s\S]*?---\n*/gm, '')
    .replace(/<br\s*\/?>/gi, ' ');
  return clean;
}

function createHeadingComponent(Tag: 'h2' | 'h3' | 'h4', className?: string) {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const text = children?.toString() || '';
    const id = slugify(text);
    return <Tag id={id} className={className}>{children}</Tag>;
  };
}

export function createMdxComponents(styles?: SharedStyles) {
  return {
    Mermaid: ({ chart, children }: { chart?: string; children?: React.ReactNode }) => {
      const chartContent = chart || (typeof children === 'string' ? children : '');
      return <Mermaid chart={chartContent} />;
    },
    CodeBlock: ({ children, className }: { children?: string; className?: string }) => (
      <CodeBlock className={className}>{children}</CodeBlock>
    ),
    code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
      const code = getChildContent(children);
      const trimmed = code.trim();
      const hasMultipleLines = trimmed.split('\n').length > 1;
      const hasLanguage = className && className !== 'text';
      
      if (hasMultipleLines || hasLanguage) {
        return <CodeBlock className={className || 'text'}>{trimmed}</CodeBlock>;
      }
      
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }: { children?: React.ReactNode }) => {
      if (!children) return <pre>{children}</pre>;
      
      const codeContent = getChildContent(children);
      const trimmed = codeContent.trim();
      
      if (isMermaidContent(trimmed)) {
        const chart = extractMermaidChart(trimmed);
        return <Mermaid chart={chart} />;
      }
      
      return <CodeBlock className="text">{trimmed}</CodeBlock>;
    },
    h2: createHeadingComponent('h2', styles?.heading2),
    h3: createHeadingComponent('h3', styles?.heading3),
    h4: createHeadingComponent('h4', styles?.heading4),
    p: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      if (styles) {
        return (
          <Image 
            src={src || ''} 
            alt={alt || ''} 
            width={800} 
            height={450}
            className={styles.contentImage}
            style={{ width: 'auto', height: 'auto' }}
          />
        );
      }
      return <img src={src} alt={alt} style={{ width: 'auto', height: 'auto' }} />;
    },
  };
}