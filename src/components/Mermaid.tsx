'use client';

import { useEffect, useRef, useState } from 'react';
import { useMounted } from '@/hooks';

interface MermaidProps {
  chart?: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || !chart || !svgRef.current) return;

    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'JetBrains Mono, monospace',
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svg;
        }
      } catch (err) {
        setError('Failed to render diagram');
        console.error('Mermaid error:', err);
      }
    };

    renderChart();
  }, [chart, mounted]);

  if (!mounted) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '2rem 0',
        padding: '1rem',
        background: 'var(--code-bg)',
        borderRadius: '8px',
        minHeight: '100px',
        alignItems: 'center'
      }}>
        <span style={{ color: 'var(--muted)' }}>Loading diagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <pre className="mermaid-error" style={{ 
        padding: '1rem', 
        background: 'var(--code-bg)', 
        borderRadius: '8px',
        color: 'var(--accent)',
        fontSize: '0.85rem',
        overflowX: 'auto'
      }}>
        {chart}
      </pre>
    );
  }

  return (
    <div 
      ref={svgRef} 
      className="mermaid-diagram"
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '2rem 0',
        padding: '1rem',
        background: 'var(--code-bg)',
        borderRadius: '8px',
        overflowX: 'auto'
      }}
    />
  );
}