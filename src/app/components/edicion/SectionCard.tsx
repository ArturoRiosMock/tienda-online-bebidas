import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  where: string;
  Icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  where,
  Icon,
  open,
  onToggle,
  badge,
  children,
}: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c3c1f]/10 text-[#0c3c1f]">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{title}</span>
            {badge && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {badge}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500">{where}</span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="space-y-5 border-t border-gray-100 px-4 py-5">{children}</div>}
    </section>
  );
}
