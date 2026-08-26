import { useRef, useState } from 'react';
import { Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { FieldLabel } from '@/app/components/edicion/fields/FieldLabel';
import { TextInput } from '@/app/components/edicion/fields/TextInput';
import { useImageUpload } from '@/app/components/edicion/fields/useImageUpload';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageField({ label, value, onChange, hint, onUploadingChange }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { uploading, error, localPreview, upload, clearPreview } = useImageUpload({
    onChange,
    onUploadingChange,
  });

  const pick = () => fileRef.current?.click();

  const handleFile = (file: File | undefined) => {
    void upload(file).finally(() => {
      if (fileRef.current) fileRef.current.value = '';
    });
  };

  const src = localPreview || value;

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`rounded-xl border-2 border-dashed p-3 transition-colors ${
          dragOver ? 'border-[#FDB93A] bg-[#FDB93A]/10' : 'border-gray-200 bg-gray-50'
        }`}
      >
        {src ? (
          <div className="space-y-3">
            <img
              key={src}
              src={src}
              alt=""
              className="h-32 w-full rounded-lg border bg-white object-contain"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={pick}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0c3c1f] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0a3019] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => {
                  clearPreview();
                  onChange('');
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={pick}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg py-7 text-center hover:bg-white/70 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin text-[#0c3c1f]" />
            ) : (
              <Upload className="h-7 w-7 text-[#0c3c1f]" />
            )}
            <span className="text-sm font-semibold text-gray-800">
              {uploading ? 'Subiendo…' : 'Arrastra la imagen o haz clic'}
            </span>
            <span className="text-xs text-gray-500">JPG, PNG, WebP o GIF · máx. 5 MB</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => setShowUrl((v) => !v)}
        className="inline-flex items-center gap-1 text-xs text-[#0c3c1f] hover:underline"
      >
        <Link2 className="h-3.5 w-3.5" />
        {showUrl ? 'Ocultar URL' : 'Pegar una URL en su lugar'}
      </button>
      {showUrl && (
        <TextInput value={value} onChange={onChange} placeholder="https://… o /banners/…" />
      )}
    </div>
  );
}
