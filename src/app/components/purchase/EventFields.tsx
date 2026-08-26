import type { Control, FieldErrors } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { GRADUATION_EVENT_TYPE, OTHER_EVENT_TYPE } from '@/config/event-types';
import { EventTypeField } from './EventTypeField';
import { EventQuoteNotice } from './EventQuoteNotice';
import { GraduationFields } from './GraduationFields';
import type { EventFormData } from './eventForm.types';

interface EventFieldsProps {
  control: Control<EventFormData>;
  errors: FieldErrors<EventFormData>;
  onQuoteNavigate?: () => void;
}

export function EventFields({ control, errors, onQuoteNavigate }: EventFieldsProps) {
  const eventType = useWatch({ control, name: 'eventType' }) ?? '';
  const isGraduation = eventType === GRADUATION_EVENT_TYPE;

  return (
    <div className="space-y-4 pt-2 pb-1">
      <EventTypeField
        control={control}
        errors={errors}
        isOther={eventType === OTHER_EVENT_TYPE}
      />
      {isGraduation && <GraduationFields control={control} errors={errors} />}
      {Boolean(eventType) && !isGraduation && (
        <EventQuoteNotice onNavigate={onQuoteNavigate} />
      )}
    </div>
  );
}
