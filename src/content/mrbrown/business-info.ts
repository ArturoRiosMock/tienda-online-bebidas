/**
 * Información comercial centralizada de Mr. Brown.
 *
 * Editar esta página NO requiere tocar componentes. La UI del rodapé y de
 * la página "Sobre nosotros" comprueba `hasLicenseInfo()` antes de renderizar
 * el bloque de licencia, por lo que dejar los campos vacíos oculta la sección
 * sin causar errores.
 *
 * Cuando se obtenga el número y autoridad emisora de la licencia de venta
 * de bebidas alcohólicas, completar `LICENSE_NUMBER` y `LICENSE_AUTHORITY`.
 */

/** Número de licencia de venta de bebidas alcohólicas. Dejar vacío si aún no se cuenta con él. */
export const LICENSE_NUMBER = '';

/**
 * Autoridad emisora de la licencia (ej. "COFEPRIS", "Gobierno de la CDMX",
 * "Alcaldía Magdalena Contreras", "Federal", "Estatal").
 */
export const LICENSE_AUTHORITY = '';

/**
 * Leyenda obligatoria para publicidad de bebidas alcohólicas según la
 * NOM-142-SSA1/SCFI-2014 y el Reglamento de la Ley General de Salud en
 * materia de publicidad.
 */
export const LEGAL_WARNING = 'EL ABUSO EN EL CONSUMO DE ESTE PRODUCTO ES NOCIVO PARA LA SALUD';

/** Variante corta para espacios reducidos (banners pequeños, móvil). */
export const LEGAL_WARNING_SHORT = 'EVITE EL EXCESO. PROHIBIDA SU VENTA A MENORES DE 18 AÑOS';

/** ¿Hay datos de licencia válidos para mostrar? */
export const hasLicenseInfo = (): boolean =>
  LICENSE_NUMBER.trim().length > 0;

/** Texto formateado para una sola línea: "Licencia [autoridad]: [número]". */
export const formatLicense = (): string => {
  if (!hasLicenseInfo()) return '';
  const authority = LICENSE_AUTHORITY.trim();
  return authority
    ? `Licencia ${authority}: ${LICENSE_NUMBER.trim()}`
    : `Licencia: ${LICENSE_NUMBER.trim()}`;
};
