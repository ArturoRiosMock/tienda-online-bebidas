import React from 'react';
import { LEGAL_WARNING, LEGAL_WARNING_SHORT } from '@/content/mrbrown/business-info';

type AlcoholWarningVariant = 'hero' | 'inline' | 'badge' | 'footer';

interface AlcoholWarningProps {
  /**
   * - `hero`: barra inferior fina sobre imágenes del carrusel principal.
   * - `inline`: texto en línea para descripciones / contenidos largos.
   * - `badge`: pill compacta para esquinas de banners promocionales.
   * - `footer`: bloque tipográfico para el rodapé (ya existe "BEBA CON MODERACIÓN").
   */
  variant?: AlcoholWarningVariant;
  className?: string;
  /** Si true, usa la versión corta del aviso (NOM-142). */
  short?: boolean;
}

export const AlcoholWarning: React.FC<AlcoholWarningProps> = ({
  variant = 'inline',
  className = '',
  short = false,
}) => {
  const text = short ? LEGAL_WARNING_SHORT : LEGAL_WARNING;

  if (variant === 'hero') {
    return (
      <div
        role="note"
        aria-label="Advertencia legal sobre consumo de alcohol"
        className={`absolute inset-x-0 bottom-0 z-20 bg-black/75 text-white text-center px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase leading-tight ${className}`}
      >
        {text}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <span
        role="note"
        className={`inline-block bg-black/80 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${className}`}
      >
        {text}
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <p
        role="note"
        className={`text-[#212121] text-xs font-bold uppercase tracking-wide ${className}`}
      >
        {text}
      </p>
    );
  }

  return (
    <p
      role="note"
      className={`text-[#717182] text-xs italic ${className}`}
    >
      {text}
    </p>
  );
};
