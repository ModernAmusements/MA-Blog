import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  thumbnail?: string;
  liveUrl?: string;
  repoUrl?: string;
  content: string;
}

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir);
}

export function getBlogPosts(): Post[] {
  const files = getFiles(path.join(contentDir, 'blog'));
  const posts = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(contentDir, 'blog', file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        tags: data.tags || [],
        image: data.image,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

function getFirstImageFromContent(content: string): string | undefined {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
}

export function getProjectPosts(): Project[] {
  const files = getFiles(path.join(contentDir, 'projects'));
  const projects = files
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(contentDir, 'projects', file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        tags: data.tags || [],
        image: data.image,
        thumbnail: data.image || getFirstImageFromContent(content),
        liveUrl: data.liveUrl,
        repoUrl: data.repoUrl,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return projects;
}

export function getBlogPost(slug: string): Post | null {
  try {
    const filePath = path.join(contentDir, 'blog', `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(contentDir, 'blog', `${slug}.md`);
      if (!fs.existsSync(mdPath)) return null;
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContent);
      return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, content };
  } catch {
    return null;
  }
}

export function getBlogPostByLang(slug: string, lang: string): Post | null {
  if (lang === 'de') {
    const deSlug = slug.endsWith('.de') ? slug : `${slug}.de`;
    const filePath = path.join(contentDir, 'blog', `${deSlug}.mdx`);
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(contentDir, 'blog', `${deSlug}.md`);
      if (!fs.existsSync(mdPath)) return null;
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContent);
      return { slug: deSlug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug: deSlug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, content };
  }
  const enSlug = slug.replace('.de', '');
  return getBlogPost(enSlug);
}

export function getProject(slug: string): Project | null {
  try {
    const filePath = path.join(contentDir, 'projects', `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(contentDir, 'projects', `${slug}.md`);
      if (!fs.existsSync(mdPath)) return null;
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContent);
      return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
  } catch {
    return null;
  }
}

export function getProjectByLang(slug: string, lang: string): Project | null {
  if (lang === 'de') {
    const deSlug = slug.endsWith('.de') ? slug : `${slug}.de`;
    const filePath = path.join(contentDir, 'projects', `${deSlug}.mdx`);
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(contentDir, 'projects', `${deSlug}.md`);
      if (!fs.existsSync(mdPath)) return null;
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContent);
      return { slug: deSlug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug: deSlug, title: data.title, description: data.description, date: data.date, tags: data.tags, image: data.image, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
  }
  const enSlug = slug.replace('.de', '');
  return getProject(enSlug);
}

export function getAllTags(posts: (Post | Project)[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}

export type ContentItem = Post | Project;

export function filterByLanguage<T extends ContentItem>(items: T[], lang: string): T[] {
  return lang === 'de'
    ? items.filter(p => p.slug.endsWith('.de'))
    : items.filter(p => !p.slug.endsWith('.de'));
}

export interface HeadingItem {
  level: number;
  text: string;
  id: string;
  thema: number;
  subIndex: number;
}

export function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
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