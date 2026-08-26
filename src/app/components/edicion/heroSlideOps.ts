import type { HeroSlide } from '@/types/homeContent';

export const MAX_SLIDES = 8;

export const EMPTY_SLIDE: HeroSlide = {
  imageMobile: '',
  imageDesktop: '',
  title: '',
  subtitle: '',
  badge: '',
  buttonText: '',
  buttonHref: '',
  imageOnly: true,
};

let counter = 0;

export function newId(): string {
  counter += 1;
  return `slide-${counter}`;
}

export function makeIds(count: number): string[] {
  return Array.from({ length: count }, newId);
}

type Pair = { slides: HeroSlide[]; ids: string[] };

export function addSlide({ slides, ids }: Pair): Pair {
  if (slides.length >= MAX_SLIDES) return { slides, ids };
  return { slides: [...slides, { ...EMPTY_SLIDE }], ids: [...ids, newId()] };
}

export function removeSlide({ slides, ids }: Pair, index: number): Pair {
  if (slides.length <= 1) return { slides, ids };
  return {
    slides: slides.filter((_, i) => i !== index),
    ids: ids.filter((_, i) => i !== index),
  };
}

export function moveSlide({ slides, ids }: Pair, from: number, to: number): Pair {
  if (to < 0 || to >= slides.length || from === to) return { slides, ids };
  const swap = <T,>(list: T[]) => {
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  };
  return { slides: swap(slides), ids: swap(ids) };
}

export function patchSlide(
  slides: HeroSlide[],
  index: number,
  patch: Partial<HeroSlide>,
): HeroSlide[] {
  const next = [...slides];
  if (!next[index]) return slides;
  next[index] = { ...next[index], ...patch };
  return next;
}

/** Si el otro tamaño está vacío, reutiliza la misma imagen para que el home la muestre. */
export function patchSlideImage(
  slides: HeroSlide[],
  index: number,
  field: 'imageMobile' | 'imageDesktop',
  url: string,
): HeroSlide[] {
  const slide = slides[index];
  if (!slide) return slides;
  const other = field === 'imageMobile' ? 'imageDesktop' : 'imageMobile';
  return patchSlide(slides, index, { [field]: url, [other]: slide[other] || url });
}
