import React from 'react';
import { useHomeContent } from '@/app/hooks/useHomeContent';
import { useDocumentMeta } from '@/app/hooks/useDocumentMeta';
import { SobreNosotrosFind } from '@/app/components/sobreNosotros/SobreNosotrosFind';
import { SobreNosotrosHero } from '@/app/components/sobreNosotros/SobreNosotrosHero';
import { SobreNosotrosHighlights } from '@/app/components/sobreNosotros/SobreNosotrosHighlights';
import { SobreNosotrosStory } from '@/app/components/sobreNosotros/SobreNosotrosStory';

export const SobreNosotrosPage: React.FC = () => {
  const { content } = useHomeContent();
  const about = content.aboutPage;

  useDocumentMeta({
    title: 'Sobre Nosotros',
    description:
      'Mr. Brown — House of Spirits desde 2018: curadores de experiencias premium en bebidas. Selección, mixología y barras para eventos en CDMX.',
    canonicalPath: '/page/sobre-nosotros',
  });

  return (
    <>
      <SobreNosotrosHero about={about} />
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <SobreNosotrosStory about={about} />
        <SobreNosotrosHighlights about={about} />
        <SobreNosotrosFind about={about} />
      </section>
    </>
  );
};
