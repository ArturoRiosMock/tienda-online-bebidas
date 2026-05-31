import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MENU_ITEMS } from '@/data/navigation-menu';

interface CategorySidebarProps {
  activeHandle?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeHandle }) => {
  const location = useLocation();
  const isAllProducts = location.pathname === '/productos';

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    if (!activeHandle) return new Set();
    const initial = new Set<string>();
    for (const item of MENU_ITEMS) {
      if (item.type === 'accordion') {
        if (
          item.parentHandle === activeHandle ||
          item.children.some((c) => c.handle === activeHandle)
        ) {
          initial.add(item.label);
        }
      }
    }
    return initial;
  });

  const toggle = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <nav className="space-y-0.5">
      {/* Todos los productos */}
      <Link
        to="/productos"
        className={`block px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
          isAllProducts
            ? 'bg-[#0055a2] text-white'
            : 'text-[#212121] hover:bg-gray-100 hover:text-[#0055a2]'
        }`}
      >
        Todos los Productos
      </Link>

      {MENU_ITEMS.map((item) => {
        if (item.type === 'link') return null;

        const isOpen = openGroups.has(item.label);
        const isParentActive = item.parentHandle === activeHandle;

        return (
          <div key={item.label}>
            {/* Group header */}
            <div className="flex items-center">
              <Link
                to={`/categorias/${item.parentHandle}`}
                className={`flex-1 px-3 py-2 text-sm font-semibold rounded-l-lg transition-colors ${
                  isParentActive
                    ? 'bg-[#0055a2] text-white'
                    : 'text-[#212121] hover:bg-gray-100 hover:text-[#0055a2]'
                }`}
              >
                {item.label}
              </Link>
              <button
                type="button"
                onClick={() => toggle(item.label)}
                aria-label={isOpen ? 'Colapsar' : 'Expandir'}
                className={`px-2 py-2 rounded-r-lg transition-colors ${
                  isParentActive
                    ? 'bg-[#0055a2] text-white hover:bg-[#004488]'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-[#0055a2]'
                }`}
              >
                {isOpen
                  ? <ChevronUp className="w-3.5 h-3.5" />
                  : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Children */}
            {isOpen && (
              <div className="ml-3 mt-0.5 mb-1 border-l-2 border-gray-200 pl-2 space-y-0.5">
                {item.children.map((child) => {
                  const isChildActive = child.handle === activeHandle;
                  return (
                    <Link
                      key={child.handle}
                      to={`/categorias/${child.handle}`}
                      className={`block px-2 py-1.5 text-xs rounded-lg transition-colors ${
                        isChildActive
                          ? 'bg-[#e8f0fb] text-[#0055a2] font-semibold'
                          : 'text-[#717182] hover:bg-gray-100 hover:text-[#0055a2]'
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
