const DARK = '#111827';
const LIGHT = '#ffffff';

function expand(hex: string): string | null {
  const clean = hex.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    return clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return /^[0-9a-f]{6}$/i.test(clean) ? clean : null;
}

/** Devuelve blanco o gris oscuro según cuál contraste mejor con el fondo dado. */
export function readableTextColor(background: string | undefined): string {
  const hex = expand(background || '');
  if (!hex) return LIGHT;
  const channels = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? DARK : LIGHT;
}
