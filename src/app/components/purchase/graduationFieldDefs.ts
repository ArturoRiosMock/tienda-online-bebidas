import type { EventFormData } from './eventForm.types';

export type GraduationFieldDef = {
  name: keyof EventFormData;
  label: string;
  placeholder: string;
  requiredMsg: string;
  kind?: 'date';
};

export const GRADUATION_FIELDS: GraduationFieldDef[] = [
  {
    name: 'schoolName',
    label: 'Nombre de la escuela',
    placeholder: 'Ejemplo: Colegio Irlandés Femenil',
    requiredMsg: 'El nombre de la escuela es obligatorio',
  },
  {
    name: 'graduateName',
    label: 'Nombre del graduado',
    placeholder: 'Ejemplo: Juan Pérez',
    requiredMsg: 'El nombre del graduado es obligatorio',
  },
  {
    name: 'tableNumber',
    label: 'Número de mesa',
    placeholder: 'Ejemplo: 5 o N/A',
    requiredMsg: 'El número de mesa es obligatorio',
  },
  {
    name: 'eventDate',
    label: 'Fecha de la graduación',
    placeholder: 'DD/MM/AAAA',
    requiredMsg: 'La fecha de la graduación es obligatoria',
    kind: 'date',
  },
];
