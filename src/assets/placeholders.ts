/**
 * URLs de placeholder para imágenes cuando se ejecuta fuera de Figma/Make.
 * Los imports "figma:asset/..." solo funcionan en el entorno de Figma.
 */
import logoSvg from '@/assets/logo-bebify.svg';

export const PLACEHOLDER_IMAGES = {
  logo: logoSvg,
  agua: 'https://placehold.co/400x400/0055a2/white?text=Agua',
  refresco: 'https://placehold.co/400x400/0055a2/white?text=Refresco',
  whisky: 'https://placehold.co/400x400/0055a2/white?text=Whisky',
} as const;
