import { useState } from 'react';
import { SectionCard } from '@/app/components/edicion/SectionCard';
import { edicionSectionItems } from '@/app/components/edicion/edicionSectionItems';
import type { HomeContent } from '@/types/homeContent';

interface EdicionSectionsProps {
  content: HomeContent;
  slideIds: string[];
  onContent: (next: HomeContent) => void;
  onSlideIds: (ids: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function EdicionSections(props: EdicionSectionsProps) {
  const [open, setOpen] = useState('hero');
  const sections = edicionSectionItems(props);

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          title={section.title}
          where={section.where}
          Icon={section.Icon}
          badge={section.badge}
          open={open === section.id}
          onToggle={() => setOpen((cur) => (cur === section.id ? '' : section.id))}
        >
          {section.node}
        </SectionCard>
      ))}
    </div>
  );
}
