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
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
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
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
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
      return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, content };
  } catch {
    return null;
  }
}

export function getProject(slug: string): Project | null {
  try {
    const filePath = path.join(contentDir, 'projects', `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      const mdPath = path.join(contentDir, 'projects', `${slug}.md`);
      if (!fs.existsSync(mdPath)) return null;
      const fileContent = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContent);
      return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    return { slug, title: data.title, description: data.description, date: data.date, tags: data.tags, liveUrl: data.liveUrl, repoUrl: data.repoUrl, content };
  } catch {
    return null;
  }
}

export function getAllTags(posts: (Post | Project)[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags);
}