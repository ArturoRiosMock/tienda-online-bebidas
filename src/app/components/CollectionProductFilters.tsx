import React, { useMemo, useState } from 'react';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';
import type { Product } from '@/shopify/types';
import {
  type CollectionFilterState,
  type CollectionSort,
  defaultCollectionFilterState,
  hasActiveFilters,
  uniqueCategories,
  uniqueVendorLabels,
} from '@/app/utils/collectionFilters';

interface CollectionProductFiltersProps {
  products: Product[];
  value: CollectionFilterState;
  onChange: (next: CollectionFilterState) => void;
  disabled?: boolean;
}

export const CollectionProductFilters: React.FC<CollectionProductFiltersProps> = ({
  products,
  value,
  onChange,
  disabled,
}) => {
  const vendors = useMemo(() => uniqueVendorLabels(products), [products]);
  const categories = useMemo(() => uniqueCategories(products), [products]);

  const toggleVendor = (label: string) => {
    const set = new Set(value.selectedVendors);
    if (set.has(label)) set.delete(label);
    else set.add(label);
    onChange({ ...value, selectedVendors: [...set] });
  };

  const toggleCategory = (cat: string) => {
    const set = new Set(value.selectedCategories);
    if (set.has(cat)) set.delete(cat);
    else set.add(cat);
    onChange({ ...value, selectedCategories: [...set] });
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(defaultCollectionFilterState());
  };

  const active = hasActiveFilters(value);
  const [panelOpen, setPanelOpen] = useState(false);

  const togglePanel = () => setPanelOpen((o) => !o);

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden">
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 hover:bg-gray-100/80 transition-colors">
        <button
          type="button"
          onClick={togglePanel}
          disabled={disabled}
          aria-expanded={panelOpen}
          aria-controls="collection-filters-panel"
          className="flex flex-1 flex-wrap items-center gap-2 min-w-0 text-left py-1 disabled:opacity-50"
        >
          <Filter className="w-4 h-4 text-[#0055a2] shrink-0" aria-hidden />
          <span className="font-semibold text-sm sm:text-base text-[#212121]">Filtros</span>
          {active && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0055a2]/15 text-[#0055a2]">
              Activos
            </span>
          )}
        </button>
        {active && (
          <button
            type="button"
            onClick={(e) => clearAll(e)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 shrink-0 text-sm text-[#0055a2] hover:text-[#003d7a] font-medium px-2 py-1.5 rounded-lg hover:bg-white/60 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
        <button
          type="button"
          onClick={togglePanel}
          disabled={disabled}
          aria-expanded={panelOpen}
          aria-controls="collection-filters-panel"
          aria-label={panelOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
          className="shrink-0 p-2 rounded-lg hover:bg-white/60 text-[#717182] disabled:opacity-50"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>

      {panelOpen && (
        <div
          id="collection-filters-panel"
          className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-gray-200"
        >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 pt-4">
        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
          <span className="text-xs font-medium text-[#717182]">Buscar</span>
          <input
            type="search"
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            disabled={disabled}
            placeholder="Nombre, descripción o marca…"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-[#212121] placeholder:text-gray-400 focus:ring-2 focus:ring-[#0055a2]/30 focus:border-[#0055a2] outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#717182]">Ordenar</span>
          <select
            value={value.sort}
            onChange={(e) =>
              onChange({ ...value, sort: e.target.value as CollectionSort })
            }
            disabled={disabled}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-[#212121] focus:ring-2 focus:ring-[#0055a2]/30 focus:border-[#0055a2] outline-none"
          >
            <option value="default">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre A–Z</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#717182]">Precio mín. (MXN)</span>
          <input
            type="text"
            inputMode="decimal"
            value={value.priceMin}
            onChange={(e) => onChange({ ...value, priceMin: e.target.value })}
            disabled={disabled}
            placeholder="0"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-[#212121] focus:ring-2 focus:ring-[#0055a2]/30 focus:border-[#0055a2] outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#717182]">Precio máx. (MXN)</span>
          <input
            type="text"
            inputMode="decimal"
            value={value.priceMax}
            onChange={(e) => onChange({ ...value, priceMax: e.target.value })}
            disabled={disabled}
            placeholder="∞"
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-[#212121] focus:ring-2 focus:ring-[#0055a2]/30 focus:border-[#0055a2] outline-none"
          />
        </label>

        <label className="flex items-center gap-2 sm:col-span-2 lg:col-span-1 self-end pb-1">
          <input
            type="checkbox"
            checked={value.inStockOnly}
            onChange={(e) => onChange({ ...value, inStockOnly: e.target.checked })}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-[#0055a2] focus:ring-[#0055a2]"
          />
          <span className="text-sm text-[#212121]">Solo disponibles</span>
        </label>
      </div>

      {(vendors.length > 1 || categories.length > 1) && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          {vendors.length > 1 && (
            <details className="rounded-lg border border-gray-200 bg-white min-w-0 open:shadow-sm open:[&_summary_svg]:rotate-180">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-[#212121] hover:bg-gray-50 rounded-lg [&::-webkit-details-marker]:hidden">
                <span className="text-[#717182] font-normal">Marca</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#717182] transition-transform duration-200" />
              </summary>
              <div className="px-2 pb-3 pt-1 max-h-40 overflow-y-auto space-y-1.5 border-t border-gray-100">
                {vendors.map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 cursor-pointer text-sm text-[#212121] hover:bg-gray-50 rounded px-1 py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={value.selectedVendors.includes(v)}
                      onChange={() => toggleVendor(v)}
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-[#0055a2] shrink-0"
                    />
                    <span className="truncate">{v}</span>
                  </label>
                ))}
              </div>
            </details>
          )}

          {categories.length > 1 && (
            <details className="rounded-lg border border-gray-200 bg-white min-w-0 open:shadow-sm open:[&_summary_svg]:rotate-180">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-[#212121] hover:bg-gray-50 rounded-lg [&::-webkit-details-marker]:hidden">
                <span className="text-[#717182] font-normal">Tipo de producto</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[#717182] transition-transform duration-200" />
              </summary>
              <div className="px-2 pb-3 pt-1 max-h-40 overflow-y-auto space-y-1.5 border-t border-gray-100">
                {categories.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 cursor-pointer text-sm text-[#212121] hover:bg-gray-50 rounded px-1 py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={value.selectedCategories.includes(c)}
                      onChange={() => toggleCategory(c)}
                      disabled={disabled}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-[#0055a2] shrink-0"
                    />
                    <span className="truncate">{c}</span>
                  </label>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
};
