export interface ImgProps {
  src?: string;
  alt?: string;
}

export interface MermaidProps {
  chart?: string;
  children?: React.ReactNode;
}

export interface CodeBlockProps {
  children?: string;
  className?: string;
}

export interface PreProps {
  children?: React.ReactNode;
}

export interface CodeProps {
  children?: React.ReactNode;
  className?: string;
}

export interface HeadingProps {
  children?: React.ReactNode;
}

export interface ParagraphProps {
  children?: React.ReactNode;
}

export interface MDXComponents {
  Mermaid: React.ComponentType<MermaidProps>;
  CodeBlock: React.ComponentType<CodeBlockProps>;
  code: React.ComponentType<CodeProps>;
  pre: React.ComponentType<PreProps>;
  h2: React.ComponentType<HeadingProps>;
  h3: React.ComponentType<HeadingProps>;
  h4: React.ComponentType<HeadingProps>;
  p: React.ComponentType<ParagraphProps>;
  img: React.ComponentType<ImgProps>;
}

export function getChildContent(children: React.ReactNode): string {
  if (!children) return '';
  
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  
  try {
    const child = children as React.ReactElement<{ children?: React.ReactNode }>;
    return child?.props?.children?.toString() || String(children);
  } catch {
    return String(children);
  }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}