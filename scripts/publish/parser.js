const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: content };
  }

  const frontmatterBlock = match[1];
  const markdownContent = match[2];

  const metadata = {};
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      if (key === 'tags') {
        metadata[key] = value.replace(/[\[\]']/g, '').split(',').map(t => t.trim());
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content: markdownContent };
}

function extractExcerpt(content, maxLength = 200) {
  const cleanContent = content
    .replace(/^#+\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  return cleanContent.substring(0, maxLength).trim() + '...';
}

function getBlogPosts() {
  const blogDir = path.join(__dirname, '../../content/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') && !f.includes('.de.'));

  const posts = files.map(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const { metadata, content: markdown } = parseFrontmatter(content);

    return {
      slug: file.replace('.mdx', ''),
      title: metadata.title || 'Untitled',
      description: metadata.description || extractExcerpt(markdown),
      date: metadata.date,
      tags: metadata.tags || [],
      content: markdown,
      excerpt: metadata.description || extractExcerpt(markdown),
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getBlogPostBySlug(slug) {
  const blogDir = path.join(__dirname, '../../content/blog');
  const file = path.join(blogDir, `${slug}.mdx`);

  if (!fs.existsSync(file)) {
    return null;
  }

  const content = fs.readFileSync(file, 'utf-8');
  const { metadata, content: markdown } = parseFrontmatter(content);

  return {
    slug,
    title: metadata.title || 'Untitled',
    description: metadata.description || extractExcerpt(markdown),
    date: metadata.date,
    tags: metadata.tags || [],
    content: markdown,
    excerpt: metadata.description || extractExcerpt(markdown),
  };
}

function convertToMediumFormat(markdown) {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    });

  return `<p>${html}</p>`;
}

function generateTwitterThread(post) {
  const threads = [];
  const maxLength = 280;

  let thread = `🧵 ${post.title}\n\n`;
  thread += `${post.excerpt}\n\n`;
  threads.push(thread);

  const contentLines = post.content.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && 
           !trimmed.startsWith('```') && 
           !trimmed.startsWith('#') &&
           !trimmed.startsWith('---') &&
           !trimmed.startsWith('flowchart') &&
           !trimmed.startsWith('graph') &&
           !trimmed.startsWith('style ');
  });

  let currentTweet = '';

  for (const line of contentLines) {
    const cleanLine = line.replace(/^-\s+/, '').replace(/^\*\s+/, '').trim();
    if (!cleanLine) continue;
    
    if (cleanLine.includes('```')) continue;

    if (currentTweet.length + cleanLine.length + 2 <= maxLength) {
      currentTweet += cleanLine + '\n\n';
    } else {
      if (currentTweet) threads.push(currentTweet);
      currentTweet = cleanLine + '\n\n';
    }
  }

  if (currentTweet) {
    threads.push(currentTweet);
  }

  threads.push(`📖 Read more: https://modern-amusements.vercel.app/blog/${post.slug}\n#${post.tags.join(' #')}`);

  return threads;
}

module.exports = {
  parseFrontmatter,
  getBlogPosts,
  getBlogPostBySlug,
  convertToMediumFormat,
  generateTwitterThread,
};
