const DEFAULT_PACK_LABEL = '1 Botella';

type VariantPackSource = {
  title?: string;
  selectedOptions?: Array<{ name: string; value: string }>;
};

/**
 * Extrae la etiqueta de empaque desde la variante de Shopify
 * (ej. "12 Botellas", "24 Latas", "1 Botella").
 */
export const getPackLabelFromVariant = (
  variant: VariantPackSource | undefined | null,
): string | undefined => {
  if (!variant) return undefined;

  const cantidadOption = variant.selectedOptions?.find(
    (option) => option.name.toLowerCase() === 'cantidad',
  );

  const fromOption = cantidadOption?.value?.trim();
  if (fromOption && fromOption !== 'Default Title') {
    return fromOption;
  }

  const fromTitle = variant.title?.trim();
  if (fromTitle && fromTitle !== 'Default Title') {
    return fromTitle;
  }

  return undefined;
};

export const resolvePackLabel = (
  variant: VariantPackSource | undefined | null,
): string => getPackLabelFromVariant(variant) ?? DEFAULT_PACK_LABEL;
