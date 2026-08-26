import { FieldLabel } from '@/app/components/edicion/fields/FieldLabel';
import { TextInput } from '@/app/components/edicion/fields/TextInput';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  hint?: string;
}

export function TextField({ label, value, onChange, multiline, placeholder, hint }: TextFieldProps) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        value={value}
        onChange={onChange}
        multiline={multiline}
        placeholder={placeholder}
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
