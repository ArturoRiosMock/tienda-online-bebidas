import type { ReactNode } from 'react';
import { BadgeCheck, BookOpen, FileText, Images, Megaphone, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { HomeContent } from '@/types/homeContent';
import { HeroPanel } from '@/app/components/edicion/panels/HeroPanel';
import { RegisterBannerPanel } from '@/app/components/edicion/panels/RegisterBannerPanel';
import { AboutPanel } from '@/app/components/edicion/panels/AboutPanel';
import { AboutPagePanel } from '@/app/components/edicion/panels/AboutPagePanel';
import { BenefitsPanel } from '@/app/components/edicion/panels/BenefitsPanel';
import { CarouselsPanel } from '@/app/components/edicion/panels/CarouselsPanel';

export type EdicionSectionItem = {
  id: string;
  title: string;
  where: string;
  Icon: LucideIcon;
  badge?: string;
  node: ReactNode;
};

type Props = {
  content: HomeContent;
  slideIds: string[];
  onContent: (next: HomeContent) => void;
  onSlideIds: (ids: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
};

export function edicionSectionItems({
  content,
  slideIds,
  onContent,
  onSlideIds,
  onUploadingChange,
}: Props): EdicionSectionItem[] {
  return [
    {
      id: 'hero',
      title: 'Carrusel principal',
      where: 'Lo primero que se ve al entrar al sitio',
      Icon: Images,
      badge: `${content.hero.slides.length} banners`,
      node: (
        <HeroPanel
          content={content}
          slideIds={slideIds}
          onContent={onContent}
          onSlideIds={onSlideIds}
          onUploadingChange={onUploadingChange}
        />
      ),
    },
    {
      id: 'banner',
      title: 'Banner de eventos',
      where: 'Franja que invita a cotizar un evento',
      Icon: Megaphone,
      node: (
        <RegisterBannerPanel
          content={content}
          onContent={onContent}
          onUploadingChange={onUploadingChange}
        />
      ),
    },
    {
      id: 'about',
      title: 'Quiénes somos (inicio)',
      where: 'Bloque del home, con foto y frase',
      Icon: BookOpen,
      node: (
        <AboutPanel content={content} onContent={onContent} onUploadingChange={onUploadingChange} />
      ),
    },
    {
      id: 'about-page',
      title: 'Página Sobre nosotros',
      where: 'La URL /page/sobre-nosotros, distinta del bloque del inicio',
      Icon: FileText,
      node: (
        <AboutPagePanel
          content={content}
          onContent={onContent}
          onUploadingChange={onUploadingChange}
        />
      ),
    },
    {
      id: 'benefits',
      title: 'Por qué comprar aquí',
      where: 'Las cuatro columnas de argumentos de venta',
      Icon: BadgeCheck,
      badge: `${content.benefits.length} columnas`,
      node: <BenefitsPanel content={content} onContent={onContent} />,
    },
    {
      id: 'carousels',
      title: 'Filas de productos',
      where: 'Los títulos de las dos filas de productos',
      Icon: Type,
      node: <CarouselsPanel content={content} onContent={onContent} />,
    },
  ];
}
