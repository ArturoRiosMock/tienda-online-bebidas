import type { HeroSlide } from '@/types/homeContent';
import { HeroSlideView } from '@/app/components/hero/HeroSlideView';
import type { PreviewDevice } from '@/app/components/edicion/PreviewFrame';

/**
 * `HeroSlideView` elige la imagen con `<picture>` según el viewport real, así que en un
 * recuadro angosto seguiría mostrando la de escritorio. Forzamos ambos tamaños a la
 * imagen del dispositivo elegido para que el toggle sea fiel reutilizando el componente real.
 */
function forDevice(slide: HeroSlide, device: PreviewDevice): HeroSlide {
  const image =
    device === 'mobile'
      ? slide.imageMobile || slide.imageDesktop
      : slide.imageDesktop || slide.imageMobile;
  return { ...slide, imageMobile: image, imageDesktop: image };
}

interface HeroSlidePreviewProps {
  slide: HeroSlide;
  device: PreviewDevice;
}

export function HeroSlidePreview({ slide, device }: HeroSlidePreviewProps) {
  return (
    <div className={device === 'mobile' ? 'aspect-square' : 'h-44 sm:h-56'}>
      <HeroSlideView slide={forDevice(slide, device)} onShopNowClick={() => {}} />
    </div>
  );
}
