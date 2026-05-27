import React, { useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/shopify/types';
import {
  type CollectionFilterState,
  type CollectionSort,
  uniqueVendorLabels,
} from '@/app/utils/collectionFilters';

interface CollectionProductFiltersProps {
  products: Product[];
  value: CollectionFilterState;
  onChange: (next: CollectionFilterState) => void;
  disabled?: boolean;
}

const selectClassName =
  'w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 bg-white text-[#212121] focus:ring-2 focus:ring-[#0a3019]/20 focus:border-[#0a3019] outline-none appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat disabled:opacity-50';

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23717182' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
};

export const CollectionProductFilters: React.FC<CollectionProductFiltersProps> = ({
  products,
  value,
  onChange,
  disabled,
}) => {
  const vendors = useMemo(() => uniqueVendorLabels(products), [products]);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-[#0a3019]" aria-hidden />
        <h2 className="font-bold text-base sm:text-lg text-[#0a3019]">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#717182]">Ordenar</span>
          <select
            value={value.sort}
            onChange={(e) =>
              onChange({ ...value, sort: e.target.value as CollectionSort })
            }
            disabled={disabled}
            className={selectClassName}
            style={selectStyle}
          >
            <option value="default">Destacados</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre A–Z</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#717182]">Marca</span>
          <select
            value={value.selectedVendor}
            onChange={(e) => onChange({ ...value, selectedVendor: e.target.value })}
            disabled={disabled}
            className={`${selectClassName} border-2 border-[#0a3019]`}
            style={selectStyle}
          >
            <option value="">Todas</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2.5 self-end pb-1">
          <input
            type="checkbox"
            checked={value.discountedOnly}
            onChange={(e) => onChange({ ...value, discountedOnly: e.target.checked })}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-[#0a3019] focus:ring-[#0a3019]"
          />
          <span className="text-sm text-[#212121]">Solo productos con descuento</span>
        </label>
      </div>
    </div>
  );
};
