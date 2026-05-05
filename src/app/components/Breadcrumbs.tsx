import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from '@/app/components/JsonLd';
import { absoluteUrl } from '@/content/mrbrown/seo-defaults';

export interface BreadcrumbItem {
  label: string;
  /** Path interno. Si se omite, el item es el actual (no clicable). */
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Migajas de pan accesibles + JSON-LD `BreadcrumbList`. El último item se
 * renderiza como `<span>` (página actual). Inyecta automáticamente el
 * structured data correspondiente para SEO.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (!items.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: absoluteUrl(item.to) } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Migajas de pan" className={className}>
        <ol className="flex items-center gap-2 text-sm text-[#717182] flex-wrap">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                {item.to && !isLast ? (
                  <Link to={item.to} className="hover:text-[#0c3c1f] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'text-[#0c3c1f] font-medium truncate max-w-[200px] sm:max-w-none' : ''}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-4 h-4" aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd schema={schema} />
    </>
  );
};
