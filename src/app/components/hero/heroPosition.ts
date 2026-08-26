import type { HeroPosition } from '@/types/homeContent';

export const DEFAULT_HERO_BG = '#0c3c1f';
export const DEFAULT_CTA_COLOR = '#0c3c1f';
export const DEFAULT_HERO_POSITION: HeroPosition = 'bottom-left';

const VERTICAL: Record<string, string> = {
  top: 'items-start pt-8',
  center: 'items-center',
  bottom: 'items-end pb-8',
};

const HORIZONTAL: Record<string, string> = {
  left: 'justify-start text-left',
  center: 'justify-center text-center',
  right: 'justify-end text-right',
};

function parts(position: HeroPosition): [string, string] {
  if (position === 'center') return ['center', 'center'];
  const [row, col] = position.split('-');
  return [row, col];
}

export function verticalClass(position: HeroPosition = DEFAULT_HERO_POSITION): string {
  return VERTICAL[parts(position)[0]] ?? VERTICAL.bottom;
}

export function horizontalClass(position: HeroPosition = DEFAULT_HERO_POSITION): string {
  return HORIZONTAL[parts(position)[1]] ?? HORIZONTAL.left;
}

export const HERO_POSITIONS: { id: HeroPosition; label: string }[] = [
  { id: 'top-left', label: 'Arriba a la izquierda' },
  { id: 'top-center', label: 'Arriba al centro' },
  { id: 'top-right', label: 'Arriba a la derecha' },
  { id: 'center-left', label: 'Al centro, a la izquierda' },
  { id: 'center', label: 'Justo al centro' },
  { id: 'center-right', label: 'Al centro, a la derecha' },
  { id: 'bottom-left', label: 'Abajo a la izquierda' },
  { id: 'bottom-center', label: 'Abajo al centro' },
  { id: 'bottom-right', label: 'Abajo a la derecha' },
];
