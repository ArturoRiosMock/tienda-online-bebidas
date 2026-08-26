import { ImageField } from '@/app/components/edicion/fields/ImageField';

interface ImageFieldsProps {
  mobile: string;
  desktop: string;
  onMobile: (v: string) => void;
  onDesktop: (v: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageFields({
  mobile,
  desktop,
  onMobile,
  onDesktop,
  onUploadingChange,
}: ImageFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ImageField
        label="Imagen para celular"
        value={mobile}
        onChange={onMobile}
        onUploadingChange={onUploadingChange}
        hint="Vertical o cuadrada, ~800px de ancho"
      />
      <ImageField
        label="Imagen para computadora"
        value={desktop}
        onChange={onDesktop}
        onUploadingChange={onUploadingChange}
        hint="Horizontal, ~1600px de ancho"
      />
    </div>
  );
}
