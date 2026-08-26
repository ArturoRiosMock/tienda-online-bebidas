import { useEffect, useRef, useState } from 'react';
import { uploadHomeImage } from '@/app/hooks/useHomeContent';
import { getEdicionCredentials } from '@/app/utils/edicionAuth';

interface Options {
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function useImageUpload({ onChange, onUploadingChange }: Options) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const uploadingRef = useRef(false);
  const notifyRef = useRef(onUploadingChange);

  notifyRef.current = onUploadingChange;

  const clearPreview = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setLocalPreview(null);
  };

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      if (uploadingRef.current) notifyRef.current?.(false);
    },
    [],
  );

  const setBusy = (next: boolean) => {
    uploadingRef.current = next;
    setUploading(next);
    notifyRef.current?.(next);
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Elige un archivo de imagen (JPG, PNG, WebP o GIF)');
      return;
    }
    setBusy(true);
    setError('');
    clearPreview();
    previewRef.current = URL.createObjectURL(file);
    setLocalPreview(previewRef.current);
    try {
      const creds = getEdicionCredentials();
      if (!creds) throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
      onChange(await uploadHomeImage(creds.username, creds.password, file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      clearPreview();
      setBusy(false);
    }
  };

  return { uploading, error, localPreview, upload, clearPreview };
}
