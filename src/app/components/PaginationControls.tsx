import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  /** Constrói a URL para uma página dada (ex: page => `/categorias/anis?page=${page}`). */
  buildHref: (page: number) => string;
  className?: string;
}

/**
 * Lista de páginas a renderizar, com possíveis elipses representadas por `null`.
 * Estratégia: sempre mostra 1 e totalPages; em volta de currentPage mostra ±1.
 * Insere `null` (elipse) quando há gap.
 */
function buildPageList(currentPage: number, totalPages: number): Array<number | null> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pages]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const out: Array<number | null> = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i];
    if (i > 0 && n - sorted[i - 1] > 1) out.push(null);
    out.push(n);
  }
  return out;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  buildHref,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const baseBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium transition-colors';
  const activeBtn = 'bg-[#0c3c1f] text-white border-[#0c3c1f]';
  const idleBtn = 'text-[#212121] hover:bg-gray-50 hover:text-[#0c3c1f]';
  const disabledBtn = 'text-gray-300 cursor-not-allowed';

  return (
    <nav
      role="navigation"
      aria-label="Paginación"
      className={`mt-8 flex items-center justify-center gap-1.5 ${className ?? ''}`}
    >
      {isFirst ? (
        <span aria-hidden className={`${baseBtn} ${disabledBtn} gap-1`}>
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </span>
      ) : (
        <Link
          to={buildHref(currentPage - 1)}
          className={`${baseBtn} ${idleBtn} gap-1`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Link>
      )}

      {pages.map((p, i) =>
        p === null ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden
            className="px-1 text-sm text-[#717182]"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className={`${baseBtn} ${activeBtn}`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            to={buildHref(p)}
            className={`${baseBtn} ${idleBtn}`}
            aria-label={`Ir a la página ${p}`}
          >
            {p}
          </Link>
        )
      )}

      {isLast ? (
        <span aria-hidden className={`${baseBtn} ${disabledBtn} gap-1`}>
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link
          to={buildHref(currentPage + 1)}
          className={`${baseBtn} ${idleBtn} gap-1`}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
};
