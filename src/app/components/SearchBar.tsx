import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FolderOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShopifySearch } from '@/shopify/hooks/useShopifyProducts';
import type { Product } from '@/shopify/types';
import type { CollectionItem } from '@/shopify/hooks/useShopifyCollections';

const RECENT_SEARCHES_KEY = 'searchRecentQueries';
const MAX_RECENT = 5;
const MAX_COLLECTIONS = 3;
const MAX_PRODUCTS = 6;

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (!query || !query.trim()) return;
  const trimmed = query.trim();
  const recent = getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  recent.unshift(trimmed);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const lower = query.trim().toLowerCase();
  const idx = text.toLowerCase().indexOf(lower);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-[#0c3c1f]">{text.slice(idx, idx + query.trim().length)}</strong>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

export interface SearchBarProps {
  collections: CollectionItem[];
  onClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

type ResultItem =
  | { type: 'collection'; collection: CollectionItem }
  | { type: 'product'; product: Product };

export const SearchBar = ({ collections, onClose, variant = 'desktop' }: SearchBarProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const collectionsListRef = useRef<HTMLDivElement>(null);
  const productsListRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const { results: productResults, loading } = useShopifySearch(trimmedQuery);

  const filteredCollections = useMemo(() => {
    if (trimmedQuery.length < 2) return [];
    const lower = trimmedQuery.toLowerCase();
    return collections
      .filter((c) => c.title.toLowerCase().includes(lower))
      .slice(0, MAX_COLLECTIONS);
  }, [collections, trimmedQuery]);

  const flatItems: ResultItem[] = useMemo(() => {
    const items: ResultItem[] = [];
    filteredCollections.forEach((c) => items.push({ type: 'collection', collection: c }));
    productResults.slice(0, MAX_PRODUCTS).forEach((p) => items.push({ type: 'product', product: p }));
    return items;
  }, [filteredCollections, productResults]);

  const showRecentOnly = isOpen && trimmedQuery.length < 2 && recentSearches.length > 0;
  const showResults = isOpen && trimmedQuery.length >= 2;
  const showDropdown = isOpen && (showRecentOnly || showResults);
  const hasResults = flatItems.length > 0 || showRecentOnly;
  const isEmpty = trimmedQuery.length >= 2 && !loading && flatItems.length === 0;
  const totalListLength = showRecentOnly ? recentSearches.length : flatItems.length;

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmedQuery, flatItems.length, showRecentOnly]);

  useEffect(() => {
    if (selectedIndex >= totalListLength && totalListLength > 0) {
      setSelectedIndex(totalListLength - 1);
    }
  }, [totalListLength, selectedIndex]);

  useEffect(() => {
    if (!showDropdown || totalListLength === 0) return;
    if (showRecentOnly && listRef.current) {
      const child = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      child?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    const colLen = filteredCollections.length;
    if (selectedIndex < colLen && collectionsListRef.current) {
      const child = collectionsListRef.current.children[selectedIndex] as HTMLElement | undefined;
      child?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (productsListRef.current) {
      const child = productsListRef.current.children[selectedIndex - colLen] as HTMLElement | undefined;
      child?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, showDropdown, totalListLength, filteredCollections.length, showRecentOnly]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      (e.target as HTMLInputElement).blur();
      onClose?.();
      e.preventDefault();
      return;
    }
    if (showRecentOnly) {
      const len = recentSearches.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % len);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + len) % len);
      } else if (e.key === 'Enter' && len > 0) {
        e.preventDefault();
        const selected = recentSearches[selectedIndex];
        setQuery(selected);
        setRecentSearches(getRecentSearches());
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter' && flatItems.length > 0) {
      e.preventDefault();
      const item = flatItems[selectedIndex];
      if (item.type === 'collection') {
        saveRecentSearch(trimmedQuery);
        navigate(`/categorias/${item.collection.handle}`);
      } else {
        saveRecentSearch(trimmedQuery);
        navigate(`/producto/${item.product.handle || item.product.id}`);
      }
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleSelectProduct = (product: Product) => {
    saveRecentSearch(trimmedQuery);
    navigate(`/producto/${product.handle || product.id}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleSelectCollection = (collection: CollectionItem) => {
    saveRecentSearch(trimmedQuery);
    navigate(`/categorias/${collection.handle}`);
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    setRecentSearches(getRecentSearches());
  };

  const isMobile = variant === 'mobile';

  const input = (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="¿Qué estás buscando?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-[#0c3c1f]/30 text-sm text-[#212121]"
        autoFocus={isMobile}
        aria-label="Buscar productos y colecciones"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        role="combobox"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-gray-500 hover:text-[#212121] rounded"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button type="button" className="p-1 text-[#0c3c1f]" aria-hidden>
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const dropdownContent = (
    <>
      {showRecentOnly && (
        <div className="p-2">
          <p className="text-xs font-semibold text-[#717182] uppercase tracking-wide px-2 py-1">
            Búsquedas recientes
          </p>
          <div ref={listRef} className="max-h-48 overflow-y-auto">
            {recentSearches.map((q, i) => (
              <button
                key={q}
                type="button"
                onClick={() => handleRecentClick(q)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  i === selectedIndex ? 'bg-[#0c3c1f]/10 text-[#0c3c1f]' : 'text-[#212121] hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4 text-[#717182] flex-shrink-0" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {showResults && loading && (
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && !loading && flatItems.length > 0 && (
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCollections.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#717182] uppercase tracking-wide px-3 pt-2 pb-1">
                Colecciones
              </p>
              <div ref={collectionsListRef} className="p-2 pt-0 space-y-0.5">
                {filteredCollections.map((c, i) => {
                  const idx = flatItems.findIndex(
                    (x) => x.type === 'collection' && x.collection.id === c.id
                  );
                  const selected = idx === selectedIndex;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCollection(c)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                        selected ? 'bg-[#0c3c1f]/10 text-[#0c3c1f]' : 'text-[#212121] hover:bg-gray-50'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4 text-[#0c3c1f] flex-shrink-0" />
                      <span className="flex-1">{highlightMatch(c.title, trimmedQuery)}</span>
                      <ChevronRight className="w-4 h-4 text-[#717182]" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {productResults.length > 0 && (
            <>
              <p className="text-xs font-semibold text-[#717182] uppercase tracking-wide px-3 pt-2 pb-1">
                Productos
              </p>
              <div ref={productsListRef} className="p-2 pt-0 space-y-0.5">
                {productResults.slice(0, MAX_PRODUCTS).map((p) => {
                  const idx = flatItems.findIndex(
                    (x) => x.type === 'product' && x.product.id === p.id
                  );
                  const selected = idx === selectedIndex;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 ${
                        selected ? 'bg-[#0c3c1f]/10 text-[#0c3c1f]' : 'text-[#212121] hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{highlightMatch(p.name, trimmedQuery)}</p>
                        <p className="text-[#0c3c1f] font-semibold">
                          ${p.price.toFixed(2)} MXN
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#717182] flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {showResults && !loading && isEmpty && (
        <div className="p-6 text-center text-[#717182] text-sm">
          <p className="font-medium mb-1">No se encontraron resultados</p>
          <p>Prueba con otras palabras o explora las categorías.</p>
        </div>
      )}
    </>
  );

  const dropdown = (
    <AnimatePresence>
      {showDropdown && (hasResults || loading || isEmpty) && (
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 8 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isMobile ? 8 : -8 }}
          transition={{ duration: 0.2 }}
          className={
            isMobile
              ? 'absolute top-0 left-0 right-0 bg-white border-t border-gray-200 overflow-hidden z-10 min-h-[200px] max-h-full overflow-y-auto'
              : 'absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto'
          }
        >
          {dropdownContent}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-2 border-b border-gray-200">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#212121] hover:bg-gray-100 rounded-lg"
              aria-label="Cerrar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">{input}</div>
        </div>
        <div className="flex-1 overflow-y-auto relative min-h-0">
          {dropdown}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {input}
      {dropdown}
    </div>
  );
};
