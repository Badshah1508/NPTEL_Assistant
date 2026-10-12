import React from 'react';
import katex from 'katex';

interface FormulaRendererProps {
  content: string;
  className?: string;
}

export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ content, className = '' }) => {
  // Parses markdown text and renders embedded LaTeX math equations ($...$ and $$...$$)
  const renderFormattedContent = () => {
    if (!content) return null;

    // Split by display math $$...$$ first, then inline math $...$
    const displayParts = content.split(/(\$\$[\s\S]*?\$\$)/g);

    return displayParts.map((part, partIdx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
          return (
            <div
              key={partIdx}
              className="my-3 overflow-x-auto py-1 text-center font-serif text-slate-800"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <pre key={partIdx} className="my-2 bg-slate-100 p-2 text-sm">{math}</pre>;
        }
      }

      // Inline math split
      const inlineParts = part.split(/(\$[^$\n]+?\$)/g);
      return (
        <span key={partIdx}>
          {inlineParts.map((subPart, subIdx) => {
            if (subPart.startsWith('$') && subPart.endsWith('$') && subPart.length > 2) {
              const math = subPart.slice(1, -1).trim();
              try {
                const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
                return (
                  <span
                    key={subIdx}
                    className="inline-block px-1 align-baseline font-serif text-indigo-900"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (e) {
                return <code key={subIdx} className="bg-slate-100 px-1 text-xs">{math}</code>;
              }
            }
            return <span key={subIdx}>{subPart}</span>;
          })}
        </span>
      );
    });
  };

  return <div className={`prose max-w-none text-slate-700 leading-relaxed ${className}`}>{renderFormattedContent()}</div>;
};
