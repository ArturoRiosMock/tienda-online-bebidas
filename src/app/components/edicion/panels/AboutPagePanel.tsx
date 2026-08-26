import { Link } from 'react-router-dom';
import type { AboutPageContent, HomeContent } from '@/types/homeContent';
import { AboutPageContactFields } from '@/app/components/edicion/panels/AboutPageContactFields';
import { AboutPageFeatureFields } from '@/app/components/edicion/panels/AboutPageFeatureFields';
import { AboutPageHeroFields } from '@/app/components/edicion/panels/AboutPageHeroFields';
import { AboutPageStoryFields } from '@/app/components/edicion/panels/AboutPageStoryFields';

interface AboutPagePanelProps {
  content: HomeContent;
  onContent: (next: HomeContent) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export function AboutPagePanel({ content, onContent, onUploadingChange }: AboutPagePanelProps) {
  const page = content.aboutPage;

  const set = (patch: Partial<AboutPageContent>) => {
    onContent({ ...content, aboutPage: { ...page, ...patch } });
  };

  return (
    <>
      <p className="text-sm text-gray-600">
        Esta es la página{' '}
        <Link to="/page/sobre-nosotros" target="_blank" className="font-medium text-[#0c3c1f] underline">
          /page/sobre-nosotros
        </Link>
        . No es el bloque del inicio.
      </p>
      <AboutPageHeroFields page={page} set={set} />
      <AboutPageStoryFields page={page} set={set} onUploadingChange={onUploadingChange} />
      <AboutPageFeatureFields page={page} set={set} />
      <AboutPageContactFields page={page} set={set} />
    </>
  );
}
