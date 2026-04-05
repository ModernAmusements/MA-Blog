'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  children?: string;
  className?: string;
}

export function CodeBlock({ children = '', className = '' }: CodeBlockProps) {
  const [html, setHtml] = useState('');
  const language = className || 'text';

  useEffect(() => {
    async function highlight() {
      const code = children.trim();
      try {
        const result = await codeToHtml(code, {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: 'light',
        });
        setHtml(result);
      } catch {
        setHtml(`<pre><code>${code}</code></pre>`);
      }
    }
    highlight();
  }, [children, language]);

  return (
    <div 
      className="shiki-block"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
