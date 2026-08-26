import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { EventDateField } from './EventDateField';
import type { EventFormData } from './eventForm.types';
import type { GraduationFieldDef } from './graduationFieldDefs';

type Rhf = ControllerRenderProps<EventFormData, keyof EventFormData>;

function GraduationInput({
  def,
  rhf,
  hasError,
}: {
  def: GraduationFieldDef;
  rhf: Rhf;
  hasError: boolean;
}) {
  if (def.kind === 'date') {
    return (
      <EventDateField
        value={rhf.value ?? ''}
        onChange={rhf.onChange}
        onBlur={rhf.onBlur}
        hasError={hasError}
      />
    );
  }
  return (
    <Input
      placeholder={def.placeholder}
      value={rhf.value ?? ''}
      onChange={rhf.onChange}
      onBlur={rhf.onBlur}
      className={hasError ? 'border-red-500' : ''}
    />
  );
}

interface GraduationFieldProps {
  def: GraduationFieldDef;
  control: Control<EventFormData>;
  error?: string;
}

export function GraduationField({ def, control, error }: GraduationFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-[#212121] font-semibold text-sm">
        {def.label}: <span className="text-red-500">*</span>
      </Label>
      <Controller
        name={def.name}
        control={control}
        rules={{ required: def.requiredMsg }}
        render={({ field }) => (
          <GraduationInput def={def} rhf={field} hasError={Boolean(error)} />
        )}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
