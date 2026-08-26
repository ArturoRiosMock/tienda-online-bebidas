import type { Control, FieldErrors } from 'react-hook-form';
import { GraduationField } from './GraduationField';
import { GRADUATION_FIELDS } from './graduationFieldDefs';
import type { EventFormData } from './eventForm.types';

interface GraduationFieldsProps {
  control: Control<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export function GraduationFields({ control, errors }: GraduationFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      {GRADUATION_FIELDS.map((def) => (
        <GraduationField
          key={def.name}
          def={def}
          control={control}
          error={errors[def.name]?.message}
        />
      ))}
    </div>
  );
}
